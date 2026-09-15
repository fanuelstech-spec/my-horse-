-- Enable RLS on all tables
ALTER TABLE public.horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horse_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rescues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rescue_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rescue_story_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies on public tables to start fresh
DROP POLICY IF EXISTS "public_horses_select" ON public.horses;
DROP POLICY IF EXISTS "public_horses_all" ON public.horses;
DROP POLICY IF EXISTS "public_horse_images_select" ON public.horse_images;
DROP POLICY IF EXISTS "public_horse_images_all" ON public.horse_images;
DROP POLICY IF EXISTS "public_rescues_select" ON public.rescues;
DROP POLICY IF EXISTS "public_rescues_all" ON public.rescues;
DROP POLICY IF EXISTS "public_rescue_images_all" ON public.rescue_images;
DROP POLICY IF EXISTS "public_rescue_story_sections_all" ON public.rescue_story_sections;
DROP POLICY IF EXISTS "public_journal_posts_select" ON public.journal_posts;
DROP POLICY IF EXISTS "public_journal_posts_all" ON public.journal_posts;
DROP POLICY IF EXISTS "public_contact_messages_all" ON public.contact_messages;
DROP POLICY IF EXISTS "public_site_settings_all" ON public.site_settings;

-- HORSES
CREATE POLICY "horses_read_public" ON public.horses FOR SELECT USING (true);
CREATE POLICY "horses_write_auth" ON public.horses FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- HORSE IMAGES
CREATE POLICY "horse_images_read_public" ON public.horse_images FOR SELECT USING (true);
CREATE POLICY "horse_images_write_auth" ON public.horse_images FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RESCUES
CREATE POLICY "rescues_read_public" ON public.rescues FOR SELECT USING (true);
CREATE POLICY "rescues_write_auth" ON public.rescues FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RESCUE IMAGES
CREATE POLICY "rescue_images_read_public" ON public.rescue_images FOR SELECT USING (true);
CREATE POLICY "rescue_images_write_auth" ON public.rescue_images FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- RESCUE STORY SECTIONS
CREATE POLICY "rescue_story_read_public" ON public.rescue_story_sections FOR SELECT USING (true);
CREATE POLICY "rescue_story_write_auth" ON public.rescue_story_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- JOURNAL POSTS
CREATE POLICY "journal_read_public" ON public.journal_posts FOR SELECT USING (true);
CREATE POLICY "journal_write_auth" ON public.journal_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- SITE SETTINGS
CREATE POLICY "settings_read_public" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "settings_write_auth" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- CONTACT MESSAGES (Public can ONLY insert. Auth can DO ALL)
CREATE POLICY "contact_insert_public" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_write_auth" ON public.contact_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- PROFILES (Auth can read/write)
CREATE POLICY "profiles_read_auth" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_write_auth" ON public.profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- FIX STORAGE BUCKETS (Drop existing and recreate with proper auth checks)
DROP POLICY IF EXISTS "Public Read Access for horse-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access for rescue-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access for journal-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Access for site-images" ON storage.objects;
DROP POLICY IF EXISTS "Estate Buckets Upload" ON storage.objects;
DROP POLICY IF EXISTS "Estate Buckets Update" ON storage.objects;
DROP POLICY IF EXISTS "Estate Buckets Delete" ON storage.objects;

-- Public Read for Storage
CREATE POLICY "storage_read_public" ON storage.objects FOR SELECT USING (bucket_id IN ('horse-images', 'rescue-images', 'journal-images', 'site-images'));

-- Auth Write for Storage
CREATE POLICY "storage_insert_auth" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('horse-images', 'rescue-images', 'journal-images', 'site-images'));
CREATE POLICY "storage_update_auth" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id IN ('horse-images', 'rescue-images', 'journal-images', 'site-images'));
CREATE POLICY "storage_delete_auth" ON storage.objects FOR DELETE TO authenticated USING (bucket_id IN ('horse-images', 'rescue-images', 'journal-images', 'site-images'));

