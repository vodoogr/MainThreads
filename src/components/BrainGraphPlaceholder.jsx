/**
 * BrainGraphPlaceholder
 * 
 * Isolated placeholder component for the neural graph visualization.
 * Occupies the exact space the final BrainGraph will take.
 * 
 * To replace with the real component:
 *   import BrainGraph from '@/components/BrainGraph';
 * and swap <BrainGraphPlaceholder /> → <BrainGraph data={graphData} />
 */

import { graphData, NODE_LABELS } from '../data/mockData';

export default function BrainGraphPlaceholder() {
  return (
    <section className="neural-card" style={{ height: 440, width: '100%', position: 'relative' }}>
      {/* Radial background glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.3,
          background:
            'radial-gradient(circle at center, rgba(137,212,205,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* SVG Neural Fabric */}
      <svg
        viewBox="0 0 400 400"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <radialGradient id="glow-p" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#89d4cd" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#89d4cd" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="glow-s" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#d3bcfc" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#d3bcfc" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="threadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f9db7d" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#f9db7d" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f9db7d" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Background mesh */}
        <g opacity="0.06" stroke="white" strokeWidth="0.3" fill="none">
          <path d="M50,50 L150,120 L80,200 L120,300 L200,350 L300,280 L350,350 L380,200 L350,80 L250,30 L150,60 Z" />
          <path d="M100,150 L200,100 L300,150 L200,250 Z" />
        </g>

        {/* Micro dots for density */}
        <g opacity="0.08" fill="white">
          {Array.from({ length: 30 }, (_, i) => (
            <circle
              key={i}
              cx={40 + Math.random() * 320}
              cy={40 + Math.random() * 320}
              r={0.3 + Math.random() * 0.5}
            />
          ))}
        </g>

        {/* Connections */}
        {graphData.connections.map((conn, i) => {
          const source = graphData.nodes.find((n) => n.id === conn.source);
          const target = graphData.nodes.find((n) => n.id === conn.target);
          if (!source || !target) return null;
          const mx = (source.x + target.x) / 2 + (i % 2 === 0 ? 30 : -30);
          const my = (source.y + target.y) / 2 + (i % 2 === 0 ? -20 : 20);
          return (
            <path
              key={`conn-${i}`}
              d={`M${source.x},${source.y} Q${mx},${my} ${target.x},${target.y}`}
              fill="none"
              stroke="#89d4cd"
              strokeWidth={conn.strength * 1.5}
              opacity={conn.strength * 0.4}
              className="animate-pulse-slow"
              style={{ animationDelay: `${i * 0.8}s` }}
            />
          );
        })}

        {/* Threads (warm paths) */}
        {graphData.threads.map((thread, i) => {
          const source = graphData.nodes.find((n) => n.id === thread.source);
          const target = graphData.nodes.find((n) => n.id === thread.target);
          if (!source || !target) return null;
          return (
            <path
              key={`thread-${i}`}
              d={`M${source.x},${source.y} Q${(source.x + target.x) / 2 + 40},${(source.y + target.y) / 2} ${target.x},${target.y}`}
              fill="none"
              stroke="url(#threadGrad)"
              strokeWidth={thread.strength * 2.5}
              opacity={0.5}
              strokeDasharray="2000"
              strokeDashoffset="2000"
              style={{ animation: 'dash-line 15s linear infinite' }}
            />
          );
        })}

        {/* Node glows */}
        {graphData.nodes.map((node) => (
          <circle
            key={`glow-${node.id}`}
            cx={node.x}
            cy={node.y}
            r={20 + node.intensity * 30}
            fill={node.intensity > 0.5 ? 'url(#glow-p)' : 'url(#glow-s)'}
            className="animate-pulse-slow"
            style={{ animationDelay: `${node.intensity * 3}s` }}
          />
        ))}
      </svg>

      {/* Interactive node layer */}
      <div className="animate-breathe" style={{ position: 'relative', width: '100%', height: '100%' }}>
        {graphData.nodes.map((node) => {
          const label = NODE_LABELS[node.id]?.split(' / ')[0] || node.id;
          const isActive = node.intensity > 0.5;
          const dotCount = Math.max(2, Math.round(node.intensity * 6));
          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: `${(node.x / 400) * 100}%`,
                top: `${(node.y / 400) * 100}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                opacity: isActive ? 0.9 : 0.2,
                transition: 'opacity 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = isActive ? '0.9' : '0.2')}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, width: 24 + node.intensity * 16, justifyContent: 'center' }}>
                {Array.from({ length: dotCount }, (_, di) => (
                  <div
                    key={di}
                    className={di === 0 && isActive ? 'glow-primary' : ''}
                    style={{
                      width: 3 + Math.random() * 5,
                      height: 3 + Math.random() * 5,
                      borderRadius: '50%',
                      background: isActive ? 'var(--primary)' : 'rgba(231,229,228,0.4)',
                      opacity: 0.4 + Math.random() * 0.6,
                    }}
                  />
                ))}
              </div>
              <span
                style={{
                  display: 'block',
                  textAlign: 'center',
                  marginTop: 8,
                  fontSize: isActive ? '0.5625rem' : '0.5rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: isActive ? 'var(--primary)' : 'rgba(231,229,228,0.6)',
                  fontWeight: isActive ? 700 : 400,
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </span>
            </div>
          );
        })}

        {/* Floating insight tag */}
        <div
          style={{
            position: 'absolute',
            top: '22%',
            right: '8%',
            background: 'rgba(38,38,38,0.4)',
            backdropFilter: 'blur(12px)',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(249,219,125,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            className="animate-flicker"
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--tertiary)',
              boxShadow: '0 0 8px #f9db7d',
            }}
          />
          <span
            className="label-xs"
            style={{ color: 'var(--tertiary)', fontWeight: 600, fontSize: '0.5625rem' }}
          >
            Hecho: Prioridad
          </span>
        </div>
      </div>

      {/* Title overlay */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          pointerEvents: 'none',
        }}
      >
        <h2
          style={{
            fontSize: '1.375rem',
            fontWeight: 300,
            letterSpacing: '-0.02em',
            color: 'var(--on-surface)',
          }}
        >
          Mapa Consciente
        </h2>
        <p
          style={{
            fontSize: '0.75rem',
            color: 'rgba(172,171,170,0.7)',
            marginTop: 4,
          }}
        >
          Tu arquitectura neural esta semana
        </p>
      </div>
    </section>
  );
}
