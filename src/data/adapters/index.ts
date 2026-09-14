import { isSupabaseConfigured } from '../../lib/supabase/client';
import { localAdapter } from './localAdapter';
import { supabaseAdapter } from './supabaseAdapter';
import { customRestAdapter } from './customRestAdapter';
import { DataAdapter } from './dataAdapter';

export const getActiveAdapter = (): DataAdapter => {
  const provider = typeof window !== 'undefined' ? (window as any).VITE_DATA_PROVIDER : undefined;
  if (provider === 'rest') return customRestAdapter;
  return isSupabaseConfigured() ? supabaseAdapter : localAdapter;
};

// Dynamic proxy ensuring runtime reactivity to Supabase connection state
export const activeAdapter: DataAdapter = new Proxy({} as DataAdapter, {
  get(_target, prop) {
    const adapter = getActiveAdapter();
    const value = (adapter as any)[prop];
    return typeof value === 'function' ? value.bind(adapter) : value;
  }
});

export { localAdapter, supabaseAdapter, customRestAdapter };
export type { DataAdapter };
