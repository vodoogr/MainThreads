import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import {
  CIRCUIT_IDS,
  CIRCUIT_COLORS,
  CIRCUIT_DESCRIPTIONS,
  graphData as fallbackData,
} from '../data/mockData';
import { useNeuralStore } from '../store/neuralStore';
import NeuralAura from './NeuralAura';

// ─── Intuitive Spanish Labels ───────────────────────────────────────────────
const DISPLAY_LABELS = {
  [CIRCUIT_IDS.SYMBOLIC]:       'Pensamiento / Sobrecarga',
  [CIRCUIT_IDS.SOCIO_SEXUAL]:   'Relaciones',
  [CIRCUIT_IDS.EMOTIONAL]:      'Emocional / Social',
  [CIRCUIT_IDS.NEUROSOMATIC]:   'Cuerpo / Sensaciones',
  [CIRCUIT_IDS.BIO_SURVIVAL]:   'Supervivencia / Seguridad',
  [CIRCUIT_IDS.METAPROGRAMMING]:'Creatividad / Expresión',
  [CIRCUIT_IDS.NEUROGENETIC]:   'Sentido / Propósito',
  [CIRCUIT_IDS.QUANTUM]:        'Trascendencia',
  SURVIVAL:      'Supervivencia / Seguridad',
  RELATIONSHIPS: 'Relaciones',
  CONTROL:       'Control / Autoestima',
  OVERTHINKING:  'Pensamiento / Sobrecarga',
  BODY:          'Cuerpo / Sensaciones',
  CREATIVITY:    'Creatividad / Expresión',
  MEANING:       'Sentido / Propósito',
};

const LEFT_IDS = new Set([
  CIRCUIT_IDS.BIO_SURVIVAL, CIRCUIT_IDS.EMOTIONAL,
  CIRCUIT_IDS.SYMBOLIC, CIRCUIT_IDS.SOCIO_SEXUAL,
  'SURVIVAL', 'RELATIONSHIPS', 'CONTROL', 'OVERTHINKING',
]);

/**
 * BrainGraph - Balanced Living System
 */
export default function BrainGraph({ data }) {
  const navigate = useNavigate();
  const svgRef  = useRef(null);
  const simRef  = useRef(null);
  const [expandedIds, setExpandedIds]  = useState(new Set());
  const [hoveredNode, setHoveredNode]  = useState(null);
  const [biometricSync, setBiometricSync] = useState(false);
  const [hrvValue, setHrvValue] = useState(72); // Mock HRV for now
  const [focusedNodeId, setFocusedNodeId] = useState(null);

  // ── Zustand Store ─────────────────────────────────────────────────────────
  const { 
    circuits: storeCircuits, 
    entries: storeEntries, 
    loading, 
    fetchCircuits, 
    fetchEntries,
    currentHrv
  } = useNeuralStore();

  useEffect(() => {
    if (storeCircuits.length === 0) fetchCircuits();
    if (Object.keys(storeEntries).length === 0) fetchEntries();
  }, []);

  const handleExport = async () => {
    const html2canvas = (await import('html2canvas')).default;
    const element = svgRef.current.parentElement;
    const canvas = await html2canvas(element, {
      backgroundColor: '#000',
      logging: false,
      useCORS: true,
      scale: 2 // High quality
    });
    const link = document.createElement('a');
    link.download = `Mental-Threads-Constellation-${new Date().toISOString().slice(0,10)}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  // Use store data if available, otherwise fallback to mock/props
  const circuitsToUse = storeCircuits.length > 0 ? storeCircuits : (data?.nodes || fallbackData.nodes);
  const entriesToUse  = Object.keys(storeEntries).length > 0 ? storeEntries : {};

  const graphData = useMemo(() => ({
    nodes: circuitsToUse.map(c => ({
      id: c.id,
      intensity: (entriesToUse[c.id] ?? []).reduce((acc, e) => acc + (e.intensity || 5), 0) / (entriesToUse[c.id]?.length || 1)
    })),
    links: (data ?? fallbackData).links ?? [],
  }), [circuitsToUse, entriesToUse, data]);

  const dominantId = useMemo(() => {
    if (!graphData.nodes.length) return null;
    return graphData.nodes.reduce((a, b) => {
      const countA = (entriesToUse[a.id] ?? []).length;
      const countB = (entriesToUse[b.id] ?? []).length;
      return countA >= countB ? a : b;
    }).id;
  }, [graphData.nodes, entriesToUse]);

  // ── Balance Calculation ───────────────────────────────────────────────────
  const balance = useMemo(() => {
    let l = 0, r = 0;
    graphData.nodes.forEach(n => {
      LEFT_IDS.has(n.id) ? (l += n.intensity ?? 0.5) : (r += n.intensity ?? 0.5);
    });
    const tot = l + r || 1;
    const lP  = Math.round((l / tot) * 100);
    return {
      left: lP, right: 100 - lP,
      dominant: lP >= 50 ? 'Izquierdo (Terrestre)' : 'Derecho (Post-terrestre)',
      color:    lP >= 50 ? '#60b8ff' : '#ff6eb4',
    };
  }, [graphData.nodes]);

  // ── Avatar Evolution (Living Visuals) ───────────────────────────────────
  const avatarVisuals = useMemo(() => {
    const totalEntries = Object.values(entriesToUse).flat().length;
    const balanceDrift = Math.abs(balance.left - 50); // 0 = perfectly balanced
    
    // Growth effects (more entries = more energy)
    const brightness = Math.min(0.8 + (totalEntries * 0.04), 1.6);
    const saturation = Math.min(1.0 + (totalEntries * 0.08), 2.2);
    // Clarity effects (more balance = less blur)
    const blur       = Math.max(0, (balanceDrift / 5) - 1); 
    const opacity    = Math.min(0.12 + (totalEntries * 0.012), 0.35);

    return { brightness, saturation, blur, opacity };
  }, [entriesToUse, balance]);

  // ── Node/Link Graph Construction ──────────────────────────────────────────
  const { nodes, links } = useMemo(() => {
    const baseNodes = graphData.nodes.map((n, i) => ({
      ...n,
      _label:      DISPLAY_LABELS[n.id] ?? n.name ?? n.id,
      _color:      CIRCUIT_COLORS[n.id] ?? n.color ?? '#fff',
      _isDominant: n.id === dominantId,
      _type:       'circuit',
      _count:      (entriesToUse[n.id] ?? []).length,
      _expanded:   expandedIds.has(n.id),
      x: LEFT_IDS.has(n.id) ? 300 + (Math.random() - 0.5) * 100 : 600 + (Math.random() - 0.5) * 100,
      y: 250 + (Math.random() - 0.5) * 150,
    }));

    const baseLinks = graphData.links.map(l => ({ ...l, _type: 'thread' }));
    let allNodes = [...baseNodes];
    let allLinks = [...baseLinks];

    expandedIds.forEach(cid => {
      const parent = allNodes.find(n => n.id === cid);
      if (!parent) return;
      (entriesToUse[cid] ?? []).forEach(e => {
        const sid = `entry-${cid}-${e.id}`;
        allNodes.push({
          id: sid, _label: e.text, _color: parent._color, _type: 'entry', parentId: cid,
          x: parent.x + (Math.random() - 0.5) * 20,
          y: parent.y + (Math.random() - 0.5) * 20,
        });
        allLinks.push({ source: cid, target: sid, _type: 'branch', _color: parent._color });
      });
    });

    return { nodes: allNodes, links: allLinks };
  }, [graphData, expandedIds, dominantId]);

  // ── D3 Simulation ─────────────────────────────────────────────────────────
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const W = 900, H = 500;
    
    // Zoom/Focus Logic
    let transform = d3.zoomIdentity;
    if (focusedNodeId) {
      const targetNode = nodes.find(n => n.id === focusedNodeId);
      if (targetNode) {
        const scale = 1.8;
        const tx = W / 2 - targetNode.x * scale;
        const ty = H / 2 - targetNode.y * scale;
        transform = d3.zoomIdentity.translate(tx, ty).scale(scale);
      }
    }

    svg.selectAll('.sim-layer').remove();
    const root = svg.append('g')
      .attr('class', 'sim-layer')
      .attr('transform', transform);
    
    const defs = svg.select('defs');

    // Glow
    const setupGlow = (id, std) => {
      defs.select(`#${id}`).remove();
      const f = defs.append('filter').attr('id', id).attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
      f.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', std).attr('result', 'blur');
      f.append('feMerge').selectAll('feMergeNode').data(['blur', 'SourceGraphic']).join('feMergeNode').attr('in', d => d);
    };
    setupGlow('neural-glow', 3);
    setupGlow('dominant-glow', 12);

    // Links
    const linkSel = root.append('g').attr('class', 'links')
      .selectAll('line').data(links).join('line')
      .attr('stroke', d => d._type === 'thread' ? '#4da9ff' : d._color)
      .attr('stroke-width', d => d._type === 'thread' ? 2 : 1)
      .attr('stroke-dasharray', d => d._type === 'thread' ? '6 4' : '2 2')
      .attr('opacity', 0.5)
      .attr('class', d => d._type === 'thread' ? 'neural-pathway' : '');

    // Nodes
    const nodeSel = root.append('g').attr('class', 'nodes')
      .selectAll('g').data(nodes, d => d.id).join('g').attr('cursor', 'pointer');

    nodeSel.append('circle')
      .attr('r', d => nodeR(d))
      .attr('fill', d => d._color)
      .attr('filter', d => d._isDominant ? 'url(#dominant-glow)' : 'url(#neural-glow)')
      .attr('opacity', 0.95);

    nodeSel.filter(d => d._type === 'circuit')
      .append('text')
      .text(d => d._label)
      .attr('text-anchor', 'middle')
      .attr('y', d => nodeR(d) + 16)
      .attr('fill', 'white')
      .attr('font-size', d => d._isDominant ? '10px' : '8.5px')
      .attr('font-weight', 800)
      .style('pointer-events', 'none')
      .style('text-shadow', '0 2px 4px rgba(0,0,0,0.8)')
      .style('text-transform', 'uppercase');

    // Sub-entry Labels
    nodeSel.filter(d => d._type === 'entry')
      .append('text')
      .text(d => d._label.length > 20 ? d._label.slice(0, 18) + '...' : d._label)
      .attr('text-anchor', 'start').attr('dx', 8).attr('dy', 3)
      .attr('fill', 'rgba(255,255,255,0.7)').attr('font-size', '7px').style('pointer-events', 'none');

    // Numeric badges on circuit nodes
    const badgeG = nodeSel.filter(d => d._type === 'circuit');
    badgeG.append('circle')
      .attr('cx', d => nodeR(d) / 1.5)
      .attr('cy', d => -nodeR(d) / 1.5)
      .attr('r', 7)
      .attr('fill', 'white')
      .attr('opacity', 1);
    
    badgeG.append('text')
      .text(d => d._count)
      .attr('x', d => nodeR(d) / 1.5)
      .attr('y', d => -nodeR(d) / 1.5)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', 'black')
      .attr('font-size', '8px')
      .attr('font-weight', 900)
      .style('pointer-events', 'none');

    nodeSel.on('click', (event, d) => {
      event.stopPropagation();
      if (d._type === 'circuit') {
        const isCurrentlyFocused = focusedNodeId === d.id;
        setFocusedNodeId(isCurrentlyFocused ? null : d.id);
        setExpandedIds(prev => {
          const next = new Set(prev);
          if (isCurrentlyFocused) {
            next.delete(d.id);
          } else {
            next.add(d.id);
          }
          return next;
        });
      } else if (d.parentId) navigate(`/detalle_de_nodo/${d.parentId}`);
    });
    nodeSel.on('mouseenter', (_, d) => setHoveredNode(d)).on('mouseleave', () => setHoveredNode(null));

    // Simulation Tuning
    const sim = d3.forceSimulation(nodes)
      .velocityDecay(0.4)
      .force('link', d3.forceLink(links).id(d => d.id).distance(d => d._type === 'thread' ? 140 : 50).strength(0.7))
      .force('charge', d3.forceManyBody().strength(d => d._type === 'circuit' ? -150 : -40))
      .force('center', d3.forceCenter(W / 2, H / 2).strength(0.1))
      .force('collision', d3.forceCollide().radius(d => nodeR(d) + 20).strength(1));

    sim.on('tick', () => {
      nodes.forEach(d => {
        d.x = Math.max(100, Math.min(W - 100, d.x));
        d.y = Math.max(80, Math.min(H - 80, d.y));
      });
      linkSel.attr('x1', d => d.source.x).attr('y1', d => d.source.y).attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      nodeSel.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    simRef.current = sim;
    return () => sim.stop();
  }, [nodes, links]);

  function nodeR(d) {
    if (d._type === 'entry') return 3.5;
    // Sizing depends on sub-node count
    const base = 8;
    const growth = (d._count || 0) * 1.5;
    return base + growth;
  }

  return (
    <section className="neural-card" style={{ position: 'relative', width: '100%', height: 500, background: '#000', borderRadius: '2rem', overflow: 'hidden' }}>
      
      {loading && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)' }}>
          <div style={{ color: 'white', fontSize: '0.8rem', letterSpacing: '0.1em' }}>SINCRONIZANDO NEURONAS...</div>
        </div>
      )}
      
      {/* Background Evolution Layer (NeuralAura) */}
      <NeuralAura 
        balance={balance} 
        hrv={currentHrv} 
        totalEntries={Object.values(entriesToUse).flat().length} 
      />

      <img 
        src="/assets/brain_bg.png" 
        style={{ 
          position: 'absolute', inset: 0, width: '100%', height: '100%', 
          objectFit: 'cover', 
          opacity: 0.15, // Fixed low opacity to work with Aura
          filter: `brightness(${avatarVisuals.brightness}) saturate(${avatarVisuals.saturation}) blur(${avatarVisuals.blur}px)`,
          mixBlendMode: 'overlay', // Blend with Aura
          pointerEvents: 'none',
          transition: 'all 2.5s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: 1
        }} 
      />

      <style>{`
        @keyframes neuralFlow { from { stroke-dashoffset: 20; } to { stroke-dashoffset: 0; } }
        .neural-pathway { stroke-dasharray: 6, 4; animation: neuralFlow 1.5s linear infinite; }
      `}</style>

      <svg ref={svgRef} viewBox="0 0 900 500" style={{ width: '100%', height: '100%', position: 'relative', zIndex: 2 }}>
        <defs />
      </svg>

      {/* Control Tools */}
      <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.75rem', zIndex: 30 }}>
        <button 
          onClick={handleExport}
          className="glass-card" 
          style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>download</span>
        </button>
        <button 
          onClick={() => setBiometricSync(!biometricSync)}
          className="glass-card" 
          style={{ 
            width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', 
            color: biometricSync ? '#00ffcc' : 'white', cursor: 'pointer', border: biometricSync ? '1px solid #00ffcc' : '1px solid rgba(255,255,255,0.1)' 
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '1.2rem' }}>watch</span>
        </button>
      </div>

      {/* Huawei Biometric Overlay */}
      {biometricSync && (
        <div style={{ position: 'absolute', top: '7rem', left: '2rem', zIndex: 25 }} className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(0,0,0,0.6)', padding: '0.5rem 1rem', borderRadius: '1rem', border: '1px solid #00ffcc55', backdropFilter: 'blur(10px)' }}>
            <div className="animate-pulse-slow" style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ffcc' }} />
            <span className="label-xs" style={{ color: '#00ffcc', letterSpacing: '0.1em' }}>GT5 Sync: {hrvValue} ms (Estrés Bajo)</span>
          </div>
        </div>
      )}

      {focusedNodeId && (
        <button 
          onClick={(e) => { e.stopPropagation(); setFocusedNodeId(null); setExpandedIds(new Set()); }}
          style={{ position: 'absolute', top: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 50, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '0.6rem 1.25rem', borderRadius: '99px', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
          className="label-xs animate-fade-in"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>close</span>
            Vista Global
          </span>
        </button>
      )}

      {/* Analytics Overlay (Restored) */}
      <div style={{ position: 'absolute', top: '2rem', left: '2rem', right: '2rem', pointerEvents: 'none', zIndex: 10, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', color: 'white' }}>Equilibrio Hemisférico</h2>
          <div style={{ display: 'flex', height: 4, width: 220, background: 'rgba(255,255,255,0.05)', marginTop: 8, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${balance.left}%`, background: '#60b8ff', transition: 'width 0.8s ease' }} />
            <div style={{ flex: 1, background: '#ff6eb4' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: 220, marginTop: 4 }}>
            <span style={{ fontSize: '0.6rem', color: '#60b8ff', fontWeight: 800 }}>{balance.left}% IZQ</span>
            <span style={{ fontSize: '0.6rem', color: '#ff6eb4', fontWeight: 800 }}>{balance.right}% DER</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
           <div style={{ fontSize: '1.8rem', fontWeight: 900, color: balance.color }}>{Math.max(balance.left, balance.right)}%</div>
           <div style={{ fontSize: '0.55rem', opacity: 0.4, letterSpacing: '0.1em' }}>{balance.dominant.split(' ')[0]}</div>
        </div>
      </div>

      {hoveredNode && (
        <div className="animate-fade-in" style={{
          position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem',
          padding: '1.25rem', background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(40px)', 
          borderRadius: '1.5rem', border: `1px solid ${hoveredNode._color}55`, zIndex: 20
        }}>
          <div style={{ fontWeight: 900, fontSize: '0.8rem', color: hoveredNode._color, textTransform: 'uppercase' }}>
            {hoveredNode._label}
          </div>
          <p style={{ fontSize: '0.72rem', opacity: 0.6, marginTop: 4 }}>
            {hoveredNode._type === 'circuit' ? CIRCUIT_DESCRIPTIONS[hoveredNode.id] : 'Hebra de pensamiento activa'}
          </p>
        </div>
      )}
    </section>
  );
}
