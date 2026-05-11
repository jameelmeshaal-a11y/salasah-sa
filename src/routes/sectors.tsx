import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Section } from "@/components/site/Section";
import { RelatedLinks } from "@/components/site/RelatedLinks";
import { sectors, sectorServices } from "@/lib/data";
import { useVisibility } from "@/hooks/useVisibility";
import { useCustomItems } from "@/hooks/useCustomItems";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  buildMeta,
  buildLinks,
  jsonLd,
  pageSchema,
  itemListSchema,
  breadcrumbSchema,
} from "@/lib/seo";

export const Route = createFileRoute("/sectors")({
  head: () => ({
    meta: buildMeta({
      path: "/sectors",
      titleAr: "قطاعاتنا — ستة قطاعات تبني المستقبل",
      titleEn: "Our Sectors — Six Strategic Industries Building the Future",
      descriptionAr:
        "ستة قطاعات استراتيجية في سلاسة القابضة: المقاولات، التقنية، التعليم، التجارة، تأسيس الأعمال، والصيانة — لخدمة رؤية المملكة 2030.",
      descriptionEn:
        "Salasah Holding operates across six strategic sectors: contracting, IT, education, commerce, business setup, and maintenance — aligned with Saudi Vision 2030.",
      ogImage: "og-sectors",
    }),
    links: buildLinks("/sectors"),
    scripts: [
      jsonLd(
        pageSchema({
          type: "CollectionPage",
          path: "/sectors",
          name: "قطاعاتنا — سلاسة القابضة",
          description:
            "ستة قطاعات استراتيجية في سلاسة القابضة لخدمة رؤية المملكة 2030.",
        }),
      ),
      jsonLd(
        itemListSchema(
          sectors.map((s) => ({ name: s.name, description: s.desc })),
        ),
      ),
      jsonLd(
        breadcrumbSchema([
          { name: "الرئيسية", path: "/" },
          { name: "قطاعاتنا", path: "/sectors" },
        ]),
      ),
    ],
  }),
  component: SectorsPage,
});

function SectorsPage() {
  const { hiddenIds } = useVisibility("sector");
  const { items: custom } = useCustomItems("sector");
  const [openId, setOpenId] = useState<string | null>(null);
  const merged = [
    ...sectors,
    ...custom.map((c) => ({
      id: c.slug,
      icon: c.icon,
      name: c.name,
      desc: c.description,
      tags: c.tags,
    })),
  ];
  const visible = merged.filter((s) => !hiddenIds.has(s.id));
  const activeSector = visible.find((s) => s.id === openId) ?? null;
  const activeGroups = activeSector ? sectorServices[activeSector.id] ?? [] : [];

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
          {visible.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setOpenId(s.id)}
              className="text-right bg-card rounded-3xl p-8 border border-border hover:border-accent/50 hover:-translate-y-1.5 hover:shadow-2xl transition-all"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5 ${i % 2 ? "bg-emerald-soft/15" : "bg-accent/15"}`}>{s.icon}</div>
              <h3 className="text-xl font-extrabold mb-3">{s.name}</h3>
              <p className="text-muted-foreground text-sm leading-loose mb-5">{s.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map(t => (
                  <span key={t} className="text-[11px] font-bold bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full">{t}</span>
                ))}
              </div>
              {s.id === "biz" && (
                <Link to="/business-setup" onClick={(e) => e.stopPropagation()} className="mt-5 inline-flex items-center gap-2 text-primary font-bold text-sm hover:text-accent">
                  اكتشف خدمات التأسيس ←
                </Link>
              )}
              {sectorServices[s.id] && (
                <div className="mt-5 text-accent font-bold text-sm">عرض الخدمات ←</div>
              )}
            </button>
          ))}
        </div>
      </Section>

      <Dialog open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="max-w-4xl bg-deep border-accent/20 text-cream max-h-[85vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl md:text-3xl font-black text-cream text-right">
              {activeSector?.name}
            </DialogTitle>
          </DialogHeader>
          {activeGroups.length === 0 ? (
            <div className="py-10 text-center text-cream/60">قائمة الخدمات قيد الإعداد — سنضيفها قريباً.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5 mt-4">
              {activeGroups.map((g) => (
                <div key={g.title} className="bg-cream/5 border border-accent/15 rounded-2xl p-6">
                  <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center text-2xl mb-5 mx-auto">{g.icon}</div>
                  <h4 className="text-lg font-extrabold text-center mb-4 text-cream">{g.title}</h4>
                  <ul className="space-y-2.5 text-sm text-cream/80 text-center">
                    {g.items.map((it) => (
                      <li key={it} className="flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <RelatedLinks exclude="/sectors" />
    </>
  );
}
