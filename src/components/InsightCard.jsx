export default function InsightCard({ children, className = '', style = {} }) {
  return (
    <div className={`glass-card ${className}`} style={{ padding: '2rem', ...style }}>
      {children}
    </div>
  );
}
