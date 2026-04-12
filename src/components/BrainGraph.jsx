import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { graphData, NODE_LABELS, NODE_COLORS } from '../data/mockData';

/**
 * BrainGraph
 * 
 * Interactive Neural Graph component.
 * Features:
 * - Responsive SVG scaling
 * - Hover interactions to highlight node relationships
 * - Premium glow effects and pulsating animations
 * - Direct navigation to node details on click
 * - Visual distinction between standard connections and "warm threads"
 */

export default function BrainGraph() {
  const navigate = useNavigate();
  const [hoveredNode, setHoveredNode] = useState(null);
  
  // Viewbox size (internal coordinate system)
  const vbWidth = 400;
  const vbHeight = 400;

  // Process data for easier rendering
  const { nodes, connections, threads } = useMemo(() => {
    return {
      nodes: graphData.nodes,
      connections: graphData.connections.map(c => ({
        ...c,
        sourceNode: graphData.nodes.find(n => n.id === c.source),
        targetNode: graphData.nodes.find(n => n.id === c.target)
      })).filter(c => c.sourceNode && c.targetNode),
      threads: graphData.threads.map(t => ({
        ...t,
        sourceNode: graphData.nodes.find(n => n.id === t.source),
        targetNode: graphData.nodes.find(n => n.id === t.target)
      })).filter(t => t.sourceNode && t.targetNode)
    };
  }, []);

  const handleNodeClick = (nodeId) => {
    // In a real app, we'd pass the nodeId as a param
    // For now, we navigate to the single detail page we have
    navigate('/detalle_de_nodo');
  };

  const isRelated = (nodeId) => {
    if (!hoveredNode) return false;
    if (hoveredNode === nodeId) return true;
    return connections.some(c => 
      (c.source === hoveredNode && c.target === nodeId) || 
      (c.target === hoveredNode && c.source === nodeId)
    ) || threads.some(t => 
      (t.source === hoveredNode && t.target === nodeId) || 
      (t.target === hoveredNode && t.source === nodeId)
    );
  };

  return (
    <section className="neural-card" style={{ height: 440, width: '100%', position: 'relative' }}>
      {/* Background layer */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          opacity: 0.2,
          background: 'radial-gradient(circle at center, var(--primary-container) 0%, transparent 80%)',
          pointerEvents: 'none'
        }} 
      />

      {/* Main SVG Graph */}
      <svg 
        viewBox={`0 0 ${vbWidth} ${vbHeight}`} 
        className="animate-breathe"
        style={{ width: '100%', height: '100%', display: 'block' }}
      >
        <defs>
          <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <radialGradient id="grad-active" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="warm-thread-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--tertiary)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--tertiary)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--tertiary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── Connection Layer ──────────────────────────────── */}
        <g id="connections-layer">
          {connections.map((conn, i) => {
            const isActive = hoveredNode ? (conn.source === hoveredNode || conn.target === hoveredNode) : true;
            return (
              <path
                key={`conn-${i}`}
                d={`M${conn.sourceNode.x},${conn.sourceNode.y} Q${(conn.sourceNode.x + conn.targetNode.x) / 2 + 20},${(conn.sourceNode.y + conn.targetNode.y) / 2 - 20} ${conn.targetNode.x},${conn.targetNode.y}`}
                fill="none"
                stroke="var(--primary)"
                strokeWidth={conn.strength * 2}
                opacity={isActive ? (hoveredNode ? 0.6 : 0.2) : 0.05}
                style={{ transition: 'opacity 0.4s ease' }}
              />
            );
          })}
        </g>

        {/* ── Threads Layer (Warm connectors) ────────────────── */}
        <g id="threads-layer">
          {threads.map((thread, i) => {
            const isActive = hoveredNode ? (thread.source === hoveredNode || thread.target === hoveredNode) : true;
            return (
              <path
                key={`thread-${i}`}
                className="path-well-worn"
                d={`M${thread.sourceNode.x},${thread.sourceNode.y} C${thread.sourceNode.x + 40},${thread.sourceNode.y + 20} ${thread.targetNode.x - 40},${thread.targetNode.y - 20} ${thread.targetNode.x},${thread.targetNode.y}`}
                fill="none"
                stroke="url(#warm-thread-grad)"
                strokeWidth={thread.strength * 3}
                opacity={isActive ? 0.4 : 0.05}
                strokeDasharray="10"
                style={{ 
                  animation: 'dash-line 20s linear infinite',
                  transition: 'opacity 0.4s ease'
                }}
              />
            );
          })}
        </g>

        {/* ── Node Layer ────────────────────────────────────── */}
        <g id="nodes-layer">
          {nodes.map((node) => {
            const active = isRelated(node.id);
            const isHovered = hoveredNode === node.id;
            const size = (node.intensity * 20) + 10;
            const label = NODE_LABELS[node.id]?.split(' / ')[0] || node.id;
            const color = NODE_COLORS[node.id] || 'var(--primary)';

            return (
              <g 
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => handleNodeClick(node.id)}
                style={{ cursor: 'pointer', transition: 'all 0.4s ease' }}
              >
                {/* Visual pulse for high intensity nodes */}
                {node.intensity > 0.6 && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={size + 15}
                    fill={color}
                    opacity={active ? 0.1 : 0}
                    style={{ transition: 'opacity 0.4s' }}
                    className="animate-pulse-slow"
                  />
                )}

                {/* Node Main Dot */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={isHovered ? size * 1.5 : size}
                  fill={color}
                  opacity={hoveredNode ? (active ? 0.9 : 0.2) : (node.intensity + 0.2)}
                  style={{ 
                    filter: isHovered ? 'url(#glow-filter)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                  }}
                />

                {/* Satellite small dots for "neural" feel */}
                {[0, 120, 240].map((angle, j) => {
                  const rad = (angle * Math.PI) / 180;
                  const dist = size + 5;
                  return (
                    <circle
                      key={j}
                      cx={node.x + Math.cos(rad) * dist}
                      cy={node.y + Math.sin(rad) * dist}
                      r={1.5}
                      fill={color}
                      opacity={active ? 0.4 : 0}
                      className="animate-flicker"
                      style={{ animationDelay: `${j * 0.5}s` }}
                    />
                  );
                })}

                {/* Node Label */}
                <text
                  x={node.x}
                  y={node.y + size + 20}
                  textAnchor="middle"
                  className="label-xxs"
                  style={{
                    fill: active ? color : 'var(--on-surface-variant)',
                    opacity: hoveredNode ? (active ? 1 : 0.3) : 0.6,
                    fontWeight: active ? 700 : 400,
                    fontSize: '8px',
                    pointerEvents: 'none',
                    transition: 'all 0.3s'
                  }}
                >
                  {label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Static Overlay UI */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '2rem', 
          left: '2rem', 
          pointerEvents: 'none' 
        }}
      >
        <h2 
          style={{ 
            fontSize: '1.375rem', 
            fontWeight: 300, 
            letterSpacing: '-0.02em', 
            color: 'var(--on-surface)' 
          }}
        >
          Mapa Consciente
        </h2>
        <p style={{ fontSize: '0.75rem', color: 'rgba(172,171,170,0.7)', marginTop: 4 }}>
          Explora las conexiones de tu mente
        </p>
      </div>

      {/* Legend / Hover Info */}
      <div 
        style={{ 
          position: 'absolute', 
          bottom: '2rem', 
          right: '2rem',
          textAlign: 'right',
          opacity: hoveredNode ? 1 : 0,
          transition: 'opacity 0.3s'
        }}
      >
        <span className="label-xs" style={{ color: 'var(--primary)' }}>Hilo Seleccionado</span>
        <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--on-surface)' }}>
          {hoveredNode && NODE_LABELS[hoveredNode]}
        </div>
      </div>
    </section>
  );
}
