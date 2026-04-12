// ============================================================
// Mental Threads — Modelo de 8 Circuitos de Leary (Versión 3D)
// ============================================================

export const CIRCUIT_IDS = {
  BIO_SURVIVAL: 'BIO_SURVIVAL',   // Circuito 1: Bio-supervivencia
  EMOTIONAL: 'EMOTIONAL',         // Circuito 2: Emocional-Territorial
  SYMBOLIC: 'SYMBOLIC',           // Circuito 3: Simbólico-Semántico (Mente)
  SOCIO_SEXUAL: 'SOCIO_SEXUAL',   // Circuito 4: Socio-Sexual (Moral)
  NEUROSOMATIC: 'NEUROSOMATIC',   // Circuito 5: Neurosomático
  METAPROGRAMMING: 'METAPROGRAMMING', // Circuito 6: Meta-programación
  NEUROGENETIC: 'NEUROGENETIC',   // Circuito 7: Neurogenético
  QUANTUM: 'QUANTUM',             // Circuito 8: Cuántico / No Local
};

export const CIRCUIT_LABELS = {
  [CIRCUIT_IDS.BIO_SURVIVAL]: 'Bio-Supervivencia',
  [CIRCUIT_IDS.EMOTIONAL]: 'Emocional-Territorial',
  [CIRCUIT_IDS.SYMBOLIC]: 'Simbólico-Semántico',
  [CIRCUIT_IDS.SOCIO_SEXUAL]: 'Socio-Sexual (Moral)',
  [CIRCUIT_IDS.NEUROSOMATIC]: 'Neurosomático (Éxtasis)',
  [CIRCUIT_IDS.METAPROGRAMMING]: 'Meta-Programación',
  [CIRCUIT_IDS.NEUROGENETIC]: 'Neurogenético (Memoria)',
  [CIRCUIT_IDS.QUANTUM]: 'Cuántico (No-Local)',
};

export const CIRCUIT_COLORS = {
  [CIRCUIT_IDS.BIO_SURVIVAL]: '#fa746f',
  [CIRCUIT_IDS.EMOTIONAL]: '#f9db7d',
  [CIRCUIT_IDS.SYMBOLIC]: '#89d4cd',
  [CIRCUIT_IDS.SOCIO_SEXUAL]: '#6da5ff',
  [CIRCUIT_IDS.NEUROSOMATIC]: '#ffeaaf',
  [CIRCUIT_IDS.METAPROGRAMMING]: '#d3bcfc',
  [CIRCUIT_IDS.NEUROGENETIC]: '#ffffff',
  [CIRCUIT_IDS.QUANTUM]: '#befceb',
};

export const CIRCUIT_DESCRIPTIONS = {
  [CIRCUIT_IDS.BIO_SURVIVAL]: 'Tronco encefálico. Gestión de seguridad, confianza y necesidades básicas.',
  [CIRCUIT_IDS.EMOTIONAL]: 'Sistema límbico. Gobierna territorialidad, jerarquías y emociones.',
  [CIRCUIT_IDS.SYMBOLIC]: 'Neocórtex. Lenguaje, pensamiento racional y lógica.',
  [CIRCUIT_IDS.SOCIO_SEXUAL]: 'Corteza prefrontal. Gestión de normas sociales y moralidad.',
  [CIRCUIT_IDS.NEUROSOMATIC]: 'Hemisferio derecho. Conciencia sensorial intensificada y éxtasis.',
  [CIRCUIT_IDS.METAPROGRAMMING]: 'Corteza de asociación. Conciencia de la mente programando la realidad.',
  [CIRCUIT_IDS.NEUROGENETIC]: 'ADN y memoria colectiva. Acceso a memorias ancestrales y evolución.',
  [CIRCUIT_IDS.QUANTUM]: 'Mente no local. Fuera de la localización orgánica del cerebro.',
};

export const circuitNodes = [
  { id: CIRCUIT_IDS.BIO_SURVIVAL, intensity: 0.8 },
  { id: CIRCUIT_IDS.EMOTIONAL, intensity: 0.6 },
  { id: CIRCUIT_IDS.SYMBOLIC, intensity: 0.9 },
  { id: CIRCUIT_IDS.SOCIO_SEXUAL, intensity: 0.4 },
  { id: CIRCUIT_IDS.NEUROSOMATIC, intensity: 0.3 },
  { id: CIRCUIT_IDS.METAPROGRAMMING, intensity: 0.5 },
  { id: CIRCUIT_IDS.NEUROGENETIC, intensity: 0.2 },
  { id: CIRCUIT_IDS.QUANTUM, intensity: 0.1 },
];

export const graphData = {
  nodes: circuitNodes.map(n => ({ ...n, name: CIRCUIT_LABELS[n.id], color: CIRCUIT_COLORS[n.id] })),
  links: [
    { source: CIRCUIT_IDS.BIO_SURVIVAL, target: CIRCUIT_IDS.EMOTIONAL, type: 'core' },
    { source: CIRCUIT_IDS.EMOTIONAL, target: CIRCUIT_IDS.SYMBOLIC, type: 'core' },
    { source: CIRCUIT_IDS.SYMBOLIC, target: CIRCUIT_IDS.SOCIO_SEXUAL, type: 'core' },
    { source: CIRCUIT_IDS.SOCIO_SEXUAL, target: CIRCUIT_IDS.METAPROGRAMMING, type: 'synapse' },
    { source: CIRCUIT_IDS.NEUROSOMATIC, target: CIRCUIT_IDS.METAPROGRAMMING, type: 'synapse' },
  ],
};

export const circuitEntries = {
  [CIRCUIT_IDS.BIO_SURVIVAL]: [
    { id: 'bs1', text: 'Necesidad de seguridad económica', intensity: 9 },
    { id: 'bs2', text: 'Rutina de alimentación alterada', intensity: 7 },
    { id: 'bs3', text: 'Respuesta de huida ante conflicto', intensity: 8 },
  ],
  [CIRCUIT_IDS.EMOTIONAL]: [
    { id: 'em1', text: 'Tensión con figura de autoridad', intensity: 7 },
    { id: 'em2', text: 'Defensa de espacio personal', intensity: 6 },
    { id: 'em3', text: 'Búsqueda de validación social', intensity: 8 },
    { id: 'em4', text: 'Jerarquía en grupo de trabajo', intensity: 5 },
  ],
  [CIRCUIT_IDS.SYMBOLIC]: [
    { id: 's1', text: 'Reflexión lógica de medianoche', intensity: 8 },
    { id: 's2', text: 'Análisis de patrones de sueño', intensity: 6 },
    { id: 's3', text: 'Construcción de argumento mental', intensity: 9 },
  ],
  [CIRCUIT_IDS.SOCIO_SEXUAL]: [
    { id: 'ss1', text: 'Dilema moral ante decisión laboral', intensity: 6 },
    { id: 'ss2', text: 'Normas de comportamiento social', intensity: 4 },
  ],
  [CIRCUIT_IDS.NEUROSOMATIC]: [
    { id: 'ns1', text: 'Sensación de flujo durante ejercicio', intensity: 8 },
    { id: 'ns2', text: 'Estado de calma post-meditación', intensity: 9 },
    { id: 'ns3', text: 'Euforia creativa inesperada', intensity: 7 },
    { id: 'ns4', text: 'Dolor físico convertido en conciencia', intensity: 5 },
  ],
  [CIRCUIT_IDS.METAPROGRAMMING]: [
    { id: 'mp1', text: 'Observación de mis propios patrones', intensity: 9 },
    { id: 'mp2', text: 'Reprogramación de creencia limitante', intensity: 8 },
  ],
  [CIRCUIT_IDS.NEUROGENETIC]: [
    { id: 'ng1', text: 'Sueño con memoria colectiva', intensity: 6 },
    { id: 'ng2', text: 'Intuición ancestral sobre decisión', intensity: 7 },
    { id: 'ng3', text: 'Déjà vu de experiencia evolutiva', intensity: 5 },
  ],
  [CIRCUIT_IDS.QUANTUM]: [
    { id: 'q1', text: 'Sincronicidad no explicada', intensity: 9 },
    { id: 'q2', text: 'Conciencia más allá del cuerpo', intensity: 8 },
  ],
};

export const dailySummary = {
  entriesCount: 5,
  dominantNode: { id: CIRCUIT_IDS.SYMBOLIC, label: CIRCUIT_LABELS[CIRCUIT_IDS.SYMBOLIC] },
  averageIntensity: 7.2,
  recurringThread: 'Análisis Lógico',
  date: 'Hoy',
};

export const nodeDetail = {
  id: CIRCUIT_IDS.SYMBOLIC,
  title: CIRCUIT_LABELS[CIRCUIT_IDS.SYMBOLIC],
  description: CIRCUIT_DESCRIPTIONS[CIRCUIT_IDS.SYMBOLIC],
  activationLevel: 85,
  frequency: 'Alta',
  trendData: [40, 50, 60, 80],
  relatedThoughts: [{ id: 'rt1', text: 'Procesamiento semántico activo', time: '12:00', borderColor: CIRCUIT_COLORS[CIRCUIT_IDS.SYMBOLIC] }]
};

export const historialData = {
  currentMonth: 'Abril',
  currentYear: 2026,
  entries: [
    { id: 'h1', dayOfWeek: 'Lunes', dayNumber: '13', title: 'Flujo Cognitivo', connectedNodes: 'Simbólico', dots: [CIRCUIT_COLORS[CIRCUIT_IDS.SYMBOLIC]] }
  ]
};

export const insightData = {
  weekly: { period: '7 – 13 de Abril', title: 'Evolución Neural', description: 'Activación del 3er circuito.', connectionsDetected: 12 },
  threadHealth: { bars: [40, 70, 95, 55, 25], clarityIncrease: 15 },
  dominantThreads: [{ category: 'Lógica', label: 'Circuitos Inferiores Activos', color: CIRCUIT_COLORS[CIRCUIT_IDS.SYMBOLIC] }]
};

export const recentThoughts = [
  { id: '1', text: 'Análisis de la simetría cerebral', time: '10:00', intensity: 8, nodeColor: CIRCUIT_COLORS[CIRCUIT_IDS.SYMBOLIC] }
];

export const suggestedNodes = Object.entries(CIRCUIT_LABELS).map(([id, label]) => ({ id, label }));
