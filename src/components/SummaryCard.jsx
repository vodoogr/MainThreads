export default function SummaryCard({ label, children }) {
  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <p className="label-xs" style={{ color: 'var(--on-surface-variant)', marginBottom: '1rem' }}>
        {label}
      </p>
      {children}
    </div>
  );
}
