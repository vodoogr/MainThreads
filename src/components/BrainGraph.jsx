import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { graphData, CIRCUIT_LABELS, CIRCUIT_COLORS, CIRCUIT_DESCRIPTIONS } from '../data/mockData';

/**
 * BrainGraph (Teoría de los 8 Circuitos)
 * 
 * Visualizes the 8 Circuits of Consciousness within a stylized brain silhouette.
 * Displays real-time activity levels and highlights the most active "cerebro".
 */

export default function BrainGraph() {
  const navigate = useNavigate();
  const [hoveredCircuit, setHoveredCircuit] = useState(null);
  
  const vbWidth = 400;
  const vbHeight = 440;

  const { nodes, connections, threads, maxIntensityNode } = useMemo(() => {
    const nodes = graphData.nodes;
    const max = nodes.reduce((prev, current) => (prev.intensity > current.intensity) ? prev : current);
    
    return {
      nodes,
      maxIntensityNode: max,
      connections: graphData.connections.map(c => ({
        ...c,
        sourceNode: nodes.find(n => n.id === c.source),
        targetNode: nodes.find(n => n.id === c.target)
      })).filter(c => c.sourceNode && c.targetNode),
      threads: graphData.threads.map(t => ({
        ...t,
        sourceNode: nodes.find(n => n.id === t.source),
        targetNode: nodes.find(n => n.id === t.target)
      })).filter(t => t.sourceNode && t.targetNode)
    };
  }, []);

  const isRelated = (id) => {
    if (!hoveredCircuit) return false;
    if (hoveredCircuit === id) return true;
    return connections.some(c => (c.source === hoveredCircuit && c.target === id) || (c.target === hoveredCircuit && c.source === id));
  };

  return (
    <section className="neural-card" style={{ height: 480, width: '100%', position: 'relative' }}>
      {/* Glow Layer */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          opacity: 0.15,
          background: `radial-gradient(circle at ${maxIntensityNode.x/4}% ${maxIntensityNode.y/4.4}%, ${CIRCUIT_COLORS[maxIntensityNode.id]} 0%, transparent 60%)`,
          transition: 'background 0.8s ease'
        }} 
      />

      <svg viewBox={`0 0 ${vbWidth} ${vbHeight}`} style={{ width: '100%', height: '100%' }}>
        <defs>
          <filter id="brain-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── Premium Brain Silhouette ─────────────────────── */}
        <g id="brain-silhouette" className="animate-breathe" style={{ opacity: 0.12 }}>
          {/* Main brain mass */}
          <path
            d="M200,40 C140,40 100,50 80,100 C60,150 60,200 85,250 C110,300 160,320 200,340 C240,320 290,300 315,250 C340,200 340,150 320,100 C300,50 260,40 200,40 Z"
            fill="none" stroke="var(--primary)" strokeWidth="1.5"
          />
          {/* Internal Sulci/Folds */}
          <path d="M200,40 L200,340" stroke="var(--primary)" strokeWidth="0.5" strokeDasharray="4 4" />
          <path d="M140,80 Q170,90 200,85" stroke="var(--primary)" strokeWidth="0.5" fill="none" opacity="0.4" />
          <path d="M260,80 Q230,90 200,85" stroke="var(--primary)" strokeWidth="0.5" fill="none" opacity="0.4" />
          <path d="M100,160 Q150,180 200,170" stroke="var(--primary)" strokeWidth="0.5" fill="none" opacity="0.4" />
          <path d="M300,160 Q250,180 200,170" stroke="var(--primary)" strokeWidth="0.5" fill="none" opacity="0.4" />
          <path d="M140,260 Q170,280 200,270" stroke="var(--primary)" strokeWidth="0.5" fill="none" opacity="0.4" />
          <path d="M260,260 Q230,280 200,270" stroke="var(--primary)" strokeWidth="0.5" fill="none" opacity="0.4" />
          
          {/* Cerebellum / Brainstem area */}
          <path d="M180,340 L170,400 L230,400 L220,340" fill="none" stroke="var(--primary)" strokeWidth="1" opacity="0.5" />
          <path d="M170,360 Q200,370 230,360" stroke="var(--primary)" strokeWidth="0.5" fill="none" opacity="0.3" />
        </g>

        {/* ── Connections Layer ─────────────────────────────── */}
        <g id="connections">
          {connections.map((c, i) => (
            <line
              key={i}
              x1={c.sourceNode.x} y1={c.sourceNode.y}
              x2={c.targetNode.x} y2={c.targetNode.y}
              stroke={CIRCUIT_COLORS[c.source]}
              strokeWidth={c.strength * 2}
              opacity={hoveredCircuit ? (isRelated(c.source) && isRelated(c.target) ? 0.4 : 0.05) : 0.1}
              style={{ transition: 'opacity 0.4s' }}
            />
          ))}
        </g>

        {/* ── Threads Layer ─────────────────────────────────── */}
        <g id="threads">
          {threads.map((t, i) => (
            <path
              key={i}
              d={`M${t.sourceNode.x},${t.sourceNode.y} Q${(t.sourceNode.x + t.targetNode.x)/2 + 30},${(t.sourceNode.y + t.targetNode.y)/2} ${t.targetNode.x},${t.targetNode.y}`}
              fill="none"
              stroke="var(--tertiary)"
              strokeWidth="2"
              opacity="0.2"
              strokeDasharray="4,4"
            />
          ))}
        </g>

        {/* ── Circuits Layer ────────────────────────────────── */}
        {nodes.map((node) => {
          const isMax = node.id === maxIntensityNode.id;
          const isHovered = hoveredCircuit === node.id;
          const active = hoveredCircuit ? isRelated(node.id) : true;
          const color = CIRCUIT_COLORS[node.id];
          const radius = 8 + (node.intensity * 12);

          return (
            <g 
              key={node.id} 
              onMouseEnter={() => setHoveredCircuit(node.id)}
              onMouseLeave={() => setHoveredCircuit(null)}
              onClick={() => navigate('/detalle_de_nodo')}
              style={{ cursor: 'pointer' }}
            >
              {/* Region Indicator (Conceptual) */}
              <circle
                cx={node.x} cy={node.y}
                r={radius * 2}
                fill={color}
                opacity={isHovered ? 0.2 : (isMax ? 0.1 : 0)}
                className={isMax ? "animate-pulse-slow" : ""}
              />

              {/* Node Core */}
              <circle
                cx={node.x} cy={node.y}
                r={radius}
                fill={color}
                opacity={active ? 0.8 : 0.1}
                style={{ 
                  filter: isHovered || isMax ? 'url(#brain-glow)' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />

              {/* Labelling */}
              <text
                x={node.x} y={node.y + radius + 15}
                textAnchor="middle"
                className="label-xxs"
                style={{
                  fill: active ? 'var(--on-surface)' : 'var(--outline-variant)',
                  fontSize: isHovered ? '9px' : '7.5px',
                  opacity: active ? 1 : 0.3,
                  transition: 'all 0.3s'
                }}
              >
                {CIRCUIT_LABELS[node.id]}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Overlay: Active Info */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '2rem', 
          left: '2rem',
          maxWidth: '50%'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div className="animate-flicker" style={{ width: 8, height: 8, borderRadius: '50%', background: CIRCUIT_COLORS[maxIntensityNode.id], boxShadow: `0 0 10px ${CIRCUIT_COLORS[maxIntensityNode.id]}` }} />
          <span className="label-xs" style={{ color: CIRCUIT_COLORS[maxIntensityNode.id] }}>Circuito Dominante</span>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
          {CIRCUIT_LABELS[maxIntensityNode.id]}
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'var(--on-surface-variant)', marginTop: 8, lineHeight: 1.5 }}>
          {hoveredCircuit ? CIRCUIT_DESCRIPTIONS[hoveredCircuit] : CIRCUIT_DESCRIPTIONS[maxIntensityNode.id]}
        </p>
      </div>

      {/* Stats Corner */}
      <div style={{ position: 'absolute', bottom: '2rem', left: '2rem' }}>
        <div className="label-xs" style={{ opacity: 0.4, marginBottom: 4 }}>Estado Neural</div>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>
          {maxIntensityNode.region === 'brainstem' ? 'Cerebro Terrestre Activo' : 'Cerebro Post-Terrestre Activo'}
        </div>
      </div>
    </section>
  );
}
