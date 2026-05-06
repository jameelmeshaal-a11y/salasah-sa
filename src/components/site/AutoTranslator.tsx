import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { DICT_AR_EN } from "@/lib/i18n";

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "INPUT", "TEXTAREA", "SELECT", "OPTION", "CODE", "PRE", "SVG", "PATH"]);
const ATTR_ORIG = "data-tr-orig";
const ATTR_LANG = "data-tr-lang";
const HAS_ARABIC = /[\u0600-\u06FF]/;

function isTranslatableText(node: Text): boolean {
  const v = (node.nodeValue ?? "").trim();
  if (v.length < 1) return false;
  if (!HAS_ARABIC.test(v)) return false;
  const p = node.parentElement;
  if (!p) return false;
  if (SKIP_TAGS.has(p.tagName)) return false;
  if (p.closest("[data-tr-skip]")) return false;
  if (p.isContentEditable) return false;
  return true;
}

function collectNodes(root: HTMLElement): Text[] {
  const result: Text[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (isTranslatableText(n as Text) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
  });
  let n: Node | null;
  while ((n = walker.nextNode())) result.push(n as Text);

  // Also translate placeholder, title, aria-label, alt
  root.querySelectorAll<HTMLElement>("[placeholder],[title],[aria-label],[alt]").forEach((el) => {
    // handled below via attributes pass
    void el;
  });
  return result;
}

type Pending = { text: string; setter: (v: string) => void };

function gatherAttributes(root: HTMLElement): Pending[] {
  const out: Pending[] = [];
  const attrs = ["placeholder", "title", "aria-label", "alt"];
  attrs.forEach((a) => {
    root.querySelectorAll<HTMLElement>(`[${a}]`).forEach((el) => {
      if (el.closest("[data-tr-skip]")) return;
      const orig = el.getAttribute(`data-tr-${a}`) ?? el.getAttribute(a) ?? "";
      if (!HAS_ARABIC.test(orig)) return;
      el.setAttribute(`data-tr-${a}`, orig);
      out.push({ text: orig, setter: (v) => el.setAttribute(a, v) });
    });
  });
  return out;
}

export function AutoTranslator() {
  const { i18n } = useTranslation();
  const router = useRouterState();
  const inFlight = useRef(false);
  const lastLang = useRef<string>("");
  const lastPath = useRef<string>("");

  useEffect(() => {
    const lang = i18n.language || "ar";
    const path = router.location.pathname;
    if (typeof document === "undefined") return;

    const run = async () => {
      if (inFlight.current) return;
      inFlight.current = true;
      try {
        const root = document.body;
        if (!root) return;

        // Restore originals when switching to AR or to a new language
        if (lastLang.current && lastLang.current !== lang) {
          root.querySelectorAll<HTMLElement>(`[${ATTR_ORIG}]`).forEach((el) => {
            const orig = el.getAttribute(ATTR_ORIG);
            if (orig != null) el.textContent = orig;
            el.removeAttribute(ATTR_ORIG);
            el.removeAttribute(ATTR_LANG);
          });
          ["placeholder", "title", "aria-label", "alt"].forEach((a) => {
            root.querySelectorAll<HTMLElement>(`[data-tr-${a}]`).forEach((el) => {
              const orig = el.getAttribute(`data-tr-${a}`);
              if (orig != null) el.setAttribute(a, orig);
            });
          });
        }

        if (lang === "ar") return;

        const textNodes = collectNodes(root);
        const attrPending = gatherAttributes(root);

        // Build unique work units
        const items: { text: string; targets: Array<(v: string) => void> }[] = [];
        const map = new Map<string, number>();
        const push = (text: string, setter: (v: string) => void) => {
          const key = text.trim();
          if (!key) return;
          let idx = map.get(key);
          if (idx === undefined) {
            idx = items.length;
            map.set(key, idx);
            items.push({ text: key, targets: [] });
          }
          items[idx].targets.push(setter);
        };

        textNodes.forEach((node) => {
          const orig = node.nodeValue ?? "";
          const parent = node.parentElement!;
          parent.setAttribute(ATTR_ORIG, orig);
          parent.setAttribute(ATTR_LANG, lang);
          push(orig, (v) => {
            node.nodeValue = orig.replace(orig.trim(), v);
          });
        });
        attrPending.forEach((p) => push(p.text, p.setter));

        if (!items.length) return;

        // Fast-path EN dictionary
        const remaining: { text: string; targets: Array<(v: string) => void> }[] = [];
        if (lang === "en") {
          for (const it of items) {
            const dict = DICT_AR_EN[it.text];
            if (dict) it.targets.forEach((t) => t(dict));
            else remaining.push(it);
          }
        } else {
          remaining.push(...items);
        }

        // Chunk into batches of 40
        const CHUNK = 40;
        for (let i = 0; i < remaining.length; i += CHUNK) {
          const slice = remaining.slice(i, i + CHUNK);
          try {
            const { data, error } = await supabase.functions.invoke("translate", {
              body: { texts: slice.map((s) => s.text), target: lang },
            });
            if (error || !data?.translations) continue;
            const arr: string[] = data.translations;
            slice.forEach((s, k) => {
              const tr = arr[k];
              if (tr && tr !== s.text) s.targets.forEach((t) => t(tr));
            });
          } catch {
            // ignore batch failure
          }
        }
      } finally {
        inFlight.current = false;
        lastLang.current = lang;
        lastPath.current = path;
      }
    };

    // Defer to allow routing/hydration to settle
    const id = setTimeout(run, 50);
    return () => clearTimeout(id);
  }, [i18n.language, router.location.pathname]);

  return null;
}
