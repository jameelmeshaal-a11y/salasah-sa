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

// In-memory translation cache keyed by `${lang}:${arabicText}`
const cache = new Map<string, string>();
// Track text fragments currently being requested to avoid duplicates
const pending = new Set<string>();

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

/** Walk DOM and apply known cached translations. Returns list of unknown Arabic texts. */
function applyAndCollect(root: HTMLElement, lang: string): string[] {
  const unknown = new Set<string>();
  if (lang === "ar") return [];

  // Text nodes
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n: Node | null;
  while ((n = walker.nextNode())) {
    const text = n as Text;
    const raw = text.nodeValue ?? "";
    const trimmed = raw.trim();
    if (!trimmed || !HAS_ARABIC.test(trimmed)) continue;
    if (shouldSkip(text.parentElement)) continue;
    const key = `${lang}:${trimmed}`;
    const tr = cache.get(key);
    if (tr && tr !== trimmed) {
      const newVal = raw.replace(trimmed, tr);
      if (text.nodeValue !== newVal) text.nodeValue = newVal;
    } else if (!tr) {
      unknown.add(trimmed);
    }
  }

  // Attributes
  for (const attr of ATTRS) {
    root.querySelectorAll<HTMLElement>(`[${attr}]`).forEach((el) => {
      if (shouldSkip(el)) return;
      const raw = el.getAttribute(attr) ?? "";
      const trimmed = raw.trim();
      if (!trimmed || !HAS_ARABIC.test(trimmed)) return;
      const key = `${lang}:${trimmed}`;
      const tr = cache.get(key);
      if (tr && tr !== trimmed) {
        if (raw !== tr) el.setAttribute(attr, tr);
      } else if (!tr) {
        unknown.add(trimmed);
      }
    });
  }

  return Array.from(unknown);
}

/** Hydrate cache for a language with localStorage values for these keys. */
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
  } catch {
    // ignore
  }
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

      // Apply known + collect unknown
      const unknown = applyAndCollect(root, lang);
      if (lang === "ar" || !unknown.length) return;

      // Hydrate from local sources first
      hydrateLocalCache(lang, unknown);
      const stillUnknown = unknown.filter(
        (t) => !cache.has(`${lang}:${t}`) && !pending.has(`${lang}:${t}`),
      );
      // Re-apply with newly hydrated cache
      if (unknown.length !== stillUnknown.length) applyAndCollect(root, lang);
      if (!stillUnknown.length) return;

      // Mark pending
      stillUnknown.forEach((t) => pending.add(`${lang}:${t}`));

      // Chunk and fetch
      const CHUNK = 30;
      for (let i = 0; i < stillUnknown.length; i += CHUNK) {
        const slice = stillUnknown.slice(i, i + CHUNK);
        await fetchBatch(slice, lang);
        if (cancelled) return;
        // Apply after each chunk for progressive update
        applyAndCollect(root, lang);
      }
      stillUnknown.forEach((t) => pending.delete(`${lang}:${t}`));
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      setTimeout(tick, 80);
    };

    // Initial run
    schedule();

    // React to DOM changes
    observer = new MutationObserver(() => schedule());
    observer.observe(document.body, {
      childList: true, subtree: true, characterData: true,
      attributes: true, attributeFilter: [...ATTRS],
    });

    // Also re-run on route navigations (popstate / pushState)
    const onNav = () => schedule();
    window.addEventListener("popstate", onNav);

    return () => {
      cancelled = true;
      observer?.disconnect();
      window.removeEventListener("popstate", onNav);
    };
  }, [i18n.language]);

  return null;
}
