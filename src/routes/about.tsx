import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionHeader } from "@/components/site/Section";
import logo from "@/assets/salasah-logo.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من نحن | سلاسة القابضة" },
      { name: "description", content: "تعرف على سلاسة القابضة، رؤيتنا ورسالتنا وقيمنا ومسيرتنا." },
      { property: "og:title", content: "من نحن | سلاسة القابضة" },
      { property: "og:description", content: "مجموعة سعودية رائدة منذ تأسيسها." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="bg-deep relative overflow-hidden py-24 md:py-32 px-5 md:px-8">
        <div className="absolute inset-0 bg-motif" />
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/15 blur-3xl" />
        <div className="relative max-w-5xl mx-auto grid md:grid-cols-[1fr_auto] items-center gap-10">
          <div>
            <div className="inline-block text-[11px] font-bold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-5 bg-accent/15 text-accent">من نحن</div>
            <h1 className="text-4xl md:text-6xl font-black text-cream leading-tight">
              نبني المستقبل <span className="text-accent">بكل قطاعاته</span>
            </h1>
            <p className="text-cream/70 text-lg mt-6 leading-relaxed max-w-2xl">
              سلاسة القابضة — مجموعة سعودية رائدة تأسست لتجمع تحت مظلتها شركات متخصصة بخبرة تتجاوز 15 عاماً في قطاعات المقاولات، التقنية، التعليم الإلكتروني، التجارة، تأسيس الأعمال، إدارة محطات الوقود، والمتاجر المتخصصة.
            </p>
          </div>
          <div className="bg-cream w-44 h-44 rounded-3xl p-6 flex items-center justify-center shadow-2xl">
            <img src={logo} alt="شعار سلاسة" className="w-full h-full object-contain" />
          </div>
        </div>
      </section>

      <Section className="bg-cream">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-[11px] font-bold tracking-[0.25em] uppercase text-accent mb-3">قصتنا</div>
            <h2 className="text-3xl md:text-4xl font-black mb-5">من فكرة إلى <span className="text-accent">منظومة قابضة</span></h2>
            <p className="text-foreground/75 leading-loose mb-4">
              بدأت رحلة سلاسة برؤية واضحة: بناء مجموعة سعودية تجمع بين عمق الخبرة في القطاعات التقليدية وريادة الابتكار في الاقتصاد الرقمي.
            </p>
            <p className="text-foreground/75 leading-loose mb-4">
              اليوم، تضم سلاسة القابضة أكثر من 12 منصة رقمية، وتعمل في 8 قطاعات استراتيجية، ونعتز بتأسيس أكثر من 40 شركة عبر دول الخليج.
            </p>
            <p className="text-foreground/75 leading-loose">
              نؤمن بأن النجاح يبدأ من تأسيس صحيح، ويستمر بشراكات طويلة المدى، ويتوسع بالابتكار المستمر.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: "+15", l: "سنة خبرة" },
              { v: "+12", l: "منصة رقمية" },
              { v: "+40", l: "شركة تأسست" },
              { v: "+250", l: "مشروع" },
              { v: "8", l: "قطاعات" },
              { v: "3", l: "دول خليجية" },
            ].map(s => (
              <div key={s.l} className="bg-deep text-cream rounded-2xl p-5 text-center">
                <div className="text-3xl font-black text-accent">{s.v}</div>
                <div className="text-cream/60 text-xs mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-secondary">
        <SectionHeader tag="مبادئنا" title="رؤيتنا ورسالتنا و" highlight="قيمنا" />
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { i: "🎯", t: "رؤيتنا", d: "أن نكون المجموعة الرائدة في تقديم الحلول المتكاملة عبر قطاعات الأعمال في السعودية والخليج، بمعايير عالمية." },
            { i: "🚀", t: "رسالتنا", d: "تمكين الأعمال والمؤسسات بحلول مبتكرة وذكية تجمع بين الخبرة الميدانية والابتكار الرقمي." },
            { i: "💎", t: "قيمنا", d: "الشفافية، الجودة، الابتكار، الاحترافية، والالتزام بتجاوز توقعات عملائنا." },
          ].map(c => (
            <div key={c.t} className="bg-card rounded-3xl p-8 border border-border text-center hover:border-accent/40 hover:shadow-xl transition">
              <div className="text-5xl mb-4">{c.i}</div>
              <h3 className="text-xl font-extrabold mb-3">{c.t}</h3>
              <p className="text-muted-foreground text-sm leading-loose">{c.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-deep">
        <SectionHeader light tag="التزامنا" title="ركائز نجاحنا" highlight="معك" />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { i: "🤝", t: "الشراكة طويلة الأمد", d: "نبني علاقات تستمر بعد التأسيس بسنوات." },
            { i: "⚡", t: "السرعة في التنفيذ", d: "إنجاز سريع دون التضحية بالجودة." },
            { i: "🔍", t: "الشفافية الكاملة", d: "تكاليف وجداول واضحة بلا مفاجآت." },
            { i: "🌍", t: "بصمة خليجية", d: "حضور قوي في السعودية، الإمارات، والخليج." },
          ].map(c => (
            <div key={c.t} className="bg-cream/5 border border-accent/15 rounded-2xl p-6 hover:bg-accent/10 transition">
              <div className="text-3xl mb-3">{c.i}</div>
              <h3 className="text-cream font-extrabold mb-2">{c.t}</h3>
              <p className="text-cream/60 text-sm leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-cream">
        <div className="max-w-5xl mx-auto">
          <SectionHeader tag="نظام سلاسة" title="نظام سلاسة" highlight="للمقاولات والإنشاءات"
            desc="حل شامل ومتطور لإدارة المقاولات ومشاريع الإنشاءات بكفاءة عالية." />
          <div className="grid md:grid-cols-4 gap-5">
            {[
              { v: "+25", l: "وحدة وظيفية" },
              { v: "%40", l: "تحسين كفاءة المشاريع" },
              { v: "%98", l: "توفر النظام" },
              { v: "%35", l: "تقليل التكاليف" },
              { v: "%25", l: "زيادة الربحية" },
              { v: "%60", l: "تقليل المخاطر" },
              { v: "%94", l: "رضا العملاء" },
              { v: "24/7", l: "دعم فني متواصل" },
            ].map(s => (
              <div key={s.l} className="bg-card rounded-2xl p-6 border border-border text-center">
                <div className="text-3xl font-black text-primary mb-1">{s.v}</div>
                <div className="text-muted-foreground text-xs font-medium">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/contact" className="inline-block px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition">
              تواصل معنا
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
