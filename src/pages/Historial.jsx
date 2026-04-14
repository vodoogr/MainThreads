import { useState, useEffect } from 'react';
import ScreenContainer from '../components/ScreenContainer';
import { useNeuralStore } from '../store/neuralStore';
import { historialData } from '../data/mockData';

export default function Historial() {
  const { allEntries = [], fetchEntries, fetchCircuits, deleteEntry, updateEntry, circuits = [], loading } = useNeuralStore();
  const [selectedDay, setSelectedDay] = useState(12);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const data = historialData || { weekdays: [], days: [], heatmapBars: [], heatmapMonths: [] };

  useEffect(() => {
    fetchEntries();
    fetchCircuits();
  }, []);

  const getActivityStyle = (activity, day) => {
    const isSelected = day === selectedDay;
    const base = {
      aspectRatio: '1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-lg)',
      cursor: activity > 0 ? 'pointer' : 'default',
      transition: 'all 0.2s',
      border: '1px solid transparent',
      fontSize: '0.875rem',
    };
    if (isSelected) return { ...base, background: 'var(--surface-container-high)', border: '2px solid var(--primary)', color: 'var(--primary)', fontWeight: 700 };
    return { ...base, background: activity > 0 ? 'var(--surface-container-high)' : 'var(--surface-container-low)', color: activity > 0 ? 'var(--on-surface)' : 'rgba(231,229,228,0.4)' };
  };

  return (
    <ScreenContainer>
      <div className="section-gap" style={{ paddingTop: '2rem', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Loading Overlay */}
        {loading && allEntries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--primary)' }} className="label-xs">
            Sincronizando con la red neural...
          </div>
        )}

        {/* Calendar - Safe Render */}
        <section>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 300, color: 'var(--on-surface)', marginBottom: '1.5rem' }}>
            {data.currentMonth || 'Historial'} <span style={{ opacity: 0.5 }}>{data.currentYear}</span>
          </h1>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
            {data.weekdays?.map(wd => <div key={wd} className="label-xs" style={{ textAlign: 'center', opacity: 0.5 }}>{wd}</div>)}
            {data.days?.map(({ day, activity }) => (
              <div key={day} style={getActivityStyle(activity, day)} onClick={() => activity > 0 && setSelectedDay(day)}>
                {day}
              </div>
            ))}
          </div>
        </section>

        {/* Entries List - The Core */}
        <section style={{ marginTop: '3rem' }}>
          <h2 className="label-xs" style={{ color: 'var(--outline)', marginBottom: '1.5rem' }}>Hilos de Pensamiento</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {allEntries.length > 0 ? allEntries.map((entry) => {
              const circuit = circuits.find(c => c.id === entry.id_circuito);
              const circuitName = circuit ? circuit.nombre : 'Nodo General';
              const date = entry.creado_en ? new Date(entry.creado_en) : new Date();
              const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
              const dayNum = date.getDate();
              const stressColor = (entry.hrv || 72) > 85 ? '#00ffcc' : (entry.hrv || 72) > 65 ? '#ffeb3b' : '#fa746f';

              return (
                <div key={entry.id} className="card animate-fade-in" style={{ padding: '1.25rem', borderRadius: 'var(--radius-3xl)', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: `4px solid ${stressColor}` }}>
                  <div style={{ textAlign: 'center', width: 40 }}>
                    <div style={{ fontSize: '0.6rem', opacity: 0.6 }}>{dayName}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 300 }}>{dayNum}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    {editingId === entry.id ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input value={editText} onChange={e => setEditText(e.target.value)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--primary)', color: 'white', padding: '8px', borderRadius: 8 }} />
                        <button onClick={async () => { await updateEntry(entry.id, { texto: editText }); setEditingId(null); }} className="btn-primary" style={{ padding: '4px 12px' }}>OK</button>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: '1rem', color: 'var(--on-surface)' }}>{entry.texto}</div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                           <span className="label-xs" style={{ color: 'var(--primary)', background: 'rgba(137,212,205,0.1)', padding: '2px 8px', borderRadius: 8 }}>{circuitName}</span>
                           <span className="label-xs" style={{ color: stressColor, opacity: 0.8 }}>Estrés: {entry.hrv || 72}ms</span>
                        </div>
                      </>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => { setEditingId(entry.id); setEditText(entry.texto); }} style={{ background: 'none', border: 'none', color: 'var(--outline-variant)', cursor: 'pointer' }}>
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button 
                      onClick={async () => { 
                        // Instant removal for zero-latency feel
                        await deleteEntry(entry.id);
                      }} 
                      style={{ background: 'none', border: 'none', color: '#fa746f', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              );
            }) : (
              <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>No hay datos sincronizados.</div>
            )}
          </div>
        </section>
      </div>
    </ScreenContainer>
  );
}
