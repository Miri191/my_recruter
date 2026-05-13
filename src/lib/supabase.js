import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Soft warning — app falls back to localStorage + AuthGate password.
  console.warn(
    'Supabase credentials missing. App is running in localStorage-only mode.\n' +
      'To enable cloud auth, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY env vars.'
  );
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

export const isSupabaseEnabled = !!supabase;
