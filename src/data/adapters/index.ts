import { isSupabaseConfigured } from '../../lib/supabase/client';
import { localAdapter } from './localAdapter';
import { supabaseAdapter } from './supabaseAdapter';
import { customRestAdapter } from './customRestAdapter';
import { DataAdapter } from './dataAdapter';

const provider = typeof window !== 'undefined' ? (window as any).VITE_DATA_PROVIDER : undefined;

export const activeAdapter: DataAdapter = 
  provider === 'rest' 
    ? customRestAdapter 
    : isSupabaseConfigured() 
      ? supabaseAdapter 
      : localAdapter;

export { localAdapter, supabaseAdapter, customRestAdapter };
export type { DataAdapter };
