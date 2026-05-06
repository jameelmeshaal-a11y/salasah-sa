import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LANG_NAMES: Record<string, string> = {
  ar: "Arabic", en: "English", fr: "French", es: "Spanish", pt: "Portuguese",
  it: "Italian", de: "German", nl: "Dutch", ru: "Russian", uk: "Ukrainian",
  tr: "Turkish", fa: "Persian (Farsi)", ur: "Urdu", hi: "Hindi", bn: "Bengali",
  id: "Indonesian", ms: "Malay", tl: "Filipino (Tagalog)", vi: "Vietnamese",
  th: "Thai", zh: "Simplified Chinese", ja: "Japanese", ko: "Korean", sw: "Swahili",
};

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const { texts, target } = await req.json();
    if (!Array.isArray(texts) || !target || target === "ar") {
      return new Response(JSON.stringify({ translations: texts || [] }), { headers: { ...cors, "Content-Type": "application/json" } });
    }
    const url = Deno.env.get("SUPABASE_URL")!;
    const srk = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovKey = Deno.env.get("LOVABLE_API_KEY")!;
    const sb = createClient(url, srk);

    const hashes = await Promise.all(texts.map((t: string) => sha256(t)));
    const { data: cached } = await sb
      .from("translations_cache")
      .select("source_hash, translated_text")
      .in("source_hash", hashes)
      .eq("target_lang", target);
    const map = new Map((cached || []).map((r) => [r.source_hash, r.translated_text]));

    const need: { i: number; text: string; hash: string }[] = [];
    const out: string[] = new Array(texts.length);
    texts.forEach((t: string, i: number) => {
      const c = map.get(hashes[i]);
      if (c) out[i] = c;
      else need.push({ i, text: t, hash: hashes[i] });
    });

    if (need.length) {
      const langName = LANG_NAMES[target] || target;
      const sys = `You are a professional translator. Translate each input string from Arabic to ${langName}. Preserve formatting, brand names (Salasah Holding, سلاسة), numbers and punctuation. Return ONLY a JSON object {"items":[...]} with translations in the same order.`;
      const user = JSON.stringify({ items: need.map((n) => n.text) });
      const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${lovKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{ role: "system", content: sys }, { role: "user", content: user }],
          response_format: { type: "json_object" },
        }),
      });
      if (!r.ok) {
        const t = await r.text();
        return new Response(JSON.stringify({ error: "translate_failed", detail: t }), { status: 502, headers: { ...cors, "Content-Type": "application/json" } });
      }
      const j = await r.json();
      const content = j.choices?.[0]?.message?.content || "{}";
      let parsed: { items?: string[] } = {};
      try { parsed = JSON.parse(content); } catch { parsed = {}; }
      const items = parsed.items || [];
      const rows = need.map((n, k) => {
        const tr = items[k] || n.text;
        out[n.i] = tr;
        return { source_hash: n.hash, source_lang: "ar", target_lang: target, source_text: n.text, translated_text: tr };
      });
      if (rows.length) await sb.from("translations_cache").upsert(rows, { onConflict: "source_hash,target_lang" });
    }

    return new Response(JSON.stringify({ translations: out }), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
