
-- Events (admin-managed)
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  event_date TIMESTAMPTZ,
  location TEXT,
  event_type TEXT DEFAULT 'event',
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events are viewable by everyone" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admins manage events" ON public.events FOR ALL USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_events_updated BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Forum posts
CREATE TABLE public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts viewable by everyone" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated create posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id AND length(title) BETWEEN 2 AND 200 AND length(content) BETWEEN 2 AND 10000);
CREATE POLICY "Owners update posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Owners delete posts" ON public.forum_posts FOR DELETE USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_posts_updated BEFORE UPDATE ON public.forum_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_forum_posts_created ON public.forum_posts(created_at DESC);

-- Forum comments
CREATE TABLE public.forum_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments viewable by everyone" ON public.forum_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated create comments" ON public.forum_comments FOR INSERT WITH CHECK (auth.uid() = user_id AND length(content) BETWEEN 1 AND 2000);
CREATE POLICY "Owners delete comments" ON public.forum_comments FOR DELETE USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_comments_post ON public.forum_comments(post_id, created_at);

-- Post likes
CREATE TABLE public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Likes viewable by everyone" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Authenticated create likes" ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners delete likes" ON public.post_likes FOR DELETE USING (auth.uid() = user_id);

-- Translations cache
CREATE TABLE public.translations_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_lang TEXT NOT NULL DEFAULT 'ar',
  target_lang TEXT NOT NULL,
  source_hash TEXT NOT NULL,
  source_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(source_hash, target_lang)
);
ALTER TABLE public.translations_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Translations readable by everyone" ON public.translations_cache FOR SELECT USING (true);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('forum-media','forum-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "forum media public read" ON storage.objects FOR SELECT USING (bucket_id = 'forum-media');
CREATE POLICY "forum media auth upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'forum-media' AND auth.uid() IS NOT NULL AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "forum media owner update" ON storage.objects FOR UPDATE USING (bucket_id = 'forum-media' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "forum media owner delete" ON storage.objects FOR DELETE USING (bucket_id = 'forum-media' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(),'admin')));
