import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL: Supabase URL or Anon Key missing in .env file. Real-time sync will fail.');
} else {
  console.log('Supabase Initialized: Connecting to', supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
