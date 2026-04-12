import ScreenContainer from '../components/ScreenContainer';
import { nodeDetail } from '../data/mockData';

export default function DetalleDeNodo() {
  const node = nodeDetail;

  return (
    <ScreenContainer>
      <div className="section-gap" style={{ paddingTop: '2rem' }}>
        {/* Header */}
        <div>
          <span
            className="label-xs"
            style={{ color: 'var(--primary)', display: 'block', marginBottom: 4 }}
          >
            Detalle de Nodo
          </span>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              color: 'var(--on-surface)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            {node.title}
          </h1>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: '1.0625rem',
            color: 'var(--on-surface-variant)',
            lineHeight: 1.7,
            fontWeight: 300,
          }}
        >
          {node.description}
        </p>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Activation Level */}
          <div className="card" style={{ padding: '1.5rem', borderRadius: '2rem' }}>
            <span className="label-xs" style={{ color: 'var(--on-surface-variant)' }}>
              Nivel de Activación
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 8,
                marginTop: '1rem',
              }}
            >
              <span
                style={{
                  fontSize: '2.25rem',
                  fontWeight: 700,
                  color: 'var(--primary)',
                  lineHeight: 1,
                }}
              >
                {node.activationLevel}%
              </span>
              <span
                className="material-symbols-outlined filled"
                style={{ color: 'var(--primary)', fontSize: 20, paddingBottom: 4 }}
              >
                trending_up
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: 4,
                background: 'rgba(72,72,72,0.2)',
                borderRadius: 'var(--radius-full)',
                marginTop: '1rem',
                overflow: 'hidden',
              }}
            >
              <div
                className="shadow-glow-primary"
                style={{
                  height: '100%',
                  width: `${node.activationLevel}%`,
                  background: 'var(--primary)',
                  borderRadius: 'var(--radius-full)',
                }}
              />
            </div>
          </div>

          {/* Frequency */}
          <div className="card" style={{ padding: '1.5rem', borderRadius: '2rem' }}>
            <span className="label-xs" style={{ color: 'var(--on-surface-variant)' }}>
              Frecuencia
            </span>
            <div style={{ marginTop: '1rem' }}>
              <span
                style={{
                  fontSize: '2.25rem',
                  fontWeight: 700,
                  color: 'var(--secondary)',
                  lineHeight: 1,
                }}
              >
                {node.frequency}
              </span>
            </div>
            <p
              style={{
                fontSize: '0.6875rem',
                color: 'var(--on-surface-variant)',
                marginTop: 8,
                lineHeight: 1.4,
              }}
            >
              {node.frequencyDetail}
            </p>
          </div>
        </div>

        {/* Trend Chart */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <h3
              className="label-xs"
              style={{ color: 'var(--on-surface-variant)', fontSize: '0.75rem' }}
            >
              Tendencia 30 Días
            </h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <span className="label-xs" style={{ color: 'var(--primary)' }}>
                7D
              </span>
              <span
                className="label-xs"
                style={{ color: 'rgba(172,171,170,0.4)' }}
              >
                30D
              </span>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: 128,
              padding: '0 0.5rem',
              gap: 4,
            }}
          >
            {node.trendData.map((val, i) => {
              const isHighlight = val > 80;
              return (
                <div
                  key={i}
                  className={`trend-bar ${isHighlight ? 'shadow-glow-primary' : ''}`}
                  style={{
                    height: `${val}%`,
                    background: isHighlight
                      ? 'var(--primary)'
                      : val > 60
                      ? 'rgba(137,212,205,0.4)'
                      : 'var(--surface-variant)',
                    transition: 'height 0.5s ease',
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Connections */}
        <div>
          <h3
            className="label-xs"
            style={{
              color: 'var(--on-surface-variant)',
              fontSize: '0.75rem',
              marginBottom: '1.5rem',
            }}
          >
            Conexiones más fuertes
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {node.connections.map((conn) => (
              <div
                key={conn.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: 'var(--surface-container-high)',
                  padding: '0.75rem 1.25rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(72,72,72,0.1)',
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: conn.color,
                    boxShadow: `0 0 8px ${conn.color}66`,
                  }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{conn.label}</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'rgba(172,171,170,0.6)',
                    fontFamily: 'monospace',
                  }}
                >
                  {conn.strength}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Thoughts */}
        <div>
          <h3
            className="label-xs"
            style={{
              color: 'var(--on-surface-variant)',
              fontSize: '0.75rem',
              marginBottom: '1.5rem',
            }}
          >
            Entradas relacionadas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {node.relatedThoughts.map((thought) => (
              <div
                key={thought.id}
                className="card-low"
                style={{
                  borderLeft: `2px solid ${thought.borderColor}30`,
                  paddingLeft: '1.25rem',
                  padding: '1.25rem',
                  borderTopRightRadius: 'var(--radius-2xl)',
                  borderBottomRightRadius: 'var(--radius-2xl)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 8,
                  }}
                >
                  <span className="label-xs" style={{ color: 'var(--on-surface-variant)' }}>
                    {thought.time}
                  </span>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}
                  >
                    arrow_forward_ios
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 300,
                    color: 'var(--on-surface)',
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {thought.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action */}
        <button className="btn-primary" id="btn-sintonizar">
          Sintonizar este Hilo
        </button>
      </div>
    </ScreenContainer>
  );
}
