// Universal WhatsApp link helper.
// wa.me works on every platform (mobile + desktop) and is not subject to the
// api.whatsapp.com blocking that some networks/extensions enforce. WhatsApp
// itself handles the redirect to the app or web client.

export const WHATSAPP_NUMBER = "966559500173"; // +966 55 950 0173

export function buildWhatsAppUrl(text?: string, phone: string = WHATSAPP_NUMBER) {
  const cleanPhone = phone.replace(/\D/g, "");
  const encoded = text ? encodeURIComponent(text) : "";
  return `https://wa.me/${cleanPhone}${encoded ? `?text=${encoded}` : ""}`;
}

/**
 * Opens WhatsApp synchronously. Must be called directly from a user-gesture
 * handler (onClick) — do NOT wrap in await/Promise or popup blockers will
 * silently swallow the call.
 */
export function openWhatsApp(text?: string, phone: string = WHATSAPP_NUMBER) {
  if (typeof window === "undefined") return;
  const url = buildWhatsAppUrl(text, phone);
  const w = window.open(url, "_blank", "noopener,noreferrer");
  if (!w) {
    // Popup blocked — navigate the current tab as a fallback.
    window.location.href = url;
  }
}

/**
 * For async flows (e.g. saving to DB before opening WhatsApp): open a blank
 * window synchronously inside the click handler, then later redirect it.
 * Returns the window handle (or null if blocked).
 */
export function openBlankForWhatsApp(): Window | null {
  if (typeof window === "undefined") return null;
  return window.open("about:blank", "_blank", "noopener,noreferrer");
}

export function redirectWhatsAppWindow(
  win: Window | null,
  text?: string,
  phone: string = WHATSAPP_NUMBER,
) {
  const url = buildWhatsAppUrl(text, phone);
  if (win && !win.closed) {
    win.location.href = url;
  } else if (typeof window !== "undefined") {
    window.location.href = url;
  }
}
