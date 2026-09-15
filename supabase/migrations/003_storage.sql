-- =====================================================================
-- 003_storage.sql
-- Montrose Equestrian Estate - Supabase Storage Buckets & Policies
-- =====================================================================

-- 1. Create Public Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('horse-images', 'horse-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('rescue-images', 'rescue-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('journal-images', 'journal-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('site-images', 'site-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies

-- Public Read Access for all 4 buckets
CREATE POLICY "Public Read Access for horse-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'horse-images');

CREATE POLICY "Public Read Access for rescue-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'rescue-images');

CREATE POLICY "Public Read Access for journal-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'journal-images');

CREATE POLICY "Public Read Access for site-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-images');

-- Admin Upload / Modify / Delete Access
CREATE POLICY "Admin Upload Access to horse-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'horse-images' AND public.is_admin());

CREATE POLICY "Admin Update Access to horse-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'horse-images' AND public.is_admin());

CREATE POLICY "Admin Delete Access to horse-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'horse-images' AND public.is_admin());

CREATE POLICY "Admin Upload Access to rescue-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'rescue-images' AND public.is_admin());

CREATE POLICY "Admin Update Access to rescue-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'rescue-images' AND public.is_admin());

CREATE POLICY "Admin Delete Access to rescue-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'rescue-images' AND public.is_admin());

CREATE POLICY "Admin Upload Access to journal-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'journal-images' AND public.is_admin());

CREATE POLICY "Admin Update Access to journal-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'journal-images' AND public.is_admin());

CREATE POLICY "Admin Delete Access to journal-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'journal-images' AND public.is_admin());

CREATE POLICY "Admin Upload Access to site-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'site-images' AND public.is_admin());

CREATE POLICY "Admin Update Access to site-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'site-images' AND public.is_admin());

CREATE POLICY "Admin Delete Access to site-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'site-images' AND public.is_admin());
