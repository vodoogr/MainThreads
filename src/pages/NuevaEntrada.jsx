import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScreenContainer from '../components/ScreenContainer';
import NodeChip from '../components/NodeChip';
import { suggestedNodes } from '../data/mockData';

export default function NuevaEntrada() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [selectedNodes, setSelectedNodes] = useState([]);

  const toggleNode = (nodeId) => {
    setSelectedNodes((prev) => {
      if (prev.includes(nodeId)) return prev.filter((id) => id !== nodeId);
      if (prev.length >= 3) return prev;
      return [...prev, nodeId];
    });
  };

  const handleSave = () => {
    // Future: send to backend
    console.log({ title, body, intensity, selectedNodes });
    navigate('/inicio_sistema_neural_vivo');
  };

  return (
    <ScreenContainer>
      <div
        style={{
          minHeight: 'calc(100dvh - 10rem)',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '2rem',
        }}
      >
        {/* Writing Canvas */}
        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Background threads decoration */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              pointerEvents: 'none',
              zIndex: -1,
              opacity: 0.15,
              overflow: 'hidden',
            }}
          >
            <svg viewBox="0 0 400 800" style={{ width: '100%', height: '100%' }}>
              <path
                d="M-50,200 Q150,250 100,500 T350,750"
                fill="none"
                stroke="#89d4cd"
                strokeWidth="0.5"
              />
              <path
                d="M450,100 Q250,300 300,500 T-50,850"
                fill="none"
                stroke="#d3bcfc"
                strokeWidth="0.5"
              />
              <circle cx="100" cy="500" r="2" fill="#89d4cd" className="animate-pulse-slow" />
              <circle cx="300" cy="500" r="2" fill="#d3bcfc" />
            </svg>
          </div>

          {/* Title Input */}
          <div style={{ marginBottom: '2rem' }}>
            <input
              id="entry-title"
              type="text"
              placeholder="Título (opcional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '1.25rem',
                fontWeight: 300,
                color: 'var(--on-surface)',
                padding: 0,
              }}
            />
            <div
              style={{
                height: 1,
                marginTop: 8,
                background: 'rgba(137,212,205,0.3)',
                width: title ? '100%' : 0,
                transition: 'width 0.7s ease-out',
              }}
            />
          </div>

          {/* Text Area */}
          <div style={{ flex: 1, marginBottom: '2.5rem' }}>
            <textarea
              id="entry-body"
              placeholder="Escribe lo que te preocupa hoy..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              spellCheck={false}
              style={{
                width: '100%',
                minHeight: 240,
                height: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '1rem',
                lineHeight: 1.7,
                color: 'var(--on-surface)',
                resize: 'none',
                padding: 0,
              }}
            />
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Intensity Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                }}
              >
                <label
                  className="label-xs"
                  htmlFor="intensity-slider"
                  style={{ color: 'var(--outline-variant)' }}
                >
                  Intensidad
                </label>
                <span
                  style={{
                    color: 'var(--primary)',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                  }}
                >
                  {intensity}
                </span>
              </div>
              <input
                id="intensity-slider"
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="intensity-slider"
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '0 4px',
                }}
              >
                <span style={{ fontSize: '0.5625rem', color: 'var(--outline-variant)' }}>
                  Leve
                </span>
                <span style={{ fontSize: '0.5625rem', color: 'var(--outline-variant)' }}>
                  Agudo
                </span>
              </div>
            </div>

            {/* Suggested Nodes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label className="label-xs" style={{ color: 'var(--outline-variant)' }}>
                Nodos sugeridos (Máx 3)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {suggestedNodes.map((node) => (
                  <NodeChip
                    key={node.id}
                    label={node.label}
                    active={selectedNodes.includes(node.id)}
                    onClick={() => toggleNode(node.id)}
                  />
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div style={{ paddingTop: '1rem' }}>
              <button className="btn-primary" onClick={handleSave} id="btn-guardar-entrada">
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                  auto_awesome
                </span>
                Guardar entrada
              </button>
            </div>
          </div>
        </div>
      </div>
    </ScreenContainer>
  );
}
