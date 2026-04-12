// ============================================================
// Mental Threads — Modelo de los 8 Circuitos de la Consciencia
// Basado en el Teorema de Timothy Leary
// ============================================================

export const CIRCUIT_IDS = {
  BIO_SURVIVAL: 'BIO_SURVIVAL',       // 1. Bio-supervivencia
  EMOTIONAL: 'EMOTIONAL',             // 2. Emocional-Territorial
  SYMBOLIC: 'SYMBOLIC',               // 3. Simbólico (Semántico)
  SOCIO_SEXUAL: 'SOCIO_SEXUAL',       // 4. Socio-Sexual
  NEUROSOMATIC: 'NEUROSOMATIC',       // 5. Neurosomático
  METAPROGRAMMING: 'METAPROGRAMMING', // 6. Metaprogramación
  MORPHOGENETIC: 'MORPHOGENETIC',     // 7. Morfogenético
  QUANTUM: 'QUANTUM',                 // 8. Cuántico
};

export const CIRCUIT_LABELS = {
  [CIRCUIT_IDS.BIO_SURVIVAL]: 'Bio-supervivencia',
  [CIRCUIT_IDS.EMOTIONAL]: 'Emocional-Territorial',
  [CIRCUIT_IDS.SYMBOLIC]: 'Simbólico-Semántico',
  [CIRCUIT_IDS.SOCIO_SEXUAL]: 'Socio-Sexual',
  [CIRCUIT_IDS.NEUROSOMATIC]: 'Neurosomático',
  [CIRCUIT_IDS.METAPROGRAMMING]: 'Metaprogramación',
  [CIRCUIT_IDS.MORPHOGENETIC]: 'Morfogenético',
  [CIRCUIT_IDS.QUANTUM]: 'Cuántico-Universal',
};

export const CIRCUIT_DESCRIPTIONS = {
  [CIRCUIT_IDS.BIO_SURVIVAL]: 'Seguridad biológica elemental. Dicótoma "seguro/peligroso". El cerebro oral.',
  [CIRCUIT_IDS.EMOTIONAL]: 'Estatus social, poder y defensa del territorio. El cerebro anal.',
  [CIRCUIT_IDS.SYMBOLIC]: 'Lenguaje, lógica racional y uso de herramientas. El cerebro semántico.',
  [CIRCUIT_IDS.SOCIO_SEXUAL]: 'Moralidad, normas sociales y personalidad tribal. El cerebro social.',
  [CIRCUIT_IDS.NEUROSOMATIC]: 'Sensación de placer sensorial intenso y éxtasis corporal. El cuerpo como máquina perfecta.',
  [CIRCUIT_IDS.METAPROGRAMMING]: 'El cerebro observándose a sí mismo. Reprogramación de la realidad como construcción mental.',
  [CIRCUIT_IDS.MORPHOGENETIC]: 'Memoria evolutiva y registros genéticos. Acceso al pasado de la especie.',
  [CIRCUIT_IDS.QUANTUM]: 'Consciencia no-local. Conexión universal que trasciende tiempo y espacio.',
};

// Colors associated with each circuit (Gradients from Earthy to Cosmic)
export const CIRCUIT_COLORS = {
  [CIRCUIT_IDS.BIO_SURVIVAL]: '#fa746f', // Rojo terra
  [CIRCUIT_IDS.EMOTIONAL]: '#f9db7d',    // Ambar territorial
  [CIRCUIT_IDS.SYMBOLIC]: '#89d4cd',     // Verde lógico
  [CIRCUIT_IDS.SOCIO_SEXUAL]: '#6da5ff', // Azul social
  [CIRCUIT_IDS.NEUROSOMATIC]: '#ffeaaf', // Oro sensorial
  [CIRCUIT_IDS.METAPROGRAMMING]: '#d3bcfc', // Violeta conciencia
  [CIRCUIT_IDS.MORPHOGENETIC]: '#ff9eff', // Magenta genético
  [CIRCUIT_IDS.QUANTUM]: '#ffffff',      // Blanco cuántico
};

// Aliases for backward compatibility
export const NODE_LABELS = CIRCUIT_LABELS;
export const NODE_COLORS = CIRCUIT_COLORS;

// Conceptual brain mapping for SVG visualization
// x, y relative to a 400x400 viewBox
export const circuitNodes = [
  { id: CIRCUIT_IDS.BIO_SURVIVAL, x: 200, y: 340, intensity: 0.8, region: 'brainstem' },
  { id: CIRCUIT_IDS.EMOTIONAL, x: 200, y: 240, intensity: 0.6, region: 'limbic' },
  { id: CIRCUIT_IDS.SYMBOLIC, x: 120, y: 180, intensity: 0.9, region: 'left_cortex' },
  { id: CIRCUIT_IDS.SOCIO_SEXUAL, x: 280, y: 180, intensity: 0.4, region: 'right_parietal' },
  { id: CIRCUIT_IDS.NEUROSOMATIC, x: 300, y: 100, intensity: 0.3, region: 'right_sensory' },
  { id: CIRCUIT_IDS.METAPROGRAMMING, x: 200, y: 60, intensity: 0.5, region: 'prefrontal' },
  { id: CIRCUIT_IDS.MORPHOGENETIC, x: 100, y: 100, intensity: 0.2, region: 'deep_memory' },
  { id: CIRCUIT_IDS.QUANTUM, x: 200, y: 140, intensity: 0.15, region: 'thalamus' },
];

export const graphData = {
  nodes: circuitNodes,
  connections: [
    { source: CIRCUIT_IDS.BIO_SURVIVAL, target: CIRCUIT_IDS.EMOTIONAL, strength: 0.9 },
    { source: CIRCUIT_IDS.EMOTIONAL, target: CIRCUIT_IDS.SYMBOLIC, strength: 0.7 },
    { source: CIRCUIT_IDS.SYMBOLIC, target: CIRCUIT_IDS.METAPROGRAMMING, strength: 0.5 },
    { source: CIRCUIT_IDS.NEUROSOMATIC, target: CIRCUIT_IDS.METAPROGRAMMING, strength: 0.4 },
    { source: CIRCUIT_IDS.METAPROGRAMMING, target: CIRCUIT_IDS.QUANTUM, strength: 0.8 },
  ],
  threads: [
    { source: CIRCUIT_IDS.BIO_SURVIVAL, target: CIRCUIT_IDS.NEUROSOMATIC, strength: 0.6 },
    { source: CIRCUIT_IDS.SYMBOLIC, target: CIRCUIT_IDS.MORPHOGENETIC, strength: 0.3 },
  ],
};

// ... (rest of mock data remains same in structure but uses new IDs)
export const dailySummary = {
  entriesCount: 5,
  dominantNode: { id: CIRCUIT_IDS.SYMBOLIC, label: 'Simbólico-Semántico' },
  averageIntensity: 7.2,
  recurringThread: 'Resolución de problemas lógicos',
  date: new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
};

export const recentThoughts = [
  {
    id: 't1',
    text: 'He pasado el día analizando estructuras de datos y lógica de programación. Mi mente no descansa del análisis.',
    time: '18:45',
    intensity: 9,
    nodeId: CIRCUIT_IDS.SYMBOLIC,
    nodeColor: CIRCUIT_COLORS[CIRCUIT_IDS.SYMBOLIC],
    date: 'Hoy',
  },
  {
    id: 't2',
    text: 'Preocupación por la seguridad financiera a largo plazo. Una sensación de alerta constante.',
    time: '12:20',
    intensity: 8,
    nodeId: CIRCUIT_IDS.BIO_SURVIVAL,
    nodeColor: CIRCUIT_COLORS[CIRCUIT_IDS.BIO_SURVIVAL],
    date: 'Hoy',
  },
  {
    id: 't3',
    text: 'Dándome cuenta de mis propios sesgos hoy. Observar el pensamiento es liberador.',
    time: '21:05',
    intensity: 5,
    nodeId: CIRCUIT_IDS.METAPROGRAMMING,
    nodeColor: CIRCUIT_COLORS[CIRCUIT_IDS.METAPROGRAMMING],
    date: 'Ayer',
  },
];

// Node Detail (using Circuit 3 as example)
export const nodeDetail = {
  id: CIRCUIT_IDS.SYMBOLIC,
  title: CIRCUIT_LABELS[CIRCUIT_IDS.SYMBOLIC],
  description: CIRCUIT_DESCRIPTIONS[CIRCUIT_IDS.SYMBOLIC],
  activationLevel: 92,
  frequency: 'Alta',
  frequencyDetail: 'Detectado en patrones de resolución lógica complejos.',
  trendData: [30, 45, 70, 85, 95, 80, 65, 90, 88, 92],
  connections: [
    { id: 'logica', label: 'Lógica', strength: 0.95, color: CIRCUIT_COLORS[CIRCUIT_IDS.SYMBOLIC] },
    { id: 'meta', label: 'Metaprogramación', strength: 0.65, color: CIRCUIT_COLORS[CIRCUIT_IDS.METAPROGRAMMING] },
  ],
  relatedThoughts: [
    {
      id: 'rt1',
      text: '"Análisis exhaustivo de la estructura del sistema neural."',
      time: 'Hoy, 10:20 AM',
      borderColor: CIRCUIT_COLORS[CIRCUIT_IDS.SYMBOLIC],
    },
  ],
};

// Historial Data
export const historialData = {
  currentMonth: 'Abril',
  currentYear: 2026,
  weekdays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  days: [
    { day: 1, activity: 0 }, { day: 2, activity: 0 }, { day: 3, activity: 3 },
    { day: 12, activity: 3 },
  ],
  startOffset: 2,
  heatmapBars: [20, 45, 30, 85, 50, 60, 25, 70, 40, 35, 95, 55, 45, 60, 30],
  heatmapMonths: ['Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr'],
  entries: [
    {
      id: 'h1',
      dayOfWeek: 'Domingo',
      dayNumber: '12',
      title: 'Salto Cuántico',
      connectedNodes: 'Quantum, Meta, Simbólico',
      dots: [CIRCUIT_COLORS[CIRCUIT_IDS.QUANTUM], CIRCUIT_COLORS[CIRCUIT_IDS.METAPROGRAMMING]],
      highlight: true,
    },
  ],
};

// Insight Data
export const insightData = {
  weekly: {
    period: '7 – 13 de Abril',
    title: 'Expansión de consciencia',
    description: 'Esta semana has activado principalmente áreas relacionadas con lógica semántica y metaprogramación.',
    connectionsDetected: 18,
  },
  monthly: {
    month: 'Abril',
    nodesActivated: 8,
    summary: 'Tu arquitectura mental muestra una clara tendencia hacia la racionalización y la auto-observación.',
  },
  threadHealth: {
    bars: [40, 70, 95, 55, 25],
    clarityIncrease: 15,
  },
  recurringPattern: {
    title: 'Iteración Lógica',
    description: 'Conexión recurrente entre el circuito simbólico y la metaprogramación.',
  },
  dominantThreads: [
    { category: 'Terrestre', label: 'Pensamiento Lógico', color: CIRCUIT_COLORS[CIRCUIT_IDS.SYMBOLIC] },
    { category: 'Post-Terrestre', label: 'Auto-Observación', color: CIRCUIT_COLORS[CIRCUIT_IDS.METAPROGRAMMING] },
  ],
};

export const suggestedNodes = Object.entries(CIRCUIT_LABELS).map(([id, label]) => ({ id, label }));
