-- =====================================================================
-- MONTROSE EQUESTRIAN ESTATE - ALL-IN-ONE SUPABASE SETUP SCRIPT
-- =====================================================================
-- Instructions:
-- 1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/hvxizmruzxtwsspsqmyj/sql/new
-- 2. Paste this entire script into the SQL Editor.
-- 3. Click "RUN" to execute.
-- This creates all tables, public storage buckets, permissive RLS policies, and seed data.
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'admin',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Horses Table
CREATE TABLE IF NOT EXISTS public.horses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    breed TEXT NOT NULL,
    registration_number TEXT,
    sex TEXT NOT NULL CHECK (sex IN ('Stallion', 'Mare', 'Gelding', 'Colt', 'Filly')),
    date_of_birth DATE,
    age INTEGER,
    height TEXT,
    color TEXT,
    discipline TEXT NOT NULL,
    training_level TEXT,
    sire TEXT,
    dam TEXT,
    grand_sire_paternal TEXT,
    grand_dam_paternal TEXT,
    grand_sire_maternal TEXT,
    grand_dam_maternal TEXT,
    location TEXT DEFAULT 'Normandy, France',
    price NUMERIC,
    currency TEXT DEFAULT 'EUR',
    status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Reserved', 'Sold', 'Not Currently Available')),
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    personality TEXT,
    training TEXT,
    competition_history TEXT,
    bloodline TEXT,
    suitability TEXT,
    featured BOOLEAN DEFAULT false NOT NULL,
    published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Horse Images Table
CREATE TABLE IF NOT EXISTS public.horse_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    horse_id UUID NOT NULL REFERENCES public.horses(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0 NOT NULL,
    is_cover BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Rescues Table
CREATE TABLE IF NOT EXISTS public.rescues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    intake_date DATE,
    estimated_age INTEGER,
    breed TEXT,
    color TEXT,
    gender TEXT,
    short_description TEXT NOT NULL,
    story TEXT NOT NULL,
    rehabilitation TEXT NOT NULL,
    current_status TEXT NOT NULL,
    location TEXT DEFAULT 'Montrose Sanctuary, Normandy',
    featured BOOLEAN DEFAULT false NOT NULL,
    published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Rescue Images Table
CREATE TABLE IF NOT EXISTS public.rescue_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rescue_id UUID NOT NULL REFERENCES public.rescues(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0 NOT NULL,
    is_cover BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Rescue Story Sections
CREATE TABLE IF NOT EXISTS public.rescue_story_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rescue_id UUID NOT NULL REFERENCES public.rescues(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    date_label TEXT,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Journal Posts Table
CREATE TABLE IF NOT EXISTS public.journal_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    featured_image TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT 'Henri de Montrose',
    published BOOLEAN DEFAULT true NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    seo_title TEXT,
    seo_description TEXT,
    featured BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    horse_id UUID REFERENCES public.horses(id) ON DELETE SET NULL,
    horse_name TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'estate_settings',
    business_name TEXT NOT NULL DEFAULT 'Montrose Equestrian Estate',
    tagline TEXT NOT NULL DEFAULT 'Exceptional Horses. Thoughtfully Bred.',
    logo_url TEXT,
    email TEXT NOT NULL DEFAULT 'concierge@montrose-equestrian.com',
    phone TEXT NOT NULL DEFAULT '+33 2 31 88 42 10',
    whatsapp TEXT DEFAULT '+33 6 45 20 19 88',
    address TEXT NOT NULL DEFAULT 'Route du Haras 14, 14800 Deauville',
    country TEXT NOT NULL DEFAULT 'France',
    visiting_hours TEXT NOT NULL DEFAULT 'Monday – Saturday: 09:00 to 18:00 (By Private Appointment)',
    instagram_url TEXT DEFAULT 'https://instagram.com/montrose.equestrian',
    facebook_url TEXT DEFAULT 'https://facebook.com/montrose.equestrian',
    youtube_url TEXT DEFAULT 'https://youtube.com/@montroseeffort',
    about_text TEXT NOT NULL,
    footer_text TEXT NOT NULL DEFAULT 'Breeding exceptional horses with patience, purpose and respect.',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horse_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rescues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rescue_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rescue_story_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 11. Policies for Tables (Read / Write Access)
DROP POLICY IF EXISTS "public_horses_select" ON public.horses;
CREATE POLICY "public_horses_select" ON public.horses FOR SELECT USING (true);
DROP POLICY IF EXISTS "public_horses_all" ON public.horses;
CREATE POLICY "public_horses_all" ON public.horses FOR ALL USING (true);

DROP POLICY IF EXISTS "public_horse_images_select" ON public.horse_images;
CREATE POLICY "public_horse_images_select" ON public.horse_images FOR SELECT USING (true);
DROP POLICY IF EXISTS "public_horse_images_all" ON public.horse_images;

DROP POLICY IF EXISTS "public_rescues_select" ON public.rescues;
CREATE POLICY "public_rescues_select" ON public.rescues FOR SELECT USING (true);
DROP POLICY IF EXISTS "public_rescues_all" ON public.rescues;

DROP POLICY IF EXISTS "public_rescue_images_all" ON public.rescue_images;
CREATE POLICY "public_rescue_images_all" ON public.rescue_images FOR ALL USING (true);

DROP POLICY IF EXISTS "public_rescue_story_sections_all" ON public.rescue_story_sections;
CREATE POLICY "public_rescue_story_sections_all" ON public.rescue_story_sections FOR ALL USING (true);

DROP POLICY IF EXISTS "public_journal_posts_select" ON public.journal_posts;
CREATE POLICY "public_journal_posts_select" ON public.journal_posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "public_journal_posts_all" ON public.journal_posts;

DROP POLICY IF EXISTS "public_contact_messages_all" ON public.contact_messages;
CREATE POLICY "public_contact_messages_all" ON public.contact_messages FOR ALL USING (true);

DROP POLICY IF EXISTS "public_site_settings_all" ON public.site_settings;
CREATE POLICY "public_site_settings_all" ON public.site_settings FOR ALL USING (true);

-- 12. Storage Buckets (Public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('horse-images', 'horse-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('rescue-images', 'rescue-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('journal-images', 'journal-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('site-images', 'site-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 13. Storage Policies
DROP POLICY IF EXISTS "Public Read Access for horse-images" ON storage.objects;
CREATE POLICY "Public Read Access for horse-images" ON storage.objects FOR SELECT USING (bucket_id = 'horse-images');

DROP POLICY IF EXISTS "Public Read Access for rescue-images" ON storage.objects;
CREATE POLICY "Public Read Access for rescue-images" ON storage.objects FOR SELECT USING (bucket_id = 'rescue-images');

DROP POLICY IF EXISTS "Public Read Access for journal-images" ON storage.objects;
CREATE POLICY "Public Read Access for journal-images" ON storage.objects FOR SELECT USING (bucket_id = 'journal-images');

DROP POLICY IF EXISTS "Public Read Access for site-images" ON storage.objects;
CREATE POLICY "Public Read Access for site-images" ON storage.objects FOR SELECT USING (bucket_id = 'site-images');

DROP POLICY IF EXISTS "Estate Buckets Upload" ON storage.objects;
CREATE POLICY "Estate Buckets Upload" ON storage.objects FOR INSERT
WITH CHECK (bucket_id IN ('horse-images', 'rescue-images', 'journal-images', 'site-images'));

DROP POLICY IF EXISTS "Estate Buckets Update" ON storage.objects;
CREATE POLICY "Estate Buckets Update" ON storage.objects FOR UPDATE
USING (bucket_id IN ('horse-images', 'rescue-images', 'journal-images', 'site-images'));

DROP POLICY IF EXISTS "Estate Buckets Delete" ON storage.objects;
CREATE POLICY "Estate Buckets Delete" ON storage.objects FOR DELETE
USING (bucket_id IN ('horse-images', 'rescue-images', 'journal-images', 'site-images'));

-- 14. Initial Settings
INSERT INTO public.site_settings (
  id, business_name, tagline, logo_url, email, phone, whatsapp,
  address, country, visiting_hours, instagram_url, facebook_url, youtube_url,
  about_text, footer_text
) VALUES (
  'estate_settings',
  'Montrose Equestrian Estate',
  'Exceptional Horses. Thoughtfully Bred.',
  'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=600&q=80',
  'concierge@montrose-equestrian.com',
  '+33 2 31 88 42 10',
  '+33 6 45 20 19 88',
  'Route du Haras 14, 14800 Deauville',
  'France',
  'Monday – Saturday: 09:00 to 18:00 (By Private Appointment)',
  'https://instagram.com/montrose.equestrian',
  'https://facebook.com/montrose.equestrian',
  'https://youtube.com/@montroseeffort',
  'Founded on the principle of respectful horsemanship and generational lineage, Montrose operates across 180 hectares of protected pasture in the Pays d''Auge. We combine classical training with state-of-the-art veterinary care and biomechanics to produce Warmbloods capable of competing at the highest international levels, while remaining calm, sound, and noble in disposition.',
  'Breeding exceptional horses with patience, purpose and respect.'
) ON CONFLICT (id) DO UPDATE SET updated_at = now();
