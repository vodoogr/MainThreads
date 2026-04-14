import { useMemo } from 'react';

/**
 * NeuralAura - Componente de fondo vivo que evoluciona según la biometría y el balance
 */
export default function NeuralAura({ balance, hrv, totalEntries }) {
  
  const visuals = useMemo(() => {
    // Frecuencia de "respiración" según HRV (más ms = más lento/relajado)
    const bloomDuration = Math.max(2, 10 - (hrv / 15)) + 's';
    
    // Glow Intensity (Base + bonus for dominant side)
    const baseGlow = Math.min(20 + totalEntries * 3, 60);
    const leftGlow = balance.left > balance.right ? baseGlow * 1.8 : baseGlow;
    const rightGlow = balance.right > balance.left ? baseGlow * 1.8 : baseGlow;
    
    // Balance of color (higher contrast)
    const leftOpacity = (balance.left / 100) * 0.7; // Increased max
    const rightOpacity = (balance.right / 100) * 0.7;

    return { bloomDuration, leftGlow, rightGlow, leftOpacity, rightOpacity };
  }, [balance, hrv, totalEntries]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 1 }}>
      {/* Resplandor Izquierdo (Lógico/Terrestre) */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '25%',
        width: '55%',
        height: '70%',
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, rgba(96, 184, 255, ${visuals.leftOpacity}) 0%, transparent 80%)`,
        filter: `blur(${visuals.leftGlow}px)`,
        transition: 'all 2.5s ease-out',
        animation: `neuralPulse ${visuals.bloomDuration} ease-in-out infinite`
      }} />

      {/* Resplandor Derecho (Intuitivo/Cuántico) */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '75%',
        width: '55%',
        height: '70%',
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, rgba(211, 188, 252, ${visuals.rightOpacity}) 0%, transparent 80%)`,
        filter: `blur(${visuals.rightGlow}px)`,
        transition: 'all 2.5s ease-out',
        animation: `neuralPulse ${visuals.bloomDuration} ease-in-out infinite alternate-reverse`
      }} />

      {/* Neural Sparks (Partículas flotantes) */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <circle
            key={i}
            r={Math.random() * 2 + 1}
            fill="white"
            opacity={Math.random() * 0.5 + 0.1}
          >
            <animate
              attributeName="cx"
              values={`${Math.random() * 100}%; ${Math.random() * 100}%; ${Math.random() * 100}%`}
              dur={`${Math.random() * 10 + 10}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values={`${Math.random() * 100}%; ${Math.random() * 100}%; ${Math.random() * 100}%`}
              dur={`${Math.random() * 10 + 10}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;0.5;0"
              dur="4s"
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>

      <style>{`
        @keyframes neuralPulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
