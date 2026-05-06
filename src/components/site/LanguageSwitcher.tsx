import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n, { LANGS, applyDir } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { i18n: i18nInst } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = LANGS.find((l) => l.code === i18nInst.language) ?? LANGS[0];

  useEffect(() => {
    applyDir(i18nInst.language);
  }, [i18nInst.language]);

  return (
    <div className="relative">
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
          <div className="absolute top-full mt-2 right-0 z-50 bg-deep-2 border border-accent/20 rounded-xl shadow-2xl overflow-hidden p-1 grid grid-cols-2 gap-0.5 w-[360px] max-h-[70vh] overflow-y-auto">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => { i18n.changeLanguage(l.code); setOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent/10 transition ${l.code === current.code ? "bg-accent/15 text-accent font-bold" : "text-cream/85"}`}
              >
                <span className="text-base">{l.flag}</span>
                <span className="truncate">{l.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
