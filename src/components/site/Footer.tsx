import { Link } from "@tanstack/react-router";
import logo from "@/assets/salasah-mark.webp";

const SOCIALS = [
  { label: "Instagram", url: "https://www.instagram.com/salasah_company/", path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm5.25-3a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" },
  { label: "TikTok", url: "https://www.tiktok.com/@salasah_company", path: "M16 3c.4 1.9 1.7 3.4 3.6 3.9V9.3c-1.4 0-2.7-.4-3.9-1v6.4c0 3.5-2.8 6.3-6.3 6.3S3 18.2 3 14.7s2.8-6.3 6.3-6.3c.3 0 .7 0 1 .1v2.5a3.8 3.8 0 1 0 2.7 3.7V3H16Z" },
  { label: "X", url: "https://x.com/salasah_company", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" },
  { label: "LinkedIn", url: "https://www.linkedin.com/company/salasah/", path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3-.03-2.97-1.8-2.97-1.8 0-2.08 1.4-2.08 2.87V21h-4V9Z" },
  { label: "YouTube", url: "https://www.youtube.com/@salasah_company", path: "M23 12s0-3.6-.46-5.32a2.78 2.78 0 0 0-1.96-1.96C18.86 4.25 12 4.25 12 4.25s-6.86 0-8.58.47A2.78 2.78 0 0 0 1.46 6.68C1 8.4 1 12 1 12s0 3.6.46 5.32c.25.95.99 1.7 1.96 1.96 1.72.47 8.58.47 8.58.47s6.86 0 8.58-.47a2.78 2.78 0 0 0 1.96-1.96C23 15.6 23 12 23 12ZM9.75 15.5v-7l6 3.5-6 3.5Z" },
  { label: "Facebook", url: "https://www.facebook.com/salasah.sa", path: "M22 12.07C22 6.5 17.52 2 12 2S2 6.5 2 12.07c0 5 3.66 9.16 8.44 9.93v-7.02H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.77 8.43-4.93 8.43-9.93Z" },
  { label: "Snapchat", url: "https://www.snapchat.com/add/salasah.sa", path: "M12 2c3.2 0 5.5 2.4 5.5 5.7 0 1.5-.1 3.4-.5 4.4.5.3 1.3.5 2 .5.4 0 .9.3.9.8 0 .9-2 1.4-3.1 1.6-.1.4.4 1.5 1.6 2.6.7.7 2 1.4 3.4 1.7.4.1.7.4.6.8-.3 1-2.1 1.5-3.7 1.7-.1.2-.3.9-.5 1.2-.2.3-.5.3-.8.3-.6 0-1.4-.3-2.7-.3-1.7 0-2.4.7-3.7.7s-2-.7-3.7-.7c-1.3 0-2.1.3-2.7.3-.3 0-.6 0-.8-.3-.2-.3-.4-1-.5-1.2-1.6-.2-3.4-.7-3.7-1.7-.1-.4.2-.7.6-.8 1.4-.3 2.7-1 3.4-1.7 1.2-1.1 1.7-2.2 1.6-2.6-1.1-.2-3.1-.7-3.1-1.6 0-.5.5-.8.9-.8.7 0 1.5-.2 2-.5-.4-1-.5-2.9-.5-4.4C6.5 4.4 8.8 2 12 2Z" },
];

export function Footer() {
  return (
    <footer className="bg-deep-2 text-cream/70 pt-16 pb-8 mt-0 border-t border-accent/10">
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-lg bg-cream flex items-center justify-center overflow-hidden">
              <img src={logo} alt="شعار سلاسة القابضة" width={36} height={36} loading="lazy" decoding="async" className="w-9 h-9 object-contain" />
            </div>
            <div className="text-cream font-bold text-lg">سلاسة <span className="text-accent">القابضة</span></div>
          </div>
          <p className="text-sm leading-loose max-w-md">
            مجموعة سعودية رائدة تجمع تحت مظلتها شركات متخصصة في المقاولات، التقنية، تأسيس الأعمال، التعليم الإلكتروني، إدارة محطات الوقود، المتاجر المتخصصة، والحلول الرقمية المبتكرة.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
                className="w-9 h-9 rounded-lg bg-cream/5 hover:bg-accent/20 hover:text-accent flex items-center justify-center transition"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-cream font-bold mb-4 text-sm tracking-wider">روابط سريعة</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/sectors" className="hover:text-accent">قطاعاتنا</Link></li>
            <li><Link to="/platforms" className="hover:text-accent">المنصات الرقمية</Link></li>
            <li><Link to="/business-setup" className="hover:text-accent">تأسيس الأعمال</Link></li>
            <li><Link to="/careers" className="hover:text-accent">التوظيف</Link></li>
            <li><Link to="/about" className="hover:text-accent">عن سلاسة</Link></li>
            <li><Link to="/contact" className="hover:text-accent">تواصل معنا</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-cream font-bold mb-4 text-sm tracking-wider">المعرفة والإعلام</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/leadership" className="hover:text-accent">فريق القيادة</Link></li>
            <li><Link to="/blog" className="hover:text-accent">المدونة</Link></li>
            <li><Link to="/press" className="hover:text-accent">المركز الإعلامي</Link></li>
            <li><Link to="/privacy" className="hover:text-accent">سياسة الخصوصية</Link></li>
            <li><Link to="/terms" className="hover:text-accent">شروط الاستخدام</Link></li>
            <li><Link to="/security" className="hover:text-accent">الأمان والحماية</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-cream font-bold mb-4 text-sm tracking-wider">تواصل</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="mailto:info@salasah.sa" className="hover:text-accent" dir="ltr">info@salasah.sa</a></li>
            <li><a href="mailto:hr@salasah.sa" className="hover:text-accent" dir="ltr">hr@salasah.sa</a></li>
            <li><a href="tel:+966559500173" className="hover:text-accent" dir="ltr">+966 55 950 0173</a></li>
            <li><a href="https://wa.me/966559500173" target="_blank" rel="noopener" className="hover:text-accent" dir="ltr">WhatsApp</a></li>
            <li className="text-cream/50">الرياض، المملكة العربية السعودية</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 mt-12 pt-6 border-t border-cream/5 flex flex-wrap items-center justify-between gap-3 text-xs text-cream/40">
        <div>© {new Date().getFullYear()} سلاسة القابضة. جميع الحقوق محفوظة.</div>
        <div>صُمم بشغف في المملكة العربية السعودية</div>
      </div>
    </footer>
  );
}
