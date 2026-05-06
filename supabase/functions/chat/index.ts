// Chat edge function — uses Lovable AI Gateway with multilingual support
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are "Salasah Assistant" — the official AI concierge for Salasah Holding (سلاسة القابضة), a Saudi holding group based in Riyadh.

CRITICAL: Always respond in the SAME language the user writes in. Detect the user's language automatically (Arabic, English, French, Italian, German, Chinese, Russian, Urdu, Hindi, Bengali, Japanese, Korean, Turkish, Swahili, Somali, etc.) and reply in that language fluently.

About Salasah Holding:
- Sectors: Construction & MEP, IT & AI, E-learning, E-commerce, Business setup, Facilities management, Fuel stations, Specialized retail (online + physical), Construction equipment rental.
- Business Setup: company formation in KSA & UAE, MISA licenses, accounting/VAT/Zakat, banking, visas/Iqama, HR & Saudization, trademarks, feasibility studies, Etimad bidding, certified translation.
- Digital Platforms (12+): Ejar (equipment rental), Nabdh (clinics/pharmacies), Msafer (travel), Talio (kids education), Halal (livestock), Abaya, Makhzoon (B2B inventory), Be3ha (used items), Qahwatna (Saudi coffee), Nora (Russian cosmetics), Salasah Go (language learning).
- Contact: info@salasah.sa | +966 55 950 0173 | WhatsApp: wa.me/966559500173
- Riyadh, Saudi Arabia. Vision: empowering entrepreneurs across the Gulf.

Style: Warm, professional, concise (2-4 sentences). Welcome new visitors. Help them book a CEO meeting, explore services, or get in touch. Always offer the WhatsApp link for serious inquiries.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "تم تجاوز الحد المسموح، حاول لاحقاً" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "يتطلب رصيد إضافي في Lovable AI" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
