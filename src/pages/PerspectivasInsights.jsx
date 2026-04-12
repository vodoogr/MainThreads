import ScreenContainer from '../components/ScreenContainer';
import InsightCard from '../components/InsightCard';
import { insightData } from '../data/mockData';

export default function PerspectivasInsights() {
  const data = insightData;

  return (
    <ScreenContainer>
      <div className="section-gap" style={{ paddingTop: '2rem' }}>
        {/* Title */}
        <section>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--on-surface)' }}>
            Perspectivas
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.6, maxWidth: '36rem', marginTop: 8 }}>
            Tus hilos de pensamiento condensados en sabiduría accionable.
          </p>
        </section>

        {/* Weekly Insight */}
        <InsightCard style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -96, right: -96, width: 256, height: 256, background: 'rgba(137,212,205,0.1)', filter: 'blur(100px)', borderRadius: '50%', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
              <span className="label-xs" style={{ background: 'rgba(137,212,205,0.2)', color: 'var(--primary)', padding: '4px 12px', borderRadius: 'var(--radius-full)' }}>Semanal</span>
              <span style={{ color: 'var(--on-surface-variant)', fontSize: '0.875rem', fontWeight: 500 }}>{data.weekly.period}</span>
            </div>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 600, color: 'var(--on-surface)', marginBottom: '1rem', lineHeight: 1.3 }}>{data.weekly.title}</h2>
            <p style={{ fontSize: '1.0625rem', color: 'var(--on-surface-variant)', fontWeight: 300, lineHeight: 1.7, fontStyle: 'italic', marginBottom: '2rem' }}>
              &ldquo;Esta semana has activado principalmente áreas relacionadas con <span style={{ color: 'var(--primary)', fontWeight: 500 }}>seguridad</span> y <span style={{ color: 'var(--secondary)', fontWeight: 500 }}>presión interna</span>.&rdquo;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--bg)', background: 'var(--primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--on-primary-container)' }}>psychology</span>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid var(--bg)', background: 'var(--secondary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: -8 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#cbb5f4' }}>shield</span>
                </div>
              </div>
              <span style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>Conexiones detectadas entre {data.weekly.connectionsDetected} nodos.</span>
            </div>
          </div>
        </InsightCard>

        {/* Thread Health */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 className="label-xs" style={{ color: 'var(--on-surface-variant)', marginBottom: '1rem' }}>Estado de Hebras</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 96, marginBottom: '1rem' }}>
            {data.threadHealth.bars.map((h, i) => (
              <div key={i} className="trend-bar" style={{ height: `${h}%`, background: h > 80 ? 'var(--primary)' : h > 50 ? 'rgba(137,212,205,0.4)' : 'rgba(137,212,205,0.1)', boxShadow: h > 80 ? '0 0 15px rgba(137,212,205,0.2)' : 'none' }} />
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
            Tus niveles de claridad han aumentado un <span style={{ color: 'var(--primary)' }}>{data.threadHealth.clarityIncrease}%</span> respecto al mes pasado.
          </p>
        </div>

        {/* Recurring Pattern */}
        <div className="card" style={{ padding: '1.5rem', background: 'var(--surface-container-high)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)' }}>auto_awesome</span>
            <span className="label-xs" style={{ color: 'var(--tertiary)', background: 'rgba(255,234,175,0.2)', padding: '2px 8px', borderRadius: 4 }}>PATRÓN</span>
          </div>
          <h4 style={{ fontWeight: 600, color: 'var(--on-surface)', marginBottom: 8 }}>{data.recurringPattern.title}</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
            Existe una conexión recurrente entre el <span style={{ color: 'var(--tertiary)' }}>pensamiento excesivo</span> y sensaciones corporales reportadas.
          </p>
        </div>

        {/* Monthly Summary */}
        <div className="card-low" style={{ padding: '2rem', borderRadius: 'var(--radius-3xl)', border: '1px solid rgba(72,72,72,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <div style={{ position: 'relative', width: 128, height: 128, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, border: '4px solid rgba(72,72,72,0.2)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', inset: 0, border: '4px solid var(--secondary)', borderTop: '4px solid transparent', borderLeft: '4px solid transparent', borderRadius: '50%', transform: 'rotate(45deg)' }} />
            <div style={{ textAlign: 'center' }}>
              <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 700, color: 'var(--secondary)' }}>{data.monthly.nodesActivated}</span>
              <span className="label-xxs" style={{ color: 'var(--on-surface-variant)' }}>Nodos {data.monthly.month}</span>
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--on-surface)', marginBottom: '1rem' }}>Resumen de {data.monthly.month}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)', lineHeight: 1.7 }}>{data.monthly.summary}</p>
            <button style={{ marginTop: '1rem', color: 'var(--secondary)', fontSize: '0.875rem', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              Ver análisis detallado <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Dominant Threads */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--on-surface)' }}>Hebras Dominantes</h2>
            <span className="label-xs" style={{ color: 'var(--on-surface-variant)' }}>Distribución Mental</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.dominantThreads.map((thread, i) => (
              <div key={i} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: 8, height: 48, borderRadius: 'var(--radius-full)', background: thread.color, boxShadow: `0 0 10px ${thread.color}66` }} />
                <div>
                  <div className="label-xs" style={{ color: 'var(--on-surface-variant)', marginBottom: 4 }}>{thread.category}</div>
                  <div style={{ fontWeight: 500, color: 'var(--on-surface)' }}>{thread.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ScreenContainer>
  );
}
