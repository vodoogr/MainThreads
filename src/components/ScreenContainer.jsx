export default function ScreenContainer({ children, className = '' }) {
  return (
    <main className={`screen-container ${className}`}>
      {children}
    </main>
  );
}
