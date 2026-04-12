export default function NodeChip({ label, active, onClick }) {
  return (
    <button
      className={`chip ${active ? 'active' : ''}`}
      onClick={onClick}
      type="button"
    >
      {active && <span className="chip-dot" />}
      {label}
    </button>
  );
}
