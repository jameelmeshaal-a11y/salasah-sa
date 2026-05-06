// Sends an email notification via Resend if RESEND_API_KEY is set; otherwise logs.
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TO = "info@salasah.sa";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  try {
    const { type, payload } = await req.json();
    const subject = type === "booking" ? `حجز اجتماع جديد — ${payload?.full_name ?? ""}` : `رسالة تواصل جديدة — ${payload?.full_name ?? ""}`;
    const rows = Object.entries(payload || {})
      .map(([k, v]) => `<tr><td style="padding:6px 10px;border:1px solid #eee;background:#f7f7f7;font-weight:bold">${k}</td><td style="padding:6px 10px;border:1px solid #eee">${String(v ?? "")}</td></tr>`)
      .join("");
    const html = `<div style="font-family:Tahoma,Arial,sans-serif;direction:rtl"><h2 style="color:#0d3320">${subject}</h2><table style="border-collapse:collapse;width:100%;max-width:600px">${rows}</table><p style="margin-top:16px;color:#666">رسالة آلية من موقع سلاسة القابضة.</p></div>`;

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.log("notify (no RESEND_API_KEY):", subject, payload);
      return new Response(JSON.stringify({ ok: true, queued: false, reason: "no_provider" }), { headers: { ...cors, "Content-Type": "application/json" } });
    }
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Salasah <onboarding@resend.dev>",
        to: [TO],
        subject,
        html,
      }),
    });
    const data = await r.json();
    return new Response(JSON.stringify({ ok: r.ok, data }), { status: r.ok ? 200 : 500, headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
