import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { RelatedLinks } from "@/components/site/RelatedLinks";
import { getPost, bodyToHtml, blogPosts } from "@/lib/blog";
import {
  buildMeta,
  buildLinks,
  jsonLd,
  organizationSchema,
  breadcrumbSchema,
  SITE_URL,
  SITE_NAME_EN,
} from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream">
      <h1 className="text-4xl font-black mb-4">المقال غير موجود</h1>
      <Link to="/blog" className="text-accent font-bold">
        ← العودة للمدونة
      </Link>
    </div>
  ),
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { post } = loaderData;
    const path = `/blog/${post.slug}`;
    return {
      meta: [
        ...buildMeta({
          path,
          titleAr: post.title,
          titleEn: post.titleEn,
          descriptionAr: post.description,
          descriptionEn: post.descriptionEn,
          ogImage: "og-about",
          type: "article",
        }),
        { property: "article:published_time", content: post.publishedAt },
        { property: "article:modified_time", content: post.updatedAt ?? post.publishedAt },
        { property: "article:author", content: post.author },
        ...post.tags.map((t) => ({ property: "article:tag", content: t })),
      ],
      links: buildLinks(path),
      scripts: [
        jsonLd(organizationSchema()),
        jsonLd({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt ?? post.publishedAt,
          inLanguage: "ar-SA",
          keywords: post.tags.join(", "),
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
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${SITE_URL}${path}`,
          },
        }),
        jsonLd(
          breadcrumbSchema([
            { name: "الرئيسية", path: "/" },
            { name: "المدونة", path: "/blog" },
            { name: post.title, path },
          ]),
        ),
      ],
    };
  },
  component: BlogPostPage,
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center text-center p-8">
      <div>
        <h1 className="text-2xl font-black mb-2">حدث خطأ</h1>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    </div>
  ),
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const html = bodyToHtml(post.body);
  const related = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <>
      <Section className="bg-deep text-cream pt-32 pb-12">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <Link to="/blog" className="text-accent text-sm hover:underline">
            ← المدونة
          </Link>
          <h1 className="text-3xl md:text-5xl font-black mt-4 mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-cream/70">
            <span>{post.author}</span>
            <span>•</span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("ar-SA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>•</span>
            <span>{post.readingTime} د قراءة</span>
          </div>
        </div>
      </Section>

      <Section className="bg-cream py-16">
        <article
          className="prose prose-lg max-w-3xl mx-auto px-5 md:px-8 text-foreground
            [&_h2]:text-2xl [&_h2]:font-black [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-foreground
            [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-6 [&_h3]:mb-3
            [&_p]:leading-loose [&_p]:mb-4 [&_p]:text-muted-foreground
            [&_ul]:list-disc [&_ul]:pr-6 [&_ul]:mb-4 [&_li]:mb-2 [&_li]:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div className="max-w-3xl mx-auto px-5 md:px-8 mt-10 pt-6 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((t: string) => (
              <span
                key={t}
                className="text-xs bg-accent/10 text-accent rounded-full px-3 py-1"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {related.length > 0 && (
          <div className="max-w-3xl mx-auto px-5 md:px-8 mt-16">
            <h2 className="text-xl font-black mb-4">مقالات ذات صلة</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="block bg-card rounded-xl p-4 border border-border hover:border-accent/50 transition"
                >
                  <h3 className="font-extrabold text-foreground mb-1 text-sm">
                    {p.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {p.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Section>

      <RelatedLinks exclude="/about" />
    </>
  );
}
