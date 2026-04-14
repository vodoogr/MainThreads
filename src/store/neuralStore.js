import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export const useNeuralStore = create((set, get) => ({
  circuits: [],
  entries: {},
  loading: false,
  error: null,

  // Fetch all circuits
  fetchCircuits: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('circuitos')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching circuits from Supabase:', error.message);
      set({ error: error.message, loading: false });
    } else {
      console.log('Successfully fetched circuits:', data.length);
      set({ circuits: data, loading: false });
    }
  },

  // Fetch all entries (hilos)
  fetchEntries: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('entradas')
      .select('*')
      .order('creado_en', { ascending: false });

    if (error) {
      set({ error: error.message, loading: false });
    } else {
      // Group entries by circuit_id for the graph to consume easily
      const grouped = data.reduce((acc, entry) => {
        const cid = entry.id_circuito;
        if (!acc[cid]) acc[cid] = [];
        acc[cid].push({
          id: entry.id,
          text: entry.texto,
          intensity: entry.intensidad
        });
        return acc;
      }, {});
      
      set({ entries: grouped, loading: false });
    }
  },

  // Add a new thought (hilo)
  addEntry: async (circuitId, text, intensity = 5) => {
    const { data, error } = await supabase
      .from('entradas')
      .insert([
        { id_circuito: circuitId, texto: text, intensidad: intensity }
      ])
      .select();

    if (!error) {
      // Refresh entries locally
      get().fetchEntries();
    }
    return { data, error };
  }
}));
