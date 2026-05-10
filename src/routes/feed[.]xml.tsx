import { createFileRoute } from "@tanstack/react-router";
import { blogPosts } from "@/lib/blog";
import { SITE_URL, SITE_NAME_AR } from "@/lib/seo";

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const Route = createFileRoute("/feed.xml")({
  server: {
    handlers: {
      GET: async () => {
        const sorted = [...blogPosts].sort((a, b) =>
          b.publishedAt.localeCompare(a.publishedAt),
        );
        const lastBuild = new Date(
          sorted[0]?.updatedAt ?? sorted[0]?.publishedAt ?? Date.now(),
        ).toUTCString();

        const items = sorted
          .map((p) => {
            const url = `${SITE_URL}/blog/${p.slug}`;
            const pub = new Date(p.publishedAt).toUTCString();
            return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pub}</pubDate>
      <description>${escapeXml(p.description)}</description>
      <author>info@salasah.sa (${escapeXml(p.author)})</author>
      ${p.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("\n      ")}
    </item>`;
          })
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME_AR)} — المدونة</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>رؤى وتحليلات حول الأعمال والاستثمار في السعودية ضمن رؤية 2030.</description>
    <language>ar-SA</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
