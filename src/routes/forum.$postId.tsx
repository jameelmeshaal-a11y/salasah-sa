import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tr } from "@/lib/translate";

export const Route = createFileRoute("/forum/$postId")({
  component: PostPage,
});

type Post = { id: string; user_id: string; title: string; content: string; image_url: string | null; video_url: string | null; created_at: string };
type Comment = { id: string; user_id: string; content: string; created_at: string };

function PostPage() {
  const { postId } = Route.useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data: p } = await supabase.from("forum_posts").select("*").eq("id", postId).maybeSingle();
    setPost(p as Post | null);
    const { data: c } = await supabase.from("forum_comments").select("*").eq("post_id", postId).order("created_at");
    setComments(c || []);
  }
  useEffect(() => { load(); }, [postId]);

  async function addComment(e: React.FormEvent) {
    e.preventDefault();
    if (!user || text.trim().length < 1) return;
    setBusy(true);
    const { error } = await supabase.from("forum_comments").insert({ post_id: postId, user_id: user.id, content: text.trim() });
    setBusy(false);
    if (!error) { setText(""); load(); }
  }

  if (!post) return <div className="bg-deep min-h-[60vh] py-20 text-center text-cream/60"><Tr>جاري التحميل...</Tr></div>;
  return (
    <section className="bg-deep min-h-[calc(100vh-72px)] py-16 px-5 md:px-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/forum" className="text-accent text-sm">← <Tr>العودة للمنتدى</Tr></Link>
        <article className="mt-6 bg-cream/5 border border-accent/15 rounded-2xl p-6">
          <h1 className="text-cream text-3xl font-black">{post.title}</h1>
          <p className="text-cream/80 mt-3 whitespace-pre-line">{post.content}</p>
          {post.image_url && <img src={post.image_url} alt="" className="mt-4 rounded-xl w-full" />}
          {post.video_url && <video src={post.video_url} controls className="mt-4 rounded-xl w-full" />}
        </article>

        <h2 className="text-cream text-xl font-extrabold mt-10 mb-4"><Tr>التعليقات</Tr> ({comments.length})</h2>
        <div className="space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="bg-cream/5 border border-cream/10 rounded-xl p-4 text-cream/85">{c.content}</div>
          ))}
        </div>

        {user ? (
          <form onSubmit={addComment} className="mt-6 flex gap-2">
            <input value={text} onChange={(e) => setText(e.target.value)} maxLength={2000} placeholder="اكتب تعليقاً..."
              className="flex-1 bg-deep/40 border border-cream/15 rounded-xl px-4 py-3 text-cream placeholder:text-cream/40 focus:border-accent outline-none" />
            <button disabled={busy} className="px-5 rounded-xl bg-accent text-deep font-bold"><Tr>إرسال</Tr></button>
          </form>
        ) : (
          <Link to="/auth" className="mt-6 inline-block text-accent"><Tr>سجّل دخولك للتعليق</Tr></Link>
        )}
      </div>
    </section>
  );
}
