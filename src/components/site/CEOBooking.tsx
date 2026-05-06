import { useState } from "react";
import { FloatingPattern } from "./FloatingPattern";
import ceo from "@/assets/ceo.jpg";

const NATIONALITIES = ["السعودية", "الإمارات", "الكويت", "قطر", "البحرين", "عُمان", "مصر", "الأردن", "المغرب", "تركيا", "الصين", "الهند", "باكستان", "الولايات المتحدة", "بريطانيا", "ألمانيا", "فرنسا", "إيطاليا", "روسيا", "أخرى"];
const LANGS = ["العربية", "English", "Français", "Deutsch", "Italiano", "中文", "Русский", "اردو", "हिन्दी", "বাংলা", "日本語", "한국어", "Türkçe", "Kiswahili", "Soomaali"];
const TIMES = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

function nextDays(n: number) {
  const out: { value: string; label: string }[] = [];
  const today = new Date();
  for (let i = 1; i <= n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const label = d.toLocaleDateString("ar-SA-u-nu-latn", { weekday: "short", day: "numeric", month: "short" });
    out.push({ value: d.toISOString().slice(0, 10), label });
  }
  return out;
}

export function CEOBooking() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState(NATIONALITIES[0]);
  const [language, setLanguage] = useState(LANGS[0]);
  const [date, setDate] = useState(nextDays(14)[0].value);
  const [time, setTime] = useState(TIMES[0]);
  const [topic, setTopic] = useState("");
  const dates = nextDays(14);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("يرجى إدخال الاسم ورقم الجوال");
      return;
    }
    const msg = `*طلب حجز اجتماع افتراضي مع الرئيس التنفيذي — سلاسة القابضة*

👤 الاسم: ${name}
📱 الجوال: ${phone}
🌍 الجنسية: ${nationality}
🗣 اللغة: ${language}
📅 التاريخ: ${date}
🕐 الوقت: ${time}
📝 الموضوع: ${topic || "—"}`;
    const url = `https://wa.me/966559500173?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener");
  }

  return (
    <section className="relative overflow-hidden py-20 md:py-28 px-5 md:px-8 bg-gradient-to-br from-deep via-deep-2 to-deep">
      <FloatingPattern density={10} />
      <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/15 blur-3xl" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block text-[11px] font-bold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full mb-4 bg-accent/15 text-accent">
            اجتماع تنفيذي مباشر
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-cream leading-tight">
            احجز موعدك مع <span className="text-accent">الرئيس التنفيذي</span>
          </h2>
          <p className="text-cream/70 mt-4 max-w-xl mx-auto">
            اجتماع افتراضي خاص لمناقشة فرص الاستثمار، الشراكات الاستراتيجية، وتأسيس أعمالك في السعودية والخليج.
          </p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          <div className="hidden lg:block">
            <div className="relative shine rounded-3xl">
              <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden border-2 border-accent/40 shadow-2xl shadow-accent/20">
                <img src={ceo} alt="الرئيس التنفيذي" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-deep via-deep/70 to-transparent p-5 text-center">
                  <div className="text-cream font-bold">الرئيس التنفيذي</div>
                  <div className="text-accent text-xs mt-0.5">سلاسة القابضة</div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="bg-cream/5 backdrop-blur-xl border border-accent/20 rounded-3xl p-6 md:p-8 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="الاسم الكامل">
                <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80}
                  className="w-full bg-deep/40 border border-cream/15 rounded-xl px-4 py-3 text-cream placeholder:text-cream/40 focus:outline-none focus:border-accent/60"
                  placeholder="محمد عبدالله" />
              </Field>
              <Field label="رقم الجوال">
                <input value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={20} dir="ltr"
                  className="w-full bg-deep/40 border border-cream/15 rounded-xl px-4 py-3 text-cream placeholder:text-cream/40 focus:outline-none focus:border-accent/60"
                  placeholder="+966 5X XXX XXXX" />
              </Field>
              <Field label="الجنسية">
                <select value={nationality} onChange={(e) => setNationality(e.target.value)}
                  className="w-full bg-deep/40 border border-cream/15 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-accent/60">
                  {NATIONALITIES.map((n) => <option key={n} value={n} className="bg-deep">{n}</option>)}
                </select>
              </Field>
              <Field label="اللغة المفضلة">
                <select value={language} onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-deep/40 border border-cream/15 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-accent/60">
                  {LANGS.map((l) => <option key={l} value={l} className="bg-deep">{l}</option>)}
                </select>
              </Field>
              <Field label="التاريخ">
                <select value={date} onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-deep/40 border border-cream/15 rounded-xl px-4 py-3 text-cream focus:outline-none focus:border-accent/60">
                  {dates.map((d) => <option key={d.value} value={d.value} className="bg-deep">{d.label}</option>)}
                </select>
              </Field>
              <Field label="الوقت (توقيت الرياض)">
                <div className="grid grid-cols-4 gap-2">
                  {TIMES.map((t) => (
                    <button key={t} type="button" onClick={() => setTime(t)}
                      className={`py-2 rounded-lg text-xs font-bold border transition ${
                        time === t ? "bg-accent text-deep border-accent" : "bg-deep/40 text-cream/70 border-cream/10 hover:border-accent/40"
                      }`} dir="ltr">
                      {t}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
            <Field label="موضوع الاجتماع (اختياري)">
              <textarea value={topic} onChange={(e) => setTopic(e.target.value)} maxLength={300} rows={2}
                className="w-full bg-deep/40 border border-cream/15 rounded-xl px-4 py-3 text-cream placeholder:text-cream/40 focus:outline-none focus:border-accent/60 resize-none"
                placeholder="مثال: مناقشة فرص استثمار في قطاع التقنية" />
            </Field>

            <button type="submit"
              className="w-full mt-2 py-4 rounded-xl bg-gradient-to-r from-accent to-accent/85 text-deep font-bold hover:brightness-110 transition shadow-lg shadow-accent/30 inline-flex items-center justify-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9s-.5-.1-.7.1-.8.9-.9 1.1-.3.2-.5.1c-.3-.1-1.2-.4-2.3-1.4-.8-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5-.1-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4s-.3-.2-.6-.3z"/></svg>
              تأكيد الحجز عبر واتساب
            </button>
            <p className="text-cream/50 text-xs text-center">سيتم فتح واتساب بتفاصيل الحجز جاهزة للإرسال إلى فريق الإدارة.</p>
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-cream/75 text-xs font-bold mb-2">{label}</span>
      {children}
    </label>
  );
}
