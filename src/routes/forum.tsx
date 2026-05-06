import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tr, useT } from "@/lib/translate";

export const Route = createFileRoute("/forum")({
  head: () => ({
    meta: [
      { title: "المنتدى | سلاسة القابضة" },
      { name: "description", content: "منتدى سلاسة القابضة لمناقشة فرص الأعمال والاستثمار وتأسيس الشركات." },
    ],
  }),
  component: ForumPage,
});

type Post = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  image_url: string | null;
  video_url: string | null;
  created_at: string;
  author?: string;
  comments_count?: number;
  likes_count?: number;
};

function ForumPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const placeholderTitle = useT("عنوان الموضوع");
  const placeholderBody = useT("اكتب محتوى الموضوع...");

  async function load() {
    const { data } = await supabase
      .from("forum_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setPosts(data || []);
  }
  useEffect(() => { load(); }, []);

  return (
    <section className="bg-deep min-h-[calc(100vh-72px)] py-16 md:py-20 px-5 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <div className="text-[11px] font-bold tracking-[0.25em] uppercase text-accent">SALASAH FORUM</div>
            <h1 className="text-4xl md:text-5xl font-black text-cream mt-2"><Tr>منتدى سلاسة</Tr></h1>
            <p className="text-cream/65 mt-3 max-w-2xl"><Tr>شارك أفكارك، اطرح أسئلتك، وتواصل مع رواد الأعمال والمستثمرين.</Tr></p>
          </div>
          {!loading && (
            user ? (
              <button onClick={() => setShowForm(!showForm)} className="px-5 py-3 rounded-xl bg-accent text-deep font-bold hover:brightness-110">
                <Tr>{showForm ? "إغلاق" : "مشاركة جديدة"}</Tr>
              </button>
            ) : (
              <button onClick={() => navigate({ to: "/auth" })} className="px-5 py-3 rounded-xl bg-accent text-deep font-bold">
                <Tr>سجّل دخولك للمشاركة</Tr>
              </button>
            )
          )}
        </div>

        {showForm && user && (
          <NewPostForm onCreated={() => { setShowForm(false); load(); }} userId={user.id} placeholderTitle={placeholderTitle} placeholderBody={placeholderBody} />
        )}

        <div className="space-y-4 mt-8">
          {posts.length === 0 && (
            <div className="text-cream/50 text-center py-16 border border-dashed border-cream/15 rounded-2xl"><Tr>لا توجد مشاركات بعد. كن أول من يشارك!</Tr></div>
          )}
          {posts.map((p) => (
            <article key={p.id} className="bg-cream/5 border border-accent/15 rounded-2xl p-6 hover:border-accent/40 transition">
              <h3 className="text-cream text-xl font-extrabold">{p.title}</h3>
              <p className="text-cream/75 mt-2 whitespace-pre-line">{p.content}</p>
              {p.image_url && <img src={p.image_url} alt={p.title} className="mt-4 rounded-xl max-h-96 object-cover w-full" />}
              {p.video_url && <video src={p.video_url} controls className="mt-4 rounded-xl max-h-96 w-full" />}
              <div className="mt-4 flex items-center gap-3 text-cream/45 text-xs">
                <span>{new Date(p.created_at).toLocaleDateString("ar-SA-u-nu-latn")}</span>
                <Link to="/forum/$postId" params={{ postId: p.id }} className="text-accent font-bold"><Tr>عرض التعليقات</Tr></Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function NewPostForm({ onCreated, userId, placeholderTitle, placeholderBody }: { onCreated: () => void; userId: string; placeholderTitle: string; placeholderBody: string }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim().length < 2 || content.trim().length < 2) { setErr("اكمل الحقول"); return; }
    setBusy(true); setErr("");
    let image_url: string | null = null;
    let video_url: string | null = null;
    if (file) {
      const ext = file.name.split(".").pop();
      const path = `${userId}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("forum-media").upload(path, file);
      if (upErr) { setErr("فشل رفع الملف"); setBusy(false); return; }
      const { data: pub } = supabase.storage.from("forum-media").getPublicUrl(path);
      if (file.type.startsWith("video")) video_url = pub.publicUrl;
      else image_url = pub.publicUrl;
    }
    const { error } = await supabase.from("forum_posts").insert({
      user_id: userId, title: title.trim(), content: content.trim(), image_url, video_url,
    });
    setBusy(false);
    if (error) { setErr("تعذّر النشر"); return; }
    setTitle(""); setContent(""); setFile(null);
    onCreated();
  }
  return (
    <form onSubmit={submit} className="bg-cream/8 border border-accent/30 rounded-2xl p-6 space-y-3">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={placeholderTitle} maxLength={200}
        className="w-full bg-deep/40 border border-cream/15 rounded-xl px-4 py-3 text-cream placeholder:text-cream/40 focus:border-accent outline-none" />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={placeholderBody} rows={5} maxLength={10000}
        className="w-full bg-deep/40 border border-cream/15 rounded-xl px-4 py-3 text-cream placeholder:text-cream/40 focus:border-accent outline-none resize-none" />
      <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="text-cream/80 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent file:text-deep file:font-bold" />
      {err && <div className="text-red-300 text-sm"><Tr>{err}</Tr></div>}
      <button disabled={busy} className="px-6 py-3 rounded-xl bg-accent text-deep font-bold disabled:opacity-60">
        <Tr>{busy ? "جاري النشر..." : "نشر"}</Tr>
      </button>
    </form>
  );
}
