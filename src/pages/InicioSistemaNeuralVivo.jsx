import { useNavigate } from 'react-router-dom';
import ScreenContainer from '../components/ScreenContainer';
import SummaryCard from '../components/SummaryCard';
import EntryCard from '../components/EntryCard';
import BrainGraph from '../components/BrainGraph';
import { dailySummary, recentThoughts } from '../data/mockData';

export default function InicioSistemaNeuralVivo() {
  const navigate = useNavigate();

  return (
    <ScreenContainer>
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
                {String(dailySummary.entriesCount).padStart(2, '0')}
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
                {dailySummary.dominantNode.label}
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
                    width: `${dailySummary.averageIntensity * 10}%`,
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
                {dailySummary.averageIntensity}
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
                {dailySummary.recurringThread}
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
            {recentThoughts.map((thought) => (
              <EntryCard
                key={thought.id}
                text={thought.text}
                time={thought.time}
                intensity={thought.intensity}
                nodeColor={thought.nodeColor}
                date={thought.date === 'Hoy' ? thought.time : thought.date}
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
