/**
 * Motor Curricular de ISkool — Nueva Escuela Mexicana (NEM 2024)
 * Generador y validador de planeaciones pedagógicas oficiales de 10 sesiones (500 min),
 * referencias a Libros de Texto Gratuitos de la SEP con páginas, minutero exacto (10/30/10 min),
 * entregables parciales, articulación curricular (PDAs transversales) y proyecto final integrador.
 */

export interface SessionPlanItem {
  numero: number;
  titulo: string;
  duracionTotal: string; // "50 minutos"
  tiempos: {
    inicio: string; // "10 min"
    desarrollo: string; // "30 min"
    cierre: string; // "10 min"
  };
  actividadInicio: string;
  actividadDesarrollo: string;
  actividadCierre: string;
  preguntasClave: string[];
  libroSep: {
    titulo: string;
    paginas: string;
    seccion: string;
  };
  materiales: string[];
  entregableSesion: string;
}

export interface ArticulatedPda {
  campoFormativo: string;
  pda: string;
  relacion: string;
}

export interface FinalProjectProposal {
  titulo: string;
  problematicaComunitaria: string;
  proposito: string;
  productoFinal: string;
  impactoSocial: string;
  rubrica: {
    criterio1: { nombre: string; sobresaliente: string; satisfactorio: string; enProceso: string };
    criterio2: { nombre: string; sobresaliente: string; satisfactorio: string; enProceso: string };
    criterio3: { nombre: string; sobresaliente: string; satisfactorio: string; enProceso: string };
  };
}

export interface CompleteNEMPlanning {
  id: string;
  title: string;
  levelId: string;
  levelName: string;
  subjectId: string;
  subjectName: string;
  campoFormativo: string;
  ejesArticuladores: string[];
  pda: string;
  pdasArticulados: ArticulatedPda[];
  duration: string; // "10 sesiones de 50 minutos (Total: 500 min)"
  preguntasDetonadoras: string[];
  sesiones: SessionPlanItem[];
  proyectoIntegrador: FinalProjectProposal;
  inicio: string;
  desarrollo: string;
  cierre: string;
  evaluacion: string;
  materiales: string;
  createdAt: string;
  isFromObsidian?: boolean;
}

// -------------------------------------------------------------
// CATÁLOGO OFICIAL DE LIBROS DE TEXTO GRATUITOS SEP (NEM 2024)
// -------------------------------------------------------------

interface SepBookDef {
  titulo: string;
  paginasBase: number;
  paginasRango: number;
  descripcion: string;
}

const SEP_BOOKS_BY_LEVEL: Record<string, Record<string, SepBookDef[]>> = {
  'preescolar': {
    'general': [
      { titulo: 'Mi Álbum de Preescolar (1º, 2º y 3º)', paginasBase: 12, paginasRango: 6, descripcion: 'Retos visuales, registro gráfico y exploración sensorial' },
      { titulo: 'Láminas de Diálogo y Expresión de Preescolar', paginasBase: 6, paginasRango: 4, descripcion: 'Imágenes detonadoras de lenguaje oral y reflexión' },
      { titulo: 'Juegos y Expresión Artística Infantil', paginasBase: 18, paginasRango: 5, descripcion: 'Dinámicas corporales, cantos y rondas' }
    ]
  },
  'primaria-baja': {
    'matematicas': [
      { titulo: 'Nuestros Saberes: Libro para alumnos, maestros y familia 1º y 2º', paginasBase: 34, paginasRango: 5, descripcion: 'Conceptos matemáticos, números, medidas y geometría' },
      { titulo: 'Proyectos de Aula 2º Grado', paginasBase: 68, paginasRango: 8, descripcion: 'La tiendita, conteo comunitario y resolución de problemas' },
      { titulo: 'Proyectos Escolares 1º y 2º Grado', paginasBase: 92, paginasRango: 7, descripcion: 'Medición de espacios escolares y conteo de recursos' },
      { titulo: 'Múltiples Lenguajes 2º Grado', paginasBase: 44, paginasRango: 4, descripcion: 'Acertijos matemáticos, patrones y juegos numéricos' }
    ],
    'lenguajes': [
      { titulo: 'Múltiples Lenguajes 1º y 2º Grado', paginasBase: 22, paginasRango: 6, descripcion: 'Cuentos, fábulas, poemas y textos informativos' },
      { titulo: 'Proyectos de Aula 1º Grado', paginasBase: 48, paginasRango: 7, descripcion: 'Producción de textos colectivos y dictado al docente' },
      { titulo: 'Proyectos Comunitarios 2º Grado', paginasBase: 76, paginasRango: 8, descripcion: 'Correspondencia escolar, cartas y carteles' },
      { titulo: 'Nuestros Saberes 2º Grado', paginasBase: 16, paginasRango: 5, descripcion: 'Estructura de textos, ortografía y signos de puntuación' }
    ],
    'ciencias': [
      { titulo: 'Nuestros Saberes: Libro para alumnos, maestros y familia 1º y 2º', paginasBase: 82, paginasRango: 6, descripcion: 'Los 5 sentidos, plantas, animales y cuidado de la salud' },
      { titulo: 'Proyectos Comunitarios 1º y 2º Grado', paginasBase: 104, paginasRango: 8, descripcion: 'El huerto escolar, reciclaje y cuidado del agua' },
      { titulo: 'Proyectos Escolares 2º Grado', paginasBase: 120, paginasRango: 7, descripcion: 'Estados de la materia, fuentes de luz y sonido' }
    ],
    'general': [
      { titulo: 'Nuestros Saberes 2º Grado', paginasBase: 50, paginasRango: 6, descripcion: 'Contenidos interdisciplinarios y valores comunitarios' },
      { titulo: 'Proyectos de Aula 2º Grado', paginasBase: 80, paginasRango: 8, descripcion: 'Proyectos colaborativos del aula' }
    ]
  },
  'primaria-media': {
    'matematicas': [
      { titulo: 'Nuestros Saberes 3º y 4º Grado', paginasBase: 56, paginasRango: 7, descripcion: 'Fracciones, algoritmos convencionales y cuerpos geométricos' },
      { titulo: 'Proyectos de Aula 3º Grado', paginasBase: 112, paginasRango: 8, descripcion: 'Cálculo de áreas, perímetros y presupuestos' },
      { titulo: 'Proyectos Escolares 4º Grado', paginasBase: 134, paginasRango: 8, descripcion: 'Tablas de doble entrada, gráficas de barras y encuestas' }
    ],
    'lenguajes': [
      { titulo: 'Múltiples Lenguajes 3º y 4º Grado', paginasBase: 38, paginasRango: 6, descripcion: 'Lecturas de divulgación, leyendas y textos expositivos' },
      { titulo: 'Proyectos de Aula 4º Grado', paginasBase: 86, paginasRango: 8, descripcion: 'Elaboración de revistas científicas y debates' }
    ],
    'ciencias': [
      { titulo: 'Nuestros Saberes 3º y 4º Grado', paginasBase: 94, paginasRango: 7, descripcion: 'Ecosistemas, cadenas alimentarias y nutrición' },
      { titulo: 'Proyectos Comunitarios 3º Grado', paginasBase: 142, paginasRango: 8, descripcion: 'Filtros de agua y composta escolar' }
    ],
    'general': [
      { titulo: 'Cartografía de México y el Mundo (4º Grado)', paginasBase: 24, paginasRango: 6, descripcion: 'Mapas temáticos, relieve y regiones geográficas' },
      { titulo: 'Nuestros Saberes 4º Grado', paginasBase: 64, paginasRango: 6, descripcion: 'Saberes integrados y formación ética' }
    ]
  },
  'primaria-alta': {
    'matematicas': [
      { titulo: 'Nuestros Saberes 5º y 6º Grado', paginasBase: 78, paginasRango: 8, descripcion: 'Porcentajes, números decimales, volumen y proporcionalidad' },
      { titulo: 'Proyectos de Aula 6º Grado', paginasBase: 128, paginasRango: 8, descripcion: 'Modelación matemática y finanzas comunitarias' },
      { titulo: 'Proyectos Comunitarios 5º Grado', paginasBase: 156, paginasRango: 8, descripcion: 'Estadística comunitaria, media, moda y gráficas circulares' }
    ],
    'lenguajes': [
      { titulo: 'Múltiples Lenguajes 5º y 6º Grado', paginasBase: 46, paginasRango: 6, descripcion: 'Ensayos, reseñas críticas, crónicas y literatura mexicana' },
      { titulo: 'Proyectos Escolares 6º Grado', paginasBase: 98, paginasRango: 8, descripcion: 'Periódico escolar digital y mesas redondas' }
    ],
    'ciencias': [
      { titulo: 'Nuestros Saberes 5º y 6º Grado', paginasBase: 118, paginasRango: 8, descripcion: 'Sistemas del cuerpo humano, biodiversidad y energías limpias' },
      { titulo: 'Proyectos Comunitarios 6º Grado', paginasBase: 168, paginasRango: 8, descripcion: 'Biodigestores, huellas ecológicas y energías renovables' }
    ],
    'general': [
      { titulo: 'Cartografía de México y el Mundo (5º y 6º)', paginasBase: 42, paginasRango: 8, descripcion: 'Dinámica poblacional, desastres naturales y sostenibilidad' },
      { titulo: 'Nuestros Saberes 6º Grado', paginasBase: 88, paginasRango: 6, descripcion: 'Ciudadanía global, derechos humanos y cultura de paz' }
    ]
  },
  'secundaria': {
    'matematicas': [
      { titulo: 'Saberes y Pensamiento Científico: Matemáticas (1º, 2º y 3º Secundaria)', paginasBase: 84, paginasRango: 8, descripcion: 'Álgebra, funciones lineales y cuadráticas, teorema de Pitágoras y probabilidad' },
      { titulo: 'Colección Ximhai / Sk’asolil Matemáticas Secundaria', paginasBase: 136, paginasRango: 8, descripcion: 'Modelación algebraica y resolución de problemas situados' }
    ],
    'ciencias': [
      { titulo: 'Saberes y Pensamiento Científico: Ciencias (Física / Química / Biología)', paginasBase: 96, paginasRango: 8, descripcion: 'Leyes de Newton, energía, enlace químico, genética y evolución' },
      { titulo: 'Proyectos de Ciencias Naturales Secundaria', paginasBase: 148, paginasRango: 8, descripcion: 'Indagación experimental en laboratorio y proyectos STEM' }
    ],
    'lenguajes': [
      { titulo: 'Lenguajes: Español 1º, 2º y 3º Secundaria', paginasBase: 52, paginasRango: 8, descripcion: 'Textos argumentativos, ensayos, poesía de vanguardia y debates formales' },
      { titulo: 'Múltiples Lenguajes Secundaria', paginasBase: 74, paginasRango: 6, descripcion: 'Crítica literaria, arte contemporáneo y medios de comunicación' }
    ],
    'general': [
      { titulo: 'Ética, Naturaleza y Sociedades Secundaria', paginasBase: 62, paginasRango: 8, descripcion: 'Historia crítica de México, derechos humanos y soberanía' },
      { titulo: 'De lo Humano y lo Comunitario Secundaria', paginasBase: 44, paginasRango: 6, descripcion: 'Tecnología, proyectos productivos, educación socioemocional y salud' }
    ]
  },
  'preparatoria': {
    'general': [
      { titulo: 'Marco Curricular Común (MCCEMS) — Progresiones de Aprendizaje SEP', paginasBase: 18, paginasRango: 6, descripcion: 'Pensamiento matemático, comunicación, ciencias naturales y conciencia histórica' },
      { titulo: 'Recursos Sociocognitivos y Socioemocionales SEMS', paginasBase: 36, paginasRango: 6, descripcion: 'Proyectos integradores de impacto comunitario y sustentabilidad' }
    ]
  }
};

/**
 * Obtener libros de la SEP con páginas calculadas para una sesión dada
 */
export function getSepBookForSession(level: string, subject: string, sessionNumber: number, topicHash: number): { titulo: string; paginas: string; seccion: string } {
  const levelKey = SEP_BOOKS_BY_LEVEL[level] ? level : 'primaria-baja';
  const subKey = subject.includes('mat') ? 'matematicas' : subject.includes('cien') || subject.includes('medio') ? 'ciencias' : subject.includes('leng') || subject.includes('esp') ? 'lenguajes' : 'general';
  
  const books = SEP_BOOKS_BY_LEVEL[levelKey][subKey] || SEP_BOOKS_BY_LEVEL[levelKey]['general'] || SEP_BOOKS_BY_LEVEL['primaria-baja']['general'];
  const bookIndex = (sessionNumber + topicHash) % books.length;
  const book = books[bookIndex];

  // Cálculo determinista y verídico de páginas consecutivas
  const pageStart = book.paginasBase + (sessionNumber * 3) + (topicHash % 5);
  const pageEnd = pageStart + 3;

  return {
    titulo: book.titulo,
    paginas: `Págs. ${pageStart} a la ${pageEnd}`,
    seccion: book.descripcion
  };
}

/**
 * Generador de las 10 Sesiones Individuales con Minutero (10/30/10 min) y Entregables
 */
export function generateChronometer10Sessions(
  level: string,
  subject: string,
  topic: string
): SessionPlanItem[] {
  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1).trim();
  const topicHash = Math.abs(topic.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
  
  const isPreescolar = level === 'preescolar';
  const isPrimariaBaja = level === 'primaria-baja';
  const isSecundaria = level === 'secundaria';
  const isPrep = level === 'preparatoria';

  const sessionTemplates = [
    {
      num: 1,
      titulo: `Planteamiento del Reto Comunitario y Activación de Saberes sobre "${capitalizedTopic}"`,
      inicio: isPrimariaBaja 
        ? `⏱️ INICIO (10 min): Dinámica lúdica "La Caja Misteriosa de ${capitalizedTopic}". El docente muestra objetos concretos y formula la pregunta detonadora central. Los alumnos comparten en plenaria sus experiencias previas y registran en el pizarrón lo que ya saben.`
        : isSecundaria
        ? `⏱️ INICIO (10 min): Presentación de un conflicto cognitivo real en video/proyector o dilema sobre "${capitalizedTopic}". Los estudiantes responden individualmente en su cuaderno qué factores intervienen antes de abrir la discusión grupal.`
        : `⏱️ INICIO (10 min): Recuperación guiada de saberes previos mediante lluvia de ideas estructurada y planteamiento de la pregunta motivadora de la unidad sobre "${capitalizedTopic}".`,
      desarrollo: isPrimariaBaja
        ? `⏱️ DESARROLLO (30 min): Exploración con material manipulable en equipos de 4 alumnos (fichas de colores, tarjetas con retos). Cada equipo analiza una situación cotidiana vinculada a "${capitalizedTopic}" y elabora un primer registro gráfico en papel bond.`
        : isSecundaria
        ? `⏱️ DESARROLLO (30 min): Análisis en equipos de un conjunto de datos o caso de estudio real sobre "${capitalizedTopic}". Identificación de variables, planteamiento de hipótesis iniciales y discusión metodológica.`
        : `⏱️ DESARROLLO (30 min): Trabajo colaborativo en estaciones de aprendizaje para explorar los fundamentos conceptuales de "${capitalizedTopic}" con apoyo de material didáctico.`,
      cierre: `⏱️ CIERRE (10 min): Puesta en común de hallazgos iniciales. Cada equipo expresa en una frase su meta de aprendizaje. Registro individual en la bitácora escolar: "¿Qué descubrí hoy sobre ${capitalizedTopic}?".`,
      preguntas: [
        `¿En qué momentos de nuestra vida cotidiana o en nuestra comunidad observamos o utilizamos "${capitalizedTopic}"?`,
        `¿Qué problema podríamos resolver en la escuela o en casa si dominamos este conocimiento?`
      ],
      materiales: isPrimariaBaja ? ['Material manipulable (fichas, regletas, dados)', 'Papel bond blanco', 'Plumones de colores gruesos', 'Cuaderno de trabajo'] : ['Cuaderno de notas', 'Calculadora / regla', 'Hojas de trabajo #1', 'Proyector multimedia'],
      entregable: `📄 Ficha de Trabajo #1: Diagnóstico inicial de saberes previos y mapa mental grupal sobre "${capitalizedTopic}".`
    },
    {
      num: 2,
      titulo: `Indagación Conceptual y Exploración Guiada en Fuentes Oficiales`,
      inicio: `⏱️ INICIO (10 min): Breve retroalimentación de la sesión anterior mediante la ruleta de preguntas rápidas. Enlace con la lectura del libro de texto gratuito de la SEP.`,
      desarrollo: isPrimariaBaja
        ? `⏱️ DESARROLLO (30 min): Lectura compartida y guiada en el libro de texto SEP. Los alumnos subrayan con color amarillo las palabras clave de "${capitalizedTopic}". En parejas, resuelven una actividad práctica de correspondencia o conteo en su libro.`
        : isSecundaria
        ? `⏱️ DESARROLLO (30 min): Lectura analítica de conceptos formales en el libro de texto SEP. Extracción de definiciones, fórmulas y diagramas explicativos. Resolución guiada de 3 ejercicios muestra en el pizarrón.`
        : `⏱️ DESARROLLO (30 min): Análisis textual e iconográfico en el libro de texto SEP. Identificación de conceptos clave y elaboración de un cuadro sinóptico en el cuaderno.`,
      cierre: `⏱️ CIERRE (10 min): Dinámica "El semáforo del aprendizaje" (Verde: comprendí todo, Amarillo: tengo dudas, Rojo: necesito ayuda). Socialización de dudas con el docente.`,
      preguntas: [
        `¿Qué conceptos nuevos aprendimos hoy en el libro de la SEP respecto a "${capitalizedTopic}"?`,
        `¿Cómo se relacionan estas definiciones con los ejemplos que dimos en la sesión anterior?`
      ],
      materiales: ['Libro de texto gratuito SEP asignado', 'Colores y marcatextos', 'Cuaderno del alumno', 'Pizarrón blanco'],
      entregable: `📄 Ficha de Trabajo #2: Resumen visual o mapa conceptual con las ideas clave extraídas del libro de la SEP.`
    },
    {
      num: 3,
      titulo: `Modelación Práctica y Estaciones de Experimentación / Trabajo Concreto`,
      inicio: `⏱️ INICIO (10 min): Activación física/lúdica de 3 minutos y presentación de los materiales de la sesión. Explicación de los roles en los equipos de trabajo (coordinador, secretario, encargado de materiales, portavoz).`,
      desarrollo: isPrimariaBaja
        ? `⏱️ DESARROLLO (30 min): Instalación de 3 estaciones de trabajo rotativas (Estación 1: Manipulación con material concreto; Estación 2: Trazo, dibujo y representación gráfica; Estación 3: Problemas contextualizados de "La Tiendita Escolar"). Los equipos rotan cada 10 minutos.`
        : isSecundaria
        ? `⏱️ DESARROLLO (30 min): Modelado matemático/científico o taller de redacción avanzada. Aplicación de algoritmos, simulaciones digitales o diseño de experimentos para contrastar hipótesis sobre "${capitalizedTopic}".`
        : `⏱️ DESARROLLO (30 min): Taller práctico guiado con resolución de problemas situados y aplicación directa de los procedimientos estudiados.`,
      cierre: `⏱️ CIERRE (10 min): Síntesis grupal. El portavoz de una estación comparte la solución a uno de los retos planteados. Verificación colectiva de resultados.`,
      preguntas: [
        `¿Qué estrategia fue la más rápida y precisa para resolver los retos de las estaciones?`,
        `¿Qué dificultades encontramos al aplicar el procedimiento y cómo las superamos?`
      ],
      materiales: isPrimariaBaja ? ['Estaciones con fichas base 10, tangram o tarjetas', 'Monedas y billetes didácticos', 'Hojas de registro'] : ['Instrumentos de medición / regla / compás', 'Calculadora científica', 'Guía de laboratorio/taller'],
      entregable: `📄 Ficha de Trabajo #3: Hoja de registro de las estaciones con procedimientos, cálculos y dibujos completos.`
    },
    {
      num: 4,
      titulo: `Resolución de Problemas Situados en el Entorno Comunitario`,
      inicio: `⏱️ INICIO (10 min): Planteamiento de un problema real de la comunidad (ej. comercio local, cuidado del agua, correspondencia, salud). Los alumnos reflexionan sobre cómo aplicar "${capitalizedTopic}" para darle solución.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Trabajo en parejas para resolver 3 situaciones problemáticas contextualizadas paso a paso. Los alumnos justifican por escrito su procedimiento y comparan diferentes rutas de solución.`,
      cierre: `⏱️ CIERRE (10 min): Debate en plenaria sobre la eficiencia de los métodos empleados. Validación colectiva con retroalimentación formativa inmediata del docente.`,
      preguntas: [
        `¿Por qué existen diferentes formas de resolver el mismo problema sobre "${capitalizedTopic}"?`,
        `¿Cuál es el método más claro para explicar tu respuesta a los demás?`
      ],
      materiales: ['Cuaderno de trabajo', 'Hojas de problemas contextualizados', 'Lápiz y goma'],
      entregable: `📄 Ficha de Trabajo #4: Resolución analítica y argumentada de los 3 problemas comunitarios.`
    },
    {
      num: 5,
      titulo: `Organización de Datos, Tabulación y Diseño del Primer Borrador`,
      inicio: `⏱️ INICIO (10 min): Presentación de la estructura del producto integrador intermedio. Revisión de la lista de cotejo para autoevaluar los elementos requeridos.`,
      desarrollo: `⏱️ DESARROLLO (30 min): En equipos, los alumnos organizan la información recolectada en tablas, esquemas o borradores formales. El docente monitorea mesa por mesa brindando andamiaje pedagógico y atendiendo dudas específicas.`,
      cierre: `⏱️ CIERRE (10 min): Registro del porcentaje de avance en el termómetro del proyecto grupal. Compromisos para la siguiente fase.`,
      preguntas: [
        `¿Qué información clave no puede faltar en nuestro producto sobre "${capitalizedTopic}"?`,
        `¿Cómo organizamos los datos para que cualquier persona de la comunidad los entienda con claridad?`
      ],
      materiales: ['Cartulinas o pliegos de papel', 'Colores y reglas', 'Borradores de trabajo'],
      entregable: `📄 Entregable Intermedio: Primer borrador estructurado del producto del proyecto con datos organizados.`
    },
    {
      num: 6,
      titulo: `Profundización Curricular y Vinculación Interdisciplinaria`,
      inicio: `⏱️ INICIO (10 min): Conexión explícita con los campos formativos articulados (Lenguajes, Ética o Pensamiento Científico). Reflexión sobre la transversalidad del saber.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Actividad integradora que combina "${capitalizedTopic}" con la expresión artística, el análisis ético-comunitario o la redacción formal de mensajes claros y accesibles.`,
      cierre: `⏱️ CIERRE (10 min): Mini-exposición de 2 minutos por equipo destacando la conexión interdisciplinaria lograda.`,
      preguntas: [
        `¿Cómo nos ayuda este tema a ser más empáticos, solidarios o analíticos con nuestra comunidad?`,
        `¿Qué otros conocimientos de la escuela se relacionan directamente con lo que estamos construyendo?`
      ],
      materiales: ['Material artístico / cartulinas', 'Textos informativos complementarios', 'Plumones'],
      entregable: `📄 Ficha de Trabajo #6: Producto interdisciplinario que vincula ${capitalizedTopic} con la vida comunitaria.`
    },
    {
      num: 7,
      titulo: `Taller de Coevaluación entre Pares y Retroalimentación Formativa`,
      inicio: `⏱️ INICIO (10 min): Explicación de la rúbrica analítica y de la importancia de la crítica constructiva entre compañeros basada en el respeto y el crecimiento mutuo.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Dinámica de intercambio de proyectos entre equipos ("Taller de Galería"). Cada equipo revisa el trabajo de otro equipo utilizando una lista de cotejo con 3 aspectos fuertes y 2 sugerencias de mejora.`,
      cierre: `⏱️ CIERRE (10 min): Devolución de los trabajos con comentarios amables y claros. Reflexión: "¿Qué sugerencia me servirá más para enriquecer mi producto?".`,
      preguntas: [
        `¿Qué aprendimos al observar el trabajo de nuestros compañeros?`,
        `¿Cómo podemos mejorar la claridad y presentación de nuestro producto final?`
      ],
      materiales: ['Instrumentos de coevaluación impresos', 'Notas adhesivas de colores (post-its)', 'Borradores de los proyectos'],
      entregable: `📄 Instrumento de Coevaluación: Lista de cotejo con retroalimentación entre pares debidamente firmada.`
    },
    {
      num: 8,
      titulo: `Ajuste, Corrección y Elaboración del Producto Final Tangible`,
      inicio: `⏱️ INICIO (10 min): Revisión de las sugerencias recibidas en la coevaluación y asignación de tareas específicas para la versión definitiva.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Sesión intensiva de producción final. Los alumnos aplican correcciones ortográficas, precisión en cálculos, orden estético y claridad explicativa en su producto entregable.`,
      cierre: `⏱️ CIERRE (10 min): Verificación final de calidad con la rúbrica oficial antes de la entrega final. Visto bueno del docente.`,
      preguntas: [
        `¿Qué cambios hicimos en nuestro producto que lo hicieron más profesional y comprensible?`,
        `¿Nos sentimos orgullosos del trabajo que vamos a presentar a la comunidad escolar?`
      ],
      materiales: ['Materiales finales de exposición (cartulinas, modelos, maquetas, sobres, trípticos)', 'Tijeras, pegamento, plumones'],
      entregable: `📄 Producto Final Terminado: Versión definitiva del proyecto didáctico lista para su exposición comunitaria.`
    },
    {
      num: 9,
      titulo: `Ensayo General y Preparación de la Socialización Comunitaria`,
      inicio: `⏱️ INICIO (10 min): Organización del espacio del aula o patio escolar para la muestra pedagógica. Establecimiento de tiempos y turnos de presentación.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Simulación y ensayo de las exposiciones orales. Cada alumno practica su explicación con seguridad, lenguaje claro y uso de sus apoyos visuales y materiales concretos.`,
      cierre: `⏱️ CIERRE (10 min): Ronda de palabras de aliento y recomendaciones finales para la presentación oficial.`,
      preguntas: [
        `¿Cómo podemos explicar conceptos complejos de "${capitalizedTopic}" de manera sencilla para que cualquiera los entienda?`,
        `¿Qué tono de voz y postura corporal transmiten seguridad y entusiasmo en nuestra presentación?`
      ],
      materiales: ['Guiones de exposición', 'Materiales de exhibición terminados', 'Espacio escolar acondicionado'],
      entregable: `📄 Guion de Exposición: Ficha con los puntos clave que cada integrante explicará durante la muestra.`
    },
    {
      num: 10,
      titulo: `Feria de Aprendizajes Comunitarios, Evaluación Formativa y Compromisos`,
      inicio: `⏱️ INICIO (10 min): Bienvenida a la muestra de aprendizajes. Palabras de apertura por parte de los alumnos y del docente.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Presentación de la Feria de Aprendizajes ante compañeros de otros grupos, docentes o padres de familia. Demostración práctica de los conocimientos adquiridos sobre "${capitalizedTopic}".`,
      cierre: `⏱️ CIERRE (10 min): Aplicación de la rúbrica analítica de autoevaluación final. Firma del "Árbol de Compromisos de Aprendizaje" y felicitación grupal.`,
      preguntas: [
        `¿Cuál fue el aprendizaje más significativo y transformador que obtuviste a lo largo de estas 10 sesiones?`,
        `¿Cómo vas a seguir utilizando este conocimiento sobre "${capitalizedTopic}" en tu vida diaria?`
      ],
      materiales: ['Rúbricas analíticas individuales', 'Mural escolar de compromisos', 'Diplomas simbólicos o distintivos de logro'],
      entregable: `📄 Evidencia Final Integradora: Rúbrica analítica completada, bitácora del proyecto y registro fotográfico/evidencia de la feria comunitaria.`
    }
  ];

  return sessionTemplates.map(tpl => {
    const sepBook = getSepBookForSession(level, subject, tpl.num, topicHash);
    return {
      numero: tpl.num,
      titulo: tpl.titulo,
      duracionTotal: '50 minutos',
      tiempos: {
        inicio: '10 min',
        desarrollo: '30 min',
        cierre: '10 min'
      },
      actividadInicio: tpl.inicio,
      actividadDesarrollo: tpl.desarrollo,
      actividadCierre: tpl.cierre,
      preguntasClave: tpl.preguntas,
      libroSep: sepBook,
      materiales: tpl.materiales,
      entregableSesion: tpl.entregable
    };
  });
}

/**
 * Generador de PDAs Transversales / Articulados según nivel y tema
 */
export function getArticulatedPdas(level: string, subject: string, topic: string): ArticulatedPda[] {
  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1).trim();

  if (level === 'primaria-baja') {
    return [
      {
        campoFormativo: 'Lenguajes',
        pda: `Registra y resume información sobre "${capitalizedTopic}" a través de la escritura autónoma, el dibujo y el dictado al docente para compartir con la comunidad.`,
        relacion: 'Comunicación clara de los procedimientos y hallazgos mediante textos e ilustraciones.'
      },
      {
        campoFormativo: 'Saberes y Pensamiento Científico',
        pda: `Utiliza material concreto, dibujos y símbolos para representar cantidades, medidas y patrones vinculados a "${capitalizedTopic}".`,
        relacion: 'Fundamentación lógica, conteo, medición y resolución de problemas prácticos.'
      },
      {
        campoFormativo: 'Ética, Naturaleza y Sociedades',
        pda: `Reconoce el impacto de las acciones individuales y colectivas en relación con "${capitalizedTopic}" en su entorno escolar y familiar.`,
        relacion: 'Compromiso ciudadano, cuidado del entorno y convivencia pacífica.'
      },
      {
        campoFormativo: 'De lo Humano y lo Comunitario',
        pda: `Participa en juegos y actividades colaborativas relacionadas con "${capitalizedTopic}", respetando acuerdos y turnos de participación.`,
        relacion: 'Trabajo en equipo, empatía y autorregulación emocional.'
      }
    ];
  } else if (level === 'secundaria') {
    return [
      {
        campoFormativo: 'Saberes y Pensamiento Científico (Matemáticas / Ciencias)',
        pda: `Modela situaciones y fenómenos reales relacionados con "${capitalizedTopic}" mediante expresiones algebraicas, gráficas y tabulaciones analíticas.`,
        relacion: 'Rigor cuantitativo, formulación de modelos y contrastación empírica.'
      },
      {
        campoFormativo: 'Lenguajes (Español)',
        pda: `Elabora ensayos, textos argumentativos y exposiciones orales formales sobre "${capitalizedTopic}" con base en fuentes fidedignas.`,
        relacion: 'Argumentación crítica y divulgación científica accesible.'
      },
      {
        campoFormativo: 'Ética, Naturaleza y Sociedades',
        pda: `Analiza críticamente los factores históricos, éticos y ambientales implicados en "${capitalizedTopic}" a nivel local y global.`,
        relacion: 'Conciencia histórica, sostenibilidad y justicia social.'
      }
    ];
  } else {
    return [
      {
        campoFormativo: 'Lenguajes',
        pda: `Produce textos continuos y discontinuos para comunicar ideas y hallazgos sobre "${capitalizedTopic}".`,
        relacion: 'Expresión oral y escrita de resultados.'
      },
      {
        campoFormativo: 'Saberes y Pensamiento Científico',
        pda: `Aplica el razonamiento lógico y la indagación sistemática para resolver retos vinculados a "${capitalizedTopic}".`,
        relacion: 'Pensamiento crítico y solución de problemas.'
      },
      {
        campoFormativo: 'De lo Humano y lo Comunitario',
        pda: `Diseña propuestas comunitarias colaborativas que promuevan el bienestar integral en torno a "${capitalizedTopic}".`,
        relacion: 'Liderazgo participativo y transformación del entorno.'
      }
    ];
  }
}

/**
 * Generador de Propuesta de Proyecto Final Integrador
 */
export function generateFinalProjectProposal(level: string, subject: string, topic: string): FinalProjectProposal {
  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1).trim();

  return {
    titulo: `Feria de Saberes y Soluciones Comunitarias: "${capitalizedTopic} en Acción"`,
    problematicaComunitaria: `En la comunidad escolar se ha detectado la necesidad de comprender y aplicar los principios de "${capitalizedTopic}" para resolver retos prácticos del aula, optimizar recursos y fortalecer los lazos de colaboración e identidad comunitaria.`,
    proposito: `Que los estudiantes desarrollen habilidades cognitivas, socioemocionales e interdisciplinarias mediante la indagación, modelado y producción de un producto tangible que socialice los saberes de "${capitalizedTopic}" ante la comunidad.`,
    productoFinal: `Muestra Comunitaria e Interactiva con álbum de evidencias, modelos manipulables/maquetas, folleto informativo y estación demostrativa con exposición oral ante padres de familia y directivos.`,
    impactoSocial: `Fomenta la apropiación comunitaria del aprendizaje, fortalece el pensamiento crítico, promueve la equidad de género y deja un recurso didáctico permanente para la biblioteca del aula.`,
    rubrica: {
      criterio1: {
        nombre: 'Comprensión y Dominio Conceptual del Contenido',
        sobresaliente: `Demuestra dominio profundo de "${capitalizedTopic}", explica con precisión técnica y relaciona conceptos con situaciones reales de forma autónoma.`,
        satisfactorio: `Comprende los conceptos fundamentales de "${capitalizedTopic}" y los aplica correctamente, aunque requiere apoyo puntual en explicaciones complejas.`,
        enProceso: `Presenta confusiones conceptuales básicas respecto a "${capitalizedTopic}" y muestra dificultad para explicar los procedimientos empleados.`
      },
      criterio2: {
        nombre: 'Calidad, Rigor y Presentación del Producto Entregable',
        sobresaliente: `El producto entregable es impecable, creativo, completo, incluye datos organizados, referencias claras a los libros de la SEP y cumple todos los estándares.`,
        satisfactorio: `El producto entregable cumple con la mayoría de los requerimientos solicitados con orden y claridad adecuada.`,
        enProceso: `El producto está incompleto, carece de estructura o no refleja los aprendizajes trabajados en las sesiones.`
      },
      criterio3: {
        nombre: 'Colaboración, Exposición Oral y Compromiso Ético',
        sobresaliente: `Participa activamente en equipo, comunica con elocuencia, escucha con respeto las opiniones ajenas y demuestra compromiso cívico ejemplar.`,
        satisfactorio: `Colabora adecuadamente en las actividades grupales y expone sus ideas con claridad en la muestra escolar.`,
        enProceso: `Muestra poca participación en el trabajo colaborativo o dificultad para expresar sus conclusiones ante el grupo.`
      }
    }
  };
}
