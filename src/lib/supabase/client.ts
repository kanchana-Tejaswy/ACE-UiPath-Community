import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Production Supabase Configuration
const DEFAULT_SUPABASE_URL = 'https://ghspsvybzjamapdnjctj.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdoc3BzdnliemphbWFwZG5qY3RqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg4NDUxMzUsImV4cCI6MjEwNDQyMTEzNX0.H6IUyVBIWbiKwwBN6zE8BfrpWgDK6dx7OrhhoaJ8joM';

// Access environment variables safely with Vite fallback
const rawUrl = (import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL).trim();
const rawKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY).trim();

const supabaseUrl = rawUrl.startsWith('http') ? rawUrl : DEFAULT_SUPABASE_URL;
const supabaseAnonKey = rawKey.length > 20 ? rawKey : DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
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
