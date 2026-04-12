import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';
import { 
  CIRCUIT_IDS,
  CIRCUIT_LABELS, 
  CIRCUIT_COLORS, 
  CIRCUIT_DESCRIPTIONS,
  circuitNodes,
  graphData,
  circuitEntries
} from '../data/mockData';

/**
 * BrainGraph (D3.js - Refined & Professional 2D)
 * 
 * Reverted to the stable and high-performance 2D version.
 * Includes collapsible nodes and elegant neural aesthetics.
 */

export default function BrainGraph() {
  const navigate = useNavigate();
  const svgRef = useRef(null);
  const [openCircuits, setOpenCircuits] = useState({});
  const [hoveredNode, setHoveredNode] = useState(null);

  const { nodes, links } = useMemo(() => {
    const baseNodes = circuitNodes.map(n => ({
      ...n,
      type: 'circuit',
      name: CIRCUIT_LABELS[n.id],
      color: CIRCUIT_COLORS[n.id],
      radius: 10 + (n.intensity * 5),
      isOpen: !!openCircuits[n.id]
    }));

    let allNodes = [...baseNodes];
    let allLinks = graphData.connections.map(c => ({
      source: c.source,
      target: c.target,
      type: 'base',
      strength: c.strength
    }));

    Object.keys(openCircuits).forEach(circuitId => {
      if (openCircuits[circuitId]) {
        const entries = circuitEntries[circuitId] || [];
        entries.forEach((entry, i) => {
          const entryNodeId = `entry-${entry.id}`;
          allNodes.push({
            id: entryNodeId,
            type: 'entry',
            name: entry.text,
            parentId: circuitId,
            color: CIRCUIT_COLORS[circuitId],
            radius: 3 + (entry.intensity / 3),
            intensity: entry.intensity,
            x: baseNodes.find(b => b.id === circuitId).x + (Math.random() - 0.5) * 20,
            y: baseNodes.find(b => b.id === circuitId).y + (Math.random() - 0.5) * 20
          });

          allLinks.push({
            source: circuitId,
            target: entryNodeId,
            type: 'branch',
            strength: 0.3
          });
        });
      }
    });

    return { nodes: allNodes, links: allLinks };
  }, [openCircuits]);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 440;
    const height = 480;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg.append("g");

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(d => d.type === 'base' ? 75 : 45).strength(0.4))
      .force("charge", d3.forceManyBody().strength(-120))
      .force("center", d3.forceCenter(width / 2, height / 2.2))
      .force("collision", d3.forceCollide().radius(d => d.radius + 14));

    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", d => d.type === 'base' ? "rgba(255,255,255,0.08)" : CIRCUIT_COLORS[d.source.parentId || d.source.id])
      .attr("stroke-width", d => d.type === 'base' ? 1.2 : 0.6)
      .attr("stroke-dasharray", d => d.type === 'branch' ? "3,3" : "none")
      .attr("opacity", 0.6);

    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .on("click", (event, d) => {
        if (d.type === 'circuit') {
          setOpenCircuits(prev => ({ ...prev, [d.id]: !prev[d.id] }));
        } else {
          navigate(`/detalle_de_nodo/${d.parentId}`);
        }
      })
      .on("mouseenter", (event, d) => setHoveredNode(d))
      .on("mouseleave", () => setHoveredNode(null))
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("circle")
      .attr("r", d => d.radius * 1.5)
      .attr("fill", d => d.color)
      .attr("opacity", d => (d.type === 'circuit' && (d.isOpen || d.id === 'SYMBOLIC')) ? 0.1 : 0)
      .style("filter", "blur(4px)");

    node.append("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => d.color)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", d => d.isOpen ? 1.5 : 0.5)
      .attr("stroke-opacity", 0.8);

    node.append("text")
      .text(d => d.type === 'circuit' ? CIRCUIT_LABELS[d.id] : "")
      .attr("y", d => d.radius + 15)
      .attr("text-anchor", "middle")
      .attr("fill", "rgba(255,255,255,0.6)")
      .style("font-size", "7.5px")
      .style("text-transform", "uppercase")
      .style("letter-spacing", "0.06em")
      .style("pointer-events", "none")
      .style("font-weight", 600);

    simulation.on("tick", () => {
      link.attr("x1", d => d.source.x).attr("y1", d => d.source.y).attr("x2", d => d.target.x).attr("y2", d => d.target.y);
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }
    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }
    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [nodes, links, hoveredNode]);

  return (
    <section 
      className="neural-card" 
      style={{ height: 480, width: '100%', position: 'relative', overflow: 'hidden', borderRadius: '2rem' }}
    >
      {/* Dynamic Background */}
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          opacity: 0.15, 
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at center, #111 0%, #000 100%)'
        }}
      >
        <svg viewBox="0 0 400 440" style={{ width: '100%', height: '100%' }}>
          <path
            d="M200,40 C140,40 100,50 80,100 C60,150 60,200 85,250 C110,300 160,320 200,340 C240,320 290,300 315,250 C340,200 340,150 320,100 C300,50 260,40 200,40 Z"
            fill="none" stroke="var(--primary)" strokeWidth="0.8" opacity="0.3"
          />
        </svg>
      </div>

      <svg ref={svgRef} viewBox="0 0 440 480" style={{ width: '100%', height: '100%', display: 'block' }} />

      <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', pointerEvents: 'none' }}>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, opacity: 0.8 }}>Motor Neural D3</h2>
        <p style={{ fontSize: '0.65rem', opacity: 0.4 }}>Mapeo de Consciencia</p>
      </div>

      {hoveredNode && hoveredNode.type === 'circuit' && (
        <div 
          className="animate-fade-in"
          style={{ 
            position: 'absolute', 
            bottom: '1.25rem', 
            left: '1.25rem', 
            right: '1.25rem',
            padding: '1.2rem',
            background: 'rgba(15, 15, 15, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '1.25rem',
            border: `1px solid rgba(255,255,255,0.08)`,
            fontSize: '0.7rem',
            lineHeight: 1.5,
            color: 'var(--on-surface-variant)',
            zIndex: 10
          }}
        >
          <div style={{ fontWeight: 800, color: hoveredNode.color, marginBottom: 2, fontSize: '0.8rem', textTransform: 'uppercase' }}>
            {CIRCUIT_LABELS[hoveredNode.id]}
          </div>
          {CIRCUIT_DESCRIPTIONS[hoveredNode.id]}
        </div>
      )}
    </section>
  );
}
