import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionHeader } from "@/components/site/Section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "عن سلاسة | سلاسة القابضة" },
      { name: "description", content: "تعرف على سلاسة القابضة، رؤيتنا ورسالتنا وقيمنا." },
      { property: "og:title", content: "عن سلاسة القابضة" },
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
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-block text-[11px] font-bold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-5 bg-accent/15 text-accent">عن سلاسة</div>
          <h1 className="text-4xl md:text-6xl font-black text-cream leading-tight">
            نبني المستقبل <span className="text-accent">بكل قطاعاته</span>
          </h1>
          <p className="text-cream/65 text-lg mt-5 max-w-2xl mx-auto">
            سلاسة القابضة — مجموعة سعودية رائدة تجمع تحت مظلتها شركات متخصصة بخبرة تتجاوز 15 عاماً.
          </p>
        </div>
      </section>

      <Section className="bg-cream">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { i: "🎯", t: "رؤيتنا", d: "أن نكون المجموعة الرائدة في تقديم الحلول المتكاملة عبر قطاعات الأعمال في السعودية والخليج، بمعايير عالمية." },
            { i: "🚀", t: "رسالتنا", d: "تمكين الأعمال والمؤسسات بحلول مبتكرة وذكية تجمع بين الخبرة الميدانية والابتكار الرقمي." },
            { i: "💎", t: "قيمنا", d: "الشفافية، الجودة، الابتكار، الاحترافية، والالتزام بمواعيد التسليم وتجاوز توقعات عملائنا." },
          ].map(c => (
            <div key={c.t} className="bg-card rounded-3xl p-8 border border-border text-center hover:border-accent/40 hover:shadow-xl transition">
              <div className="text-5xl mb-4">{c.i}</div>
              <h3 className="text-xl font-extrabold mb-3">{c.t}</h3>
              <p className="text-muted-foreground text-sm leading-loose">{c.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="bg-secondary">
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
              تعرف على النظام
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
