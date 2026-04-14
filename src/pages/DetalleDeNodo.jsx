import { useParams, useNavigate } from 'react-router-dom';
import { useMemo, useEffect } from 'react';
import { useNeuralStore } from '../store/neuralStore';
import ScreenContainer from '../components/ScreenContainer';
import { 
  CIRCUIT_LABELS, 
  CIRCUIT_COLORS, 
  CIRCUIT_DESCRIPTIONS,
} from '../data/mockData';

export default function DetalleDeNodo() {
  const { nodeId } = useParams();
  const navigate = useNavigate();
  const { circuits, entries: storeEntries, fetchCircuits, fetchEntries, loading } = useNeuralStore();

  useEffect(() => {
    if (circuits.length === 0) fetchCircuits();
    if (Object.keys(storeEntries).length === 0) fetchEntries();
  }, []);

  const circuit = useMemo(() => {
    return circuits.find(c => c.id === nodeId) || { id: nodeId, nombre: nodeId, color: 'var(--primary)', descripcion: '' };
  }, [circuits, nodeId]);

  const entries = useMemo(() => {
    return storeEntries[nodeId] || [];
  }, [storeEntries, nodeId]);

  const label = circuit.nombre || CIRCUIT_LABELS[nodeId] || 'Circuito Desconocido';
  const color = circuit.color || CIRCUIT_COLORS[nodeId] || 'var(--primary)';
  const description = circuit.descripcion || CIRCUIT_DESCRIPTIONS[nodeId] || '';

  return (
    <ScreenContainer>
      {loading && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'white', letterSpacing: '0.1em' }}>SINCRONIZANDO...</div>
        </div>
      )}
      <div className="section-gap" style={{ paddingTop: '2rem' }}>
        {/* Navigation Back */}
        <button 
          onClick={() => navigate(-1)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--primary)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            cursor: 'pointer',
            padding: 0
          }}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="label-xs">Volver al Grafo</span>
        </button>

        {/* ── Orbital Deep Dive Visualization ──────────────── */}
        <section 
          className="neural-card" 
          style={{ 
            height: 320, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          <svg viewBox="0 0 400 300" style={{ width: '100%', height: '100%' }}>
            <defs>
              <filter id="glow-heavy">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Orbital Rings */}
            <circle cx="200" cy="150" r="60" fill="none" stroke={color} strokeWidth="0.5" opacity="0.1" />
            <circle cx="200" cy="150" r="100" fill="none" stroke={color} strokeWidth="0.5" opacity="0.05" />

            {/* Connection Lines from Center to Satellites */}
            {entries.map((entry, i) => {
              const angle = (i * 360 / entries.length) * (Math.PI / 180);
              const dist = 100;
              const ex = 200 + Math.cos(angle) * dist;
              const ey = 150 + Math.sin(angle) * dist;
              return (
                <line 
                  key={`line-${i}`}
                  x1="200" y1="150" x2={ex} y2={ey}
                  stroke={color} strokeWidth={entry.intensity / 4}
                  opacity="0.2"
                  className="animate-pulse-slow"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              );
            })}

            {/* Center Node (The Circuit) */}
            <circle 
              cx="200" cy="150" r="40" 
              fill={color} 
              opacity="0.8" 
              style={{ filter: 'url(#glow-heavy)' }}
            />
            <text x="200" y="155" textAnchor="middle" fill="var(--bg)" style={{ fontSize: 10, fontWeight: 800 }}>
              {nodeId.split('_')[0]}
            </text>

            {/* Satellite Nodes (The Value Points) */}
            {entries.map((entry, i) => {
              const angle = (i * 360 / entries.length) * (Math.PI / 180);
              const dist = 100;
              const ex = 200 + Math.cos(angle) * dist;
              const ey = 150 + Math.sin(angle) * dist;
              return (
                <g key={entry.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <circle 
                    cx={ex} cy={ey} 
                    r={5 + entry.intensity} 
                    fill={color} 
                    opacity="0.6" 
                  />
                  <circle 
                    cx={ex} cy={ey} 
                    r={2} 
                    fill="white" 
                  />
                </g>
              );
            })}
          </svg>

          {/* Title Overlay */}
          <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
            <span className="label-xs" style={{ color }}>Profundización Neural</span>
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{entries.length} puntos de datos detectados</div>
          </div>
        </section>

        {/* Header Info */}
        <div>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--on-surface)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            {label}
          </h1>
          <p
            style={{
              fontSize: '1.0625rem',
              color: 'var(--on-surface-variant)',
              lineHeight: 1.7,
              fontWeight: 300,
              marginTop: '1rem'
            }}
          >
            {description}
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.5rem', borderRadius: '2rem' }}>
            <span className="label-xs" style={{ color: 'var(--on-surface-variant)' }}>
              Densidad de Hilos
            </span>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginTop: '1rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 700, color, lineHeight: 1 }}>
                {entries.length}
              </span>
              <span className="label-xs" style={{ color, paddingBottom: 6 }}>
                Records
              </span>
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', borderRadius: '2rem' }}>
            <span className="label-xs" style={{ color: 'var(--on-surface-variant)' }}>
              Intensidad Media
            </span>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginTop: '1rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--secondary)', lineHeight: 1 }}>
                {(entries.reduce((acc, e) => acc + e.intensity, 0) / (entries.length || 1)).toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Entries List */}
        <div>
          <h3 className="label-xs" style={{ color: 'var(--outline)', marginBottom: '1.5rem' }}>
            Contenido del Circuito
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {entries.length > 0 ? entries.map((entry) => (
              <div
                key={entry.id}
                className="card-low"
                style={{
                  borderLeft: `3px solid ${color}`,
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1, paddingRight: '1rem' }}>
                  <p style={{ fontSize: '0.9375rem', fontWeight: 400, color: 'var(--on-surface)' }}>
                    {entry.text}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="label-xxs" style={{ color: 'var(--outline-variant)' }}>Intensidad</span>
                  <div style={{ fontWeight: 700, color }}>{entry.intensity}</div>
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.4 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48 }}>cloud_off</span>
                <p style={{ marginTop: 12 }}>Sin puntos de datos adicionales</p>
              </div>
            )}
          </div>
        </div>

        {/* Integration Button */}
        <button className="btn-primary" style={{ background: color, color: 'var(--bg)' }}>
          Integrar Experiencias
        </button>
      </div>
    </ScreenContainer>
  );
}
