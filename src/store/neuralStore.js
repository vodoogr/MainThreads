import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { huaweiService } from '../services/huaweiService';

export const useNeuralStore = create((set, get) => ({
  circuits: [],
  entries: {},
  allEntries: [], 
  loading: false,
  error: null,
  currentHrv: 75, // Biometric state from Watch
  connectedWatch: null, // { device, status, lastSync, battery }

  clearData: () => {
    set({
      circuits: [],
      entries: {},
      allEntries: [],
      loading: false,
      error: null,
      currentHrv: 75,
      connectedWatch: null,
    });
  },

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
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      set({ entries: {}, allEntries: [], loading: false });
      return;
    }

    const { data, error } = await supabase
      .from('entradas')
      .select('*')
      .eq('user_id', user.id)
      .order('creado_en', { ascending: false });

    if (error) {
      set({ error: error.message, loading: false });
    } else {
      // Group entries by circuit_id (one entry can now appear in multiple circuits)
      const grouped = data.reduce((acc, entry) => {
        // Use the new nodos_vinculados array, fallback to id_circuito
        const targetNodes = entry.nodos_vinculados || [entry.id_circuito];
        
        targetNodes.forEach(cid => {
          if (!cid) return;
          if (!acc[cid]) acc[cid] = [];
          acc[cid].push({
            id: entry.id,
            text: entry.texto,
            intensity: entry.intensidad,
            hrv: entry.hrv,
            date: entry.creado_en,
            allConnected: targetNodes
          });
        });
        return acc;
      }, {});
      
      set({ entries: grouped, allEntries: data, loading: false });
    }
  },

  // Add a single thought connected to multiple nodes
  addEntry: async (circuitIds, text, intensity = 5, hrv = 72) => {
    set({ loading: true });
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      set({ loading: false, error: 'Debes iniciar sesion para guardar entradas.' });
      return { data: null, error: { message: 'Debes iniciar sesion para guardar entradas.' } };
    }

    // Normalize circuitIds to array if it's a single string
    const nodeArray = Array.isArray(circuitIds) ? circuitIds : [circuitIds];
    
    const { data, error } = await supabase
      .from('entradas')
      .insert([
        { 
          user_id: user.id,
          id_circuito: nodeArray[0], // Keep primary for backward compatibility
          nodos_vinculados: nodeArray, 
          texto: text, 
          intensidad: intensity, 
          hrv 
        }
      ])
      .select();

    if (!error) await get().fetchEntries();
    set({ loading: false });
    return { data, error };
  },

  // Update an entry
  updateEntry: async (entryId, updates) => {
    set({ loading: true });
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      set({ loading: false, error: 'Sesion no valida.' });
      return { error: { message: 'Sesion no valida.' } };
    }

    const { error } = await supabase
      .from('entradas')
      .update(updates)
      .eq('id', entryId)
      .eq('user_id', user.id);

    if (!error) await get().fetchEntries();
    set({ loading: false });
    return { error };
  },

  // Delete an entry (Optimistic)
  deleteEntry: async (entryId) => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      return { error: 'Sesion no valida.' };
    }

    // 1. Optimistic Update: Remove from local state immediately
    const previousEntries = get().allEntries;
    const previousGrouped = get().entries;
    
    const newAllEntries = previousEntries.filter(e => e.id !== entryId);
    
    // Re-group locally
    const newGrouped = { ...previousGrouped };
    Object.keys(newGrouped).forEach(cid => {
      newGrouped[cid] = newGrouped[cid].filter(e => e.id !== entryId);
    });

    set({ allEntries: newAllEntries, entries: newGrouped });

    // 2. Database Sync
    const { error } = await supabase
      .from('entradas')
      .delete()
      .eq('id', entryId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error al borrar en Supabase:', error.message);
      // Rollback on error
      set({ allEntries: previousEntries, entries: previousGrouped });
      return { error: error.message };
    }
    
    return { success: true };
  },

  // Huawei Device Management
  syncWatch: async () => {
    set({ loading: true });
    try {
      const data = await huaweiService.connect();
      const liveHrv = await huaweiService.getLiveHrv();
      set({ connectedWatch: data, currentHrv: liveHrv, loading: false });
    } catch (err) {
      set({ error: 'Error sincronizando reloj', loading: false });
    }
  },

  refreshHrv: async () => {
    const liveHrv = await huaweiService.getLiveHrv();
    set({ currentHrv: liveHrv });
  }
}));
