import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | سلاسة القابضة" },
      { name: "description", content: "ادخل لحسابك في سلاسة القابضة لإدارة الحجوزات والرسائل." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "خطأ";
      setErr(msg.includes("Invalid login") ? "بيانات الدخول غير صحيحة" :
             msg.includes("already registered") ? "البريد مسجّل مسبقاً، سجّل الدخول." : msg);
    } finally { setBusy(false); }
  }

  async function google() {
    setErr(""); setBusy(true);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/admin` });
    if (r.error) { setErr("تعذّر تسجيل الدخول عبر Google"); setBusy(false); }
  }

  return (
    <section className="min-h-[calc(100vh-72px)] bg-deep flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-cream/5 border border-accent/20 rounded-3xl p-8 backdrop-blur-xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-cream">{mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}</h1>
          <p className="text-cream/60 text-sm mt-2">لوحة إدارة سلاسة القابضة</p>
        </div>

        <button onClick={google} disabled={busy}
          className="w-full mb-5 py-3 rounded-xl bg-cream text-deep font-bold flex items-center justify-center gap-3 hover:brightness-95 transition disabled:opacity-50">
          <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.5c-2 1.4-4.6 2.3-7.5 2.3-5.2 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.5 5.5c-.5.4 7-5.1 7-15.1 0-1.3-.1-2.4-.4-3.5z"/></svg>
          المتابعة عبر Google
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-cream/10" />
          <span className="text-cream/40 text-xs">أو</span>
          <div className="flex-1 h-px bg-cream/10" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="الاسم الكامل" required
              className="w-full bg-deep/40 border border-cream/15 rounded-xl px-4 py-3 text-cream placeholder:text-cream/40 focus:outline-none focus:border-accent" />
          )}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="البريد الإلكتروني" required dir="ltr"
            className="w-full bg-deep/40 border border-cream/15 rounded-xl px-4 py-3 text-cream placeholder:text-cream/40 focus:outline-none focus:border-accent" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور" required minLength={8} dir="ltr"
            className="w-full bg-deep/40 border border-cream/15 rounded-xl px-4 py-3 text-cream placeholder:text-cream/40 focus:outline-none focus:border-accent" />
          {err && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">{err}</div>}
          <button type="submit" disabled={busy}
            className="w-full py-3 rounded-xl bg-accent text-deep font-bold hover:brightness-110 transition disabled:opacity-50">
            {busy ? "..." : mode === "login" ? "دخول" : "إنشاء"}
          </button>
        </form>

        <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setErr(""); }}
          className="w-full mt-5 text-cream/60 text-sm hover:text-accent transition">
          {mode === "login" ? "ليس لديك حساب؟ أنشئ حساباً جديداً" : "لديك حساب؟ سجّل الدخول"}
        </button>

        <Link to="/" className="block text-center mt-4 text-cream/40 text-xs hover:text-cream/60">← الرجوع للموقع</Link>
      </div>
    </section>
  );
}
