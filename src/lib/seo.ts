/**
 * SEO helper — builds a complete meta array (title, description, canonical,
 * OG, Twitter, hreflang signals) for any route. Defaults match Salasah Holding.
 *
 * OG images are expected at /og/<file>.jpg (served from public/og/).
 */

export const SITE_URL = "https://salasah-sa.lovable.app";
export const SITE_NAME_AR = "سلاسة القابضة";
export const SITE_NAME_EN = "Salasah Holding";
export const TWITTER_HANDLE = "@SalasahHolding";

export type SeoInput = {
  /** Path on the site, e.g. "/" or "/about" */
  path: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  /** OG image filename in /og/, without language suffix. e.g. "og-home" */
  ogImage?: string;
  /** Page type (default: website) */
  type?: "website" | "article" | "profile";
  /** Primary language for the page meta. Defaults to "ar". */
  lang?: "ar" | "en";
};

/**
 * Build a complete meta array for a route's `head()`.
 * Includes: title, description, canonical link (returned separately), OG, Twitter.
 */
export function buildMeta(input: SeoInput) {
  const lang = input.lang ?? "ar";
  const isAr = lang === "ar";
  const title = isAr
    ? `${input.titleAr} | ${SITE_NAME_AR}`
    : `${input.titleEn} | ${SITE_NAME_EN}`;
  const description = isAr ? input.descriptionAr : input.descriptionEn;
  const url = `${SITE_URL}${input.path === "/" ? "" : input.path}`;
  const ogImageFile = input.ogImage ?? "og-default";
  const ogImageUrl = `${SITE_URL}/og/${ogImageFile}-${lang}.jpg`;
  const altImageUrl = `${SITE_URL}/og/${ogImageFile}-${isAr ? "en" : "ar"}.jpg`;

  return [
    { title },
    { name: "description", content: description },
    { name: "robots", content: "index,follow,max-image-preview:large,max-snippet:-1" },

    // Canonical + alternate languages live in `links`, not `meta` — see buildLinks
    { property: "og:site_name", content: isAr ? SITE_NAME_AR : SITE_NAME_EN },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: input.type ?? "website" },
    { property: "og:url", content: url },
    { property: "og:image", content: ogImageUrl },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: title },
    { property: "og:locale", content: isAr ? "ar_SA" : "en_US" },
    { property: "og:locale:alternate", content: isAr ? "en_US" : "ar_SA" },

    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: TWITTER_HANDLE },
    { name: "twitter:creator", content: TWITTER_HANDLE },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: ogImageUrl },
    { name: "twitter:image:alt", content: title },

    { httpEquiv: "Content-Language", content: lang },
  ];
}

/**
 * Build canonical + hreflang link tags. Use inside `head().links`.
 * Currently the site is single-locale per URL; hreflang advertises both.
 */
export function buildLinks(path: string) {
  const url = `${SITE_URL}${path === "/" ? "" : path}`;
  return [
    { rel: "canonical", href: url },
    { rel: "alternate", hrefLang: "ar-SA", href: url },
    { rel: "alternate", hrefLang: "en", href: url },
    { rel: "alternate", hrefLang: "x-default", href: url },
  ];
}
