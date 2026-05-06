// Helper to build a WhatsApp link that works on desktop and mobile.
// Some networks/extensions block api.whatsapp.com (ERR_BLOCKED_BY_RESPONSE),
// so we route desktop browsers to web.whatsapp.com directly and mobile to wa.me.

export const WHATSAPP_NUMBER = "966559500173"; // +966 55 950 0173

export function buildWhatsAppUrl(text?: string, phone: string = WHATSAPP_NUMBER) {
  const cleanPhone = phone.replace(/\D/g, "");
  const encoded = text ? encodeURIComponent(text) : "";
  const isMobile =
    typeof navigator !== "undefined" &&
    /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  if (isMobile) {
    return `https://wa.me/${cleanPhone}${encoded ? `?text=${encoded}` : ""}`;
  }
  return `https://web.whatsapp.com/send?phone=${cleanPhone}${encoded ? `&text=${encoded}` : ""}`;
}

export function openWhatsApp(text?: string, phone: string = WHATSAPP_NUMBER) {
  if (typeof window === "undefined") return;
  window.open(buildWhatsAppUrl(text, phone), "_blank", "noopener,noreferrer");
}
