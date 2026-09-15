-- =====================================================================
-- 002_rls_policies.sql
-- Montrose Equestrian Estate - Row Level Security (RLS) Policies
-- =====================================================================

-- Helper function: Check if current user is an admin in profiles table
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horse_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rescues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rescue_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rescue_story_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 2. Profiles policies
CREATE POLICY "Public profiles are viewable by owner or admin"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Admins can manage profiles"
    ON public.profiles FOR ALL
    USING (public.is_admin());

-- 3. Horses policies
CREATE POLICY "Public visitors can read published horses"
    ON public.horses FOR SELECT
    USING (published = true OR public.is_admin());

CREATE POLICY "Admins can insert horses"
    ON public.horses FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update horses"
    ON public.horses FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete horses"
    ON public.horses FOR DELETE
    USING (public.is_admin());

-- 4. Horse Images policies
CREATE POLICY "Public can view images of published horses"
    ON public.horse_images FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.horses
        WHERE horses.id = horse_images.horse_id
        AND (horses.published = true OR public.is_admin())
      )
    );

CREATE POLICY "Admins can manage horse images"
    ON public.horse_images FOR ALL
    USING (public.is_admin());

-- 5. Rescues policies
CREATE POLICY "Public visitors can view published rescue stories"
    ON public.rescues FOR SELECT
    USING (published = true OR public.is_admin());

CREATE POLICY "Admins can manage rescues"
    ON public.rescues FOR ALL
    USING (public.is_admin());

-- 6. Rescue Images and Story Sections
CREATE POLICY "Public can view images of published rescues"
    ON public.rescue_images FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.rescues
        WHERE rescues.id = rescue_images.rescue_id
        AND (rescues.published = true OR public.is_admin())
      )
    );

CREATE POLICY "Admins can manage rescue images"
    ON public.rescue_images FOR ALL
    USING (public.is_admin());

CREATE POLICY "Public can view story sections of published rescues"
    ON public.rescue_story_sections FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM public.rescues
        WHERE rescues.id = rescue_story_sections.rescue_id
        AND (rescues.published = true OR public.is_admin())
      )
    );

CREATE POLICY "Admins can manage rescue story sections"
    ON public.rescue_story_sections FOR ALL
    USING (public.is_admin());

-- 7. Journal Posts policies
CREATE POLICY "Public can view published journal posts"
    ON public.journal_posts FOR SELECT
    USING (published = true OR public.is_admin());

CREATE POLICY "Admins can manage journal posts"
    ON public.journal_posts FOR ALL
    USING (public.is_admin());

-- 8. Contact Enquiries policies
-- Anyone can submit an enquiry, but only admins can read or manage
CREATE POLICY "Public can submit contact enquiries"
    ON public.contact_messages FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can view contact enquiries"
    ON public.contact_messages FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Admins can update contact enquiries"
    ON public.contact_messages FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete contact enquiries"
    ON public.contact_messages FOR DELETE
    USING (public.is_admin());

-- 9. Site Settings policies
CREATE POLICY "Public can view site settings"
    ON public.site_settings FOR SELECT
    USING (true);

CREATE POLICY "Admins can update site settings"
    ON public.site_settings FOR ALL
    USING (public.is_admin());
