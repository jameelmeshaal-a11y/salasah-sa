import { Link } from "@tanstack/react-router";
import { useState } from "react";
import logo from "@/assets/salasah-mark.webp";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Tr, useT } from "@/lib/translate";
import { useVisibility } from "@/hooks/useVisibility";

const ALL_LINKS = [
  { to: "/", label: "الرئيسية", key: "home" },
  { to: "/sectors", label: "قطاعاتنا", key: "sectors" },
  { to: "/platforms", label: "المنصات", key: "platforms" },
  { to: "/business-setup", label: "تأسيس الأعمال", key: "business-setup" },
  { to: "/leadership", label: "القيادة", key: "leadership" },
  { to: "/blog", label: "المدونة", key: "blog" },
  { to: "/press", label: "المركز الإعلامي", key: "press" },
  { to: "/about", label: "عن سلاسة", key: "about" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { hiddenIds } = useVisibility("nav");
  const links = ALL_LINKS.filter((l) => !hiddenIds.has(l.key));
  const menuLabel = useT("القائمة");
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-deep/95 backdrop-blur-xl border-b border-accent/15">
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-cream flex items-center justify-center overflow-hidden shadow-lg shadow-accent/20">
            <img src={logo} alt="شعار سلاسة القابضة" width={36} height={36} loading="eager" decoding="async" fetchPriority="high" className="w-9 h-9 object-contain" />
          </div>
          <div className="text-cream font-bold text-lg leading-tight">
            سلاسة <span className="text-accent">القابضة</span>
            <div className="text-[10px] tracking-[0.3em] text-cream/50 font-normal">SALASAH HOLDING</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-2 rounded-lg text-sm font-medium text-cream/75 hover:text-accent hover:bg-accent/10 transition"
              activeProps={{ className: "px-3 py-2 rounded-lg text-sm font-bold text-accent bg-accent/10" }}
              activeOptions={{ exact: true }}
            >
              <Tr>{l.label}</Tr>
            </Link>
          ))}
          <Link
            to="/contact"
            className="mr-2 px-5 py-2.5 rounded-lg bg-accent text-deep font-bold text-sm hover:brightness-110 transition shadow-md shadow-accent/30"
          >
            <Tr>تواصل معنا</Tr>
          </Link>
          <div className="mr-2"><LanguageSwitcher /></div>
        </nav>

        <button onClick={() => setOpen(!open)} className="lg:hidden text-cream p-2" aria-label={menuLabel}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={open ? "M6 6l12 12M6 18L18 6" : "M3 6h18M3 12h18M3 18h18"} strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-accent/15 bg-deep-2 px-5 py-4 space-y-1">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className="block px-4 py-3 rounded-lg text-cream/85 hover:bg-accent/10 hover:text-accent">
              <Tr>{l.label}</Tr>
            </Link>
          ))}
          <Link to="/contact" onClick={() => setOpen(false)}
            className="block mt-2 px-4 py-3 rounded-lg bg-accent text-deep text-center font-bold">
            <Tr>تواصل معنا</Tr>
          </Link>
          <div className="pt-3"><LanguageSwitcher /></div>
        </div>
      )}
    </header>
  );
}
