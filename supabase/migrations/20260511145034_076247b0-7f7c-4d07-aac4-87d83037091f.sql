
CREATE TYPE public.work_type AS ENUM ('full_time', 'part_time', 'remote', 'commission');

CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  position text NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  work_type public.work_type NOT NULL,
  linkedin_url text,
  bio text,
  cv_url text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit application"
ON public.job_applications FOR INSERT
WITH CHECK (
  length(full_name) BETWEEN 2 AND 120
  AND length(email) BETWEEN 5 AND 200
  AND length(phone) BETWEEN 6 AND 30
  AND length(position) BETWEEN 2 AND 200
  AND length(city) BETWEEN 1 AND 100
  AND length(country) BETWEEN 1 AND 100
);

CREATE POLICY "Admins view all applications"
ON public.job_applications FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update applications"
ON public.job_applications FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete applications"
ON public.job_applications FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

INSERT INTO storage.buckets (id, name, public)
VALUES ('cv-uploads', 'cv-uploads', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can upload CV"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'cv-uploads');

CREATE POLICY "Admins read CVs"
ON storage.objects FOR SELECT
USING (bucket_id = 'cv-uploads' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete CVs"
ON storage.objects FOR DELETE
USING (bucket_id = 'cv-uploads' AND has_role(auth.uid(), 'admin'::app_role));
