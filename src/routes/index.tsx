import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionHeader } from "@/components/site/Section";
import { sectors, platforms } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "سلاسة القابضة | أفق جديد لأعمالك" },
      { name: "description", content: "سلاسة القابضة — مجموعة سعودية رائدة في المقاولات، التقنية، تأسيس الشركات، والمنصات الرقمية." },
      { property: "og:title", content: "سلاسة القابضة | Salasah Holding" },
      { property: "og:description", content: "نبني المستقبل بكل قطاعاته." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-deep min-h-[92vh] flex items-center">
        <div className="absolute inset-0 bg-motif" />
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-soft/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-24 grid lg:grid-cols-2 gap-16 items-center w-full">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-bold mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
              شركة سعودية رائدة
            </div>
            <p className="text-cream/55 text-sm tracking-[0.4em] mb-4 font-light">SALASAH HOLDING</p>
            <h1 className="text-5xl md:text-7xl font-black text-cream leading-[1.1] mb-3">
              أفق جديد
            </h1>
            <h1 className="text-5xl md:text-7xl font-black text-accent leading-[1.1] mb-7">
              لأعمالـك
            </h1>
            <p className="text-cream/70 text-lg leading-relaxed max-w-xl mb-9">
              مجموعة متنوعة تضم شركات متخصصة في المقاولات والإنشاء، تقنية المعلومات، تأسيس الأعمال، التعليم الإلكتروني، والمنصات الرقمية المبتكرة لتمكين الأعمال في المملكة والخليج.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/business-setup" className="px-8 py-4 rounded-xl bg-accent text-deep font-bold hover:brightness-110 transition shadow-lg shadow-accent/30 inline-flex items-center gap-2">
                ابدأ تأسيس أعمالك
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <Link to="/sectors" className="px-8 py-4 rounded-xl border border-cream/20 text-cream font-semibold hover:bg-cream/5 transition">
                استكشف قطاعاتنا
              </Link>
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: "0.15s" }}>
            <div className="grid grid-cols-2 gap-3 mb-3">
              {[
                { n: "+15", l: "منصة ومنتج رقمي" },
                { n: "+250", l: "مشروع منجز" },
                { n: "+15", l: "سنة خبرة" },
                { n: "3", l: "دول خليجية" },
              ].map((s) => (
                <div key={s.l} className="bg-cream/5 border border-accent/15 rounded-2xl p-6 text-center hover:bg-accent/8 hover:border-accent/35 hover:-translate-y-1 transition">
                  <div className="text-4xl font-black text-accent mb-1">{s.n}</div>
                  <div className="text-cream/60 text-sm">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="bg-cream/5 border border-accent/15 rounded-2xl p-5">
              <div className="text-cream/45 text-[10px] tracking-[0.25em] uppercase text-center mb-3">أبرز منصاتنا</div>
              <div className="grid grid-cols-4 gap-2">
                {platforms.slice(0, 8).map((p) => (
                  <a key={p.name} href={p.url} target="_blank" rel="noopener"
                    className="bg-cream/5 border border-cream/10 rounded-lg py-2.5 text-center text-cream/75 text-xs font-bold hover:bg-accent/15 hover:border-accent/30 hover:text-accent transition">
                    {p.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTORS PREVIEW */}
      <Section className="bg-cream">
        <SectionHeader tag="قطاعات الأعمال" title="مجموعة متكاملة من" highlight="الحلول"
          desc="حضور قوي في ستة قطاعات استراتيجية تدعم رؤية المملكة 2030" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {sectors.map((s, i) => (
            <Link key={s.id} to="/sectors" className="group relative bg-card rounded-3xl p-8 border border-border hover:border-accent/50 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10 transition-all overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 rounded-bl-[100px] bg-accent/5 group-hover:bg-accent/10 transition" />
              <div className="relative">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 ${i % 2 ? "bg-emerald-soft/10" : "bg-accent/15"}`}>{s.icon}</div>
                <h3 className="text-xl font-extrabold mb-3">{s.name}</h3>
                <p className="text-muted-foreground text-sm leading-loose mb-5">{s.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map(t => (
                    <span key={t} className="text-[11px] font-bold bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full group-hover:bg-accent/15 group-hover:text-deep transition">{t}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* WHY US — inspired by absher */}
      <Section className="bg-deep">
        <SectionHeader light tag="لماذا سلاسة" title="لماذا تختار" highlight="سلاسة القابضة؟"
          desc="نمتلك خبرة عميقة في الأسواق الخليجية ومنظومة شاملة لتأسيس أعمالك ونموها." />
        <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {[
            { i: "🎯", t: "تأسيس مضمون", d: "نضمن لك مسار تأسيس صحيح من اليوم الأول مع متابعة مستمرة." },
            { i: "⚡", t: "السرعة والكفاءة", d: "تأسيس سريع يتيح لك بدء أعمالك خلال أيام معدودة." },
            { i: "🧠", t: "خبرة عميقة", d: "فهم دقيق للقوانين واللوائح وثقافة الأعمال السعودية والخليجية." },
            { i: "🔍", t: "شفافية كاملة", d: "نقدم جميع التكاليف والجداول الزمنية بوضوح بلا مفاجآت." },
            { i: "🤝", t: "دعم مستمر", d: "نقف بجانبك من البداية وحتى التوسع والتجديد." },
            { i: "📍", t: "معرفة السوق المحلي", d: "بيانات دقيقة عن الطلب وفرص النمو في الأسواق الخليجية." },
          ].map(c => (
            <div key={c.t} className="bg-cream/5 border border-accent/15 rounded-2xl p-7 hover:bg-accent/10 hover:border-accent/40 transition">
              <div className="text-3xl mb-4">{c.i}</div>
              <h3 className="text-cream text-lg font-extrabold mb-2">{c.t}</h3>
              <p className="text-cream/60 text-sm leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* NUMBERS */}
      <section className="bg-primary py-20 px-5 md:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { v: "+250", l: "مشروع منجز بنجاح" },
            { v: "+15", l: "منصة وتطبيق رقمي" },
            { v: "+4000", l: "عميل وثق بنا" },
            { v: "4.9★", l: "متوسط تقييم العملاء" },
          ].map(n => (
            <div key={n.l}>
              <div className="text-5xl md:text-6xl font-black text-cream mb-2">{n.v}</div>
              <div className="text-accent/90 text-sm font-medium">{n.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <Section className="bg-cream">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-deep to-deep-2 rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-emerald-soft/20 blur-3xl" />
          <div className="relative text-center">
            <h2 className="text-3xl md:text-5xl font-black text-cream leading-tight mb-5">
              جاهز لبدء <span className="text-accent">رحلتك معنا؟</span>
            </h2>
            <p className="text-cream/70 text-lg max-w-2xl mx-auto mb-8">
              تواصل مع فريقنا للحصول على استشارة مجانية وخطة مخصصة لأعمالك.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/contact" className="px-8 py-4 rounded-xl bg-accent text-deep font-bold hover:brightness-110 transition shadow-lg shadow-accent/30">
                احجز استشارة مجانية
              </Link>
              <Link to="/business-setup" className="px-8 py-4 rounded-xl border border-cream/25 text-cream font-semibold hover:bg-cream/5 transition">
                اكتشف خدماتنا
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
