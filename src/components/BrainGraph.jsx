import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import {
  CIRCUIT_IDS,
  CIRCUIT_LABELS,
  CIRCUIT_COLORS,
  CIRCUIT_DESCRIPTIONS,
  circuitEntries,
  graphData as fallbackData,
} from '../data/mockData';

// ─── Label mapping: internal ID → Spanish display label ─────────────────────
const DISPLAY_LABELS = {
  [CIRCUIT_IDS.BIO_SURVIVAL]:      'Bio-Supervivencia',
  [CIRCUIT_IDS.EMOTIONAL]:         'Emocional-Territorial',
  [CIRCUIT_IDS.SYMBOLIC]:          'Simbólico-Semántico',
  [CIRCUIT_IDS.SOCIO_SEXUAL]:      'Socio-Sexual (Moral)',
  [CIRCUIT_IDS.NEUROSOMATIC]:      'Neurosomático (Éxtasis)',
  [CIRCUIT_IDS.METAPROGRAMMING]:   'Meta-Programación',
  [CIRCUIT_IDS.NEUROGENETIC]:      'Neurogenético (Memoria)',
  [CIRCUIT_IDS.QUANTUM]:           'Cuántico (No-Local)',
  // Compatibility with legacy CIRCUIT_IDS keys if mockData uses them:
  SURVIVAL:       'Supervivencia / Seguridad',
  RELATIONSHIPS:  'Relaciones',
  CONTROL:        'Control / Autoestima',
  OVERTHINKING:   'Pensamiento / Sobrecarga',
  BODY:           'Cuerpo / Sensaciones',
  CREATIVITY:     'Creatividad / Expresión',
  MEANING:        'Sentido / Propósito',
};

// ─── Anatomical anchors: each circuit pinned to a % of the SVG viewport ─────
// SVG is 900×500. Left hemisphere (terrestre) x ≈ 60–350; Right (post-terrestre) x ≈ 550–840
const ANCHORS = {
  // LEFT — Terrestrial (Subcortical → Prefrontal)
  [CIRCUIT_IDS.BIO_SURVIVAL]:    { cx: 160, cy: 370 },  // Tronco (base izq)
  [CIRCUIT_IDS.EMOTIONAL]:       { cx: 200, cy: 260 },  // Límbico
  [CIRCUIT_IDS.SYMBOLIC]:        { cx: 250, cy: 160 },  // Neocórtex Izq
  [CIRCUIT_IDS.SOCIO_SEXUAL]:    { cx: 310, cy: 100 },  // Prefrontal Izq
  // RIGHT — Post-terrestrial (Somático → Cuántico)
  [CIRCUIT_IDS.NEUROSOMATIC]:    { cx: 580, cy: 270 },  // Somático Der
  [CIRCUIT_IDS.METAPROGRAMMING]: { cx: 650, cy: 150 },  // Asociación Der
  [CIRCUIT_IDS.NEUROGENETIC]:    { cx: 730, cy: 210 },  // ADN Der
  [CIRCUIT_IDS.QUANTUM]:         { cx: 780, cy: 110 },  // No-local (vértice)
  // Fallback for legacy 7-node mockData
  SURVIVAL:      { cx: 160, cy: 360 },
  RELATIONSHIPS: { cx: 210, cy: 240 },
  CONTROL:       { cx: 270, cy: 155 },
  OVERTHINKING:  { cx: 340, cy: 105 },
  BODY:          { cx: 570, cy: 270 },
  CREATIVITY:    { cx: 660, cy: 170 },
  MEANING:       { cx: 750, cy: 120 },
};

// Left-hemisphere circuit ids for balance calculation
const LEFT_IDS = new Set([
  CIRCUIT_IDS.BIO_SURVIVAL, CIRCUIT_IDS.EMOTIONAL,
  CIRCUIT_IDS.SYMBOLIC, CIRCUIT_IDS.SOCIO_SEXUAL,
  'SURVIVAL', 'RELATIONSHIPS', 'CONTROL', 'OVERTHINKING',
]);

/**
 * BrainGraph
 *
 * Props:
 *   data?: { nodes: Node[], links: Link[] }
 *     Node: { id: string, intensity?: number, color?: string, name?: string }
 *     Link: { source: string, target: string }
 *   If omitted, falls back to mockData.
 */
export default function BrainGraph({ data }) {
  const navigate = useNavigate();
  const svgRef = useRef(null);
  const simRef = useRef(null);

  // ── Graph state ────────────────────────────────────────────────────────────
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [hoveredNode, setHoveredNode] = useState(null);

  // ── Normalise incoming data (support both {nodes,links} shapes) ────────────
  const graphData = useMemo(() => {
    const raw = data || fallbackData;
    return {
      nodes: raw.nodes ?? [],
      links: raw.links ?? [],
    };
  }, [data]);

  // ── Dominant node (highest intensity) ─────────────────────────────────────
  const dominantId = useMemo(() => {
    if (!graphData.nodes.length) return null;
    return graphData.nodes.reduce((a, b) =>
      (a.intensity ?? 0) > (b.intensity ?? 0) ? a : b
    ).id;
  }, [graphData.nodes]);

  // ── Hemisphere balance analytics ──────────────────────────────────────────
  const balance = useMemo(() => {
    let lSum = 0, rSum = 0;
    graphData.nodes.forEach(n => {
      const v = n.intensity ?? 0.5;
      LEFT_IDS.has(n.id) ? (lSum += v) : (rSum += v);
    });
    const total = lSum + rSum || 1;
    const lP = Math.round((lSum / total) * 100);
    const rP = 100 - lP;
    return {
      left: lP, right: rP,
      dominant: lP >= rP ? 'Izquierdo (Terrestre)' : 'Derecho (Post-terrestre)',
      color: lP >= rP ? '#60b8ff' : '#ff6eb4',
    };
  }, [graphData.nodes]);

  // ── Build full node + link set from graph data + expanded sub-nodes ────────
  const { nodes, links } = useMemo(() => {
    const nodes = graphData.nodes.map(n => ({
      ...n,
      _label: DISPLAY_LABELS[n.id] ?? n.name ?? n.id,
      _color: CIRCUIT_COLORS[n.id] ?? n.color ?? '#ffffff',
      _isDominant: n.id === dominantId,
      _type: 'circuit',
      // Anchor to anatomical position (fixed)
      fx: ANCHORS[n.id]?.cx ?? null,
      fy: ANCHORS[n.id]?.cy ?? null,
    }));

    const links = graphData.links.map(l => ({ ...l, _type: 'core' }));

    expandedIds.forEach(cid => {
      const entries = circuitEntries[cid] ?? [];
      const parent = nodes.find(n => n.id === cid);
      const anchor = ANCHORS[cid] ?? { cx: 450, cy: 250 };

      entries.forEach((e, i) => {
        const sid = `sub-${cid}-${e.id}`;
        const angle = (2 * Math.PI * i) / entries.length;
        nodes.push({
          id: sid,
          _label: e.text,
          _color: parent?._color ?? '#aaa',
          _isDominant: false,
          _type: 'entry',
          parentId: cid,
          intensity: e.intensity ?? 3,
          // Start near parent, then float freely
          x: anchor.cx + Math.cos(angle) * 50,
          y: anchor.cy + Math.sin(angle) * 50,
        });
        links.push({ source: cid, target: sid, _type: 'entry' });
      });
    });

    return { nodes, links };
  }, [graphData, expandedIds, dominantId]);

  // ── D3 Simulation ─────────────────────────────────────────────────────────
  // Dependency list: only structural data (nodes/links/expandedIds/dominantId)
  // hoveredNode intentionally EXCLUDED to avoid resetting the simulation on hover.
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const W = 900, H = 500;

    svg.selectAll('.sim-layer').remove();
    const root = svg.append('g').attr('class', 'sim-layer');

    // ── SVG Defs: glow filters ──────────────────────────────────────────────
    const defs = svg.select('defs');

    const makeGlow = (id, color, stdDev, opacity) => {
      defs.select(`#${id}`).remove();
      const f = defs.append('filter').attr('id', id).attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
      f.append('feColorMatrix').attr('type', 'matrix').attr('values', `0 0 0 0 ${parseInt(color.slice(1,3),16)/255} 0 0 0 0 ${parseInt(color.slice(3,5),16)/255} 0 0 0 0 ${parseInt(color.slice(5,7),16)/255} 0 0 0 ${opacity} 0`);
      f.append('feGaussianBlur').attr('stdDeviation', stdDev).attr('result', 'blur');
      f.append('feComposite').attr('in', 'SourceGraphic').attr('in2', 'blur').attr('operator', 'over');
    };

    // Pre-generate glow filters per unique color
    const usedColors = [...new Set(nodes.map(n => n._color).filter(c => c?.startsWith('#') && c.length === 7))];
    usedColors.forEach(c => {
      const safe = c.replace('#', 'col');
      makeGlow(`glow-${safe}`, c, 8, 18);
      makeGlow(`glow-dom-${safe}`, c, 18, 28);
    });

    const getFilter = (n) => {
      if (!n._color?.startsWith('#') || n._color.length !== 7) return null;
      const safe = n._color.replace('#', 'col');
      return n._isDominant ? `url(#glow-dom-${safe})` : `url(#glow-${safe})`;
    };

    // ── Links ───────────────────────────────────────────────────────────────
    const linkSel = root.append('g').attr('class', 'links')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => d._type === 'core' ? 'rgba(255,255,255,0.08)' : d._color ?? 'rgba(255,255,255,0.2)')
      .attr('stroke-width', d => d._type === 'core' ? 1.2 : 1.5)
      .attr('stroke-dasharray', d => d._type === 'core' ? '4 6' : null)
      .attr('opacity', 0.7);

    // ── Nodes ───────────────────────────────────────────────────────────────
    const nodeSel = root.append('g').attr('class', 'nodes')
      .selectAll('g')
      .data(nodes, d => d.id)
      .join(enter => {
        const g = enter.append('g').attr('cursor', 'pointer').attr('opacity', 0);
        g.transition().duration(400).attr('opacity', 1);
        return g;
      });

    // Outer glow ring (dominant only)
    nodeSel.filter(d => d._isDominant)
      .append('circle')
      .attr('r', d => nodeR(d) + 12)
      .attr('fill', 'none')
      .attr('stroke', d => d._color)
      .attr('stroke-width', 1)
      .attr('opacity', 0.3)
      .attr('filter', d => getFilter(d));

    // Main circle
    nodeSel.append('circle')
      .attr('r', nodeR)
      .attr('fill', d => d._color)
      .attr('fill-opacity', 0.9)
      .attr('filter', d => getFilter(d));

    // Label (circuits only)
    nodeSel.filter(d => d._type === 'circuit')
      .append('text')
      .text(d => d._label)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('y', d => nodeR(d) + 16)
      .attr('fill', '#fff')
      .attr('font-size', d => d._isDominant ? '10px' : '9px')
      .attr('font-weight', d => d._isDominant ? 800 : 500)
      .attr('font-family', 'Inter, sans-serif')
      .attr('letter-spacing', '0.04em')
      .attr('opacity', 0.85)
      .attr('text-transform', 'uppercase')
      .style('pointer-events', 'none')
      .style('text-transform', 'uppercase');

    // Events
    nodeSel
      .on('click', (event, d) => {
        event.stopPropagation();
        if (d._type === 'circuit') {
          setExpandedIds(prev => {
            const next = new Set(prev);
            next.has(d.id) ? next.delete(d.id) : next.add(d.id);
            return next;
          });
        } else if (d.parentId) {
          navigate(`/detalle_de_nodo/${d.parentId}`);
        }
      })
      .on('mouseenter', (_, d) => setHoveredNode(d))
      .on('mouseleave', () => setHoveredNode(null));

    // Drag (only free/sub nodes)
    nodeSel.filter(d => d._type === 'entry').call(
      d3.drag()
        .on('start', (event, d) => { if (!event.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on('end', (event, d) => { if (!event.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
    );

    // ── Simulation ──────────────────────────────────────────────────────────
    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(d => d._type === 'core' ? 120 : 55).strength(d => d._type === 'core' ? 0.1 : 0.8))
      .force('charge', d3.forceManyBody().strength(d => d._type === 'circuit' ? -20 : -60))
      .force('center', d3.forceCenter(W / 2, H / 2).strength(0.02))
      .force('collision', d3.forceCollide().radius(d => nodeR(d) + 20));

    // Bounding box: keep sub-nodes inside the brain "canvas"
    sim.on('tick', () => {
      nodes.forEach(d => {
        if (d._type === 'entry') {
          d.x = Math.max(60, Math.min(W - 60, d.x));
          d.y = Math.max(60, Math.min(H - 60, d.y));
        }
      });

      linkSel
        .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y);

      nodeSel.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    simRef.current = sim;

    return () => sim.stop();
  }, [nodes, links]); // ← hover excluded intentionally

  // ── Node radius helper ─────────────────────────────────────────────────────
  function nodeR(d) {
    if (d._type === 'entry') return 5 + (d.intensity ?? 3) * 0.6;
    if (d._isDominant) return 16;
    return 9;
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section
      className="neural-card"
      style={{
        position: 'relative',
        width: '100%',
        height: 520,
        overflow: 'hidden',
        borderRadius: '2.5rem',
        background: '#000',
      }}
    >
      {/* ── Brain Image Background ── */}
      <img
        src="/assets/brain_bg.png"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          opacity: 0.45,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />

      {/* ── D3 SVG Canvas ── */}
      <svg
        ref={svgRef}
        viewBox="0 0 900 500"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%', display: 'block' }}
      >
        <defs />
        {/* Hemisphere zone labels (non-interactive) */}
        <text x="90" y="470" fill="#60b8ff" fontSize="10" fontWeight="700" opacity="0.5" fontFamily="Inter,sans-serif" textAnchor="middle">TERRESTRE (IZQ.)</text>
        <text x="760" y="470" fill="#ff6eb4" fontSize="10" fontWeight="700" opacity="0.5" fontFamily="Inter,sans-serif" textAnchor="middle">POST-TERRESTRE (DER.)</text>
        {/* Subtle centre divider */}
        <line x1="450" y1="40" x2="450" y2="460" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="6 8" />
      </svg>

      {/* ── Balance Analytics Overlay ── */}
      <div style={{
        position: 'absolute', top: '2rem', left: '2rem', right: '2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        pointerEvents: 'none', zIndex: 5,
      }}>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '-0.02em', textTransform: 'uppercase', color: '#fff', marginBottom: 6 }}>
            Equilibrio Hemisférico
          </h2>
          <p style={{ fontSize: '0.65rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Predominancia: <span style={{ color: balance.color, fontWeight: 800 }}>{balance.dominant}</span>
          </p>
          <div style={{ display: 'flex', height: 3, width: 220, marginTop: 10, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${balance.left}%`, background: '#60b8ff', transition: 'width 0.8s ease' }} />
            <div style={{ flex: 1, background: '#ff6eb4', transition: 'width 0.8s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: 220, marginTop: 6 }}>
            <span style={{ fontSize: '0.6rem', color: '#60b8ff', fontWeight: 800 }}>{balance.left}% IZQ</span>
            <span style={{ fontSize: '0.6rem', color: '#ff6eb4', fontWeight: 800 }}>{balance.right}% DER</span>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: balance.color, lineHeight: 1 }}>
            {Math.max(balance.left, balance.right)}%
          </div>
          <div style={{ fontSize: '0.6rem', opacity: 0.4, letterSpacing: '0.08em', marginTop: 4 }}>AFINIDAD</div>
        </div>
      </div>

      {/* ── Hover Tooltip ── */}
      {hoveredNode && (
        <div
          className="animate-fade-in"
          style={{
            position: 'absolute',
            bottom: '2rem', left: '2rem', right: '2rem',
            padding: '1rem 1.25rem',
            background: 'rgba(4,4,4,0.82)',
            backdropFilter: 'blur(30px)',
            borderRadius: '1.25rem',
            border: `1px solid ${hoveredNode._color}33`,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontWeight: 900, fontSize: '0.8rem', color: hoveredNode._color, textTransform: 'uppercase', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
            <span>{hoveredNode._label}</span>
            {hoveredNode._isDominant && (
              <span style={{ fontSize: '0.6rem', padding: '2px 8px', borderRadius: 4, background: hoveredNode._color, color: '#000', fontWeight: 900 }}>
                DOMINANTE
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.72rem', opacity: 0.55, lineHeight: 1.5, margin: 0 }}>
            {hoveredNode._type === 'circuit'
              ? (CIRCUIT_DESCRIPTIONS[hoveredNode.id] ?? 'Circuito neuronal activo')
              : 'Hilo de pensamiento — clic para profundizar'}
          </p>
        </div>
      )}
    </section>
  );
}
