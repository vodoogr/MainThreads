import { useNavigate } from 'react-router-dom';
import { useMemo, useEffect } from 'react';
import { useNeuralStore } from '../store/neuralStore';
import ScreenContainer from '../components/ScreenContainer';
import SummaryCard from '../components/SummaryCard';
import EntryCard from '../components/EntryCard';
import BrainGraph from '../components/BrainGraph';

export default function InicioSistemaNeuralVivo() {
  const navigate = useNavigate();
  const { circuits, entries, loading, fetchCircuits, fetchEntries, syncWatch, connectedWatch, currentHrv } = useNeuralStore();

  useEffect(() => {
    fetchCircuits();
    fetchEntries();
  }, []);

  // Calculate dynamic summary
  const stats = useMemo(() => {
    const allEntries = Object.values(entries).flat();
    const count = allEntries.length;
    
    // Average intensity
    const avgInt = count > 0 
      ? Math.round((allEntries.reduce((acc, e) => acc + (e.intensity || 5), 0) / count) * 10) / 10 
      : 0;

    // Dominant node (max entries)
    let dominant = { label: 'Calculando...' };
    if (circuits.length > 0) {
      const entryKeys = Object.keys(entries);
      const domId = entryKeys.length > 0 
        ? entryKeys.reduce((a, b) => (entries[a]?.length || 0) > (entries[b]?.length || 0) ? a : b)
        : circuits[0].id;
      
      const circuit = circuits.find(c => c.id === domId);
      if (circuit) dominant = { label: circuit.nombre };
    }

    // Recent thoughts
    const recent = allEntries
      .slice(0, 5)
      .map(e => ({
        ...e,
        time: 'Reciente',
        nodeColor: circuits.find(c => c.id === e.id_circuito)?.color || '#fff'
      }));

    return { count, avgInt, dominant, recent, recurring: 'Ninguna' };
  }, [circuits, entries]);

  return (
    <ScreenContainer>
      {/* Huawei Watch Sync Indicator */}
      <div 
        onClick={() => navigate('/vincular_reloj')}
        className="card-low"
        style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          cursor: 'pointer',
          border: connectedWatch ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(23,23,23,0.6)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
      >
        <div style={{ position: 'relative' }}>
          <span className="material-symbols-outlined" style={{ 
            color: connectedWatch ? 'var(--primary)' : 'var(--on-surface-variant)',
            fontSize: 20
          }}>
            watch
          </span>
          {connectedWatch && (
            <div style={{ 
              position: 'absolute', top: -2, right: -2, width: 8, height: 8, 
              background: 'var(--primary)', borderRadius: '50%',
              boxShadow: '0 0 10px var(--primary)'
            }} />
          )}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="label-xxs" style={{ color: connectedWatch ? 'var(--primary)' : 'var(--outline)', letterSpacing: '0.05em' }}>
            {connectedWatch ? 'GT5 CONECTADO' : 'SINCRONIZAR RELOJ'}
          </span>
          {connectedWatch && (
            <span style={{ fontSize: '0.65rem', color: 'var(--on-surface-variant)', fontWeight: 300 }}>
              HRV: {currentHrv}ms | Bat: {connectedWatch.battery}
            </span>
          )}
        </div>
      </div>

      <div className="section-gap" style={{ paddingTop: '2rem' }}>
        {/* Brain Graph Area */}
        <BrainGraph />

        {/* Summary Cards Bento Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1rem',
          }}
        >
          <SummaryCard label="Entradas de hoy">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
              <span
                style={{
                  fontSize: '2.25rem',
                  fontWeight: 600,
                  color: 'var(--primary)',
                  lineHeight: 1,
                }}
              >
                {String(stats.count).padStart(2, '0')}
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'rgba(231,229,228,0.4)',
                  paddingBottom: 4,
                }}
              >
                pensamientos
              </span>
            </div>
          </SummaryCard>

          <SummaryCard label="Nodo dominante">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                className="material-symbols-outlined"
                style={{ color: 'var(--secondary)' }}
              >
                psychology
              </span>
              <span
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 500,
                  color: 'var(--on-surface)',
                }}
              >
                {stats.dominant.label}
              </span>
            </div>
          </SummaryCard>

          <SummaryCard label="Intensidad media">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div
                style={{
                  height: 8,
                  flex: 1,
                  background: 'var(--surface-container-highest)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${stats.avgInt * 10}%`,
                    background: 'var(--primary)',
                    borderRadius: 'var(--radius-full)',
                    boxShadow: '0 0 10px rgba(137,212,205,0.3)',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--primary)',
                }}
              >
                {stats.avgInt}
              </span>
            </div>
          </SummaryCard>

          <SummaryCard label="Hebra recurrente">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                className="material-symbols-outlined"
                style={{ color: 'var(--tertiary)', fontSize: 18 }}
              >
                repeat
              </span>
              <span
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--on-surface)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {stats.recurring}
              </span>
            </div>
          </SummaryCard>
        </div>

        {/* Recent Thoughts */}
        <section>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '1.5rem',
            }}
          >
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 300,
                color: 'var(--on-surface)',
              }}
            >
              Hilos Recientes
            </h3>
            <button
              className="label-xs"
              style={{
                color: 'var(--primary)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/historial')}
            >
              Ver todo
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats.recent.map((thought) => (
              <EntryCard
                key={thought.id}
                text={thought.text}
                time={thought.time}
                intensity={thought.intensity}
                nodeColor={thought.nodeColor}
                date={thought.date || 'Hoy'}
              />
            ))}
          </div>
        </section>
      </div>

      {/* FAB */}
      <button className="fab" onClick={() => navigate('/nueva_entrada')} id="fab-registrar">
        <span className="material-symbols-outlined">add_notes</span>
        <span>Registrar pensamiento</span>
      </button>
    </ScreenContainer>
  );
}
