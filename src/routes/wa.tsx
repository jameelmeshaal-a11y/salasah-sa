import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export const Route = createFileRoute("/wa")({
  validateSearch: (s: Record<string, unknown>) => ({
    text: typeof s.text === "string" ? s.text : "",
  }),
  component: WhatsAppGateway,
});

function WhatsAppGateway() {
  const { text } = useSearch({ from: "/wa" });
  const phone = WHATSAPP_NUMBER;
  const display = "+966 55 950 0173";
  const enc = text ? encodeURIComponent(text) : "";

  const links = [
    { label: "فتح تطبيق واتساب", href: `whatsapp://send?phone=${phone}${enc ? `&text=${enc}` : ""}` },
    { label: "wa.me (الرابط الرسمي)", href: `https://wa.me/${phone}${enc ? `?text=${enc}` : ""}` },
    { label: "api.whatsapp.com", href: `https://api.whatsapp.com/send?phone=${phone}${enc ? `&text=${enc}` : ""}` },
    { label: "WhatsApp Web", href: `https://web.whatsapp.com/send?phone=${phone}${enc ? `&text=${enc}` : ""}` },
  ];

  const [copied, setCopied] = useState<"phone" | "text" | null>(null);

  // Best-effort: try the native scheme automatically once on mount.
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        window.location.href = links[0].href;
      } catch {}
    }, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function copy(value: string, kind: "phone" | "text") {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(kind);
      setTimeout(() => setCopied(null), 1800);
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-deep via-deep-2 to-deep px-5 py-10">
      <div className="w-full max-w-md bg-cream/5 backdrop-blur-xl border border-accent/30 rounded-3xl p-7 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#25D366] flex items-center justify-center mb-5">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="white"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9s-.5-.1-.7.1-.8.9-.9 1.1-.3.2-.5.1c-.3-.1-1.2-.4-2.3-1.4-.8-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5-.1-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4s-.3-.2-.6-.3z"/></svg>
        </div>
        <h1 className="text-2xl font-black text-cream">التواصل عبر واتساب</h1>
        <p className="text-cream/70 text-sm mt-2">اختر الطريقة الأنسب لك. إذا حُجب رابط، جرّب الذي بعده.</p>

        <div className="mt-6 bg-deep/50 border border-cream/15 rounded-2xl p-4 flex items-center justify-between gap-3">
          <span dir="ltr" className="text-cream font-bold text-lg tracking-wider">{display}</span>
          <button
            type="button"
            onClick={() => copy(phone, "phone")}
            className="text-xs font-bold px-3 py-1.5 rounded-lg bg-accent text-deep hover:brightness-110"
          >
            {copied === "phone" ? "✓ نُسخ" : "نسخ الرقم"}
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-3 rounded-xl bg-[#25D366] text-white font-bold hover:brightness-110 transition"
            >
              {l.label}
            </a>
          ))}
        </div>

        {text && (
          <div className="mt-5 text-right">
            <div className="flex items-center justify-between mb-2">
              <span className="text-cream/70 text-xs font-bold">نص الرسالة الجاهزة:</span>
              <button
                type="button"
                onClick={() => copy(text, "text")}
                className="text-xs font-bold px-3 py-1 rounded-lg bg-cream/10 text-cream hover:bg-cream/20"
              >
                {copied === "text" ? "✓ نُسخ" : "نسخ النص"}
              </button>
            </div>
            <pre className="bg-deep/60 border border-cream/10 rounded-xl p-3 text-cream/80 text-xs whitespace-pre-wrap text-right max-h-48 overflow-auto">
{text}
            </pre>
          </div>
        )}

        <p className="text-cream/50 text-[11px] mt-5">
          إذا كانت كل الروابط محجوبة، استخدم زر <b>نسخ الرقم</b> وافتح تطبيق واتساب يدوياً.
        </p>
      </div>
    </div>
  );
}
