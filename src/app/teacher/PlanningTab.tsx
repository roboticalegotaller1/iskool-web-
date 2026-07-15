"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, BookOpen, FileText, Activity, Users, Brain, 
  Scale, Globe, Palette, Download, Save, Trash2, Plus, 
  ChevronRight, Image, FileDown, CheckCircle2, Wand2, Eye, 
  RefreshCw, Settings, Check, HelpCircle, Edit3, Lock,
  ChevronDown, ChevronLeft, Shield, Award, Compass, Swords, Info
} from 'lucide-react';
import { UserProfile, Subject, ClassSchedule, Group, Quest } from '@/types';
import { useSchoolAdminStore } from '@/store/useSchoolAdminStore';
import { useGamificationStore } from '@/store/useGamificationStore';
import { usePlanningStore } from '@/store/usePlanningStore';
import { supabase } from '@/lib/supabaseClient';

// ==========================================
// BASE DE DATOS CURRICULAR DE LA NEM 2022
// ==========================================

interface NemContent {
  campoFormativo: string;
  ejesArticuladores: string[];
  pda: string;
  inicio: string;
  desarrollo: string;
  cierre: string;
  evaluacion: string;
  materiales: string;
}

const NEM_CURRICULUM_DATABASE: Record<string, Record<string, NemContent>> = {
  'matematicas': {
    'primaria-baja': {
      campoFormativo: 'Saberes y Pensamiento Científico',
      ejesArticuladores: ['Pensamiento Crítico', 'Inclusión'],
      pda: 'Fase 3 - Expresa de manera oral y escrita números de hasta dos cifras, e identifica fracciones sencillas como mitades y cuartos en situaciones cotidianas de reparto.',
      inicio: 'Reunir a los alumnos en semicírculo. Presentar una manzana y plantear la pregunta detonadora: ¿Cómo podemos compartir esta manzana de manera justa entre dos niños? ¿Y entre cuatro? Escuchar y anotar sus respuestas en el pizarrón.',
      desarrollo: 'Entregar hojas de papel de colores y círculos de cartulina a cada equipo de tres integrantes. Pedirles que los doblen y corten en 2 y 4 partes iguales. Jugar al "Restaurante de Fracciones", donde deben atender pedidos de clientes que solicitan "media pizza" o "un cuarto de pastel" utilizando sus figuras de papel. Completar una hoja de registro ilustrada.',
      cierre: 'Ronda de reflexión metacognitiva: ¿Qué pasa si las partes no son iguales? ¿Sigue siendo una fracción? Juego de retos rápidos en el pizarrón dibujando figuras divididas y pidiendo al grupo que identifique si representan fracciones reales.',
      evaluacion: 'Lista de cotejo: Coherencia en el reparto de material concreto, representación escrita correcta de 1/2 y 1/4, y participación en el trabajo en equipo.',
      materiales: 'Manzanas de plástico o reales, círculos de cartulina de colores, tijeras, pegamento, hojas de registro del "Restaurante de Fracciones".'
    },
    'primaria-alta': {
      campoFormativo: 'Saberes y Pensamiento Científico',
      ejesArticuladores: ['Pensamiento Crítico', 'Artes y Experiencias Estéticas'],
      pda: 'Fase 5 - Resuelve problemas de suma y resta con fracciones de diferente denominador utilizando la equivalencia, y representa gráficamente las operaciones en su contexto diario.',
      inicio: 'Presentar una receta de cocina que requiere 1/2 taza de leche y 3/4 de taza de agua. Plantear el conflicto cognitivo: ¿Cómo podemos saber cuánta cantidad de líquido necesitamos en total? ¿Podemos sumar directamente 1/2 + 3/4?',
      desarrollo: 'En parejas, construir tiras de fracciones equivalentes en cartoncillo de colores. Utilizar las tiras para resolver una serie de desafíos prácticos donde deben sumar y restar porciones de ingredientes escolares. Representar las sumas de fracciones de forma gráfica coloreando vitrales didácticos (diseños artísticos divididos en cuadrículas).',
      cierre: 'Plenaria para explicar el método del mínimo común denominador y de la equivalencia gráfica. Resolver un problema integrador de forma colaborativa en el pizarrón. Escribir en su bitácora la mayor dificultad que tuvieron.',
      evaluacion: 'Rúbrica de evaluación formativa: Dominio en la conversión a fracciones equivalentes, precisión en las sumas gráficas, y análisis del significado de la suma en contextos reales.',
      materiales: 'Tiras de fracciones impresas en cartulina, colores, reglas, problemas de aplicación contextualizados, vitrales didácticos en papel bond.'
    },
    'secundaria': {
      campoFormativo: 'Saberes y Pensamiento Científico',
      ejesArticuladores: ['Pensamiento Crítico'],
      pda: 'Fase 6 - Resuelve ecuaciones lineales de primer grado utilizando propiedades de la igualdad, y calcula proporciones y porcentajes aplicados a situaciones de la vida económica local.',
      inicio: 'Analizar un recibo de luz real o una nota de compra de abarrotes de la comunidad. Preguntar cómo se calcula el IVA (16%) y de qué manera se podría formular matemáticamente para calcular el costo base antes del impuesto.',
      desarrollo: 'Resolver un taller de desafíos basados en la economía local (negocios familiares, producción agrícola o comercial). Modelar las relaciones matemáticas en forma de ecuaciones de la forma ax + b = c. En equipos de 4, crear un "Tablero de Comercio Sostenible" donde calculan costos, ofertas del 20% de descuento y ganancias netas formulando ecuaciones.',
      cierre: 'Exposición breve del método algebraico de balanzas para despejar la incógnita. Autoevaluación en su bitácora de aprendizaje: ¿Cómo me ayuda el álgebra a entender los cobros diarios?',
      evaluacion: 'Examen rápido formativo de 3 reactivos contextualizados, revisión del planteamiento formal de las ecuaciones en el portafolio, y coevaluación del trabajo en equipo.',
      materiales: 'Notas de compra simuladas, hojas de ejercicios "El Álgebra en la Tiendita", calculadora científica, plumones y pizarrón.'
    },
    'preparatoria': {
      campoFormativo: 'Pensamiento Matemático (Nivel Medio Superior)',
      ejesArticuladores: ['Pensamiento Crítico', 'Igualdad de Género'],
      pda: 'Estructuras algebraicas y trigonométricas: Modela situaciones reales y calcula variaciones proporcionales y funciones mediante sistemas de ecuaciones lineales y vectores en 2D.',
      inicio: 'Presentar un mapa de vientos de la región o trayectorias de navegación de embarcaciones/aviones. Discutir qué propiedades físicas y matemáticas se requieren para describir una fuerza que tiene magnitud y dirección.',
      desarrollo: 'Explicación teórica de vectores y descomposición trigonométrica. Resolver ejercicios en parejas donde deben calcular la fuerza resultante sobre una estructura física escolar sometida a tensiones. Desarrollar un simulador analógico en papel milimétrico empleando reglas y transportadores para contrastar el método gráfico y el analítico.',
      cierre: 'Presentación grupal de los resultados de fuerza resultantes. Reflexión sobre la equidad de género en las carreras de ingeniería y STEM (Ciencia, Tecnología, Ingeniería y Matemáticas) fomentando el diálogo.',
      evaluacion: 'Reporte técnico en parejas con la resolución detallada de un sistema vectorial y una propuesta de mejora estructural utilizando vectores.',
      materiales: 'Papel milimétrico, reglas, transportadores, hojas de problemas vectoriales de física aplicada, presentación digital de conceptos trigonométricos.'
    }
  },
  'ciencias': {
    'primaria-baja': {
      campoFormativo: 'Saberes y Pensamiento Científico',
      ejesArticuladores: ['Vida Saludable', 'Inclusión'],
      pda: 'Fase 3 - Reconoce la importancia del agua, el aire y el suelo para la vida silvestre y humana, y propone acciones cotidianas para su cuidado y preservación en la escuela.',
      inicio: 'Realizar una caminata de observación por el huerto o jardines de la escuela. Pedir a los niños que toquen la tierra, sientan el aire y observen las plantas. Al volver al salón, registrar en un mapa conceptual gigante qué elementos son necesarios para que la vida florezca.',
      desarrollo: 'Crear en equipos pequeños un "Miniecosistema de Germinación" en vasos transparentes reciclados utilizando tierra, semillas de frijol y agua. Experimentar con tres variables controladas: uno con sol y agua, otro a oscuras, y otro sin agua. Registrar diariamente los cambios en una tabla con dibujos.',
      cierre: 'Conversatorio grupal sobre los resultados del experimento de germinación. Concluir por qué la luz, el agua y la tierra son indispensables. Elaborar carteles coloridos para promover el ahorro de agua en los lavabos del colegio.',
      evaluacion: 'Bitácora del experimento de germinación con registro gráfico continuo de cambios, y calidad y creatividad del cartel escolar.',
      materiales: 'Vasos transparentes reciclados, tierra fértil, algodón, semillas de frijol rápido, atomizadores con agua, cartulinas y colores de cera.'
    },
    'primaria-alta': {
      campoFormativo: 'Saberes y Pensamiento Científico',
      ejesArticuladores: ['Pensamiento Crítico', 'Vida Saludable'],
      pda: 'Fase 5 - Describe las características de los ecosistemas locales, analiza la huella ecológica humana en la biodiversidad y diseña prototipos sencillos de ecotecnias (como biodigestores o deshidratadores solares).',
      inicio: 'Observar un video corto sobre cómo los desechos orgánicos generan gases nocivos si no se tratan adecuadamente. Introducir el concepto de "Ecotecnias" y preguntar: ¿Qué podemos hacer con las cáscaras de fruta de la cafetería de la escuela?',
      desarrollo: 'Construir en parejas un prototipo escolar de Biodigestor Anaeróbico a escala utilizando una botella PET de 2 litros, un globo resistente, residuos orgánicos machacados (plátano, manzana) y levadura. Sellar herméticamente con plastilina y registrar la inflación del globo (producción de biogás) durante los días subsecuentes.',
      cierre: 'Plenaria explicativa de la digestión anaerobia y la transformación bacteriana de residuos en gas metano y biofertilizante. Discutir la viabilidad económica y ecológica de un biodigestor escolar real.',
      evaluacion: 'Reporte ilustrado del prototipo del biodigestor, correcto sellado técnico de la botella, y justificación ecológica del proyecto redactada individualmente.',
      materiales: 'Botellas de plástico de 2 litros limpias, globos, embudos, residuos orgánicos blandos, levadura en polvo, plastilina, cintas métricas.'
    },
    'secundaria': {
      campoFormativo: 'Saberes y Pensamiento Científico',
      ejesArticuladores: ['Pensamiento Crítico', 'Interculturalidad Crítica'],
      pda: 'Fase 6 - Valora la importancia de los procesos de oxidación y combustión en la producción de gases de efecto invernadero (GEI) y propone alternativas tecnológicas sustentables como el biogás para mitigar el cambio climático.',
      inicio: 'Analizar gráficas globales de aumento de emisiones de CO2 y Metano en los últimos 50 años. Preguntar qué actividades en sus hogares y escuelas contribuyen directamente a esta tendencia y qué alternativas energéticas existen en comunidades rurales del país.',
      desarrollo: 'Investigar en equipos los fundamentos químicos del biogás (composición del biogás, bacterias metanogénicas, fases de hidrólisis, acidogénesis y metanogénesis). Elaborar un reporte técnico de balance de masas y estimar el potencial calorífico del biogás escolar en comparación con el gas LP convencional.',
      cierre: 'Mesa redonda: "Soberanía energética y ecotecnologías en México". Discutir cómo los biodigestores benefician el desarrollo de comunidades indígenas y marginadas, reduciendo la tala de árboles para leña.',
      evaluacion: 'Bitácora científica grupal con el marco teórico químico de la digestión anaeróbica, cálculos de rendimiento térmico simulados y coevaluación del desempeño.',
      materiales: 'Artículos de investigación científica impresos, laptop/tablet para investigación, pliego de papel bond, marcadores de colores.'
    },
    'preparatoria': {
      campoFormativo: 'Ciencias Experimentales (Nivel Medio Superior)',
      ejesArticuladores: ['Pensamiento Crítico', 'Vida Saludable'],
      pda: 'Estequiometría y Termoquímica: Analiza el rendimiento térmico de reacciones químicas exotérmicas y endotérmicas, y calcula el balance calórico de sistemas biológicos y tecnológicos cerrados.',
      inicio: 'Presentar el dilema de la eficiencia de la biomasa frente a los hidrocarburos. Discutir qué variables físicas (entalpía, entropía, energía libre de Gibbs) regulan la viabilidad termodinámica de un combustible biológico.',
      desarrollo: 'Explicación del calorímetro y cálculo de calor liberado en reacciones de combustión de alcoholes y gases orgánicos. En el laboratorio escolar, simular el rendimiento térmico de una celda de combustión de gas orgánico midiendo la temperatura de agua. Realizar el balance termoquímico formal planteando ecuaciones estequiométricas.',
      cierre: 'Plenaria sobre termodinámica aplicada a procesos industriales ecológicos. Debate rápido: ¿Es el biogás una solución definitiva o de transición para la descarbonización industrial?',
      evaluacion: 'Práctica de laboratorio estequiométrica redactada con formato de artículo científico breve que incluya cálculos matemáticos rigurosos de entalpía.',
      materiales: 'Termómetros de alta precisión, calorímetros caseros o escolares, vasos de precipitados, mecheros, simulaciones teóricas de combustión de metano.'
    }
  },
  'lenguajes': {
    'primaria-baja': {
      campoFormativo: 'Lenguajes',
      ejesArticuladores: ['Apropiación de las Culturas a través de la Lectura y la Escritura', 'Artes y Experiencias Estéticas'],
      pda: 'Fase 3 - Lee en voz alta poemas y textos de la lírica tradicional, identifica patrones de rima y ritmo, e inventa sus propias estrofas de forma lúdica.',
      inicio: 'Cantar colectivamente una canción tradicional infantil mexicana (como "Naranja dulce, limón partido"). Pedir a los niños que palmoteen siguiendo el ritmo de los versos e identifiquen qué palabras suenan parecido al final.',
      desarrollo: 'Jugar a la "Fábrica de Rimas": dar tarjetas de palabras a cada alumno y pedirles que busquen a un compañero que tenga una palabra que rime con la suya. En parejas, escribir un poema breve de cuatro versos ilustrado sobre sus mascotas o su escuela y decorarlo artísticamente.',
      cierre: 'Micrófono Abierto: Invitar a los alumnos a recitar sus creaciones poéticas frente a sus compañeros con entonación y expresión corporal. Dar aplausos afectuosos.',
      evaluacion: 'Participación activa en el canto y ritmo, escritura de al menos una rima lógica por pareja, y lectura expresiva en voz alta.',
      materiales: 'Tarjetas con palabras ilustradas que riman, hojas de papel decorativas, colores, micrófono de juguete o real para la recitación.'
    },
    'primaria-alta': {
      campoFormativo: 'Lenguajes',
      ejesArticuladores: ['Apropiación de las Culturas a través de la Lectura y la Escritura', 'Interculturalidad Crítica'],
      pda: 'Fase 4 - Identifica las características estructurales de las leyendas y mitos de tradición oral, reconoce su valor cultural para la comunidad y elabora narraciones escritas creativas.',
      inicio: 'Sentar al grupo en círculo. Contar una versión dramatizada de una leyenda prehispánica (como "La llorona" o "El callejón del beso"). Preguntar: ¿Es una historia real? ¿Cómo ha llegado hasta nosotros hoy en día?',
      desarrollo: 'Visitar la biblioteca o realizar una investigación en clase sobre leyendas regionales mexicanas. En equipos de 4, seleccionar una leyenda, analizar sus personajes, elementos mágicos y reales, y estructurarla en un guion teatral corto. Ensayar la lectura dramática de los personajes asignados.',
      cierre: 'Puesta en escena simulada en el aula de las lecturas dramáticas de las leyendas. Compartir opiniones sobre los valores o creencias comunitarias que transmite cada historia.',
      evaluacion: 'Rúbrica: Comprensión de los elementos de la leyenda (magia vs realidad), fluidez en la lectura dramática, y trabajo armónico en el equipo.',
      materiales: 'Textos impresos de leyendas populares mexicanas, hojas blancas para redactar guiones, elementos de utilería simples (sombreros, mantas).'
    },
    'secundaria': {
      campoFormativo: 'Lenguajes',
      ejesArticuladores: ['Apropiación de las Culturas a través de la Lectura y la Escritura', 'Pensamiento Crítico'],
      pda: 'Fase 6 - Analiza la intención comunicativa de textos líricos, narrativos e históricos en lengua española de distintas épocas, y redacta ensayos argumentativos estructurados sobre temáticas sociales.',
      inicio: 'Proyectar un fragmento de una obra literaria barroca y una canción de protesta social contemporánea. Discutir: ¿Qué mensaje buscan transmitir? ¿Cómo influye el momento histórico en la forma de escribir del autor?',
      desarrollo: 'Analizar individualmente la estructura de un ensayo argumentativo (Tesis, Argumentos, Conclusión). Elegir una problemática social (ej. igualdad de género, conservación ecológica o migración) y redactar un ensayo breve de 3 cuartillas, citando de manera formal al menos dos fuentes de consulta confiables.',
      cierre: 'Ronda de debate en mesa redonda donde cada estudiante expone la tesis de su ensayo y responde preguntas críticas de sus compañeros de manera respetuosa.',
      evaluacion: 'Ensayo argumentativo impreso (estructura formal, cohesión, coherencia y ortografía) y defensa de su tesis oral durante la mesa redonda.',
      materiales: 'Guía de redacción de ensayos, textos literarios de ejemplo, fichas de referencias bibliográficas, plumones de colores.'
    },
    'preparatoria': {
      campoFormativo: 'Lengua y Comunicación (Nivel Medio Superior)',
      ejesArticuladores: ['Pensamiento Crítico', 'Artes y Experiencias Estéticas'],
      pda: 'Redacción avanzada e interpretación literaria: Desarrolla el pensamiento crítico mediante el análisis literario comparativo de textos líricos y redacta discursos persuasivos de impacto comunitario.',
      inicio: 'Ver un video de un discurso persuasivo célebre (como el de Martin Luther King o Malala Yousafzai). Identificar qué recursos lingüísticos y emocionales utilizan para conectar con la audiencia.',
      desarrollo: 'Exposición de figuras retóricas avanzadas (metáfora, anáfora, hipérbole, ironía). Redactar de forma individual un discurso persuasivo sobre una problemática del plantel escolar o de la colonia. Grabar un video o realizar una oratoria de 3 minutos aplicando modulación vocal y expresión ad hoc.',
      cierre: 'Taller de retroalimentación literaria entre pares (taller de escritores). Evaluar el discurso del compañero utilizando una escala estimativa.',
      evaluacion: 'Manuscrito del discurso con uso explícito de figuras retóricas y video de la oratoria final del alumno.',
      materiales: 'Manual de retórica y oratoria, videos de discursos históricos, rúbrica de coevaluación escolar.'
    }
  }
};

// ==========================================
// CAMPOS FORMATIVOS Y EJES ARTICULADORES
// ==========================================

const CAMPOS_FORMATIVOS = [
  'Lenguajes',
  'Saberes y Pensamiento Científico',
  'Ética, Naturaleza y Sociedades',
  'De lo Humano y lo Comunitario'
];

const EJES_ARTICULADORES = [
  { name: 'Pensamiento Crítico', icon: Brain, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/40' },
  { name: 'Inclusión', icon: Users, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200/40' },
  { name: 'Vida Saludable', icon: Activity, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/40' },
  { name: 'Artes y Exp. Estéticas', icon: Palette, color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/40 border-pink-200/40' },
  { name: 'Fomento a la Lectura', icon: BookOpen, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40 border-orange-200/40' },
  { name: 'Igualdad de Género', icon: Scale, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40 border-purple-200/40' },
  { name: 'Interculturalidad Crítica', icon: Globe, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200/40' }
];

interface PlanningTabProps {
  currentTeacher: UserProfile;
  subjects: Subject[];
  schedulesList: ClassSchedule[];
  groupsList: Group[];
}

const getPdaMap = (capitalizedTopic: string): Record<string, Record<string, string>> => {
  return {
    'preescolar': {
      ecology:   `Fase 2 - Observa con atención elementos de "${capitalizedTopic}" en la naturaleza, describe sus características y propone formas sencillas de cuidarla.`,
      health:    `Fase 2 - Practica hábitos de higiene y alimentación relacionados con "${capitalizedTopic}" para mantenerse sano y evitar enfermedades.`,
      history:   `Fase 2 - Comparte relatos y costumbres de su familia sobre "${capitalizedTopic}" y reconoce elementos de su historia personal.`,
      art:       `Fase 2 - Representa de forma creativa ideas y sentimientos sobre "${capitalizedTopic}" usando pintura, modelado o música.`,
      tech:      `Fase 2 - Reconoce herramientas de "${capitalizedTopic}" que se usan en casa y en la escuela de forma segura.`,
      math:      `Fase 2 - Utiliza números y formas en juegos relacionados con "${capitalizedTopic}" para contar y ubicar objetos.`,
      civics:    `Fase 2 - Colabora con sus compañeros en actividades sobre "${capitalizedTopic}" respetando las reglas del salón.`,
      language:  `Fase 2 - Expresa oralmente sus ideas sobre "${capitalizedTopic}" y escucha las opiniones de los demás.`,
      social:    `Fase 2 - Conoce lugares de su comunidad que se relacionan con "${capitalizedTopic}" y platica sobre lo que hacen ahí.`,
      default:   `Fase 2 - Explora su entorno inmediato descubriendo aspectos de "${capitalizedTopic}", y los comparte con sus compañeros mediante expresiones orales y artísticas.`
    },
    'primaria-baja': {
      ecology:   `Fase 3 - Reconoce la importancia de "${capitalizedTopic}" en su entorno inmediato, observa e identifica sus características mediante exploración sensorial y elabora registros gráficos de sus hallazgos.`,
      health:    `Fase 3 - Identifica hábitos saludables relacionados con "${capitalizedTopic}" que contribuyen a su bienestar y al de su familia, y los practica en la vida cotidiana de la escuela.`,
      history:   `Fase 3 - Reconoce elementos básicos de "${capitalizedTopic}" como parte de la memoria colectiva de su comunidad a través de relatos, imágenes y testimonios sencillos.`,
      art:       `Fase 3 - Explora y experimenta con elementos de "${capitalizedTopic}" a través de la creación artística libre, expresando ideas y emociones propias.`,
      tech:      `Fase 3 - Identifica usos cotidianos de "${capitalizedTopic}" y explora herramientas digitales básicas como instrumentos para aprender y comunicarse.`,
      math:      `Fase 3 - Comprende y aplica conceptos de "${capitalizedTopic}" en situaciones concretas y cotidianas utilizando material manipulable y representaciones gráficas.`,
      civics:    `Fase 3 - Reconoce la importancia de "${capitalizedTopic}" para la convivencia respetuosa en el aula y la escuela, y practica acuerdos de grupo.`,
      language:  `Fase 3 - Comprende y produce textos sencillos relacionados con "${capitalizedTopic}", identificando su propósito comunicativo y elementos básicos.`,
      social:    `Fase 3 - Identifica características de "${capitalizedTopic}" en su comunidad y región a través de mapas, ilustraciones y conversaciones con su entorno familiar.`,
      default:   `Fase 3 - Identifica y describe con sus palabras las principales características de "${capitalizedTopic}" en su contexto escolar y comunitario, registrando sus observaciones de forma gráfica.`
    },
    'primaria-alta': {
      ecology:   `Fase 5 - Analiza el impacto de "${capitalizedTopic}" en los ecosistemas locales, plantea hipótesis sobre sus causas y consecuencias, y diseña propuestas de acción sustentable en su comunidad.`,
      health:    `Fase 5 - Investiga la relación entre "${capitalizedTopic}" y la salud pública, analiza datos estadísticos sencillos y propone campañas informativas para su escuela.`,
      history:   `Fase 5 - Investiga causas y consecuencias de "${capitalizedTopic}" en el contexto nacional y regional, y elabora líneas del tiempo, mapas históricos y textos argumentativos.`,
      art:       `Fase 5 - Investiga los elementos y contextos de "${capitalizedTopic}", analiza obras representativas y crea producciones artísticas originales integrando técnicas y estilos aprendidos.`,
      tech:      `Fase 5 - Analiza el impacto social y ético de "${capitalizedTopic}" en la vida cotidiana, y diseña un proyecto colaborativo usando herramientas digitales disponibles.`,
      math:      `Fase 5 - Resuelve problemas contextualizados aplicando conceptos de "${capitalizedTopic}", y representa soluciones de manera gráfica, numérica y algebraica.`,
      civics:    `Fase 5 - Analiza situaciones de la vida real vinculadas a "${capitalizedTopic}", debate su importancia democrática y diseña acciones colectivas de mejora comunitaria.`,
      language:  `Fase 5 - Analiza, produce y comparte textos complejos sobre "${capitalizedTopic}", aplicando estrategias de comprensión lectora y de escritura formal para audiencias específicas.`,
      social:    `Fase 5 - Investiga características socioeconómicas y geográficas de "${capitalizedTopic}" en México y el mundo, y elabora reportes con datos estadísticos y cartografía.`,
      default:   `Fase 5 - Investiga y sistematiza información sobre "${capitalizedTopic}", identifica sus implicaciones en la sociedad y el entorno, y propone alternativas creativas y fundamentadas.`
    },
    'secundaria': {
      ecology:   `Fase 6 - Evalúa críticamente el impacto de "${capitalizedTopic}" en los ecosistemas, aplica conceptos científicos para analizar datos ambientales reales y propone estrategias de intervención comunitaria sustentable.`,
      health:    `Fase 6 - Analiza científicamente los factores de riesgo y protección relacionados con "${capitalizedTopic}", interpreta datos epidemiológicos y diseña estrategias de prevención argumentadas.`,
      history:   `Fase 6 - Analiza críticamente "${capitalizedTopic}" desde múltiples perspectivas históricas y sociales, evalúa fuentes primarias y secundarias, y elabora ensayos argumentativos sobre su vigencia.`,
      art:       `Fase 6 - Analiza críticamente manifestaciones de "${capitalizedTopic}" en contextos culturales e históricos diversos, y produce obras originales aplicando principios estéticos y técnicas avanzadas.`,
      tech:      `Fase 6 - Analiza el impacto ético, social y económico de "${capitalizedTopic}" en la vida cotidiana, y desarrolla un prototipo o propuesta tecnológica que responda a una problemática local.`,
      math:      `Fase 6 - Aplica el pensamiento algebraico y el razonamiento matemático para modelar y resolver situaciones reales vinculadas a "${capitalizedTopic}", justificando procedimientos y resultados.`,
      civics:    `Fase 6 - Analiza críticamente problemáticas sociales vinculadas a "${capitalizedTopic}", evalúa marcos normativos y propone mecanismos ciudadanos de incidencia y cambio colectivo.`,
      language:  `Fase 6 - Analiza textos de distintos géneros discursivos relacionados con "${capitalizedTopic}", evalúa argumentos e intenciones comunicativas, y produce textos propios con rigor y creatividad.`,
      social:    `Fase 6 - Analiza procesos sociales, económicos y geopolíticos relacionados con "${capitalizedTopic}", interpreta indicadores y propone reflexiones fundamentadas sobre sus implicaciones.`,
      default:   `Fase 6 - Analiza críticamente el impacto social, científico y cultural de "${capitalizedTopic}", fundamenta su postura con evidencia, y elabora un producto comunicativo argumentativo de calidad.`
    },
    'preparatoria': {
      ecology:   `Modela interacciones ecosistémicas relacionadas con "${capitalizedTopic}" utilizando pensamiento sistémico, y diseña proyectos de investigación-acción con metodología científica para su contexto regional.`,
      health:    `Analiza desde perspectivas interdisciplinarias los determinantes sociales relacionados con "${capitalizedTopic}", diseña protocolos de investigación y elabora propuestas de política pública comunitaria.`,
      history:   `Construye interpretaciones historiográficas sobre "${capitalizedTopic}" integrando fuentes primarias, teorías sociales y perspectivas comparadas, y las presenta en formatos académicos rigurosos.`,
      art:       `Investiga y teoriza sobre "${capitalizedTopic}" desde enfoques estéticos e interdisciplinares, y desarrolla un proyecto artístico-conceptual que dialogue con problemáticas contemporáneas.`,
      tech:      `Diseña y argumenta soluciones innovadoras a problemáticas reales integrando principios de "${capitalizedTopic}", evaluando implicaciones éticas, sociales y de sustentabilidad.`,
      math:      `Modela fenómenos complejos mediante herramientas de "${capitalizedTopic}", aplica métodos analíticos y de cálculo avanzado, y justifica la validez de sus resultados de forma rigurosa.`,
      civics:    `Diseña propuestas de intervención ciudadana fundamentadas en marcos jurídicos y filosóficos sobre "${capitalizedTopic}", evaluando su factibilidad e impacto en contextos democráticos.`,
      language:  `Analiza y produce textos académicos y argumentativos de alta complejidad sobre "${capitalizedTopic}", evaluando el uso del lenguaje en contextos de poder, cultura e identidad.`,
      social:    `Analiza tendencias globales relacionadas con "${capitalizedTopic}" usando indicadores cuantitativos y cualitativos, y elabora propuestas de desarrollo sustentable fundamentadas.`,
      default:   `Integra marcos teóricos, datos empíricos y perspectivas interdisciplinarias para analizar "${capitalizedTopic}" y formular propuestas fundamentadas con impacto en su contexto social y natural.`
    }
  };
};

export function PlanningTab({ currentTeacher, subjects, schedulesList, groupsList }: PlanningTabProps) {
  const subjectsList = useSchoolAdminStore(state => state.subjectsList);
  const normalizedTeacherId = currentTeacher?.id === 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a55' ? 'usr-teacher-1' : currentTeacher?.id;

  // Filter subjects taught by the current teacher
  const teacherSubjectIds = schedulesList
    .filter(s => s.teacherId === normalizedTeacherId)
    .map(s => s.subjectId);
    
  const filteredSubjects = subjectsList.filter(sub => teacherSubjectIds.includes(sub.id));
  
  // Fallback: If empty, load all school subjects
  const displaySubjects = filteredSubjects.length > 0 ? filteredSubjects : subjectsList;

  // Helper to map subject ID/name to curriculum database category keys
  const mapSubjectToCurriculumKey = (subjectId: string, subjectName: string): 'matematicas' | 'ciencias' | 'lenguajes' => {
    const cleanId = subjectId.toLowerCase();
    const cleanName = subjectName.toLowerCase();
    
    if (cleanId.includes('math') || cleanId.includes('matemat') || cleanName.includes('matemat')) {
      return 'matematicas';
    }
    if (cleanId.includes('sci') || cleanId.includes('cienc') || cleanName.includes('cienc') || cleanName.includes('quim') || cleanName.includes('fisic') || cleanName.includes('biolog')) {
      return 'ciencias';
    }
    return 'lenguajes';
  };

  // --- Estados de Programa Analítico (SEP / NEM) ---
  const [activeModule, setActiveModule] = useState<'generator' | 'programa-analitico'>('generator');
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  
  // Paso 1: Lectura de la realidad
  const [realityDiagnosis, setRealityDiagnosis] = useState('');
  const [problematic, setProblematic] = useState('');
  const [studentNeeds, setStudentNeeds] = useState('');

  // Paso 2: Contextualización
  const [camposFormativos, setCamposFormativos] = useState<any[]>([]);
  const [pdasList, setPdasList] = useState<any[]>([]);
  const [selectedCampoId, setSelectedCampoId] = useState('');
  const [selectedPdaIds, setSelectedPdaIds] = useState<string[]>([]);
  const [selectedNEMSubject, setSelectedNEMSubject] = useState('');
  const [selectedNEMLevel, setSelectedNEMLevel] = useState('primaria-alta');

  // Paso 3: Formulación (Campañas de Gremio)
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignQuests, setCampaignQuests] = useState<any[]>([]);
  const [isPublishingCampaign, setIsPublishingCampaign] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cargar campos formativos al montar
  useEffect(() => {
    const fetchNemData = async () => {
      try {
        const { data, error } = await supabase
          .from('nem_campos_formativos')
          .select('*')
          .order('name');
        if (error) throw error;
        if (data) {
          setCamposFormativos(data);
          if (data.length > 0) {
            setSelectedCampoId(data[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching nem_campos_formativos:', err);
      }
    };
    fetchNemData();
  }, []);

  // Cargar PDAs cuando cambia el campo formativo
  useEffect(() => {
    if (!selectedCampoId) return;
    const fetchPdas = async () => {
      try {
        const { data, error } = await supabase
          .from('nem_pdas')
          .select('*')
          .eq('campo_formativo_id', selectedCampoId)
          .order('code');
        if (error) throw error;
        if (data) {
          setPdasList(data);
        }
      } catch (err) {
        console.error('Error fetching nem_pdas:', err);
      }
    };
    fetchPdas();
  }, [selectedCampoId]);


  const handlePublishCampaign = async () => {
    const isUuid = (val: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
    if (!campaignTitle.trim()) {
      alert('Por favor introduce un título para la campaña del gremio.');
      return;
    }
    if (campaignQuests.length === 0) {
      alert('Por favor agrega al menos una misión a la campaña.');
      return;
    }

    setIsPublishingCampaign(true);
    try {
      let subjectUuid = selectedNEMSubject;
      if (!isUuid(subjectUuid)) {
        const subjectObj = displaySubjects.find(s => s.id === selectedNEMSubject);
        const name = subjectObj ? subjectObj.name : 'Matemáticas';
        const { data: existingSubject } = await supabase
          .from('subjects')
          .select('id')
          .eq('name', name)
          .maybeSingle();
        if (existingSubject) {
          subjectUuid = existingSubject.id;
        } else {
          subjectUuid = '00000000-0000-0000-0000-000000000000'; // fallback
        }
      }

      // Insertar misión (campaña)
      const { data: missionData, error: missionError } = await supabase
        .from('missions')
        .insert({
          school_id: '00000000-0000-0000-0000-000000000000',
          subject_id: subjectUuid,
          level_grade_id: '1111c019-61c7-4097-8aca-03cc0c4db68a', // Default to 4º Primaria
          title: campaignTitle,
          description: `Campaña del Programa Analítico: ${problematic || 'Plan de estudios'}`,
          story_intro: `¡Atención Gremio! Se ha desplegado una nueva campaña basada en: ${realityDiagnosis.slice(0, 100)}...`,
          map_position_x: Math.floor(Math.random() * 80) + 10,
          map_position_y: Math.floor(Math.random() * 80) + 10,
          campo_formativo_id: selectedCampoId,
          pda_ids: selectedPdaIds,
          is_active: true
        })
        .select('id')
        .single();

      if (missionError) throw missionError;
      const missionId = missionData.id;

      // Insertar Quests vinculadas
      const questsToInsert = campaignQuests.map((q, idx) => ({
        mission_id: missionId,
        title: q.title,
        description: q.description,
        type: q.type,
        sequence_order: idx + 1,
        xp_reward: q.xp_reward,
        coins_reward: q.coins_reward,
        campo_formativo_id: selectedCampoId,
        pda_ids: q.pda_ids,
        content: q.type === 'quiz' ? {
          questions: [
            {
              id: `q-${Date.now()}-${idx}-1`,
              question: `Pregunta sobre: ${q.title}`,
              options: ["Opción A", "Opción B", "Opción C", "Opción D"],
              correctAnswerIndex: 0,
              explanation: "Respuesta correcta por defecto para la campaña."
            }
          ]
        } : {
          instructions: q.description,
          acceptedFormats: ["image", "audio", "video", "pdf", "link"]
        }
      }));

      const { error: questsError } = await supabase
        .from('quests')
        .insert(questsToInsert);

      if (questsError) throw questsError;

      // Actualizar store de Zustand local
      const campaignInfo = {
        id: missionId,
        subject_id: selectedNEMSubject,
        subject_name: displaySubjects.find(s => s.id === selectedNEMSubject)?.name || 'Materia',
        level: selectedNEMLevel,
        reality_diagnosis: realityDiagnosis,
        problematic: problematic,
        student_needs: studentNeeds,
        campo_formativo_id: selectedCampoId,
        campo_formativo_name: camposFormativos.find(cf => cf.id === selectedCampoId)?.name || 'Campo Formativo',
        selected_pda_ids: selectedPdaIds,
        quests: campaignQuests,
        published_at: new Date().toISOString()
      };
      
      const { addCampaign } = usePlanningStore.getState();
      addCampaign(campaignInfo);

      // Recargar misiones en el store de gamificación
      const gamificationStore = useGamificationStore.getState();
      if (gamificationStore.fetchMissions) {
        await gamificationStore.fetchMissions();
      }

      // Mostrar toast
      setToastMessage('¡Campaña del Programa Analítico desplegada al Gremio!');
      setTimeout(() => {
        setToastMessage(null);
      }, 5000);

      // Reiniciar estados del wizard
      setWizardStep(1);
      setRealityDiagnosis('');
      setProblematic('');
      setStudentNeeds('');
      setSelectedPdaIds([]);
      setCampaignTitle('');
      setCampaignQuests([]);
    } catch (err: any) {
      console.error('Error al publicar campaña del programa analítico:', err.message || err);
      alert(`Error al publicar la campaña: ${err.message || err}`);
    } finally {
      setIsPublishingCampaign(false);
    }
  };

  // --- Estados de Entrada ---
  const [inputText, setInputText] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('primaria-alta');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [pdaSuggestions, setPdaSuggestions] = useState<string[]>([]);
  const [isLoadingPDAs, setIsLoadingPDAs] = useState(false);
  const [selectedSuggestedPda, setSelectedSuggestedPda] = useState('');
  
  // Sincronizar materia seleccionada
  useEffect(() => {
    if (selectedSubject && !selectedNEMSubject) {
      setSelectedNEMSubject(selectedSubject);
    }
  }, [selectedSubject, selectedNEMSubject]);
  
  // --- Estado de Archivos ---
  const [uploadedFile, setUploadedFile] = useState<{ name: string; type: 'image' | 'pdf'; size: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Sugerencias inteligentes de PDAs (Debounce)
  useEffect(() => {
    if (!inputText || inputText.trim().length < 3) {
      setPdaSuggestions([]);
      setSelectedSuggestedPda('');
      return;
    }

    setIsLoadingPDAs(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const queryWords = inputText.trim().split(/\s+/).filter(w => w.length > 2);
        let dbSuggestions: string[] = [];

        if (queryWords.length > 0) {
          const word = queryWords[0];
          const { data, error } = await supabase
            .from('pdas')
            .select('pda_text')
            .ilike('pda_text', `%${word}%`)
            .limit(10);
            
          if (data && data.length > 0) {
            dbSuggestions = data.map((d: any) => d.pda_text);
          }
        }

        // Fallback local: buscar en pdaMap
        const localResults: string[] = [];
        const localPdaMap = getPdaMap(inputText);
        Object.values(localPdaMap).forEach(catMap => {
          Object.values(catMap).forEach(pdaText => {
            if (pdaText.toLowerCase().includes(inputText.toLowerCase()) || 
                queryWords.some(w => pdaText.toLowerCase().includes(w.toLowerCase()))) {
              localResults.push(pdaText);
            }
          });
        });

        const combined = Array.from(new Set([...dbSuggestions, ...localResults]));
        setPdaSuggestions(combined);
      } catch (err) {
        console.error("Error searching PDAs in PlanningTab:", err);
      } finally {
        setIsLoadingPDAs(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [inputText]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Estados del Gemini API ---
  const [apiSettingsOpen, setApiSettingsOpen] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('iskool_gemini_api_key') || '';
    }
    return '';
  });

  // --- Estados de Ejecución/IA ---
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const generationSteps = [
    'Analizando texto e insumos...',
    'Buscando correspondencia en el plan de estudios NEM...',
    'Generando PDA y ejes articuladores adecuados...',
    'Estructurando secuencia didáctica y criterios de evaluación...',
    'Finalizando planeación...'
  ];

  // --- Estados de Resultado ---
  const [activePlanning, setActivePlanning] = useState<any | null>(null);
  const [planningsHistory, setPlanningsHistory] = useState<any[]>([]);

  // Inicializar Asignatura según las disponibles para el maestro
  useEffect(() => {
    const teacherSchedules = schedulesList.filter(s => s.teacherId === currentTeacher.id);
    if (teacherSchedules.length > 0) {
      setSelectedSubject(teacherSchedules[0].subjectId);
    } else if (displaySubjects.length > 0) {
      setSelectedSubject(displaySubjects[0].id);
    }
  }, [schedulesList, currentTeacher, displaySubjects]);

  // Cargar historial de planeaciones al montar
  useEffect(() => {
    const saved = localStorage.getItem('iskool_generated_plannings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPlanningsHistory(parsed);
        if (parsed.length > 0) {
          setActivePlanning(parsed[0]);
        }
      } catch (e) {
        console.error("Error al cargar historial de planeaciones", e);
      }
    }
  }, []);

  // Guardar historial en localStorage
  const saveHistory = (newHistory: any[]) => {
    setPlanningsHistory(newHistory);
    localStorage.setItem('iskool_generated_plannings', JSON.stringify(newHistory));
  };

  // --- Manejadores de Archivos ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    const type: 'image' | 'pdf' = file.type.includes('pdf') ? 'pdf' : 'image';
    
    setUploadedFile({
      name: file.name,
      type,
      size: sizeMB
    });

    if (type === 'image') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }

    // Auto-rellenar input con el nombre del archivo estilizado
    const cleanName = file.name
      .replace(/\.[^/.]+$/, "") // Quitar extensión
      .replace(/[_-]/g, " ");   // Reemplazar guiones por espacios
    
    if (!inputText) {
      setInputText(cleanName);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setUploadedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // --- Guardar API Key ---
  const handleSaveApiKey = (key: string) => {
    setGeminiApiKey(key);
    localStorage.setItem('iskool_gemini_api_key', key);
    alert('API Key de Gemini guardada de forma segura en tu navegador.');
    setApiSettingsOpen(false);
  };

  // --- Generador Didáctico de Planeación ---
  const handleGenerate = async () => {
    if (!inputText.trim() && !uploadedFile) {
      alert("Por favor introduce una idea, palabra clave o sube un archivo.");
      return;
    }

    setIsGenerating(true);
    setGenerationStep(0);

    // Animación de pasos de IA
    const interval = setInterval(() => {
      setGenerationStep(prev => {
        if (prev < generationSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 1100);

    // Esperar a que la simulación termine
    await new Promise(resolve => setTimeout(resolve, 5500));

    // Determinar si usamos Gemini Real u Offline
    let resultPlanning: any = null;
    const currKey = mapSubjectToCurriculumKey(selectedSubject, displaySubjects.find(s => s.id === selectedSubject)?.name || '');

    if (geminiApiKey.trim()) {
      try {
        resultPlanning = await callGeminiAPI(inputText, selectedLevel, currKey);
      } catch (err) {
        console.error("Fallo llamada a Gemini API, usando motor heurístico local", err);
        resultPlanning = generateLocalNEMPlanning(inputText, selectedLevel, currKey);
      }
    } else {
      resultPlanning = generateLocalNEMPlanning(inputText, selectedLevel, currKey);
    }

    if (resultPlanning) {
      resultPlanning.subjectId = selectedSubject;
      resultPlanning.subjectName = displaySubjects.find(s => s.id === selectedSubject)?.name || 'Asignatura';
      if (selectedSuggestedPda) {
        resultPlanning.pda = selectedSuggestedPda;
      }
    }

    clearInterval(interval);
    setIsGenerating(false);

    // Guardar en Historial y seleccionar
    const updatedHistory = [resultPlanning, ...planningsHistory.filter(p => p.id !== resultPlanning.id)];
    saveHistory(updatedHistory);
    setActivePlanning(resultPlanning);
  };

  // --- Llamada a la API Real de Gemini ---
  const callGeminiAPI = async (promptText: string, level: string, subject: string) => {
    const levelLabel = level === 'preescolar' ? 'Preescolar (Fase 2)' :
                       level === 'primaria-baja' ? 'Primaria Baja (1º a 3º Grado)' :
                       level === 'primaria-alta' ? 'Primaria Alta (4º a 6º Grado)' :
                       level === 'secundaria' ? 'Secundaria (1º a 3º Grado)' : 'Preparatoria / Bachillerato';

    const subjectLabel = subject === 'matematicas' ? 'Matemáticas / Saberes Científicos' :
                         subject === 'ciencias' ? 'Ciencias / Saberes y Pensamiento Científico' : 'Lenguajes (Español/Comunicación)';

    const systemPrompt = `Eres un Asesor Pedagógico Experto de la SEP especializado en la Nueva Escuela Mexicana (NEM).
Genera una planeación didáctica formal basada en la NEM 2022.
Nivel educativo: ${levelLabel}.
Asignatura: ${subjectLabel}.
Tema/Idea de entrada: ${promptText}.

Debes responder ÚNICAMENTE con un objeto JSON válido, estructurado exactamente con las siguientes claves:
{
  "title": "Título corto y atractivo para la sesión",
  "campoFormativo": "Especifica a qué Campo Formativo pertenece (Lenguajes, Saberes y Pensamiento Científico, Ética Naturaleza y Sociedades, o De lo Humano y lo Comunitario)",
  "ejesArticuladores": ["Lista de hasta 2 ejes articuladores de la NEM vigentes"],
  "pda": "Proceso de Desarrollo de Aprendizaje (PDA) oficial y formal adaptado a este nivel y tema",
  "duration": "Ejemplo: 4 horas lectivas",
  "inicio": "Descripción detallada de actividades iniciales (recuperación de saberes previos, conflicto cognitivo)",
  "desarrollo": "Descripción detallada de la secuencia de desarrollo (indagación, experimentos, proyectos)",
  "cierre": "Descripción detallada de actividades de cierre (metacognición, socialización, evaluación formativa)",
  "evaluacion": "Evidencia evaluable y criterios de evaluación formativa",
  "materiales": "Lista de recursos y materiales didácticos requeridos"
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          { parts: [{ text: `${systemPrompt}\n\nGenera la planeación en español con base en la información del tema: "${promptText}"` }] }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Limpiar posibles bloques de código markdown que añaden los LLMs
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsed = JSON.parse(text);

    return {
      id: 'plan-' + Date.now(),
      title: parsed.title || 'Planeación Didáctica',
      subjectId: subject,
      subjectName: subjectLabel,
      levelId: level,
      levelName: levelLabel,
      campoFormativo: parsed.campoFormativo || 'Saberes y Pensamiento Científico',
      ejesArticuladores: parsed.ejesArticuladores || ['Pensamiento Crítico'],
      pda: parsed.pda || 'PDA General',
      duration: parsed.duration || '4 horas',
      inicio: parsed.inicio || 'Actividades de inicio.',
      desarrollo: parsed.desarrollo || 'Actividades de desarrollo.',
      cierre: parsed.cierre || 'Actividades de cierre.',
      evaluacion: parsed.evaluacion || 'Evidencia de aprendizaje.',
      materiales: parsed.materiales || 'Materiales generales.',
      createdAt: new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
    };
  };

  // --- Generador Heurístico Local ---
  const generateLocalNEMPlanning = (promptText: string, level: string, subject: string) => {
    const searchStr = promptText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const capitalizedTopic = promptText.charAt(0).toUpperCase() + promptText.slice(1).trim();

    // ── 1. Detectar categoría temática ──
    const isEcology    = /ecosistem|biodiversid|medio\s?ambiente|planta|animal|clima|contaminac|naturaleza|bosque|agua|suelo|recicl|sustentab|calentamiento/.test(searchStr);
    const isHealth     = /salud|nutricion|alimentac|cuerpo|higiene|enfermedad|ejercicio|deporte|vacuna|primera\s?aid|medicina|covid|pandemia/.test(searchStr);
    const isHistory    = /histori|revolucion|guerra|colonia|independencia|prehispanico|azteca|maya|reform|republica|cultura|civilizac/.test(searchStr);
    const isArt        = /arte|pintura|musica|danza|teatro|literatura|poesia|escultura|dibujo|fotografia|cine|expresion/.test(searchStr);
    const isTech       = /tecnolog|robot|computad|internet|program|codigo|digital|ia\b|inteligencia artificial|red|app|software/.test(searchStr);
    const isMath       = /fraccion|numero|algebra|ecuacion|geometria|estadistica|probabilidad|calculo|proporcion|porcentaje|vector|trigono/.test(searchStr);
    const isCivics     = /ciudadan|democracia|derecho|justicia|paz|inclusion|diversidad|igualdad|genero|comunidad|convivencia|etica|valor/.test(searchStr);
    const isLanguage   = /poe|leyenda|lectura|escribir|redac|espanol|carta|comunic|texto|narrat|argumen|gramatic|ortografia|sinonimo/.test(searchStr);
    const isSocial     = /geografia|region|pais|mundo|globalizac|economia|comercio|mercado|poblacion|migrac|familia|sociedad/.test(searchStr);

    const campos = {
      'matematicas': 'Saberes y Pensamiento Científico',
      'ciencias':    isEcology ? 'Ética, Naturaleza y Sociedades' : 'Saberes y Pensamiento Científico',
      'lenguajes':   'Lenguajes'
    };
    const campo = campos[subject as keyof typeof campos] || (isHistory || isCivics ? 'Ética, Naturaleza y Sociedades' : isArt || isLanguage ? 'Lenguajes' : 'De lo Humano y lo Comunitario');

    // ── 2. Generar ejes articuladores según tema ──
    let ejes: string[] = [];
    if (isEcology)    ejes = ['Vida Saludable', 'Pensamiento Crítico'];
    else if (isHealth) ejes = ['Vida Saludable', 'Inclusión'];
    else if (isHistory) ejes = ['Interculturalidad Crítica', 'Pensamiento Crítico'];
    else if (isArt)   ejes = ['Artes y Experiencias Estéticas', 'Inclusión'];
    else if (isTech)  ejes = ['Pensamiento Crítico', 'Igualdad de Género'];
    else if (isCivics) ejes = ['Inclusión', 'Vida Saludable'];
    else if (isMath)  ejes = ['Pensamiento Crítico', 'Igualdad de Género'];
    else if (isLanguage) ejes = ['Apropiación de las Culturas a través de la Lectura y la Escritura', 'Pensamiento Crítico'];
    else if (isSocial) ejes = ['Interculturalidad Crítica', 'Pensamiento Crítico'];
    else               ejes = ['Pensamiento Crítico', 'Vida Saludable'];

    const topicKey = isEcology ? 'ecology' : isHealth ? 'health' : isHistory ? 'history' : isArt ? 'art' : isTech ? 'tech' : isMath ? 'math' : isCivics ? 'civics' : isLanguage ? 'language' : isSocial ? 'social' : 'default';
    const pdaMap = getPdaMap(capitalizedTopic);
    const pda = pdaMap[level]?.[topicKey] || pdaMap['primaria-alta']['default'];

    // ── 4. Secuencia didáctica diferenciada por tema y nivel ──
    const buildSequence = () => {
      const levelShort = level === 'preescolar' ? 'pb' : level === 'primaria-baja' ? 'pb' : level === 'primaria-alta' ? 'pa' : level === 'secundaria' ? 'sec' : 'prep';
      
      // Actividades de INICIO diferenciadas
      const inicioMap: Record<string, Record<string, string>> = {
        ecology: {
          pb:   `Salir al patio escolar a observar elementos naturales del entorno. Pedir a los alumnos que recojan una hoja, una piedra o un fragmento de suelo y los coloquen en la mesa. Preguntar: ¿De dónde viene esto? ¿Qué necesita para existir? Registrar sus respuestas en una cartulina colectiva con dibujos.`,
          pa:   `Mostrar un video corto (3-4 min) con imágenes de "${capitalizedTopic}" en México y el mundo, contrastando ecosistemas sanos y deteriorados. Preguntar: ¿Qué diferencias observas? ¿Qué factores humanos aparecen? Organizar una lluvia de ideas con post-its en la pizarra.`,
          sec:  `Presentar datos estadísticos reales sobre "${capitalizedTopic}" en México (gráficas de CONABIO o SEMARNAT). Plantear el conflicto cognitivo: ¿Podemos seguir ignorando esta tendencia? Debatir en parejas durante 5 minutos antes de la plenaria.`,
          prep: `Analizar un artículo científico o reporte de organismos internacionales (IPCC, ONU-Ambiente) sobre "${capitalizedTopic}". Identificar variables, metodología y conclusiones. Discutir en equipos la validez de los datos y sus implicaciones para políticas públicas locales.`
        },
        health: {
          pb:   `Comenzar con un juego de "Simón dice" con hábitos saludables relacionados con "${capitalizedTopic}". Luego mostrar imágenes de hábitos saludables vs. no saludables y pedir que los clasifiquen en el pizarrón.`,
          pa:   `Aplicar una encuesta rápida anónima sobre hábitos relacionados con "${capitalizedTopic}" en el grupo. Compartir los resultados y analizar: ¿Qué tanto practicamos lo que sabemos? ¿Por qué existe esa brecha?`,
          sec:  `Analizar estadísticas de salud pública en México relacionadas con "${capitalizedTopic}" (INEGI, Secretaría de Salud). Plantear: ¿Quiénes son más vulnerables y por qué? Introducir el concepto de determinantes sociales de la salud.`,
          prep: `Revisar un estudio epidemiológico sobre "${capitalizedTopic}" en México. Identificar factores de riesgo, grupos vulnerables e intervenciones documentadas. Debatir la efectividad de las políticas actuales.`
        },
        history: {
          pb:   `Mostrar imágenes de "${capitalizedTopic}" y preguntar qué saben al respecto. Leer en colectivo un texto breve ilustrado sobre el tema. Construir en el pizarrón una "línea de tiempo" sencilla con dibujos.`,
          pa:   `Presentar una fuente primaria sencilla (imagen, carta o crónica) relacionada con "${capitalizedTopic}". Preguntar: ¿Quién la escribió? ¿Cuándo? ¿Qué nos dice sobre ese momento histórico? Comparar con el presente.`,
          sec:  `Analizar dos fuentes históricas con perspectivas diferentes sobre "${capitalizedTopic}". Preguntar: ¿Por qué difieren? ¿Cuál es más confiable y por qué? Introducir el concepto de historiografía crítica.`,
          prep: `Revisar un debate historiográfico actual sobre "${capitalizedTopic}". Identificar las corrientes interpretativas en conflicto y los argumentos de cada postura. Plantear la postura propia con base en evidencia documental.`
        },
        art: {
          pb:   `Mostrar obras visuales, fragmentos musicales o movimientos de danza relacionados con "${capitalizedTopic}". Pedir que describan qué sienten al verlos/escucharlos. Realizar una creación libre inicial con materiales de su elección.`,
          pa:   `Presentar obras de artistas mexicanos y mundiales vinculadas a "${capitalizedTopic}". Analizar: técnica, contexto histórico, propósito. Debatir qué quería comunicar el artista y si lo logra.`,
          sec:  `Analizar críticamente una obra o movimiento relacionado con "${capitalizedTopic}" desde dimensiones estéticas, históricas y culturales. Comparar con expresiones contemporáneas. Debatir el papel del arte en la transformación social.`,
          prep: `Revisar teorías estéticas aplicadas a "${capitalizedTopic}". Analizar una obra canónica y una de vanguardia. Discutir: ¿Qué define el valor artístico? ¿Qué papel juega el contexto sociopolítico?`
        },
        tech: {
          pb:   `Mostrar objetos tecnológicos cotidianos relacionados con "${capitalizedTopic}" y preguntar: ¿Cómo funcionan? ¿Quién los inventó? ¿Cómo cambiarían nuestra vida sin ellos? Hacer un dibujo de "cómo se vería el mundo sin esta tecnología".`,
          pa:   `Ver un video sobre aplicaciones actuales de "${capitalizedTopic}" en distintos sectores (medicina, educación, ambiente). Preguntar: ¿Qué problemas resuelve? ¿Cuáles genera? Organizar un debate de pros y contras.`,
          sec:  `Explorar casos reales del impacto de "${capitalizedTopic}" en la sociedad (positivos y negativos). Analizar dilemas éticos: privacidad, brecha digital, desempleo. Diseñar un código ético básico para su uso responsable.`,
          prep: `Analizar tendencias tecnológicas de "${capitalizedTopic}" con fuentes académicas y empresariales. Evaluar impacto social, económico y ambiental. Plantear un modelo de innovación responsable con metodología de design thinking.`
        },
        math: {
          pb:   `Presentar un problema real y cotidiano que requiera usar "${capitalizedTopic}" (compartir materiales, medir el salón, contar objetos). Pedir que lo resuelvan con material concreto antes de explicar el concepto formal.`,
          pa:   `Plantear un desafío matemático contextualizado (presupuesto escolar, recetas de cocina, datos estadísticos del grupo) que involucre "${capitalizedTopic}". Permitir que lo intenten en parejas sin instrucción previa para activar conocimientos previos.`,
          sec:  `Presentar una situación real (financiera, científica o social) que no pueda resolverse sin aplicar "${capitalizedTopic}". Preguntar: ¿Qué herramientas matemáticas necesitamos? ¿Cómo formalizamos el problema?`,
          prep: `Revisar la historia y aplicaciones de "${capitalizedTopic}" en ciencias, ingeniería o economía. Plantear un problema abierto sin solución única para que los equipos propongan modelos distintos y los defiendan.`
        },
        civics: {
          pb:   `Comenzar con un juego de roles donde los alumnos simulan situaciones de convivencia escolar relacionadas con "${capitalizedTopic}". Reflexionar: ¿Qué sintieron? ¿Qué cambiarían? Construir acuerdos colectivos de grupo.`,
          pa:   `Presentar una noticia o caso real donde se vulnera o se ejerce "${capitalizedTopic}". Analizar: ¿A quién afecta? ¿Qué instituciones intervienen? ¿Qué podrían hacer los ciudadanos?`,
          sec:  `Analizar un caso jurídico o social relacionado con "${capitalizedTopic}" en México. Revisar el marco legal (Constitución, tratados internacionales). Debatir: ¿La ley es suficiente? ¿Qué falta en la práctica?`,
          prep: `Revisar un conflicto social vigente vinculado a "${capitalizedTopic}" desde perspectivas filosóficas, jurídicas y sociológicas. Analizar mecanismos de participación ciudadana disponibles y sus limitaciones estructurales.`
        },
        language: {
          pb:   `Escuchar o leer en voz alta un texto breve y atractivo relacionado con "${capitalizedTopic}". Preguntar: ¿Qué entendieron? ¿Qué palabra les llamó la atención? ¿Cómo les hizo sentir? Completar un organizador gráfico sencillo.`,
          pa:   `Presentar dos textos sobre "${capitalizedTopic}" con propósitos diferentes (informativo y narrativo). Identificar diferencias de estructura, tono y vocabulario. Debatir cuál es más convincente y por qué.`,
          sec:  `Analizar un texto argumentativo o de opinión sobre "${capitalizedTopic}". Identificar tesis, argumentos, contraargumentos y falacias. Evaluar la solidez del razonamiento y la eficacia comunicativa del autor.`,
          prep: `Revisar textos académicos y periodísticos sobre "${capitalizedTopic}" comparando registros, géneros y posicionamientos ideológicos. Analizar cómo el lenguaje construye realidades y moldea opinión pública.`
        },
        social: {
          pb:   `Mostrar un mapa de México o del mundo señalando zonas relacionadas con "${capitalizedTopic}". Preguntar: ¿Conocen estos lugares? ¿Qué hay ahí? Ubicar en un mapa en blanco los elementos identificados.`,
          pa:   `Analizar datos demográficos, económicos o geográficos de "${capitalizedTopic}" en México usando tablas y mapas. Identificar patrones y desigualdades. Preguntar: ¿Por qué existen estas diferencias entre regiones?`,
          sec:  `Revisar indicadores socioeconómicos (IDH, GINI, PIB) relacionados con "${capitalizedTopic}" a nivel estatal y nacional. Analizar causas estructurales de las desigualdades observadas y su relación con políticas públicas.`,
          prep: `Analizar procesos globales de "${capitalizedTopic}" desde perspectivas de sistemas-mundo, geopolítica e interdependencia. Evaluar teorías explicativas y proponer marcos interpretativos propios con base en datos.`
        },
        default: {
          pb:   `Iniciar con una actividad lúdica de exploración libre relacionada con "${capitalizedTopic}". Los alumnos comparten lo que ya saben en una lluvia de ideas colectiva dibujada en el pizarrón. Se plantea la pregunta central: ¿Qué queremos aprender sobre este tema?`,
          pa:   `Presentar un caso o situación provocadora relacionada con "${capitalizedTopic}" que genere curiosidad y preguntas. Los alumnos registran sus saberes previos y sus dudas en tarjetas de colores y las clasifican en el pizarrón.`,
          sec:  `Presentar un conflicto cognitivo real sobre "${capitalizedTopic}" con datos, imágenes o testimonios contradictorios. Los alumnos debaten en equipos sus interpretaciones previas antes de iniciar la investigación sistemática.`,
          prep: `Revisar distintas perspectivas teóricas sobre "${capitalizedTopic}" y plantear preguntas de investigación abierta. Los equipos proponen hipótesis iniciales y diseñan un protocolo básico para contrastarlas.`
        }
      };

      const desarrolloMap: Record<string, Record<string, string>> = {
        ecology: {
          pb:   `Salir al patio o huerto escolar para realizar una exploración guiada de "${capitalizedTopic}". En equipos de 3, registrar observaciones en una "bitácora de explorador" con dibujos y descripciones. Al regresar, construir un mural colectivo con sus hallazgos y rotularlo con conceptos clave aprendidos.`,
          pa:   `En equipos, diseñar y ejecutar una "auditoría ambiental" de la escuela relacionada con "${capitalizedTopic}". Recolectar datos reales (residuos, consumo de agua, uso de energía), analizarlos en tablas y elaborar un informe con propuestas de mejora para presentar a las autoridades escolares.`,
          sec:  `Investigar un estudio de caso local o regional sobre "${capitalizedTopic}" usando fuentes científicas. Analizar causas, consecuencias e impactos en distintos actores sociales. En equipos, diseñar un proyecto de intervención comunitaria con fases, responsables e indicadores de éxito medibles.`,
          prep: `Diseñar una investigación de campo sobre "${capitalizedTopic}" con metodología mixta (datos cuantitativos + entrevistas). Aplicar herramientas de análisis ambiental, sistematizar resultados y elaborar un reporte académico con propuestas de política pública basadas en evidencia.`
        },
        health: {
          pb:   `Elaborar en equipos un "Semáforo de la Salud" sobre "${capitalizedTopic}" con tarjetas de colores (verde: hábito saludable, rojo: perjudicial). Crear un folleto ilustrado con consejos para compartir con sus familias.`,
          pa:   `Diseñar y aplicar una encuesta en la escuela sobre hábitos relacionados con "${capitalizedTopic}". Tabular resultados, elaborar gráficas y redactar conclusiones. Preparar una campaña de sensibilización con carteles, trípticos o videos cortos.`,
          sec:  `Investigar factores de riesgo y protección de "${capitalizedTopic}" en adolescentes mexicanos. Analizar estadísticas oficiales, revisar programas de prevención existentes y evaluar su efectividad. Diseñar una propuesta de intervención escolar con estrategias basadas en evidencia.`,
          prep: `Realizar una revisión sistemática de literatura científica sobre "${capitalizedTopic}". Analizar ensayos clínicos, revisiones Cochrane y metaanálisis. Diseñar un protocolo de intervención con indicadores de impacto y propuesta de evaluación de efectividad.`
        },
        history: {
          pb:   `Construir en equipos una "caja de recuerdos" sobre "${capitalizedTopic}" con imágenes, objetos representativos y textos breves. Dramatizar un momento clave del tema con personajes creados por el grupo.`,
          pa:   `Analizar en equipos fuentes primarias y secundarias sobre "${capitalizedTopic}" (mapas, fotografías, documentos, testimonios). Elaborar una línea del tiempo detallada con causas, consecuencias y conexiones con el presente. Redactar un texto de síntesis histórica con vocabulario específico.`,
          sec:  `Comparar interpretaciones historiográficas sobre "${capitalizedTopic}" de distintas corrientes y épocas. Analizar el papel de los distintos actores sociales (elite, pueblo, mujeres, minorías). Redactar un ensayo argumentativo con postura personal sustentada en evidencia.`,
          prep: `Desarrollar una investigación historiográfica sobre "${capitalizedTopic}" consultando fuentes primarias digitalizadas (AGN, Hemeroteca Nacional). Aplicar análisis histórico crítico, identificar sesgos y construir una interpretación propia fundamentada con aparato crítico formal.`
        },
        art: {
          pb:   `Explorar materiales y técnicas relacionadas con "${capitalizedTopic}" mediante talleres de experimentación libre. Crear una obra colectiva usando técnicas descubiertas. Exhibirla en el salón explicando el proceso creativo con palabras propias.`,
          pa:   `Investigar artistas o movimientos vinculados a "${capitalizedTopic}" en México y el mundo. Analizar obras representativas en cuanto a técnica, simbolismo y contexto. Crear una obra original inspirada en lo aprendido y preparar una cédula artística para su exposición.`,
          sec:  `Desarrollar un proyecto artístico relacionado con "${capitalizedTopic}" integrando referentes históricos y culturales. Explorar técnicas avanzadas, documentar el proceso creativo en un portafolio y presentar la obra en una muestra colectiva con análisis crítico.`,
          prep: `Desarrollar un proyecto artístico conceptual sobre "${capitalizedTopic}" con sustento teórico en filosofía estética o teoría del arte contemporáneo. Documentar investigación, proceso y reflexión crítica en un dossier académico. Presentar en formato de muestra pública con articulación discursiva.`
        },
        tech: {
          pb:   `Construir un artefacto sencillo relacionado con "${capitalizedTopic}" usando materiales reciclados. Documentar el proceso con dibujos y describir para qué sirve y cómo funciona. Compartir en exposición grupal.`,
          pa:   `Diseñar en equipo un proyecto tecnológico que aplique principios de "${capitalizedTopic}" para resolver un problema real de la escuela. Crear un prototipo funcional o una maqueta, documentar las etapas del proceso y presentarlo al grupo.`,
          sec:  `Desarrollar un prototipo funcional relacionado con "${capitalizedTopic}" usando herramientas digitales o de fabricación disponibles. Documentar metodología (design thinking o scrum), pruebas, ajustes y resultados. Evaluar impacto social y sostenibilidad del diseño.`,
          prep: `Diseñar una solución tecnológica compleja vinculada a "${capitalizedTopic}" aplicando metodologías de innovación (lean startup, design thinking). Desarrollar prototipo, plan de negocio o política tecnológica, evaluar viabilidad y presentar ante audiencia externa simulada.`
        },
        math: {
          pb:   `Resolver en equipos una secuencia de problemas concretos sobre "${capitalizedTopic}" usando materiales manipulables (ábacos, fichas, regletas). Representar las soluciones gráficamente. Crear un "libro de problemas" con situaciones inventadas por el propio grupo.`,
          pa:   `Aplicar conceptos de "${capitalizedTopic}" en un proyecto de investigación estadística del grupo (encuestas, mediciones, datos escolares). Construir gráficas, calcular medidas y redactar conclusiones en un reporte. Presentar resultados a otro grupo.`,
          sec:  `Modelar situaciones económicas, físicas o sociales reales usando "${capitalizedTopic}". Resolver problemas abiertos en equipo, comparar distintos métodos de solución y evaluar cuál es más eficiente. Elaborar un reporte técnico con procedimientos, gráficas y justificaciones.`,
          prep: `Aplicar herramientas avanzadas de "${capitalizedTopic}" para modelar un fenómeno real (financiero, demográfico, físico). Utilizar software matemático o de graficación. Elaborar un reporte con marco teórico, desarrollo y análisis crítico de resultados obtenidos.`
        },
        civics: {
          pb:   `Simular una asamblea escolar sobre un problema real del aula relacionado con "${capitalizedTopic}". Elegir representantes, debatir propuestas y tomar decisiones colectivas. Redactar acuerdos y compromisos grupales en una "Constitución del Salón".`,
          pa:   `Investigar un caso real de ejercicio o vulneración de "${capitalizedTopic}" en México o su comunidad. Analizar causas, actores implicados e instituciones responsables. Diseñar una campaña de sensibilización escolar con propuestas concretas de cambio.`,
          sec:  `Analizar un caso jurídico real relacionado con "${capitalizedTopic}" usando el marco constitucional mexicano. Simular un juicio oral: fiscal, defensa, juez y testigos. Redactar un veredicto fundamentado y reflexionar sobre la brecha entre ley y práctica social.`,
          prep: `Diseñar un proyecto de incidencia ciudadana sobre "${capitalizedTopic}" que incluya diagnóstico participativo, propuesta de política pública, estrategia de comunicación y plan de evaluación de impacto. Presentarlo ante audiencia real o simulada de tomadores de decisiones.`
        },
        language: {
          pb:   `Crear en equipos un texto corto relacionado con "${capitalizedTopic}" (cuento, carta o instructivo). Ilustrarlo, compartirlo con el grupo y comentar lo que más gustó. Compilar las producciones en una antología colectiva del salón.`,
          pa:   `Producir en equipos un texto de distinto género sobre "${capitalizedTopic}" (reportaje, cuento, poema, artículo de opinión). Revisar borradores con retroalimentación entre pares usando criterios de evaluación acordados. Publicar la versión final en el periódico mural escolar.`,
          sec:  `Analizar textos de distintos géneros sobre "${capitalizedTopic}" identificando argumentación, retórica e intención comunicativa. Producir un texto argumentativo complejo con estructura formal, tesis sustentada y contraargumentos. Participar en un debate moderado sobre el tema.`,
          prep: `Investigar cómo se ha abordado "${capitalizedTopic}" en distintos géneros y épocas literarias o periodísticas. Analizar recursos retóricos y posicionamientos ideológicos. Producir un ensayo académico con aparato crítico formal o un texto creativo con intención transformadora.`
        },
        social: {
          pb:   `Elaborar en equipos un mapa de su comunidad o región identificando elementos relacionados con "${capitalizedTopic}". Investigar datos básicos y crear una ficha informativa ilustrada. Compartir en exposición grupal.`,
          pa:   `Investigar características socioeconómicas y geográficas de "${capitalizedTopic}" en distintas regiones de México. Comparar indicadores, elaborar mapas temáticos y gráficas. Redactar un informe con análisis de causas y propuestas de desarrollo local.`,
          sec:  `Analizar datos estadísticos y geoespaciales sobre "${capitalizedTopic}" usando fuentes oficiales (INEGI, CONAPO). Identificar desigualdades regionales, factores históricos y políticas públicas vigentes. Elaborar un estudio de caso regional fundamentado con evidencia.`,
          prep: `Analizar "${capitalizedTopic}" desde perspectivas teóricas interdisciplinares (geografía crítica, economía política, sociología). Revisar indicadores internacionales, modelar escenarios futuros y proponer estrategias de desarrollo sustentable con base en evidencia comparada.`
        },
        default: {
          pb:   `En equipos de 3 alumnos, explorar "${capitalizedTopic}" usando distintas fuentes (libros, imágenes, material concreto). Organizar la información en un mapa mental ilustrado. Cada equipo comparte sus hallazgos con el grupo y construyen juntos una síntesis colectiva en el pizarrón.`,
          pa:   `Investigar en equipos los aspectos más importantes de "${capitalizedTopic}" usando diversas fuentes. Sistematizar la información en un organizador gráfico (cuadro comparativo, esquema o infografía). Elaborar un producto comunicativo (tríptico, póster o presentación) para compartir con otros grupos.`,
          sec:  `Desarrollar en equipos un proyecto de investigación sobre "${capitalizedTopic}" con pregunta de investigación propia, metodología definida y fuentes académicas. Analizar los datos obtenidos, elaborar conclusiones fundamentadas y presentarlas ante el grupo en formato académico.`,
          prep: `Diseñar y ejecutar un proyecto de investigación sobre "${capitalizedTopic}" con sustento teórico y metodológico. Recopilar y analizar datos de fuentes primarias y secundarias. Elaborar un producto de divulgación académica (artículo, ensayo, póster científico) con aparato crítico formal.`
        }
      };

      const cierreMap: Record<string, Record<string, string>> = {
        ecology: {
          pb:   `Presentar en plenaria el mural elaborado. Cada equipo explica qué aprendió sobre "${capitalizedTopic}" y qué puede hacer en casa para cuidar el ambiente. Escribir en tarjetas individuales un compromiso concreto y pegarlo en el "árbol de compromisos" del salón.`,
          pa:   `Presentar los informes de auditoría ambiental ante el grupo y comentar las propuestas. Elegir colectivamente las 3 más viables para implementar en la escuela. Reflexionar en bitácora: ¿Qué aprendí sobre mi relación con "${capitalizedTopic}"? ¿Qué voy a cambiar?`,
          sec:  `Presentar los proyectos de intervención en un "Foro Escolar por el Ambiente". Recibir retroalimentación de compañeros y docente con base en rúbrica. Debatir: ¿Qué obstáculos enfrenta la acción ambiental? ¿Cómo se supera la inacción? Autoevaluación escrita.`,
          prep: `Presentar el reporte de investigación en formato de congreso académico simulado. Responder preguntas del auditorio y recibir retroalimentación técnica. Reflexionar: ¿Cómo cambia este estudio la forma en que comprendo "${capitalizedTopic}"? ¿Qué líneas de investigación quedan abiertas?`
        },
        default: {
          pb:   `Ronda de socialización: cada equipo comparte lo más importante que aprendió sobre "${capitalizedTopic}". Construir juntos una "Nube de saberes" en el pizarrón. Completar individualmente la ficha: "Antes pensaba... Ahora sé que... Todavía me pregunto..."`,
          pa:   `Presentar los productos elaborados al grupo. Coevaluar con rúbrica acordada previamente. Reflexionar individualmente en la bitácora: ¿Qué fue lo más difícil? ¿Qué cambió en mi forma de pensar sobre "${capitalizedTopic}"? Compartir una conclusión oral con el grupo.`,
          sec:  `Llevar a cabo una plenaria académica donde cada equipo defiende sus hallazgos sobre "${capitalizedTopic}" y responde preguntas. Coevaluar con criterios acordados. Redactar individualmente una reflexión crítica de media página sobre el aprendizaje más significativo.`,
          prep: `Presentar los proyectos en formato académico y responder cuestionamientos del grupo y del docente. Autoevaluación con rúbrica de investigación. Redactar una reflexión escrita sobre cómo el estudio de "${capitalizedTopic}" transforma la comprensión de la realidad y abre nuevas preguntas.`
        }
      };

      const inicio    = (inicioMap[topicKey]    || inicioMap['default'])[levelShort];
      const desarrollo = (desarrolloMap[topicKey] || desarrolloMap['default'])[levelShort];
      const cierre    = (cierreMap[topicKey]     || cierreMap['default'])[levelShort];

      return { inicio, desarrollo, cierre };
    };

    const { inicio, desarrollo, cierre } = buildSequence();

    // ── 5. Evaluación y materiales diferenciados ──
    const evalMap: Record<string, string> = {
      ecology:   `Bitácora de exploración o auditoría ambiental con datos reales, propuesta de acción fundamentada sobre "${capitalizedTopic}", y reflexión individual sobre el compromiso ambiental personal.`,
      health:    `Producto de campaña de salud relacionada con "${capitalizedTopic}" (tríptico, cartel, video), encuesta con análisis estadístico y propuesta de intervención evaluada por rúbrica.`,
      history:   `Ensayo o análisis histórico sobre "${capitalizedTopic}" con citas de fuentes primarias y secundarias, línea del tiempo argumentada y reflexión sobre su vigencia actual.`,
      art:       `Obra artística original vinculada a "${capitalizedTopic}" con cédula de presentación, portafolio de proceso creativo y análisis crítico de referentes trabajados.`,
      tech:      `Prototipo funcional o propuesta tecnológica relacionada con "${capitalizedTopic}", documentación del proceso (diseño, prueba, ajuste) y reflexión ética sobre el impacto social.`,
      math:      `Reporte de resolución de problemas sobre "${capitalizedTopic}" con distintos procedimientos, representaciones gráficas y justificación de la eficiencia de cada método.`,
      civics:    `Producto de incidencia ciudadana sobre "${capitalizedTopic}" (campaña, propuesta, juicio simulado), reflexión sobre la responsabilidad cívica personal y coevaluación del trabajo colaborativo.`,
      language:  `Texto producido sobre "${capitalizedTopic}" en el género trabajado, con evidencia de revisión y mejora, presentado ante audiencia real o simulada y evaluado con rúbrica de escritura.`,
      social:    `Informe geográfico-social con mapas temáticos, análisis de indicadores y propuesta de desarrollo relacionada con "${capitalizedTopic}", evaluado con rúbrica de investigación social.`,
      default:   `Producto final del proyecto de investigación sobre "${capitalizedTopic}" (infografía, reporte, presentación), reflexión escrita metacognitiva y coevaluación del desempeño en equipo.`
    };

    const materialesMap: Record<string, string> = {
      ecology:   `Material de campo (lupas, bolsas de plástico, fichas de registro), fuentes de datos ambientales (CONABIO, SEMARNAT), cartulinas, marcadores y recursos reciclados para prototipos.`,
      health:    `Estadísticas de salud (INEGI, SSA), cartulinas para campaña, colores, acceso a internet, encuestas impresas y material para elaborar productos comunicativos.`,
      history:   `Fuentes primarias digitalizadas o impresas, atlas histórico, línea del tiempo en papel bond, colores y recursos audiovisuales (video documental o fotografías de época).`,
      art:       `Materiales de la técnica trabajada (pinceles, pinturas, arcilla, instrumentos), reproducciones de obras de referencia, portafolios y fichas de análisis artístico.`,
      tech:      `Materiales de construcción (cartón, cables, sensores básicos) o dispositivos digitales, guía de diseño, fichas de documentación del proceso y recursos de investigación.`,
      math:      `Material manipulable específico al tema (ábacos, regletas, fichas, dados), papel milimétrico, calculadora, software de graficación (opcional) y hojas de problemas contextualizados.`,
      civics:    `Constitución Política de los Estados Unidos Mexicanos, noticias de prensa, materiales para debate (tarjetas de roles, reglamento de asamblea) y recursos para la campaña de sensibilización.`,
      language:  `Textos modelo de distintos géneros relacionados con "${capitalizedTopic}", diccionario, guías de escritura, material para publicación (periódico mural, blog escolar) y rúbricas de evaluación.`,
      social:    `Mapas temáticos, atlas geográfico, bases de datos de INEGI y CONAPO, computadoras con acceso a internet, papel bond y marcadores para elaborar infografías y cartografía.`,
      default:   `Libros de texto "Nuestros Saberes" y fuentes complementarias sobre "${capitalizedTopic}", cartulinas, marcadores, acceso a internet para investigación y materiales de presentación.`
    };

    const levelNames = {
      'preescolar':     'Preescolar (Fase 2)',
      'primaria-baja':  'Primaria Baja (1º a 3º Grado)',
      'primaria-alta':  'Primaria Alta (4º a 6º Grado)',
      'secundaria':     'Secundaria (1º a 3º Grado)',
      'preparatoria':   'Preparatoria / Bachillerato'
    };

    const subjectNames = {
      'matematicas': 'Matemáticas',
      'ciencias':    'Ciencias Naturales',
      'lenguajes':   'Español / Lenguajes'
    };

    return {
      id: 'plan-' + Date.now(),
      title: `Proyecto didáctico: ${capitalizedTopic} — ${levelNames[level as keyof typeof levelNames] || level}`,
      subjectId: subject,
      subjectName: subjectNames[subject as keyof typeof subjectNames] || 'Asignatura',
      levelId: level,
      levelName: levelNames[level as keyof typeof levelNames] || 'Nivel Educativo',
      campoFormativo: campo,
      ejesArticuladores: ejes,
      pda,
      duration: level === 'preparatoria' ? '6 horas lectivas' : level === 'secundaria' ? '5 horas lectivas' : '4 horas lectivas',
      inicio,
      desarrollo,
      cierre,
      evaluacion: evalMap[topicKey] || evalMap['default'],
      materiales: materialesMap[topicKey] || materialesMap['default'],
      createdAt: new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })
    };
  };

  // --- Actualizar campos editados ---
  const updateActivePlanningField = (key: string, value: any) => {
    if (!activePlanning) return;
    const updated = { ...activePlanning, [key]: value };
    setActivePlanning(updated);
    
    // Actualizar también en el historial
    const updatedHistory = planningsHistory.map(p => p.id === activePlanning.id ? updated : p);
    saveHistory(updatedHistory);
  };

  // --- Borrar Planeación ---
  const handleDeletePlanning = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("¿Seguro que deseas eliminar esta planeación del historial?")) {
      const updatedHistory = planningsHistory.filter(p => p.id !== id);
      saveHistory(updatedHistory);
      if (activePlanning?.id === id) {
        setActivePlanning(updatedHistory.length > 0 ? updatedHistory[0] : null);
      }
    }
  };

  // --- Descarga a PDF usando window.print ---
  const handlePrint = () => {
    if (!activePlanning) return;
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 px-6 py-4 rounded-2xl shadow-xl border border-zinc-800 dark:border-zinc-200 flex items-center gap-3 animate-bounce">
          <Award className="h-6 w-6 text-yellow-500 animate-pulse" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-yellow-500 text-left">Gremio Actualizado</span>
            <span className="text-xs font-bold text-left">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Selector de Módulo */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 pb-px gap-4 no-print">
        <button
          type="button"
          onClick={() => setActiveModule('generator')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeModule === 'generator'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold'
              : 'border-transparent text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300'
          }`}
        >
          <Wand2 className="h-4.5 w-4.5" />
          Generador de Planeación Didáctica
        </button>
        <button
          type="button"
          onClick={() => setActiveModule('programa-analitico')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeModule === 'programa-analitico'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-extrabold'
              : 'border-transparent text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300'
          }`}
        >
          <BookOpen className="h-4.5 w-4.5" />
          Programa Analítico (SEP)
        </button>
      </div>

      {activeModule === 'generator' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* -------------------- COLUMNA IZQUIERDA: INPUTS (lg:col-span-4) -------------------- */}
      <div className="lg:col-span-4 flex flex-col gap-5 bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-5 shadow-sm text-left no-print">
        
        <div className="flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <h3 className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Wand2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Configurar Insumos
          </h3>
          <button 
            onClick={() => setApiSettingsOpen(!apiSettingsOpen)}
            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-650 transition-colors"
            title="Configurar API Key de Gemini"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>

        {/* Formulario API Key */}
        {apiSettingsOpen && (
          <div className="bg-blue-50/50 dark:bg-zinc-950/40 p-4 rounded-2xl border border-blue-150/40 dark:border-zinc-850 flex flex-col gap-3">
            <h4 className="text-[10px] font-black text-blue-700 dark:text-blue-400 uppercase tracking-wide">Clave de API Gemini (Google AI)</h4>
            <p className="text-[9.5px] text-zinc-500 leading-normal">
              Opcional. Si deseas usar inteligencia artificial generativa de verdad en lugar del motor local offline, introduce tu API key. Se guarda solo en tu navegador.
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 text-xs p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 font-mono focus:outline-none"
              />
              <button
                onClick={() => handleSaveApiKey(geminiApiKey)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        )}

        {/* Nivel Educativo y Asignatura */}
        <div className="grid grid-cols-2 gap-4 font-bold text-xs text-zinc-800 dark:text-zinc-200">
          <div className="flex flex-col gap-1.5">
            <label className="text-[9.5px] text-zinc-400 uppercase tracking-wider">Nivel Educativo</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-150 focus:outline-none focus:border-blue-500 font-bold"
            >
              <option value="preescolar">Preescolar (Fase 2)</option>
              <option value="primaria-baja">Primaria Baja (Fase 3: 1º-3º)</option>
              <option value="primaria-alta">Primaria Alta (Fase 5: 4º-6º)</option>
              <option value="secundaria">Secundaria (Fase 6: 1º-3º)</option>
              <option value="preparatoria">Preparatoria (Fase 6 / Bachillerato)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[9.5px] text-zinc-400 uppercase tracking-wider">Asignatura</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-150 focus:outline-none focus:border-blue-500 font-bold"
            >
              {displaySubjects?.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Entrada de Texto o Párrafo */}
        <div className="flex flex-col gap-1.5 text-xs relative">
          <label className="text-[9.5px] text-zinc-400 font-bold uppercase tracking-wider">Idea, Palabra Clave o Párrafo (Tema)</label>
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe el tema de la clase, ejemplo: 'fracciones equivalentes con pizza', 'cuidado del agua', 'biodigestores', 'leyendas prehispánicas'..."
            className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-150 focus:outline-none focus:border-blue-500 leading-relaxed font-semibold resize-none"
          />
          {/* Sugerencias Inteligentes de PDAs para Planeación */}
          {pdaSuggestions.length > 0 && (
            <div className="mt-1 flex flex-col gap-1">
              <label className="text-[9px] font-bold text-blue-500 uppercase flex items-center gap-1">
                <Sparkles className="h-3 w-3 animate-pulse" />
                Sugerencias de PDAs ({isLoadingPDAs ? 'Buscando...' : 'Recomendadas'}):
              </label>
              <select
                onChange={(e) => {
                  setSelectedSuggestedPda(e.target.value);
                }}
                className="w-full text-[10px] p-2 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 text-zinc-800 dark:text-zinc-200 focus:outline-none font-medium"
                value={selectedSuggestedPda}
              >
                <option value="">-- Selecciona un PDA sugerido --</option>
                {pdaSuggestions.map((pda, idx) => (
                  <option key={idx} value={pda}>{pda}</option>
                ))}
              </select>
              {selectedSuggestedPda && (
                <div className="text-[9.5px] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-950 p-2 rounded-lg mt-1 border border-zinc-250 dark:border-zinc-800">
                  <strong>PDA Seleccionado:</strong> {selectedSuggestedPda}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Subida de Archivos (Imagen o PDF) */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[9.5px] text-zinc-400 font-bold uppercase tracking-wider">Subir Fotografía o Archivo PDF</label>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,application/pdf"
            className="hidden"
          />

          {!uploadedFile ? (
            <button
              type="button"
              onClick={triggerFileSelect}
              className="w-full border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-blue-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-950/30 transition-all group"
            >
              <div className="p-2.5 rounded-full bg-zinc-50 dark:bg-zinc-950 text-zinc-400 group-hover:text-blue-500 group-hover:scale-105 transition-all">
                <Plus className="h-5 w-5" />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-zinc-700 dark:text-zinc-200">Seleccionar imagen o PDF</p>
                <p className="text-[9px] text-zinc-400 mt-0.5">Formatos aceptados: JPG, PNG, PDF (Máx. 10MB)</p>
              </div>
            </button>
          ) : (
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 bg-zinc-50 dark:bg-zinc-950/50 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5 overflow-hidden">
                {uploadedFile.type === 'image' ? (
                  imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Miniatura" 
                      className="h-10 w-10 rounded-lg object-cover border border-zinc-200 dark:border-zinc-800 flex-shrink-0"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-zinc-150 dark:bg-zinc-900 text-zinc-500 flex items-center justify-center flex-shrink-0">
                      <Image className="h-5 w-5" />
                    </div>
                  )
                ) : (
                  <div className="h-10 w-10 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-500 border border-red-100 dark:border-red-900/30 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                )}
                
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">{uploadedFile.name}</p>
                  <p className="text-[9px] text-zinc-400 mt-0.5 uppercase font-bold">{uploadedFile.type} • {uploadedFile.size}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={removeFile}
                className="p-1 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-rose-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Botón de Enviar */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || (!inputText.trim() && !uploadedFile)}
          className={`w-full py-3 rounded-2xl text-xs font-black shadow-md flex items-center justify-center gap-2 transition-all ${
            isGenerating 
              ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed shadow-none'
              : !inputText.trim() && !uploadedFile
                ? 'bg-zinc-100 dark:bg-zinc-950 text-zinc-400 border border-zinc-200 dark:border-zinc-800 cursor-not-allowed shadow-none'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10 hover:scale-[1.01]'
          }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Generando Planeación...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generar con IA NEM
            </>
          )}
        </button>

        {/* HISTORIAL DE PLANEACIONES */}
        {planningsHistory.length > 0 && (
          <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-4 flex flex-col gap-3">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Historial de Planeaciones</span>
            <div className="flex flex-col gap-2 max-h-[170px] overflow-y-auto pr-1">
              {planningsHistory.map((plan) => {
                const isActive = activePlanning?.id === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs flex justify-between items-center transition-all ${
                      isActive
                        ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-950/10 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 font-bold'
                        : 'bg-white dark:bg-zinc-900 border-zinc-150 hover:border-zinc-250 dark:border-zinc-800/80 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <button
                      onClick={() => setActivePlanning(plan)}
                      className="flex items-center gap-2 overflow-hidden flex-1 text-left"
                    >
                      <FileText className="h-4 w-4 flex-shrink-0 text-zinc-400 dark:text-zinc-500" />
                      <span className="truncate">{plan.title}</span>
                    </button>
                    
                    <button
                      onClick={(e) => handleDeletePlanning(plan.id, e)}
                      className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-rose-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* -------------------- COLUMNA DERECHA: DOCUMENTO / LOADING (lg:col-span-8) -------------------- */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        
        {/* PANTALLA DE CARGA DE IA */}
        {isGenerating ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-16 flex flex-col items-center justify-center text-center gap-6 shadow-sm min-h-[480px] no-print">
            <div className="relative h-20 w-20">
              <div className="absolute inset-0 rounded-full border-4 border-blue-500/10 dark:border-blue-500/5" />
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-pulse" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-base font-black text-zinc-950 dark:text-white">Procesando Insumos Pedagógicos</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm leading-normal">
                Nuestra IA está estructurando la planeación didáctica de acuerdo a los campos formativos de la NEM actual.
              </p>
            </div>

            {/* Pasos Visuales */}
            <div className="w-full max-w-md bg-zinc-50 dark:bg-zinc-950/60 rounded-2xl border border-zinc-150 dark:border-zinc-850 p-5 flex flex-col gap-3.5">
              {generationSteps.map((step, idx) => {
                const isActive = generationStep === idx;
                const isCompleted = generationStep > idx;
                return (
                  <div key={idx} className="flex items-center gap-3 text-xs font-semibold">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 flex-shrink-0" />
                    ) : isActive ? (
                      <div className="h-4.5 w-4.5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin flex-shrink-0" />
                    ) : (
                      <div className="h-4.5 w-4.5 rounded-full border-2 border-zinc-200 dark:border-zinc-800 flex-shrink-0" />
                    )}
                    
                    <span className={isCompleted ? 'text-zinc-400 line-through' : isActive ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-zinc-400'}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : !activePlanning ? (
          /* PANTALLA INICIAL SIN PLAN */
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-16 flex flex-col items-center justify-center text-center gap-5 shadow-sm min-h-[480px] no-print">
            <div className="p-4.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-3xl">
              <FileDown className="h-12 w-12" />
            </div>
            <div>
              <h3 className="text-base font-black text-zinc-950 dark:text-white">Generador de Planeación Escolar</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm leading-normal">
                Usa el formulario lateral para ingresar la idea de tu clase. El generador estructurará una planeación pedagógica NEM editable y descargable en PDF al instante.
              </p>
            </div>
          </div>
        ) : (
          /* VISTA DEL DOCUMENTO GENERADO (HOJA A4) */
          <>
            {/* Barra de Acciones del Documento */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-3 shadow-xs flex justify-between items-center no-print">
              <span className="text-[10px] text-zinc-400 font-bold flex items-center gap-1.5 px-2">
                <Edit3 className="h-4 w-4 text-zinc-400" />
                Haz clic sobre cualquier texto para editar directamente la planeación
              </span>
              
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-sm shadow-blue-500/10 flex items-center gap-1.5 transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  Descargar PDF / Imprimir
                </button>
              </div>
            </div>

            {/* Contenedor Imprimible */}
            <div 
              id="nem-print-container" 
              className="print-page bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-8 sm:p-12 shadow-sm text-left relative text-zinc-800 dark:text-zinc-100 font-sans"
            >
              {/* Estilos CSS Locales e Incrustados para Impresión */}
              <style>{`
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  #nem-print-container, #nem-print-container * {
                    visibility: visible !important;
                  }
                  #nem-print-container {
                    position: absolute !important;
                    left: 0 !important;
                    top: 0 !important;
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 12px 24px !important;
                    border: none !important;
                    box-shadow: none !important;
                    background: white !important;
                    color: black !important;
                    overflow: visible !important;
                  }
                  .no-print {
                    display: none !important;
                  }
                  .print-badge {
                    border: 1px solid #ccc !important;
                    background: #f5f5f5 !important;
                    color: black !important;
                    padding: 2px 6px !important;
                    border-radius: 4px !important;
                  }
                  textarea, .editable-field-wrap {
                    border: none !important;
                    resize: none !important;
                    overflow: visible !important;
                    height: auto !important;
                    min-height: unset !important;
                    max-height: none !important;
                    white-space: pre-wrap !important;
                    word-break: break-word !important;
                    display: block !important;
                    width: 100% !important;
                  }
                  .print-avoid-break {
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                  }
                  .print-section {
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                    margin-bottom: 16px !important;
                    overflow: visible !important;
                  }
                  .print-hide-textarea {
                    display: none !important;
                  }
                  .print-show-text {
                    display: block !important;
                    overflow: visible !important;
                    height: auto !important;
                    max-height: none !important;
                    white-space: pre-wrap !important;
                    word-break: break-word !important;
                    color: black !important;
                  }
                  * {
                    overflow: visible !important;
                    max-height: none !important;
                  }
                }
              `}</style>

              {/* Membrete Oficial */}
              <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-4 border-b-2 border-double border-zinc-200 dark:border-zinc-800 pb-6 mb-6">
                <div className="text-center sm:text-left flex flex-col gap-1">
                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest leading-none">Secretaría de Educación Pública</span>
                  <h2 className="text-lg font-black tracking-tight text-zinc-950 dark:text-white leading-tight">COLEGIO ANGLO MEXICANO</h2>
                  <p className="text-[10.5px] font-medium text-zinc-500">Módulo Académico Gamificado • Planeación Didáctica NEM</p>
                </div>
                
                {/* Sello Escolar */}
                <div className="h-14 w-14 rounded-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center text-[9px] font-black text-zinc-400 text-center uppercase leading-none p-1 flex-shrink-0">
                  Sello<br />Escolar
                </div>
              </div>

              {/* Título de la Sesión */}
              <div className="mb-6 flex flex-col gap-1.5">
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Título del Proyecto Didáctico</span>
                <input
                  type="text"
                  value={activePlanning.title}
                  onChange={(e) => updateActivePlanningField('title', e.target.value)}
                  className="w-full text-xl font-black text-zinc-950 dark:text-white border-b border-transparent hover:border-zinc-200 focus:border-blue-500 outline-none pb-1.5 focus:px-2 rounded"
                />
              </div>

              {/* Tabla de Metadatos Didácticos */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 bg-zinc-50/50 dark:bg-zinc-950/20 p-5 rounded-2xl border border-zinc-150 dark:border-zinc-850 mb-6 font-semibold text-xs leading-normal">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-zinc-400 uppercase tracking-wider">Docente Titular</span>
                  <span className="text-zinc-850 dark:text-zinc-200">{currentTeacher.first_name} {currentTeacher.last_name}</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-zinc-400 uppercase tracking-wider">Nivel / Fase</span>
                  <span className="text-zinc-850 dark:text-zinc-200">{activePlanning.levelName}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-zinc-400 uppercase tracking-wider">Asignatura</span>
                  <span className="text-zinc-850 dark:text-zinc-200">{activePlanning.subjectName}</span>
                </div>

                <div className="flex flex-col gap-1 md:col-span-2">
                  <span className="text-[9px] text-zinc-400 uppercase tracking-wider">Campo Formativo (NEM)</span>
                  <input
                    type="text"
                    value={activePlanning.campoFormativo}
                    onChange={(e) => updateActivePlanningField('campoFormativo', e.target.value)}
                    className="bg-transparent text-zinc-850 dark:text-zinc-200 border-b border-transparent hover:border-zinc-200 focus:border-blue-500 outline-none w-full"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-zinc-400 uppercase tracking-wider">Duración Estimada</span>
                  <input
                    type="text"
                    value={activePlanning.duration}
                    onChange={(e) => updateActivePlanningField('duration', e.target.value)}
                    className="bg-transparent text-zinc-850 dark:text-zinc-200 border-b border-transparent hover:border-zinc-200 focus:border-blue-500 outline-none w-full"
                  />
                </div>
              </div>

              {/* Ejes Articuladores */}
              <div className="mb-6 flex flex-col gap-2">
                <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider">Ejes Articuladores Vigentes</span>
                <div className="flex flex-wrap gap-2">
                  {activePlanning.ejesArticuladores.map((ejeName: string, idx: number) => {
                    const matchedEje = EJES_ARTICULADORES.find(e => e.name.toLowerCase().includes(ejeName.toLowerCase().substring(0, 8)));
                    const IconComp = matchedEje?.icon || BookOpen;
                    return (
                      <span 
                        key={idx}
                        className={`print-badge flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold border ${
                          matchedEje?.color || 'text-zinc-650 bg-zinc-50 border-zinc-200'
                        }`}
                      >
                        <IconComp className="h-3.5 w-3.5 flex-shrink-0" />
                        {ejeName}
                      </span>
                    );
                  })}
                  
                  {/* Selector rápido para añadir Eje (solo en pantalla) */}
                  <div className="relative inline-block no-print">
                    <select
                      value=""
                      onChange={(e) => {
                        if (!e.target.value) return;
                        if (!activePlanning.ejesArticuladores.includes(e.target.value)) {
                          updateActivePlanningField('ejesArticuladores', [...activePlanning.ejesArticuladores, e.target.value]);
                        }
                      }}
                      className="px-2 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 text-[10px] font-bold bg-zinc-50 dark:bg-zinc-950 text-zinc-500 outline-none cursor-pointer"
                    >
                      <option value="">+ Agregar Eje</option>
                      {EJES_ARTICULADORES.map((e, idx) => (
                        <option key={idx} value={e.name}>{e.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Limpiar Ejes (solo en pantalla) */}
                  {activePlanning.ejesArticuladores.length > 0 && (
                    <button
                      onClick={() => updateActivePlanningField('ejesArticuladores', [])}
                      className="no-print text-[9px] font-bold text-rose-500 hover:underline px-2"
                    >
                      Limpiar
                    </button>
                  )}
                </div>
              </div>

              {/* I. Proceso de Desarrollo de Aprendizaje (PDA) */}
              <div className="mb-6 border-l-4 border-blue-600 pl-4 py-0.5 flex flex-col gap-1.5">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-wider flex items-center gap-1">
                  <Brain className="h-4 w-4" />
                  I. Proceso de Desarrollo de Aprendizaje (PDA)
                </span>
                <EditableField
                  value={activePlanning.pda}
                  onChange={(val) => updateActivePlanningField('pda', val)}
                  placeholder="Proceso de Desarrollo de Aprendizaje..."
                />
              </div>

              {/* II. Secuencia Didáctica */}
              <div className="mb-6 flex flex-col gap-4">
                <span className="text-[10px] text-zinc-950 dark:text-white font-black uppercase tracking-wider border-b border-zinc-150 dark:border-zinc-850 pb-1.5 flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  II. Secuencia Didáctica (Metodología de Proyectos)
                </span>

                {/* Inicio */}
                <div className="flex flex-col gap-1.5 pl-2 print-avoid-break">
                  <span className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-wide">Inicio (Anticipación / Lluvia de ideas)</span>
                  <EditableField
                    value={activePlanning.inicio}
                    onChange={(val) => updateActivePlanningField('inicio', val)}
                    placeholder="Actividades de inicio..."
                  />
                </div>

                {/* Desarrollo */}
                <div className="flex flex-col gap-1.5 pl-2 print-avoid-break">
                  <span className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-wide">Desarrollo (Indagación / Aplicación práctica)</span>
                  <EditableField
                    value={activePlanning.desarrollo}
                    onChange={(val) => updateActivePlanningField('desarrollo', val)}
                    placeholder="Actividades de desarrollo..."
                  />
                </div>

                {/* Cierre */}
                <div className="flex flex-col gap-1.5 pl-2 print-avoid-break">
                  <span className="text-[9.5px] font-bold text-zinc-400 uppercase tracking-wide">Cierre (Reflexión / Metacognición)</span>
                  <EditableField
                    value={activePlanning.cierre}
                    onChange={(val) => updateActivePlanningField('cierre', val)}
                    placeholder="Actividades de cierre..."
                  />
                </div>
              </div>

              {/* III. Evaluación Formativa y Evidencias */}
              <div className="mb-6 flex flex-col gap-2.5 print-avoid-break">
                <span className="text-[10px] text-zinc-950 dark:text-white font-black uppercase tracking-wider border-b border-zinc-150 dark:border-zinc-850 pb-1.5 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  III. Evaluación Formativa y Evidencia Sugerida
                </span>
                <div className="pl-2">
                  <EditableField
                    value={activePlanning.evaluacion}
                    onChange={(val) => updateActivePlanningField('evaluacion', val)}
                    placeholder="Criterios y evidencias de evaluación..."
                  />
                </div>
              </div>

              {/* IV. Materiales y Recursos Didácticos */}
              <div className="mb-8 flex flex-col gap-2.5 print-avoid-break">
                <span className="text-[10px] text-zinc-950 dark:text-white font-black uppercase tracking-wider border-b border-zinc-150 dark:border-zinc-850 pb-1.5 flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  IV. Materiales y Recursos Didácticos
                </span>
                <div className="pl-2">
                  <EditableField
                    value={activePlanning.materiales}
                    onChange={(val) => updateActivePlanningField('materiales', val)}
                    placeholder="Materiales y recursos didácticos..."
                  />
                </div>
              </div>

              {/* Bloque de firmas */}
              <div className="grid grid-cols-2 gap-12 border-t border-zinc-100 dark:border-zinc-850 pt-8 mt-12 text-center text-xs font-semibold text-zinc-400 leading-normal print-avoid-break">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-36 border-b border-zinc-300 dark:border-zinc-700 h-10" />
                  <span className="text-zinc-600 dark:text-zinc-300 mt-2">Prof. {currentTeacher.first_name} {currentTeacher.last_name}</span>
                  <span className="text-[9px] uppercase tracking-wider">Docente Titular</span>
                </div>
                
                <div className="flex flex-col items-center gap-1">
                  <div className="w-36 border-b border-zinc-300 dark:border-zinc-700 h-10" />
                  <span className="text-zinc-650 dark:text-zinc-350 mt-2">Coordinación Académica</span>
                  <span className="text-[9px] uppercase tracking-wider">Firma de Aprobación</span>
                </div>
              </div>

              {/* Pie de página de impresión */}
              <div className="absolute bottom-4 right-8 left-8 flex justify-between text-[8.5px] text-zinc-400 font-mono no-print">
                <span>Generado vía ISkool IA</span>
                <span>Fecha: {activePlanning.createdAt}</span>
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  ) : (
        /* VISTA DEL PROGRAMA ANALÍTICO (CAMPAÑA DE GREMIO) */
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6 text-left no-print">
          {/* Header de la Campaña de Gremio */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 dark:border-zinc-800 pb-5 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                <Swords className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-base font-black text-zinc-950 dark:text-white uppercase tracking-wide flex items-center gap-1.5">
                  Planificador de Programa Analítico
                </h2>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mt-1">Campaña de Gremio Escolar • Planes de la SEP</p>
              </div>
            </div>

            {/* Pasos del Mago / Timeline */}
            <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-950/60 rounded-2xl border border-zinc-150 dark:border-zinc-850 p-2 text-[10px] font-black uppercase tracking-wider">
              <button 
                type="button"
                onClick={() => setWizardStep(1)}
                className={`px-3 py-1.5 rounded-xl transition-all ${wizardStep === 1 ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
              >
                1. Lectura
              </button>
              <ChevronRight className="h-3 w-3 text-zinc-300" />
              <button 
                type="button"
                onClick={() => { if (realityDiagnosis.trim()) setWizardStep(2); else alert('Por favor llena la lectura de la realidad primero.'); }}
                className={`px-3 py-1.5 rounded-xl transition-all ${wizardStep === 2 ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20' : 'text-zinc-400 hover:text-zinc-650'}`}
              >
                2. Contextualizar
              </button>
              <ChevronRight className="h-3 w-3 text-zinc-300" />
              <button 
                type="button"
                onClick={() => { if (realityDiagnosis.trim() && selectedPdaIds.length > 0) setWizardStep(3); else alert('Por favor selecciona al menos un PDA en la fase de contextualización.'); }}
                className={`px-3 py-1.5 rounded-xl transition-all ${wizardStep === 3 ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/20' : 'text-zinc-400 hover:text-zinc-650'}`}
              >
                3. Formulación
              </button>
            </div>
          </div>

          {/* PASO 1: LECTURA DE LA REALIDAD */}
          {wizardStep === 1 && (
            <div className="flex flex-col gap-5">
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-amber-800 dark:text-amber-400">
                <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold uppercase tracking-wide text-[10px] block mb-1">Plano 1: Lectura de la realidad</span>
                  Analiza la situación de tu comunidad, la problemática del entorno escolar y familiar de tus estudiantes para trazar las metas de la campaña de aprendizaje.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-zinc-450 uppercase tracking-wider text-left">Bitácora de Exploración (Diagnóstico de la Comunidad)</label>
                  <textarea
                    rows={6}
                    value={realityDiagnosis}
                    onChange={(e) => setRealityDiagnosis(e.target.value)}
                    placeholder="Analiza las condiciones socioeconómicas, familiares, geográficas o culturales de tu comunidad que impactan el aprendizaje de tus alumnos..."
                    className="w-full text-xs p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-150 focus:outline-none focus:border-amber-500 leading-relaxed font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-zinc-450 uppercase tracking-wider text-left">Amenazas del Reino (Problemáticas del Entorno)</label>
                    <textarea
                      rows={2}
                      value={problematic}
                      onChange={(e) => setProblematic(e.target.value)}
                      placeholder="Ej. Malos hábitos de alimentación, acoso escolar, escasez de áreas verdes, falta de agua..."
                      className="w-full text-xs p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-150 focus:outline-none focus:border-amber-500 leading-relaxed font-semibold"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-zinc-450 uppercase tracking-wider text-left">Atributos del Gremio (Intereses y Necesidades de Alumnos)</label>
                    <textarea
                      rows={2}
                      value={studentNeeds}
                      onChange={(e) => setStudentNeeds(e.target.value)}
                      placeholder="Ej. Interés por videojuegos, artes escénicas, deportes grupales, necesidad de apoyo socioemocional..."
                      className="w-full text-xs p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-150 focus:outline-none focus:border-amber-500 leading-relaxed font-semibold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end border-t border-zinc-100 dark:border-zinc-800 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    if (!realityDiagnosis.trim()) {
                      alert('Por favor describe el diagnóstico comunitario.');
                      return;
                    }
                    setWizardStep(2);
                  }}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-sm shadow-amber-500/10 flex items-center gap-2 hover:scale-[1.01] transition-all"
                >
                  Continuar a Contextualización
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: CONTEXTUALIZACIÓN */}
          {wizardStep === 2 && (
            <div className="flex flex-col gap-5">
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-amber-800 dark:text-amber-400">
                <Compass className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold uppercase tracking-wide text-[10px] block mb-1">Plano 2: Contextualización</span>
                  Alinea los insumos comunitarios del paso anterior con los planes de estudio. Selecciona el Campo Formativo y marca las habilidades (PDAs) que desbloquearán tus alumnos en esta campaña.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
                {/* Configuración de Materia y Campo Formativo */}
                <div className="md:col-span-1 flex flex-col gap-4 bg-zinc-50 dark:bg-zinc-950/30 p-4.5 rounded-2xl border border-zinc-150 dark:border-zinc-850">
                  <div className="flex flex-col gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    <label className="text-[10px] text-zinc-455 uppercase tracking-wider text-left">Asignatura de la Campaña</label>
                    <select
                      value={selectedNEMSubject}
                      onChange={(e) => setSelectedNEMSubject(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-855 dark:text-zinc-150 font-bold focus:outline-none"
                    >
                      {displaySubjects?.map(sub => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    <label className="text-[10px] text-zinc-455 uppercase tracking-wider text-left">Nivel / Fase</label>
                    <select
                      value={selectedNEMLevel}
                      onChange={(e) => setSelectedNEMLevel(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-855 dark:text-zinc-150 font-bold focus:outline-none"
                    >
                      <option value="preescolar">Preescolar (Fase 2)</option>
                      <option value="primaria-baja">Primaria Baja (Fase 3)</option>
                      <option value="primaria-alta">Primaria Alta (Fase 5)</option>
                      <option value="secundaria">Secundaria (Fase 6)</option>
                      <option value="preparatoria">Preparatoria (Fase 6 / Bachillerato)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    <label className="text-[10px] text-zinc-455 uppercase tracking-wider text-left">Campo Formativo Asociado</label>
                    <select
                      value={selectedCampoId}
                      onChange={(e) => {
                        setSelectedCampoId(e.target.value);
                        setSelectedPdaIds([]); // Reset pdas selection
                      }}
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-855 dark:text-zinc-150 font-bold focus:outline-none"
                    >
                      {camposFormativos.map(cf => (
                        <option key={cf.id} value={cf.id}>{cf.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Lista de PDAs del Campo Formativo */}
                <div className="md:col-span-2 flex flex-col gap-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Habilidades del Códice (Seleccionar PDAs a Trabajar)</span>
                    <span className="text-amber-500 font-black">{selectedPdaIds.length} seleccionados</span>
                  </label>

                  <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
                    {pdasList.length === 0 ? (
                      <div className="text-center py-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 text-xs">
                        No hay PDAs registrados para este campo formativo.
                      </div>
                    ) : (
                      pdasList.map(pda => {
                        const isChecked = selectedPdaIds.includes(pda.id);
                        return (
                          <div 
                            key={pda.id}
                            onClick={() => {
                              if (isChecked) {
                                setSelectedPdaIds(selectedPdaIds.filter(id => id !== pda.id));
                              } else {
                                setSelectedPdaIds([...selectedPdaIds, pda.id]);
                              }
                            }}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 text-xs leading-normal font-medium text-left ${isChecked ? 'bg-amber-500/10 border-amber-400 text-zinc-850 dark:text-zinc-100' : 'bg-white dark:bg-zinc-950 border-zinc-150 dark:border-zinc-850 text-zinc-500 hover:border-zinc-300'}`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="accent-amber-500 h-4.5 w-4.5 flex-shrink-0 mt-0.5 rounded-lg cursor-pointer"
                            />
                            <div>
                              <span className="font-mono text-[9px] uppercase font-bold text-amber-600 dark:text-amber-400 block mb-0.5">{pda.code || 'PDA'}</span>
                              <span>{pda.description}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between border-t border-zinc-100 dark:border-zinc-800 pt-5">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="px-4 py-2 border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 text-zinc-500 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Regresar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (selectedPdaIds.length === 0) {
                      alert('Por favor selecciona al menos un PDA (habilidad) del códice.');
                      return;
                    }
                    setWizardStep(3);
                  }}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black shadow-sm shadow-amber-500/10 flex items-center gap-2 hover:scale-[1.01] transition-all"
                >
                  Continuar a Formulación
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: FORMULACIÓN (CODISEÑO DE CAMPAÑA) */}
          {wizardStep === 3 && (
            <div className="flex flex-col gap-6">
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-amber-800 dark:text-amber-400">
                <Swords className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold uppercase tracking-wide text-[10px] block mb-1">Plano 3: Formulación (Despliegue de Campaña)</span>
                  Define el nombre de la Campaña de Gremio y agrega las misiones (Quests) que resolverán tus alumnos. Los alumnos ganarán XP elemental correspondiente en base al campo formativo seleccionado.
                </div>
              </div>

              {/* Titulo de Campaña */}
              <div className="flex flex-col gap-1.5 text-xs font-bold">
                <label className="text-[10px] text-zinc-400 uppercase tracking-wider text-left">Título de la Campaña de Gremio</label>
                <input
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  placeholder="Ej. Campaña del Bosque Nutrido (Alimentación Sostenible)"
                  className="w-full text-xs p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-150 focus:outline-none focus:border-amber-500 font-bold"
                />
              </div>

              {/* Grid: Misiones Creadas (Izquierda) y Crear Misión (Derecha) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Panel Izquierdo: Lista de Quests agregadas */}
                <div className="lg:col-span-6 flex flex-col gap-4.5">
                  <span className="text-[10px] font-black text-zinc-450 uppercase tracking-wider text-left block">
                    Misiones Desplegadas en esta Campaña ({campaignQuests.length})
                  </span>

                  <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
                    {campaignQuests.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl text-zinc-400 text-xs bg-zinc-50/20">
                        Aún no has agregado misiones de gremio. Configura una misión en el formulario lateral y agrégala.
                      </div>
                    ) : (
                      campaignQuests.map((quest, idx) => (
                        <div key={idx} className="bg-white dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 rounded-2xl p-4.5 text-left flex gap-4 items-start shadow-xs relative">
                          <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                            {quest.type === 'quiz' ? <Brain className="h-4.5 w-4.5" /> : <FileText className="h-4.5 w-4.5" />}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <h4 className="text-xs font-black text-zinc-850 dark:text-zinc-100 flex items-center gap-2">
                              <span>Misión {idx + 1}: {quest.title}</span>
                              <span className="text-[8.5px] font-mono bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 px-1.5 py-0.5 rounded text-zinc-450 uppercase font-bold">{quest.type === 'quiz' ? 'Quiz' : 'Portafolio'}</span>
                            </h4>
                            <p className="text-[10.5px] text-zinc-450 mt-1 line-clamp-2">{quest.description}</p>
                            
                            {/* Recompensas */}
                            <div className="flex items-center gap-3 mt-3 text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                              <span>💎 {quest.xp_reward} XP</span>
                              <span>🪙 {quest.coins_reward} Monedas</span>
                              <span>•</span>
                              <span>🎯 {quest.pda_ids.length} PDA(s) Vinculados</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setCampaignQuests(campaignQuests.filter((_, qIdx) => qIdx !== idx))}
                            className="p-1 hover:bg-rose-50 hover:text-rose-600 rounded-lg text-zinc-400 transition-colors self-start cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Panel Derecho: Formulario para añadir misión */}
                <div className="lg:col-span-6 bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-150 dark:border-zinc-850 p-4.5 rounded-3xl flex flex-col gap-4 text-xs font-bold text-zinc-855 dark:text-zinc-150">
                  <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 tracking-wider text-left pb-2 border-b border-zinc-200/60 dark:border-zinc-850 block uppercase">
                    + Configurar Misión de Gremio
                  </span>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9.5px] text-zinc-400 uppercase tracking-wider text-left">Nombre de la Misión</label>
                    <input
                      id="new-quest-title"
                      type="text"
                      placeholder="Ej. Cuestionario de los Microbios Beneficiosos"
                      className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-bold focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9.5px] text-zinc-400 uppercase tracking-wider text-left">Objetivo / Bitácora de Misión</label>
                    <textarea
                      id="new-quest-desc"
                      rows={2}
                      placeholder="Explica qué deben investigar o responder en esta misión..."
                      className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9.5px] text-zinc-400 uppercase tracking-wider text-left">Tipo de Reto</label>
                      <select
                        id="new-quest-type"
                        className="p-2.5 rounded-xl border border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-bold focus:outline-none"
                      >
                        <option value="quiz">Quiz RPG</option>
                        <option value="portfolio_submission">Portafolio</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9.5px] text-zinc-400 uppercase tracking-wider text-left">💎 Recompensa XP</label>
                      <input
                        id="new-quest-xp"
                        type="number"
                        defaultValue={50}
                        min={10}
                        max={500}
                        className="p-2.5 rounded-xl border border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono font-bold focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9.5px] text-zinc-400 uppercase tracking-wider text-left">🪙 Monedas</label>
                      <input
                        id="new-quest-coins"
                        type="number"
                        defaultValue={10}
                        min={1}
                        max={100}
                        className="p-2.5 rounded-xl border border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono font-bold focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Asignación de PDAs de los elegidos en el Paso 2 */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9.5px] text-zinc-400 uppercase tracking-wider text-left">Habilidades Vinculadas (PDAs a Acreditar)</label>
                    <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto p-2 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800">
                      {selectedPdaIds.map(pdaId => {
                        const pdaObj = pdasList.find(p => p.id === pdaId);
                        if (!pdaObj) return null;
                        return (
                          <div 
                            key={pdaId}
                            className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 px-2 py-1 rounded-lg text-[9px] text-amber-700 dark:text-amber-400"
                          >
                            <span>{pdaObj.code || 'PDA'}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const titleEl = document.getElementById('new-quest-title') as HTMLInputElement;
                      const descEl = document.getElementById('new-quest-desc') as HTMLTextAreaElement;
                      const typeEl = document.getElementById('new-quest-type') as HTMLSelectElement;
                      const xpEl = document.getElementById('new-quest-xp') as HTMLInputElement;
                      const coinsEl = document.getElementById('new-quest-coins') as HTMLInputElement;

                      if (!titleEl.value.trim() || !descEl.value.trim()) {
                        alert('Por favor llena el nombre y objetivo de la misión.');
                        return;
                      }

                      const newQ = {
                        title: titleEl.value.trim(),
                        description: descEl.value.trim(),
                        type: typeEl.value as 'quiz' | 'portfolio_submission',
                        xp_reward: parseInt(xpEl.value) || 50,
                        coins_reward: parseInt(coinsEl.value) || 10,
                        pda_ids: [...selectedPdaIds]
                      };

                      setCampaignQuests([...campaignQuests, newQ]);

                      // Limpiar campos
                      titleEl.value = '';
                      descEl.value = '';
                    }}
                    className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 rounded-xl text-xs font-black shadow-sm transition-all"
                  >
                    Añadir Misión al Gremio
                  </button>
                </div>
              </div>

              {/* Botones de Navegación del Wizard */}
              <div className="flex justify-between border-t border-zinc-100 dark:border-zinc-800 pt-5">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="px-4 py-2 border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 text-zinc-500 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Regresar
                </button>

                <button
                  type="button"
                  onClick={handlePublishCampaign}
                  disabled={isPublishingCampaign || campaignQuests.length === 0}
                  className={`px-6 py-3 rounded-2xl text-xs font-black shadow-md flex items-center gap-2 transition-all ${
                    isPublishingCampaign || campaignQuests.length === 0
                      ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed shadow-none'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/10 hover:scale-[1.01]'
                  }`}
                >
                  {isPublishingCampaign ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Desplegando Campaña...
                    </>
                  ) : (
                    <>
                      <Award className="h-4.5 w-4.5" />
                      Publicar Campaña de Gremio
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==========================================
// COMPONENTE AUXILIAR CAMPO DE TEXTO AUTO-EXPANDIBLE
// ==========================================

function EditableField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    adjustHeight();
    // Añadir manejador de cambio de tamaño de ventana para ajustar el alto
    window.addEventListener('resize', adjustHeight);
    return () => window.removeEventListener('resize', adjustHeight);
  }, [value]);

  return (
    <div className="editable-field-wrap w-full">
      {/* Textarea: visible only on screen */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => { onChange(e.target.value); adjustHeight(); }}
        placeholder={placeholder}
        rows={1}
        className="w-full bg-transparent border border-transparent hover:border-zinc-200 focus:border-blue-500 focus:bg-blue-50/5 dark:focus:bg-zinc-950/20 py-2.5 px-3 rounded-xl text-xs text-zinc-700 dark:text-zinc-350 font-medium outline-none resize-none overflow-hidden transition-all leading-relaxed print-hide-textarea"
      />
      {/* Plain text div: visible only when printing — no scroll arrows, no borders */}
      <div className="print-show-text hidden py-1 px-0 text-xs text-zinc-700 font-medium leading-relaxed whitespace-pre-wrap break-words">
        {value || <span className="text-zinc-400">{placeholder}</span>}
      </div>
    </div>
  );
}
