import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionHeader } from "@/components/site/Section";
import { sectors } from "@/lib/data";

export const Route = createFileRoute("/sectors")({
  head: () => ({
    meta: [
      { title: "قطاعاتنا | سلاسة القابضة" },
      { name: "description", content: "ستة قطاعات استراتيجية: المقاولات، التقنية، التعليم، التجارة، تأسيس الأعمال، والصيانة." },
      { property: "og:title", content: "قطاعاتنا | سلاسة القابضة" },
      { property: "og:description", content: "حلول متكاملة عبر ستة قطاعات." },
    ],
  }),
  component: SectorsPage,
});

function SectorsPage() {
  return (
    <>
      <section className="bg-deep relative overflow-hidden py-24 md:py-32 px-5 md:px-8">
        <div className="absolute inset-0 bg-motif" />
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-block text-[11px] font-bold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-5 bg-accent/15 text-accent">قطاعات الأعمال</div>
          <h1 className="text-4xl md:text-6xl font-black text-cream leading-tight">
            قطاعات <span className="text-accent">تبني المستقبل</span>
          </h1>
          <p className="text-cream/65 text-lg mt-5 max-w-2xl mx-auto">
            نعمل في مجالات استراتيجية متنوعة، من المقاولات إلى التقنية، لتقديم حلول متكاملة تخدم رؤية المملكة 2030.
          </p>
        </div>
      </section>

      <Section className="bg-cream">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {sectors.map((s, i) => (
            <div key={s.id} className="bg-card rounded-3xl p-8 border border-border hover:border-accent/50 hover:-translate-y-1.5 hover:shadow-2xl transition-all">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 ${i % 2 ? "bg-emerald-soft/15" : "bg-accent/15"}`}>{s.icon}</div>
              <h3 className="text-xl font-extrabold mb-3">{s.name}</h3>
              <p className="text-muted-foreground text-sm leading-loose mb-5">{s.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map(t => (
                  <span key={t} className="text-[11px] font-bold bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">{t}</span>
                ))}
              </div>
              {s.id === "biz" && (
                <Link to="/business-setup" className="mt-5 inline-flex items-center gap-2 text-primary font-bold text-sm hover:text-accent">
                  اكتشف خدمات التأسيس ←
                </Link>
              )}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
