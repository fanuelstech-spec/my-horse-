-- =====================================================================
-- 001_initial_schema.sql
-- Montrose Equestrian Estate - Initial Database Schema
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles & Admin Roles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'visitor' CHECK (role IN ('admin', 'editor', 'visitor')),
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
    rescue_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'In Rehabilitation' CHECK (status IN ('In Rehabilitation', 'Looking for a Home', 'Permanently Rehomed', 'Sanctuary', 'Adopted')),
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

-- 6. Rescue Story Timeline Sections
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
    category TEXT NOT NULL CHECK (category IN ('Breeding', 'Training', 'Horse Care', 'Rescue', 'News', 'Behind the Stable', 'Bloodlines')),
    featured_image TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT 'Henri de Montrose',
    published BOOLEAN DEFAULT true NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    seo_title TEXT,
    seo_description TEXT,
    featured BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Contact & Private Enquiries Table
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

-- 9. Site Settings (Single row or keyed settings)
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
