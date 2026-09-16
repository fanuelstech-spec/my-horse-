/**
 * Database & Domain Types for Sterling Horse Sales
 */

export type HorseSex = 'Stallion' | 'Mare' | 'Gelding' | 'Colt' | 'Filly';
export type HorseStatus = 'Available' | 'Reserved' | 'Sold' | 'Not Currently Available';
export type RescueStatus = 'In Rehabilitation' | 'Looking for a Home' | 'Permanently Rehomed' | 'Sanctuary' | 'Adopted';
export type JournalCategory = 'Breeding' | 'Training' | 'Horse Care' | 'Rescue' | 'News' | 'Behind the Stable' | 'Bloodlines';
export type MessageStatus = 'new' | 'read' | 'replied' | 'archived';
export type UserRole = 'admin' | 'editor' | 'visitor';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface HorseImage {
  id: string;
  horse_id: string;
  url: string;
  caption?: string | null;
  display_order: number;
  is_cover: boolean;
  created_at?: string;
}

export interface Horse {
  id: string;
  name: string;
  slug: string;
  breed: string;
  registration_number?: string | null;
  sex: HorseSex;
  date_of_birth?: string | null;
  age?: number | null;
  height?: string | null;
  color?: string | null;
  discipline: string;
  training_level?: string | null;
  sire?: string | null;
  dam?: string | null;
  grand_sire_paternal?: string | null;
  grand_dam_paternal?: string | null;
  grand_sire_maternal?: string | null;
  grand_dam_maternal?: string | null;
  location?: string | null;
  price?: number | null;
  currency?: string | null;
  status: HorseStatus;
  short_description: string;
  description: string;
  personality?: string | null;
  training?: string | null;
  competition_history?: string | null;
  bloodline?: string | null;
  suitability?: string | null;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
  images?: HorseImage[];
}

export interface RescueImage {
  id: string;
  rescue_id: string;
  url: string;
  caption?: string | null;
  display_order: number;
  is_cover: boolean;
  created_at?: string;
}

export interface RescueStorySection {
  id: string;
  rescue_id: string;
  title: string;
  content: string;
  date_label?: string | null;
  date?: string | null;
  stage_date?: string | null;
  image_url?: string | null;
  display_order?: number;
  order?: number;
  created_at?: string;
}

export interface Rescue {
  id: string;
  name: string;
  slug: string;
  rescue_date: string;
  status: RescueStatus;
  short_description: string;
  story: string;
  rehabilitation: string;
  current_status: string;
  location?: string | null;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
  images?: RescueImage[];
  story_sections?: RescueStorySection[];
}

export interface JournalPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: JournalCategory;
  featured_image: string;
  author: string;
  published: boolean;
  published_at?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  horse_id?: string | null;
  horse_name?: string | null;
  status: MessageStatus;
  created_at: string;
  updated_at?: string;
}

export interface SiteSettings {
  id: string;
  business_name: string;
  tagline: string;
  logo_url?: string | null;
  email: string;
  phone: string;
  whatsapp?: string | null;
  address: string;
  country: string;
  visiting_hours: string;
  instagram_url?: string | null;
  facebook_url?: string | null;
  youtube_url?: string | null;
  about_text: string;
  footer_text: string;
  about_image_1?: string | null;
  about_image_2?: string | null;
  about_image_3?: string | null;
  about_image_4?: string | null;
  updated_at?: string;
}

export interface SuccessStory {
  id: string;
  buyer_name: string;
  horse_name: string;
  location?: string | null;
  testimonial: string;
  image_url?: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}
