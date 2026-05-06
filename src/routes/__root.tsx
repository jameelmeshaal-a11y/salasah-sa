import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ChatBot } from "@/components/site/ChatBot";

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
      { property: "og:title", content: "سلاسة القابضة | Salasah Holding" },
      { property: "og:description", content: "نبني المستقبل بكل قطاعاته — مقاولات، تقنية، تأسيس أعمال، وحلول رقمية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0d3320" },
      { httpEquiv: "Content-Language", content: "ar" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@300;400;500;700;800&display=swap" },
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
  return (
    <>
      <Header />
      <main className="pt-[72px]">
        <Outlet />
      </main>
      <Footer />
      <a
        href="https://wa.me/966559500173?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%2C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D8%A8%D8%A7%D9%84%D8%AA%D9%88%D8%A7%D8%B5%D9%84%20%D9%85%D8%B9%20%D8%B3%D9%84%D8%A7%D8%B3%D8%A9"
        target="_blank"
        rel="noopener"
        className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 z-40 hover:scale-110 transition"
        aria-label="واتساب"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9s-.5-.1-.7.1-.8.9-.9 1.1-.3.2-.5.1c-.3-.1-1.2-.4-2.3-1.4-.8-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5-.1-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4s-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.4 5L2 22l5.2-1.4c1.5.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
        </svg>
      </a>
      <ChatBot />
    </>
  );
}
