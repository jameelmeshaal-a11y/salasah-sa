// Detect visitor country from request IP and return suggested site language.
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const COUNTRY_TO_LANG: Record<string, string> = {
  SA: "ar", AE: "ar", KW: "ar", QA: "ar", BH: "ar", OM: "ar", YE: "ar",
  JO: "ar", LB: "ar", SY: "ar", IQ: "ar", PS: "ar", EG: "ar", LY: "ar",
  TN: "ar", DZ: "ar", MA: "ar", SD: "ar", MR: "ar",
  GB: "en", US: "en", CA: "en", AU: "en", NZ: "en", IE: "en", ZA: "en",
  FR: "fr", BE: "fr", LU: "fr", MC: "fr", SN: "fr", CI: "fr",
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es", PE: "es", VE: "es",
  PT: "pt", BR: "pt", AO: "pt", MZ: "pt",
  IT: "it", SM: "it", VA: "it",
  DE: "de", AT: "de", CH: "de", LI: "de",
  NL: "nl",
  RU: "ru", BY: "ru", KZ: "ru", KG: "ru",
  UA: "uk",
  TR: "tr", CY: "tr",
  IR: "fa", AF: "fa",
  PK: "ur",
  IN: "hi", NP: "hi",
  BD: "bn",
  ID: "id",
  MY: "ms", BN: "ms",
  PH: "tl",
  VN: "vi",
  TH: "th",
  CN: "zh", HK: "zh", TW: "zh", SG: "zh", MO: "zh",
  JP: "ja",
  KR: "ko", KP: "ko",
  KE: "sw", TZ: "sw", UG: "sw", RW: "sw",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    // Try Cloudflare / standard headers first
    let country =
      req.headers.get("cf-ipcountry") ||
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("x-country-code") ||
      "";

    // Fallback: lookup via ipapi.co (no key)
    if (!country) {
      const fwd = req.headers.get("x-forwarded-for") || "";
      const ip = fwd.split(",")[0].trim();
      if (ip) {
        try {
          const r = await fetch(`https://ipapi.co/${ip}/country/`);
          if (r.ok) country = (await r.text()).trim();
        } catch { /* ignore */ }
      }
    }

    country = (country || "").toUpperCase();
    const lang = COUNTRY_TO_LANG[country] || null;
    return new Response(JSON.stringify({ country, lang }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
