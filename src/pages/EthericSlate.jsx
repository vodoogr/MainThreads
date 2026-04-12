import ScreenContainer from '../components/ScreenContainer';
import BrainGraph from '../components/BrainGraph';

export default function EthericSlate() {
  return (
    <ScreenContainer>
      <div className="section-gap" style={{ paddingTop: '2rem' }}>
        <section>
          <span className="label-xs" style={{ color: 'var(--tertiary)', display: 'block', marginBottom: 8 }}>
            Laboratorio Visual
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 300, color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>
            Etheric Slate
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem', marginTop: 8, lineHeight: 1.6 }}>
            Espacio experimental para pruebas visuales del grafo neural y estados futuros.
          </p>
        </section>

        {/* Graph sandbox */}
        <BrainGraph />

        {/* Experiment controls placeholder */}
        <div className="card" style={{ padding: '2rem' }}>
          <h3 className="label-xs" style={{ color: 'var(--on-surface-variant)', marginBottom: '1rem' }}>
            Controles Experimentales
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['Intensidad Global', 'Densidad de Conexiones', 'Velocidad de Animación'].map((label) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>{label}</span>
                <input type="range" min="0" max="100" defaultValue="50" className="intensity-slider" style={{ width: '50%' }} />
              </div>
            ))}
          </div>
        </div>

        {/* State log placeholder */}
        <div className="card-low" style={{ padding: '1.5rem', borderRadius: 'var(--radius-2xl)', border: '1px solid rgba(72,72,72,0.1)' }}>
          <h3 className="label-xs" style={{ color: 'var(--outline-variant)', marginBottom: '1rem' }}>Registro de Estado</h3>
          <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--outline)', lineHeight: 2 }}>
            <p>{'>'} graphState.nodes: 7 loaded</p>
            <p>{'>'} graphState.connections: 5 active</p>
            <p>{'>'} graphState.threads: 2 warm paths</p>
            <p>{'>'} renderMode: placeholder</p>
            <p style={{ color: 'var(--primary)' }}>{'>'} ready for BrainGraph.jsx injection</p>
          </div>
        </div>
      </div>
    </ScreenContainer>
  );
}
