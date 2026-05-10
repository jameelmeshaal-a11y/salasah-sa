import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader } from "@/components/site/Section";
import { RelatedLinks } from "@/components/site/RelatedLinks";
import { platforms } from "@/lib/data";
import { useVisibility } from "@/hooks/useVisibility";
import { useCustomItems } from "@/hooks/useCustomItems";
import {
  buildMeta,
  buildLinks,
  jsonLd,
  pageSchema,
  itemListSchema,
  breadcrumbSchema,
} from "@/lib/seo";

export const Route = createFileRoute("/platforms")({
  head: () => ({
    meta: buildMeta({
      path: "/platforms",
      titleAr: "المنصات الرقمية — إيجار، نبض، مسافر، تاليو، واشلي",
      titleEn: "Digital Platforms — Ejar, Nabdh, Msafer, Talio, Washly",
      descriptionAr:
        "أكثر من 15 منصة وتطبيق رقمي من سلاسة لتمكين قطاعات الأعمال، الصحة، السفر، التجارة، والترفيه في المملكة والخليج.",
      descriptionEn:
        "Over 15 digital platforms by Salasah empowering business, health, travel, commerce, and entertainment sectors across Saudi Arabia and the Gulf.",
      ogImage: "og-platforms",
    }),
    links: buildLinks("/platforms"),
    scripts: [
      jsonLd(
        pageSchema({
          type: "CollectionPage",
          path: "/platforms",
          name: "المنصات الرقمية — سلاسة القابضة",
          description:
            "+15 منصة وتطبيق رقمي تخدم قطاعات الأعمال والصحة والسفر والتجارة والترفيه.",
        }),
      ),
      jsonLd(
        itemListSchema(
          platforms.map((p) => ({
            name: `${p.ar} — ${p.name}`,
            description: p.desc,
            url: p.url,
          })),
        ),
      ),
      jsonLd(
        breadcrumbSchema([
          { name: "الرئيسية", path: "/" },
          { name: "المنصات", path: "/platforms" },
        ]),
      ),
    ],
  }),
  component: PlatformsPage,
});

function PlatformsPage() {
  const { hiddenIds } = useVisibility("platform");
  const { items: custom } = useCustomItems("platform");
  const merged = [
    ...platforms,
    ...custom.map((c) => ({
      name: c.name,
      ar: c.name_ar || c.name,
      icon: c.icon,
      desc: c.description,
      url: c.url || "#",
    })),
  ];
  const visible = merged.filter((p) => !hiddenIds.has(p.name));
  return (
    <>
      <section className="bg-deep relative overflow-hidden py-24 md:py-32 px-5 md:px-8">
        <div className="absolute inset-0 bg-motif" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-block text-[11px] font-bold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-5 bg-accent/15 text-accent">المنصات الرقمية</div>
          <h1 className="text-4xl md:text-6xl font-black text-cream leading-tight">
            منصاتنا <span className="text-accent">المتخصصة</span>
          </h1>
          <p className="text-cream/65 text-lg mt-5 max-w-2xl mx-auto">
            +15 منصة وتطبيق رقمي تخدم قطاعات الأعمال والصحة والسفر والتجارة والترفيه.
          </p>
        </div>
      </section>

      <Section className="bg-deep-2">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
          {visible.map(p => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener"
              className="group relative bg-cream/5 border border-accent/15 rounded-2xl p-7 hover:bg-accent/10 hover:border-accent/40 hover:-translate-y-1 transition-all overflow-hidden">
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-accent/20 blur-2xl opacity-0 group-hover:opacity-100 transition" />
              <div className="relative">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-2xl">{p.icon}</div>
                  <svg className="text-accent opacity-0 group-hover:opacity-100 transition" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M11 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="text-cream text-xl font-extrabold mb-1">{p.name} <span className="text-accent/80 text-sm">— {p.ar}</span></h3>
                <p className="text-cream/55 text-sm leading-relaxed">{p.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </Section>
      <RelatedLinks exclude="/platforms" />
    </>
  );
}
