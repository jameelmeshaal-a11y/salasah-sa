import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { DICT_AR_EN } from "@/lib/i18n";

const SKIP_TAGS = new Set([
  "SCRIPT", "STYLE", "NOSCRIPT", "INPUT", "TEXTAREA", "SELECT", "OPTION",
  "CODE", "PRE", "SVG", "PATH",
]);
const HAS_ARABIC = /[\u0600-\u06FF]/;
const ATTRS = ["placeholder", "title", "aria-label", "alt"] as const;

// Translation cache: `${lang}:${arabicOriginal}` -> translated
const cache = new Map<string, string>();
const pending = new Set<string>();

// Remember the ORIGINAL Arabic for each text node / attribute so we can
// re-translate when the language changes (otherwise, once translated to
// English the text loses its Arabic and is never re-translated).
const originalText = new WeakMap<Text, string>();
const originalAttr = new WeakMap<Element, Map<string, string>>();

function lsGet(lang: string, text: string): string | null {
  if (typeof window === "undefined") return null;
  try { return window.localStorage.getItem(`tr:${lang}:${text}`); } catch { return null; }
}
function lsSet(lang: string, text: string, val: string) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(`tr:${lang}:${text}`, val); } catch { /* quota */ }
}

function shouldSkip(el: Element | null): boolean {
  if (!el) return true;
  if (SKIP_TAGS.has(el.tagName)) return true;
  if ((el as HTMLElement).isContentEditable) return true;
  if (el.closest("[data-tr-skip]")) return true;
  return false;
}

let isWriting = false;

function applyAndCollect(root: HTMLElement, lang: string): string[] {
  const unknown = new Set<string>();

  isWriting = true;
  try {
    // Text nodes
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n: Node | null;
    while ((n = walker.nextNode())) {
      const text = n as Text;
      const parent = text.parentElement;
      if (shouldSkip(parent)) continue;

      // Capture original on first encounter (must contain Arabic to be relevant)
      let original = originalText.get(text);
      if (!original) {
        const raw = text.nodeValue ?? "";
        const trimmed = raw.trim();
        if (!trimmed || !HAS_ARABIC.test(trimmed)) continue;
        original = trimmed;
        originalText.set(text, original);
      }

      if (lang === "ar") {
        if (text.nodeValue !== original) text.nodeValue = original;
        continue;
      }

      const key = `${lang}:${original}`;
      const tr = cache.get(key);
      if (tr) {
        if (text.nodeValue !== tr) text.nodeValue = tr;
      } else {
        unknown.add(original);
      }
    }

    // Attributes
    for (const attr of ATTRS) {
      root.querySelectorAll<HTMLElement>(`[${attr}]`).forEach((el) => {
        if (shouldSkip(el)) return;
        let map = originalAttr.get(el);
        if (!map) {
          map = new Map();
          originalAttr.set(el, map);
        }
        let original = map.get(attr);
        if (!original) {
          const raw = el.getAttribute(attr) ?? "";
          const trimmed = raw.trim();
          if (!trimmed || !HAS_ARABIC.test(trimmed)) return;
          original = trimmed;
          map.set(attr, original);
        }
        if (lang === "ar") {
          if (el.getAttribute(attr) !== original) el.setAttribute(attr, original);
          return;
        }
        const tr = cache.get(`${lang}:${original}`);
        if (tr) {
          if (el.getAttribute(attr) !== tr) el.setAttribute(attr, tr);
        } else {
          unknown.add(original);
        }
      });
    }
  } finally {
    isWriting = false;
  }

  return Array.from(unknown);
}

function hydrateLocalCache(lang: string, texts: string[]) {
  for (const t of texts) {
    const key = `${lang}:${t}`;
    if (cache.has(key)) continue;
    if (lang === "en") {
      const dict = DICT_AR_EN[t];
      if (dict) { cache.set(key, dict); continue; }
    }
    const ls = lsGet(lang, t);
    if (ls) cache.set(key, ls);
  }
}

async function fetchBatch(texts: string[], lang: string) {
  if (!texts.length) return;
  try {
    const { data, error } = await supabase.functions.invoke("translate", {
      body: { texts, target: lang },
    });
    if (error || !data?.translations) return;
    const arr: string[] = data.translations;
    texts.forEach((t, i) => {
      const tr = arr[i];
      if (tr && typeof tr === "string") {
        cache.set(`${lang}:${t}`, tr);
        lsSet(lang, t, tr);
      }
    });
  } catch { /* ignore */ }
}

export function AutoTranslator() {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (typeof document === "undefined") return;
    const lang = i18n.language || "ar";

    let cancelled = false;
    let scheduled = false;
    let observer: MutationObserver | null = null;

    const tick = async () => {
      scheduled = false;
      if (cancelled) return;
      const root = document.body;
      if (!root) return;

      const unknown = applyAndCollect(root, lang);
      if (lang === "ar" || !unknown.length) return;

      hydrateLocalCache(lang, unknown);
      const stillUnknown = unknown.filter(
        (t) => !cache.has(`${lang}:${t}`) && !pending.has(`${lang}:${t}`),
      );
      if (unknown.length !== stillUnknown.length) applyAndCollect(root, lang);
      if (!stillUnknown.length) return;

      stillUnknown.forEach((t) => pending.add(`${lang}:${t}`));

      const CHUNK = 50;
      for (let i = 0; i < stillUnknown.length; i += CHUNK) {
        const slice = stillUnknown.slice(i, i + CHUNK);
        await fetchBatch(slice, lang);
        if (cancelled) return;
        applyAndCollect(root, lang);
      }
      stillUnknown.forEach((t) => pending.delete(`${lang}:${t}`));
    };

    const schedule = () => {
      if (scheduled || isWriting) return;
      scheduled = true;
      // Use rIC when available, else longer timeout to avoid jank
      const ric = (window as any).requestIdleCallback as undefined | ((cb: () => void, opts?: { timeout: number }) => number);
      if (ric) ric(() => tick(), { timeout: 400 });
      else setTimeout(tick, 200);
    };

    schedule();

    observer = new MutationObserver((mutations) => {
      if (isWriting) return;
      // Ignore if every mutation was a characterData/attribute on a node we own
      let interesting = false;
      for (const m of mutations) {
        if (m.type === "childList" && (m.addedNodes.length || m.removedNodes.length)) {
          interesting = true; break;
        }
        if (m.type === "characterData") {
          // Only interesting if the new value contains Arabic and we don't track it yet
          const tn = m.target as Text;
          if (!originalText.has(tn) && HAS_ARABIC.test(tn.nodeValue ?? "")) {
            interesting = true; break;
          }
        }
      }
      if (interesting) schedule();
    });
    observer.observe(document.body, {
      childList: true, subtree: true, characterData: true,
    });

    // Patch history methods so SPA navigations re-trigger translation
    const origPush = window.history.pushState;
    const origReplace = window.history.replaceState;
    const fireNav = () => schedule();
    window.history.pushState = function (...args) {
      const r = origPush.apply(this, args as any);
      setTimeout(fireNav, 50);
      return r;
    };
    window.history.replaceState = function (...args) {
      const r = origReplace.apply(this, args as any);
      setTimeout(fireNav, 50);
      return r;
    };
    window.addEventListener("popstate", fireNav);

    return () => {
      cancelled = true;
      observer?.disconnect();
      window.history.pushState = origPush;
      window.history.replaceState = origReplace;
      window.removeEventListener("popstate", fireNav);
    };
  }, [i18n.language]);

  return null;
}
