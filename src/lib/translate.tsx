import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DICT_AR_EN } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";

const memoryCache = new Map<string, string>();

function lsKey(text: string, lang: string) {
  return `tr:${lang}:${text}`;
}

async function translateBatch(texts: string[], target: string): Promise<string[]> {
  if (target === "ar") return texts;
  if (target === "en") return texts.map((t) => DICT_AR_EN[t] ?? t);
  // check caches
  const out = new Array(texts.length);
  const need: { i: number; text: string }[] = [];
  texts.forEach((t, i) => {
    const mem = memoryCache.get(`${target}:${t}`);
    if (mem) { out[i] = mem; return; }
    if (typeof window !== "undefined") {
      const ls = window.localStorage.getItem(lsKey(t, target));
      if (ls) { memoryCache.set(`${target}:${t}`, ls); out[i] = ls; return; }
    }
    need.push({ i, text: t });
  });
  if (need.length) {
    try {
      const { data, error } = await supabase.functions.invoke("translate", {
        body: { texts: need.map((n) => n.text), target },
      });
      if (error || !data?.translations) {
        need.forEach((n) => (out[n.i] = n.text));
      } else {
        const arr: string[] = data.translations;
        need.forEach((n, k) => {
          const tr = arr[k] ?? n.text;
          memoryCache.set(`${target}:${n.text}`, tr);
          if (typeof window !== "undefined") {
            try { window.localStorage.setItem(lsKey(n.text, target), tr); } catch {}
          }
          out[n.i] = tr;
        });
      }
    } catch {
      need.forEach((n) => (out[n.i] = n.text));
    }
  }
  return out;
}

/** Translates Arabic text to current language (sync from cache, async fetch). */
export function useT(text: string): string {
  const { i18n } = useTranslation();
  const lang = i18n.language || "ar";
  const initial = (() => {
    if (lang === "ar") return text;
    if (lang === "en") return DICT_AR_EN[text] ?? text;
    if (typeof window === "undefined") return text;
    const mem = memoryCache.get(`${lang}:${text}`);
    if (mem) return mem;
    const ls = window.localStorage.getItem(lsKey(text, lang));
    return ls ?? text;
  })();
  const [val, setVal] = useState(initial);
  useEffect(() => {
    let alive = true;
    if (lang === "ar") { setVal(text); return; }
    if (lang === "en") { setVal(DICT_AR_EN[text] ?? text); return; }
    translateBatch([text], lang).then((arr) => { if (alive) setVal(arr[0]); });
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
  const initial = texts.map((t) => {
    if (lang === "ar") return t;
    if (lang === "en") return DICT_AR_EN[t] ?? t;
    if (typeof window === "undefined") return t;
    const mem = memoryCache.get(`${lang}:${t}`);
    if (mem) return mem;
    const ls = window.localStorage.getItem(lsKey(t, lang));
    return ls ?? t;
  });
  const [vals, setVals] = useState(initial);
  useEffect(() => {
    let alive = true;
    translateBatch(texts, lang).then((arr) => { if (alive) setVals(arr); });
    return () => { alive = false; };
  }, [texts.join("¦"), lang]);
  return vals;
}
