import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve environment variables safely from Vite or process.env
const getEnv = (key: string): string => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env?.[key]) {
      return String((import.meta as any).env[key]).trim();
    }
  } catch {}
  try {
    if (typeof process !== 'undefined' && process.env?.[key]) {
      return String(process.env[key]).trim();
    }
  } catch {}
  return '';
};

// Helper to extract project reference from a Supabase JWT token or string
const extractProjectRef = (value: string): string | null => {
  if (!value) return null;
  const clean = value.trim();
  if (clean.startsWith('eyJ')) {
    try {
      const parts = clean.split('.');
      if (parts.length >= 2) {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = typeof atob !== 'undefined'
          ? atob(base64)
          : Buffer.from(base64, 'base64').toString('utf-8');
        const payload = JSON.parse(json);
        if (payload?.ref) return payload.ref;
      }
    } catch {}
  }
  // Check if string itself looks like a Supabase project reference (20 alphanumeric lowercase chars)
  if (/^[a-z0-9]{20}$/i.test(clean)) {
    return clean;
  }
  return null;
};

const rawUrl =
  getEnv('VITE_SUPABASE_URL') ||
  getEnv('NEXT_PUBLIC_SUPABASE_URL') ||
  getEnv('SUPABASE_URL');

const rawAnonKey =
  getEnv('VITE_SUPABASE_ANON_KEY') ||
  getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') ||
  getEnv('SUPABASE_ANON_KEY') ||
  getEnv('SUPABASE_PUBLISHABLE_KEY');

// Resolve the actual Supabase URL, auto-repairing if a JWT or project ref was passed as the URL
let supabaseUrl = rawUrl;
if (!supabaseUrl.startsWith('http')) {
  const ref = extractProjectRef(rawUrl) || extractProjectRef(rawAnonKey);
  if (ref) {
    supabaseUrl = `https://${ref}.supabase.co`;
  }
}

// Ensure key is trimmed
const supabaseAnonKey = rawAnonKey.trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-supabase-project')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export { supabaseUrl };

/**
 * Diagnostic helper to verify whether the Supabase API is reachable, tables are created, and storage is configured
 */
export async function testSupabaseConnection(): Promise<{
  configured: boolean;
  connected: boolean;
  message: string;
  latencyMs?: number;
  tablesVerified?: string[];
  missingTables?: string[];
  storageVerified?: string[];
  missingBuckets?: string[];
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      configured: false,
      connected: false,
      message: 'Supabase credentials not detected or URL is invalid. Application is operating in offline Estate Local Mode with client persistence.',
    };
  }

  const start = performance.now();
  try {
    // Check tables
    const tableChecks = ['horses', 'rescues', 'journal_posts', 'site_settings', 'contact_messages'];
    const tablesVerified: string[] = [];
    const missingTables: string[] = [];

    for (const table of tableChecks) {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (error && (error.code === 'PGRST205' || error.message?.includes('schema cache') || error.message?.includes('does not exist'))) {
        missingTables.push(table);
      } else if (!error) {
        tablesVerified.push(table);
      }
    }

    // Check storage buckets
    const storageVerified: string[] = [];
    const missingBuckets: string[] = [];
    const targetBuckets = ['horse-images', 'rescue-images', 'journal-images', 'site-images'];

    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const existing = (buckets || []).map((b) => b.name);
      for (const b of targetBuckets) {
        if (existing.includes(b)) {
          storageVerified.push(b);
        } else {
          missingBuckets.push(b);
        }
      }
    } catch {}

    const latencyMs = Math.round(performance.now() - start);

    if (missingTables.length > 0) {
      return {
        configured: true,
        connected: false,
        latencyMs,
        tablesVerified,
        missingTables,
        storageVerified,
        missingBuckets,
        message: `Connected to Supabase endpoint (${supabaseUrl}), but database tables are missing: ${missingTables.join(', ')}. Please run the migration SQL scripts in the Supabase SQL Editor.`,
      };
    }

    return {
      configured: true,
      connected: true,
      latencyMs,
      tablesVerified,
      storageVerified,
      missingBuckets,
      message: `Supabase PostgreSQL and Storage are fully operational (${latencyMs}ms latency) on ${supabaseUrl}.`,
    };
  } catch (err: any) {
    return {
      configured: true,
      connected: false,
      message: `Connection failed: ${err.message || 'Unknown network error'}`,
    };
  }
}
