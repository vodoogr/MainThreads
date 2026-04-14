import { useMemo } from 'react';
import ScreenContainer from '../components/ScreenContainer';
import { useNeuralStore } from '../store/neuralStore';

export default function PerspectivasInsights() {
  const { allEntries = [], circuits = [] } = useNeuralStore();

  // ── Cálculos de Inteligencia Cerebral ──────────────────────────────────────
  const stats = useMemo(() => {
    if (allEntries.length === 0) return null;

    // 1. Balance Hemisférico (Izquierdo: 1-4, Derecho: 5-8)
    const leftIds = ['BIO_SURVIVAL', 'EMOTIONAL', 'SYMBOLIC', 'SOCIO_SEXUAL'];
    const rightIds = ['NEUROSOMATIC', 'METAPROGRAMMING', 'NEUROGENETIC', 'QUANTUM'];

    let leftCount = 0;
    let rightCount = 0;
    let totalHrv = 0;

    const nodeStats = {};

    allEntries.forEach(entry => {
      const nodes = entry.nodos_vinculados || [entry.id_circuito];
      nodes.forEach(id => {
        if (leftIds.includes(id)) leftCount++;
        if (rightIds.includes(id)) rightCount++;
        
        if (!nodeStats[id]) nodeStats[id] = { count: 0, hrvSum: 0 };
        nodeStats[id].count++;
        nodeStats[id].hrvSum += entry.hrv || 72;
      });
      totalHrv += entry.hrv || 72;
    });

    const avgHrv = Math.round(totalHrv / allEntries.length);
    const totalNodes = leftCount + rightCount;
    const leftPct = Math.round((leftCount / totalNodes) * 100);
    const rightPct = 100 - leftPct;

    // 2. Nodo más estresante (Menor HRV promedio)
    let stressTrigger = null;
    let minHrv = 200;

    Object.entries(nodeStats).forEach(([id, s]) => {
      const avg = s.hrvSum / s.count;
      if (avg < minHrv) {
        minHrv = avg;
        stressTrigger = circuits.find(c => c.id === id)?.nombre || id;
      }
    });

    return { leftPct, rightPct, avgHrv, stressTrigger, totalEntries: allEntries.length };
  }, [allEntries, circuits]);

  if (!stats) {
    return (
      <ScreenContainer>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', opacity: 0.5 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, marginBottom: 16 }}>analytics</span>
          <p>Necesitas registrar más hilos para generar perspectivas...</p>
        </div>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <div className="section-gap" style={{ paddingTop: '2rem' }}>
        <header>
          <h1 style={{ fontSize: '2rem', fontWeight: 300, color: 'var(--on-surface)' }}>Perspectivas <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Cerebrales</span></h1>
          <p style={{ color: 'var(--on-surface-variant)', marginTop: 8 }}>Análisis de coherencia entre tus pensamientos y tu biología.</p>
        </header>

        {/* Hemisphere Balance Card */}
        <section className="card-high" style={{ padding: '2rem', borderRadius: 'var(--radius-3xl)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'var(--primary)', opacity: 0.05, filter: 'blur(60px)', borderRadius: '50%' }} />
          <h3 className="label-xs" style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>Equilibrio Hemisférico</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ flex: stats.leftPct, height: 12, background: 'var(--primary)', borderRadius: '6px 0 0 6px', transition: 'all 1s ease' }} />
            <div style={{ flex: stats.rightPct, height: 12, background: 'var(--secondary)', borderRadius: '0 6px 6px 0', transition: 'all 1s ease' }} />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{stats.leftPct}%</div>
              <div className="label-xxs">Izquierdo (Lógico)</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--secondary)', textAlign: 'right' }}>{stats.rightPct}%</div>
              <div className="label-xxs" style={{ textAlign: 'right' }}>Derecho (Intuitivo)</div>
            </div>
          </div>
        </section>

        {/* Biometric Intensity Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <span className="material-symbols-outlined" style={{ color: '#fa746f' }}>favorite</span>
            <div style={{ fontSize: '1.75rem', fontWeight: 300, marginTop: 12 }}>{stats.avgHrv}ms</div>
            <div className="label-xxs" style={{ opacity: 0.6 }}>HRV Promedio</div>
          </div>
          <div className="card" style={{ padding: '1.5rem' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)' }}>bolt</span>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: 12, color: 'var(--on-surface)' }}>{stats.stressTrigger}</div>
            <div className="label-xxs" style={{ opacity: 0.6 }}>Disparador de Estrés</div>
          </div>
        </div>

        {/* Insight AI Text */}
        <section className="card-low" style={{ padding: '2rem', borderLeft: '4px solid var(--primary)' }}>
          <h4 style={{ fontWeight: 600, marginBottom: 12 }}>Diagnóstico del Estado de Conciencia</h4>
          <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.7, fontSize: '0.94rem' }}>
            Basado en tus <span style={{ color: 'var(--primary)' }}>{stats.totalEntries}</span> hilos recientes, tu mente muestra un predominio 
            del {stats.leftPct > 60 ? 'procesamiento lineal y analítico' : stats.rightPct > 60 ? 'procesamiento creativo y holístico' : 'equilibrio funcional'}. 
            Tu mayor desafío biológico ocurre al interactuar con el nodo <span style={{ color: '#fa746f' }}>{stats.stressTrigger}</span>, donde tu variabilidad cardíaca desciende.
          </p>
        </section>

        {/* Suggestions Card */}
        <section className="card" style={{ padding: '1.5rem', background: 'rgba(137,212,205,0.05)', border: '1px dashed rgba(137,212,205,0.3)' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>auto_awesome</span>
            <span className="label-xs" style={{ color: 'var(--primary)' }}>MISIÓN SUGERIDA</span>
          </div>
          <p style={{ marginTop: 12, fontSize: '0.9rem', color: 'var(--on-surface-variant)' }}>
            Observamos una saturación en circuitos de supervivencia. Te sugerimos 10 minutos de <b>Respiración Box</b> para elevar tu HRV antes de tu próxima entrada.
          </p>
        </section>

      </div>
    </ScreenContainer>
  );
}
