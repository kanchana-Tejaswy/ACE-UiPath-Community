import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Access environment variables safely with Vite fallback
const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

const supabaseUrl = rawUrl.startsWith('http') ? rawUrl : 'https://placeholder-uipath-ace.supabase.co';
const supabaseAnonKey = rawKey.length > 20 ? rawKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-anon-key';

export const isSupabaseConfigured = () => {
  return (
    Boolean(import.meta.env.VITE_SUPABASE_URL) &&
    Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY) &&
    !supabaseUrl.includes('placeholder')
  );
};

let clientInstance: SupabaseClient;
try {
  clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  });
} catch (err) {
  console.warn('Supabase client initialization fallback to placeholder:', err);
  clientInstance = createClient('https://placeholder-uipath-ace.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder-anon-key');
}

export const supabase = clientInstance;
