// ============================================================
// Mental Threads — Mock Data Layer
// Centralized data structures for all screens.
// Ready to be replaced by API calls later.
// ============================================================

export const NODE_IDS = {
  SURVIVAL: 'SURVIVAL',
  RELATIONSHIPS: 'RELATIONSHIPS',
  CONTROL: 'CONTROL',
  OVERTHINKING: 'OVERTHINKING',
  BODY: 'BODY',
  CREATIVITY: 'CREATIVITY',
  PURPOSE: 'PURPOSE',
};

export const NODE_LABELS = {
  [NODE_IDS.SURVIVAL]: 'Supervivencia / Seguridad',
  [NODE_IDS.RELATIONSHIPS]: 'Relaciones',
  [NODE_IDS.CONTROL]: 'Control / Autoestima',
  [NODE_IDS.OVERTHINKING]: 'Pensamiento / Sobrecarga',
  [NODE_IDS.BODY]: 'Cuerpo / Sensaciones',
  [NODE_IDS.CREATIVITY]: 'Creatividad / Expresión',
  [NODE_IDS.PURPOSE]: 'Sentido / Propósito',
};

export const NODE_COLORS = {
  [NODE_IDS.SURVIVAL]: '#fa746f',
  [NODE_IDS.RELATIONSHIPS]: '#d3bcfc',
  [NODE_IDS.CONTROL]: '#89d4cd',
  [NODE_IDS.OVERTHINKING]: '#89d4cd',
  [NODE_IDS.BODY]: '#eacd71',
  [NODE_IDS.CREATIVITY]: '#ffeaaf',
  [NODE_IDS.PURPOSE]: '#d3bcfc',
};

// Future-ready graph data shape
export const graphData = {
  nodes: [
    { id: NODE_IDS.SURVIVAL, x: 120, y: 80, intensity: 0.3 },
    { id: NODE_IDS.RELATIONSHIPS, x: 320, y: 70, intensity: 0.25 },
    { id: NODE_IDS.CONTROL, x: 100, y: 280, intensity: 0.5 },
    { id: NODE_IDS.OVERTHINKING, x: 200, y: 180, intensity: 0.85 },
    { id: NODE_IDS.BODY, x: 350, y: 300, intensity: 0.4 },
    { id: NODE_IDS.CREATIVITY, x: 360, y: 200, intensity: 0.15 },
    { id: NODE_IDS.PURPOSE, x: 200, y: 350, intensity: 0.7 },
  ],
  connections: [
    { source: NODE_IDS.SURVIVAL, target: NODE_IDS.OVERTHINKING, strength: 0.7 },
    { source: NODE_IDS.OVERTHINKING, target: NODE_IDS.CONTROL, strength: 0.6 },
    { source: NODE_IDS.OVERTHINKING, target: NODE_IDS.PURPOSE, strength: 0.8 },
    { source: NODE_IDS.RELATIONSHIPS, target: NODE_IDS.PURPOSE, strength: 0.4 },
    { source: NODE_IDS.BODY, target: NODE_IDS.CREATIVITY, strength: 0.35 },
  ],
  threads: [
    { source: NODE_IDS.SURVIVAL, target: NODE_IDS.BODY, strength: 0.9 },
    { source: NODE_IDS.OVERTHINKING, target: NODE_IDS.BODY, strength: 0.65 },
  ],
};

export const dailySummary = {
  entriesCount: 4,
  dominantNode: { id: NODE_IDS.PURPOSE, label: 'Sentido' },
  averageIntensity: 6.5,
  recurringThread: 'Proyectos pendientes',
  date: new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }),
};

export const recentThoughts = [
  {
    id: 't1',
    text: 'Me siento abrumado por la cantidad de decisiones que debo tomar esta semana, pero hay claridad en el fondo.',
    time: '14:20',
    intensity: 8,
    nodeId: NODE_IDS.OVERTHINKING,
    nodeColor: '#89d4cd',
    date: 'Hoy',
  },
  {
    id: 't2',
    text: 'Hoy el foco está en las relaciones personales. Una conversación pendiente me ha dado paz.',
    time: '10:05',
    intensity: 4,
    nodeId: NODE_IDS.RELATIONSHIPS,
    nodeColor: '#d3bcfc',
    date: 'Hoy',
  },
  {
    id: 't3',
    text: 'Cansancio físico notable. Necesito desconectar de las pantallas por unas horas.',
    time: '21:30',
    intensity: 3,
    nodeId: NODE_IDS.BODY,
    nodeColor: '#484848',
    date: 'Ayer',
  },
  {
    id: 't4',
    text: 'He tenido una idea creativa sobre el proyecto que llevo meses bloqueado. Todo encaja de pronto.',
    time: '16:45',
    intensity: 7,
    nodeId: NODE_IDS.CREATIVITY,
    nodeColor: '#ffeaaf',
    date: 'Ayer',
  },
];

export const nodeDetail = {
  id: NODE_IDS.OVERTHINKING,
  title: 'Pensamiento / Sobrecarga',
  description:
    'Tus procesos mentales activos y carga cognitiva. Este nodo representa la acumulación de tareas pendientes y la fragmentación de la atención durante las últimas jornadas.',
  activationLevel: 84,
  frequency: 'Alta',
  frequencyDetail: 'Detectado en 12 de los últimos 14 días.',
  trendData: [40, 60, 85, 95, 75, 50, 30, 65, 90, 45],
  connections: [
    { id: 'ansiedad', label: 'Ansiedad', strength: 0.82, color: '#d3bcfc' },
    { id: 'creatividad', label: 'Creatividad', strength: 0.45, color: '#ffeaaf' },
    { id: 'trabajo', label: 'Trabajo', strength: 0.91, color: '#484848' },
  ],
  relatedThoughts: [
    {
      id: 'rt1',
      text: '"Siento que hay demasiados hilos sueltos en el proyecto actual. La cabeza me da vueltas con la entrega de mañana..."',
      time: 'Hoy, 09:42 AM',
      borderColor: '#89d4cd',
    },
    {
      id: 'rt2',
      text: '"Dificultad para desconectar. El ruido mental persiste incluso después de la meditación."',
      time: 'Ayer, 11:15 PM',
      borderColor: '#484848',
    },
  ],
};

export const insightData = {
  weekly: {
    period: '7 – 13 de Abril',
    title: 'Síntesis de consciencia',
    description:
      'Esta semana has activado principalmente áreas relacionadas con seguridad y presión interna.',
    highlightWords: [
      { word: 'seguridad', color: '#89d4cd' },
      { word: 'presión interna', color: '#d3bcfc' },
    ],
    connectionsDetected: 14,
  },
  monthly: {
    month: 'Abril',
    nodesActivated: 84,
    summary:
      'Durante este mes, la arquitectura de tus pensamientos muestra una transición desde la reactividad externa hacia la auto-regulación reflexiva. El foco principal se desplazó de "Carrera Profesional" a "Bienestar Personal".',
  },
  threadHealth: {
    bars: [40, 70, 95, 55, 25],
    clarityIncrease: 12,
  },
  recurringPattern: {
    title: 'Conexión recurrente',
    description:
      'Existe una conexión recurrente entre el pensamiento excesivo y sensaciones corporales reportadas.',
  },
  dominantThreads: [
    { category: 'Crecimiento', label: 'Auto-percepción', color: '#89d4cd' },
    { category: 'Presión', label: 'Expectativas Externas', color: '#d3bcfc' },
    { category: 'Calma', label: 'Práctica de Silencio', color: '#ffeaaf' },
  ],
};

export const historialData = {
  currentMonth: 'Abril',
  currentYear: 2026,
  weekdays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  // day numbers with activity levels: 0=none, 1=low, 2=medium, 3=high
  days: [
    { day: 1, activity: 0 },
    { day: 2, activity: 0 },
    { day: 3, activity: 3 },
    { day: 4, activity: 1 },
    { day: 5, activity: 3 },
    { day: 6, activity: 0 },
    { day: 7, activity: 2 },
    { day: 8, activity: 0 },
    { day: 9, activity: 3 },
    { day: 10, activity: 1 },
    { day: 11, activity: 2 },
    { day: 12, activity: 3 },
  ],
  startOffset: 1, // Tuesday start = 1 empty cells (Mon)
  heatmapBars: [20, 45, 30, 85, 50, 60, 25, 70, 40, 35, 95, 55, 45, 60, 30],
  heatmapMonths: ['Nov', 'Dic', 'Ene', 'Feb', 'Mar', 'Abr'],
  entries: [
    {
      id: 'h1',
      dayOfWeek: 'Sábado',
      dayNumber: '12',
      title: 'Claridad Post-Meditación',
      connectedNodes: 'Ansiedad, Propósito, Calma',
      dots: ['#89d4cd', 'rgba(137,212,205,0.4)', 'rgba(211,188,252,0.4)'],
      highlight: false,
    },
    {
      id: 'h2',
      dayOfWeek: 'Miércoles',
      dayNumber: '09',
      title: 'Tensión en el Trabajo',
      connectedNodes: 'Fatiga, Creatividad, Bloqueo',
      dots: ['rgba(250,116,111,0.6)', '#484848'],
      highlight: false,
    },
    {
      id: 'h3',
      dayOfWeek: 'Lunes',
      dayNumber: '07',
      title: 'Epifanía Creativa',
      connectedNodes: 'Un descubrimiento fundamental sobre la dirección del proyecto.',
      dots: ['#ffeaaf', 'rgba(255,234,175,0.6)', 'rgba(137,212,205,0.6)'],
      highlight: true,
    },
  ],
};

export const suggestedNodes = [
  { id: NODE_IDS.SURVIVAL, label: 'Supervivencia / Seguridad' },
  { id: NODE_IDS.RELATIONSHIPS, label: 'Relaciones' },
  { id: NODE_IDS.CONTROL, label: 'Control / Autoestima' },
  { id: NODE_IDS.OVERTHINKING, label: 'Pensamiento / Sobrecarga' },
  { id: NODE_IDS.BODY, label: 'Cuerpo / Sensaciones' },
  { id: NODE_IDS.CREATIVITY, label: 'Creatividad / Expresión' },
  { id: NODE_IDS.PURPOSE, label: 'Sentido / Propósito' },
];
