import { Link } from "@tanstack/react-router";
import logo from "@/assets/salasah-mark.webp";

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
          <div className="mt-5 flex gap-2">
            {["X","in","f","ig"].map((s) => (
              <a key={s} href="#" className="w-9 h-9 rounded-lg bg-cream/5 hover:bg-accent/20 hover:text-accent flex items-center justify-center text-sm transition">{s}</a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-cream font-bold mb-4 text-sm tracking-wider">روابط سريعة</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/sectors" className="hover:text-accent">قطاعاتنا</Link></li>
            <li><Link to="/platforms" className="hover:text-accent">المنصات الرقمية</Link></li>
            <li><Link to="/business-setup" className="hover:text-accent">تأسيس الأعمال</Link></li>
            <li><Link to="/about" className="hover:text-accent">عن سلاسة</Link></li>
            <li><Link to="/contact" className="hover:text-accent">تواصل معنا</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-cream font-bold mb-4 text-sm tracking-wider">سياسات</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="hover:text-accent">سياسة الخصوصية</Link></li>
            <li><Link to="/terms" className="hover:text-accent">شروط الاستخدام</Link></li>
            <li><Link to="/security" className="hover:text-accent">الأمان والحماية</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-cream font-bold mb-4 text-sm tracking-wider">تواصل</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="mailto:info@salasah.sa" className="hover:text-accent" dir="ltr">info@salasah.sa</a></li>
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
