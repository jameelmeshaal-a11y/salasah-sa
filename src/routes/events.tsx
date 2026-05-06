import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tr } from "@/lib/translate";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "الفعاليات والأخبار | سلاسة القابضة" },
      { name: "description", content: "تابع آخر فعاليات سلاسة القابضة، أخبارها، صور وفيديوهات نشاطاتها." },
    ],
  }),
  component: EventsPage,
});

type Ev = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  event_date: string | null;
  location: string | null;
  event_type: string | null;
  created_at: string;
};

function EventsPage() {
  const { isAdmin, user } = useAuth();
  const [items, setItems] = useState<Ev[]>([]);
  const [show, setShow] = useState(false);

  async function load() {
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false, nullsFirst: false }).limit(50);
    setItems(data || []);
  }
  useEffect(() => { load(); }, []);

  return (
    <section className="bg-deep min-h-[calc(100vh-72px)] py-16 md:py-20 px-5 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="text-[11px] font-bold tracking-[0.25em] uppercase text-accent">EVENTS & NEWS</div>
            <h1 className="text-4xl md:text-5xl font-black text-cream mt-2"><Tr>فعاليات سلاسة</Tr></h1>
            <p className="text-cream/65 mt-3 max-w-2xl"><Tr>تابع أحدث فعالياتنا، أخبارنا، وأنشطتنا في صور وفيديوهات.</Tr></p>
          </div>
          {isAdmin && (
            <button onClick={() => setShow(!show)} className="px-5 py-3 rounded-xl bg-accent text-deep font-bold">
              <Tr>{show ? "إغلاق" : "إضافة فعالية"}</Tr>
            </button>
          )}
        </div>

        {show && isAdmin && user && <EventForm userId={user.id} onCreated={() => { setShow(false); load(); }} />}

        {items.length === 0 && (
          <div className="text-cream/50 text-center py-20 border border-dashed border-cream/15 rounded-2xl mt-8"><Tr>لا توجد فعاليات منشورة بعد.</Tr></div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {items.map((e) => (
            <article key={e.id} className="bg-cream/5 border border-accent/15 rounded-2xl overflow-hidden hover:border-accent/40 transition group">
              {e.image_url && <img src={e.image_url} alt={e.title} className="w-full h-48 object-cover group-hover:scale-105 transition" />}
              {e.video_url && !e.image_url && <video src={e.video_url} className="w-full h-48 object-cover" />}
              <div className="p-5">
                <div className="text-accent text-[10px] tracking-[0.2em] uppercase font-bold">{e.event_type || "event"}</div>
                <h3 className="text-cream text-lg font-extrabold mt-2">{e.title}</h3>
                {e.description && <p className="text-cream/70 text-sm mt-2 line-clamp-3">{e.description}</p>}
                <div className="mt-4 flex items-center gap-3 text-cream/50 text-xs">
                  {e.event_date && <span>{new Date(e.event_date).toLocaleDateString("ar-SA-u-nu-latn")}</span>}
                  {e.location && <span>📍 {e.location}</span>}
                </div>
                {e.video_url && e.image_url && <video src={e.video_url} controls className="mt-3 w-full rounded-lg" />}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function EventForm({ userId, onCreated }: { userId: string; onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("event");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function uploadFile(file: File) {
    const path = `${userId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("forum-media").upload(path, file);
    if (error) throw error;
    return supabase.storage.from("forum-media").getPublicUrl(path).data.publicUrl;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim().length < 2) { setErr("ادخل عنواناً"); return; }
    setBusy(true); setErr("");
    try {
      const image_url = imageFile ? await uploadFile(imageFile) : null;
      const video_url = videoFile ? await uploadFile(videoFile) : null;
      const { error } = await supabase.from("events").insert({
        title: title.trim(), description: description.trim() || null,
        event_date: date || null, location: location.trim() || null,
        event_type: type, image_url, video_url, created_by: userId,
      });
      if (error) throw error;
      onCreated();
    } catch {
      setErr("تعذّر الحفظ");
    } finally { setBusy(false); }
  }
  return (
    <form onSubmit={submit} className="bg-cream/8 border border-accent/30 rounded-2xl p-6 space-y-3">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان الفعالية"
        className="w-full bg-deep/40 border border-cream/15 rounded-xl px-4 py-3 text-cream placeholder:text-cream/40 outline-none" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="الوصف" rows={3}
        className="w-full bg-deep/40 border border-cream/15 rounded-xl px-4 py-3 text-cream placeholder:text-cream/40 outline-none resize-none" />
      <div className="grid md:grid-cols-3 gap-3">
        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)}
          className="bg-deep/40 border border-cream/15 rounded-xl px-4 py-3 text-cream outline-none" />
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="المكان"
          className="bg-deep/40 border border-cream/15 rounded-xl px-4 py-3 text-cream placeholder:text-cream/40 outline-none" />
        <select value={type} onChange={(e) => setType(e.target.value)}
          className="bg-deep/40 border border-cream/15 rounded-xl px-4 py-3 text-cream outline-none">
          <option value="event" className="bg-deep">فعالية</option>
          <option value="news" className="bg-deep">خبر</option>
          <option value="activity" className="bg-deep">نشاط</option>
          <option value="conference" className="bg-deep">مؤتمر</option>
        </select>
      </div>
      <div className="grid md:grid-cols-2 gap-3 text-cream/80 text-sm">
        <label>صورة: <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} /></label>
        <label>فيديو: <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)} /></label>
      </div>
      {err && <div className="text-red-300 text-sm">{err}</div>}
      <button disabled={busy} className="px-6 py-3 rounded-xl bg-accent text-deep font-bold disabled:opacity-60">
        {busy ? "جاري الحفظ..." : "نشر الفعالية"}
      </button>
    </form>
  );
}
