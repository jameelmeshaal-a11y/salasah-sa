import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  buildMeta,
  buildLinks,
  jsonLd,
  organizationSchema,
  pageSchema,
  breadcrumbSchema,
} from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: buildMeta({
      path: "/contact",
      titleAr: "تواصل معنا — الرياض، السعودية",
      titleEn: "Contact Us — Riyadh, Saudi Arabia",
      descriptionAr:
        "تواصل مع سلاسة القابضة في الرياض. راسلنا على info@salasah.sa أو عبر واتساب، أو احجز استشارة مجانية مع فريقنا.",
      descriptionEn:
        "Contact Salasah Holding in Riyadh. Email info@salasah.sa, message us on WhatsApp, or book a free consultation with our team.",
      ogImage: "og-contact",
    }),
    links: buildLinks("/contact"),
    scripts: [
      jsonLd(organizationSchema()),
      jsonLd(
        pageSchema({
          type: "ContactPage",
          path: "/contact",
          name: "تواصل معنا — سلاسة القابضة",
          description:
            "تواصل مع سلاسة القابضة في الرياض عبر البريد، الهاتف، أو واتساب.",
        }),
      ),
      jsonLd(
        breadcrumbSchema([
          { name: "الرئيسية", path: "/" },
          { name: "تواصل معنا", path: "/contact" },
        ]),
      ),
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", subject: "", message: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.full_name.trim().length < 2 || form.message.trim().length < 2) {
      setErr("يرجى تعبئة الاسم والرسالة"); return;
    }
    setBusy(true); setErr("");
    const { error } = await supabase.from("contact_messages").insert({
      full_name: form.full_name.trim(), email: form.email.trim() || null,
      phone: form.phone.trim() || null, subject: form.subject || null,
      message: form.message.trim(),
    });
    setBusy(false);
    if (error) { setErr("تعذّر الإرسال، حاول لاحقاً"); return; }
    supabase.functions.invoke("notify", { body: { type: "contact", payload: form } }).catch(() => {});
    setSent(true);
  }

  return (
    <section className="bg-deep min-h-[calc(100vh-72px)] relative overflow-hidden py-20 md:py-28 px-5 md:px-8">
      <div className="absolute inset-0 bg-motif" />
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-accent/15 blur-3xl" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-block text-[11px] font-bold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-5 bg-accent/15 text-accent">تواصل معنا</div>
          <h1 className="text-4xl md:text-6xl font-black text-cream leading-tight">
            دعنا <span className="text-accent">نتحدث</span>
          </h1>
          <p className="text-cream/65 text-lg mt-5 max-w-2xl mx-auto">
            فريقنا جاهز للإجابة على استفساراتك وتقديم استشارة مجانية لمشروعك.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Info */}
          <div className="space-y-4">
            {[
              { i: "✉️", l: "البريد الإلكتروني", v: "info@salasah.sa", href: "mailto:info@salasah.sa" },
              { i: "📞", l: "الهاتف", v: "+966 55 950 0173", href: "tel:+966559500173" },
              { i: "💬", l: "واتساب", v: "+966 55 950 0173", href: "https://wa.me/966559500173" },
              { i: "🌐", l: "الموقع الإلكتروني", v: "www.salasah.sa", href: "https://www.salasah.sa" },
              { i: "📍", l: "العنوان", v: "الرياض، المملكة العربية السعودية", href: "#" },
            ].map(c => (
              <a key={c.l} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener"
                className="flex items-center gap-4 p-5 bg-cream/5 border border-accent/15 rounded-2xl hover:bg-accent/10 hover:border-accent/40 transition">
                <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-xl flex-shrink-0">{c.i}</div>
                <div>
                  <div className="text-cream/45 text-[10px] tracking-[0.2em] uppercase font-bold">{c.l}</div>
                  <div className="text-cream font-bold mt-0.5" dir={c.l === "العنوان" ? "rtl" : "ltr"}>{c.v}</div>
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          <form className="space-y-3 bg-cream/5 border border-accent/15 rounded-3xl p-7" onSubmit={submit}>
            {sent ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-cream text-2xl font-extrabold mb-2">شكراً لتواصلك!</h3>
                <p className="text-cream/65">سنتواصل معك خلال 24 ساعة.</p>
              </div>
            ) : (
              <>
                <h3 className="text-cream text-xl font-extrabold mb-4">احجز استشارتك المجانية</h3>
                <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="الاسم الكامل" maxLength={120} className="w-full bg-cream/8 border border-cream/15 rounded-xl px-4 py-3.5 text-cream placeholder:text-cream/35 focus:border-accent outline-none" />
                <div className="grid sm:grid-cols-2 gap-3">
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="البريد الإلكتروني" className="bg-cream/8 border border-cream/15 rounded-xl px-4 py-3.5 text-cream placeholder:text-cream/35 focus:border-accent outline-none" />
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} type="tel" placeholder="رقم الجوال" className="bg-cream/8 border border-cream/15 rounded-xl px-4 py-3.5 text-cream placeholder:text-cream/35 focus:border-accent outline-none" />
                </div>
                <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full bg-cream/8 border border-cream/15 rounded-xl px-4 py-3.5 text-cream focus:border-accent outline-none">
                  <option value="" className="bg-deep">اختر الخدمة</option>
                  <option className="bg-deep">تأسيس شركة في السعودية</option>
                  <option className="bg-deep">تأسيس شركة في الإمارات</option>
                  <option className="bg-deep">المقاولات والإنشاء</option>
                  <option className="bg-deep">حلول تقنية ومنصات</option>
                  <option className="bg-deep">استشارات مالية وقانونية</option>
                  <option className="bg-deep">أخرى</option>
                </select>
                <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="أخبرنا عن مشروعك..." rows={5} maxLength={5000} className="w-full bg-cream/8 border border-cream/15 rounded-xl px-4 py-3.5 text-cream placeholder:text-cream/35 focus:border-accent outline-none resize-none" />
                {err && <div className="text-red-300 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">{err}</div>}
                <button type="submit" disabled={busy} className="w-full mt-2 px-6 py-4 rounded-xl bg-accent text-deep font-bold hover:brightness-110 transition shadow-lg shadow-accent/30 disabled:opacity-60">
                  {busy ? "جاري الإرسال..." : "أرسل الطلب"}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
