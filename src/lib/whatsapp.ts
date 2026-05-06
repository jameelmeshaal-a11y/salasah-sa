// Universal WhatsApp helper.
// Some networks/extensions/regions block wa.me, api.whatsapp.com, AND
// web.whatsapp.com. Instead of betting on one URL, we open an in-app
// gateway page (/wa) that offers all options + the raw number.

export const WHATSAPP_NUMBER = "966559500173"; // +966 55 950 0173

export function buildWhatsAppUrl(text?: string) {
  const enc = text ? encodeURIComponent(text) : "";
  return `/wa${enc ? `?text=${enc}` : ""}`;
}

export function openWhatsApp(text?: string) {
  if (typeof window === "undefined") return;
  const url = buildWhatsAppUrl(text);
  const w = window.open(url, "_blank", "noopener,noreferrer");
  if (!w) window.location.href = url;
}

export function openBlankForWhatsApp(): Window | null {
  if (typeof window === "undefined") return null;
  return window.open("about:blank", "_blank", "noopener,noreferrer");
}

export function redirectWhatsAppWindow(win: Window | null, text?: string) {
  const url = buildWhatsAppUrl(text);
  if (win && !win.closed) win.location.href = url;
  else if (typeof window !== "undefined") window.location.href = url;
}
