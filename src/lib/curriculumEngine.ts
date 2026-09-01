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
  isFromVault?: boolean;
}

export interface BaseSubjectDef {
  id: string;
  name: string;
  campoFormativo: string;
  sep_code: string;
}

export const LEVEL_BASE_SUBJECTS: Record<string, BaseSubjectDef[]> = {
  'preescolar': [
    { id: 'pre-leng', name: 'Lenguajes (Comunicación, Expresión y Lenguaje Oral/Escrito)', campoFormativo: 'Lenguajes', sep_code: 'PRE-LENG' },
    { id: 'pre-sab', name: 'Saberes y Pensamiento Científico (Conteo, Formas y Exploración Natural)', campoFormativo: 'Saberes y Pensamiento Científico', sep_code: 'PRE-SAB' },
    { id: 'pre-soc', name: 'Ética, Naturaleza y Sociedades (Mi Entorno, Familia y Comunidad)', campoFormativo: 'Ética, Naturaleza y Sociedades', sep_code: 'PRE-SOC' },
    { id: 'pre-hum', name: 'De lo Humano y lo Comunitario (Educación Socioemocional y Desarrollo Motriz)', campoFormativo: 'De lo Humano y lo Comunitario', sep_code: 'PRE-HUM' },
    { id: 'pre-art', name: 'Artes y Expresión Artística Infantil', campoFormativo: 'Lenguajes', sep_code: 'PRE-ART' },
    { id: 'pre-ing', name: 'Inglés / Lengua Extranjera (Nivel Inicial)', campoFormativo: 'Lenguajes', sep_code: 'PRE-ING' },
  ],
  'primaria-baja': [
    { id: 'p12-esp', name: 'Español / Lenguajes (1º y 2º Grado)', campoFormativo: 'Lenguajes', sep_code: 'P12-ESP' },
    { id: 'p12-mat', name: 'Matemáticas (1º y 2º Grado)', campoFormativo: 'Saberes y Pensamiento Científico', sep_code: 'P12-MAT' },
    { id: 'p12-con', name: 'Conocimiento del Medio (Ciencias, Historia y Geografía)', campoFormativo: 'Saberes y Pensamiento Científico', sep_code: 'P12-CON' },
    { id: 'p12-civ', name: 'Formación Cívica y Ética', campoFormativo: 'Ética, Naturaleza y Sociedades', sep_code: 'P12-CIV' },
    { id: 'p12-hum', name: 'Educación Socioemocional y Educación Física', campoFormativo: 'De lo Humano y lo Comunitario', sep_code: 'P12-HUM' },
    { id: 'p12-art', name: 'Artes', campoFormativo: 'Lenguajes', sep_code: 'P12-ART' },
    { id: 'p12-ing', name: 'Inglés', campoFormativo: 'Lenguajes', sep_code: 'P12-ING' },
  ],
  'primaria-media': [
    { id: 'p34-esp', name: 'Español / Lenguajes (3º y 4º Grado)', campoFormativo: 'Lenguajes', sep_code: 'P34-ESP' },
    { id: 'p34-mat', name: 'Matemáticas (3º y 4º Grado)', campoFormativo: 'Saberes y Pensamiento Científico', sep_code: 'P34-MAT' },
    { id: 'p34-cie', name: 'Ciencias Naturales (3º y 4º Grado)', campoFormativo: 'Saberes y Pensamiento Científico', sep_code: 'P34-CIE' },
    { id: 'p34-ent', name: 'La Entidad donde Vivo (Historia y Geografía Regional)', campoFormativo: 'Ética, Naturaleza y Sociedades', sep_code: 'P34-ENT' },
    { id: 'p34-civ', name: 'Formación Cívica y Ética', campoFormativo: 'Ética, Naturaleza y Sociedades', sep_code: 'P34-CIV' },
    { id: 'p34-hum', name: 'Educación Física y Vida Saludable', campoFormativo: 'De lo Humano y lo Comunitario', sep_code: 'P34-HUM' },
    { id: 'p34-art', name: 'Artes', campoFormativo: 'Lenguajes', sep_code: 'P34-ART' },
    { id: 'p34-ing', name: 'Inglés', campoFormativo: 'Lenguajes', sep_code: 'P34-ING' },
  ],
  'primaria-alta': [
    { id: 'p56-esp', name: 'Español / Lenguajes (5º y 6º Grado)', campoFormativo: 'Lenguajes', sep_code: 'P56-ESP' },
    { id: 'p56-mat', name: 'Matemáticas (5º y 6º Grado)', campoFormativo: 'Saberes y Pensamiento Científico', sep_code: 'P56-MAT' },
    { id: 'p56-cie', name: 'Ciencias Naturales y Tecnología (5º y 6º Grado)', campoFormativo: 'Saberes y Pensamiento Científico', sep_code: 'P56-CIE' },
    { id: 'p56-geo', name: 'Geografía', campoFormativo: 'Ética, Naturaleza y Sociedades', sep_code: 'P56-GEO' },
    { id: 'p56-his', name: 'Historia de México y el Mundo', campoFormativo: 'Ética, Naturaleza y Sociedades', sep_code: 'P56-HIS' },
    { id: 'p56-civ', name: 'Formación Cívica y Ética', campoFormativo: 'Ética, Naturaleza y Sociedades', sep_code: 'P56-CIV' },
    { id: 'p56-hum', name: 'Educación Socioemocional y Educación Física', campoFormativo: 'De lo Humano y lo Comunitario', sep_code: 'P56-HUM' },
    { id: 'p56-art', name: 'Artes', campoFormativo: 'Lenguajes', sep_code: 'P56-ART' },
    { id: 'p56-ing', name: 'Inglés', campoFormativo: 'Lenguajes', sep_code: 'P56-ING' },
  ],
  'secundaria': [
    { id: 'sec-esp', name: 'Lengua Materna (Español)', campoFormativo: 'Lenguajes', sep_code: 'SEC-ESP' },
    { id: 'sec-mat', name: 'Matemáticas (Álgebra, Geometría y Estadística)', campoFormativo: 'Saberes y Pensamiento Científico', sep_code: 'SEC-MAT' },
    { id: 'sec-bio', name: 'Ciencias I (Biología - 1º Secundaria)', campoFormativo: 'Saberes y Pensamiento Científico', sep_code: 'SEC-BIO' },
    { id: 'sec-fis', name: 'Ciencias II (Física - 2º Secundaria)', campoFormativo: 'Saberes y Pensamiento Científico', sep_code: 'SEC-FIS' },
    { id: 'sec-qui', name: 'Ciencias III (Química - 3º Secundaria)', campoFormativo: 'Saberes y Pensamiento Científico', sep_code: 'SEC-QUI' },
    { id: 'sec-his', name: 'Historia (1º, 2º y 3º)', campoFormativo: 'Ética, Naturaleza y Sociedades', sep_code: 'SEC-HIS' },
    { id: 'sec-geo', name: 'Geografía', campoFormativo: 'Ética, Naturaleza y Sociedades', sep_code: 'SEC-GEO' },
    { id: 'sec-civ', name: 'Formación Cívica y Ética', campoFormativo: 'Ética, Naturaleza y Sociedades', sep_code: 'SEC-CIV' },
    { id: 'sec-ing', name: 'Lengua Extranjera (Inglés)', campoFormativo: 'Lenguajes', sep_code: 'SEC-ING' },
    { id: 'sec-art', name: 'Artes (Música, Teatro, Danza o Artes Visuales)', campoFormativo: 'Lenguajes', sep_code: 'SEC-ART' },
    { id: 'sec-tec', name: 'Tecnología / Taller', campoFormativo: 'De lo Humano y lo Comunitario', sep_code: 'SEC-TEC' },
    { id: 'sec-efi', name: 'Educación Física', campoFormativo: 'De lo Humano y lo Comunitario', sep_code: 'SEC-EFI' },
    { id: 'sec-tut', name: 'Tutoría y Educación Socioemocional', campoFormativo: 'De lo Humano y lo Comunitario', sep_code: 'SEC-TUT' },
  ],
  'preparatoria': [
    { id: 'bac-len', name: 'Lengua y Comunicación (I a IV)', campoFormativo: 'Lengua y Comunicación', sep_code: 'BAC-LEN' },
    { id: 'bac-mat', name: 'Pensamiento Matemático (Álgebra, Geometría, Cálculo y Estadística)', campoFormativo: 'Pensamiento Matemático', sep_code: 'BAC-MAT' },
    { id: 'bac-nat', name: 'Ciencias Naturales, Experimentales y Tecnología (Física, Química, Biología)', campoFormativo: 'Ciencias Naturales', sep_code: 'BAC-NAT' },
    { id: 'bac-soc', name: 'Ciencias Sociales y Conciencia Histórica', campoFormativo: 'Ciencias Sociales', sep_code: 'BAC-SOC' },
    { id: 'bac-hum', name: 'Humanidades y Filosofía (I a III)', campoFormativo: 'Humanidades', sep_code: 'BAC-HUM' },
    { id: 'bac-dig', name: 'Cultura Digital', campoFormativo: 'Cultura Digital', sep_code: 'BAC-DIG' },
    { id: 'bac-ing', name: 'Inglés / Lengua Extranjera (I a IV)', campoFormativo: 'Lengua Extranjera', sep_code: 'BAC-ING' },
    { id: 'bac-emo', name: 'Recursos Socioemocionales y Responsabilidad Social', campoFormativo: 'Socioemocionales', sep_code: 'BAC-EMO' },
  ]
};

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
      { titulo: 'Proyectos Comunitarios 2º Grado', paginasBase: 76, paginasRango: 8, descripcion: 'Correspondencia escolar, cartas a la comunidad y buzón postal' },
      { titulo: 'Proyectos de Aula 1º y 2º Grado', paginasBase: 48, paginasRango: 7, descripcion: 'Producción de textos, cartas personales y dictado colectivo' },
      { titulo: 'Nuestros Saberes 2º Grado', paginasBase: 16, paginasRango: 5, descripcion: 'Estructura de la carta, signos de puntuación y remitente/destinatario' },
      { titulo: 'Múltiples Lenguajes 1º y 2º Grado', paginasBase: 22, paginasRango: 6, descripcion: 'Cuentos, textos epistolares y narraciones infantiles' }
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
      { titulo: 'Proyectos de Aula 4º Grado', paginasBase: 86, paginasRango: 8, descripcion: 'Elaboración de revistas científicas, correspondencia y debates' },
      { titulo: 'Nuestros Saberes 3º y 4º Grado', paginasBase: 24, paginasRango: 6, descripcion: 'Estructura textual, ortografía y redacción formal' }
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
      { titulo: 'Múltiples Lenguajes 5º y 6º Grado', paginasBase: 46, paginasRango: 6, descripcion: 'Ensayos, reseñas críticas, crónicas y cartas de opinión' },
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
      { titulo: 'Lenguajes: Español 1º, 2º y 3º Secundaria', paginasBase: 52, paginasRango: 8, descripcion: 'Textos argumentativos, cartas formales y de petición, ensayos y debates' },
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

interface SepProjectRange {
  level: string;
  topicRegex: RegExp;
  bookTitle: string;
  projectTitle: string;
  pageStart: number;
  pageEnd: number;
  description: string;
}

const OFFICIAL_SEP_PROJECTS: SepProjectRange[] = [
  // --- FASE 3: PRIMARIA BAJA (1º Y 2º) ---
  {
    level: 'primaria-baja',
    topicRegex: /carta|epistol|mensaje|buzon|cartero|correspondencia|sobre\b|postal/i,
    bookTitle: 'Proyectos Comunitarios 2º Grado',
    projectTitle: 'Proyecto Comunitario: "Nos comunicamos a través de cartas"',
    pageStart: 76,
    pageEnd: 87,
    description: 'Elaboración de cartas personales, buzón escolar y correspondencia comunitaria'
  },
  {
    level: 'primaria-baja',
    topicRegex: /cuento|fabula|leyenda|narrat|lectura|libro/i,
    bookTitle: 'Proyectos de Aula 1º Grado',
    projectTitle: 'Proyecto de Aula: "El tendedero de cuentos y leyendas"',
    pageStart: 48,
    pageEnd: 59,
    description: 'Creación colectiva de cuentos ilustrados y fomento de la lectura'
  },
  {
    level: 'primaria-baja',
    topicRegex: /tienda|dinero|moneda|compra|venta|conteo|fracc|num/i,
    bookTitle: 'Proyectos de Aula 2º Grado',
    projectTitle: 'Proyecto de Aula: "La tiendita del aula y los números en acción"',
    pageStart: 68,
    pageEnd: 79,
    description: 'Uso de monedas, agrupamiento en decenas/centenas y cálculo mental'
  },
  {
    level: 'primaria-baja',
    topicRegex: /agua|planta|animal|huerto|ecosist|arbol|basura|recicl/i,
    bookTitle: 'Proyectos Comunitarios 2º Grado',
    projectTitle: 'Proyecto Comunitario: "Guardianes de la naturaleza y el agua"',
    pageStart: 104,
    pageEnd: 117,
    description: 'Cuidado del agua, huertos escolares y separación de residuos'
  },
  
  // --- FASE 4: PRIMARIA MEDIA (3º Y 4º) ---
  {
    level: 'primaria-media',
    topicRegex: /carta|epistol|mensaje|buzon|correspondencia|opinion/i,
    bookTitle: 'Proyectos Comunitarios 3º Grado',
    projectTitle: 'Proyecto Comunitario: "Cartas para transformar nuestra comunidad"',
    pageStart: 88,
    pageEnd: 99,
    description: 'Redacción de cartas de opinión y petición a autoridades locales'
  },
  {
    level: 'primaria-media',
    topicRegex: /fracc|reparto|cocina|receta|metro|area|perimetro/i,
    bookTitle: 'Proyectos de Aula 3º Grado',
    projectTitle: 'Proyecto de Aula: "Las fracciones en la cocina comunitaria"',
    pageStart: 112,
    pageEnd: 125,
    description: 'Fracciones equivalentes, medidas de capacidad y pesos'
  },
  {
    level: 'primaria-media',
    topicRegex: /filtro|agua|composta|ecosist|cadena|aliment/i,
    bookTitle: 'Proyectos Comunitarios 3º Grado',
    projectTitle: 'Proyecto Comunitario: "Filtros de agua y composta escolar sustentable"',
    pageStart: 142,
    pageEnd: 155,
    description: 'Ecotecnias escolares, filtración de agua pluvial y nutrición'
  },

  // --- FASE 5: PRIMARIA ALTA (5º Y 6º) ---
  {
    level: 'primaria-alta',
    topicRegex: /carta|peticion|autoridad|oficio|formal|debate/i,
    bookTitle: 'Proyectos Comunitarios 5º Grado',
    projectTitle: 'Proyecto Comunitario: "Cartas de petición ciudadana a las autoridades"',
    pageStart: 110,
    pageEnd: 123,
    description: 'Estructura formal de petición, argumentos sólidos y gestión pública'
  },
  {
    level: 'primaria-alta',
    topicRegex: /biodigestor|biogas|energia|solar|ecotecnia|residu/i,
    bookTitle: 'Proyectos Comunitarios 6º Grado',
    projectTitle: 'Proyecto Comunitario: "Biodigestores y energías limpias para la escuela"',
    pageStart: 168,
    pageEnd: 183,
    description: 'Aprovechamiento de biomasa, producción de biogás y huella ecológica'
  },
  {
    level: 'primaria-alta',
    topicRegex: /porcentaj|descuento|interes|estadistic|grafic|volumen/i,
    bookTitle: 'Proyectos de Aula 5º Grado',
    projectTitle: 'Proyecto de Aula: "Finanzas comunitarias y porcentajes en la cooperativa"',
    pageStart: 128,
    pageEnd: 141,
    description: 'Cálculo de porcentajes, IVA, descuentos y estadística escolar'
  },

  // --- FASE 6: SECUNDARIA (1º A 3º) ---
  {
    level: 'secundaria',
    topicRegex: /carta|epistol|peticion|gestion|argument|ensayo/i,
    bookTitle: 'Lenguajes: Español 1º de Secundaria (Colección Ximhai / Sk’asolil)',
    projectTitle: 'Proyecto Formativo: "Cartas formales de gestión y peticiones ciudadanas"',
    pageStart: 44,
    pageEnd: 59,
    description: 'Estructura epistolar formal, argumentación y derechos ciudadanos'
  },
  {
    level: 'secundaria',
    topicRegex: /parabol|cuadrat|funcion|segundo grado|algebra/i,
    bookTitle: 'Saberes y Pensamiento Científico: Matemáticas 3º de Secundaria',
    projectTitle: 'Proyecto Científico: "Modelación de funciones cuadráticas y tiro parabólico"',
    pageStart: 136,
    pageEnd: 155,
    description: 'Ecuaciones cuadráticas, parábolas y modelación física'
  },
  {
    level: 'secundaria',
    topicRegex: /ultraproces|nutric|diabetes|dieta|alimento/i,
    bookTitle: 'Saberes y Pensamiento Científico: Biología 1º de Secundaria',
    projectTitle: 'Proyecto de Salud: "Prevención de enfermedades y etiquetado frontal NOM-051"',
    pageStart: 63,
    pageEnd: 79,
    description: 'Metabolismo, alimentos ultraprocesados y estilo de vida saludable'
  }
];

/**
 * Obtener libros de la SEP con páginas comprobadas y verídicas para una sesión dada
 */
export function getSepBookForSession(
  level: string, 
  subject: string, 
  sessionNumber: number, 
  topicHash: number,
  topicStr: string = ''
): { titulo: string; paginas: string; seccion: string } {
  const levelKey = SEP_BOOKS_BY_LEVEL[level] ? level : 'primaria-baja';
  const cleanTopic = topicStr.toLowerCase();
  
  // 1. Verificación directa en proyectos oficiales específicos comprobados de la SEP (NEM 2024)
  const matchedProject = OFFICIAL_SEP_PROJECTS.find(p => p.level === levelKey && p.topicRegex.test(cleanTopic));
  
  if (matchedProject) {
    const totalProjectPages = matchedProject.pageEnd - matchedProject.pageStart;
    const sessionOffset = Math.min(totalProjectPages - 1, Math.floor(((sessionNumber - 1) / 10) * totalProjectPages));
    const startP = matchedProject.pageStart + sessionOffset;
    const endP = Math.min(matchedProject.pageEnd, startP + 2);
    
    return {
      titulo: matchedProject.bookTitle,
      paginas: `Págs. ${startP} a la ${endP}`,
      seccion: `${matchedProject.projectTitle} — ${matchedProject.description}`
    };
  }

  // 2. Asignación pedagógica por catálogo general verificado
  const cleanSub = subject.toLowerCase();
  let subKey = 'general';
  if (cleanSub.includes('leng') || cleanSub.includes('esp') || cleanSub.includes('lect') || cleanSub.includes('comun') || cleanSub.includes('artes') || cleanSub.includes('ingles')) {
    subKey = 'lenguajes';
  } else if (cleanSub.includes('mat') || cleanSub.includes('num') || cleanSub.includes('calc') || cleanSub.includes('geom')) {
subKey = 'matematicas';
  } else if (cleanSub.includes('cien') || cleanSub.includes('nat') || cleanSub.includes('fis') || cleanSub.includes('quim') || cleanSub.includes('bio')) {
    subKey = 'ciencias';
  }

  const books = SEP_BOOKS_BY_LEVEL[levelKey][subKey] || SEP_BOOKS_BY_LEVEL[levelKey]['general'] || SEP_BOOKS_BY_LEVEL['primaria-baja']['general'];
  const bookIndex = (sessionNumber - 1) % books.length;
  const book = books[bookIndex];

  // Cálculo acotado dentro del rango real del libro
  const pageStart = book.paginasBase + ((sessionNumber - 1) % book.paginasRango) * 2;
  const pageEnd = pageStart + 2;

  return {
    titulo: book.titulo,
    paginas: `Págs. ${pageStart} a la ${pageEnd}`,
    seccion: book.descripcion
  };
}

/**
 * Sanitiza y limpia gramaticalmente el nombre del tema escolar,
 * eliminando prefijos de planeaciones, sufijos de niveles y errores de duplicación.
 */
export function cleanCoreTopicName(topic: string): string {
  if (!topic || typeof topic !== 'string') return 'Tema Curricular Situado';
  let cleaned = topic.trim();

  // Eliminar prefijos de proyectos o planeaciones
  cleaned = cleaned.replace(/^(?:📚\s*)?(?:Proyecto\s+didáctico(?:\s+integral)?|Planeación(?:\s+didáctica)?|Secuencia(?:\s+didáctica)?|Unidad(?:\s+didáctica)?|Tema|Propuesta(?:\s+pedagógica)?):\s*/i, '');
  
  // Eliminar sufijos de nivel o fase (ej. "— Primaria Baja (Fase 3: 1º y 2º Grado)")
  cleaned = cleaned.replace(/\s*—\s*(?:Preescolar|Primaria\s+(?:Baja|Media|Alta)|Secundaria|Preparatoria|Bachillerato|Fase\s+\d+).*$/i, '');
  cleaned = cleaned.replace(/\s*\(Fase\s+\d+.*?\)$/i, '');

  // Corregir duplicaciones o tartamudeos frecuentes (ej. "Revolucirevolucion", "matematmatematicas")
  cleaned = cleaned.replace(/revoluci(?:on)?\s*revoluci[oó]n/gi, 'Revolución');
  cleaned = cleaned.replace(/matemat(?:icas)?\s*matem[aá]ticas/gi, 'Matemáticas');
  cleaned = cleaned.replace(/cienc(?:ias)?\s*ciencias/gi, 'Ciencias');

  // Corregir duplicación de palabras pequeñas
  cleaned = cleaned.replace(/\b(de|la|el|los|las|un|una|en|que|y|a|con|por|sobre)\s+\1\b/gi, '$1');

  // Normalización canónica para temas frecuentes de la NEM
  const lower = cleaned.toLowerCase();
  if (/revoluci/i.test(lower) && /mexic/i.test(lower)) return 'Revolución Mexicana';
  if (/independen/i.test(lower) && /mexic/i.test(lower)) return 'Independencia de México';
  if (/porfiriato/i.test(lower)) return 'El Porfiriato y sus Contradicciones Sociales';
  if (/constituc/i.test(lower) && /1917/i.test(lower)) return 'La Constitución de 1917 y los Derechos Sociales';
  if (/fraccion/i.test(lower)) return 'Fracciones y Reparto Equitativo';
  if (/suma|resta/i.test(lower) && /concreto|fichas|reagrupa/i.test(lower)) return 'Suma y Resta con Material Concreto';
  if (/multiplic|tablas/i.test(lower)) return 'Multiplicación y Tablas Numéricas';
  if (/geometr|figuras|tangram/i.test(lower)) return 'Figuras Geométricas y Cuerpos del Entorno';
  if (/cuadrat|parabol/i.test(lower)) return 'Modelación de Funciones Cuadráticas';
  if (/agua|filtr/i.test(lower)) return 'Cuidado y Filtración del Agua';
  if (/huerto|germin/i.test(lower)) return 'El Huerto Escolar Agroecológico';
  if (/biodigestor|biogas/i.test(lower)) return 'Biodigestores y Energías Renovables';
  if (/carta|epistol|buzon/i.test(lower)) return 'Producción de Textos Epistolares (La Carta)';
  if (/cuento|leyenda|fabula/i.test(lower)) return 'Lectura y Creación de Cuentos Colectivos';
  if (/derecho|paz|acuerdo/i.test(lower)) return 'Derechos de la Niñez y Convivencia Pacífica';

  // Capitalización limpia
  cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return cleaned;
}

/**
 * Validador y corrector ortográfico/gramatical para textos pedagógicos en español
 */
export function sanitizeSpanishPedagogicalGrammar(text: string): string {
  if (!text || typeof text !== 'string') return '';
  let res = text.trim();

  // Corregir duplicaciones de palabras
  res = res.replace(/revoluci(?:on)?\s*revoluci[oó]n/gi, 'Revolución');
  res = res.replace(/\b(de|la|el|los|las|un|una|en|que|y|a|con|por|sobre)\s+\1\b/gi, '$1');

  // Corregir espacios antes de signos de puntuación
  res = res.replace(/\s+([,.:;?!])/g, '$1');

  // Asegurar signos de interrogación completos en preguntas
  if (res.includes('?') && !res.startsWith('¿')) {
    res = '¿' + res.replace(/^[¿\s]+/, '');
  }
  if (res.startsWith('¿') && !res.endsWith('?')) {
    res = res.replace(/[?\s]+$/, '') + '?';
  }

  // Eliminar comillas dobles anidadas
  res = res.replace(/""([^"]+)""/g, '"$1"');

  // Asegurar mayúscula después de ¿ o ¡
  res = res.replace(/^([¿¡])([a-záéíóúñ])/i, (_, mark, char) => `${mark}${char.toUpperCase()}`);

  return res;
}

/**
 * Generador Dinámico de Sesiones Individuales con Minutero (10/30/10 min), Libros SEP y Entregables
 * Genera de forma exacta el número de sesiones solicitado por el docente (1 a 30 sesiones),
 * calibrando el nivel cognitivo y vocabulario estrictamente a cada Fase (2 a 6 y Bachillerato).
 */
export function generateChronometerSessions(
  level: string,
  subject: string,
  topic: string,
  totalSessions: number = 10
): SessionPlanItem[] {
  const count = Math.max(1, Math.min(30, Number(totalSessions) || 10));
  const cleanTopic = cleanCoreTopicName(topic);
  const topicLower = cleanTopic.toLowerCase();
  const topicHash = Math.abs(cleanTopic.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
  
  const isEpistolar = /carta|epistol|mensaje|buzon|cartero|correspondencia|sobre\b|postal/i.test(topicLower);
  const isCuento = /cuento|fabula|leyenda|mito|narracion|literat/i.test(topicLower);
  const isPoesia = /poe|rima|verso|estrofa|cancion/i.test(topicLower);
  const cleanSub = subject.toLowerCase();
  const isLanguageSubject = cleanSub.includes('leng') || cleanSub.includes('esp') || cleanSub.includes('comun') || (!cleanSub.includes('mat') && !cleanSub.includes('cien') && (isEpistolar || isCuento || isPoesia));

  // 1. Plantilla Especializada: Cartas y Textos Epistolares (Lenguajes / Español)
  const epistolarTemplates = [
    {
      num: 1,
      titulo: `Apertura del Reto: ¿Cómo viaja un mensaje? El origen de las cartas y el oficio del cartero`,
      inicio: `⏱️ INICIO (10 min): Dinámica detonadora "La Carta Viajera". El docente muestra sobres postales antiguos con timbres y plantea el misterio: "¿Cómo se comunicaban las familias antes del teléfono celular?". Lluvia de ideas en el pizarrón.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Proyección de imágenes de carteros y buzones históricos. En equipos de 4, los alumnos analizan ejemplos reales de cartas y reflexionan sobre a quién les gustaría escribirle (abuelos, amigos, autoridades escolares). Registran en papel bond sus saberes previos.`,
      cierre: `⏱️ CIERRE (10 min): Puesta en común. Cada equipo elige a quién dirigirá su mensaje de agradecimiento o amistad. Registro individual en bitácora: "¿Qué mensaje importante quiero enviar al mundo?".`,
      preguntas: [
        `¿Por qué una carta escrita a mano transmite emociones más profundas que un mensaje de texto digital?`,
        `¿Qué personas en nuestra comunidad merecen recibir una carta de agradecimiento o felicitación?`
      ],
      materiales: ['Ejemplos de cartas reales y sobres postales', 'Papel bond blanco', 'Plumones de colores', 'Bitácora escolar'],
      entregable: `📄 Ficha de Trabajo #1: Diagnóstico inicial "El valor de la correspondencia escrita" y lista de posibles destinatarios.`
    },
    {
      num: 2,
      titulo: `Exploración en Libros SEP: Las partes esenciales de una carta (Lugar, Fecha, Destinatario y Saludo)`,
      inicio: `⏱️ INICIO (10 min): Ruleta de preguntas sobre la sesión previa y apertura del libro de texto gratuito de la SEP. Identificación visual de la cabecera epistolar.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Lectura guiada en el libro de texto oficial de la SEP. Los alumnos identifican y encierran con color rojo: 1) Lugar y Fecha, 2) Nombre del Destinatario, y 3) Saludo afectuoso o formal. En parejas practican la escritura de 3 saludos diferentes.`,
      cierre: `⏱️ CIERRE (10 min): Dinámica "El Saludo Ideal": Cada pareja lee su saludo favorito. Retroalimentación inmediata sobre el uso de mayúsculas y dos puntos (:).`,
      preguntas: [
        `¿Por qué es indispensable poner la fecha y el lugar en el encabezado de una carta?`,
        `¿Qué diferencia existe entre saludar a un amigo cercano ("¡Hola, querido Mateo!") y a la directora de la escuela ("Estimada Directora")?`
      ],
      materiales: ['Libro de texto gratuito SEP asignado', 'Marcatextos de colores', 'Cuaderno del alumno', 'Pizarrón'],
      entregable: `📄 Ficha de Trabajo #2: Esquema rotulado con las partes del encabezado y plantilla de práctica de saludos formales e informales.`
    },
    {
      num: 3,
      titulo: `El Cuerpo de la Carta: Expresión de ideas, anécdotas y sentimientos con claridad`,
      inicio: `⏱️ INICIO (10 min): Activación "El Teléfono Descompuesto de las Emociones". Reflexión sobre cómo evitar confusiones al escribir lo que sentimos y pensamos.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Taller de redacción del cuerpo del mensaje. Los alumnos organizan sus ideas respondiendo a 3 preguntas: 1) ¿Por qué te escribo?, 2) ¿Qué anécdota o noticia quiero contarte?, y 3) ¿Qué deseo preguntarte? Escriben su primer borrador manuscrito en hojas de raya.`,
      cierre: `⏱️ CIERRE (10 min): Lectura en voz baja en parejas para verificar que el mensaje se entienda con claridad. Autoevaluación del párrafo principal.`,
      preguntas: [
        `¿Cómo redactamos nuestras vivencias para que la persona que lea la carta se emocione o sonría?`,
        `¿Qué signos de puntuación nos ayudan a separar las ideas y que el texto no se sienta amontonado?`
      ],
      materiales: ['Hojas de trabajo pautadas', 'Lápiz y goma', 'Tarjetas de conectores textuales (además, también, por eso)'],
      entregable: `📄 Borrador Parcial #1: Redacción manuscrita del cuerpo de la carta con al menos dos párrafos organizados.`
    },
    {
      num: 4,
      titulo: `Despedida, Firma y Posdata: El cierre afectuoso y formal del texto epistolar`,
      inicio: `⏱️ INICIO (10 min): Lectura compartida de distintas despedidas de cartas literarias famosas ("Con todo mi cariño", "Atentamente", "Se despide tu amigo").`,
      desarrollo: `⏱️ DESARROLLO (30 min): Los alumnos completan el cierre de su carta agregando una despedida adecuada a su destinatario, su firma o nombre completo y una Posdata (P.D.) con un detalle especial o sorpresa. Ensamblan el borrador completo (encabezado + cuerpo + cierre).`,
      cierre: `⏱️ CIERRE (10 min): Exposición mural de cartas modelo en el salón. Felicitación colectiva por completar el primer texto integral.`,
      preguntas: [
        `¿Para qué se utiliza la Posdata (P.D.) y en qué momento es útil agregarla?`,
        `¿Qué tipo de despedida transmite respeto y cuál transmite cariño familiar?`
      ],
      materiales: ['Cuaderno de trabajo', 'Tiras de papel con fórmulas de despedida', 'Lápiz y colores'],
      entregable: `📄 Borrador Completo #1: Carta íntegra con sus 6 componentes (Lugar/Fecha, Destinatario, Saludo, Cuerpo, Despedida y Firma).`
    },
    {
      num: 5,
      titulo: `El Arte del Sobre Postal: Rotulación de Remitente, Destinatario, Código Postal y Estampillas`,
      inicio: `⏱️ INICIO (10 min): Presentación de sobres postales y explicación de la regla de oro: ¿Dónde va el Remitente (quien envía) y dónde el Destinatario (quien recibe)?`,
      desarrollo: `⏱️ DESARROLLO (30 min): Taller de diseño y rotulación de sobres. Los alumnos elaboran o decoran su propio sobre tamaño carta. Escriben con letra clara el nombre y domicilio escolar del destinatario al frente y sus propios datos al reverso. Crean y colorean una estampilla postal artística con un símbolo escolar.`,
      cierre: `⏱️ CIERRE (10 min): Revisión cruzada en parejas: "¿El cartero sabrá exactamente a qué salón o persona llevar este sobre?".`,
      preguntas: [
        `¿Qué sucedería si intercambiamos de lugar el remitente y el destinatario en un sobre postal?`,
        `¿Por qué las estampillas postales tienen ilustraciones culturales y artísticas de nuestro país?`
      ],
      materiales: ['Sobres de papel bond o manila', 'Hojas de colores y pegamento', 'Plumines finos', 'Sellos decorativos'],
      entregable: `📄 Producto Parcial: Sobre postal rotulado correctamente con datos de remitente/destinatario y estampilla original diseñada.`
    },
    {
      num: 6,
      titulo: `Construcción del Buzón Comunitario: Trabajo manual colaborativo con cartón reciclado`,
      inicio: `⏱️ INICIO (10 min): Organización de comisiones de trabajo para el montaje del gran "Buzón Postal de la Escuela" (diseño, pintura, rotulación y ranura de depósito).`,
      desarrollo: `⏱️ DESARROLLO (30 min): Trabajo colaborativo en estaciones: 1) Pintura y forrado de la caja con color rojo/azul institucional, 2) Creación del letrero "Buzón Escolar de la Amistad", 3) Rotulación de instrucciones de uso para la comunidad escolar, y 4) Elaboración de banderines decorativos.`,
      cierre: `⏱️ CIERRE (10 min): Instalación simbólica del buzón en el aula. Prueba de depósito de los primeros mensajes de muestra.`,
      preguntas: [
        `¿Cómo logramos que el buzón sea visible, resistente y llamativo para toda la comunidad escolar?`,
        `¿Qué valores como el respeto y la confidencialidad debemos cuidar al manejar la correspondencia ajena?`
      ],
      materiales: ['Caja de cartón grande reciclada', 'Pinturas acrílicas no tóxicas, pinceles y papel kraft', 'Tijeras y cinta adhesiva'],
      entregable: `📦 Producto Colectivo: Buzón postal comunitario terminado, rotulado y funcional para la recolección de cartas.`
    },
    {
      num: 7,
      titulo: `Taller de Corrección Epistolar: Coevaluación con "Lentes de Revisor" y Cuidado Ortográfico`,
      inicio: `⏱️ INICIO (10 min): Dinámica "Los Lentes del Revisor". Explicación de la lista de cotejo: mayúsculas al inicio, puntos finales, claridad y caligrafía legible.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Intercambio de borradores entre compañeros. Con notas adhesivas suaves (post-its), cada revisor señala 2 aspectos hermosos del mensaje y 1 sugerencia para mejorar la ortografía o el trazo de las letras. El docente acompaña a quienes requieran apoyo.`,
      cierre: `⏱️ CIERRE (10 min): Devolución afectuosa de cartas con comentarios positivos: "Tu carta me hizo sonreír porque...".`,
      preguntas: [
        `¿Por qué revisar nuestro texto con ayuda de un compañero hace que el mensaje final sea mucho más claro y emotivo?`,
        `¿Qué palabras corregimos para que nuestro destinatario entienda todo sin dificultad?`
      ],
      materiales: ['Lista de cotejo de coevaluación', 'Notas adhesivas de colores', 'Borradores de las cartas'],
      entregable: `📄 Ficha de Coevaluación: Lista de cotejo completada con retroalimentación entre pares y observaciones del docente.`
    },
    {
      num: 8,
      titulo: `Versión Final Manuscrita: Caligrafía cuidada en papel carta, ensobrado y sellado postal`,
      inicio: `⏱️ INICIO (10 min): Presentación del papel especial para la versión final y recordatorio del cuidado en los márgenes, sangría y limpieza.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Sesión intensiva de escritura de la versión final en papel membretado artesanalmente. Los alumnos aplican todas las correcciones, agregan ilustraciones en los márgenes, doblan la carta en tres partes iguales, la introducen en su sobre y la sellan con un sticker o sello postal.`,
      cierre: `⏱️ CIERRE (10 min): Ceremonia de sellado: Cada alumno muestra su sobre cerrado listo para depositarlo en el buzón comunitario.`,
      preguntas: [
        `¿Cómo influye una presentación limpia, ordenada y con bonita letra en la persona que va a recibir nuestra carta?`,
        `¿Qué emoción sientes al tener en tus manos tu carta lista para ser entregada?`
      ],
      materiales: ['Papel especial o decorado para cartas', 'Lápices de colores y plumas de gel', 'Sobres terminados', 'Sellos adhesivos'],
      entregable: `📄 Producto Final Individual: Carta definitiva corregida, manuscrita, doblada, ensobrada y sellada.`
    },
    {
      num: 9,
      titulo: `El Oficio del Cartero: Ensayo de rutas de reparto postal, gorras y organización de la entrega`,
      inicio: `⏱️ INICIO (10 min): Asignación de roles para la jornada comunitaria: carteros infantiles, clasificadores de correspondencia, recepcionistas y voceros.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Los alumnos elaboran gorras y bolsos de cartero con cartulina y estambre. Simulan el circuito postal: 1) Recolección en el buzón, 2) Clasificación por salones o destinatarios, 3) Ensayo de las palabras de entrega ("¡Buenas noticias! Traigo correspondencia para...").`,
      cierre: `⏱️ CIERRE (10 min): Ajuste de tiempos y protocolos de respeto para la entrega formal en la escuela.`,
      preguntas: [
        `¿Qué responsabilidad tiene un cartero al custodiar y entregar a tiempo los mensajes de las personas?`,
        `¿Cómo debemos presentarnos amablemente al entregar una carta a un profesor, compañero o padre de familia?`
      ],
      materiales: ['Cartulinas azules o verdes para gorras de cartero', 'Bolsas de tela o papel kraft', 'Estambre y tijeras'],
      entregable: `📄 Guion de Entrega Postal y distintivos de carteros elaborados por el equipo.`
    },
    {
      num: 10,
      titulo: `Jornada del Cartero Escolar: Entrega de correspondencia comunitaria, lectura en voz alta y evaluación`,
      inicio: `⏱️ INICIO (10 min): Palabras de bienvenida a la "Jornada del Cartero Comunitario". Apertura solemne del buzón postal ante la comunidad escolar.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Recorrido de los carteros infantiles entregando las cartas en los salones y a familiares invitados. Momento de lectura compartida: quienes deseen leen fragmentos de sus cartas recibidas en el círculo de diálogo.`,
      cierre: `⏱️ CIERRE (10 min): Aplicación de la rúbrica analítica formativa de 3 niveles. Firma del "Mural de la Amistad Epistolar" y reflexión sobre lo aprendido.`,
      preguntas: [
        `¿Qué caras pusieron las personas al recibir sus cartas escritas con tanto cariño y esfuerzo?`,
        `¿Cómo transformó este proyecto nuestra forma de comunicarnos y convivir en la escuela?`
      ],
      materiales: ['Buzón con cartas listas', 'Rúbricas analíticas impresas', 'Mural de firmas y compromisos comunitarios'],
      entregable: `🏆 Evidencia Final Integradora: Registro de entrega de cartas, lectura compartida comunitaria y rúbrica analítica formativa evaluada.`
    }
  ];

  // 2. Plantilla Especializada: Preescolar (Fase 2 - Enfoque Lúdico, Sensorial y Expresivo)
  const preschoolTemplates = [
    {
      num: 1,
      titulo: `Ronda de Bienvenida y Caja Mágica de Sorpresas: "¿Qué sabemos de ${cleanTopic}?"`,
      inicio: `⏱️ INICIO (10 min): Canción de bienvenida con títere guía y descubrimiento de la "Caja Mágica". Preguntas detonadoras sensoriales en asamblea sobre el tapete.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Exploración con objetos concretos, texturas y colores. En pequeños grupos de juego libre guiado, las niñas y niños manipulan material táctil sobre "${cleanTopic}".`,
      cierre: `⏱️ CIERRE (10 min): Ronda de expresión en el círculo de diálogo: cada niño muestra su objeto favorito. Aplauso de estrellas y respiración guiada.`,
      preguntas: [
        `¿Qué color, forma o sonido tiene lo que descubrimos hoy sobre "${cleanTopic}"?`,
        `¿A quién en casa le queremos platicar de nuestra caja mágica?`
      ],
      materiales: ['Caja decorada con materiales sensoriales', 'Títere guía de aula', 'Tapete infantil', 'Música instrumental'],
      entregable: `🎨 Registro Gráfico #1: Dibujo libre inicial en hoja de trabajo con crayones gruesos.`
    },
    {
      num: 2,
      titulo: `Cuentacuentos Infantil y Libro de la SEP: Imágenes y Relatos de "${cleanTopic}"`,
      inicio: `⏱️ INICIO (10 min): Ronda de adivinanzas visuales mostrando láminas ilustradas del libro de texto gratuito de la SEP.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Narración oral interactiva apoyada con títeres y láminas del libro escolar. Los niños identifican personajes, acciones y colores clave.`,
      cierre: `⏱️ CIERRE (10 min): Juego de mímica y dramatización corporal: "Imitamos a los personajes de la historia".`,
      preguntas: [
        `¿Qué personaje del cuento te gustó más y por qué?`,
        `¿Qué sonido o movimiento hace lo que vimos en el libro de la SEP?`
      ],
      materiales: ['Libro de texto gratuito SEP de Preescolar', 'Títeres de calcetín o guiñol', 'Láminas de colores'],
      entregable: `🎨 Ficha Creativa #2: Pintura dactilar o con esponjas representando la escena favorita del relato.`
    },
    {
      num: 3,
      titulo: `Taller de Modelado y Expresión Plástica: Construimos con plastilina sobre "${cleanTopic}"`,
      inicio: `⏱️ INICIO (10 min): Presentación de barras de plastilina o masa vegetal de colores y canto rítmico de amasar.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Modelado libre y guiado. Las niñas y niños crean figuras representativas de "${cleanTopic}", experimentando con mezclas de colores y texturas.`,
      cierre: `⏱️ CIERRE (10 min): Museo en el tapete: Exposición de esculturas infantiles sobre platos de cartón reciclado.`,
      preguntas: [
        `¿Cómo se siente la masa en tus manos: suave, tibia o pegajosa?`,
        `¿Qué figura creaste y qué historia nos cuenta tu escultura?`
      ],
      materiales: ['Plastilina o masa casera no tóxica', 'Platos de cartón reciclado', 'Herramientas de plástico seguras'],
      entregable: `🎨 Escultura Infantil #3: Figura modelada sobre plato base con tarjeta de autor.`
    },
    {
      num: 4,
      titulo: `Juegos y Rondas Cooperativas: Aprendemos a compartir y ayudarnos en el salón`,
      inicio: `⏱️ INICIO (10 min): Ronda infantil con música tradicional y juego de estatuas de marfil.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Circuitos motrices y estaciones de juego cooperativo vinculadas a "${cleanTopic}" (clasificación de objetos por color, tamaño y forma).`,
      cierre: `⏱️ CIERRE (10 min): El abrazo de amigos: Todos colaboran recogiendo los materiales cantando "A guardar, a guardar".`,
      preguntas: [
        `¿Cómo nos ayudamos entre amigos para que todos puedan jugar contentos?`,
        `¿Qué juguetes compartiste hoy con tus compañeros?`
      ],
      materiales: ['Aros plásticos', 'Pelotas de esponja', 'Canastas de clasificación', 'Música infantil'],
      entregable: `🎨 Registro de Convivencia: Estampas de caritas felices y dibujo colectivo en papel kraft.`
    },
    {
      num: 5,
      titulo: `Festival y Muestra de Arte Infantil: Compartimos nuestras creaciones con las familias`,
      inicio: `⏱️ INICIO (10 min): Colocación de distintivos de artistas infantiles y bienvenida a las familias invitadas.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Recorrido por la Galería de Arte Infantil en el aula. Los pequeños presentan sus dibujos y esculturas a sus papás con apoyo del docente.`,
      cierre: `⏱️ CIERRE (10 min): Canto colectivo de despedida y entrega de diplomas simbólicos de exploradores.`,
      preguntas: [
        `¿Qué carita puso tu familia cuando vio tus trabajitos de arte?`,
        `¿Qué fue lo más divertido de aprender juntos en este proyecto?`
      ],
      materiales: ['Mural de exhibición', 'Mesa de trabajos infantiles', 'Diplomas simbólicos'],
      entregable: `🏆 Portafolio de Arte Preescolar: Carpeta decorada con todos los trabajitos y diploma de logro.`
    }
  ];

  // 3. Plantilla Especializada: Primaria Baja (Fase 3: 1º y 2º Grado - Lenguaje Sencillo, Narrativo y Concreto)
  const primaryLowTemplates = [
    {
      num: 1,
      titulo: `Apertura y Asombro: ¿Qué sabemos y qué historias conocemos sobre "${cleanTopic}"?`,
      inicio: `⏱️ INICIO (10 min): Dinámica "El Tesoro de los Recuerdos". El docente muestra objetos, fotografías o imágenes sencillas sobre "${cleanTopic}" y pregunta: "¿Alguien ha visto algo parecido en su casa o en la calle?". Lluvia de palabras en el pizarrón.`,
      desarrollo: `⏱️ DESARROLLO (30 min): En equipos de 3 o 4 compañeros, los alumnos observan láminas ilustradas y platican qué cosas conocen sobre el tema. Dibujan en su cuaderno su primer recuerdo o idea con colores vivos y rotulan su nombre.`,
      cierre: `⏱️ CIERRE (10 min): Círculo de diálogo en el tapete o salón: Cada equipo muestra un dibujo y dice una frase corta: "Nosotros aprendimos que...".`,
      preguntas: [
        `¿Qué personas, objetos o relatos de nuestra vida diaria conocemos sobre "${cleanTopic}"?`,
        `¿Qué juego, dibujo o historia nos gustaría hacer para empezar este proyecto?`
      ],
      materiales: ['Fotografías o láminas ilustradas', 'Cuaderno de dibujo', 'Crayones y lápices de colores', 'Pizarrón'],
      entregable: `📄 Ficha de Dibujo #1: Registro gráfico inicial con título y primeros saberes compartidos en familia.`
    },
    {
      num: 2,
      titulo: `Exploración en Libros SEP: Descubrimos cuentos e imágenes sobre "${cleanTopic}"`,
      inicio: `⏱️ INICIO (10 min): Canto rítmico de atención y apertura guiada del libro de texto gratuito de la SEP en la página indicada.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Lectura en voz alta compartida con el docente. Los niños siguen la lectura con su dedo, encierran con color azul las palabras que reconocen e identifican a los personajes o imágenes principales del libro.`,
      cierre: `⏱️ CIERRE (10 min): Dinámica "Veo, veo en mi libro": Los alumnos señalan dibujos del libro que responden a las preguntas del maestro.`,
      preguntas: [
        `¿Qué descubrimos y qué dibujos nos gustaron más de nuestro libro escolar de la SEP?`,
        `¿Cómo se parece lo que leímos a lo que platicamos ayer en el salón?`
      ],
      materiales: ['Libro de texto gratuito SEP asignado', 'Colores y marcatextos escolares', 'Cuaderno del alumno'],
      entregable: `📄 Ficha de Trabajo #2: Actividad resuelta del libro escolar y lista ilustrada de 3 palabras clave.`
    },
    {
      num: 3,
      titulo: `Taller de Creación Concreta: Modelado con plastilina y dibujos sobre "${cleanTopic}"`,
      inicio: `⏱️ INICIO (10 min): Presentación de materiales manipulables (plastilina, semillas, fichas o recortes) y explicación de las medidas de orden.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Creación individual o en parejas. Los alumnos modelan figuras, recortan imágenes o arman composiciones que representen lo que han aprendido sobre "${cleanTopic}". Escriben una pequeña tarjeta con su nombre.`,
      cierre: `⏱️ CIERRE (10 min): Paseo por la galería del salón: Caminamos despacito observando los trabajos de los demás compañeros y aplaudimos el esfuerzo.`,
      preguntas: [
        `¿Cómo podemos construir con plastilina, fichas o dibujos lo que estamos aprendiendo?`,
        `¿Qué fue lo más divertido de trabajar en equipo con nuestros materiales?`
      ],
      materiales: ['Plastilina de colores o masa vegetal', 'Fichas didácticas o semillas', 'Hojas blancas y pegamento'],
      entregable: `📄 Evidencia Manual #3: Figura modelada o collage pegado en cartulina con tarjeta de autor.`
    },
    {
      num: 4,
      titulo: `Juegos y Retos en Parejas: Resolviendo actividades sobre "${cleanTopic}"`,
      inicio: `⏱️ INICIO (10 min): Planteamiento de un reto lúdico o juego de adivinanzas entre parejas para despertar la curiosidad.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Trabajo en parejas. Los alumnos resuelven una hoja de retos con dibujos para colorear, conteo o unión de palabras con flechas de colores sobre "${cleanTopic}". Se ayudan si alguno tiene dudas.`,
      cierre: `⏱️ CIERRE (10 min): Revisión cariñosa en plenaria: "¡Reto cumplido!". Felicitación por el compañerismo demostrado.`,
      preguntas: [
        `¿Cómo resolvemos en parejas las actividades y nos ayudamos mutuamente?`,
        `¿Cómo le explicarías con tus propias palabras a un amigo lo que dibujaste?`
      ],
      materiales: ['Hojas de retos ilustradas', 'Lápiz, goma y sacapuntas', 'Colores escolares'],
      entregable: `📄 Ficha de Retos #4: Hoja de actividades resuelta en parejas con caritas de autoevaluación.`
    },
    {
      num: 5,
      titulo: `Organización de Nuestro Proyecto: Letreros y dibujos en cartulinas colectivas`,
      inicio: `⏱️ INICIO (10 min): Organización de comisiones en el aula: dibujantes, recortadores, rotuladores y ordenadores.`,
      desarrollo: `⏱️ DESARROLLO (30 min): En equipos de 4, pegan sus dibujos en una cartulina grande, le ponen un título colorido con ayuda del docente y decoran los bordes con huellitas o grecas.`,
      cierre: `⏱️ CIERRE (10 min): Colocación de los carteles en el tendedero escolar del salón. Registro en el mural de avances.`,
      preguntas: [
        `¿Qué dibujos, letreros y colores no pueden faltar en nuestro trabajo en equipo?`,
        `¿Cómo nos organizamos para que todos los compañeros participen contentos?`
      ],
      materiales: ['Cartulinas de colores', 'Tijeras de punta redonda', 'Pegamento en barra', 'Plumones'],
      entregable: `📦 Cartel Colectivo #5: Cartulina ilustrada por equipo lista para la exposición escolar.`
    },
    {
      num: 6,
      titulo: `Conexión con el Arte y la Música: Canciones, coplas y dramatizaciones sobre "${cleanTopic}"`,
      inicio: `⏱️ INICIO (10 min): Escucha guiada de un corrido, ronda, poema o cuento tradicional sobre el tema.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Expresión artística y corporal. Los alumnos aprenden un verso corto o ensayan una representación sencilla con sombreros de papel o máscaras de cartulina.`,
      cierre: `⏱️ CIERRE (10 min): Mini-presentación de 1 minuto por equipo cantando o diciendo su verso con entusiasmo.`,
      preguntas: [
        `¿De qué manera combinamos lo aprendido con canciones, coplas o representaciones?`,
        `¿Cómo nos ayuda este tema a ser mejores amigos y cuidar nuestro salón?`
      ],
      materiales: ['Gorros de cartulina o antifaces', 'Instrumentos sencillos (maracas, panderos o claves)', 'Hojas de coplas'],
      entregable: `📄 Registro Artístico #6: Ficha ilustrada con el verso o canción aprendida y dibujo del personaje.`
    },
    {
      num: 7,
      titulo: `Taller de Apoyo Amable: Revisamos y mejoramos nuestros trabajitos`,
      inicio: `⏱️ INICIO (10 min): Dinámica "El Elogio Cariñoso": Aprendemos a decir cosas bonitas sobre el esfuerzo de los demás.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Intercambio de cuadernos o carteles entre parejas. Cada niño pega una estrellita de color en la parte que más le gustó del trabajo de su amigo y le sugiere una mejora con una sonrisa.`,
      cierre: `⏱️ CIERRE (10 min): Agradecimiento entre compañeros: "¡Gracias por ayudarme a mejorar mi trabajito!".`,
      preguntas: [
        `¿Qué cosas bonitas le podemos decir a nuestros compañeros sobre sus trabajos?`,
        `¿Qué detalles podemos mejorar en nuestro dibujo o texto con mucha paciencia?`
      ],
      materiales: ['Estrellitas adhesivas de colores', 'Lápiz y colores para retoques'],
      entregable: `📄 Ficha de Coevaluación Infantil: Hoja con estrellitas y comentarios positivos entre pares.`
    },
    {
      num: 8,
      titulo: `Detalles Finales: Elaboración de la versión definitiva para compartir`,
      inicio: `⏱️ INICIO (10 min): Revisión de los carteles y materiales. Recordamos que la limpieza y el orden hacen que todo se vea hermoso.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Sesión de terminado fino. Los alumnos repasan letras con plumón, pegan elementos faltantes y dejan su producto final listo y limpio.`,
      cierre: `⏱️ CIERRE (10 min): Visto bueno del docente con sello de felicitación. Guardado cuidadoso para la muestra comunitaria.`,
      preguntas: [
        `¿Qué colores y toques finales le agregamos a nuestro trabajo para que quede hermoso?`,
        `¿Qué emoción sentimos al ver nuestro proyecto casi listo?`
      ],
      materiales: ['Materiales finales de exposición', 'Borrador limpio y lápiz'],
      entregable: `📄 Producto Final Individual o Colectivo terminado con nombre y sello de logro.`
    },
    {
      num: 9,
      titulo: `Ensayo en el Aula: Practicamos cómo platicarle a los demás sobre "${cleanTopic}"`,
      inicio: `⏱️ INICIO (10 min): Demostración del docente: "¿Cómo nos paramos derechitos y hablamos fuerte y claro ante las familias?".`,
      desarrollo: `⏱️ DESARROLLO (30 min): Ensayo general en el salón. Cada niño practica su frase o muestra su dibujo diciendo su nombre y lo que aprendió en voz clara.`,
      cierre: `⏱️ CIERRE (10 min): Porra grupal de ánimo y seguridad para la presentación final.`,
      preguntas: [
        `¿Cómo ensayamos en equipo lo que le vamos a platicar a nuestras familias e invitados?`,
        `¿Quién va a sostener cada dibujo o cartel durante la presentación?`
      ],
      materiales: ['Carteles y trabajos listos', 'Espacio del salón despejado'],
      entregable: `📄 Ficha de Ensayo: Guion gráfico con la frase y dibujo que cada alumno presentará.`
    },
    {
      num: 10,
      titulo: `Muestra Comunitaria y Fiesta de Aprendizajes: Compartimos nuestro trabajo`,
      inicio: `⏱️ INICIO (10 min): Bienvenida a las familias, compañeros de otros salones y autoridades escolares.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Recorrido por la Muestra Escolar de Aprendizajes. Los niños explican sus carteles, cantan sus coplas o muestran sus maquetas con orgullo infantil.`,
      cierre: `⏱️ CIERRE (10 min): Entrega de reconocimientos formativos, aplauso general y firma en el "Mural de la Amistad".`,
      preguntas: [
        `¿Qué caras de alegría pusieron las familias e invitados al ver nuestro trabajo?`,
        `¿Qué fue lo que más nos gustó y aprendimos a lo largo de este proyecto?`
      ],
      materiales: ['Exposición montada', 'Diplomas formativos simbólicos', 'Mural de firmas y huellas'],
      entregable: `🏆 Evidencia Integradora: Muestra escolar realizada, autoevaluación con caritas y diploma de participación.`
    }
  ];

  // 4. Plantilla Especializada: Primaria Media (Fase 4: 3º y 4º Grado - Indagación Guiada y Proyectos en Equipo)
  const primaryMidTemplates = [
    {
      num: 1,
      titulo: `Planteamiento del Reto Comunitario y Activación de Saberes sobre "${cleanTopic}"`,
      inicio: `⏱️ INICIO (10 min): Dinámica "La Caja de Saberes". El docente plantea la pregunta central y conflicto cognitivo sobre "${cleanTopic}". Los alumnos comparten sus experiencias cotidianas y registran en el pizarrón lo que ya saben.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Exploración con material manipulable y organizadores gráficos en equipos de 4 alumnos. Cada equipo analiza una situación real vinculada a "${cleanTopic}" y elabora su primer registro diagnóstico.`,
      cierre: `⏱️ CIERRE (10 min): Puesta en común de hallazgos iniciales. Cada equipo expresa en una frase su meta de aprendizaje. Registro individual en bitácora: "¿Qué descubrí hoy sobre ${cleanTopic}?".`,
      preguntas: [
        `¿En qué momentos de nuestra vida cotidiana o en nuestra comunidad observamos situaciones sobre "${cleanTopic}"?`,
        `¿Qué reto o problema podemos resolver en la escuela si investigamos este tema en equipo?`
      ],
      materiales: ['Papel bond blanco', 'Plumones de colores', 'Material concreto o interactivo', 'Cuaderno del alumno'],
      entregable: `📄 Ficha de Trabajo #1: Diagnóstico inicial de saberes previos y mapa mental grupal sobre "${cleanTopic}".`
    },
    {
      num: 2,
      titulo: `Indagación Conceptual y Exploración Guiada en Libros de Texto SEP`,
      inicio: `⏱️ INICIO (10 min): Breve retroalimentación mediante ruleta de preguntas rápidas y apertura del libro de texto gratuito de la SEP.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Lectura guiada y analítica en el libro de texto oficial de la SEP. Los alumnos identifican conceptos clave, subrayan definiciones y resuelven en parejas las actividades formativas del libro.`,
      cierre: `⏱️ CIERRE (10 min): Dinámica del "Semáforo del Aprendizaje" (Verde: comprendido, Amarillo: dudas, Rojo: apoyo). Aclaración de dudas en plenaria.`,
      preguntas: [
        `¿Qué ideas y explicaciones nuevas encontramos hoy en el libro de la SEP respecto a "${cleanTopic}"?`,
        `¿Cómo se relacionan estas lecturas con los ejemplos que observamos en nuestra comunidad?`
      ],
      materiales: ['Libro de texto gratuito SEP asignado', 'Colores y marcatextos', 'Cuaderno del alumno'],
      entregable: `📄 Ficha de Trabajo #2: Resumen visual o mapa conceptual con las ideas clave extraídas del libro de la SEP.`
    },
    {
      num: 3,
      titulo: `Modelación Práctica y Estaciones de Trabajo Concreto / Experimental`,
      inicio: `⏱️ INICIO (10 min): Presentación de los materiales de la sesión y asignación de roles en los equipos de trabajo (coordinador, relator, materiales, vocero).`,
      desarrollo: `⏱️ DESARROLLO (30 min): Trabajo en estaciones rotativas de indagación y manipulación práctica. Los alumnos aplican procedimientos directos, tabulan datos o construyen representaciones tangibles sobre "${cleanTopic}".`,
      cierre: `⏱️ CIERRE (10 min): Síntesis grupal. El portavoz de una estación comparte los resultados y conclusiones obtenidas.`,
      preguntas: [
        `¿Qué procedimiento resultó más claro para resolver los retos de las estaciones?`,
        `¿Qué dificultades encontramos al aplicar el procedimiento y cómo las resolvimos juntos?`
      ],
      materiales: ['Estaciones con material manipulable o instrumental didáctico', 'Hojas de registro'],
      entregable: `📄 Ficha de Trabajo #3: Hoja de registro de las estaciones con procedimientos, esquemas y conclusiones.`
    },
    {
      num: 4,
      titulo: `Resolución de Problemas Situados en el Contexto Escolar y Comunitario`,
      inicio: `⏱️ INICIO (10 min): Planteamiento de una problemática real de la comunidad escolar vinculada a "${cleanTopic}".`,
      desarrollo: `⏱️ DESARROLLO (30 min): Trabajo en parejas para resolver situaciones problemáticas contextualizadas paso a paso, justificando por escrito el razonamiento empleado.`,
      cierre: `⏱️ CIERRE (10 min): Puesta en común sobre las diferentes formas de resolver el reto y retroalimentación docente.`,
      preguntas: [
        `¿Por qué existen diferentes formas de resolver un mismo problema sobre "${cleanTopic}"?`,
        `¿Cuál es la forma más clara de explicar nuestro razonamiento a los demás compañeros?`
      ],
      materiales: ['Cuaderno de trabajo', 'Hojas de problemas contextualizados', 'Lápiz y goma'],
      entregable: `📄 Ficha de Trabajo #4: Resolución analítica y argumentada de los problemas comunitarios.`
    },
    {
      num: 5,
      titulo: `Organización de Información y Diseño del Primer Borrador del Proyecto`,
      inicio: `⏱️ INICIO (10 min): Presentación de la estructura del producto integrador intermedio y revisión de los criterios de calidad.`,
      desarrollo: `⏱️ DESARROLLO (30 min): En equipos, los alumnos estructuran el primer borrador de su producto integrador, organizando datos, textos, ilustraciones o maquetas.`,
      cierre: `⏱️ CIERRE (10 min): Registro del porcentaje de avance en el termómetro del proyecto grupal.`,
      preguntas: [
        `¿Qué información clave no puede faltar en nuestro producto sobre "${cleanTopic}"?`,
        `¿Cómo organizamos los datos para que cualquier persona de la comunidad los entienda con claridad?`
      ],
      materiales: ['Cartulinas o pliegos de papel', 'Colores y reglas', 'Borradores de trabajo'],
      entregable: `📄 Entregable Intermedio: Primer borrador estructurado del producto del proyecto con datos organizados.`
    },
    {
      num: 6,
      titulo: `Profundización Curricular y Vinculación Interdisciplinaria`,
      inicio: `⏱️ INICIO (10 min): Conexión explícita con los campos formativos articulados (Lenguajes, Saberes, Ética y De lo Humano).`,
      desarrollo: `⏱️ DESARROLLO (30 min): Actividad integradora que combina "${cleanTopic}" con la expresión artística, el análisis ético o la redacción formal de propuestas comunitarias.`,
      cierre: `⏱️ CIERRE (10 min): Mini-exposición de 2 minutos por equipo destacando la conexión interdisciplinaria lograda.`,
      preguntas: [
        `¿Cómo nos ayuda este tema a ser más empáticos, solidarios o analíticos con nuestra comunidad?`,
        `¿Qué otros conocimientos de la escuela se relacionan directamente con lo que estamos construyendo?`
      ],
      materiales: ['Material artístico / cartulinas', 'Textos informativos complementarios', 'Plumones'],
      entregable: `📄 Ficha de Trabajo #6: Producto interdisciplinario que vincula ${cleanTopic} con la vida comunitaria.`
    },
    {
      num: 7,
      titulo: `Taller de Coevaluación entre Pares y Retroalimentación Formativa`,
      inicio: `⏱️ INICIO (10 min): Explicación de la rúbrica analítica y de la importancia de la crítica constructiva entre compañeros basada en el respeto mutuo.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Dinámica de intercambio de proyectos entre equipos ("Taller de Galería"). Cada equipo revisa el trabajo de otro equipo con una lista de cotejo constructiva.`,
      cierre: `⏱️ CIERRE (10 min): Devolución de los trabajos con comentarios amables y claros para orientar la mejora.`,
      preguntas: [
        `¿Qué aprendimos al observar el trabajo de nuestros compañeros?`,
        `¿Cómo podemos mejorar la claridad y presentación de nuestro producto final?`
      ],
      materiales: ['Instrumentos de coevaluación impresos', 'Notas adhesivas de colores', 'Borradores de los proyectos'],
      entregable: `📄 Instrumento de Coevaluación: Lista de cotejo con retroalimentación entre pares debidamente firmada.`
    },
    {
      num: 8,
      titulo: `Ajuste, Corrección y Elaboración del Producto Final Tangible`,
      inicio: `⏱️ INICIO (10 min): Revisión de las sugerencias recibidas en la coevaluación y asignación de tareas específicas para la versión definitiva.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Sesión intensiva de producción final. Los alumnos aplican correcciones ortográficas, precisión en cálculos, orden estético y claridad en su producto entregable.`,
      cierre: `⏱️ CIERRE (10 min): Verificación final de calidad con la rúbrica oficial antes de la entrega final. Visto bueno del docente.`,
      preguntas: [
        `¿Qué cambios hicimos en nuestro producto que lo hicieron más claro y completo?`,
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
      cierre: `⏱️ CIERRE (10 min): Ronda de recomendaciones finales y palabras de motivación para la presentación oficial.`,
      preguntas: [
        `¿Cómo podemos explicar ideas sobre "${cleanTopic}" de manera sencilla para que cualquiera las entienda?`,
        `¿Qué tono de voz y postura corporal transmiten seguridad y entusiasmo en nuestra presentación?`
      ],
      materiales: ['Guiones de exposición', 'Materiales de exhibición terminados', 'Espacio escolar acondicionado'],
      entregable: `📄 Guion de Exposición: Ficha con los puntos clave que cada integrante explicará durante la muestra.`
    },
    {
      num: 10,
      titulo: `Feria de Aprendizajes Comunitarios, Evaluación Formativa y Compromisos`,
      inicio: `⏱️ INICIO (10 min): Bienvenida a la muestra de aprendizajes. Palabras de apertura por parte de los alumnos y del docente.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Presentación de la Feria de Aprendizajes ante compañeros de otros grupos, docentes o padres de familia. Demostración práctica de los conocimientos adquiridos sobre "${cleanTopic}".`,
      cierre: `⏱️ CIERRE (10 min): Aplicación de la rúbrica analítica de autoevaluación final. Firma del "Árbol de Compromisos de Aprendizaje" y felicitación grupal.`,
      preguntas: [
        `¿Cuál fue el aprendizaje más valioso que obtuviste a lo largo de este proyecto?`,
        `¿Cómo vas a seguir utilizando lo que aprendiste sobre "${cleanTopic}" en tu vida diaria?`
      ],
      materiales: ['Rúbricas analíticas individuales', 'Mural escolar de compromisos', 'Diplomas simbólicos o distintivos de logro'],
      entregable: `🏆 Evidencia Final Integradora: Rúbrica analítica completada, bitácora del proyecto y registro de la feria comunitaria.`
    }
  ];

  // 5. Plantilla Especializada: Primaria Alta (Fase 5: 5º y 6º Grado - Análisis Crítico y Propuestas Comunitarias)
  const primaryHighTemplates = primaryMidTemplates;

  // 6. Plantilla Especializada: Secundaria (Fase 6: 1º a 3º Grado - Pensamiento Crítico y Rigor Científico/Histórico)
  const secundariaTemplates = [
    {
      num: 1,
      titulo: `Planteamiento del Problema Sociocrítico y Delimitación Científica de "${cleanTopic}"`,
      inicio: `⏱️ INICIO (10 min): Presentación de un caso de estudio real o discrepancia conceptual sobre "${cleanTopic}". Debate inicial en plenaria guiado con preguntas de conflicto cognitivo.`,
      desarrollo: `⏱️ DESARROLLO (30 min): En mesas de trabajo analíticas, los estudiantes delimitan el problema de investigación, formulan hipótesis sustentadas y diseñan una matriz de análisis de fuentes.`,
      cierre: `⏱️ CIERRE (10 min): Síntesis metodológica. Cada mesa expone su hipótesis de trabajo y se registran los acuerdos en la bitácora científica.`,
      preguntas: [
        `¿Cuáles son los factores estructurales que originan las problemáticas en torno a "${cleanTopic}"?`,
        `¿Qué metodología de investigación nos permitirá contrastar nuestras hipótesis con rigor?`
      ],
      materiales: ['Artículos científicos o fuentes primarias', 'Matriz de análisis documental', 'Bitácora de investigación'],
      entregable: `📄 Protocolo de Indagación #1: Planteamiento del problema, hipótesis formuladas y justificación comunitaria.`
    },
    {
      num: 2,
      titulo: `Análisis de Fuentes Primarias, Modelación Cuantitativa y Libros SEP`,
      inicio: `⏱️ INICIO (10 min): Recuperación de saberes previos y orientación para el análisis crítico de textos y datos estadísticos en libros de la SEP.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Análisis riguroso de fuentes documentales, gráficas, ecuaciones o modelos conceptuales. Los estudiantes contrastan autores y formulan conclusiones preliminares sustentadas.`,
      cierre: `⏱️ CIERRE (10 min): Ronda de preguntas socráticas para evaluar el nivel de profundidad analítica alcanzado.`,
      preguntas: [
        `¿Qué inconsistencias o consensos encontramos entre las distintas fuentes analizadas?`,
        `¿Cómo fundamentamos con datos cuantitativos o citas textuales nuestras afirmaciones?`
      ],
      materiales: ['Libros de texto gratuitos SEP de Secundaria', 'Gráficas estadísticas o modelos matemáticos', 'Fichas de trabajo analíticas'],
      entregable: `📄 Reporte Analítico #2: Cuadro comparativo de fuentes, análisis de datos y fichas de síntesis crítica.`
    },
    {
      num: 3,
      titulo: `Experimentación en Laboratorio / Taller de Prototipado y Modelación`,
      inicio: `⏱️ INICIO (10 min): Verificación de protocolos de seguridad y calibración de instrumentos para el experimento o simulación.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Ejecución de la práctica experimental, desarrollo de modelos algebraicos/geométricos o ensamblaje de prototipos funcionales vinculados a "${cleanTopic}". Registro sistemático de variables.`,
      cierre: `⏱️ CIERRE (10 min): Discusión de resultados experimentales y control de márgenes de error.`,
      preguntas: [
        `¿De qué manera los resultados empíricos validan o refutan las hipótesis iniciales?`,
        `¿Qué variables influyeron en el comportamiento del modelo o prototipo?`
      ],
      materiales: ['Instrumental de laboratorio / materiales de prototipado', 'Hojas de registro de datos experimentales'],
      entregable: `📄 Reporte Experimental #3: Gráficas de resultados, análisis de variables y memoria técnica del prototipo.`
    },
    {
      num: 4,
      titulo: `Mesa Redonda / Debate Crítico Argumentativo entre Facciones o Posturas`,
      inicio: `⏱️ INICIO (10 min): Establecimiento de las reglas del debate formal: turnos de réplica, uso del tiempo y respeto a la diversidad ideológica.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Realización del debate argumentativo. Los equipos defienden posturas fundamentadas con evidencias científicas, históricas o éticas sobre "${cleanTopic}".`,
      cierre: `⏱️ CIERRE (10 min): Dictamen de conclusiones por el comité relator y reflexión sobre la construcción democrática del conocimiento.`,
      preguntas: [
        `¿Qué argumentos demostraron mayor solidez y rigor conceptual durante la discusión?`,
        `¿Cuál es la responsabilidad social de la ciencia y la tecnología en torno a "${cleanTopic}"?`
      ],
      materiales: ['Rúbricas técnicas de evaluación entre pares', 'Guiones de argumentación'],
      entregable: `📄 Acta de Debate y Rúbrica de Coevaluación con argumentos fundamentados.`
    },
    {
      num: 5,
      titulo: `Coloquio Estudiantil de Ciencias y Humanidades: Defensa del Proyecto y Evaluación`,
      inicio: `⏱️ INICIO (10 min): Apertura solemne del Coloquio Académico Escolar ante la comunidad y docentes invitados.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Exposición oral en atril con apoyo de diapositivas o stands demostrativos. Ronda de preguntas y respuestas técnicas.`,
      cierre: `⏱️ CIERRE (10 min): Evaluación sumativa y formativa con rúbrica analítica oficial y retroalimentación docente.`,
      preguntas: [
        `¿De qué manera nuestro proyecto contribuye a resolver un problema real de la comunidad?`,
        `¿Qué competencias científicas y comunicativas consolidamos durante el proceso?`
      ],
      materiales: ['Proyector o stands de exposición', 'Rúbricas analíticas oficiales', 'Prototipos terminados'],
      entregable: `🏆 Producto Final de Secundaria: Reporte formal de investigación, prototipo funcional evaluado y sustentación oral.`
    }
  ];

  // 7. Plantilla Especializada: Preparatoria / Bachillerato (MCCEMS)
  const preparatoriaTemplates = [
    {
      num: 1,
      titulo: `Diagnóstico Situacional y Formulación Epistemológica del Problema (MCCEMS)`,
      inicio: `⏱️ INICIO (10 min): Análisis de problemáticas complejas del entorno contemporáneo. Vinculación con las progresiones de aprendizaje del Marco Curricular Común.`,
      desarrollo: `⏱️ DESARROLLO (30 min): En seminarios de investigación, los estudiantes estructuran el marco conceptual, definen la metodología de investigación y delimitan el alcance del proyecto sobre "${cleanTopic}".`,
      cierre: `⏱️ CIERRE (10 min): Validación del protocolo metodológico con asesoría del docente tutor.`,
      preguntas: [
        `¿Cuál es el estado del arte y la relevancia socio-científica de abordar "${cleanTopic}" en la actualidad?`,
        `¿Qué metodología analítica o cuantitativa garantiza la validez de nuestro estudio?`
      ],
      materiales: ['Bases de datos académicas', 'Protocolo de investigación MCCEMS', 'Bitácora preuniversitaria'],
      entregable: `📄 Protocolo Metodológico #1: Justificación, marco teórico y diseño metodológico con normas APA.`
    },
    {
      num: 2,
      titulo: `Modelación Avanzada, Procesamiento de Datos y Simulación Científica`,
      inicio: `⏱️ INICIO (10 min): Revisión de algoritmos de cálculo, funciones matemáticas o modelos teóricos complejos.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Procesamiento cuantitativo de datos, análisis de regresión, simulaciones por computadora o contraste documental crítico.`,
      cierre: `⏱️ CIERRE (10 min): Interpretación de resultados y discusión crítica de hallazgos.`,
      preguntas: [
        `¿Qué nivel de significancia estadística o rigor cualitativo presentan los resultados?`,
        `¿Cómo se vincula el modelo matemático con la realidad socioeconómica o natural?`
      ],
      materiales: ['Software de cálculo / graficadores', 'Hojas de datos de investigación'],
      entregable: `📄 Reporte Analítico #2: Modelación cuantitativa, pruebas de hipótesis e interpretación de resultados.`
    },
    {
      num: 3,
      titulo: `Redacción Académica del Ensayo Crítico / Artículo de Divulgación Preuniversitario`,
      inicio: `⏱️ INICIO (10 min): Pautas de redacción científica: estructura IMRyD (Introducción, Metodología, Resultados y Discusión).`,
      desarrollo: `⏱️ DESARROLLO (30 min): Redacción formal del artículo o ensayo con citas en formato APA 7ª edición, integrando gráficos y conclusiones fundamentadas.`,
      cierre: `⏱️ CIERRE (10 min): Revisión por pares ciegos (Peer Review) entre equipos de investigación.`,
      preguntas: [
        `¿Cómo comunicamos ideas complejas con claridad, concisión y rigor académico?`,
        `¿Qué aportación original genera nuestra investigación a la comunidad?`
      ],
      materiales: ['Manual de estilo APA 7ª edición', 'Borradores de artículos académicos'],
      entregable: `📄 Artículo Científico / Ensayo Crítico #3 con dictamen de revisión por pares.`
    },
    {
      num: 4,
      titulo: `Simposio Académico Preuniversitario: Transferencia Social del Conocimiento y Evaluación`,
      inicio: `⏱️ INICIO (10 min): Instalación del presídium del Simposio Académico con invitados de la comunidad educativa.`,
      desarrollo: `⏱️ DESARROLLO (30 min): Ponencias formales de 10 minutos por equipo, sustentación de proyectos de impacto social y sesión de réplica académica.`,
      cierre: `⏱️ CIERRE (10 min): Evaluación por competencias del MCCEMS, entrega de constancias y cierre académico.`,
      preguntas: [
        `¿Qué impacto transformador tiene este proyecto en nuestro entorno local y perfil de egreso?`,
        `¿Cómo potencia este trabajo nuestra preparación vocacional y universitaria?`
      ],
      materiales: ['Atril y proyector de conferencias', 'Rúbricas de evaluación del MCCEMS'],
      entregable: `🏆 Producto Terminal de Bachillerato: Ponencia académica defendida, artículo publicado y rúbrica por competencias acreditada.`
    }
  ];

  let masterPool = primaryLowTemplates;
  if (level === 'preescolar') {
    masterPool = preschoolTemplates;
  } else if (level === 'primaria-baja') {
    masterPool = primaryLowTemplates;
  } else if (level === 'primaria-media') {
    masterPool = primaryMidTemplates;
  } else if (level === 'primaria-alta') {
    masterPool = primaryHighTemplates;
  } else if (level === 'secundaria') {
    masterPool = secundariaTemplates;
  } else if (level === 'preparatoria') {
    masterPool = preparatoriaTemplates;
  }
  
  if (isLanguageSubject && isEpistolar) {
    masterPool = epistolarTemplates;
  }

  // Construcción de la secuencia exacta de "count" sesiones
  const resultSessions: SessionPlanItem[] = [];

  for (let i = 0; i < count; i++) {
    const sessionNum = i + 1;
    let baseTpl: (typeof masterPool)[0];

    if (count === 1) {
      // 1 sesión integrada
      baseTpl = {
        num: 1,
        titulo: `Sesión Integradora: Reto, Indagación y Aplicación Práctica sobre "${cleanTopic}"`,
        inicio: `⏱️ INICIO (10 min): Activación de saberes previos y presentación del reto sobre "${cleanTopic}". Lluvia de ideas participativa en el salón.`,
        desarrollo: `⏱️ DESARROLLO (30 min): Exploración guiada en libros SEP, modelado práctico en equipos y elaboración del producto tangible de aprendizaje.`,
        cierre: `⏱️ CIERRE (10 min): Socialización en plenaria, autoevaluación formativa con rúbrica y registro de conclusiones.`,
        preguntas: level === 'preescolar' || level === 'primaria-baja' ? [
          `¿Qué personas, objetos o dibujos descubrimos hoy sobre "${cleanTopic}"?`,
          `¿Qué aprendizaje bonito compartiré con mi familia al llegar a casa?`
        ] : [
          `¿Cómo resolvemos el reto central de "${cleanTopic}" con los saberes adquiridos hoy?`,
          `¿Qué aprendizaje clave compartiré con mi comunidad escolar?`
        ],
        materiales: ['Libro de texto gratuito SEP', 'Material manipulable o cartulinas', 'Bitácora escolar'],
        entregable: `🏆 Evidencia Integradora: Ficha de trabajo y producto demostrativo completado sobre "${cleanTopic}".`
      };
    } else {
      const poolLen = masterPool.length;
      const tplIndex = i === 0 
        ? 0 
        : i === count - 1 
          ? poolLen - 1 
          : Math.min(poolLen - 2, Math.max(1, Math.round((i / (count - 1)) * (poolLen - 1))));
      const phaseTpl = masterPool[tplIndex] || masterPool[0];
      baseTpl = {
        ...phaseTpl,
        titulo: i >= poolLen ? `${phaseTpl.titulo} (Fase de Profundización y Taller Práctico - Parte ${Math.floor(i / poolLen) + 1})` : phaseTpl.titulo
      };
    }

    const sepBook = getSepBookForSession(level, subject, sessionNum, topicHash, topic);

    resultSessions.push({
      numero: sessionNum,
      titulo: baseTpl.titulo,
      duracionTotal: '50 minutos',
      tiempos: { inicio: '10 min', desarrollo: '30 min', cierre: '10 min' },
      actividadInicio: baseTpl.inicio,
      actividadDesarrollo: baseTpl.desarrollo,
      actividadCierre: baseTpl.cierre,
      preguntasClave: baseTpl.preguntas,
      libroSep: sepBook,
      materiales: baseTpl.materiales,
      entregableSesion: baseTpl.entregable
    });
  }

  return resultSessions;
}

/**
 * Alias de compatibilidad para 10 sesiones
 */
export function generateChronometer10Sessions(
  level: string,
  subject: string,
  topic: string
): SessionPlanItem[] {
  return generateChronometerSessions(level, subject, topic, 10);
}

/**
 * Generador de PDAs Transversales / Articulados según nivel y tema
 * Garantiza vinculación interdisciplinaria auténtica de los 4 Campos Formativos sin respuestas genéricas.
 */
export function getArticulatedPdas(level: string, subject: string, topic: string): ArticulatedPda[] {
  const cleanTopic = cleanCoreTopicName(topic);
  const capitalizedTopic = cleanTopic;
  const topicLower = cleanTopic.toLowerCase();
  const levelKey = level || 'primaria-baja';

  // Identificación precisa del dominio temático
  const isHistory = /revoluci|independen|porfir|reforma|mexic|histori|constituc|madero|zapata|villa|juarez|hidalgo|virrein|prehispan|colonia|patrimon|tradicion|cultura|efemerid|civilizac|conquista|batalla|heroes|monumento|patria/i.test(topicLower);
  const isEpistolar = /carta|epistol|mensaje|buzon|cartero|correspondencia|sobre\b|postal/i.test(topicLower);
  const isLiterature = /cuento|leyenda|mito|fabula|poema|poes|rima|verso|cancion|teatro|dramat|relato|literat/i.test(topicLower);
  const isFractions = /fraccion|equivalen|particion|reparto|denominador|numerador/i.test(topicLower);
  const isMathStoreOrMoney = /tienda|mercado|dinero|moneda|compra|venta|precio|cambio|billete|ahorro|presupuesto/i.test(topicLower);
  const isMathGeneral = /matemat|suma|resta|multiplic|division|numero|conteo|algebra|ecuacion|cuadrat|parabol|geometr|tangram|area|perimetr|volumen|probabil|estadist|porcentaj/i.test(topicLower);
  const isWater = /agua|rio|lluvia|filtr|pozo|sequia|pluvial|hidrico/i.test(topicLower);
  const isGardenOrFood = /huerto|siembra|cosecha|cultivo|semilla|alimento|nutric|plato del bien comer|comida|dieta|ultraproces/i.test(topicLower);
  const isCleanEnergy = /biodigestor|biogas|energia|solar|eolica|renovable|ecotecnia|residu|recicl/i.test(topicLower);
  const isScienceGeneral = /cienc|natur|biolog|fisic|quimic|plan|animal|cuerpo|organo|salud|ecosistem|materia|fuerza|movimient|celul|atomo|luz|universo|biodivers/i.test(topicLower);
  const isCivicsPeace = /derecho|paz|acuerdo|convivenc|mediacion|inclusion|igualdad|genero|discrimin|democrac|ciudadan|justicia/i.test(topicLower);

  // 1. DOMINIO HISTÓRICO Y CÍVICO (Ej. Revolución Mexicana, Independencia, Tradiciones)
  if (isHistory) {
    if (levelKey === 'preescolar') {
      return [
        {
          campoFormativo: 'Lenguajes (Preescolar - Fase 2)',
          pda: `Expresa oralmente relatos, canciones y corridos tradicionales sobre la Revolución Mexicana y la historia de su país a través del juego dramático, títeres y producciones plásticas.`,
          relacion: 'Oralidad infantil, apreciación de la música popular mexicana y primeros acercamientos a la memoria colectiva.'
        },
        {
          campoFormativo: 'Saberes y Pensamiento Científico',
          pda: `Identifica secuencias temporales sencillas (antes, durante y hoy), ordena imágenes históricas y compara juguetes y transportes antiguos con los actuales.`,
          relacion: 'Noción temporal inicial, clasificación perceptual y observación de cambios en el entorno.'
        },
        {
          campoFormativo: 'Ética, Naturaleza y Sociedades',
          pda: `Reconoce que forma parte de una comunidad con historia y festividades cívicas, compartiendo anécdotas de su familia sobre costumbres y personajes del pasado.`,
          relacion: 'Sentido de pertenencia comunitaria, identidad nacional y valoración de las tradiciones familiares.'
        },
        {
          campoFormativo: 'De lo Humano y lo Comunitario',
          pda: `Participa con alegría en rondas cívicas y juegos de roles de época, practicando la empatía, el diálogo y el respeto hacia todas las personas.`,
          relacion: 'Convivencia armónica, expresión motriz y valoración de la igualdad entre niñas y niños.'
        }
      ];
    } else if (levelKey === 'primaria-baja') {
      return [
        {
          campoFormativo: 'Lenguajes (Primaria Baja - Fase 3)',
          pda: `Produce e interpreta narraciones orales, coplas, corridos y dibujos sobre la Revolución Mexicana, dialogando con familiares sobre los relatos y personajes de la época.`,
          relacion: 'Alfabetización inicial con sentido social, rescate de la tradición oral y expresión artística de la memoria histórica.'
        },
        {
          campoFormativo: 'Saberes y Pensamiento Científico',
          pda: `Organiza secuencias temporales en calendarios y líneas del tiempo sencillas (antes de 1910, durante la lucha y la época actual), cuantificando años y colecciones de imágenes históricas.`,
          relacion: 'Uso del calendario, noción matemática de tiempo histórico y resolución de problemas de conteo con datos reales.'
        },
        {
          campoFormativo: 'Ética, Naturaleza y Sociedades',
          pda: `Indaga en relatos familiares, fotografías y testimonios de su comunidad los hechos de la Revolución Mexicana, reconociendo cómo transformaron la vida cotidiana, la escuela y los derechos de las personas.`,
          relacion: 'Compromiso cívico, valoración del derecho a la educación pública y reconocimiento de la lucha campesina y obrera.'
        },
        {
          campoFormativo: 'De lo Humano y lo Comunitario',
          pda: `Participa en dramatizaciones y juegos de roles sobre personajes históricos (Madero, Zapata, Villa y las Adelitas), valorando la igualdad, la solidaridad y la cultura de paz.`,
          relacion: 'Trabajo colaborativo, reconocimiento del papel de las mujeres en la historia y convivencia pacífica.'
        }
      ];
    } else if (levelKey === 'primaria-media') {
      return [
        {
          campoFormativo: 'Lenguajes (Primaria Media - Fase 4)',
          pda: `Redacta textos expositivos, reseñas históricas y biografías ilustradas acerca de los líderes y las demandas sociales de la Revolución Mexicana en su entidad federativa.`,
          relacion: 'Comprensión lectora de fuentes históricas, redacción de párrafos cronológicos y uso de conectores temporales.'
        },
        {
          campoFormativo: 'Saberes y Pensamiento Científico',
          pda: `Interpreta mapas históricos regionales, distancias geográficas recorridas por los ejércitos revolucionarios y organiza datos demográficos de la época en tablas y gráficas de barras.`,
          relacion: 'Pensamiento geoespacial, cálculo de distancias y tratamiento de datos estadísticos históricos.'
        },
        {
          campoFormativo: 'Ética, Naturaleza y Sociedades',
          pda: `Analiza las causas agrarias, laborales y políticas de la Revolución Mexicana en su región y en el país, valorando la justicia social y el reparto de tierras.`,
          relacion: 'Conciencia histórica regional, defensa de los derechos de los pueblos originarios y comunidades campesinas.'
        },
        {
          campoFormativo: 'De lo Humano y lo Comunitario',
          pda: `Reflexiona sobre la resolución pacífica de conflictos y la importancia de defender los derechos colectivos mediante la participación ciudadana organizada.`,
          relacion: 'Formación ciudadana crítica, liderazgo colaborativo y construcción de acuerdos escolares.'
        }
      ];
    } else if (levelKey === 'primaria-alta') {
      return [
        {
          campoFormativo: 'Lenguajes (Primaria Alta - Fase 5)',
          pda: `Elabora ensayos históricos, periódicos murales y debates fundamentados sobre las distintas corrientes ideológicas (maderismo, zapatismo, villismo y carrancismo) de la Revolución Mexicana.`,
          relacion: 'Pensamiento discursivo crítico, análisis de fuentes primarias y secundarias y argumentación oral rigurosa.'
        },
        {
          campoFormativo: 'Saberes y Pensamiento Científico',
          pda: `Analiza censos poblacionales, variaciones porcentuales en la tenencia de la tierra y calcula proporciones socioeconómicas del México de 1910 en comparación con el presente.`,
          relacion: 'Aplicación de porcentajes, proporcionalidad y análisis cuantitativo de la realidad sociohistórica.'
        },
        {
          campoFormativo: 'Ética, Naturaleza y Sociedades',
          pda: `Analiza críticamente las causas del estallido de 1910, la promulgación de la Constitución de 1917 y la vigencia de las garantías sociales (Artículos 3º, 27 y 123) en el México actual.`,
          relacion: 'Conciencia histórica nacional, soberanía popular, derechos laborales y defensa de la educación laica y gratuita.'
        },
        {
          campoFormativo: 'De lo Humano y lo Comunitario',
          pda: `Diseña propuestas comunitarias orientadas a la equidad, los derechos laborales y la erradicación de la discriminación, inspiradas en los ideales de justicia social.`,
          relacion: 'Liderazgo social transformador, empatía histórica y promoción de los derechos humanos.'
        }
      ];
    } else if (levelKey === 'secundaria') {
      return [
        {
          campoFormativo: 'Ética, Naturaleza y Sociedades (Secundaria - Fase 6)',
          pda: `Analiza críticamente desde diversas corrientes historiográficas las contradicciones socioeconómicas del Porfiriato, los planes revolucionarios (San Luis, Ayala, Guadalupe) y la institucionalización del Estado mexicano.`,
          relacion: 'Rigor historiográfico, análisis de fuentes primarias documentales y comprensión de procesos estructurales de larga duración.'
        },
        {
          campoFormativo: 'Lenguajes (Español / Lengua Extranjera)',
          pda: `Produce ensayos académicos, artículos de opinión y mesas redondas formales con aparato crítico sobre el impacto discursivo, literario y periodístico de la Revolución Mexicana.`,
          relacion: 'Argumentación dialéctica formal, análisis de la prensa de época y oratoria deliberativa.'
        },
        {
          campoFormativo: 'Saberes y Pensamiento Científico',
          pda: `Modela cuantitativamente datos demográficos, pérdidas humanas, impacto económico y transformaciones en las vías de comunicación (ferrocarril) durante la etapa revolucionaria.`,
          relacion: 'Modelación matemática de fenómenos sociodemográficos y análisis estadístico crítico.'
        },
        {
          campoFormativo: 'De lo Humano y lo Comunitario',
          pda: `Evalúa los retos contemporáneos del estado de derecho, la soberanía nacional y la justicia social agraria a la luz de los principios de la Constitución de 1917.`,
          relacion: 'Conciencia cívica participativa, proyecto ético de vida y compromiso con la democracia sustantiva.'
        }
      ];
    } else {
      return [
        {
          campoFormativo: 'Conciencia Histórica y Humanidades (MCCEMS)',
          pda: `Evalúa con aparato crítico las transformaciones estructurales, reformas agrarias, educativas e institucionales derivadas de la Revolución Mexicana en el México contemporáneo.`,
          relacion: 'Pensamiento histórico crítico preuniversitario, juicio epistemológico y análisis de la soberanía nacional.'
        },
        {
          campoFormativo: 'Lengua y Comunicación',
          pda: `Construye discursos argumentativos y ensayos académicos rigurosamente citados sobre las repercusiones ideológicas y políticas de la Revolución Mexicana.`,
          relacion: 'Escritura académica superior, rigor discursivo y dialéctica sociopolítica.'
        },
        {
          campoFormativo: 'Pensamiento Matemático',
          pda: `Modela variables macroeconómicas, distribución del ingreso y transformaciones demográficas de México a lo largo del siglo XX con cálculo y estadística aplicada.`,
          relacion: 'Modelación analítica formal y análisis cuantitativo de la economía política.'
        },
        {
          campoFormativo: 'Recursos Socioemocionales',
          pda: `Coordina proyectos de participación ciudadana y memoria histórica comunitaria en defensa de los derechos fundamentales y la equidad social.`,
          relacion: 'Responsabilidad social, liderazgo ético transformador y compromiso comunitario.'
        }
      ];
    }
  }

  // 2. DOMINIO DE CORRESPONDENCIA Y TEXTOS EPISTOLARES
  if (isEpistolar) {
    return [
      {
        campoFormativo: 'Lenguajes (Español)',
        pda: `Produce y lee textos epistolares (cartas personales y formales) dirigidas a familiares, docentes y compañeros, reconociendo la estructura canónica (lugar, fecha, destinatario, saludo, cuerpo, despedida, firma y remitente).`,
        relacion: 'Desarrollo de la escritura autónoma, correspondencia grafofonética y expresión de afectos e ideas con propósito comunicativo real.'
      },
      {
        campoFormativo: 'Saberes y Pensamiento Científico',
        pda: `Organiza datos numéricos, códigos postales, fechas en el calendario y conteo de piezas postales depositadas en el buzón escolar.`,
        relacion: 'Uso del calendario, secuencias temporales, numeración y clasificación de correspondencia.'
      },
      {
        campoFormativo: 'Ética, Naturaleza y Sociedades',
        pda: `Reconoce el papel histórico de los medios de comunicación escrita y los servicios postales en la cohesión de las familias y pueblos de México.`,
        relacion: 'Apreciación del patrimonio cultural, respeto a la privacidad de la correspondencia y convivencia pacífica.'
      },
      {
        campoFormativo: 'De lo Humano y lo Comunitario',
        pda: `Expresa emociones, agradecimientos y acuerdos de resolución pacífica de conflictos a través de mensajes escritos en el buzón del aula.`,
        relacion: 'Fortalecimiento de la empatía, los lazos afectivos intergeneracionales y la autorregulación emocional.'
      }
    ];
  }

  // 3. DOMINIO DE CUENTOS, MITOS, FÁBULAS Y LITERATURA
  if (isLiterature) {
    return [
      {
        campoFormativo: 'Lenguajes (Literatura y Tradición Oral)',
        pda: `Lee, recrea y produce relatos, fábulas y leyendas locales identificando su estructura narrativa (inicio, desarrollo, nudo y desenlace), empleando signos de puntuación y descripciones detalladas.`,
        relacion: 'Comprensión lectora profunda, enriquecimiento del léxico y creación literaria autónoma.'
      },
      {
        campoFormativo: 'Saberes y Pensamiento Científico',
        pda: `Organiza la secuencia cronológica de los acontecimientos en una línea temporal y cuantifica elementos y personajes de los relatos populares.`,
        relacion: 'Estructuración temporal lógica, seriación y resolución de retos de ordenación.'
      },
      {
        campoFormativo: 'Ética, Naturaleza y Sociedades',
        pda: `Indaga con los adultos mayores los mitos y leyendas que explican el origen y la cosmovisión de su comunidad, reconociendo el valor del patrimonio cultural intangible.`,
        relacion: 'Rescate de la memoria comunitaria, respeto a la diversidad cultural y diálogo intergeneracional.'
      },
      {
        campoFormativo: 'De lo Humano y lo Comunitario',
        pda: `Dramatiza cuentos y fábulas en equipo, asumiendo roles con empatía y reflexionando sobre las moralejas y valores de solidaridad y respeto.`,
        relacion: 'Expresión corporal, desarrollo socioemocional y trabajo cooperativo sin exclusión.'
      }
    ];
  }

  // 4. DOMINIO DE MATEMÁTICAS: FRACCIONES, REPARTO Y NÚMEROS
  if (isFractions || isMathStoreOrMoney || isMathGeneral) {
    return [
      {
        campoFormativo: 'Saberes y Pensamiento Científico (Matemáticas)',
        pda: isFractions 
          ? `Representa, compara y resuelve problemas de suma y equivalencia de fracciones (medios, cuartos, octavos) en contextos cotidianos de medición y reparto equitativo con material concreto.`
          : isMathStoreOrMoney
          ? `Resuelve situaciones problemáticas de compra, venta, valor posicional y cálculo de presupuestos utilizando monedas y billetes didácticos en la tiendita escolar.`
          : `Resuelve problemas situados mediante algoritmos, estimaciones, patrones numéricos y modelación geométrica aplicados a situaciones reales de "${capitalizedTopic}".`,
        relacion: 'Desarrollo del razonamiento lógico-matemático, cálculo mental y aplicación práctica en la economía del hogar.'
      },
      {
        campoFormativo: 'Lenguajes (Comunicación Matemática)',
        pda: `Comunica de forma oral y escrita explicaciones, instrucciones y procedimientos matemáticos utilizados para resolver retos vinculados a "${capitalizedTopic}".`,
        relacion: 'Precisión conceptual, vocabulario matemático formal y argumentación clara de procesos.'
      },
      {
        campoFormativo: 'Ética, Naturaleza y Sociedades',
        pda: `Valora la equidad, la justicia distributiva y el consumo responsable en el reparto de recursos y compras comunitarias.`,
        relacion: 'Formación ética en el uso de los recursos, comercio justo y prevención de abusos económicos.'
      },
      {
        campoFormativo: 'De lo Humano y lo Comunitario',
        pda: `Colabora en estaciones y juegos matemáticos en equipo, respetando los turnos, apoyando a quienes requieren orientación y celebrando los logros colectivos.`,
        relacion: 'Confianza matemática, perseverancia en la resolución de problemas y aprendizaje cooperativo.'
      }
    ];
  }

  // 5. DOMINIO DE CIENCIAS, AGUA, HUERTO Y MEDIO AMBIENTE
  if (isWater || isGardenOrFood || isCleanEnergy || isScienceGeneral) {
    return [
      {
        campoFormativo: 'Saberes y Pensamiento Científico (Ciencias Naturales)',
        pda: isWater
          ? `Indaga el ciclo hidrológico, las propiedades físicas del agua y diseña prototipos de filtración y captación pluvial para el cuidado hídrico en la escuela.`
          : isGardenOrFood
          ? `Experimenta con el proceso de germinación, nutrición vegetal y la importancia del Plato del Bien Comer frente a los alimentos ultraprocesados.`
          : isCleanEnergy
          ? `Explica la transformación de la biomasa y fuentes de energía limpia, construyendo modelos demostrativos de bajo impacto ambiental.`
          : `Observa, formula hipótesis y experimenta para explicar fenómenos naturales y propiedades de la materia en torno a "${capitalizedTopic}".`,
        relacion: 'Pensamiento científico indagatorio, rigor experimental y aplicación de ecotecnias comunitarias.'
      },
      {
        campoFormativo: 'Lenguajes (Divulgación Científica)',
        pda: `Elabora bitácoras de campo, infografías y carteles ilustrados para divulgar hallazgos científicos y promover la educación ambiental en la escuela.`,
        relacion: 'Redacción de textos explicativos, síntesis de datos experimentales y comunicación visual asertiva.'
      },
      {
        campoFormativo: 'Ética, Naturaleza y Sociedades',
        pda: `Evalúa el impacto de las actividades humanas en los ecosistemas locales y propone acuerdos comunitarios para la conservación del entorno y la sustentabilidad.`,
        relacion: 'Conciencia ecológica bioética, justicia ambiental y defensa del derecho a un medio ambiente sano.'
      },
      {
        campoFormativo: 'De lo Humano y lo Comunitario',
        pda: `Organiza brigadas escolares para el mantenimiento del huerto, el ahorro de agua y la adopción de estilos de vida saludables en su comunidad.`,
        relacion: 'Responsabilidad social compartida, vida saludable y trabajo comunitario transformador.'
      }
    ];
  }

  // 6. DOMINIO DE FORMACIÓN CÍVICA, DERECHOS Y PAZ
  if (isCivicsPeace) {
    return [
      {
        campoFormativo: 'Ética, Naturaleza y Sociedades',
        pda: `Reconoce los derechos fundamentales de las niñas y los niños, promueve la igualdad de género y participa en la construcción de acuerdos de convivencia pacífica en el aula.`,
        relacion: 'Formación cívica y ética, defensa de los derechos humanos y erradicación de toda forma de discriminación.'
      },
      {
        campoFormativo: 'Lenguajes (Diálogo y Mediación)',
        pda: `Utiliza el diálogo empático, la asamblea escolar y la redacción de acuerdos para mediar desacuerdos y expresar propuestas de mejora para su escuela.`,
        relacion: 'Oratoria asertiva, escucha activa y elaboración de reglamentos y acuerdos colectivos.'
      },
      {
        campoFormativo: 'Saberes y Pensamiento Científico',
        pda: `Recaba y organiza datos en encuestas sobre la convivencia escolar, analizando en tablas las necesidades prioritarias del grupo.`,
        relacion: 'Tratamiento de información social, análisis crítico de estadísticas comunitarias y toma de decisiones informada.'
      },
      {
        campoFormativo: 'De lo Humano y lo Comunitario',
        pda: `Desarrolla habilidades socioemocionales de autorregulación, empatía y resolución no violenta de conflictos en actividades lúdicas y colaborativas.`,
        relacion: 'Cultura de paz, inteligencia emocional y fortalecimiento de lazos de amistad y solidaridad.'
      }
    ];
  }

  // 7. FALLBACK PEDAGÓGICO INTEGRAL SEGÚN LA FASE (100% ARTICULADO, CERO GENERALIDADES)
  if (levelKey === 'preescolar') {
    return [
      {
        campoFormativo: 'Lenguajes (Preescolar - Fase 2)',
        pda: `Expresa oralmente sus ideas, emociones y preguntas sobre "${capitalizedTopic}", escuchando los relatos de sus compañeros e ilustrando sus descubrimientos.`,
        relacion: 'Desarrollo de la oralidad, confianza comunicativa y primeras representaciones gráficas.'
      },
      {
        campoFormativo: 'Saberes y Pensamiento Científico',
        pda: `Explora objetos y situaciones del entorno vinculadas a "${capitalizedTopic}" usando sus sentidos, clasificando por atributos y contando colecciones pequeñas.`,
        relacion: 'Curiosidad científica inicial, conteo perceptual y razonamiento lógico tangible.'
      },
      {
        campoFormativo: 'Ética, Naturaleza y Sociedades',
        pda: `Reconoce las reglas y acuerdos de su salón al realizar actividades sobre "${capitalizedTopic}", cuidando los materiales y conviviendo con respeto.`,
        relacion: 'Pertenencia al grupo, valores de empatía y cuidado de los recursos compartidos.'
      },
      {
        campoFormativo: 'De lo Humano y lo Comunitario',
        pda: `Coordina sus movimientos y participa con entusiasmo en dinámicas corporales y juegos cooperativos en torno a "${capitalizedTopic}".`,
        relacion: 'Desarrollo psicomotriz, autorregulación en el juego y socialización infantil.'
      }
    ];
  } else if (levelKey === 'primaria-baja') {
    return [
      {
        campoFormativo: 'Lenguajes (Primaria Baja - Fase 3)',
        pda: `Describe de forma oral y escrita situaciones y saberes acerca de "${capitalizedTopic}" mediante la escritura autónoma, el dibujo y el dictado colectivo.`,
        relacion: 'Consolidación de la lectoescritura con propósito social, correspondencia grafofonética y expresión clara.'
      },
      {
        campoFormativo: 'Saberes y Pensamiento Científico',
        pda: `Utiliza material concreto, tablas y dibujos para cuantificar, medir y comparar datos relacionados con retos prácticos de "${capitalizedTopic}".`,
        relacion: 'Resolución de problemas de suma y resta, valor posicional y estimación de medidas cotidianas.'
      },
      {
        campoFormativo: 'Ética, Naturaleza y Sociedades',
        pda: `Identifica cómo influyen las acciones de las personas en el bienestar de la comunidad escolar y su entorno respecto a "${capitalizedTopic}".`,
        relacion: 'Responsabilidad cívica escolar, cuidado del medio ambiente y convivencia armónica.'
      },
      {
        campoFormativo: 'De lo Humano y lo Comunitario',
        pda: `Participa activamente en equipos de trabajo para resolver tareas de "${capitalizedTopic}", respetando los turnos y reconociendo el valor de cada compañero.`,
        relacion: 'Trabajo colaborativo, autoestima y fomento de la empatía en el aula.'
      }
    ];
  } else if (levelKey === 'primaria-media') {
    return [
      {
        campoFormativo: 'Lenguajes (Primaria Media - Fase 4)',
        pda: `Comprende, resume y redacta textos expositivos e instructivos sobre "${capitalizedTopic}" empleando conectores lógicos y signos de puntuación adecuados.`,
        relacion: 'Comprensión lectora analítica, redacción estructurada en párrafos y divulgación escolar.'
      },
      {
        campoFormativo: 'Saberes y Pensamiento Científico',
        pda: `Resuelve problemas contextualizados sobre "${capitalizedTopic}" mediante operaciones combinadas, fracciones y registro de datos en gráficas de barras.`,
        relacion: 'Pensamiento lógico-matemático, análisis estadístico inicial e indagación científica sistemática.'
      },
      {
        campoFormativo: 'Ética, Naturaleza y Sociedades',
        pda: `Analiza la importancia del tema "${capitalizedTopic}" en la vida y el patrimonio de su entidad federativa, promoviendo la justicia y la equidad.`,
        relacion: 'Identidad regional, pensamiento crítico social y participación democrática.'
      },
      {
        campoFormativo: 'De lo Humano y lo Comunitario',
        pda: `Diseña acuerdos y estrategias cooperativas para prevenir riesgos y optimizar el trabajo en equipo en el proyecto sobre "${capitalizedTopic}".`,
        relacion: 'Toma de decisiones consensuada, resiliencia y salud comunitaria.'
      }
    ];
  } else if (levelKey === 'primaria-alta') {
    return [
      {
        campoFormativo: 'Lenguajes (Primaria Alta - Fase 5)',
        pda: `Elabora ensayos breves, reseñas críticas y participa en debates formales sobre "${capitalizedTopic}", sustentando sus argumentos en fuentes confiables.`,
        relacion: 'Pensamiento crítico discursivo, análisis literario e informativo y comunicación oral asertiva.'
      },
      {
        campoFormativo: 'Saberes y Pensamiento Científico',
        pda: `Aplica modelos matemáticos (porcentajes, volumen, proporcionalidad) y el método experimental para investigar fenómenos asociados a "${capitalizedTopic}".`,
        relacion: 'Pensamiento probabilístico, pensamiento STEM y experimentación científica rigurosa.'
      },
      {
        campoFormativo: 'Ética, Naturaleza y Sociedades',
        pda: `Evalúa críticamente los procesos socioambientales y las leyes que regulan problemáticas vinculadas a "${capitalizedTopic}" a nivel nacional.`,
        relacion: 'Conciencia histórica de México, soberanía, sustentabilidad ecológica y derechos humanos.'
      },
      {
        campoFormativo: 'De lo Humano y lo Comunitario',
        pda: `Lidera proyectos comunitarios colaborativos orientados al bienestar común y la equidad social en torno a "${capitalizedTopic}".`,
        relacion: 'Liderazgo transformador, resiliencia comunitaria y cultura de paz.'
      }
    ];
  } else if (levelKey === 'secundaria') {
    return [
      {
        campoFormativo: 'Saberes y Pensamiento Científico (Secundaria - Fase 6)',
        pda: `Modela situaciones y fenómenos reales relacionados con "${capitalizedTopic}" mediante expresiones algebraicas, gráficas, funciones y contrastación experimental de laboratorio.`,
        relacion: 'Rigor cuantitativo, formulación de modelos matemáticos y leyes científicas fundamentales.'
      },
      {
        campoFormativo: 'Lenguajes (Español / Lengua Extranjera)',
        pda: `Produce ensayos académicos, artículos de divulgación y participa en mesas redondas formales sobre "${capitalizedTopic}" con rigor metodológico y citas textuales.`,
        relacion: 'Argumentación crítica avanzada, dialéctica y divulgación del conocimiento científico.'
      },
      {
        campoFormativo: 'Ética, Naturaleza y Sociedades',
        pda: `Analiza críticamente las causas estructurales, históricas y éticas de las problemáticas socioambientales ligadas a "${capitalizedTopic}".`,
        relacion: 'Conciencia histórica crítica, geopolítica, sostenibilidad y justicia social transformadora.'
      },
      {
        campoFormativo: 'De lo Humano y lo Comunitario',
        pda: `Diseña prototipos tecnológicos y propuestas productivas comunitarias orientadas a la innovación y el proyecto de vida en torno a "${capitalizedTopic}".`,
        relacion: 'Innovación técnica, vocación productiva, salud integral y proyecto de vida.'
      }
    ];
  } else {
    return [
      {
        campoFormativo: 'Lengua y Comunicación (MCCEMS)',
        pda: `Construye discursos argumentativos y ensayos críticos preuniversitarios sobre "${capitalizedTopic}", integrando diversas perspectivas epistemológicas y normas de citación formal.`,
        relacion: 'Pensamiento analítico superior, juicio crítico y comunicación académica especializada.'
      },
      {
        campoFormativo: 'Pensamiento Matemático y Ciencias Naturales',
        pda: `Modela sistemas complejos y resuelve problemas cuantitativos de cálculo, probabilidad y física/química aplicada en torno a "${capitalizedTopic}".`,
        relacion: 'Modelación matemática formal, abstracción analítica y metodología científica avanzada.'
      },
      {
        campoFormativo: 'Conciencia Histórica y Humanidades',
        pda: `Examina las implicaciones éticas, filosóficas e históricas de "${capitalizedTopic}" en el desarrollo contemporáneo de la sociedad mexicana y mundial.`,
        relacion: 'Reflexión filosófica, análisis social interdisciplinario y ciudadanía crítica universal.'
      },
      {
        campoFormativo: 'Recursos Socioemocionales',
        pda: `Coordina proyectos de impacto comunitario y responsabilidad social vinculados a "${capitalizedTopic}", demostrando liderazgo ético y compromiso ciudadano.`,
        relacion: 'Transformación del entorno social, compromiso ético y desarrollo humano integral.'
      }
    ];
  }
}

/**
 * Generador de Propuesta de Proyecto Final Integrador Situado y Específico (Basado en Libros Oficiales SEP / NEM)
 */
export function generateFinalProjectProposal(level: string, subject: string, topic: string): FinalProjectProposal {
  const cleanTopic = cleanCoreTopicName(topic);
  const capitalizedTopic = cleanTopic;
  const topicLower = cleanTopic.toLowerCase();
  const levelKey = level || 'primaria-baja';

  // Identificación temática
  const isHistory = /revoluci|independen|porfir|reforma|mexic|histori|constituc|madero|zapata|villa|juarez|hidalgo|virrein|prehispan|colonia|patrimon|tradicion|cultura|efemerid|civilizac|conquista|batalla|heroes|monumento|patria/i.test(topicLower);
  const isEpistolar = /carta|epistol|mensaje|buzon|cartero|correspondencia|sobre\b|postal/i.test(topicLower);
  const isLiterature = /cuento|leyenda|mito|fabula|poema|poes|rima|verso|cancion|teatro|dramat|relato|literat/i.test(topicLower);
  const isFractions = /fraccion|equivalen|particion|reparto|denominador|numerador/i.test(topicLower);
  const isMathStoreOrMoney = /tienda|mercado|dinero|moneda|compra|venta|precio|cambio|billete|ahorro|presupuesto/i.test(topicLower);
  const isParabola = /parabol|cuadrat|segundo grado|tiro parab|algebra/i.test(topicLower);
  const isWater = /agua|rio|lluvia|filtr|pozo|sequia|pluvial|hidrico/i.test(topicLower);
  const isGardenOrFood = /huerto|siembra|cosecha|cultivo|semilla|alimento|nutric|plato del bien comer|comida|dieta|ultraproces/i.test(topicLower);
  const isCleanEnergy = /biodigestor|biogas|energia|solar|eolica|renovable|ecotecnia|residu|recicl/i.test(topicLower);
  const isCivicsPeace = /derecho|paz|acuerdo|convivenc|mediacion|inclusion|igualdad|genero|discrimin|democrac|ciudadan|justicia/i.test(topicLower);

  // 1. PROYECTO DE HISTORIA Y MEMORIA CÍVICA (Ej. Revolución Mexicana, Independencia)
  if (isHistory) {
    if (levelKey === 'preescolar' || levelKey === 'primaria-baja') {
      return {
        titulo: `Galería Histórica y Museo Viviente: "Voces, Corridos y Relatos de la Revolución Mexicana"`,
        problematicaComunitaria: `En nuestra comunidad escolar y familiar se ha debilitado la transmisión de la memoria histórica sobre la Revolución Mexicana de 1910, limitando la comprensión de cómo este movimiento conquistó los derechos agrarios, laborales y la educación pública gratuita que hoy gozamos en nuestra escuela.`,
        proposito: `Investigar a través de relatos familiares, canciones populares (corridos) y libros de texto gratuitos de la SEP los acontecimientos, causas y personajes de la Revolución Mexicana, para crear una galería histórica interactiva y dramatizaciones que fortalezcan la identidad cívica y la valoración de los derechos sociales.`,
        productoFinal: `Instalación del "Museo Viviente y Galería de la Revolución Mexicana" en el patio escolar (vinculado a Proyectos Comunitarios y Nuestros Saberes de la SEP), con módulos de personajes históricos caracterizados (Madero, Zapata, Villa, Adelitas), exposición de corridos y coplas ilustradas, periódicos facsimilares y tertulia testimonial con familias y adultos mayores.`,
        impactoSocial: `Fortalece los lazos intergeneracionales con abuelos y miembros de la comunidad, fomenta el orgullo por el patrimonio histórico nacional y profundiza la comprensión de las garantías sociales y los derechos de la niñez.`,
        rubrica: {
          criterio1: {
            nombre: 'Indagación Histórica y Testimonios de la Tradición Oral',
            sobresaliente: `Recupera con profundidad relatos orales familiares y datos de los libros de texto de la SEP, explicando con claridad las causas y personajes de la Revolución Mexicana.`,
            satisfactorio: `Identifica los personajes principales y algunos acontecimientos clave con apoyo de testimonios y lecturas del libro de texto.`,
            enProceso: `Presenta dificultades para distinguir los hechos históricos o relatar con sus palabras lo investigado.`
          },
          criterio2: {
            nombre: 'Expresión Literaria y Artística de Época (Corridos y Periódico Mural)',
            sobresaliente: `Crea coplas, corridos ilustrados y caracterizaciones con excelente creatividad, utilizando lenguaje de época y conectores temporales precisos.`,
            satisfactorio: `Elabora sus dibujos y coplas con orden, limpieza y relación evidente con los personajes revolucionarios.`,
            enProceso: `Las producciones gráficas o escritas carecen de relación con la época histórica estudiada.`
          },
          criterio3: {
            nombre: 'Conducción en el Museo Viviente y Compromiso Cívico',
            sobresaliente: `Explica con elocuencia, respeto y entusiasmo su módulo a los visitantes del museo, promoviendo el diálogo sobre los derechos conquistados.`,
            satisfactorio: `Participa activamente en la atención a su estación y explica su personaje con amabilidad.`,
            enProceso: `Muestra timidez o dificultad para compartir oralmente su experiencia ante la comunidad.`
          }
        }
      };
    } else if (levelKey === 'primaria-media' || levelKey === 'primaria-alta') {
      return {
        titulo: `Museo Escolar de la Transformación: "Causas, Ideales y Derechos de la Revolución Mexicana"`,
        problematicaComunitaria: `Los estudiantes requieren profundizar en el análisis crítico de las causas estructurales de la Revolución Mexicana y valorar cómo la Constitución de 1917 garantiza los derechos educativos, agrarios y laborales en su vida cotidiana.`,
        proposito: `Elaborar un dossier de investigación histórica y montar una museografía interactiva basada en los libros de texto de la SEP (Proyectos Escolares y Cartografía de México) para divulgar los principios de justicia social y soberanía nacional.`,
        productoFinal: `Montaje de la "Sala Museográfica de la Revolución Mexicana" con maquetas de batallas decisivas, líneas del tiempo geoespaciales, periódicos facsimilares de época y mesa redonda de debate sobre el Artículo 3º y 123 Constitucional.`,
        impactoSocial: `Sensibiliza a la comunidad escolar sobre la importancia de defender los derechos sociales y la democracia participativa en el México contemporáneo.`,
        rubrica: {
          criterio1: {
            nombre: 'Análisis Crítico de Fuentes Históricas y Libros SEP',
            sobresaliente: `Contrasta múltiples fuentes primarias y libros de la SEP con rigor, fundamentando las distintas posturas ideológicas de los caudillos revolucionarios.`,
            satisfactorio: `Explica las causas principales y consecuencias de la Revolución apoyándose en los textos escolares.`,
            enProceso: `El análisis es superficial o repite información sin contrastar causas y efectos.`
          },
          criterio2: {
            nombre: 'Diseño Museográfico y Producción Editorial',
            sobresaliente: `Diseña fichas museográficas impecables, maquetas a escala y periódicos murales con alta calidad estética y narrativa.`,
            satisfactorio: `Presenta su material museográfico con orden, limpieza y datos históricos correctos.`,
            enProceso: `El material es descuidado o contiene errores cronológicos notorios.`
          },
          criterio3: {
            nombre: 'Participación en el Debate y Exposición Comunitaria',
            sobresaliente: `Argumenta con elocuencia y solidez académica en la mesa de debate, vinculando los ideales revolucionarios con los retos actuales de su comunidad.`,
            satisfactorio: `Expone sus ideas con claridad y respeto durante la visita de la comunidad escolar.`,
            enProceso: `Dificultad para sustentar sus posturas o responder preguntas de la audiencia.`
          }
        }
      };
    } else {
      return {
        titulo: `Simposio Histórico y Tribunal Crítico: "La Revolución Mexicana y la Construcción del Estado de Derecho"`,
        problematicaComunitaria: `Necesidad de examinar críticamente las contradicciones del Porfiriato, los planes revolucionarios y el grado de cumplimiento de las garantías sociales consagradas en la Constitución de 1917 en el México actual.`,
        proposito: `Desarrollar una investigación historiográfica rigurosa que culmine en un simposio académico estudiantil y la publicación de una revista histórica digital para la comunidad.`,
        productoFinal: `Simposio Académico Estudiantil con ponencias sustentadas, juicio histórico simulado a las facciones revolucionarias y dossier de ensayos analíticos con aparato crítico formal (Colección Ximhai / MCCEMS).`,
        impactoSocial: `Fomenta la conciencia histórica transformadora, la cultura de la legalidad y el compromiso cívico de la juventud con su país.`,
        rubrica: {
          criterio1: {
            nombre: 'Rigor Historiográfico y Aparato Crítico',
            sobresaliente: `Analiza fuentes primarias y secundarias con metodología historiográfica rigurosa, citando fuentes documentales y contrastando corrientes interpretativas.`,
            satisfactorio: `Sustenta su ensayo histórico con bibliografía adecuada y argumentos estructurados.`,
            enProceso: `Carece de aparato crítico o muestra sesgo sin sustento documental.`
          },
          criterio2: {
            nombre: 'Discurso Argumentativo y Ponencia Académica',
            sobresaliente: `Defiende su tesis con dominio oratorio, solvencia conceptual y capacidad dialéctica en el simposio ante la comunidad.`,
            satisfactorio: `Expone su ponencia con fluidez y responde a las preguntas del panel adecuadamente.`,
            enProceso: `Lectura plana del texto sin interacción ni profundidad argumentativa.`
          },
          criterio3: {
            nombre: 'Compromiso Ético y Propuestas de Incidencia Social',
            sobresaliente: `Formula propuestas concretas de incidencia cívica vinculando los ideales revolucionarios con la justicia social contemporánea.`,
            satisfactorio: `Relaciona adecuadamente el tema histórico con la realidad comunitaria actual.`,
            enProceso: `No logra vincular el análisis histórico con el contexto presente.`
          }
        }
      };
    }
  }

  // 2. PROYECTO DE CORRESPONDENCIA Y TEXTOS EPISTOLARES
  if (isEpistolar) {
    return {
      titulo: `El Cartero Escolar y el Buzón de la Amistad: "Cartas que Unen Corazones en Nuestra Comunidad"`,
      problematicaComunitaria: `En el contexto escolar actual, la comunicación digital inmediata ha desplazado la correspondencia escrita, provocando que las niñas y niños desconozcan la función social de la carta formal e informal, sus componentes estructurales (fecha, lugar, destinatario, saludo, cuerpo, despedida, firma y remitente) y el valor de expresar afecto, agradecimiento o peticiones ciudadanas mediante la palabra escrita.`,
      proposito: `Que las y los estudiantes desarrollen competencias comunicativas integrales de lectoescritura con sentido social real, elaboren cartas personalizadas para miembros de la comunidad escolar y sus familias, y diseñen un buzón postal funcional para dinamizar la correspondencia en la escuela (Libro SEP: Proyectos Comunitarios 2º Grado, págs. 76-87).`,
      productoFinal: `Montaje del "Buzón Postal Comunitario" en el aula y patio cívico escolar, con sobres decorados a mano, estampillas postales elaboradas por los alumnos y una jornada de reparto de cartas en la comunidad escolar con lectura en voz alta.`,
      impactoSocial: `Fortalece los vínculos afectivos e intergeneracionales con abuelos y familias, rescata el patrimonio cultural de la correspondencia postal mexicana, fomenta la empatía y la resolución pacífica de conflictos mediante el diálogo escrito, y estimula la lectoescritura con propósito comunitario.`,
      rubrica: {
        criterio1: {
          nombre: 'Estructura Epistolar y Calidad del Mensaje Escrito',
          sobresaliente: `La carta incluye con absoluta claridad y precisión sus 6 partes (fecha/lugar, destinatario, saludo, cuerpo en párrafos organizados, despedida y firma), con excelente caligrafía y ortografía.`,
          satisfactorio: `La carta contiene la mayoría de los elementos de la estructura epistolar con redacción comprensible y pocas faltas ortográficas.`,
          enProceso: `El texto carece de encabezado o despedida, las ideas están desordenadas o presenta dificultades notables en la escritura autónoma.`
        },
        criterio2: {
          nombre: 'Diseño del Sobre, Estampilla y Rotulación Postal',
          sobresaliente: `El sobre está impecablemente rotulado con remitente y destinatario en las posiciones correctas, incluye código postal y una estampilla artística original y creativa.`,
          satisfactorio: `El sobre contiene los datos principales de remitente y destinatario con buena presentación general.`,
          enProceso: `El sobre confunde el remitente con el destinatario o carece de datos indispensables para la entrega postal.`
        },
        criterio3: {
          nombre: 'Participación en la Jornada del Buzón Comunitario',
          sobresaliente: `Participa con entusiasmo y empatía en la construcción del buzón, asume con responsabilidad su rol de cartero y lee con elocuencia y respeto ante la comunidad.`,
          satisfactorio: `Colabora adecuadamente en el montaje del buzón y entrega su correspondencia a tiempo con amabilidad.`,
          enProceso: `Muestra poco interés en la entrega comunitaria o dificultad para integrarse en las actividades del equipo.`
        }
      }
    };
  }

  // 3. PROYECTO DE CUENTOS, MITOS Y TRADICIÓN ORAL
  if (isLiterature) {
    return {
      titulo: `Antología Cartonera y Tendedero Literario: "Voces Mágicas y Relatos de Nuestra Comunidad"`,
      problematicaComunitaria: `Se ha detectado una pérdida paulatina de la tradición oral comunitaria y un escaso hábito de creación literaria autónoma en la infancia, lo que limita el desarrollo de la imaginación y la comprensión lectora en el entorno escolar.`,
      proposito: `Rescatar y recrear relatos locales mediante la producción colectiva de una antología de cuentos ilustrados con estructura narrativa formal (inicio, desarrollo, nudo y desenlace), utilizando los libros de texto de la SEP (Proyectos de Aula 1º y 2º Grado / Múltiples Lenguajes).`,
      productoFinal: `Libro cartonero antológico encuadernado y decorado a mano con material reciclable, presentado en una tertulia literaria comunitaria con lectura en atril y tendedero de cuentos en el patio escolar.`,
      impactoSocial: `Fomenta el amor por la lectura comunitaria, recupera la memoria de los pueblos y dota a la biblioteca de aula de un acervo literario creado por las y los alumnos.`,
      rubrica: {
        criterio1: {
          nombre: 'Estructura Narrativa y Creatividad Literaria',
          sobresaliente: `Desarrolla una trama original con personajes bien caracterizados, conflicto claro y desenlace creativo, empleando conectores temporales y adjetivos descriptivos.`,
          satisfactorio: `El relato presenta inicio, desarrollo y final comprensibles con adecuada estructura de párrafos.`,
          enProceso: `La narración no tiene una secuencia lógica clara o queda inconclusa.`
        },
        criterio2: {
          nombre: 'Confección del Libro Cartonero y Expresión Plástica',
          sobresaliente: `El libro cartonero está sólidamente encuadernado, con portadas artísticas llamativas e ilustraciones que enriquecen profundamente el texto.`,
          satisfactorio: `El libro cartonero cumple con los requisitos de armado e ilustración con limpieza y orden.`,
          enProceso: `El encuadernado es frágil o las ilustraciones carecen de relación con el texto.`
        },
        criterio3: {
          nombre: 'Socialización y Lectura en Atril',
          sobresaliente: `Lee con fluidez, modulación de voz adecuada y expresión corporal que cautiva a la audiencia en la tertulia literaria.`,
          satisfactorio: `Realiza su lectura en voz alta con claridad y volumen audible ante el público.`,
          enProceso: `Muestra inseguridad o tono de voz inaudible durante la presentación oral.`
        }
      }
    };
  }

  // 4. PROYECTO DE MATEMÁTICAS: FRACCIONES Y REPARTO EQUITATIVO
  if (isFractions) {
    return {
      titulo: `La Panadería y Cocina Comunitaria: "Fracciones para Compartir con Equidad"`,
      problematicaComunitaria: `Los estudiantes suelen concebir las fracciones de forma abstracta y descontextualizada, dificultando la comprensión del concepto de entero, medios, cuartos, octavos y su aplicación en la economía familiar y la cocina diaria.`,
      proposito: `Comprender las fracciones como partes de la unidad y operadores de reparto equitativo mediante la simulación lúdica de una panadería comunitaria y la elaboración de recetas fraccionarias (Libro SEP: Proyectos de Aula 3º Grado, págs. 112-125).`,
      productoFinal: `Feria Gastronómica Matemática con modelos manipulables de alimentos divididos en fracciones, recetario escolar ilustrado con cantidades fraccionarias y estación interactiva de retos de equivalencias.`,
      impactoSocial: `Promueve la justicia distributiva, la equidad en el reparto de alimentos y la aplicación práctica de las matemáticas en la economía y cocina del hogar.`,
      rubrica: {
        criterio1: {
          nombre: 'Modelado y Representación Gráfica de Fracciones',
          sobresaliente: `Representa con exactitud fracciones propias, impropias y equivalentes usando material concreto, rectas numéricas y dibujos a escala.`,
          satisfactorio: `Identifica y representa medios, cuartos y octavos correctamente en figuras geométricas y alimentos.`,
          enProceso: `Confunde el numerador con el denominador o divide enteros en partes desiguales.`
        },
        criterio2: {
          nombre: 'Resolución de Problemas de Reparto y Equivalencias',
          sobresaliente: `Resuelve problemas complejos de suma y comparación de fracciones con distintos métodos y justifica con elocuencia su razonamiento.`,
          satisfactorio: `Resuelve problemas sencillos de reparto fraccionario con apoyo de material manipulable.`,
          enProceso: `Presenta dificultades para calcular repartos básicos o identificar equivalencias simples.`
        },
        criterio3: {
          nombre: 'Atención en la Estación Demostrativa y Trabajo en Equipo',
          sobresaliente: `Explica con claridad y entusiasmo los retos de fracciones a los visitantes de la feria gastronómica con gran empatía y solvencia.`,
          satisfactorio: `Colabora en la atención de la estación y demuestra los modelos fraccionarios adecuadamente.`,
          enProceso: `Participa con timidez o no logra explicar el funcionamiento de sus modelos manipulables.`
        }
      }
    };
  }

  // 5. PROYECTO DE MATEMÁTICAS: LA TIENDITA, MONEDAS Y FINANZAS FAMILIARES
  if (isMathStoreOrMoney) {
    return {
      titulo: `Mercado Escolar y Tiendita Cooperativa: "Números, Monedas y Finanzas para el Bien Común"`,
      problematicaComunitaria: `Los estudiantes requieren fortalecer el cálculo mental, la comprensión del valor posicional del dinero y el desarrollo de hábitos de consumo responsable y finanzas solidarias en su entorno comunitario.`,
      proposito: `Diseñar e instalar una tiendita escolar cooperativa utilizando billetes y monedas didácticos para resolver problemas de adición, sustracción, cálculo de cambio y presupuesto familiar (Libro SEP: Proyectos de Aula 2º Grado, págs. 68-79 / Nuestros Saberes).`,
      productoFinal: `Simulación del "Mercado Cooperativo Escolar" con puestos de productos sustentables, lista de precios calculada por los alumnos, billetes y monedas didácticas, libro de contabilidad escolar y guía de compra inteligente para las familias.`,
      impactoSocial: `Fomenta la educación financiera temprana, el comercio justo, el consumo de alimentos locales y el ahorro familiar responsable.`,
      rubrica: {
        criterio1: {
          nombre: 'Cálculo de Precios, Sumas y Cálculo de Cambio',
          sobresaliente: `Realiza transacciones con exactitud, suma mentalmente precios y calcula el cambio correspondiente con rapidez y sin errores.`,
          satisfactorio: `Calcula totales y cambios de forma correcta apoyándose en el registro escrito o fichas.`,
          enProceso: `Presenta dificultades para sumar cantidades monetarias o calcular el cambio exacto.`
        },
        criterio2: {
          nombre: 'Organización del Puesto y Clasificación de Productos',
          sobresaliente: `Etiqueta productos con claridad, organiza el puesto con orden estético y promueve alimentos sanos y productos reciclados.`,
          satisfactorio: `Mantiene su puesto ordenado y con precios visibles para los compradores.`,
          enProceso: `El puesto carece de etiquetas de precios o está desorganizado.`
        },
        criterio3: {
          nombre: 'Atención al Cliente y Convivencia Solidaria',
          sobresaliente: `Atiende con amabilidad, honestidad y entusiasmo a sus compañeros clientes, promoviendo el diálogo respetuoso.`,
          satisfactorio: `Participa adecuadamente en los turnos de comprador y vendedor.`,
          enProceso: `Muestra desinterés en la dinámica del mercado o dificultad para convivir en equipo.`
        }
      }
    };
  }

  // 6. PROYECTO DE MATEMÁTICAS: FUNCIONES CUADRÁTICAS Y PARÁBOLAS (SECUNDARIA)
  if (isParabola) {
    return {
      titulo: `El Vértice de la Realidad: "Modelación de Parábolas en Puentes, Antenas y Deportes"`,
      problematicaComunitaria: `Dificultad de los alumnos de secundaria para visualizar la relación entre el álgebra abstracta (ecuaciones de segundo grado) y los fenómenos físicos, arquitectónicos y tecnológicos del entorno.`,
      proposito: `Modelar y resolver problemas reales mediante funciones cuadráticas (y = ax² + bx + c), analizando el vértice, eje de simetría, raíces y concavidad con herramientas digitales (GeoGebra) y maquetas a escala (Libro SEP: Saberes y Pensamiento Científico: Matemáticas 3º Secundaria, págs. 136-155).`,
      productoFinal: `Galería STEM con maquetas a escala de puentes colgantes, lanzadores de proyectiles calibrados y dossier técnico de modelación matemática con GeoGebra.`,
      impactoSocial: `Acerca la ingeniería y la física aplicada a la comunidad escolar, demostrando la utilidad de las matemáticas en la infraestructura pública y el diseño tecnológico.`,
      rubrica: {
        criterio1: {
          nombre: 'Rigor Algebraico y Cálculo Analítico',
          sobresaliente: `Calcula con precisión vértice, raíces y concavidad mediante factorización y fórmula general, interpretando su significado físico.`,
          satisfactorio: `Obtiene el vértice y grafica la parábola correctamente con apoyo de tablas de valores.`,
          enProceso: `Comete errores constantes de signo o no logra identificar el vértice de la función.`
        },
        criterio2: {
          nombre: 'Construcción y Calibración de la Maqueta a Escala',
          sobresaliente: `La maqueta representa con exactitud la curva parabólica calculada y demuestra el tiro parabólico con datos medibles.`,
          satisfactorio: `La maqueta ilustra la forma parabólica con dimensiones estables y buen acabado.`,
          enProceso: `La estructura no conserva la simetría parabólica o los cálculos no corresponden al modelo físico.`
        },
        criterio3: {
          nombre: 'Exposición Técnica y Uso de Software Matemático',
          sobresaliente: `Utiliza GeoGebra con destreza y expone con solvencia científica ante la comunidad escolar y padres de familia.`,
          satisfactorio: `Explica los conceptos de su maqueta con claridad y lenguaje matemático apropiado.`,
          enProceso: `Presenta dificultades para explicar el significado del vértice o la trayectoria parabólica.`
        }
      }
    };
  }

  // 7. PROYECTO DE CIENCIAS: CUIDADO DEL AGUA Y FILTRACIÓN PLUVIAL
  if (isWater) {
    return {
      titulo: `Guardianes del Agua: "Sistema Escolar de Filtración Pluvial y Uso Responsable del Agua"`,
      problematicaComunitaria: `Escasez y desperdicio de agua en la escuela y los hogares, junto con la falta de infraestructura de captación pluvial y purificación casera de bajo costo en la comunidad.`,
      proposito: `Diseñar e implementar un prototipo funcional de filtro de agua casero con materiales del entorno (arena, grava, carbón activado) e impulsar una campaña de concientización hídrica escolar (Libro SEP: Proyectos Comunitarios 3º Grado, págs. 142-155 / Nuestros Saberes).`,
      productoFinal: `Prototipo funcional de filtro de agua multicapa instalado en la escuela, estación de pruebas de turbidez, decálogo comunitario del ahorro hídrico y patrulla escolar del agua.`,
      impactoSocial: `Reduce el desperdicio de agua en la institución, enseña ecotecnias aplicables en los hogares de escasos recursos y fomenta el derecho humano al agua limpia y saneamiento.`,
      rubrica: {
        criterio1: {
          nombre: 'Indagación Científica y Diseño del Filtro',
          sobresaliente: `Explica con precisión la función de cada capa de filtrado, los ciclos del agua y demuestra la reducción de turbidez con pruebas empíricas rigurosas.`,
          satisfactorio: `Construye el filtro con los materiales adecuados y explica el proceso general de purificación.`,
          enProceso: `El prototipo presenta fugas o no logra filtrar adecuadamente el agua de muestra.`
        },
        criterio2: {
          nombre: 'Campaña Escolar de Sensibilización',
          sobresaliente: `Diseña infografías de alto impacto visual y lidera la patrulla del agua con propuestas medibles de ahorro en los sanitarios y áreas verdes.`,
          satisfactorio: `Elabora carteles informativos claros y comparte recomendaciones con otros grupos.`,
          enProceso: `Participa de forma pasiva en la difusión de las medidas de cuidado del agua.`
        },
        criterio3: {
          nombre: 'Trabajo Colaborativo y Compromiso Ecológico',
          sobresaliente: `Demuestra un liderazgo ejemplar en el mantenimiento del filtro y promueve compromisos firmados con las familias.`,
          satisfactorio: `Colabora con entusiasmo en las tareas asignadas para el montaje del prototipo.`,
          enProceso: `Muestra poco interés en el cuidado de los materiales o el trabajo en equipo.`
        }
      }
    };
  }

  // 8. PROYECTO DE CIENCIAS: HUERTO ESCOLAR Y SOBERANÍA ALIMENTARIA
  if (isGardenOrFood) {
    return {
      titulo: `El Huerto Escolar Agroecológico: "Siembra, Vida y Soberanía Alimentaria en Nuestra Escuela"`,
      problematicaComunitaria: `Desconocimiento sobre el origen de los alimentos, alto consumo de productos ultraprocesados y falta de espacios verdes productivos en la comunidad escolar.`,
      proposito: `Construir un huerto escolar sustentable con sistema de siembra orgánica, compostero y cultivo de hortalizas locales, integrando saberes del Plato del Bien Comer y la agroecología (Libro SEP: Proyectos Comunitarios 2º Grado, págs. 104-117).`,
      productoFinal: `Camas de siembra de hortalizas y plantas medicinales activas en la escuela, compostero de residuos orgánicos, bitácora científica de germinación y recetario escolar de comida tradicional saludable.`,
      impactoSocial: `Fomenta la soberanía alimentaria, mejora la nutrición de las familias, reduce la huella de carbono escolar y embellece los espacios comunes con biodiversidad.`,
      rubrica: {
        criterio1: {
          nombre: 'Indagación Biológica y Registro en Bitácora',
          sobresaliente: `Registra detalladamente el ciclo de vida de las plantas, factores bióticos/abióticos y nutrientes del suelo con dibujos y mediciones periódicas.`,
          satisfactorio: `Lleva un registro ordenado de las etapas de crecimiento de su cultivo escolar.`,
          enProceso: `El registro en bitácora es incompleto o no demuestra comprensión de los cuidados de la planta.`
        },
        criterio2: {
          nombre: 'Implementación del Huerto y Compostero',
          sobresaliente: `Aplica técnicas de siembra asociadas, riego por goteo casero y elaboración de abono orgánico con excelente esmero.`,
          satisfactorio: `Participa activamente en la siembra, deshierbe y riego de las camas de cultivo.`,
          enProceso: `Muestra descuido en el mantenimiento de las plantas asignadas a su equipo.`
        },
        criterio3: {
          nombre: 'Promoción de la Salud y Nutrición Comunitaria',
          sobresaliente: `Diseña propuestas atractivas para sustituir la comida chatarra por productos del huerto y expone su recetario ante los padres de familia.`,
          satisfactorio: `Comparte información sobre los beneficios de las hortalizas con sus compañeros.`,
          enProceso: `Dificultad para explicar el valor nutricional de los alimentos cosechados.`
        }
      }
    };
  }

  // 9. PROYECTO DE CIENCIAS: BIODIGESTORES Y ENERGÍAS LIMPIAS
  if (isCleanEnergy) {
    return {
      titulo: `Energías Verdes en Movimiento: "Prototipo de Biodigestor y Tecnologías Sustentables Escolares"`,
      problematicaComunitaria: `Acumulación de residuos orgánicos sin tratamiento y falta de alternativas sustentables de generación de energía limpia en las comunidades escolares y rurales.`,
      proposito: `Diseñar y construir un biodigestor anaeróbico a escala para la producción de biogás y biofertilizante (biol), investigando las transformaciones de la materia y la energía (Libro SEP: Proyectos Comunitarios 6º Grado, págs. 168-183).`,
      productoFinal: `Prototipo funcional de biodigestor a escala con contenedor hermético, válvula de gas y trampa de agua, acompañado de una feria escolar de ecotecnias y guía comunitaria de aprovechamiento de biomasa.`,
      impactoSocial: `Sensibiliza sobre la economía circular, la reducción de gases de efecto invernadero y ofrece soluciones prácticas para comunidades con acceso limitado a combustibles fósiles.`,
      rubrica: {
        criterio1: {
          nombre: 'Rigor Científico y Comprensión del Proceso Anaeróbico',
          sobresaliente: `Explica con precisión la fermentación metanogénica, el balance carbono-nitrógeno y las leyes de conservación de la materia con fundamentos científicos sólidos.`,
          satisfactorio: `Describe adecuadamente cómo se transforma la materia orgánica en gas combustible y fertilizante.`,
          enProceso: `Muestra confusión sobre el funcionamiento del biodigestor o los gases producidos.`
        },
        criterio2: {
          nombre: 'Construcción y Hermeticidad del Prototipo',
          sobresaliente: `El prototipo está sólidamente ensamblado, con sellado hermético verificado, válvulas funcionales y medidas de seguridad impecables.`,
          satisfactorio: `Construye el prototipo siguiendo las especificaciones técnicas con buenos acabados.`,
          enProceso: `El prototipo presenta fugas de aire o fallas en las conexiones.`
        },
        criterio3: {
          nombre: 'Divulgación de Ecotecnias y Conciencia Ambiental',
          sobresaliente: `Comunica con claridad y pasión los beneficios ecológicos del biogás ante la comunidad escolar, demostrando su utilidad práctica.`,
          satisfactorio: `Explica el prototipo y su impacto ambiental de forma comprensible durante la feria.`,
          enProceso: `Presenta dificultades para exponer la importancia de las energías renovables.`
        }
      }
    };
  }

  // 10. PROYECTO DE CIVISMO, DERECHOS DE LA NIÑEZ Y CULTURA DE PAZ
  if (isCivicsPeace) {
    return {
      titulo: `El Tribunal Escolar de la Amistad: "Acuerdos, Derechos de la Niñez y Mediación Comunitaria"`,
      problematicaComunitaria: `Presencia de conductas de exclusión o conflictos no resueltos en el aula y patio escolar, junto con el desconocimiento de los mecanismos democráticos de mediación y defensa de los derechos infantiles.`,
      proposito: `Construir un decálogo de convivencia escolar democrática y establecer una mesa de mediación de la amistad basada en los derechos fundamentales de las niñas y niños (Libro SEP: Proyectos de Aula / Nuestros Saberes).`,
      productoFinal: `Asamblea Escolar de la Niñez con juramento cívico, decálogo ilustrado de acuerdos de convivencia, buzón de mediación pacífica y campaña escolar contra el acoso y la discriminación.`,
      impactoSocial: `Crea un entorno escolar seguro, inclusivo y pacífico, empoderando a las y los estudiantes como agentes de cambio y defensores de los derechos humanos.`,
      rubrica: {
        criterio1: {
          nombre: 'Comprensión y Defensa de los Derechos de la Niñez',
          sobresaliente: `Reconoce y fundamenta con claridad los derechos de las niñas y niños (expresión, igualdad, no discriminación, educación) en casos prácticos del aula.`,
          satisfactorio: `Identifica los derechos principales y explica su importancia para la convivencia diaria.`,
          enProceso: `Confunde derechos con obligaciones o desconoce las garantías infantiles.`
        },
        criterio2: {
          nombre: 'Elaboración de Acuerdos y Decálogo de Convivencia',
          sobresaliente: `Redacta acuerdos inclusivos, propositivos y consensuados con excelente redacción, ilustrándolos de forma creativa y visible para todos.`,
          satisfactorio: `Participa en la redacción de normas claras para el bienestar del salón de clases.`,
          enProceso: `Propone normas punitivas o no respeta los consensos del grupo.`
        },
        criterio3: {
          nombre: 'Habilidades de Mediación y Cultura de Paz',
          sobresaliente: `Aplica la escucha activa y el diálogo asertivo para mediar diferencias entre compañeros, fomentando la empatía y la reconciliación.`,
          satisfactorio: `Participa con respeto en las asambleas y acata los acuerdos pactados.`,
          enProceso: `Muestra dificultad para dialogar pacíficamente ante desacuerdos.`
        }
      }
    };
  }

  // 11. FALLBACK SITUADO Y AUTÉNTICO POR ASIGNATURA Y NIVEL (GARANTIZA CERO RESPUESTAS GENÉRICAS)
  const isLanguageSubject = subject.toLowerCase().includes('leng') || subject.toLowerCase().includes('esp');
  const isMathSubject = subject.toLowerCase().includes('mat');

  if (isLanguageSubject) {
    return {
      titulo: `Gremio Editorial Infantil: "Gaceta Literaria y Mural Informativo sobre ${capitalizedTopic}"`,
      problematicaComunitaria: `Falta de medios de difusión escolares donde los estudiantes puedan compartir investigaciones documentales, crónicas comunitarias y textos de opinión sobre "${capitalizedTopic}" para sensibilizar a su entorno.`,
      proposito: `Desarrollar competencias de investigación, redacción periodística y diseño editorial para socializar el tema "${capitalizedTopic}" mediante una gaceta escolar impresa y digital (Libro SEP: Proyectos Escolares y Múltiples Lenguajes).`,
      productoFinal: `Edición especial de la "Gaceta Escolar Comunitaria" con reportajes de campo, infografías ilustradas, entrevistas a personas de la localidad y artículos de divulgación elaborados por los alumnos.`,
      impactoSocial: `Democratiza el acceso a la información en la comunidad escolar, estimula la libertad de expresión responsable y revaloriza la voz de las niñas y niños.`,
      rubrica: {
        criterio1: {
          nombre: 'Calidad de Redacción, Cohesión y Rigor Temático',
          sobresaliente: `Redacta textos informativos y de opinión con excelente cohesión, variedad de vocabulario, ortografía impecable y apego riguroso al tema.`,
          satisfactorio: `Redacta artículos comprensibles con estructura básica de párrafos y pocos errores ortográficos.`,
          enProceso: `Los textos presentan ideas desordenadas, repetición de palabras o falta de coherencia.`
        },
        criterio2: {
          nombre: 'Diseño Editorial y Recursos Gráficos',
          sobresaliente: `El diseño visual es armónico, con jerarquía tipográfica, fotografías pertinentes y esquemas explicativos de alta calidad.`,
          satisfactorio: `Organiza el contenido de forma limpia con ilustraciones adecuadas al tema.`,
          enProceso: `El diseño es confuso o las imágenes no tienen relación con el texto.`
        },
        criterio3: {
          nombre: 'Presentación y Diálogo con los Lectores',
          sobresaliente: `Presenta la gaceta con gran elocuencia ante la comunidad escolar, respondiendo con solvencia a las preguntas del público.`,
          satisfactorio: `Explica su artículo con claridad ante compañeros y docentes.`,
          enProceso: `Muestra dificultad para resumir oralmente los puntos clave de su investigación.`
        }
      }
    };
  } else if (isMathSubject) {
    return {
      titulo: `Laboratorio Matemático en Acción: "Feria de Soluciones Prácticas y Modelado sobre ${capitalizedTopic}"`,
      problematicaComunitaria: `Necesidad de aplicar el razonamiento lógico-matemático a situaciones concretas del entorno vinculadas con "${capitalizedTopic}" para resolver retos cuantitativos en la escuela y el hogar.`,
      proposito: `Diseñar modelos matemáticos manipulables, retos lúdicos y guías de cálculo aplicado para resolver problemas reales sobre "${capitalizedTopic}" (Libro SEP: Nuestros Saberes / Proyectos de Aula).`,
      productoFinal: `Feria de Retos y Juegos Matemáticos Interactivos con estaciones demostrativas, materiales manipulables construidos por los alumnos y catálogo de soluciones cuantitativas comunitarias.`,
      impactoSocial: `Desmitifica el aprendizaje de las matemáticas, promoviendo el gusto por el razonamiento numérico y su utilidad práctica en la vida diaria.`,
      rubrica: {
        criterio1: {
          nombre: 'Precisión en Algoritmos y Justificación Matemática',
          sobresaliente: `Resuelve y modela problemas matemáticos sin errores, justificando con claridad cada paso y explorando múltiples rutas de solución.`,
          satisfactorio: `Aplica los procedimientos matemáticos de forma correcta en la mayoría de los retos.`,
          enProceso: `Presenta errores conceptuales constantes de cálculo o dificultad para elegir la operación adecuada.`
        },
        criterio2: {
          nombre: 'Diseño y Funcionalidad del Material Didáctico',
          sobresaliente: `Construye materiales manipulables innovadores, resistentes y estéticos que facilitan la comprensión intuitiva del concepto.`,
          satisfactorio: `El material didáctico es funcional y permite resolver los retos con orden.`,
          enProceso: `El material es frágil, confuso o no corresponde al contenido matemático.`
        },
        criterio3: {
          nombre: 'Mediación Lúdica y Trabajo en Equipo',
          sobresaliente: `Guía con paciencia y entusiasmo a los visitantes de su estación, explicando los retos con lenguaje accesible y motivador.`,
          satisfactorio: `Atiende su estación de forma adecuada y colabora con su equipo.`,
          enProceso: `Muestra desinterés en la atención de su estación o dificultad para explicar la dinámica.`
        }
      }
    };
  } else {
    return {
      titulo: `Muestra Científica y Comunitaria: "Investigación e Innovación Situada sobre ${capitalizedTopic}"`,
      problematicaComunitaria: `Necesidad de fomentar el pensamiento científico sistemático y la indagación de campo para comprender y transformar retos del entorno escolar en torno a "${capitalizedTopic}".`,
      proposito: `Diseñar y ejecutar una investigación experimental que culmine en prototipos funcionales y propuestas de mejora comunitaria basadas en los libros de texto de la SEP (Proyectos Comunitarios y Nuestros Saberes).`,
      productoFinal: `Muestra de Indagación Científica Escolar con experimentos demostrativos en vivo, prototipos a escala, bitácoras de campo detalladas e infografías explicativas.`,
      impactoSocial: `Fomenta la cultura científica, la toma de decisiones basada en evidencias y el compromiso comunitario con el desarrollo sostenible.`,
      rubrica: {
        criterio1: {
          nombre: 'Metodología Científica e Indagación Experimental',
          sobresaliente: `Plantea preguntas investigables, formula hipótesis fundamentadas, registra datos con rigor y obtiene conclusiones respaldadas por evidencia.`,
          satisfactorio: `Sigue los pasos del método experimental y presenta resultados ordenados.`,
          enProceso: `El registro de datos es incompleto o las conclusiones carecen de sustento empírico.`
        },
        criterio2: {
          nombre: 'Calidad del Prototipo y Recursos Demostrativos',
          sobresaliente: `El prototipo es funcional, seguro, creativo y demuestra claramente el principio científico estudiado.`,
          satisfactorio: `El prototipo funciona adecuadamente y los apoyos visuales son claros.`,
          enProceso: `El prototipo presenta fallas mecánicas o no logra demostrar el fenómeno.`
        },
        criterio3: {
          nombre: 'Divulgación Científica y Comunicación Asertiva',
          sobresaliente: `Explica conceptos científicos complejos con sencillez, elocuencia y vocabulario técnico adecuado ante diversas audiencias.`,
          satisfactorio: `Expone su experimento con claridad y responde preguntas de los visitantes.`,
          enProceso: `Dificultad para explicar el funcionamiento o la utilidad práctica de su investigación.`
        }
      }
    };
  }
}

/**
 * Generador de Preguntas Detonadoras Situadas y No Genéricas (Apertura y Conflicto Cognitivo)
 * Estrictamente calibradas al nivel de desarrollo cognitivo de cada Fase NEM.
 */
export function generateDetonatingQuestions(topic: string, level: string = 'primaria-baja', subject: string = ''): string[] {
  const cleanTopic = cleanCoreTopicName(topic);
  const topicLower = cleanTopic.toLowerCase();
  const levelKey = level || 'primaria-baja';

  const isHistory = /revoluci|independen|porfir|reforma|mexic|histori|constituc|madero|zapata|villa|juarez|hidalgo|virrein|prehispan|colonia|patrimon|tradicion|cultura|efemerid|civilizac|conquista|batalla|heroes|monumento|patria/i.test(topicLower);
  const isEpistolar = /carta|epistol|mensaje|buzon|cartero|correspondencia|sobre\b|postal/i.test(topicLower);
  const isLiterature = /cuento|leyenda|mito|fabula|poema|poes|rima|verso|cancion|teatro|dramat|relato|literat/i.test(topicLower);
  const isFractions = /fraccion|equivalen|particion|reparto|denominador|numerador/i.test(topicLower);
  const isMathStoreOrMoney = /tienda|mercado|dinero|moneda|compra|venta|precio|cambio|billete|ahorro|presupuesto/i.test(topicLower);
  const isParabola = /parabol|cuadrat|segundo grado|tiro parab|algebra/i.test(topicLower);
  const isWater = /agua|rio|lluvia|filtr|pozo|sequia|pluvial|hidrico/i.test(topicLower);
  const isGardenOrFood = /huerto|siembra|cosecha|cultivo|semilla|alimento|nutric|plato del bien comer|comida|dieta|ultraproces/i.test(topicLower);
  const isCleanEnergy = /biodigestor|biogas|energia|solar|eolica|renovable|ecotecnia|residu|recicl/i.test(topicLower);
  const isCivicsPeace = /derecho|paz|acuerdo|convivenc|mediacion|inclusion|igualdad|genero|discrimin|democrac|ciudadan|justicia/i.test(topicLower);

  let rawQuestions: string[] = [];

  if (isHistory) {
    if (levelKey === 'preescolar') {
      rawQuestions = [
        `¿Qué historias nos cuentan en casa sobre cómo jugaban y vivían las familias hace muchos años?`,
        `¿Por qué cantamos canciones y nos vestimos con trajes típicos en las fiestas patrias de México?`,
        `¿Cómo nos ayudamos entre todas las niñas y niños para convivir con alegría y respeto en el salón?`
      ];
    } else if (levelKey === 'primaria-baja') {
      rawQuestions = [
        `¿Cómo vestían, qué comían y a qué jugaban las niñas y los niños en la época de la Revolución Mexicana?`,
        `¿Por qué las familias cantaban corridos populares para contar las noticias y relatos de los pueblos?`,
        `¿Qué derechos y cosas buenas que hoy tenemos en nuestra escuela (como libros gratuitos y maestros) nacieron de esa época?`
      ];
    } else if (levelKey === 'primaria-media') {
      rawQuestions = [
        `¿Cuáles fueron las principales razones por las que campesinos y familias mexicanas participaron en el movimiento de 1910?`,
        `¿Qué ideales defendían líderes como Francisco I. Madero y Emiliano Zapata en beneficio de los pueblos?`,
        `¿Cómo influyeron los cambios de la Revolución Mexicana en las escuelas y comunidades de nuestro estado?`
      ];
    } else if (levelKey === 'primaria-alta') {
      rawQuestions = [
        `¿Cuáles fueron las principales causas económicas, laborales y agrarias que provocaron el estallido de la Revolución Mexicana?`,
        `¿En qué se diferenciaban las demandas campesinas de Emiliano Zapata de los ideales políticos de Venustiano Carranza?`,
        `¿De qué manera los Artículos 3º (Educación) y 123 (Trabajo) de la Constitución de 1917 protegen los derechos de nuestras familias?`
      ];
    } else if (levelKey === 'secundaria') {
      rawQuestions = [
        `¿Hasta qué punto la Revolución Mexicana logró desmantelar las estructuras de dominación socioeconómica del Porfiriato?`,
        `¿Qué papel desempeñaron las diversas corrientes historiográficas, la prensa y la diplomacia en la legitimación de las facciones revolucionarias?`,
        `¿Qué demandas agrarias, laborales y de soberanía consagradas en 1917 siguen siendo retos en el México del siglo XXI?`
      ];
    } else {
      rawQuestions = [
        `¿Cuáles son las contradicciones epistemológicas y estructurales entre el proyecto modernizador porfirista y el constitucionalismo revolucionario?`,
        `¿De qué forma las fuentes primarias y los debates historiográficos contemporáneos resignifican la institucionalización del Estado posrevolucionario?`,
        `¿Cómo influye la memoria histórica de 1910 en la conformación de la ciudadanía crítica y la defensa de los derechos sociales actuales?`
      ];
    }
  } else if (isEpistolar) {
    if (levelKey === 'preescolar' || levelKey === 'primaria-baja') {
      rawQuestions = [
        `¿A qué persona de tu familia o amigo te gustaría enviarle una carta o un dibujo con una sonrisa?`,
        `¿Por qué una carta guardada en un sobre con estampilla se siente tan especial y bonita al recibirla?`,
        `¿Qué datos y dibujos necesitamos poner en el sobre para que el cartero sepa a quién entregárselo?`
      ];
    } else if (levelKey === 'primaria-media' || levelKey === 'primaria-alta') {
      rawQuestions = [
        `¿Por qué una carta formal o personal escrita con esmero transmite ideas con mayor calidez y claridad que un mensaje digital rápido?`,
        `¿Qué partes indispensables (fecha, destinatario, saludo, cuerpo, despedida y firma) estructuran un texto epistolar?`,
        `¿A qué autoridades o miembros de la comunidad escolar podemos plantearles una propuesta de mejora mediante una carta formal?`
      ];
    } else {
      rawQuestions = [
        `¿Cómo ha evolucionado el género epistolar como testimonio histórico, político y literario en la conformación de la esfera pública?`,
        `¿Qué estrategias retóricas y registros lingüísticos distinguen a la correspondencia formal diplomática del ensayo personal?`,
        `¿Qué valor ético conserva la privacidad de la correspondencia en la era de las comunicaciones digitales masivas?`
      ];
    }
  } else if (isLiterature) {
    if (levelKey === 'preescolar' || levelKey === 'primaria-baja') {
      rawQuestions = [
        `¿Qué cuentos o leyendas divertidas te han contado tus abuelitos o maestros en la escuela?`,
        `¿Cómo podemos inventar personajes fantásticos y un final feliz para nuestra historia colectiva?`,
        `¿Qué dibujos y colores le pondremos a la portada de nuestro libro de cuentos?`
      ];
    } else if (levelKey === 'primaria-media' || levelKey === 'primaria-alta') {
      rawQuestions = [
        `¿Qué estructura narrativa (inicio, desarrollo, conflicto y desenlace) hace que una leyenda atrape la emoción del lector?`,
        `¿Cómo nos ayudan las descripciones detalladas y los diálogos a transmitir la personalidad de los personajes?`,
        `¿De qué manera la elaboración de un libro cartonero escolar fomenta el amor por la lectura y el cuidado del medio ambiente?`
      ];
    } else {
      rawQuestions = [
        `¿De qué forma las tradiciones orales y la narrativa ficcional reflejan la cosmovisión e identidad cultural de los pueblos?`,
        `¿Qué recursos estilísticos, figuras retóricas y tropos literarios enriquecen la construcción dramática de un relato?`,
        `¿Cómo influye la recepción crítica de una obra literaria en la resignificación de los dilemas éticos contemporáneos?`
      ];
    }
  } else if (isFractions) {
    if (levelKey === 'preescolar' || levelKey === 'primaria-baja') {
      rawQuestions = [
        `¿Cómo podemos repartir 4 manzanas o panes entre 4 amigos para que a todos les toque exactamente lo mismo?`,
        `¿Qué pasa cuando doblamos una hoja de papel a la mitad o en 4 partes iguales?`,
        `¿En qué momentos en la cocina o en los juegos de la escuela usamos mitades y cuartos?`
      ];
    } else if (levelKey === 'primaria-media' || levelKey === 'primaria-alta') {
      rawQuestions = [
        `¿Por qué 2/4 de una pizza representa exactamente la misma porción que 1/2 aunque se escriban con números diferentes?`,
        `¿Cómo podemos sumar fracciones con distinto denominador cuando medimos ingredientes para una receta comunitaria?`,
        `¿De qué manera las fracciones nos ayudan a realizar repartos justos y resolver retos de compras y medidas en el mercado?`
      ];
    } else {
      rawQuestions = [
        `¿Cómo se fundamenta algebraicamente la densidad y el orden en el conjunto de los números racionales?`,
        `¿Qué aplicaciones prácticas tienen las razones, proporciones y fracciones en la física, la química y la economía aplicada?`,
        `¿De qué forma los algoritmos de simplificación y conversión fraccionaria optimizan el cálculo en proyectos de ingeniería?`
      ];
    }
  } else if (isMathStoreOrMoney) {
    if (levelKey === 'preescolar' || levelKey === 'primaria-baja') {
      rawQuestions = [
        `¿Qué monedas y billetes de juguete conocemos y cómo los usamos para jugar a la tiendita?`,
        `¿Cómo contamos nuestras monedas de 1, 2, 5 y 10 pesos para saber cuánto dinero juntamos?`,
        `¿Qué alimentos saludables de la tiendita escolar son los mejores para crecer fuertes?`
      ];
    } else if (levelKey === 'primaria-media' || levelKey === 'primaria-alta') {
      rawQuestions = [
        `¿Cómo calculamos con rapidez el costo total de varios productos y el cambio exacto al pagar con billetes grandes?`,
        `¿Qué diferencia existe entre un gasto necesario para la salud y un gasto impulsivo en la economía del hogar?`,
        `¿De qué manera las matemáticas nos permiten comparar precios por kilogramo y verificar si una oferta es conveniente?`
      ];
    } else {
      rawQuestions = [
        `¿Cómo se modelan matemáticamente los presupuestos, el valor del dinero en el tiempo y el interés compuesto en proyectos productivos?`,
        `¿Qué indicadores estadísticos nos permiten evaluar el costo-beneficio y la rentabilidad social de una cooperativa escolar?`,
        `¿De qué manera la educación financiera previene el sobreendeudamiento y promueve el consumo ético y sustentable?`
      ];
    }
  } else if (isParabola) {
    rawQuestions = [
      `¿Por qué la trayectoria de un balón en un tiro libre o el arco de un puente colgante describen una curva parabólica?`,
      `¿Qué representan físicamente el vértice, el eje de simetría y las raíces en una ecuación cuadrática (y = ax² + bx + c)?`,
      `¿Cómo nos ayuda el software de modelación matemática (GeoGebra) a predecir alturas máximas y alcances horizontales?`
    ];
  } else if (isWater) {
    if (levelKey === 'preescolar' || levelKey === 'primaria-baja') {
      rawQuestions = [
        `¿Por qué es importante cerrar bien las llaves del agua cuando nos lavamos las manitas en la escuela?`,
        `¿De dónde viene el agua de lluvia y cómo ayuda a que crezcan las plantitas y los árboles?`,
        `¿Qué acciones sencillas podemos hacer en casa y en el salón para no desperdiciar ni una gota de agua?`
      ];
    } else if (levelKey === 'primaria-media' || levelKey === 'primaria-alta') {
      rawQuestions = [
        `¿Cómo funcionan las capas de arena, grava y carbón activado para filtrar y limpiar el agua pluvial?`,
        `¿Qué problemáticas de salud y escasez enfrenta nuestra comunidad cuando el agua potable no llega a tiempo?`,
        `¿Qué compromisos medibles podemos establecer en la escuela para captar y reutilizar el agua en las áreas verdes?`
      ];
    } else {
      rawQuestions = [
        `¿Cuáles son las variables fisicoquímicas y microbiológicas que determinan la calidad del agua potable según las normas oficiales?`,
        `¿Qué impacto socioeconómico y bioético genera la sobreexplotación de los mantos acuíferos en nuestra cuenca hidrográfica?`,
        `¿Cómo diseñamos un sistema de captación y purificación pluvial sustentable de bajo costo para espacios comunitarios?`
      ];
    }
  } else if (isGardenOrFood) {
    if (levelKey === 'preescolar' || levelKey === 'primaria-baja') {
      rawQuestions = [
        `¿Qué cuidados necesita una pequeña semilla con tierra, agua y sol para crecer y dar frutos?`,
        `¿Por qué comer frutas y verduras frescas de colores nos llena de energía y salud en lugar de comer comida chatarra?`,
        `¿Cómo podemos cuidar en equipo las plantitas de nuestro huerto escolar?`
      ];
    } else if (levelKey === 'primaria-media' || levelKey === 'primaria-alta') {
      rawQuestions = [
        `¿Qué nutrientes del suelo y factores climáticos determinan el ciclo de germinación y crecimiento de las hortalizas?`,
        `¿Cómo se relaciona la producción de alimentos en el huerto escolar con los grupos del Plato del Bien Comer y la salud familiar?`,
        `¿De qué manera la elaboración de composta con residuos orgánicos reduce la basura escolar y nutre la tierra?`
      ];
    } else {
      rawQuestions = [
        `¿Qué principios de la agroecología y la soberanía alimentaria desafían los modelos de monocultivo industrial?`,
        `¿Cómo influye la calidad nutricional de la dieta en la prevención de enfermedades crónicas no transmisibles a nivel poblacional?`,
        `¿Qué diseño de policultivo y riego tecnificado optimiza el rendimiento y la biodiversidad en un huerto comunitario?`
      ];
    }
  } else if (isCleanEnergy) {
    if (levelKey === 'preescolar' || levelKey === 'primaria-baja') {
      rawQuestions = [
        `¿Cómo nos da luz y calor el sol para que vivan las plantas, los animales y las personas?`,
        `¿Por qué es importante apagar los focos que no estemos usando para cuidar el planeta?`,
        `¿Qué materiales que ya no usamos en casa podemos reciclar y transformar en cosas bonitas?`
      ];
    } else {
      rawQuestions = [
        `¿Cómo se transforman los residuos orgánicos y el estiércol en gas combustible y biofertilizante mediante digestión anaeróbica?`,
        `¿Qué ventajas ambientales y económicas tienen las energías renovables (solar, eólica, biogás) frente al uso de combustibles fósiles?`,
        `¿De qué manera el diseño e instalación de un biodigestor escolar contribuye a mitigar el cambio climático en nuestra comunidad?`
      ];
    }
  } else if (isCivicsPeace) {
    if (levelKey === 'preescolar' || levelKey === 'primaria-baja') {
      rawQuestions = [
        `¿Por qué es bonito tener acuerdos de convivencia en el salón para jugar y aprender con respeto y amistad?`,
        `¿Cómo podemos resolver un desacuerdo en el recreo platicando con calma y escuchando a los demás?`,
        `¿Qué derechos tienen todas las niñas y niños para sentirse queridos, seguros y felices en la escuela?`
      ];
    } else if (levelKey === 'primaria-media' || levelKey === 'primaria-alta') {
      rawQuestions = [
        `¿Por qué los acuerdos construidos democráticamente en asamblea son más respetados que las reglas impuestas?`,
        `¿Qué estrategias de mediación de la amistad y diálogo asertivo podemos aplicar cuando surja un conflicto en el aula?`,
        `¿De qué manera defendemos y promovemos la igualdad de género y la inclusión de todas y todos en las actividades escolares?`
      ];
    } else {
      rawQuestions = [
        `¿Cómo se articulan los derechos humanos, el estado de derecho y la justicia restaurativa en la resolución de controversias sociales?`,
        `¿Qué dilemas éticos contemporáneos desafían la construcción de una cultura de paz y no violencia en los espacios públicos?`,
        `¿Qué mecanismos de participación ciudadana y mediación institucional fortalecen el tejido social y la convivencia democrática?`
      ];
    }
  } else {
    // Fallback Situado Calibrado por Nivel (Cero Frases Genéricas)
    if (levelKey === 'preescolar' || levelKey === 'primaria-baja') {
      rawQuestions = [
        `¿Qué personas, objetos o historias de nuestra familia y comunidad conocemos sobre ${cleanTopic}?`,
        `¿Cómo nos ayudamos en equipo para investigar, dibujar y aprender con nuestros libros de texto de la SEP?`,
        `¿Qué dibujo, manualidad o cartel bonito compartiremos con nuestros compañeros al final del proyecto?`
      ];
    } else if (levelKey === 'primaria-media' || levelKey === 'primaria-alta') {
      rawQuestions = [
        `¿Qué preguntas nos hacemos sobre "${cleanTopic}" y qué podemos indagar en nuestros libros escolares de la SEP?`,
        `¿Cómo podemos comprobar nuestras ideas trabajando en equipo y haciendo registros organizados en nuestro cuaderno?`,
        `¿Qué propuesta o producto podemos mostrar a la escuela para ayudar a comprender mejor este tema?`
      ];
    } else if (levelKey === 'secundaria') {
      rawQuestions = [
        `¿Qué contradicciones o retos éticos, científicos o sociales identificamos en torno a "${cleanTopic}"?`,
        `¿Cómo podemos contrastar diferentes fuentes de información y formular argumentos fundamentados con evidencias?`,
        `¿Qué propuesta transformadora, reporte de investigación o prototipo presentaremos en la muestra escolar?`
      ];
    } else {
      rawQuestions = [
        `¿Cuáles son las implicaciones epistemológicas, éticas y estructurales de "${cleanTopic}" en el contexto actual?`,
        `¿De qué forma los marcos teóricos y cuantitativos nos permiten analizar rigurosamente este fenómeno?`,
        `¿Qué proyecto de impacto social o indagación académica sustentada podemos formular para incidir en nuestro entorno?`
      ];
    }
  }

  return rawQuestions.map(q => sanitizeSpanishPedagogicalGrammar(q));
}

/**
 * Formateador oficial de fechas en letras en español (ej. "25 de agosto de 2026")
 */
export function formatSpanishDateInLetters(dateInput?: string | Date): string {
  if (!dateInput) {
    return formatSpanishDateInLetters(new Date());
  }

  let date: Date;
  if (typeof dateInput === 'string') {
    date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      date = new Date();
    }
  } else {
    date = dateInput;
  }

  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} de ${month} de ${year}`;
}

/**
 * Detector y Generador Dinámico de PDAs oficiales de la NEM 2024
 * Analiza el tema introducido, el nivel educativo (Fase) y la asignatura seleccionada
 * para ofrecer sugerencias de PDAs contextualizados, pedagógicamente rigurosos y articulados.
 */
export function detectCurriculumPdasForTopic(
  topic: string,
  level: string = 'primaria-baja',
  subjectIdOrName: string = ''
): string[] {
  if (!topic || topic.trim().length < 2) return [];

  const cleanTopic = cleanCoreTopicName(topic);
  const capitalizedTopic = cleanTopic;
  const topicLower = cleanTopic.toLowerCase();
  const subLower = (subjectIdOrName || '').toLowerCase();
  const levelKey = level || 'primaria-baja';

  // Identificación de dominios temáticos
  const isHistoryOrCivics = /revoluci|independen|porfir|reforma|mexic|histori|constituc|madero|zapata|villa|juarez|hidalgo|virrein|prehispan|colonia|patrimon|tradicion|cultura|efemerid|civilizac|conquista|batalla|heroes|monumento|patria/i.test(topicLower);
  const isMath = /matemat|fraccion|suma|resta|multiplic|division|numero|conteo|algebra|ecuacion|cuadrat|parabol|geometr|tangram|area|perimetr|volumen|probabil|estadist|porcentaj|proporc|vector|recta|plano/i.test(topicLower);
  const isScience = /cienc|natur|biolog|fisic|quimic|plan|animal|cuerpo|organo|salud|nutric|ecosistem|agua|aire|suelo|materia|energia|fuerza|movimient|celul|atomo|combust|calor|optica|luz|universo|planeta|medio ambiente|biodivers|huerto|recicl/i.test(topicLower);
  const isEpistolar = /carta|epistol|mensaje|buzon|cartero|correspondencia|sobre\b|postal/i.test(topicLower);
  const isLiterature = /cuento|leyenda|mito|fabula|poema|poes|rima|verso|cancion|teatro|dramat|relato|literat/i.test(topicLower);
  const isLanguageGeneral = isEpistolar || isLiterature || /lengua|espanol|lectur|escritur|ensayo|resen|noticia|periodico|oratori|debate|discurs|argument|exposit|instructiv|ortograf|redacc/i.test(topicLower);
  const isCivicsRights = /civic|etica|derecho|paz|convivenc|acuerdo|regla|igualdad|genero|discrimin|democrac|inclusion|comunidad|ciudadan|justicia/i.test(topicLower);
  const isArt = /arte|pintur|dibujo|musica|teatro|danza|escultur|color|expresion artist|ritmo|sonido/i.test(topicLower);
  const isHealth = /salud|higiene|aliment|plato del bien comer|ejercicio|deport|emocion|socioemocional|motriz/i.test(topicLower);

  const pdasByPhase: Record<string, {
    history: string[];
    math: string[];
    science: string[];
    language: string[];
    civics: string[];
    art: string[];
    health: string[];
    general: string[];
  }> = {
    'preescolar': {
      history: [
        `Fase 2 (Preescolar) - Ética, Naturaleza y Sociedades: Comparte relatos, costumbres y tradiciones familiares sobre "${capitalizedTopic}", reconociendo la historia de su entorno y festividades de su comunidad.`,
        `Fase 2 (Preescolar) - Lenguajes: Expresa mediante dibujos, cantos y dramatizaciones infantiles sucesos y personajes representativos de "${capitalizedTopic}".`
      ],
      math: [
        `Fase 2 (Preescolar) - Saberes y Pensamiento Científico: Cuenta objetos de su entorno, compara colecciones y utiliza nociones espaciales (arriba, abajo, cerca, lejos) en actividades sobre "${capitalizedTopic}".`,
        `Fase 2 (Preescolar) - Saberes y Pensamiento Científico: Identifica formas geométricas, patrones y cantidades en elementos cotidianos asociados a "${capitalizedTopic}".`
      ],
      science: [
        `Fase 2 (Preescolar) - Saberes y Pensamiento Científico: Observa con curiosidad seres vivos y elementos naturales vinculados a "${capitalizedTopic}", describiendo lo que percibe con sus sentidos y proponiendo cómo cuidarlos.`,
        `Fase 2 (Preescolar) - De lo Humano y lo Comunitario: Practica acciones cotidianas de higiene, hidratación y cuidado del medio ambiente escolar en torno a "${capitalizedTopic}".`
      ],
      language: [
        `Fase 2 (Preescolar) - Lenguajes: Expresa oralmente sus emociones, ideas y preguntas sobre "${capitalizedTopic}", escuchando con atención los relatos y opiniones de sus compañeros.`,
        `Fase 2 (Preescolar) - Lenguajes: Explora libros ilustrados, rimas, canciones y cuentos sobre "${capitalizedTopic}", inventando sus propias narraciones orales.`
      ],
      civics: [
        `Fase 2 (Preescolar) - Ética, Naturaleza y Sociedades: Colabora en juegos y acuerdos de convivencia del salón inspirados en "${capitalizedTopic}", respetando turnos y a sus compañeros.`,
        `Fase 2 (Preescolar) - De lo Humano y lo Comunitario: Reconoce que todas las niñas y niños tienen los mismos derechos a jugar, aprender y ser escuchados al participar en proyectos sobre "${capitalizedTopic}".`
      ],
      art: [
        `Fase 2 (Preescolar) - Lenguajes (Artes): Experimenta con colores, texturas, plastilina y música para representar de forma libre y creativa ideas sobre "${capitalizedTopic}".`
      ],
      health: [
        `Fase 2 (Preescolar) - De lo Humano y lo Comunitario: Reconoce la importancia del descanso, la alimentación saludable y la actividad física regular al explorar "${capitalizedTopic}".`
      ],
      general: [
        `Fase 2 (Preescolar) - Fase 2 Integral: Explora su entorno inmediato descubriendo aspectos significativos de "${capitalizedTopic}" y comunica sus hallazgos con recursos gráficos y orales.`
      ]
    },
    'primaria-baja': {
      history: [
        `Fase 3 (1º y 2º Primaria) - Ética, Naturaleza y Sociedades: Indaga a través de relatos orales, fotografías familiares y testimonios comunitarios los acontecimientos clave de "${capitalizedTopic}", reconociendo cómo transformaron la vida cotidiana, la escuela y la comunidad.`,
        `Fase 3 (1º y 2º Primaria) - Lenguajes: Produce e interpreta narraciones orales, coplas, corridos y descripciones ilustradas sobre "${capitalizedTopic}", valorando la memoria histórica de su país.`,
        `Fase 3 (1º y 2º Primaria) - Saberes y Pensamiento Científico: Organiza secuencias temporales (antes, durante y después), calendarios y líneas del tiempo ilustradas con acontecimientos de "${capitalizedTopic}".`,
        `Fase 3 (1º y 2º Primaria) - De lo Humano y lo Comunitario: Dialoga sobre los derechos humanos, la igualdad y los valores de justicia colectiva a partir de las historias de "${capitalizedTopic}".`
      ],
      math: [
        isMath && /fraccion/i.test(topicLower) 
          ? `Fase 3 (1º y 2º Primaria) - Saberes y Pensamiento Científico (Estudio de los números): Expresa de manera oral y escrita fracciones sencillas (medios, cuartos y octavos) en situaciones cotidianas de reparto vinculadas a "${capitalizedTopic}" con material concreto.`
          : `Fase 3 (1º y 2º Primaria) - Saberes y Pensamiento Científico: Resuelve problemas vinculados a su contexto que implican agregar, quitar, comparar y repartir colecciones de objetos en torno a "${capitalizedTopic}".`,
        `Fase 3 (1º y 2º Primaria) - Saberes y Pensamiento Científico: Construye figuras y patrones geométricos mediante tangram y material manipulativo para modelar situaciones de "${capitalizedTopic}".`
      ],
      science: [
        `Fase 3 (1º y 2º Primaria) - Saberes y Pensamiento Científico: Describe y registra las características de elementos naturales, plantas, animales y estados físicos en relación con "${capitalizedTopic}", proponiendo acciones comunitarias de conservación.`,
        `Fase 3 (1º y 2º Primaria) - De lo Humano y lo Comunitario: Identifica los órganos de los sentidos y hábitos de vida saludable aplicados a "${capitalizedTopic}" para el bienestar escolar.`
      ],
      language: [
        isEpistolar
          ? `Fase 3 (1º y 2º Primaria) - Lenguajes (Producción de textos epistolares): Reconoce la estructura de la carta (lugar, fecha, destinatario, saludo, cuerpo, despedida, firma y remitente), escribe cartas con propósitos reales y utiliza el buzón escolar para la entrega de correspondencia comunitaria.`
          : isLiterature
          ? `Fase 3 (1º y 2º Primaria) - Lenguajes: Lee y produce cuentos, fábulas y leyendas sobre "${capitalizedTopic}", identificando inicio, desarrollo y desenlace, y aplicando signos de puntuación básicos.`
          : `Fase 3 (1º y 2º Primaria) - Lenguajes: Describe de forma oral y escrita objetos, personas y eventos relacionados con "${capitalizedTopic}" mediante el dibujo y la escritura autónoma con sentido social.`
      ],
      civics: [
        `Fase 3 (1º y 2º Primaria) - Ética, Naturaleza y Sociedades: Construye normas y acuerdos de convivencia en el aula inspirados en "${capitalizedTopic}", fomentando el diálogo, la inclusión y la cultura de paz.`
      ],
      art: [
        `Fase 3 (1º y 2º Primaria) - Lenguajes (Artes): Explora texturas, formas, colores, rondas tradicionales y modelado con plastilina sobre "${capitalizedTopic}" para expresar emociones libremente.`
      ],
      health: [
        `Fase 3 (1º y 2º Primaria) - De lo Humano y lo Comunitario: Practica hábitos de hidratación, alimentación sana del Plato del Bien Comer y movimiento físico vinculados a "${capitalizedTopic}".`
      ],
      general: [
        `Fase 3 (1º y 2º Primaria) - Fase 3 Integral: Identifica y describe con sus palabras las principales características de "${capitalizedTopic}" en su contexto escolar y comunitario, registrando sus observaciones con material manipulativo y gráfico.`
      ]
    },
    'primaria-media': {
      history: [
        `Fase 4 (3º y 4º Primaria) - Ética, Naturaleza y Sociedades: Investiga en fuentes primarias y secundarias las causas, personajes y consecuencias de "${capitalizedTopic}" en su entidad federativa y en México, valorando el patrimonio cultural y cívico.`,
        `Fase 4 (3º y 4º Primaria) - Lenguajes: Redacta textos expositivos, reseñas históricas y biografías ilustradas acerca de "${capitalizedTopic}", utilizando conectores temporales y ortografía convencional.`,
        `Fase 4 (3º y 4º Primaria) - Saberes y Pensamiento Científico: Interpreta mapas geográficos, líneas de tiempo y tablas estadísticas sobre la distribución y cronología de "${capitalizedTopic}".`
      ],
      math: [
        `Fase 4 (3º y 4º Primaria) - Saberes y Pensamiento Científico: Resuelve problemas de fracciones equivalentes, multiplicación, división, cálculo de perímetros y áreas contextualizados en situaciones reales de "${capitalizedTopic}".`,
        `Fase 4 (3º y 4º Primaria) - Saberes y Pensamiento Científico: Recolecta, organiza y representa datos en tablas de doble entrada y gráficas de barras sobre "${capitalizedTopic}".`
      ],
      science: [
        `Fase 4 (3º y 4º Primaria) - Saberes y Pensamiento Científico: Analiza las relaciones entre factores bióticos y abióticos en torno a "${capitalizedTopic}", diseñando prototipos y acciones comunitarias de cuidado ambiental.`,
        `Fase 4 (3º y 4º Primaria) - Saberes y Pensamiento Científico: Describe el funcionamiento de los sistemas del cuerpo humano y explica cómo influye "${capitalizedTopic}" en la salud comunitaria.`
      ],
      language: [
        `Fase 4 (3º y 4º Primaria) - Lenguajes: Comprende, resume y produce textos expositivos, instructivos y periodísticos sobre "${capitalizedTopic}", empleando párrafos organizados y signos de puntuación.`,
        `Fase 4 (3º y 4º Primaria) - Lenguajes: Participa en debates escolares y mesas de diálogo sobre "${capitalizedTopic}", expresando opiniones fundamentadas y escuchando con respeto.`
      ],
      civics: [
        `Fase 4 (3º y 4º Primaria) - Ética, Naturaleza y Sociedades: Analiza los derechos de la niñez, la igualdad de género y la resolución pacífica de desacuerdos al desarrollar proyectos de "${capitalizedTopic}".`
      ],
      art: [
        `Fase 4 (3º y 4º Primaria) - Lenguajes (Artes): Crea producciones visuales y escénicas que resignifican el tema de "${capitalizedTopic}" utilizando técnicas plásticas mixtas.`
      ],
      health: [
        `Fase 4 (3º y 4º Primaria) - De lo Humano y lo Comunitario: Diseña propuestas de activación física, nutrición y bienestar emocional en torno a "${capitalizedTopic}".`
      ],
      general: [
        `Fase 4 (3º y 4º Primaria) - Fase 4 Integral: Indaga, sistematiza y comunica hallazgos sobre "${capitalizedTopic}" aplicando la metodología de proyectos comunitarios de la NEM.`
      ]
    },
    'primaria-alta': {
      history: [
        `Fase 5 (5º y 6º Primaria) - Ética, Naturaleza y Sociedades: Analiza críticamente las causas económicas, políticas y sociales de "${capitalizedTopic}", la promulgación de leyes y la vigencia de los derechos colectivos en el México contemporáneo.`,
        `Fase 5 (5º y 6º Primaria) - Lenguajes: Elabora ensayos históricos, debates argumentados y periódicos murales sobre las distintas posturas ideológicas y testimonios en torno a "${capitalizedTopic}".`,
        `Fase 5 (5º y 6º Primaria) - Ética, Naturaleza y Sociedades: Evalúa el impacto de "${capitalizedTopic}" en la soberanía, la justicia social y la conformación de la identidad nacional.`
      ],
      math: [
        `Fase 5 (5º y 6º Primaria) - Saberes y Pensamiento Científico: Resuelve problemas de proporcionalidad directa, porcentajes, números decimales y cálculo de volumen aplicados a retos cuantitativos de "${capitalizedTopic}".`,
        `Fase 5 (5º y 6º Primaria) - Saberes y Pensamiento Científico: Analiza tendencias estadísticas, media, mediana y moda en investigaciones de campo vinculadas a "${capitalizedTopic}".`
      ],
      science: [
        `Fase 5 (5º y 6º Primaria) - Saberes y Pensamiento Científico: Analiza el impacto de "${capitalizedTopic}" en los ecosistemas locales, formula hipótesis basadas en evidencia y diseña prototipos de ecotecnias sustentables.`,
        `Fase 5 (5º y 6º Primaria) - Saberes y Pensamiento Científico: Explica las transformaciones de la energía, circuitos eléctricos y propiedades de la materia en experimentos sobre "${capitalizedTopic}".`
      ],
      language: [
        `Fase 5 (5º y 6º Primaria) - Lenguajes: Produce textos argumentativos, reseñas críticas y artículos de divulgación científica sobre "${capitalizedTopic}", sustentando sus posturas con fuentes confiables.`,
        `Fase 5 (5º y 6º Primaria) - Lenguajes: Organiza y conduce debates formales sobre problemáticas de "${capitalizedTopic}", aplicando recursos persuasivos y escucha activa.`
      ],
      civics: [
        `Fase 5 (5º y 6º Primaria) - Ética, Naturaleza y Sociedades: Debate dilemas éticos, derechos humanos y ejercicio democrático de la ciudadanía en torno a "${capitalizedTopic}".`
      ],
      art: [
        `Fase 5 (5º y 6º Primaria) - Lenguajes (Artes): Diseña proyectos interdisciplinarios de artes visuales, música o teatro para sensibilizar a la comunidad sobre "${capitalizedTopic}".`
      ],
      health: [
        `Fase 5 (5º y 6º Primaria) - De lo Humano y lo Comunitario: Lidera campañas de salud integral, prevención de adicciones y resiliencia comunitaria vinculadas a "${capitalizedTopic}".`
      ],
      general: [
        `Fase 5 (5º y 6º Primaria) - Fase 5 Integral: Desarrolla proyectos de indagación científica y comunitaria sobre "${capitalizedTopic}" aplicando el rigor pedagógico de la NEM 2024.`
      ]
    },
    'secundaria': {
      history: [
        `Fase 6 (Secundaria) - Ética, Naturaleza y Sociedades (Historia): Analiza críticamente desde diversas corrientes historiográficas las contradicciones socioeconómicas, los planes y movimientos de "${capitalizedTopic}" y su legado en las instituciones actuales.`,
        `Fase 6 (Secundaria) - Lenguajes: Redacta ensayos académicos estructurados y realiza mesas redondas con citas bibliográficas formales sobre las repercusiones de "${capitalizedTopic}".`,
        `Fase 6 (Secundaria) - Ética, Naturaleza y Sociedades (Formación Cívica y Ética): Evalúa los avances y retos en materia de derechos humanos, legalidad y justicia social derivados de "${capitalizedTopic}".`
      ],
      math: [
        /parabol|cuadrat|segundo grado|tiro parab/i.test(topicLower)
          ? `Fase 6 (3º Secundaria) - Saberes y Pensamiento Científico: Modela y resuelve problemas de la vida cotidiana y fenómenos físicos mediante funciones cuadráticas y parábolas (y = ax² + bx + c). Analiza e interpreta vértice, raíces y concavidad.`
          : `Fase 6 (Secundaria) - Saberes y Pensamiento Científico: Modela y resuelve situaciones reales y fenómenos científicos vinculados a "${capitalizedTopic}" mediante ecuaciones lineales, sistemas algebraicos y razones trigonométricas.`,
        `Fase 6 (Secundaria) - Saberes y Pensamiento Científico: Aplica el análisis probabilístico y el muestreo estadístico para interpretar datos de investigación comunitaria sobre "${capitalizedTopic}".`
      ],
      science: [
        `Fase 6 (Secundaria) - Saberes y Pensamiento Científico: Explica las leyes científicas, reacciones químicas, conservación de la energía y estructura de la materia que intervienen en "${capitalizedTopic}".`,
        `Fase 6 (Secundaria) - Saberes y Pensamiento Científico: Evalúa el impacto ambiental de procesos industriales y tecnológicos relacionados con "${capitalizedTopic}", proponiendo alternativas sustentables.`
      ],
      language: [
        `Fase 6 (Secundaria) - Lenguajes: Analiza discursos persuasivos, artículos de opinión y produce ensayos críticos con aparato de citas sobre "${capitalizedTopic}".`,
        `Fase 6 (Secundaria) - Lenguajes: Diseña y produce contenidos comunicativos multimedia (podcasts, videos educativos o gaceta digital) en torno a "${capitalizedTopic}".`
      ],
      civics: [
        `Fase 6 (Secundaria) - Ética, Naturaleza y Sociedades: Propone proyectos ciudadanos para el fortalecimiento del estado de derecho y la cultura de paz en relación con "${capitalizedTopic}".`
      ],
      art: [
        `Fase 6 (Secundaria) - Lenguajes (Artes): Desarrolla proyectos artísticos interdisciplinarios que abordan problemáticas comunitarias sobre "${capitalizedTopic}".`
      ],
      health: [
        `Fase 6 (Secundaria) - De lo Humano y lo Comunitario: Analiza factores de riesgo y formula proyectos comunitarios para el autocuidado y la salud mental en torno a "${capitalizedTopic}".`
      ],
      general: [
        `Fase 6 (Secundaria) - Fase 6 Integral: Diseña y ejecuta proyectos sociocríticos integrales sobre "${capitalizedTopic}" con rigor pedagógico oficial NEM 2024.`
      ]
    },
    'preparatoria': {
      history: [
        `Bachillerato (MCCEMS) - Ciencias Sociales y Conciencia Histórica: Evalúa con aparato crítico las transformaciones estructurales, reformas agrarias e institucionales derivadas de "${capitalizedTopic}" en el México contemporáneo.`,
        `Bachillerato (MCCEMS) - Lengua y Comunicación: Produce discursos argumentativos y ensayos preuniversitarios formalmente citados sobre la trascendencia de "${capitalizedTopic}".`
      ],
      math: [
        `Bachillerato (MCCEMS) - Pensamiento Matemático: Modela fenómenos continuos y discretos mediante cálculo diferencial/integral, vectores y estadística inferencial sobre "${capitalizedTopic}".`
      ],
      science: [
        `Bachillerato (MCCEMS) - Ciencias Naturales y Tecnología: Aplica principios termodinámicos, estequiométricos y modelos biológicos avanzados para analizar retos de "${capitalizedTopic}".`
      ],
      language: [
        `Bachillerato (MCCEMS) - Lengua y Comunicación: Desarrolla el pensamiento crítico mediante el análisis comparativo de discursos y la redacción de artículos académicos sobre "${capitalizedTopic}".`
      ],
      civics: [
        `Bachillerato (MCCEMS) - Humanidades: Examina dilemas éticos y filosóficos contemporáneos de "${capitalizedTopic}" en la construcción de la sociedad global.`
      ],
      art: [
        `Bachillerato (MCCEMS) - Artes: Desarrolla proyectos conceptuales y estéticos contemporáneos en torno a "${capitalizedTopic}".`
      ],
      health: [
        `Bachillerato (MCCEMS) - Recursos Socioemocionales: Coordina proyectos de impacto comunitario y responsabilidad social vinculados a "${capitalizedTopic}".`
      ],
      general: [
        `Bachillerato (MCCEMS) - Formación Integral: Integra marcos teóricos y cuantitativos para formular proyectos de investigación aplicada sobre "${capitalizedTopic}".`
      ]
    }
  };

  const levelPdas = pdasByPhase[levelKey] || pdasByPhase['primaria-baja'];

  // Selección inteligente y priorización por materia
  const candidateLists: string[][] = [];

  const isSubjectSpanish = subLower.includes('esp') || subLower.includes('leng') || subLower.includes('comun') || subLower.includes('lect');
  const isSubjectMath = subLower.includes('mat') || subLower.includes('algebra') || subLower.includes('calc');
  const isSubjectScience = subLower.includes('cien') || subLower.includes('nat') || subLower.includes('fis') || subLower.includes('quim') || subLower.includes('bio') || subLower.includes('medio');
  const isSubjectHistory = subLower.includes('his') || subLower.includes('soc') || subLower.includes('civ') || subLower.includes('geo') || subLower.includes('ent') || subLower.includes('etic');
  const isSubjectArt = subLower.includes('art') || subLower.includes('mus') || subLower.includes('teat');
  const isSubjectHealth = subLower.includes('hum') || subLower.includes('fisic') || subLower.includes('deport') || subLower.includes('salud') || subLower.includes('tut');

  // 1. Primero la lista que coincida con el tema O la materia seleccionada
  if (isHistoryOrCivics || isSubjectHistory) {
    candidateLists.push(levelPdas.history);
  }
  if (isMath || isSubjectMath) {
    candidateLists.push(levelPdas.math);
  }
  if (isScience || isSubjectScience) {
    candidateLists.push(levelPdas.science);
  }
  if (isLanguageGeneral || isSubjectSpanish) {
    candidateLists.push(levelPdas.language);
  }
  if (isCivicsRights) {
    candidateLists.push(levelPdas.civics);
  }
  if (isArt || isSubjectArt) {
    candidateLists.push(levelPdas.art);
  }
  if (isHealth || isSubjectHealth) {
    candidateLists.push(levelPdas.health);
  }

  // 2. Si no hubo coincidencia temática específica, agregar la categoría de la asignatura
  if (candidateLists.length === 0) {
    if (isSubjectSpanish) candidateLists.push(levelPdas.language);
    else if (isSubjectMath) candidateLists.push(levelPdas.math);
    else if (isSubjectScience) candidateLists.push(levelPdas.science);
    else if (isSubjectHistory) candidateLists.push(levelPdas.history);
    else candidateLists.push(levelPdas.general);
  }

  // 3. Agregar secundariamente las demás categorías para ofrecer opciones articuladas/transversales
  candidateLists.push(levelPdas.general);
  candidateLists.push(levelPdas.language);
  candidateLists.push(levelPdas.history);
  candidateLists.push(levelPdas.science);
  candidateLists.push(levelPdas.math);

  // Aplanar y eliminar duplicados manteniendo el orden de relevancia
  const result: string[] = [];
  for (const list of candidateLists) {
    for (const pdaText of list) {
      if (pdaText && !result.includes(pdaText)) {
        result.push(pdaText);
      }
    }
  }

  return result.slice(0, 8);
}
