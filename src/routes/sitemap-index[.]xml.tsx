import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";

const today = new Date().toISOString().slice(0, 10);

export const Route = createFileRoute("/sitemap-index.xml")({
  server: {
    handlers: {
      GET: async () => {
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-images.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
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
