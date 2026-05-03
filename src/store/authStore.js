import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useAuthStore = create((set) => ({
  session: null,
  user: null,
  loading: true,
  error: null,

  initialize: async () => {
    const { data, error } = await supabase.auth.getSession();

    set({
      session: data.session ?? null,
      user: data.session?.user ?? null,
      loading: false,
      error: error?.message ?? null,
    });
  },

  bindAuthListener: () => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      set({
        session: session ?? null,
        user: session?.user ?? null,
        loading: false,
        error: null,
      });
    });

    return data.subscription;
  },

  signIn: async ({ email, password }) => {
    set({ loading: true, error: null });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ loading: false, error: error?.message ?? null });
    return { error };
  },

  signUp: async ({ email, password }) => {
    set({ loading: true, error: null });
    const { error } = await supabase.auth.signUp({ email, password });
    set({ loading: false, error: error?.message ?? null });
    return { error };
  },

  signOut: async () => {
    set({ loading: true, error: null });
    const { error } = await supabase.auth.signOut();
    set({
      session: null,
      user: null,
      loading: false,
      error: error?.message ?? null,
    });
    return { error };
  },
}));
