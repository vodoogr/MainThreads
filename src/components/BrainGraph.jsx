import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import {
  CIRCUIT_IDS,
  CIRCUIT_COLORS,
  CIRCUIT_DESCRIPTIONS,
  circuitEntries,
  graphData as fallbackData,
} from '../data/mockData';

// ─── Spanish display labels (no internal English IDs shown) ─────────────────
const DISPLAY_LABELS = {
  [CIRCUIT_IDS.BIO_SURVIVAL]:    'Bio-Supervivencia',
  [CIRCUIT_IDS.EMOTIONAL]:       'Emocional',
  [CIRCUIT_IDS.SYMBOLIC]:        'Simbólico',
  [CIRCUIT_IDS.SOCIO_SEXUAL]:    'Socio-Sexual',
  [CIRCUIT_IDS.NEUROSOMATIC]:    'Neurosomático',
  [CIRCUIT_IDS.METAPROGRAMMING]: 'Meta-Progr.',
  [CIRCUIT_IDS.NEUROGENETIC]:    'Neurogenético',
  [CIRCUIT_IDS.QUANTUM]:         'Cuántico',
  SURVIVAL:      'Supervivencia',
  RELATIONSHIPS: 'Relaciones',
  CONTROL:       'Control',
  OVERTHINKING:  'Pensamiento',
  BODY:          'Cuerpo',
  CREATIVITY:    'Creatividad',
  MEANING:       'Sentido',
};

// ─── Anatomical anchors: fixed positions inside the brain image ──────────────
// SVG viewBox 900×500. Left (terrestrial) x≈80-380; Right (post-terrestrial) x≈520-840
const ANCHORS = {
  [CIRCUIT_IDS.BIO_SURVIVAL]:    { cx: 155, cy: 360 },
  [CIRCUIT_IDS.EMOTIONAL]:       { cx: 205, cy: 255 },
  [CIRCUIT_IDS.SYMBOLIC]:        { cx: 268, cy: 162 },
  [CIRCUIT_IDS.SOCIO_SEXUAL]:    { cx: 345, cy: 108 },
  [CIRCUIT_IDS.NEUROSOMATIC]:    { cx: 560, cy: 262 },
  [CIRCUIT_IDS.METAPROGRAMMING]: { cx: 645, cy: 152 },
  [CIRCUIT_IDS.NEUROGENETIC]:    { cx: 725, cy: 208 },
  [CIRCUIT_IDS.QUANTUM]:         { cx: 792, cy: 112 },
  // legacy
  SURVIVAL: { cx: 155, cy: 360 }, RELATIONSHIPS: { cx: 210, cy: 250 },
  CONTROL:  { cx: 270, cy: 158 }, OVERTHINKING:  { cx: 340, cy: 108 },
  BODY:     { cx: 560, cy: 265 }, CREATIVITY:    { cx: 650, cy: 158 },
  MEANING:  { cx: 750, cy: 118 },
};

const LEFT_IDS = new Set([
  CIRCUIT_IDS.BIO_SURVIVAL, CIRCUIT_IDS.EMOTIONAL,
  CIRCUIT_IDS.SYMBOLIC, CIRCUIT_IDS.SOCIO_SEXUAL,
  'SURVIVAL', 'RELATIONSHIPS', 'CONTROL', 'OVERTHINKING',
]);

// ── Float animation offsets (subtle sinusoidal per-node) ────────────────────
const FLOAT_PARAMS = {};
const getFloat = (id) => {
  if (!FLOAT_PARAMS[id]) {
    FLOAT_PARAMS[id] = {
      amp:   3 + Math.random() * 3,         // 3–6 px amplitude
      freq:  0.0008 + Math.random() * 0.0006,// period ≈ 7–15 s
      phase: Math.random() * Math.PI * 2,
    };
  }
  return FLOAT_PARAMS[id];
};

/**
 * BrainGraph
 * Props: data?: { nodes: Node[], links: Link[] }
 */
export default function BrainGraph({ data }) {
  const navigate = useNavigate();
  const svgRef  = useRef(null);
  const rafRef  = useRef(null);

  const [expandedIds, setExpandedIds]  = useState(new Set());
  const [hoveredNode, setHoveredNode]  = useState(null);
  // Track if a node was just clicked (to avoid double-fire)
  const clickLock = useRef(false);

  // ── Normalise data ────────────────────────────────────────────────────────
  const graphData = useMemo(() => ({
    nodes: (data ?? fallbackData).nodes ?? [],
    links: (data ?? fallbackData).links ?? [],
  }), [data]);

  // ── Dominante ─────────────────────────────────────────────────────────────
  const dominantId = useMemo(() =>
    graphData.nodes.length
      ? graphData.nodes.reduce((a, b) => (a.intensity ?? 0) > (b.intensity ?? 0) ? a : b).id
      : null
  , [graphData.nodes]);

  // ── Balance analytics ──────────────────────────────────────────────────────
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

  // ── Entry counts per circuit (always available even when collapsed) ────────
  const entryCounts = useMemo(() => {
    const counts = {};
    graphData.nodes.forEach(n => {
      counts[n.id] = (circuitEntries[n.id] ?? []).length;
    });
    return counts;
  }, [graphData.nodes]);

  // ── Build node + link dataset ─────────────────────────────────────────────
  const { nodes, links } = useMemo(() => {
    const nodes = graphData.nodes.map(n => ({
      ...n,
      _label:      DISPLAY_LABELS[n.id] ?? n.name ?? n.id,
      _color:      CIRCUIT_COLORS[n.id] ?? n.color ?? '#fff',
      _isDominant: n.id === dominantId,
      _type:       'circuit',
      _count:      (circuitEntries[n.id] ?? []).length,
      _expanded:   expandedIds.has(n.id),
      // anchor = fixed position in brain zone
      fx: ANCHORS[n.id]?.cx ?? null,
      fy: ANCHORS[n.id]?.cy ?? null,
    }));

    const links = graphData.links.map(l => ({ ...l, _type: 'core' }));

    expandedIds.forEach(cid => {
      const parent = nodes.find(n => n.id === cid);
      if (!parent) return;
      const anchor  = ANCHORS[cid] ?? { cx: 450, cy: 250 };
      const entries = circuitEntries[cid] ?? [];
      const isLeft  = LEFT_IDS.has(cid);

      entries.forEach((e, i) => {
        const sid   = `sub-${cid}-${e.id}`;
        const angle = (Math.PI / (entries.length + 1)) * (i + 1)
                      + (isLeft ? Math.PI * 0.5 : -Math.PI * 0.5);
        const r     = 58 + i * 10;

        nodes.push({
          id:         sid,
          _label:     e.text,
          _color:     parent._color,
          _isDominant:false,
          _type:      'entry',
          _count:     0,
          _expanded:  false,
          parentId:   cid,
          intensity:  e.intensity ?? 3,
          x: anchor.cx + Math.cos(angle) * r,
          y: anchor.cy + Math.sin(angle) * r,
        });
        links.push({ source: cid, target: sid, _type: 'entry', _color: parent._color });
      });
    });

    return { nodes, links };
  }, [graphData, expandedIds, dominantId]);

  // ── D3 Simulation ─────────────────────────────────────────────────────────
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const W = 900, H = 500;

    svg.selectAll('.sim-layer').remove();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const root   = svg.append('g').attr('class', 'sim-layer');
    const defsEl = svg.select('defs');

    // ── Glow SVG filters ────────────────────────────────────────────────────
    const makeGlow = (id, std) => {
      defsEl.select(`#${id}`).remove();
      const f = defsEl.append('filter').attr('id', id)
        .attr('x', '-60%').attr('y', '-60%')
        .attr('width', '220%').attr('height', '220%');
      f.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', std).attr('result', 'blur');
      f.append('feMerge').selectAll('feMergeNode')
        .data(['blur', 'SourceGraphic'])
        .join('feMergeNode')
        .attr('in', d => d);
    };
    makeGlow('glow-sm', 4);
    makeGlow('glow-lg', 14);

    // ── Links ────────────────────────────────────────────────────────────────
    const linkSel = root.append('g').attr('class', 'links')
      .selectAll('line').data(links).join('line')
      .attr('stroke', d => d._type === 'core' ? 'rgba(255,255,255,0.06)' : (d._color ?? 'rgba(255,255,255,0.18)'))
      .attr('stroke-width', d => d._type === 'core' ? 1 : 1.4)
      .attr('stroke-dasharray', d => d._type === 'core' ? '5 7' : null)
      .attr('opacity', 0.8);

    // ── Node groups ──────────────────────────────────────────────────────────
    const nodeSel = root.append('g').attr('class', 'nodes')
      .selectAll('g').data(nodes, d => d.id)
      .join(enter => {
        const g = enter.append('g')
          .attr('cursor', 'pointer')
          .attr('opacity', 0)
          .call(sel => sel.transition().duration(350).attr('opacity', 1));
        return g;
      });

    // Outer ring (hover / expand indicator)
    nodeSel.filter(d => d._type === 'circuit').append('circle')
      .attr('class', 'ring')
      .attr('r', d => nodeR(d) + 9)
      .attr('fill', 'none')
      .attr('stroke', d => d._color)
      .attr('stroke-width', d => d._expanded ? 1.5 : 0.5)
      .attr('stroke-dasharray', d => d._expanded ? null : '3 4')
      .attr('opacity', d => d._expanded ? 0.6 : 0.25)
      .attr('filter', 'url(#glow-sm)');

    // Dominant pulse ring
    nodeSel.filter(d => d._isDominant).append('circle')
      .attr('r', d => nodeR(d) + 22)
      .attr('fill', 'none')
      .attr('stroke', d => d._color)
      .attr('stroke-width', 0.8)
      .attr('opacity', 0.18)
      .attr('filter', 'url(#glow-lg)');

    // Main circle (circuit) — 3D illusion via gradient fill
    defsEl.selectAll('.node-grad').remove();
    nodes.filter(n => n._type === 'circuit').forEach(n => {
      const gradId = `grad-${n.id.replace(/[^a-z0-9]/gi, '')}`;
      defsEl.select(`#${gradId}`).remove();
      const col = d3.color(n._color);
      const light = col ? col.brighter(0.9).formatHex() : '#fff';
      const dark  = col ? col.darker(1.4).formatHex() : '#000';
      const grad = defsEl.append('radialGradient')
        .attr('id', gradId).attr('class', 'node-grad')
        .attr('cx', '35%').attr('cy', '30%').attr('r', '65%');
      grad.append('stop').attr('offset', '0%').attr('stop-color', light).attr('stop-opacity', 1);
      grad.append('stop').attr('offset', '100%').attr('stop-color', dark).attr('stop-opacity', 1);
    });

    nodeSel.filter(d => d._type === 'circuit').append('circle')
      .attr('r', nodeR)
      .attr('fill', d => `url(#grad-${d.id.replace(/[^a-z0-9]/gi, '')})`)
      .attr('filter', d => d._isDominant ? 'url(#glow-lg)' : 'url(#glow-sm)');

    // Entry sub-node circle (smaller, flat)
    nodeSel.filter(d => d._type === 'entry').append('circle')
      .attr('r', nodeR)
      .attr('fill', d => d._color)
      .attr('fill-opacity', 0.82)
      .attr('filter', 'url(#glow-sm)');

    // ── Label ────────────────────────────────────────────────────────────────
    // Circuit label BELOW node
    nodeSel.filter(d => d._type === 'circuit').append('text')
      .text(d => d._label)
      .attr('text-anchor', 'middle')
      .attr('dy', d => nodeR(d) + 16)
      .attr('fill', '#fff')
      .attr('font-size', d => d._isDominant ? '9.5px' : '8.5px')
      .attr('font-weight', d => d._isDominant ? 800 : 600)
      .attr('font-family', 'Inter, sans-serif')
      .attr('letter-spacing', '0.05em')
      .attr('opacity', 0.85)
      .style('pointer-events', 'none')
      .style('text-transform', 'uppercase');

    // Sub-entry label (small, beside node)
    nodeSel.filter(d => d._type === 'entry').append('text')
      .text(d => d._label.length > 24 ? d._label.slice(0, 22) + '…' : d._label)
      .attr('text-anchor', 'start')
      .attr('dy', '0.35em')
      .attr('dx', d => nodeR(d) + 7)
      .attr('fill', '#fff')
      .attr('font-size', '7.5px')
      .attr('font-weight', 500)
      .attr('font-family', 'Inter, sans-serif')
      .attr('opacity', 0.7)
      .style('pointer-events', 'none');

    // ── Sub-node count badge (shown on circuit nodes when collapsed) ─────────
    nodeSel.filter(d => d._type === 'circuit' && d._count > 0).append('circle')
      .attr('cx', d => nodeR(d) - 3)
      .attr('cy', d => -(nodeR(d) - 3))
      .attr('r', 8)
      .attr('fill', d => d._color)
      .attr('stroke', '#06060a')
      .attr('stroke-width', 1.5);

    nodeSel.filter(d => d._type === 'circuit' && d._count > 0).append('text')
      .text(d => d._count)
      .attr('x', d => nodeR(d) - 3)
      .attr('y', d => -(nodeR(d) - 3))
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#06060a')
      .attr('font-size', '7px')
      .attr('font-weight', 900)
      .attr('font-family', 'Inter, sans-serif')
      .style('pointer-events', 'none');

    // ── Expand / collapse arc indicator ─────────────────────────────────────
    const arcGen = d3.arc()
      .innerRadius(d => nodeR(d) + 5)
      .outerRadius(d => nodeR(d) + 8)
      .startAngle(0)
      .endAngle(d => d._expanded ? Math.PI * 2 : Math.PI * 0.6);

    nodeSel.filter(d => d._type === 'circuit').append('path')
      .attr('class', 'expand-arc')
      .attr('d', arcGen)
      .attr('fill', d => d._color)
      .attr('opacity', 0.55)
      .style('pointer-events', 'none');

    // ── Events ───────────────────────────────────────────────────────────────
    nodeSel
      .on('click', (event, d) => {
        if (clickLock.current) return;
        clickLock.current = true;
        setTimeout(() => (clickLock.current = false), 300);
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

    // ── Drag (sub-nodes only, stay near parent hemisphere) ───────────────────
    nodeSel.filter(d => d._type === 'entry').call(
      d3.drag()
        .on('start', (event, d) => { if (!event.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag',  (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on('end',   (event, d) => { if (!event.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
    );

    // ── Simulation ────────────────────────────────────────────────────────────
    const sim = d3.forceSimulation(nodes)
      .force('link',
        d3.forceLink(links).id(d => d.id)
          .distance(d => d._type === 'core' ? 130 : 62)
          .strength(d => d._type === 'core' ? 0.06 : 0.9)
      )
      .force('charge', d3.forceManyBody().strength(d => d._type === 'circuit' ? -10 : -80))
      .force('center', d3.forceCenter(W / 2, H / 2).strength(0.015))
      .force('collision', d3.forceCollide().radius(d => nodeR(d) + 22));

    // ── Float animation ───────────────────────────────────────────────────────
    const animate = (ts) => {
      // Gently nudge circuit nodes to float (respect their anchored fx/fy)
      nodes.forEach(n => {
        if (n._type !== 'circuit') return;
        const p = getFloat(n.id);
        const δ = p.amp * Math.sin(ts * p.freq + p.phase);
        // Temporarily offset from anchor
        const base = ANCHORS[n.id];
        if (base) {
          n.fx = base.cx;
          n.fy = base.cy + δ;
        }
      });

      // Bounding for sub-nodes
      nodes.forEach(d => {
        if (d._type !== 'entry') return;
        d.x = Math.max(50, Math.min(W - 50, d.x));
        d.y = Math.max(50, Math.min(H - 50, d.y));
      });

      linkSel
        .attr('x1', d => d.source.x ?? 0).attr('y1', d => d.source.y ?? 0)
        .attr('x2', d => d.target.x ?? 0).attr('y2', d => d.target.y ?? 0);

      nodeSel.attr('transform', d => `translate(${d.x ?? 0},${d.y ?? 0})`);

      sim.tick();
      rafRef.current = requestAnimationFrame(animate);
    };

    sim.stop(); // we drive it manually via rAF
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      sim.stop();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [nodes, links]); // hover excluded intentionally

  function nodeR(d) {
    if (d._type === 'entry') return 4.5 + (d.intensity ?? 3) * 0.5;
    if (d._isDominant) return 17;
    return 10;
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <section style={{
      position: 'relative', width: '100%', height: 520,
      overflow: 'hidden', borderRadius: '2.5rem', background: '#000',
    }}>
      {/* Brain image */}
      <img src="/assets/brain_bg.png" alt="" aria-hidden
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
          opacity: 0.42, pointerEvents: 'none',
        }}
      />

      {/* D3 SVG */}
      <svg ref={svgRef}
        viewBox="0 0 900 500"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%', display: 'block' }}
      >
        <defs />
        <text x="90"  y="476" fill="#60b8ff" fontSize="9" fontWeight="700" opacity="0.45" fontFamily="Inter,sans-serif" textAnchor="middle">◀ TERRESTRE (IZQ.)</text>
        <text x="795" y="476" fill="#ff6eb4" fontSize="9" fontWeight="700" opacity="0.45" fontFamily="Inter,sans-serif" textAnchor="middle">POST-TERRESTRE (DER.) ▶</text>
        <line x1="450" y1="30" x2="450" y2="465" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="5 9" />
      </svg>

      {/* Analytics overlay */}
      <div style={{
        position: 'absolute', top: '2rem', left: '2rem', right: '2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        pointerEvents: 'none', zIndex: 5,
      }}>
        <div>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 900, letterSpacing: '-0.01em', textTransform: 'uppercase', color: '#fff', margin: 0 }}>
            Equilibrio Hemisférico
          </h2>
          <p style={{ fontSize: '0.62rem', opacity: 0.5, margin: '5px 0 0', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Predomina: <span style={{ color: balance.color, fontWeight: 800 }}>{balance.dominant}</span>
          </p>
          <div style={{ display: 'flex', height: 3, width: 200, marginTop: 10, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ width: `${balance.left}%`, background: '#60b8ff', transition: 'width 0.8s ease' }} />
            <div style={{ flex: 1, background: '#ff6eb4' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: 200, marginTop: 5 }}>
            <span style={{ fontSize: '0.6rem', color: '#60b8ff', fontWeight: 800 }}>{balance.left}% IZQ</span>
            <span style={{ fontSize: '0.6rem', color: '#ff6eb4', fontWeight: 800 }}>{balance.right}% DER</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: balance.color, lineHeight: 1 }}>
            {Math.max(balance.left, balance.right)}%
          </div>
          <div style={{ fontSize: '0.55rem', opacity: 0.35, letterSpacing: '0.09em', marginTop: 3 }}>
            AFINIDAD
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{
        position: 'absolute', bottom: '2rem', left: '2rem',
        display: 'flex', gap: 14, alignItems: 'center',
        pointerEvents: 'none', zIndex: 5,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', opacity: 0.5 }} />
          <span style={{ fontSize: '0.58rem', opacity: 0.35, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Toca para expandir</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#60b8ff' }} />
          <span style={{ fontSize: '0.58rem', opacity: 0.35, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Número = hilos</span>
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredNode && (
        <div className="animate-fade-in" style={{
          position: 'absolute', bottom: '2.5rem', left: '2rem', right: '2rem',
          padding: '1rem 1.25rem',
          background: 'rgba(4,4,4,0.85)',
          backdropFilter: 'blur(28px)',
          borderRadius: '1.25rem',
          border: `1px solid ${hoveredNode._color}28`,
          zIndex: 10, pointerEvents: 'none',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <span style={{ fontWeight: 900, fontSize: '0.82rem', color: hoveredNode._color, textTransform: 'uppercase' }}>
              {hoveredNode._label}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              {hoveredNode._count > 0 && (
                <span style={{ fontSize: '0.62rem', padding: '2px 8px', borderRadius: 4, background: `${hoveredNode._color}22`, color: hoveredNode._color, fontWeight: 700 }}>
                  {hoveredNode._count} hilos
                </span>
              )}
              {hoveredNode._isDominant && (
                <span style={{ fontSize: '0.62rem', padding: '2px 8px', borderRadius: 4, background: hoveredNode._color, color: '#000', fontWeight: 900 }}>
                  DOMINANTE
                </span>
              )}
              {hoveredNode._expanded && (
                <span style={{ fontSize: '0.62rem', padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: 700 }}>
                  EXPANDIDO
                </span>
              )}
            </div>
          </div>
          <p style={{ fontSize: '0.72rem', opacity: 0.5, lineHeight: 1.55, margin: 0 }}>
            {hoveredNode._type === 'circuit'
              ? (CIRCUIT_DESCRIPTIONS[hoveredNode.id] ?? 'Circuito neuronal activo')
              : 'Hilo de pensamiento — clic para profundizar'}
          </p>
        </div>
      )}
    </section>
  );
}
