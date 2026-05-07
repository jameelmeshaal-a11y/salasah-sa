import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { platforms, sectors } from "@/lib/data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة التحكم | سلاسة القابضة" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Booking = {
  id: string; full_name: string; phone: string; email: string | null;
  nationality: string | null; language: string | null; topic: string | null;
  meeting_date: string; meeting_time: string; status: string; created_at: string;
};
type Message = {
  id: string; full_name: string; email: string | null; phone: string | null;
  subject: string | null; message: string; status: string; created_at: string;
};

function AdminPage() {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();
  const [tab, setTab] = useState<"bookings" | "messages" | "visibility">("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [hidden, setHidden] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    setDataLoading(true);
    Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
      supabase.from("visibility_settings").select("*"),
    ]).then(([b, m, v]) => {
      setBookings((b.data ?? []) as Booking[]);
      setMessages((m.data ?? []) as Message[]);
      const map: Record<string, boolean> = {};
      (v.data ?? []).forEach((r: any) => { map[`${r.item_type}:${r.item_id}`] = r.hidden; });
      setHidden(map);
      setDataLoading(false);
    });
  }, [isAdmin]);

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  async function setBookingStatus(id: string, status: string) {
    await supabase.from("bookings").update({ status }).eq("id", id);
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
  }

  async function toggleVisibility(itemType: "platform" | "sector", itemId: string) {
    const key = `${itemType}:${itemId}`;
    const newHidden = !hidden[key];
    setHidden((prev) => ({ ...prev, [key]: newHidden }));
    await supabase.from("visibility_settings").upsert(
      { item_type: itemType, item_id: itemId, hidden: newHidden },
      { onConflict: "item_type,item_id" }
    );
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-cream/60">جاري التحميل...</div>;
  if (!user) return null;
  if (!isAdmin) {
    return (
      <section className="min-h-[60vh] bg-deep flex items-center justify-center p-6">
        <div className="max-w-md text-center bg-cream/5 border border-accent/20 rounded-3xl p-8">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-cream text-2xl font-black mb-3">حساب غير مفعّل كمسؤول</h1>
          <p className="text-cream/60 text-sm mb-6">حسابك ({user.email}) لم يُمنح صلاحية الإدارة. تواصل مع المسؤول لتفعيل الصلاحية.</p>
          <button onClick={logout} className="px-5 py-2.5 rounded-lg bg-accent text-deep font-bold">تسجيل الخروج</button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-72px)] bg-deep py-10 px-5 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-cream">لوحة التحكم</h1>
            <p className="text-cream/60 text-sm mt-1">{user.email}</p>
          </div>
          <button onClick={logout} className="px-4 py-2 rounded-lg border border-cream/15 text-cream/80 hover:bg-cream/5 text-sm">خروج</button>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {(["bookings", "messages", "visibility"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${
                tab === t ? "bg-accent text-deep" : "bg-cream/5 text-cream/70 hover:bg-cream/10"
              }`}>
              {t === "bookings" ? `الحجوزات (${bookings.length})` : t === "messages" ? `الرسائل (${messages.length})` : "إظهار / إخفاء"}
            </button>
          ))}
        </div>

        {dataLoading ? (
          <div className="text-center text-cream/60 py-20">...</div>
        ) : tab === "bookings" ? (
          <div className="grid gap-4">
            {bookings.length === 0 && <div className="text-cream/50 text-center py-12">لا توجد حجوزات بعد</div>}
            {bookings.map((b) => (
              <div key={b.id} className="bg-cream/5 border border-accent/15 rounded-2xl p-5 grid md:grid-cols-[1fr_auto] gap-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-cream font-bold">{b.full_name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      b.status === "confirmed" ? "bg-emerald-500/20 text-emerald-300" :
                      b.status === "cancelled" ? "bg-red-500/20 text-red-300" : "bg-accent/20 text-accent"
                    }`}>{b.status}</span>
                  </div>
                  <div className="text-cream/70 text-sm" dir="ltr">📱 {b.phone} {b.email && `· ${b.email}`}</div>
                  <div className="text-cream/60 text-xs">📅 {b.meeting_date} · 🕐 {b.meeting_time} · 🌍 {b.nationality} · 🗣 {b.language}</div>
                  {b.topic && <div className="text-cream/65 text-sm mt-2">📝 {b.topic}</div>}
                  <div className="text-cream/40 text-[11px] mt-1">{new Date(b.created_at).toLocaleString("ar-SA")}</div>
                </div>
                <div className="flex md:flex-col gap-2">
                  <a href={`https://wa.me/${b.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener"
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30">واتساب</a>
                  <button onClick={() => setBookingStatus(b.id, "confirmed")}
                    className="px-3 py-1.5 rounded-lg bg-accent/20 text-accent text-xs font-bold hover:bg-accent/30">تأكيد</button>
                  <button onClick={() => setBookingStatus(b.id, "cancelled")}
                    className="px-3 py-1.5 rounded-lg bg-red-500/15 text-red-300 text-xs font-bold hover:bg-red-500/25">إلغاء</button>
                </div>
              </div>
            ))}
          </div>
        ) : tab === "messages" ? (
          <div className="grid gap-4">
            {messages.length === 0 && <div className="text-cream/50 text-center py-12">لا توجد رسائل</div>}
            {messages.map((m) => (
              <div key={m.id} className="bg-cream/5 border border-accent/15 rounded-2xl p-5">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <span className="text-cream font-bold">{m.full_name}</span>
                  <span className="text-cream/40 text-[11px]">{new Date(m.created_at).toLocaleString("ar-SA")}</span>
                </div>
                <div className="text-cream/65 text-xs mb-3" dir="ltr">{m.email} {m.phone && `· ${m.phone}`}</div>
                {m.subject && <div className="text-accent text-sm font-bold mb-2">{m.subject}</div>}
                <p className="text-cream/80 text-sm whitespace-pre-wrap leading-relaxed">{m.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8">
            <div>
              <h2 className="text-cream text-xl font-black mb-4">المنصات</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {platforms.map((p) => {
                  const isHidden = hidden[`platform:${p.name}`];
                  return (
                    <div key={p.name} className={`flex items-center justify-between gap-3 rounded-xl p-4 border transition ${isHidden ? "bg-red-500/5 border-red-500/20" : "bg-cream/5 border-accent/15"}`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl">{p.icon}</span>
                        <div className="min-w-0">
                          <div className="text-cream font-bold text-sm truncate">{p.ar}</div>
                          <div className="text-cream/50 text-[11px] truncate">{p.name}</div>
                        </div>
                      </div>
                      <button onClick={() => toggleVisibility("platform", p.name)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${isHidden ? "bg-red-500/20 text-red-300 hover:bg-red-500/30" : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"}`}>
                        {isHidden ? "مخفي" : "ظاهر"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div>
              <h2 className="text-cream text-xl font-black mb-4">القطاعات</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sectors.map((s) => {
                  const isHidden = hidden[`sector:${s.id}`];
                  return (
                    <div key={s.id} className={`flex items-center justify-between gap-3 rounded-xl p-4 border transition ${isHidden ? "bg-red-500/5 border-red-500/20" : "bg-cream/5 border-accent/15"}`}>
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl">{s.icon}</span>
                        <div className="text-cream font-bold text-sm truncate">{s.name}</div>
                      </div>
                      <button onClick={() => toggleVisibility("sector", s.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${isHidden ? "bg-red-500/20 text-red-300 hover:bg-red-500/30" : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"}`}>
                        {isHidden ? "مخفي" : "ظاهر"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
