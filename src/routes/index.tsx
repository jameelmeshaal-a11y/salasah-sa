import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Section, SectionHeader } from "@/components/site/Section";
import { sectors, platforms, bizServices } from "@/lib/data";
import { useVisibility } from "@/hooks/useVisibility";

import { CEOBooking } from "@/components/site/CEOBooking";
import logo from "@/assets/salasah-logo.jpg";
import heroVideo from "@/assets/hero-towers.mp4.asset.json";
import saudiVideo from "@/assets/hero-saudi.mp4?url";

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
  const sequence = [saudiVideo, heroVideo.url];
  const [phase, setPhase] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { hiddenIds: hiddenPlatforms } = useVisibility("platform");
  const { hiddenIds: hiddenSectors } = useVisibility("sector");
  const visiblePlatforms = platforms.filter((p) => !hiddenPlatforms.has(p.name));
  const visibleSectors = sectors.filter((s) => !hiddenSectors.has(s.id));

  return (
    <>
      <section className="relative overflow-hidden bg-deep min-h-[100vh] flex items-center">
        <video
          ref={videoRef}
          key={phase}
          autoPlay muted playsInline
          onEnded={() => setPhase((p) => (p + 1) % sequence.length)}
          className="absolute inset-0 w-full h-full object-cover opacity-55 transition-opacity duration-1000"
          src={sequence[phase]}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-deep/95 via-deep/70 to-deep/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-transparent to-deep/40" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        
        

        <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="animate-blur-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-dark text-accent text-xs font-bold mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
              شركة سعودية رائدة
            </div>
            <p className="text-cream/55 text-sm tracking-[0.4em] mb-4 font-light">SALASAH HOLDING</p>
            <h1 className="text-5xl md:text-7xl font-black text-cream leading-[1.05] mb-3 drop-shadow-2xl">
              أفق جديد
            </h1>
            <h1 className="text-5xl md:text-7xl font-black text-accent leading-[1.05] mb-7 drop-shadow-2xl">
              لأعمالـك
            </h1>
            <p className="text-cream/85 text-lg leading-relaxed max-w-xl mb-9">
              من أبراج الرياض إلى ناطحات الإمارات — سلاسة القابضة تجمع المقاولات، التقنية، تأسيس الأعمال، والمنصات الرقمية تحت مظلة واحدة لتمكين أعمالك في الخليج.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/business-setup" className="px-8 py-4 rounded-xl bg-accent text-deep font-bold hover:brightness-110 transition shadow-2xl shadow-accent/40 inline-flex items-center gap-2 hover-scale">
                ابدأ تأسيس أعمالك
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
              <Link to="/sectors" className="px-8 py-4 rounded-xl glass text-cream font-semibold hover:bg-cream/10 transition">
                استكشف قطاعاتنا
              </Link>
            </div>
          </div>

          <div className="animate-blur-in" style={{ animationDelay: "0.15s" }}>
            <div className="relative rounded-3xl">
              <div className="grid grid-cols-2 gap-3 relative z-10">
                {[
                  { n: "+15", l: "منصة ومنتج رقمي" },
                  { n: "+250", l: "مشروع منجز" },
                  { n: "+15", l: "سنة خبرة" },
                  { n: "3", l: "دول خليجية" },
                ].map((s) => (
                  <div key={s.l} className="glass-dark rounded-2xl p-6 text-center hover:bg-accent/10 hover:-translate-y-1 transition">
                    <div className="text-4xl font-black text-accent mb-1">{s.n}</div>
                    <div className="text-cream/75 text-sm">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="glass-dark rounded-2xl p-5 mt-3 relative z-10">
                <div className="text-cream/55 text-[10px] tracking-[0.25em] uppercase text-center mb-3">أبرز منصاتنا</div>
                <div className="grid grid-cols-4 gap-2">
                  {visiblePlatforms.slice(0, 8).map((p) => (
                    <a key={p.name} href={p.url} target="_blank" rel="noopener"
                      className="bg-cream/5 border border-cream/10 rounded-lg py-2.5 text-center text-cream/85 text-xs font-bold hover:bg-accent/20 hover:text-accent transition">
                      {p.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px refract" />
      </section>

      {/* SECTORS PREVIEW */}
      <Section className="bg-cream">
        <SectionHeader tag="قطاعات الأعمال" title="قطاعات" highlight="تبني المستقبل"
          desc="حضور قوي في قطاعات استراتيجية متعددة تدعم رؤية المملكة 2030" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {visibleSectors.map((s, i) => (
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
            { v: "+40", l: "شركة تأسست" },
            { v: "4.9★", l: "متوسط تقييم العملاء" },
          ].map(n => (
            <div key={n.l}>
              <div className="text-5xl md:text-6xl font-black text-cream mb-2">{n.v}</div>
              <div className="text-accent/90 text-sm font-medium">{n.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CEO BOOKING — middle prominence */}
      <CEOBooking />

      {/* BUSINESS SETUP HIGHLIGHTS */}
      <Section className="bg-cream">
        <SectionHeader tag="تأسيس وتطوير الأعمال" title="منظومة شاملة" highlight="لتأسيس شركتك"
          desc="من السجل التجاري حتى التشغيل والتوسع — نقدم +14 خدمة متكاملة في السعودية والإمارات." />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
          {bizServices.slice(0, 6).map((s) => (
            <Link to="/business-setup" key={s.title} className="group bg-card rounded-2xl p-6 border border-border hover:border-accent/50 hover:-translate-y-1 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center text-2xl">{s.icon}</div>
                <span className="text-[10px] font-black tracking-[0.2em] uppercase text-accent">{s.category}</span>
              </div>
              <h3 className="font-extrabold mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-loose">{s.desc}</p>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/business-setup" className="inline-block px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition">
            استكشف جميع الخدمات
          </Link>
        </div>
      </Section>

      {/* PROCESS */}
      <Section className="bg-secondary">
        <SectionHeader tag="كيف نعمل" title="رحلتك معنا" highlight="بأربع خطوات" />
        <div className="grid md:grid-cols-4 gap-5 max-w-6xl mx-auto">
          {[
            { n: "01", t: "استشارة مجانية", d: "نستمع لاحتياجاتك ونحدد المسار الأمثل." },
            { n: "02", t: "خطة مخصصة", d: "خطة تفصيلية بالتكاليف والجدول الزمني." },
            { n: "03", t: "التنفيذ", d: "نتولى جميع الإجراءات نيابة عنك." },
            { n: "04", t: "متابعة ودعم", d: "ندعمك بعد التأسيس لنمو مستدام." },
          ].map(p => (
            <div key={p.n} className="bg-card rounded-2xl p-7 border border-border hover:border-accent/40 transition">
              <div className="text-5xl font-black text-accent/30 mb-3">{p.n}</div>
              <h3 className="text-lg font-extrabold mb-2">{p.t}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* PLATFORMS */}
      <Section className="bg-cream">
        <SectionHeader tag="منصاتنا الرقمية" title="+12 منصة" highlight="تخدم آلاف العملاء"
          desc="منظومة منصات رقمية مبتكرة تغطي قطاعات الصحة، العقار، التجارة، والخدمات." />
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {visiblePlatforms.map(p => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener"
              className="group bg-card border border-border rounded-2xl p-5 hover:border-accent/50 hover:-translate-y-1 transition-all">
              <div className="text-3xl mb-3">{p.icon}</div>
              <div className="font-extrabold mb-1">{p.ar}</div>
              <div className="text-[10px] tracking-[0.2em] text-accent uppercase font-bold mb-2">{p.name}</div>
              <p className="text-muted-foreground text-xs leading-relaxed">{p.desc}</p>
            </a>
          ))}
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section className="bg-deep">
        <SectionHeader light tag="آراء عملائنا" title="ثقة" highlight="تتحدث عن نفسها" />
        <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {[
            { n: "م. ياسر أحمد", r: "رائد أعمال", q: "تجربة احترافية من أول لقاء حتى استلام السجل التجاري. فريق سلاسة ساعدني أتجنب أخطاء كثيرة." },
            { n: "ألطاف محمد", r: "مديرة شركة تقنية", q: "السرعة والشفافية في تأسيس الشركة كانت مذهلة. أنصح أي مستثمر يبدأ مع سلاسة." },
            { n: "م. زيشان خالد", r: "مستثمر باكستاني", q: "الدعم بعد التأسيس هو الفرق الحقيقي. سلاسة شريك حقيقي وليس مجرد مزود خدمة." },
            { n: "أ. بهاء الدين", r: "مستثمر أردني", q: "سلاسة فتحت لي أبواب السوق السعودي بثقة. فريق يفهم احتياجات المستثمر الأجنبي ويتعامل بمهنية عالية." },
            { n: "أ. باسل مبارك", r: "مستثمر فلسطيني", q: "ما يميز سلاسة هو الالتزام بالمواعيد ووضوح الخطوات. شعرت أنني في أيدٍ أمينة من اليوم الأول." },
            { n: "م. ماز مشعل", r: "مستثمر يمني بريطاني", q: "خدمة استثنائية تجمع بين الخبرة المحلية والمعايير العالمية. سلاسة اختصرت علي شهوراً من الإجراءات." },
          ].map(t => (
            <div key={t.n} className="bg-cream/5 border border-accent/15 rounded-2xl p-7">
              <div className="text-accent text-3xl leading-none mb-3">"</div>
              <p className="text-cream/85 leading-relaxed mb-5">{t.q}</p>
              <div>
                <div className="text-cream font-bold">{t.n}</div>
                <div className="text-cream/55 text-xs">{t.r}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* PARTNERS */}
      <Section className="bg-cream">
        <SectionHeader tag="شركاؤنا" title="بشراكة" highlight="جهات موثوقة" />
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-5xl mx-auto">
          {["وزارة التجارة","وزارة الاستثمار","هيئة الزكاة","غرفة الرياض","منشآت","SAGIA"].map(p => (
            <div key={p} className="bg-card border border-border rounded-2xl h-24 flex items-center justify-center text-center text-muted-foreground text-sm font-bold p-3 hover:border-accent/40 transition">
              {p}
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-secondary">
        <SectionHeader tag="أسئلة شائعة" title="إجابات" highlight="على استفساراتك" />
        <div className="max-w-3xl mx-auto space-y-3">
          {[
            { q: "كم تستغرق عملية تأسيس شركة في السعودية؟", a: "عادةً من 5 إلى 15 يوم عمل حسب نوع النشاط ومدى اكتمال المستندات." },
            { q: "هل يمكنكم تأسيس شركة لمستثمر أجنبي؟", a: "نعم، نقدم خدمة كاملة لإصدار رخصة وزارة الاستثمار (MISA) وتأسيس الشركة." },
            { q: "هل تقدمون خدمات بعد التأسيس؟", a: "نعم، نقدم محاسبة، موارد بشرية، ضرائب، تجديد تراخيص، وخدمات إدارية متكاملة." },
            { q: "هل يمكن فتح حساب بنكي مع التأسيس؟", a: "نعم، لدينا علاقات مع +12 بنك إقليمي." },
            { q: "كيف أبدأ؟", a: "تواصل معنا عبر النموذج أو الواتساب لحجز استشارة مجانية وخطة مخصصة." },
          ].map(f => (
            <details key={f.q} className="group bg-card border border-border rounded-2xl p-5 hover:border-accent/40 transition">
              <summary className="font-bold cursor-pointer flex items-center justify-between">
                {f.q}
                <span className="text-accent text-xl group-open:rotate-45 transition">+</span>
              </summary>
              <p className="text-muted-foreground mt-3 leading-loose">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* SECURITY TEASER */}
      <Section className="bg-cream">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="bg-deep rounded-3xl p-10 text-cream">
            <div className="text-[11px] tracking-[0.25em] text-accent font-bold mb-3 uppercase">الأمن السيبراني</div>
            <h2 className="text-3xl md:text-4xl font-black mb-5">حماية بياناتك <span className="text-accent">التزام جوهري</span></h2>
            <p className="text-cream/70 mb-6 leading-loose">
              نطبق أعلى معايير الأمن السيبراني — تشفير TLS 1.3، AES-256، مصادقة ثنائية، ومراقبة 24/7 لحماية بياناتك من أي تهديد.
            </p>
            <Link to="/security" className="inline-block px-7 py-3 rounded-xl bg-accent text-deep font-bold hover:brightness-110 transition">
              اعرف المزيد
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { i: "🔒", t: "TLS 1.3" },
              { i: "🛡️", t: "AES-256" },
              { i: "🔑", t: "MFA" },
              { i: "🚨", t: "24/7 SOC" },
              { i: "📋", t: "ISO 27001" },
              { i: "✅", t: "PDPL" },
            ].map(s => (
              <div key={s.t} className="bg-card border border-border rounded-2xl p-5 text-center">
                <div className="text-3xl mb-2">{s.i}</div>
                <div className="font-bold text-sm">{s.t}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-cream">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-deep to-deep-2 rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-72 h-72 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-emerald-soft/20 blur-3xl" />
          <div className="relative grid md:grid-cols-[auto_1fr] items-center gap-8 text-center md:text-right">
            <div className="bg-cream w-28 h-28 rounded-2xl p-4 mx-auto md:mx-0 flex items-center justify-center">
              <img src={logo} alt="سلاسة" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-cream leading-tight mb-5">
                جاهز لبدء <span className="text-accent">رحلتك معنا؟</span>
              </h2>
              <p className="text-cream/70 text-lg mb-8">
                تواصل مع فريقنا للحصول على استشارة مجانية وخطة مخصصة لأعمالك.
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link to="/contact" className="px-8 py-4 rounded-xl bg-accent text-deep font-bold hover:brightness-110 transition shadow-lg shadow-accent/30">
                  احجز استشارة مجانية
                </Link>
                <a href="https://wa.me/966559500173" target="_blank" rel="noopener" className="px-8 py-4 rounded-xl border border-cream/25 text-cream font-semibold hover:bg-cream/5 transition inline-flex items-center gap-2">
                  💬 واتساب مباشر
                </a>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
