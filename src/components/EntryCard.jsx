export default function EntryCard({ text, time, intensity, nodeColor, date }) {
  return (
    <div
      className="animate-fade-in"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--surface-container-low)',
        padding: '1.25rem',
        borderRadius: 'var(--radius-2xl)',
        borderLeft: `2px solid ${nodeColor || 'rgba(72,72,72,0.2)'}`,
        transition: 'background 0.2s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-container)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--surface-container-low)')}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <span className="label-xs" style={{ color: 'rgba(231,229,228,0.4)', fontSize: '0.625rem' }}>
            {date || time}
          </span>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: nodeColor || 'var(--outline-variant)',
              marginTop: 4,
            }}
          />
        </div>
        <p
          style={{
            color: 'var(--on-surface)',
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {text}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0, marginLeft: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span className="label-xs" style={{ color: 'rgba(231,229,228,0.4)', marginBottom: 2 }}>
            Intensidad
          </span>
          <span
            style={{
              fontSize: '0.875rem',
              fontWeight: 700,
              color: nodeColor || 'var(--on-surface)',
            }}
          >
            {String(intensity).padStart(2, '0')}
          </span>
        </div>
        <span
          className="material-symbols-outlined"
          style={{ color: 'rgba(231,229,228,0.2)', fontSize: 20 }}
        >
          chevron_right
        </span>
      </div>
    </div>
  );
}
