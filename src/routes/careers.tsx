import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Section } from "@/components/site/Section";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { buildMeta, buildLinks } from "@/lib/seo";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: buildMeta({
      path: "/careers",
      titleAr: "التوظيف — انضم إلى فريق سلاسة القابضة",
      titleEn: "Careers — Join Salasah Holding",
      descriptionAr: "تقدّم بطلب التوظيف للانضمام إلى فريق سلاسة القابضة. فرص متنوعة بدوام كامل، جزئي، عن بعد وبالعمولة.",
      descriptionEn: "Apply to join Salasah Holding. Full-time, part-time, remote and commission roles.",
    }),
    links: buildLinks("/careers"),
  }),
  component: CareersPage,
});

const WHY = [
  { icon: "🚀", title: "بيئة عمل محفزة", desc: "فريق طموح وثقافة مرتكزة على الإنجاز والابتكار." },
  { icon: "💰", title: "رواتب تنافسية", desc: "حزمة تعويضات تنافسية تليق بكفاءتك وخبرتك." },
  { icon: "📈", title: "تطوير مهني", desc: "برامج تدريب ومسارات نمو وظيفي واضحة." },
  { icon: "🌐", title: "مرونة في العمل", desc: "خيارات دوام مرنة وعمل عن بعد حسب الدور." },
];

const schema = z.object({
  full_name: z.string().trim().min(2, "الاسم قصير").max(120),
  email: z.string().trim().email("بريد إلكتروني غير صالح").max(200),
  phone: z.string().trim().min(6, "رقم جوال غير صالح").max(30),
  position: z.string().trim().min(2, "أدخل المسمى الوظيفي").max(200),
  city: z.string().trim().min(1, "أدخل المدينة").max(100),
  country: z.string().trim().min(1, "أدخل الدولة").max(100),
  work_type: z.enum(["full_time", "part_time", "remote", "commission"], {
    message: "اختر نوع العمل",
  }),
  linkedin_url: z.string().trim().url("رابط غير صالح").max(300).optional().or(z.literal("")),
  bio: z.string().trim().max(2000).optional().or(z.literal("")),
});

function CareersPage() {
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", position: "",
    city: "", country: "", work_type: "" as "" | "full_time" | "part_time" | "remote" | "commission",
    linkedin_url: "", bio: "",
  });
  const [cv, setCv] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "تحقق من البيانات");
      return;
    }
    if (cv) {
      if (cv.type !== "application/pdf") { setError("السيرة الذاتية يجب أن تكون بصيغة PDF"); return; }
      if (cv.size > 5 * 1024 * 1024) { setError("حجم الملف يجب ألا يتجاوز 5 ميجابايت"); return; }
    }

    setSubmitting(true);
    try {
      let cv_url: string | null = null;
      if (cv) {
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.pdf`;
        const { error: upErr } = await supabase.storage.from("cv-uploads").upload(path, cv, {
          contentType: "application/pdf",
        });
        if (upErr) throw upErr;
        cv_url = path;
      }
      const { error: dbErr } = await supabase.from("job_applications").insert({
        ...parsed.data,
        linkedin_url: parsed.data.linkedin_url || null,
        bio: parsed.data.bio || null,
        cv_url,
      });
      if (dbErr) throw dbErr;
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.message || "تعذّر إرسال الطلب، حاول مرة أخرى");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="bg-deep relative overflow-hidden py-24 md:py-32 px-5 md:px-8">
        <div className="absolute inset-0 bg-motif" />
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-block text-[11px] font-bold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-5 bg-accent/15 text-accent">التوظيف</div>
          <h1 className="text-4xl md:text-6xl font-black text-cream leading-tight">
            انضم إلى <span className="text-accent">فريق سلاسة</span>
          </h1>
          <p className="text-cream/65 text-lg mt-5 max-w-2xl mx-auto">
            نبحث عن أشخاص طموحين يؤمنون بأن الأعمال تُبنى على الكفاءة والثقة.
          </p>
          <a href="#apply" className="inline-block mt-8 px-7 py-3.5 rounded-xl bg-accent text-deep font-bold shadow-lg shadow-accent/20 hover:brightness-110 transition">
            تقدّم الآن
          </a>
        </div>
      </section>

      <Section className="bg-cream">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12">لماذا <span className="text-accent">سلاسة؟</span></h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY.map((w) => (
              <div key={w.title} className="bg-card border border-border rounded-2xl p-6 text-center hover:border-accent/40 hover:-translate-y-1 transition">
                <div className="text-4xl mb-3">{w.icon}</div>
                <h3 className="font-extrabold mb-2">{w.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-deep" >
        <div id="apply" className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-cream text-center mb-3">نموذج التقديم</h2>
          <p className="text-cream/60 text-center mb-8">املأ النموذج التالي وسنتواصل معك قريباً.</p>

          {done ? (
            <div className="bg-accent/10 border border-accent/30 rounded-3xl p-10 text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-black text-cream mb-3">شكراً لاهتمامك!</h3>
              <p className="text-cream/75 leading-loose">سيتواصل معك فريق الموارد البشرية خلال 3-5 أيام عمل.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="bg-cream/5 border border-accent/15 rounded-3xl p-6 md:p-8 space-y-5">
              <div className="bg-accent/10 border border-accent/25 rounded-xl p-4 text-sm text-cream/85 leading-relaxed">
                يمكنك أيضاً إرسال سيرتك الذاتية مباشرةً إلى:{" "}
                <a href="mailto:hr@salasah.sa" className="text-accent font-bold underline" dir="ltr">hr@salasah.sa</a>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Field label="الاسم الكامل *">
                  <Input value={form.full_name} onChange={(e) => set("full_name", e.target.value)} required className="bg-deep-2 border-cream/15 text-cream" />
                </Field>
                <Field label="البريد الإلكتروني *">
                  <Input type="email" dir="ltr" value={form.email} onChange={(e) => set("email", e.target.value)} required className="bg-deep-2 border-cream/15 text-cream" />
                </Field>
                <Field label="رقم الجوال *">
                  <Input type="tel" dir="ltr" value={form.phone} onChange={(e) => set("phone", e.target.value)} required className="bg-deep-2 border-cream/15 text-cream" />
                </Field>
                <Field label="المسمى الوظيفي المطلوب *">
                  <Input value={form.position} onChange={(e) => set("position", e.target.value)} required className="bg-deep-2 border-cream/15 text-cream" />
                </Field>
                <Field label="المدينة *">
                  <Input value={form.city} onChange={(e) => set("city", e.target.value)} required className="bg-deep-2 border-cream/15 text-cream" />
                </Field>
                <Field label="الدولة *">
                  <Input value={form.country} onChange={(e) => set("country", e.target.value)} required className="bg-deep-2 border-cream/15 text-cream" />
                </Field>
              </div>

              <Field label="نوع العمل *">
                <RadioGroup
                  value={form.work_type}
                  onValueChange={(v) => set("work_type", v as typeof form.work_type)}
                  className="grid sm:grid-cols-2 gap-2"
                >
                  {[
                    { v: "full_time", l: "دوام كامل" },
                    { v: "part_time", l: "دوام جزئي" },
                    { v: "remote", l: "عن بعد (أونلاين)" },
                    { v: "commission", l: "توظيف بالعمولة" },
                  ].map((o) => (
                    <label key={o.v} htmlFor={`wt-${o.v}`} className="flex items-center gap-3 bg-deep-2 border border-cream/15 rounded-lg px-4 py-3 cursor-pointer hover:border-accent/40 transition">
                      <RadioGroupItem id={`wt-${o.v}`} value={o.v} className="border-cream/40 text-accent" />
                      <span className="text-cream text-sm font-medium">{o.l}</span>
                    </label>
                  ))}
                </RadioGroup>
              </Field>

              <Field label="رابط LinkedIn (اختياري)">
                <Input type="url" dir="ltr" placeholder="https://www.linkedin.com/in/..." value={form.linkedin_url} onChange={(e) => set("linkedin_url", e.target.value)} className="bg-deep-2 border-cream/15 text-cream" />
              </Field>

              <Field label="نبذة مختصرة (اختياري)">
                <Textarea rows={4} value={form.bio} onChange={(e) => set("bio", e.target.value)} className="bg-deep-2 border-cream/15 text-cream" />
              </Field>

              <Field label="رفع السيرة الذاتية (PDF فقط، حتى 5 ميجابايت)">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => setCv(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-cream/80 file:mr-4 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-accent file:text-deep file:font-bold file:cursor-pointer bg-deep-2 border border-cream/15 rounded-lg p-2"
                />
              </Field>

              {error && (
                <div className="bg-red-500/15 border border-red-500/30 text-red-200 rounded-lg px-4 py-3 text-sm">{error}</div>
              )}

              <Button type="submit" disabled={submitting} className="w-full bg-accent text-deep hover:brightness-110 font-bold py-6 text-base">
                {submitting ? "جاري الإرسال..." : "إرسال الطلب"}
              </Button>
            </form>
          )}
        </div>
      </Section>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label className="text-cream/85 text-sm font-bold">{label}</Label>
      {children}
    </div>
  );
}
