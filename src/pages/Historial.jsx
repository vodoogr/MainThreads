import { useState } from 'react';
import ScreenContainer from '../components/ScreenContainer';
import { historialData } from '../data/mockData';

export default function Historial() {
  const [selectedDay, setSelectedDay] = useState(12);
  const data = historialData;

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

    if (isSelected) {
      return {
        ...base,
        background: 'var(--surface-container-high)',
        border: '2px solid var(--primary)',
        boxShadow: '0 0 15px rgba(137,212,205,0.2)',
        color: 'var(--primary)',
        fontWeight: 700,
      };
    }
    if (activity >= 3) {
      return {
        ...base,
        background: 'var(--surface-container-high)',
        border: '1px solid rgba(137,212,205,0.1)',
        color: 'var(--on-surface)',
      };
    }
    if (activity > 0) {
      return {
        ...base,
        background: 'var(--surface-container-high)',
        color: 'var(--on-surface)',
      };
    }
    return {
      ...base,
      background: 'var(--surface-container-low)',
      color: 'rgba(231,229,228,0.4)',
    };
  };

  const getDotColor = (activity) => {
    if (activity >= 3) return 'var(--primary)';
    if (activity === 2) return 'var(--tertiary)';
    if (activity === 1) return 'rgba(211,188,252,0.6)';
    return 'transparent';
  };

  return (
    <ScreenContainer>
      <div className="section-gap" style={{ paddingTop: '2rem' }}>
        {/* Month Header */}
        <section>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <h1
              style={{
                fontSize: '1.75rem',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                color: 'var(--on-surface)',
              }}
            >
              {data.currentMonth}{' '}
              <span style={{ color: 'rgba(137,212,205,0.6)', fontWeight: 200 }}>
                {data.currentYear}
              </span>
            </h1>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                style={{
                  padding: 8,
                  borderRadius: '50%',
                  background: 'var(--surface-container-high)',
                  border: 'none',
                  color: 'var(--on-surface-variant)',
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                style={{
                  padding: 8,
                  borderRadius: '50%',
                  background: 'var(--surface-container-high)',
                  border: 'none',
                  color: 'var(--on-surface-variant)',
                  cursor: 'pointer',
                  display: 'flex',
                }}
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 8,
              marginTop: '1.5rem',
            }}
          >
            {data.weekdays.map((wd) => (
              <div
                key={wd}
                className="label-xs"
                style={{
                  textAlign: 'center',
                  color: 'var(--outline-variant)',
                  marginBottom: 8,
                }}
              >
                {wd}
              </div>
            ))}
            {/* Offset cells */}
            {Array.from({ length: data.startOffset }, (_, i) => (
              <div key={`empty-${i}`} style={{ aspectRatio: '1' }} />
            ))}
            {/* Day cells */}
            {data.days.map(({ day, activity }) => (
              <div
                key={day}
                style={getActivityStyle(activity, day)}
                onClick={() => activity > 0 && setSelectedDay(day)}
              >
                <span>{day}</span>
                {activity > 0 && (
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: getDotColor(activity),
                      marginTop: 4,
                      boxShadow:
                        activity >= 3
                          ? '0 0 8px rgba(137,212,205,0.6)'
                          : 'none',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Heatmap */}
        <section>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <h2
              className="label-xs"
              style={{ color: 'var(--outline)', fontSize: '0.75rem' }}
            >
              Intensidad Cognitiva
            </h2>
            <span
              className="label-xs"
              style={{
                color: 'var(--primary)',
                background: 'rgba(137,212,205,0.1)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              Últimos 6 meses
            </span>
          </div>
          <div
            className="card"
            style={{ padding: '1.5rem', borderRadius: 'var(--radius-3xl)' }}
          >
            <div
              style={{
                display: 'flex',
                gap: 6,
                alignItems: 'flex-end',
                height: 128,
              }}
            >
              {data.heatmapBars.map((h, i) => {
                const isHighlight = h > 80;
                return (
                  <div
                    key={i}
                    className={`trend-bar ${isHighlight ? 'shadow-glow-primary' : ''}`}
                    style={{
                      height: `${h}%`,
                      background: isHighlight
                        ? 'rgba(137,212,205,0.8)'
                        : h > 60
                        ? 'rgba(137,212,205,0.4)'
                        : h > 50
                        ? 'rgba(211,188,252,0.4)'
                        : 'var(--surface-variant)',
                      transition: 'height 0.5s ease',
                    }}
                  />
                );
              })}
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1rem',
              }}
            >
              {data.heatmapMonths.map((m) => (
                <span
                  key={m}
                  className="label-xs"
                  style={{ color: 'var(--outline-variant)', fontSize: '0.5625rem' }}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Filters */}
        <section style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--surface-container-high)',
              border: '1px solid rgba(72,72,72,0.2)',
              color: 'var(--on-surface)',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              filter_list
            </span>
            Filtrar por nodo
          </button>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--surface-container-high)',
              border: '1px solid rgba(72,72,72,0.2)',
              color: 'var(--on-surface)',
              fontSize: '0.75rem',
              cursor: 'pointer',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              bolt
            </span>
            Filtrar por intensidad
          </button>
          <div
            className="label-xs"
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: 'var(--outline)',
            }}
          >
            <span>Viendo:</span>
            <span style={{ color: 'var(--on-surface)', fontWeight: 600 }}>
              Todos los hilos
            </span>
          </div>
        </section>

        {/* Entries List */}
        <section>
          <h2
            className="label-xs"
            style={{
              color: 'var(--outline)',
              fontSize: '0.75rem',
              marginBottom: '1rem',
            }}
          >
            Recuerdos Recientes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.entries.map((entry) => (
              <div
                key={entry.id}
                className="card animate-fade-in"
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-3xl)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  cursor: 'pointer',
                  borderLeft: entry.highlight
                    ? '4px solid var(--tertiary)'
                    : 'none',
                }}
              >
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <span
                    className="label-xs"
                    style={{
                      color: 'var(--outline-variant)',
                      fontSize: '0.5625rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {entry.dayOfWeek}
                  </span>
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 300,
                      color: 'var(--on-surface)',
                    }}
                  >
                    {entry.dayNumber}
                  </div>
                </div>
                <div
                  style={{
                    height: 40,
                    width: 1,
                    background: 'rgba(72,72,72,0.2)',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: entry.highlight ? 'var(--tertiary)' : 'var(--on-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    {entry.title}
                    {entry.highlight && (
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: 16 }}
                      >
                        auto_awesome
                      </span>
                    )}
                  </h3>
                  <p
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--on-surface-variant)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {entry.highlight
                      ? entry.connectedNodes
                      : `Nodos conectados: ${entry.connectedNodes}`}
                  </p>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    {entry.dots.map((color, di) => (
                      <div
                        key={di}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: color,
                        }}
                      />
                    ))}
                  </div>
                </div>
                <button
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: entry.highlight
                      ? 'rgba(255,234,175,0.1)'
                      : 'rgba(137,212,205,0.1)',
                    border: 'none',
                    color: entry.highlight ? 'var(--tertiary)' : 'var(--primary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span className="material-symbols-outlined">replay</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Neural Preview */}
        <section
          className="neural-card"
          style={{
            padding: '2rem',
            height: 200,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0.2,
              pointerEvents: 'none',
            }}
          >
            <svg viewBox="0 0 400 200" style={{ width: '100%', height: '100%' }}>
              <circle cx="50" cy="50" r="4" fill="#89d4cd" />
              <circle cx="150" cy="80" r="6" fill="#89d4cd" />
              <circle cx="280" cy="40" r="3" fill="#d3bcfc" />
              <circle cx="340" cy="120" r="5" fill="#89d4cd" />
              <path
                d="M50 50 L150 80"
                stroke="#89d4cd"
                strokeDasharray="2 2"
                strokeWidth="0.5"
              />
              <path
                d="M150 80 L280 40"
                stroke="#89d4cd"
                strokeDasharray="2 2"
                strokeWidth="0.5"
              />
              <path
                d="M150 80 L340 120"
                stroke="#89d4cd"
                strokeDasharray="2 2"
                strokeWidth="0.5"
              />
            </svg>
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <span className="label-xs" style={{ color: 'var(--primary)' }}>
              Ecos del Pasado
            </span>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 300,
                color: 'var(--on-surface)',
                marginTop: 4,
              }}
            >
              Explora tu mapa mental histórico en modo inmersivo.
            </h3>
            <button
              style={{
                marginTop: 8,
                color: 'var(--primary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Iniciar Viaje Temporal
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                arrow_forward
              </span>
            </button>
          </div>
        </section>
      </div>
    </ScreenContainer>
  );
}
