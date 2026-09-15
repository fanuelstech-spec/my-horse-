import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Horse,
  Rescue,
  JournalPost,
  SiteSettings,
  ContactMessage,
  Profile,
} from '../types/database';
import {
  INITIAL_HORSES,
  INITIAL_RESCUES,
  INITIAL_JOURNAL,
  INITIAL_MESSAGES,
  INITIAL_SITE_SETTINGS,
} from '../data/seedData';
import { supabase, isSupabaseConfigured, testSupabaseConnection } from './supabase';

interface EstateContextType {
  // State
  horses: Horse[];
  rescues: Rescue[];
  journal: JournalPost[];
  messages: ContactMessage[];
  settings: SiteSettings;
  currentUser: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  isConfiguredWithSupabase: boolean;

  // Connection testing
  testConnection: () => Promise<{
    configured: boolean;
    connected: boolean;
    message: string;
    latencyMs?: number;
    tablesVerified?: string[];
  }>;

  // Horse Actions
  saveHorse: (horse: Partial<Horse> & { name: string; breed: string; discipline: string; sex: Horse['sex'] }) => Promise<Horse>;
  deleteHorse: (id: string) => Promise<void>;
  getHorseBySlug: (slug: string) => Horse | undefined;

  // Rescue Actions
  saveRescue: (rescue: Partial<Rescue> & { name: string; short_description: string; story: string }) => Promise<Rescue>;
  deleteRescue: (id: string) => Promise<void>;
  getRescueBySlug: (slug: string) => Rescue | undefined;

  // Journal Actions
  saveJournalPost: (post: Partial<JournalPost> & { title: string; excerpt: string; content: string }) => Promise<JournalPost>;
  deleteJournalPost: (id: string) => Promise<void>;
  getJournalPostBySlug: (slug: string) => JournalPost | undefined;

  // Contact / Enquiry Actions
  submitEnquiry: (data: { name: string; email: string; phone?: string; subject: string; message: string; horse_name?: string; horse_id?: string }) => Promise<ContactMessage>;
  updateMessageStatus: (id: string, status: ContactMessage['status']) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;

  // Settings Actions
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;

  // Auth Actions
  loginAsAdmin: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;

  // Storage / Upload helper
  uploadImage: (file: File, bucket: 'horse-images' | 'rescue-images' | 'journal-images' | 'site-images') => Promise<string>;
}

const EstateContext = createContext<EstateContextType | undefined>(undefined);

const STORAGE_KEY_HORSES = 'sterling_horses_v1';
const STORAGE_KEY_RESCUES = 'sterling_rescues_v1';
const STORAGE_KEY_JOURNAL = 'sterling_journal_v1';
const STORAGE_KEY_MESSAGES = 'sterling_messages_v1';
const STORAGE_KEY_SETTINGS = 'sterling_settings_v1';
const STORAGE_KEY_AUTH = 'sterling_auth_v1';

export const EstateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [horses, setHorses] = useState<Horse[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HORSES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading saved horses:', e);
    }
    return INITIAL_HORSES;
  });

  const [rescues, setRescues] = useState<Rescue[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RESCUES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading saved rescues:', e);
    }
    return INITIAL_RESCUES;
  });

  const [journal, setJournal] = useState<JournalPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_JOURNAL);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading saved journal:', e);
    }
    return INITIAL_JOURNAL;
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Error reading saved messages:', e);
    }
    return INITIAL_MESSAGES;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      }
    } catch (e) {
      console.warn('Error reading saved settings:', e);
    }
    return INITIAL_SITE_SETTINGS;
  });

  const [currentUser, setCurrentUser] = useState<Profile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_HORSES, JSON.stringify(horses));
  }, [horses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_RESCUES, JSON.stringify(rescues));
  }, [rescues]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_JOURNAL, JSON.stringify(journal));
  }, [journal]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    }
  }, [currentUser]);

  // Helper UUID validator and generator
  const isValidUUID = (str?: string | null): boolean => {
    if (!str) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
  };

  const generateUUID = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  // If Supabase is configured, initialize listener or fetch initial data
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    const fetchFromSupabase = async () => {
      setIsLoading(true);
      try {
        const [horsesRes, rescuesRes, journalRes, settingsRes] = await Promise.all([
          supabase.from('horses').select('*, images:horse_images(*)').order('created_at', { ascending: false }),
          supabase.from('rescues').select('*, images:rescue_images(*), story_sections:rescue_story_sections(*)').order('created_at', { ascending: false }),
          supabase.from('journal_posts').select('*').order('created_at', { ascending: false }),
          supabase.from('site_settings').select('*').eq('id', 'estate_settings').maybeSingle(),
        ]);

        if (horsesRes.data && horsesRes.data.length > 0) {
          setHorses(horsesRes.data);
        }
        if (rescuesRes.data && rescuesRes.data.length > 0) {
          setRescues(rescuesRes.data);
        }
        if (journalRes.data && journalRes.data.length > 0) {
          setJournal(journalRes.data);
        }
        if (settingsRes.data) {
          setSettings(settingsRes.data);
        }

        // Check active Supabase auth session
        const { data: authData } = await supabase.auth.getSession();
        if (authData.session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.session.user.id)
            .maybeSingle();

          if (profile) {
            setCurrentUser(profile);
            if (profile.role === 'admin') {
              const { data: msgs } = await supabase
                .from('contact_messages')
                .select('*')
                .order('created_at', { ascending: false });
              if (msgs && msgs.length > 0) {
                setMessages(msgs);
              }
            }
          } else {
            setCurrentUser({
              id: authData.session.user.id,
              email: authData.session.user.email || 'admin@sterling.com',
              full_name: 'Estate Director',
              role: 'admin',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          }
        }
      } catch (err) {
        console.warn('Supabase fetch error, fallback to estate store:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFromSupabase();

    // Subscribe to auth state updates
    const { data: authSub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        if (profile) {
          setCurrentUser(profile);
        }
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null);
      }
    });

    return () => {
      authSub?.subscription?.unsubscribe();
    };
  }, []);

  // Helper slug generator
  const createSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  // 1. Horses CRUD
  const saveHorse = useCallback(
    async (horseData: Partial<Horse> & { name: string; breed: string; discipline: string; sex: Horse['sex'] }) => {
      const slug = horseData.slug || createSlug(horseData.name);
      const isNew = !horseData.id;
      const id = horseData.id && isValidUUID(horseData.id) ? horseData.id : (horseData.id || generateUUID());
      const now = new Date().toISOString();

      const newHorse: Horse = {
        id,
        name: horseData.name,
        slug,
        breed: horseData.breed,
        registration_number: horseData.registration_number || null,
        sex: horseData.sex,
        date_of_birth: horseData.date_of_birth || null,
        age: horseData.age !== undefined ? Number(horseData.age) : null,
        height: horseData.height || null,
        color: horseData.color || null,
        discipline: horseData.discipline,
        training_level: horseData.training_level || null,
        sire: horseData.sire || null,
        dam: horseData.dam || null,
        grand_sire_paternal: horseData.grand_sire_paternal || null,
        grand_dam_paternal: horseData.grand_dam_paternal || null,
        grand_sire_maternal: horseData.grand_sire_maternal || null,
        grand_dam_maternal: horseData.grand_dam_maternal || null,
        location: horseData.location || 'Normandy Main Barn',
        price: horseData.price !== undefined && horseData.price !== null ? Number(horseData.price) : null,
        currency: horseData.currency || 'EUR',
        status: horseData.status || 'Available',
        short_description: horseData.short_description || '',
        description: horseData.description || '',
        personality: horseData.personality || null,
        training: horseData.training || null,
        competition_history: horseData.competition_history || null,
        bloodline: horseData.bloodline || null,
        suitability: horseData.suitability || null,
        featured: horseData.featured ?? false,
        published: horseData.published ?? true,
        created_at: horseData.created_at || now,
        updated_at: now,
        images: horseData.images || [],
      };

      setHorses((prev) => {
        const exists = prev.some((h) => h.id === id);
        if (exists) {
          return prev.map((h) => (h.id === id ? newHorse : h));
        }
        return [newHorse, ...prev];
      });

      if (isSupabaseConfigured && supabase) {
        try {
          const payload = { ...newHorse };
          delete (payload as any).images;
          if (isNew) {
            const { error } = await supabase.from('horses').insert(payload);
            if (error) throw error;
          } else {
            const { error } = await supabase.from('horses').update(payload).eq('id', id);
            if (error) throw error;
          }

          // Synchronize relational horse_images in Supabase
          if (newHorse.images && newHorse.images.length > 0) {
            await supabase.from('horse_images').delete().eq('horse_id', id);
            const imagePayloads = newHorse.images.map((img, idx) => ({
              id: isValidUUID(img.id) ? img.id : generateUUID(),
              horse_id: id,
              url: img.url,
              caption: img.caption || null,
              display_order: img.display_order ?? idx,
              is_cover: img.is_cover ?? idx === 0,
            }));
            const { error: imgErr } = await supabase.from('horse_images').insert(imagePayloads);
            if (imgErr) console.warn('Supabase horse images sync warning:', imgErr);
          }
        } catch (e: any) {
          console.error('Supabase horse sync failed:', e);
          throw new Error(
            `Supabase error saving horse: ${e.message || 'Database error'}. Ensure table "public.horses" exists (run /supabase/FULL_SETUP.sql in Supabase SQL editor).`
          );
        }
      }

      return newHorse;
    },
    []
  );

  const deleteHorse = useCallback(async (id: string) => {
    setHorses((prev) => prev.filter((h) => h.id !== id));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('horses').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase delete failed:', e);
      }
    }
  }, []);

  const getHorseBySlug = useCallback(
    (slugOrId: string) => {
      if (!slugOrId) return undefined;
      const clean = slugOrId.toLowerCase().trim();
      return (
        horses.find(
          (h) =>
            h.slug === slugOrId ||
            h.id === slugOrId ||
            h.slug?.toLowerCase() === clean ||
            h.id?.toLowerCase() === clean ||
            createSlug(h.name) === clean
        ) || undefined
      );
    },
    [horses]
  );

  // 2. Rescues CRUD
  const saveRescue = useCallback(
    async (rescueData: Partial<Rescue> & { name: string; short_description: string; story: string }) => {
      const slug = rescueData.slug || createSlug(rescueData.name);
      const isNew = !rescueData.id;
      const id = rescueData.id && isValidUUID(rescueData.id) ? rescueData.id : (rescueData.id || generateUUID());
      const now = new Date().toISOString();

      const newRescue: Rescue = {
        id,
        name: rescueData.name,
        slug,
        rescue_date: rescueData.rescue_date || now.split('T')[0],
        status: rescueData.status || 'In Rehabilitation',
        short_description: rescueData.short_description,
        story: rescueData.story,
        rehabilitation: rescueData.rehabilitation || '',
        current_status: rescueData.current_status || '',
        location: rescueData.location || 'Sterling Sanctuary, Normandy',
        featured: rescueData.featured ?? false,
        published: rescueData.published ?? true,
        created_at: rescueData.created_at || now,
        updated_at: now,
        images: rescueData.images || [],
        story_sections: rescueData.story_sections || [],
      };

      setRescues((prev) => {
        const exists = prev.some((r) => r.id === id);
        if (exists) {
          return prev.map((r) => (r.id === id ? newRescue : r));
        }
        return [newRescue, ...prev];
      });

      if (isSupabaseConfigured && supabase) {
        try {
          const payload = { ...newRescue };
          delete (payload as any).images;
          delete (payload as any).story_sections;
          if (isNew) {
            const { error } = await supabase.from('rescues').insert(payload);
            if (error) throw error;
          } else {
            const { error } = await supabase.from('rescues').update(payload).eq('id', id);
            if (error) throw error;
          }

          // Synchronize relational rescue_images in Supabase
          if (newRescue.images && newRescue.images.length > 0) {
            await supabase.from('rescue_images').delete().eq('rescue_id', id);
            const imagePayloads = newRescue.images.map((img, idx) => ({
              id: isValidUUID(img.id) ? img.id : generateUUID(),
              rescue_id: id,
              url: img.url,
              caption: img.caption || null,
              display_order: img.display_order ?? idx,
              is_cover: img.is_cover ?? idx === 0,
            }));
            const { error: imgErr } = await supabase.from('rescue_images').insert(imagePayloads);
            if (imgErr) console.warn('Supabase rescue images sync warning:', imgErr);
          }

          // Synchronize relational rescue_story_sections in Supabase
          if (newRescue.story_sections && newRescue.story_sections.length > 0) {
            await supabase.from('rescue_story_sections').delete().eq('rescue_id', id);
            const sectionPayloads = newRescue.story_sections.map((sec, idx) => ({
              id: isValidUUID(sec.id) ? sec.id : generateUUID(),
              rescue_id: id,
              title: sec.title,
              content: sec.content,
              date_label: sec.date_label || sec.date || sec.stage_date || null,
              display_order: sec.display_order ?? sec.order ?? idx,
            }));
            const { error: secErr } = await supabase.from('rescue_story_sections').insert(sectionPayloads);
            if (secErr) console.warn('Supabase rescue sections sync warning:', secErr);
          }
        } catch (e: any) {
          console.error('Supabase rescue sync failed:', e);
          throw new Error(
            `Supabase error saving rescue: ${e.message || 'Database error'}. Ensure table "public.rescues" exists (run /supabase/FULL_SETUP.sql in Supabase SQL editor).`
          );
        }
      }

      return newRescue;
    },
    []
  );

  const deleteRescue = useCallback(async (id: string) => {
    setRescues((prev) => prev.filter((r) => r.id !== id));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('rescues').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase rescue delete failed:', e);
      }
    }
  }, []);

  const getRescueBySlug = useCallback(
    (slugOrId: string) => {
      if (!slugOrId) return undefined;
      const clean = slugOrId.toLowerCase().trim();
      return (
        rescues.find(
          (r) =>
            r.slug === slugOrId ||
            r.id === slugOrId ||
            r.slug?.toLowerCase() === clean ||
            r.id?.toLowerCase() === clean ||
            createSlug(r.name) === clean
        ) || undefined
      );
    },
    [rescues]
  );

  // 3. Journal CRUD
  const saveJournalPost = useCallback(
    async (postData: Partial<JournalPost> & { title: string; excerpt: string; content: string }) => {
      const slug = postData.slug || createSlug(postData.title);
      const isNew = !postData.id;
      const id = postData.id && isValidUUID(postData.id) ? postData.id : (postData.id || generateUUID());
      const now = new Date().toISOString();

      const newPost: JournalPost = {
        id,
        title: postData.title,
        slug,
        excerpt: postData.excerpt,
        content: postData.content,
        category: postData.category || 'Breeding',
        featured_image: postData.featured_image || 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1600&q=85',
        author: postData.author || 'Henri Sterling',
        published: postData.published ?? true,
        published_at: postData.published_at || now,
        seo_title: postData.seo_title || `${postData.title} | Sterling Horse Sales`,
        seo_description: postData.seo_description || postData.excerpt,
        featured: postData.featured ?? false,
        created_at: postData.created_at || now,
        updated_at: now,
      };

      setJournal((prev) => {
        const exists = prev.some((p) => p.id === id);
        if (exists) {
          return prev.map((p) => (p.id === id ? newPost : p));
        }
        return [newPost, ...prev];
      });

      if (isSupabaseConfigured && supabase) {
        try {
          if (isNew) {
            const { error } = await supabase.from('journal_posts').insert(newPost);
            if (error) throw error;
          } else {
            const { error } = await supabase.from('journal_posts').update(newPost).eq('id', id);
            if (error) throw error;
          }
        } catch (e: any) {
          console.error('Supabase journal sync failed:', e);
          throw new Error(
            `Supabase error saving article: ${e.message || 'Database error'}. Ensure table "public.journal_posts" exists (run /supabase/FULL_SETUP.sql in Supabase SQL editor).`
          );
        }
      }

      return newPost;
    },
    []
  );

  const deleteJournalPost = useCallback(async (id: string) => {
    setJournal((prev) => prev.filter((p) => p.id !== id));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('journal_posts').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase journal delete failed:', e);
      }
    }
  }, []);

  const getJournalPostBySlug = useCallback(
    (slugOrId: string) => {
      if (!slugOrId) return undefined;
      const clean = slugOrId.toLowerCase().trim();
      return (
        journal.find(
          (p) =>
            p.slug === slugOrId ||
            p.id === slugOrId ||
            p.slug?.toLowerCase() === clean ||
            p.id?.toLowerCase() === clean ||
            createSlug(p.title) === clean
        ) || undefined
      );
    },
    [journal]
  );

  // 4. Contact Enquiries
  const submitEnquiry = useCallback(
    async (data: { name: string; email: string; phone?: string; subject: string; message: string; horse_name?: string; horse_id?: string }) => {
      const id = generateUUID();
      const newMsg: ContactMessage = {
        id,
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
        horse_name: data.horse_name || null,
        horse_id: data.horse_id && isValidUUID(data.horse_id) ? data.horse_id : null,
        status: 'new',
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [newMsg, ...prev]);

      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('contact_messages').insert(newMsg);
        } catch (e) {
          console.error('Supabase enquiry submit failed:', e);
        }
      }

      return newMsg;
    },
    []
  );

  const updateMessageStatus = useCallback(async (id: string, status: ContactMessage['status']) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status, updated_at: new Date().toISOString() } : m)));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('contact_messages').update({ status }).eq('id', id);
      } catch (e) {
        console.error('Supabase message update failed:', e);
      }
    }
  }, []);

  const deleteMessage = useCallback(async (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('contact_messages').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase message delete failed:', e);
      }
    }
  }, []);

  // 5. Settings
  const updateSettings = useCallback(async (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings, updated_at: new Date().toISOString() };
      return updated;
    });

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('site_settings').upsert({ id: 'estate_settings', ...newSettings });
      } catch (e) {
        console.error('Supabase settings update failed:', e);
      }
    }
  }, []);

  // 6. Authentication
  const loginAsAdmin = useCallback(async (email: string, password?: string) => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Database is not configured. Please add Supabase credentials.' };
    }
    
    if (!password) {
      return { success: false, error: 'Password is required.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        const userProfile: Profile = profile || {
          id: data.user.id,
          email: data.user.email || email,
          full_name: 'Estate Director',
          role: 'admin',
          created_at: data.user.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setCurrentUser(userProfile);

        // Fetch contact messages from Supabase for authenticated admin
        const { data: msgs } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });
        if (msgs && msgs.length > 0) {
          setMessages(msgs);
        }

        return { success: true };
      }
      return { success: false, error: 'Login failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  }, []);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Sign out error:', e);
      }
    }
    setCurrentUser(null);
  }, []);

  // 7. Image Upload Helper
  const uploadImage = useCallback(
    async (file: File, bucket: 'horse-images' | 'rescue-images' | 'journal-images' | 'site-images'): Promise<string> => {
      // If Supabase is connected, upload to Supabase storage bucket
      if (isSupabaseConfigured && supabase) {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

        if (uploadError) {
          console.error('Supabase storage upload error:', uploadError);
          throw new Error(
            `Supabase Storage upload to "${bucket}" failed: ${uploadError.message}. Make sure the bucket exists and policies allow uploads (run /supabase/FULL_SETUP.sql in Supabase SQL editor).`
          );
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        if (data?.publicUrl) {
          return data.publicUrl;
        }
      }

      // Offline / client-side image reader for preview mode
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
    },
    []
  );

  return (
    <EstateContext.Provider
      value={{
        horses,
        rescues,
        journal,
        messages,
        settings,
        currentUser,
        isAdmin: currentUser?.role === 'admin',
        isLoading,
        isConfiguredWithSupabase: isSupabaseConfigured,
        saveHorse,
        deleteHorse,
        getHorseBySlug,
        saveRescue,
        deleteRescue,
        getRescueBySlug,
        saveJournalPost,
        deleteJournalPost,
        getJournalPostBySlug,
        submitEnquiry,
        updateMessageStatus,
        deleteMessage,
        updateSettings,
        loginAsAdmin,
        logout,
        uploadImage,
        testConnection: testSupabaseConnection,
      }}
    >
      {children}
    </EstateContext.Provider>
  );
};

export const useEstate = () => {
  const context = useContext(EstateContext);
  if (!context) {
    throw new Error('useEstate must be used within an EstateProvider');
  }
  return context;
};
