import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";

type Entry = {
  path: string;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
  priority?: number;
  lastmod?: string;
};

const today = new Date().toISOString().slice(0, 10);

const entries: Entry[] = [
  { path: "/", changefreq: "weekly", priority: 1.0, lastmod: today },
  { path: "/about", changefreq: "monthly", priority: 0.8, lastmod: today },
  { path: "/sectors", changefreq: "monthly", priority: 0.9, lastmod: today },
  { path: "/platforms", changefreq: "monthly", priority: 0.9, lastmod: today },
  { path: "/business-setup", changefreq: "monthly", priority: 0.9, lastmod: today },
  { path: "/contact", changefreq: "monthly", priority: 0.7, lastmod: today },
  { path: "/privacy", changefreq: "yearly", priority: 0.3, lastmod: today },
  { path: "/terms", changefreq: "yearly", priority: 0.3, lastmod: today },
  { path: "/security", changefreq: "yearly", priority: 0.3, lastmod: today },
];

function abs(path: string) {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}

function urlXml(e: Entry) {
  const url = abs(e.path);
  const altAr = url;
  const altEn = url;
  return `  <url>
    <loc>${url}</loc>
    ${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}
    ${e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : ""}
    ${e.priority !== undefined ? `<priority>${e.priority.toFixed(1)}</priority>` : ""}
    <xhtml:link rel="alternate" hreflang="ar-SA" href="${altAr}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${altEn}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${url}"/>
  </url>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map(urlXml).join("\n")}
</urlset>`;
        return new Response(body, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
