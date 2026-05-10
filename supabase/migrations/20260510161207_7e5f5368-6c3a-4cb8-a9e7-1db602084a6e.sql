-- Custom items table for admin-added platforms and sectors
CREATE TABLE public.custom_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_type TEXT NOT NULL CHECK (item_type IN ('platform','sector')),
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  name_ar TEXT,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT '✨',
  url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (item_type, slug)
);

ALTER TABLE public.custom_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Custom items readable by everyone"
  ON public.custom_items FOR SELECT USING (true);

CREATE POLICY "Admins manage custom items"
  ON public.custom_items FOR ALL
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_custom_items_updated_at
  BEFORE UPDATE ON public.custom_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();