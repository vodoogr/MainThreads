export default function NodeChip({ label, active, onClick, suggested }) {
  return (
    <button
      className={`chip ${active ? 'active' : ''} ${suggested ? 'suggested' : ''}`}
      onClick={onClick}
      type="button"
      style={{
        position: 'relative',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}
    >
      {/* Indicator point for active */}
      {active && <span className="chip-dot" />}
      
      {/* Icon for suggestions (now always visible if suggested) */}
      {suggested && (
        <span 
          style={{ 
            fontSize: '0.9rem', 
            color: active ? 'inherit' : 'var(--primary)',
            filter: 'drop-shadow(0 0 2px var(--primary))' 
          }} 
          className="material-symbols-outlined animate-flicker"
        >
          auto_awesome
        </span>
      )}
      
      {label}
    </button>
  );
}
