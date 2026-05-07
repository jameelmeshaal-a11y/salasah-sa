
CREATE TABLE public.visibility_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type text NOT NULL,
  item_id text NOT NULL,
  hidden boolean NOT NULL DEFAULT false,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(item_type, item_id)
);

ALTER TABLE public.visibility_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visibility readable by everyone"
ON public.visibility_settings FOR SELECT USING (true);

CREATE POLICY "Admins manage visibility"
ON public.visibility_settings FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_visibility_settings_updated_at
BEFORE UPDATE ON public.visibility_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
