import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { DICT_AR_EN } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

const memoryCache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();

function lsKey(text: string, lang: string) {
  return `tr:${lang}:${text}`;
}

/** Synchronously look up a cached translation. Safe on SSR (returns undefined). */
function getCached(text: string, lang: string): string | undefined {
  if (lang === "ar") return text;
  if (lang === "en") return DICT_AR_EN[text] ?? text;
  const mem = memoryCache.get(`${lang}:${text}`);
  if (mem) return mem;
  if (typeof window !== "undefined") {
    try {
      const ls = window.localStorage.getItem(lsKey(text, lang));
      if (ls) {
        memoryCache.set(`${lang}:${text}`, ls);
        return ls;
      }
    } catch {}
  }
  return undefined;
}

/* ---------- Micro-batch queue: collect texts within a tick, send one RPC ---------- */
type PendingItem = { text: string; lang: string; resolve: (v: string) => void };
let pendingQueue: PendingItem[] = [];
let flushScheduled = false;

function flushQueue() {
  flushScheduled = false;
  const queue = pendingQueue;
  pendingQueue = [];
  // group by language
  const byLang = new Map<string, PendingItem[]>();
  for (const item of queue) {
    const arr = byLang.get(item.lang) ?? [];
    arr.push(item);
    byLang.set(item.lang, arr);
  }
  byLang.forEach((items, lang) => {
    const uniqueTexts = Array.from(new Set(items.map((it) => it.text)));
    supabase.functions
      .invoke("translate", { body: { texts: uniqueTexts, target: lang } })
      .then(({ data, error }) => {
        const map = new Map<string, string>();
        if (!error && data?.translations) {
          uniqueTexts.forEach((t, i) => {
            const tr = (data.translations as string[])[i] ?? t;
            map.set(t, tr);
            memoryCache.set(`${lang}:${t}`, tr);
            if (typeof window !== "undefined") {
              try { window.localStorage.setItem(lsKey(t, lang), tr); } catch {}
            }
          });
        }
        items.forEach((it) => it.resolve(map.get(it.text) ?? it.text));
      })
      .catch(() => items.forEach((it) => it.resolve(it.text)));
  });
}

function queueTranslation(text: string, lang: string): Promise<string> {
  const key = `${lang}:${text}`;
  const existing = inflight.get(key);
  if (existing) return existing;
  const p = new Promise<string>((resolve) => {
    pendingQueue.push({
      text, lang,
      resolve: (v) => { inflight.delete(key); resolve(v); },
    });
  });
  inflight.set(key, p);
  if (!flushScheduled) {
    flushScheduled = true;
    // microtask flush — coalesces all useT calls in the same render pass
    Promise.resolve().then(flushQueue);
  }
  return p;
}

async function translateBatch(texts: string[], target: string): Promise<string[]> {
  if (target === "ar") return texts;
  if (target === "en") return texts.map((t) => DICT_AR_EN[t] ?? t);
  return Promise.all(
    texts.map((t) => {
      const c = getCached(t, target);
      return c !== undefined ? Promise.resolve(c) : queueTranslation(t, target);
    }),
  );
}

/** Translates Arabic text to current language. Reads cache synchronously to avoid flicker. */
export function useT(text: string): string {
  const { i18n } = useTranslation();
  const lang = i18n.language || "ar";
  // Synchronous initial value: cache hit shows instantly, no flash of Arabic.
  // SSR always uses Arabic original to keep server/client HTML matched on first paint.
  const [val, setVal] = useState(() => {
    if (typeof window === "undefined") return text;
    return getCached(text, lang) ?? text;
  });
  // Re-sync on lang/text change synchronously when possible.
  const lastKey = useRef(`${lang}:${text}`);
  if (typeof window !== "undefined" && lastKey.current !== `${lang}:${text}`) {
    lastKey.current = `${lang}:${text}`;
    const cached = getCached(text, lang);
    if (cached !== undefined && cached !== val) {
      // schedule synchronous update via microtask to avoid setState in render
      queueMicrotask(() => setVal(cached));
    }
  }
  useEffect(() => {
    let alive = true;
    const cached = getCached(text, lang);
    if (cached !== undefined) { setVal(cached); return; }
    setVal(text); // show original while fetching
    queueTranslation(text, lang).then((v) => { if (alive) setVal(v); });
    return () => { alive = false; };
  }, [text, lang]);
  return val;
}

/** Inline component variant. */
export function Tr({ children }: { children: string }) {
  const v = useT(children);
  return <>{v}</>;
}

/** Translate many at once. */
export function useTMany(texts: string[]): string[] {
  const { i18n } = useTranslation();
  const lang = i18n.language || "ar";
  const [vals, setVals] = useState(() => {
    if (typeof window === "undefined") return texts;
    return texts.map((t) => getCached(t, lang) ?? t);
  });
  useEffect(() => {
    let alive = true;
    translateBatch(texts, lang).then((arr) => { if (alive) setVals(arr); });
    return () => { alive = false; };
  }, [texts.join("¦"), lang]);
  return vals;
}
