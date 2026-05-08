import { useEffect, useReducer, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n, { LANGS, applyDir } from "@/lib/i18n";
import { AUTO_TR_KEY, type AutoTranslateMode } from "./AutoTranslator";

export function LanguageSwitcher() {
  const { i18n: i18nInst } = useTranslation();
  const [open, setOpen] = useState(false);
  // Avoid SSR/CSR mismatch — render the default flag until mounted on the client.
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<AutoTranslateMode>("auto");
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    setMounted(true);
    applyDir(i18nInst.language);
    const v = window.localStorage.getItem(AUTO_TR_KEY);
    if (v === "off" || v === "interaction") setMode(v);
  }, [i18nInst.language]);

  const current = mounted
    ? (LANGS.find((l) => l.code === i18nInst.language) ?? LANGS[0])
    : LANGS[0];

  const setAutoMode = (m: AutoTranslateMode) => {
    setMode(m);
    try { window.localStorage.setItem(AUTO_TR_KEY, m); } catch {}
    // Reload so new mode (and untranslated/translated DOM) takes effect cleanly.
    window.location.reload();
  };

  const modeLabels: Record<AutoTranslateMode, string> = {
    auto: "تلقائية",
    interaction: "عند التفاعل",
    off: "إيقاف",
  };

  return (
    <div className="relative" data-tr-skip>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-cream/85 hover:text-accent hover:bg-accent/10 transition border border-accent/20"
        aria-label="Language"
      >
        <span className="text-base">{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-2 right-0 z-50 bg-deep-2 border border-accent/20 rounded-xl shadow-2xl overflow-hidden p-2 w-[380px] max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-0.5">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    if (l.code !== current.code) {
                      i18n.changeLanguage(l.code);
                      applyDir(l.code);
                    }
                    setOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent/10 transition ${l.code === current.code ? "bg-accent/15 text-accent font-bold" : "text-cream/85"}`}
                >
                  <span className="text-base">{l.flag}</span>
                  <span className="truncate">{l.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 pt-2 border-t border-accent/15">
              <div className="text-[11px] text-cream/55 px-2 mb-1.5">الترجمة التلقائية</div>
              <div className="grid grid-cols-3 gap-1">
                {(["auto", "interaction", "off"] as AutoTranslateMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setAutoMode(m)}
                    className={`px-2 py-1.5 text-xs rounded-md transition ${mode === m ? "bg-accent text-deep font-bold" : "bg-accent/10 text-cream/80 hover:bg-accent/20"}`}
                  >
                    {modeLabels[m]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
