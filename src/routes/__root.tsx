import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { useEffect } from "react";
import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ChatBot } from "@/components/site/ChatBot";
import { AutoTranslator } from "@/components/site/AutoTranslator";
import i18n, { LANGS, applyDir } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { openWhatsApp } from "@/lib/whatsapp";
import "@/lib/i18n";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-black text-primary">404</h1>
        <h2 className="mt-4 text-xl font-bold">الصفحة غير موجودة</h2>
        <p className="mt-2 text-sm text-muted-foreground">الصفحة التي تبحث عنها غير متاحة.</p>
        <Link to="/" className="mt-6 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:brightness-110">العودة للرئيسية</Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "سلاسة القابضة | Salasah Holding — أفق جديد لأعمالك" },
      { name: "description", content: "سلاسة القابضة — مجموعة سعودية رائدة في المقاولات، التقنية، تأسيس الشركات، والمنصات الرقمية المبتكرة." },
      { name: "author", content: "Salasah Holding" },
      { property: "og:title", content: "سلاسة القابضة | Salasah Holding — أفق جديد لأعمالك" },
      { property: "og:description", content: "سلاسة القابضة — مجموعة سعودية رائدة في المقاولات، التقنية، تأسيس الشركات، والمنصات الرقمية المبتكرة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0d3320" },
      { httpEquiv: "Content-Language", content: "ar" },
      { name: "twitter:title", content: "سلاسة القابضة | Salasah Holding — أفق جديد لأعمالك" },
      { name: "twitter:description", content: "سلاسة القابضة — مجموعة سعودية رائدة في المقاولات، التقنية، تأسيس الشركات، والمنصات الرقمية المبتكرة." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d48b37ad-1910-498f-a99a-27d35c0d63ac/id-preview-308c9710--3e15d76a-e188-41e8-a9d3-766d0852695d.lovable.app-1778070934097.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d48b37ad-1910-498f-a99a-27d35c0d63ac/id-preview-308c9710--3e15d76a-e188-41e8-a9d3-766d0852695d.lovable.app-1778070934097.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@300;400;500;700;800&family=Inter:wght@400;500;600;700;800;900&family=Manrope:wght@300;400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  useEffect(() => {
    // Apply current dir on mount
    applyDir(i18n.language || "ar");

    // Auto-detect language from visitor location on first visit only
    const KEY = "salasah_lang_detected";
    if (typeof window === "undefined") return;
    const hasManual = window.localStorage.getItem("salasah_lang");
    const alreadyDetected = window.localStorage.getItem(KEY);
    if (hasManual || alreadyDetected) return;

    (async () => {
      try {
        const { data } = await supabase.functions.invoke("geo-lang", { body: {} });
        const lang = data?.lang as string | undefined;
        window.localStorage.setItem(KEY, "1");
        if (lang && LANGS.some((l) => l.code === lang) && lang !== i18n.language) {
          i18n.changeLanguage(lang);
        }
      } catch {
        window.localStorage.setItem(KEY, "1");
      }
    })();
  }, []);

  return (
    <>
      <Header />
      <main className="pt-[72px]">
        <Outlet />
      </main>
      <Footer />
      <button
        type="button"
        onClick={() => openWhatsApp("مرحباً، أرغب بالتواصل مع سلاسة")}
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 z-40 hover:scale-110 transition"
        aria-label="واتساب"
        data-tr-skip
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9s-.5-.1-.7.1-.8.9-.9 1.1-.3.2-.5.1c-.3-.1-1.2-.4-2.3-1.4-.8-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5-.1-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4s-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.4 5L2 22l5.2-1.4c1.5.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
        </svg>
      </button>
      {/* <ChatBot /> */}
      <AutoTranslator />
    </>
  );
}
