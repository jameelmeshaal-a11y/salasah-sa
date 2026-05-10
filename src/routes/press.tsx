import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { RelatedLinks } from "@/components/site/RelatedLinks";
import {
  buildMeta,
  buildLinks,
  jsonLd,
  organizationSchema,
  pageSchema,
  breadcrumbSchema,
  SITE_URL,
  SITE_NAME_EN,
} from "@/lib/seo";

type PressItem = {
  id: string;
  title: string;
  date: string; // ISO
  excerpt: string;
  source?: string;
  url?: string;
};

const items: PressItem[] = [
  {
    id: "vision-2030-alignment",
    title: "سلاسة القابضة تُعلن توسعها في خدمات تأسيس الأعمال دعماً لرؤية 2030",
    date: "2026-04-15",
    excerpt:
      "أعلنت مجموعة سلاسة القابضة عن توسعها في خدمات تأسيس الشركات داخل المملكة العربية السعودية ودول الخليج، تماشياً مع مستهدفات رؤية المملكة 2030.",
    source: "Salasah Newsroom",
  },
  {
    id: "platforms-launch",
    title: "إطلاق منصات رقمية جديدة ضمن محفظة سلاسة القابضة",
    date: "2026-02-20",
    excerpt:
      "كشفت سلاسة القابضة عن إطلاق منصات رقمية جديدة تخدم قطاعات التعليم والتجارة والمقاولات، مع التركيز على تجربة المستخدم وكفاءة العمليات.",
    source: "Salasah Newsroom",
  },
  {
    id: "saudi-uae-expansion",
    title: "تأسيس مكاتب تشغيلية في الرياض ودبي",
    date: "2025-11-05",
    excerpt:
      "ضمن خطة التوسع الإقليمي، أعلنت سلاسة القابضة عن تأسيس مكاتب تشغيلية في الرياض ودبي لخدمة العملاء في السوق السعودي والخليجي.",
    source: "Salasah Newsroom",
  },
];

function newsArticleSchema(it: PressItem) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: it.title,
    datePublished: it.date,
    dateModified: it.date,
    inLanguage: "ar-SA",
    author: { "@type": "Organization", name: SITE_NAME_EN, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME_EN,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og/salasah-holding-logo.jpg`,
      },
    },
    description: it.excerpt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/press#${it.id}`,
    },
  };
}

export const Route = createFileRoute("/press")({
  head: () => ({
    meta: buildMeta({
      path: "/press",
      titleAr: "المركز الإعلامي — أخبار وبيانات سلاسة القابضة",
      titleEn: "Newsroom — Salasah Holding News & Press Releases",
      descriptionAr:
        "آخر أخبار وبيانات صحفية مجموعة سلاسة القابضة: التوسعات، الشراكات، إطلاق المنصات، والمساهمة في رؤية 2030.",
      descriptionEn:
        "Latest news and press releases from Salasah Holding: expansions, partnerships, platform launches, and Vision 2030 contributions.",
      ogImage: "og-about",
    }),
    links: buildLinks("/press"),
    scripts: [
      jsonLd(organizationSchema()),
      jsonLd(
        pageSchema({
          type: "CollectionPage",
          path: "/press",
          name: "المركز الإعلامي — سلاسة القابضة",
          description: "أخبار وبيانات صحفية لمجموعة سلاسة القابضة.",
        }),
      ),
      jsonLd(
        breadcrumbSchema([
          { name: "الرئيسية", path: "/" },
          { name: "المركز الإعلامي", path: "/press" },
        ]),
      ),
      ...items.map((it) => jsonLd(newsArticleSchema(it))),
    ],
  }),
  component: PressPage,
});

function PressPage() {
  return (
    <>
      <Section className="bg-deep text-cream pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-5 md:px-8 text-center">
          <p className="text-accent text-sm font-bold tracking-[0.3em] mb-3">
            NEWSROOM
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            المركز <span className="text-accent">الإعلامي</span>
          </h1>
          <p className="text-cream/70 max-w-2xl mx-auto">
            آخر الأخبار والبيانات الصحفية من مجموعة سلاسة القابضة.
          </p>
        </div>
      </Section>

      <Section className="bg-cream py-20">
        <div className="max-w-4xl mx-auto px-5 md:px-8 space-y-6">
          {items.map((it) => (
            <article
              id={it.id}
              key={it.id}
              className="bg-card rounded-2xl p-6 md:p-8 border border-border hover:border-accent/40 transition"
            >
              <time
                dateTime={it.date}
                className="text-xs font-bold text-accent tracking-widest"
              >
                {new Date(it.date).toLocaleDateString("ar-SA", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <h2 className="text-xl md:text-2xl font-black text-foreground mt-2 mb-3">
                {it.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {it.excerpt}
              </p>
              {it.source && (
                <p className="text-xs text-muted-foreground/70 mt-4">
                  المصدر: {it.source}
                </p>
              )}
            </article>
          ))}
        </div>
      </Section>

      <RelatedLinks exclude="/about" />
    </>
  );
}
