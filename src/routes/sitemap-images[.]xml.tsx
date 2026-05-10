import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";

type ImgEntry = {
  path: string;
  images: { loc: string; title?: string; caption?: string }[];
};

const entries: ImgEntry[] = [
  {
    path: "/",
    images: [
      { loc: `${SITE_URL}/og/og-home-ar.jpg`, title: "سلاسة القابضة — الرئيسية", caption: "Salasah Holding — Home" },
      { loc: `${SITE_URL}/og/og-home-en.jpg`, title: "Salasah Holding — Home" },
    ],
  },
  {
    path: "/about",
    images: [
      { loc: `${SITE_URL}/og/og-about-ar.jpg`, title: "من نحن — سلاسة القابضة" },
      { loc: `${SITE_URL}/og/og-about-en.jpg`, title: "About — Salasah Holding" },
    ],
  },
  {
    path: "/sectors",
    images: [
      { loc: `${SITE_URL}/og/og-sectors-ar.jpg`, title: "قطاعات الأعمال — سلاسة" },
      { loc: `${SITE_URL}/og/og-sectors-en.jpg`, title: "Business Sectors — Salasah" },
    ],
  },
  {
    path: "/platforms",
    images: [
      { loc: `${SITE_URL}/og/og-platforms-ar.jpg`, title: "المنصات الرقمية — سلاسة" },
      { loc: `${SITE_URL}/og/og-platforms-en.jpg`, title: "Digital Platforms — Salasah" },
    ],
  },
  {
    path: "/business-setup",
    images: [
      { loc: `${SITE_URL}/og/og-business-setup-ar.jpg`, title: "تأسيس الشركات — سلاسة" },
      { loc: `${SITE_URL}/og/og-business-setup-en.jpg`, title: "Business Setup — Salasah" },
    ],
  },
  {
    path: "/contact",
    images: [
      { loc: `${SITE_URL}/og/og-contact-ar.jpg`, title: "تواصل معنا — سلاسة" },
      { loc: `${SITE_URL}/og/og-contact-en.jpg`, title: "Contact — Salasah" },
    ],
  },
];

function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, (c) =>
    c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : c === "'" ? "&apos;" : "&quot;"
  );
}

export const Route = createFileRoute("/sitemap-images.xml")({
  server: {
    handlers: {
      GET: async () => {
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries
  .map(
    (e) => `  <url>
    <loc>${SITE_URL}${e.path === "/" ? "" : e.path}</loc>
${e.images
  .map(
    (img) => `    <image:image>
      <image:loc>${img.loc}</image:loc>
      ${img.title ? `<image:title>${escapeXml(img.title)}</image:title>` : ""}
      ${img.caption ? `<image:caption>${escapeXml(img.caption)}</image:caption>` : ""}
    </image:image>`
  )
  .join("\n")}
  </url>`
  )
  .join("\n")}
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
