import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "إعادة تعيين كلمة المرور | سلاسة القابضة" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Supabase places the recovery session in the URL hash; getSession picks it up.
    supabase.auth.getSession().then(({ data }) => {
      setReady(!!data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setInfo("");
    if (password.length < 8) { setErr("كلمة المرور يجب ألا تقل عن 8 أحرف"); return; }
    if (password !== confirm) { setErr("كلمتا المرور غير متطابقتين"); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    setInfo("تم تحديث كلمة المرور بنجاح، جارٍ التحويل...");
    setTimeout(() => navigate({ to: "/admin" }), 1200);
  }

  return (
    <section className="min-h-[calc(100vh-72px)] bg-deep flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-cream/5 border border-accent/20 rounded-3xl p-8 backdrop-blur-xl">
        <h1 className="text-3xl font-black text-cream text-center mb-2">إعادة تعيين كلمة المرور</h1>
        <p className="text-cream/60 text-sm text-center mb-6">أدخل كلمة المرور الجديدة</p>

        {!ready ? (
          <div className="text-cream/70 text-sm text-center">
            افتح الرابط من بريدك الإلكتروني لاستكمال إعادة التعيين.
            <Link to="/auth" className="block mt-4 text-accent hover:underline">← العودة لتسجيل الدخول</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="كلمة المرور الجديدة" required minLength={8} dir="ltr"
              className="w-full bg-deep/40 border border-cream/15 rounded-xl px-4 py-3 text-cream placeholder:text-cream/40 focus:outline-none focus:border-accent" />
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="تأكيد كلمة المرور" required minLength={8} dir="ltr"
              className="w-full bg-deep/40 border border-cream/15 rounded-xl px-4 py-3 text-cream placeholder:text-cream/40 focus:outline-none focus:border-accent" />
            {err && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">{err}</div>}
            {info && <div className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">{info}</div>}
            <button type="submit" disabled={busy}
              className="w-full py-3 rounded-xl bg-accent text-deep font-bold hover:brightness-110 transition disabled:opacity-50">
              {busy ? "..." : "تحديث كلمة المرور"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
