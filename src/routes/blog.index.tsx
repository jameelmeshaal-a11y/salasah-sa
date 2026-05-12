import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { RelatedLinks } from "@/components/site/RelatedLinks";
import { blogPosts } from "@/lib/blog";
import {
  buildMeta,
  buildLinks,
  jsonLd,
  organizationSchema,
  pageSchema,
  breadcrumbSchema,
  itemListSchema,
  SITE_URL,
} from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: buildMeta({
      path: "/blog",
      titleAr: "المدونة — رؤى وتحليلات الأعمال في السعودية",
      titleEn: "Blog — Business Insights & Analysis from Saudi Arabia",
      descriptionAr:
        "مقالات وتحليلات حول تأسيس الشركات في السعودية، فرص الاستثمار ضمن رؤية 2030، المنصات الرقمية، والقطاعات الواعدة.",
      descriptionEn:
        "Articles and analysis on company formation in Saudi Arabia, Vision 2030 investment opportunities, digital platforms, and promising sectors.",
      ogImage: "og-about",
    }),
    links: buildLinks("/blog"),
    scripts: [
      jsonLd(organizationSchema()),
      jsonLd(
        pageSchema({
          type: "CollectionPage",
          path: "/blog",
          name: "مدونة سلاسة القابضة",
          description: "رؤى وتحليلات حول الأعمال والاستثمار في السعودية.",
        }),
      ),
      jsonLd(
        breadcrumbSchema([
          { name: "الرئيسية", path: "/" },
          { name: "المدونة", path: "/blog" },
        ]),
      ),
      jsonLd(
        itemListSchema(
          blogPosts.map((p) => ({
            name: p.title,
            description: p.description,
            url: `${SITE_URL}/blog/${p.slug}`,
          })),
        ),
      ),
    ],
  }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const sorted = [...blogPosts].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
  return (
    <>
      <Section className="bg-deep text-cream pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-5 md:px-8 text-center">
          <p className="text-accent text-sm font-bold tracking-[0.3em] mb-3">
            INSIGHTS
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            مدونة <span className="text-accent">سلاسة</span>
          </h1>
          <p className="text-cream/70 max-w-2xl mx-auto">
            تحليلات وأدلة عملية حول تأسيس الأعمال، الاستثمار، ورؤية 2030.
          </p>
        </div>
      </Section>

      <Section className="bg-cream py-20">
        <div className="max-w-5xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-6">
          {sorted.map((p) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group block bg-card rounded-2xl p-6 border border-border hover:border-accent/50 hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <time dateTime={p.publishedAt}>
                  {new Date(p.publishedAt).toLocaleDateString("ar-SA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>•</span>
                <span>{p.readingTime} د قراءة</span>
              </div>
              <h2 className="text-xl font-extrabold text-foreground mb-2 group-hover:text-primary transition">
                {p.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {p.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {p.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="text-[11px] bg-accent/10 text-accent rounded-full px-2 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <RelatedLinks exclude="/about" />
    </>
  );
}
