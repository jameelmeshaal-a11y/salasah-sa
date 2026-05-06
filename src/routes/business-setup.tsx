import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionHeader } from "@/components/site/Section";
import { bizServices } from "@/lib/data";

export const Route = createFileRoute("/business-setup")({
  head: () => ({
    meta: [
      { title: "تأسيس وتطوير الأعمال | سلاسة القابضة" },
      { name: "description", content: "خدمات تأسيس الشركات في السعودية والإمارات، التراخيص، الاستشارات القانونية، المالية، والتطوير." },
      { property: "og:title", content: "تأسيس وتطوير الأعمال | سلاسة" },
      { property: "og:description", content: "شريكك الموثوق لتأسيس وتنمية أعمالك في الخليج." },
    ],
  }),
  component: BusinessSetupPage,
});

function BusinessSetupPage() {
  return (
    <>
      <section className="bg-deep relative overflow-hidden py-24 md:py-32 px-5 md:px-8">
        <div className="absolute inset-0 bg-motif" />
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-accent/20 blur-3xl" />
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 bg-accent/15 border border-accent/30 text-accent text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
            خدمة استراتيجية متكاملة
          </div>
          <p className="text-cream/55 text-sm tracking-[0.4em] mb-3 font-light">BUSINESS SETUP & GROWTH</p>
          <h1 className="text-4xl md:text-6xl font-black text-cream leading-tight">
            أفق جديد <span className="text-accent">لأعمالك</span>
          </h1>
          <p className="text-cream/70 text-lg mt-6 max-w-3xl mx-auto leading-relaxed">
            من تأسيس شركتك في السعودية والإمارات حتى الحوكمة والتطوير والنمو — نقدم لك مسار متكامل بخبرة عميقة في الأسواق الخليجية.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/contact" className="px-8 py-4 rounded-xl bg-accent text-deep font-bold hover:brightness-110 transition shadow-lg shadow-accent/30">
              احجز استشارة مجانية
            </Link>
            <a href="#services" className="px-8 py-4 rounded-xl border border-cream/20 text-cream font-semibold hover:bg-cream/5 transition">
              استكشف الخدمات
            </a>
          </div>

          <div className="mt-14 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { v: "🇸🇦", l: "السعودية" },
              { v: "🇦🇪", l: "الإمارات" },
              { v: "4.9★", l: "تقييم العملاء" },
            ].map(s => (
              <div key={s.l} className="bg-cream/5 border border-accent/20 rounded-xl p-4">
                <div className="text-3xl mb-1">{s.v}</div>
                <div className="text-cream/60 text-xs font-medium">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <Section className="bg-cream" >
        <div id="services" />
        <SectionHeader tag="خدماتنا" title="عصارة خبرتنا في" highlight="الأسواق الخليجية"
          desc="منظومة شاملة من الخدمات تغطي كل ما تحتاجه أعمالك من اليوم الأول وحتى مرحلة التوسع." />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {bizServices.map((s, i) => (
            <div key={s.title} className="group bg-card rounded-3xl p-7 border border-border hover:border-accent/50 hover:shadow-2xl hover:shadow-primary/10 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-bl-[80px] bg-accent/8 group-hover:bg-accent/15 transition" />
              <div className="relative">
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${i % 2 ? "bg-accent/15" : "bg-emerald-soft/15"}`}>{s.icon}</div>
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase text-accent bg-accent/10 px-3 py-1 rounded-full">{s.category}</span>
                </div>
                <h3 className="text-lg font-extrabold mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm mb-5 leading-loose">{s.desc}</p>
                <ul className="space-y-2.5">
                  {s.items.map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm">
                      <svg className="text-accent mt-1 flex-shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span className="text-foreground/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* PROCESS */}
      <Section className="bg-deep">
        <SectionHeader light tag="رحلة التأسيس" title="كيف نعمل" highlight="معك؟"
          desc="مسار واضح وشفاف من أول لقاء حتى انطلاق أعمالك." />
        <div className="grid md:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {[
            { n: "01", t: "استشارة مجانية", d: "نستمع لاحتياجاتك ونحدد المسار الأنسب لتأسيس أعمالك." },
            { n: "02", t: "خطة مخصصة", d: "نضع خطة تفصيلية بالتكاليف والجدول الزمني الكامل." },
            { n: "03", t: "التنفيذ", d: "نتولى جميع الإجراءات الحكومية والقانونية نيابة عنك." },
            { n: "04", t: "متابعة ودعم", d: "نقف بجانبك بعد التأسيس لضمان نمو مستدام." },
          ].map((p) => (
            <div key={p.n} className="relative bg-cream/5 border border-accent/15 rounded-2xl p-7 hover:border-accent/40 transition">
              <div className="text-5xl font-black text-accent/30 mb-3">{p.n}</div>
              <h3 className="text-cream text-lg font-extrabold mb-2">{p.t}</h3>
              <p className="text-cream/60 text-sm leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-cream">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-deep to-deep-2 rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-accent/15 blur-3xl" />
          <div className="relative text-center">
            <h2 className="text-3xl md:text-5xl font-black text-cream mb-5">
              ابدأ <span className="text-accent">رحلتك التجارية</span> اليوم
            </h2>
            <p className="text-cream/70 text-lg max-w-2xl mx-auto mb-8">
              استشارة مجانية مع مستشارينا الخبراء لرسم خارطة طريقك في السوق السعودي والخليجي.
            </p>
            <Link to="/contact" className="inline-block px-10 py-4 rounded-xl bg-accent text-deep font-bold hover:brightness-110 transition shadow-lg shadow-accent/30">
              احجز اجتماعك الآن
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
