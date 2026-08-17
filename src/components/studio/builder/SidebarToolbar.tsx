"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActivityBuilderStore } from '@/store/useActivityBuilderStore';
import { StudioBlockType } from '@/types/studioBlocks';
import { 
  Plus, 
  HelpCircle, 
  BookOpen, 
  Sparkles, 
  Swords, 
  Video, 
  Globe, 
  Gamepad2, 
  GitBranch, 
  Volume2, 
  Layers, 
  Gift,
  Award,
  Zap,
  ChevronRight,
  ChevronDown,
  X,
  ListOrdered,
  FileEdit,
  MessageSquare,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Lightbulb,
  Workflow
} from 'lucide-react';

export interface BlockCategoryItem {
  id: 'assessments' | 'multimedia' | 'gamification' | 'pedagogy';
  name: string;
  badge: string;
  icon: any;
  color: string;
  description: string;
  example: string;
  blocks: BlockToolItem[];
}

export interface BlockToolItem {
  type: StudioBlockType;
  title: string;
  category: string;
  badge: string;
  description: string;
  example: string;
  icon: any;
  gradient: string;
  glowColor: string;
}

export const SCRATCH_CATEGORIES: BlockCategoryItem[] = [
  {
    id: 'assessments',
    name: 'Evaluación & Reactivos',
    badge: '5 Bloques',
    icon: HelpCircle,
    color: 'from-purple-600 to-indigo-600',
    description: 'Reactivos de evaluación formativa inmediata, emparejamiento, ordenamiento y preguntas abiertas.',
    example: 'Ideal para evaluar comprensión de lectura, definiciones científicas y procesos históricos.',
    blocks: [
      {
        type: 'quiz_question',
        title: 'Pregunta de Opción Múltiple',
        category: 'Evaluación',
        badge: '⚡ Formativo',
        description: 'Reactivo interactivo con 4 opciones, retroalimentación formativa y cronómetro opcional.',
        example: '¿Cuál es la función principal de los cloroplastos en las células vegetales?',
        icon: HelpCircle,
        gradient: 'from-purple-500 to-indigo-600',
        glowColor: 'shadow-purple-500/30'
      },
      {
        type: 'drag_drop_match',
        title: 'Emparejamiento / Drag & Drop',
        category: 'Evaluación',
        badge: '🔀 Táctil',
        description: 'Conecta conceptos con sus definiciones, fórmulas o ilustraciones correspondientes.',
        example: 'Emparejar "Inercia" con "1ª Ley de Newton" y "Fuerza" con "Masa × Aceleración".',
        icon: GitBranch,
        gradient: 'from-indigo-500 to-blue-600',
        glowColor: 'shadow-indigo-500/30'
      },
      {
        type: 'ordering_sequence',
        title: 'Secuencia Cronológica',
        category: 'Evaluación',
        badge: '🔢 Algoritmos',
        description: 'Ordena pasos lógicos, algoritmos o acontecimientos históricos en orden ascendente.',
        example: 'Ordenar los 4 acontecimientos clave del movimiento de Independencia de 1810.',
        icon: ListOrdered,
        gradient: 'from-blue-500 to-cyan-600',
        glowColor: 'shadow-blue-500/30'
      },
      {
        type: 'fill_in_blanks',
        title: 'Completar Espacios en Blanco',
        category: 'Evaluación',
        badge: '✍️ Banco de Palabras',
        description: 'Texto mutilado con banco de palabras para consolidar definiciones y leyes.',
        example: 'La [gravedad] es la fuerza que atrae los cuerpos hacia el centro de la [Tierra].',
        icon: FileEdit,
        gradient: 'from-cyan-500 to-teal-600',
        glowColor: 'shadow-cyan-500/30'
      },
      {
        type: 'open_poll_wordcloud',
        title: 'Pregunta Abierta con IA',
        category: 'Evaluación',
        badge: '🤖 Rúbrica IA',
        description: 'Pregunta de reflexión con retroalimentación cualitativa inmediata basada en criterios NEM.',
        example: '¿Cómo aplicarías el principio de conservación de energía en tu comunidad?',
        icon: MessageSquare,
        gradient: 'from-teal-500 to-emerald-600',
        glowColor: 'shadow-teal-500/30'
      }
    ]
  },
  {
    id: 'multimedia',
    name: 'Multimedia & Laboratorios',
    badge: '4 Bloques',
    icon: Video,
    color: 'from-blue-600 to-cyan-600',
    description: 'Incrustación de videos explicativos, interactivos PhET / GeoGebra, lecturas y audio ambiental.',
    example: 'Inserta simuladores de física de la Universidad de Colorado o cápsulas de YouTube.',
    blocks: [
      {
        type: 'text_narrative',
        title: 'Instrucción o Lectura',
        category: 'Multimedia',
        badge: '📖 Contexto',
        description: 'Texto introductorio, narrativa inmersiva de la misión o diálogo pedagógico.',
        example: '¡Bienvenidos exploradores! Hoy descifraremos las leyes del movimiento universal.',
        icon: BookOpen,
        gradient: 'from-blue-500 to-cyan-600',
        glowColor: 'shadow-blue-500/30'
      },
      {
        type: 'youtube_video',
        title: 'Video Educativo YouTube',
        category: 'Multimedia',
        badge: '🎬 Audiovisual',
        description: 'Cápsula de video de YouTube con marca de tiempo de inicio y modo seguro.',
        example: 'Video de 3 minutos sobre la caída libre de los cuerpos iniciando en el segundo 45.',
        icon: Video,
        gradient: 'from-red-500 to-rose-600',
        glowColor: 'shadow-red-500/30'
      },
      {
        type: 'external_embed',
        title: 'Simulador Web PhET / GeoGebra',
        category: 'Multimedia',
        badge: '🔬 Laboratorio Vivo',
        description: 'Incrusta cualquiera de los 50 simuladores web compatibles (PhET, Desmos, NASA, etc.).',
        example: 'Laboratorio de Fuerzas y Movimiento PhET para experimentar con aceleración.',
        icon: Globe,
        gradient: 'from-cyan-500 to-blue-600',
        glowColor: 'shadow-cyan-500/30'
      },
      {
        type: 'audio_sfx',
        title: 'Efecto Sonoro / Fanfarria',
        category: 'Multimedia',
        badge: '🎵 Ambientación',
        description: 'Reproduce fanfarrias de victoria, redobles de misterio o música estimulante.',
        example: 'Fanfarria triunfal tras resolver el enigma de la pirámide de Chichén Itzá.',
        icon: Volume2,
        gradient: 'from-pink-500 to-rose-600',
        glowColor: 'shadow-pink-500/30'
      }
    ]
  },
  {
    id: 'gamification',
    name: 'Gamificación & Retos',
    badge: '4 Bloques',
    icon: Gamepad2,
    color: 'from-amber-500 to-yellow-600',
    description: 'Duelos RPG contra Bosses animados Pixi, cofres de botín, códigos secretos y ruletas.',
    example: 'Motiva a los alumnos con puntos XP, gemas y combates interactivos por turnos.',
    blocks: [
      {
        type: 'reward_chest',
        title: 'Cofre de Recompensas',
        category: 'Gamificación',
        badge: '🎁 Botín & XP',
        description: 'Otorga puntos XP, monedas de oro e insignias de maestría para el avatar del alumno.',
        example: 'Cofre legendario con +150 XP y 40 monedas al superar la misión matemática.',
        icon: Gift,
        gradient: 'from-amber-500 to-yellow-600',
        glowColor: 'shadow-amber-500/30'
      },
      {
        type: 'boss_enemy',
        title: 'Duelo contra Boss Pixi',
        category: 'Gamificación',
        badge: '⚔️ Combate RPG',
        description: 'Batalla por turnos contra monstruos y dragones animados donde responder bien hace daño.',
        example: 'Duelo contra el "Gólem del Olvido" con 100 HP respondiendo 3 reactivos de repaso.',
        icon: Swords,
        gradient: 'from-rose-500 to-red-600',
        glowColor: 'shadow-rose-500/30'
      },
      {
        type: 'secret_code_puzzle',
        title: 'Código Secreto / Escape Room',
        category: 'Gamificación',
        badge: '🗝️ Acertijo',
        description: 'Candado con palabra clave o código alfanumérico para abrir bóvedas de conocimiento.',
        example: 'Descifra la palabra de 6 letras "FUERZA" para abrir la bóveda de Newton.',
        icon: KeyRound,
        gradient: 'from-orange-500 to-amber-600',
        glowColor: 'shadow-orange-500/30'
      },
      {
        type: 'minigame_action',
        title: 'Minijuego Arcade (Ruleta)',
        category: 'Gamificación',
        badge: '🎰 Dinámica Lúdica',
        description: 'Ruleta de la fortuna, memorama o ruleta de preguntas para otorgar bonificaciones.',
        example: 'Girar la ruleta para duplicar el botín XP antes de enfrentar al Boss.',
        icon: Gamepad2,
        gradient: 'from-violet-500 to-purple-600',
        glowColor: 'shadow-violet-500/30'
      }
    ]
  },
  {
    id: 'pedagogy',
    name: 'Pedagogía & Rutas',
    badge: '3 Bloques',
    icon: GitBranch,
    color: 'from-emerald-500 to-teal-600',
    description: 'Rutas condicionales adaptativas, puntos de control metacognitivo y diplomas de honor.',
    example: 'Personaliza la ruta del alumno según su desempeño o emite diplomas al finalizar.',
    blocks: [
      {
        type: 'logic_branch',
        title: 'Bifurcación Condicional',
        category: 'Pedagogía',
        badge: '🔀 Ruta Adaptativa',
        description: 'Divide el camino según la puntuación del alumno (ruta avanzada vs ruta de refuerzo).',
        example: 'Si el alumno tiene > 80% de aciertos avanza al reto; si no, recibe apoyo guiado.',
        icon: GitBranch,
        gradient: 'from-indigo-600 to-purple-600',
        glowColor: 'shadow-indigo-500/30'
      },
      {
        type: 'checkpoint_gate',
        title: 'Punto de Control Metacognitivo',
        category: 'Pedagogía',
        badge: '🛡️ Autoevaluación',
        description: 'Espacio de autoevaluación donde el alumno califica su nivel de confianza y reflexión.',
        example: '¿Qué tan seguro te sientes aplicando este método en problemas cotidianos?',
        icon: ShieldCheck,
        gradient: 'from-emerald-500 to-teal-600',
        glowColor: 'shadow-emerald-500/30'
      },
      {
        type: 'badge_certificate',
        title: 'Diploma de Honor Digital',
        category: 'Pedagogía',
        badge: '🏆 Reconocimiento',
        description: 'Emite y descarga un certificado de logro con firma institucional al completar la misión.',
        example: 'Diploma oficial "Maestro de las Ciencias Exactas" otorgado por el colegio.',
        icon: Award,
        gradient: 'from-amber-400 to-yellow-500',
        glowColor: 'shadow-amber-500/30'
      }
    ]
  }
];

export const SidebarToolbar: React.FC = () => {
  const { 
    blocks, 
    addBlock, 
    setDraggedNewBlockType 
  } = useActivityBuilderStore();

  // Estados de acordeón estilo Scratch
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>('assessments');

  // Estados de Hover Tooltip Enriquecido
  const [hoveredTool, setHoveredTool] = useState<BlockToolItem | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<BlockCategoryItem | null>(null);

  // Estados de Arrastre Global con el Mouse
  const [draggingTool, setDraggingTool] = useState<BlockToolItem | null>(null);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // 4 Herramientas de Acceso Rápido en el Dock Lateral
  const quickTools = [
    SCRATCH_CATEGORIES[0].blocks[0], // Pregunta de Opción Múltiple
    SCRATCH_CATEGORIES[1].blocks[0], // Instrucción o Lectura
    SCRATCH_CATEGORIES[2].blocks[0], // Cofre de Recompensas
    SCRATCH_CATEGORIES[2].blocks[1], // Duelo contra Boss Pixi
  ];

  // Iniciar arrastre con clic sostenido
  const handleMouseDownTool = (e: React.MouseEvent, tool: BlockToolItem) => {
    e.preventDefault();
    setDraggingTool(tool);
    setDraggedNewBlockType(tool.type);
    setCursorPos({ x: e.clientX, y: e.clientY });
  };

  // Manejar movimiento global y drop al soltar el clic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggingTool) {
        setCursorPos({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (draggingTool) {
        // Localizar el tablero de trabajo
        const targetElement = document.elementFromPoint(e.clientX, e.clientY);
        const boardElem = targetElement?.closest('[data-node-id], svg, .scroll-smooth') || document.querySelector('.scroll-smooth');

        if (boardElem) {
          const rect = boardElem.getBoundingClientRect();
          const dropX = Math.max(40, Math.round(e.clientX - rect.left + (boardElem.scrollLeft || 0)));
          const dropY = Math.max(40, Math.round(e.clientY - rect.top + (boardElem.scrollTop || 0)));

          addBlock(draggingTool.type, undefined, { x: dropX, y: dropY });
        } else {
          // Si se soltó fuera, añadirlo con posición automática
          addBlock(draggingTool.type);
        }

        setDraggingTool(null);
        setDraggedNewBlockType(null);
      }
    };

    if (draggingTool) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingTool, addBlock, setDraggedNewBlockType]);

  // Métricas acumuladas
  const totalXp = blocks.reduce((acc, b) => {
    if (b.type === 'reward_chest') return acc + (b.data.xpAmount || 0);
    if (b.type === 'quiz_question') return acc + 20;
    if (b.type === 'boss_enemy') return acc + 50;
    return acc;
  }, 0);

  return (
    <aside className="w-full lg:w-20 shrink-0 select-none flex flex-col items-center gap-3 relative z-40">
      {/* Dock de Herramientas Visuales */}
      <div className="relative z-40 w-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 p-2.5 sm:p-3 shadow-lg flex flex-row lg:flex-col items-center justify-between lg:justify-start gap-2.5 overflow-x-auto lg:overflow-visible">
        
        {/* Cabecera / Ícono de Paleta */}
        <div className="hidden lg:flex flex-col items-center gap-1 pb-2 border-b border-slate-100 dark:border-zinc-800 w-full">
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-[9px] font-black uppercase text-slate-400">
            Bloques
          </span>
        </div>

        {/* 4 Herramientas de Acceso Rápido (con Arrastre & Clic) */}
        <div className="flex flex-row lg:flex-col items-center gap-2">
          {quickTools.map((tool) => {
            const Icon = tool.icon;
            const isHovered = hoveredTool?.type === tool.type;
            return (
              <div 
                key={tool.type} 
                className={`relative ${isHovered ? 'z-50' : 'z-10'}`}
                onMouseEnter={() => setHoveredTool(tool)}
                onMouseLeave={() => setHoveredTool(null)}
              >
                <button
                  type="button"
                  onMouseDown={(e) => handleMouseDownTool(e, tool)}
                  onClick={() => {
                    if (!draggingTool) addBlock(tool.type);
                  }}
                  aria-label={tool.title}
                  title="Arrastra al tablero o haz clic para añadir"
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr ${tool.gradient} text-white flex items-center justify-center shadow-md ${tool.glowColor} hover:scale-110 active:scale-95 transition-all transform cursor-grab active:cursor-grabbing group`}
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Separador */}
        <div className="hidden lg:block w-full h-px bg-slate-100 dark:bg-zinc-800 my-1" />

        {/* Botón (+) de Agrupaciones estilo Scratch */}
        <div className="relative z-20">
          <button
            type="button"
            onClick={() => setIsCategoryDrawerOpen(!isCategoryDrawerOpen)}
            aria-label="Abrir catálogo de agrupaciones de bloques"
            title="Abrir menú de bloques estilo Scratch"
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all transform cursor-pointer group ${
              isCategoryDrawerOpen
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-2 border-dashed border-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50'
            }`}
          >
            <Plus className={`w-5 h-5 transition-transform duration-200 ${isCategoryDrawerOpen ? 'rotate-45' : 'group-hover:rotate-90'}`} />
          </button>
        </div>
      </div>

      {/* Indicador de Resumen Rápido de Métricas */}
      <div className="hidden lg:flex flex-col items-center gap-2 p-2.5 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-zinc-800/60 shadow-sm text-center">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black text-purple-600 dark:text-purple-400">
            {blocks.length}
          </span>
          <span className="text-[8px] font-black uppercase text-slate-400">
            Bloques
          </span>
        </div>
        <div className="w-full h-px bg-slate-100 dark:bg-zinc-800" />
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black text-amber-500">
            +{totalXp}
          </span>
          <span className="text-[8px] font-black uppercase text-slate-400">
            XP Total
          </span>
        </div>
      </div>

      {/* ================= MENÚ LATERAL DESPLEGABLE ESTILO SCRATCH (AGRUPACIONES) ================= */}
      <AnimatePresence>
        {isCategoryDrawerOpen && (
          <motion.div
            initial={{ opacity: 0, x: -16, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -16, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute left-full top-0 ml-3.5 w-80 sm:w-96 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-2xl z-50 p-4 space-y-3 max-h-[82vh] overflow-y-auto"
          >
            {/* Cabecera del Menú */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-black text-xs">
                  <Workflow className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white">
                    Agrupaciones de Bloques
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                    Haz clic o arrastra al tablero para crear nodos.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCategoryDrawerOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-rose-500 hover:text-white text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Lista de Categorías con Acordeón Desplegable / Replegable */}
            <div className="space-y-2.5">
              {SCRATCH_CATEGORIES.map((cat) => {
                const isExpanded = expandedCategoryId === cat.id;
                const Icon = cat.icon;

                return (
                  <div 
                    key={cat.id}
                    className="rounded-2xl border border-slate-200/90 dark:border-zinc-800 overflow-hidden bg-slate-50/70 dark:bg-zinc-850/60"
                  >
                    {/* Botón de la Agrupación (Clic expande / repliega) */}
                    <button
                      type="button"
                      onClick={() => setExpandedCategoryId(isExpanded ? null : cat.id)}
                      onMouseEnter={() => setHoveredCategory(cat)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      className={`w-full p-3 flex items-center justify-between gap-2 text-left transition-colors cursor-pointer ${
                        isExpanded ? 'bg-purple-50/80 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200' : 'hover:bg-slate-100 dark:hover:bg-zinc-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                            {cat.name}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400">
                            {cat.badge}
                          </span>
                        </div>
                      </div>

                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-purple-600' : ''}`} />
                    </button>

                    {/* Lista de Bloques dentro de la Agrupación Desplegada */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.16 }}
                          className="p-2 space-y-1.5 border-t border-slate-100 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/60"
                        >
                          {cat.blocks.map((tool) => {
                            const ToolIcon = tool.icon;
                            return (
                              <div
                                key={tool.type}
                                onMouseDown={(e) => handleMouseDownTool(e, tool)}
                                onClick={() => {
                                  if (!draggingTool) addBlock(tool.type);
                                }}
                                onMouseEnter={() => setHoveredTool(tool)}
                                onMouseLeave={() => setHoveredTool(null)}
                                className="group p-2 rounded-xl border border-slate-200/80 dark:border-zinc-800 hover:border-purple-400 dark:hover:border-purple-600 bg-white dark:bg-zinc-850 hover:bg-purple-50 dark:hover:bg-purple-950/40 flex items-center justify-between gap-2.5 transition-all cursor-grab active:cursor-grabbing hover:scale-[1.01]"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${tool.gradient} text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform`}>
                                    <ToolIcon className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <h5 className="text-[11px] font-black text-slate-800 dark:text-zinc-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 truncate">
                                      {tool.title}
                                    </h5>
                                    <span className="text-[9px] font-bold text-slate-400 block truncate">
                                      {tool.badge}
                                    </span>
                                  </div>
                                </div>

                                <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                  + Añadir
                                </span>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= POPOVER / TOOLTIP ENRIQUECIDO CON EJEMPLOS ================= */}
      <AnimatePresence>
        {(hoveredTool || hoveredCategory) && (
          <motion.div
            initial={{ opacity: 0, x: -10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="hidden lg:block fixed left-28 top-28 z-[99999] pointer-events-none w-72 sm:w-80 shadow-2xl rounded-2xl overflow-hidden bg-slate-900/95 dark:bg-zinc-900/95 text-white backdrop-blur-xl border border-slate-700/80 dark:border-zinc-700/80 p-4 space-y-2.5 animate-fade-in"
          >
            {hoveredTool ? (
              <>
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${hoveredTool.gradient} text-white flex items-center justify-center shrink-0 shadow-md`}>
                      <hoveredTool.icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[9px] font-black uppercase text-purple-400 tracking-wider block">
                        {hoveredTool.category}
                      </span>
                      <h4 className="text-xs font-black text-white truncate">
                        {hoveredTool.title}
                      </h4>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-white/10 text-purple-200 shrink-0">
                    {hoveredTool.badge}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {hoveredTool.description}
                  </p>

                  <div className="p-2.5 rounded-xl bg-purple-950/50 border border-purple-800/40 text-[11px] space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300">
                      <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                      <span>Ejemplo práctico de uso:</span>
                    </div>
                    <p className="text-purple-200 italic leading-snug">
                      &ldquo;{hoveredTool.example}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="text-[9px] font-bold text-slate-400 text-center pt-1 border-t border-slate-800">
                  💡 Haz clic para añadir al final o arrastra con el ratón al tablero.
                </div>
              </>
            ) : hoveredCategory ? (
              <>
                <div className="flex items-center gap-2.5 border-b border-slate-800 pb-2">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${hoveredCategory.color} text-white flex items-center justify-center shrink-0 shadow-md`}>
                    <hoveredCategory.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black uppercase text-purple-400 tracking-wider block">
                      Agrupación Scratch
                    </span>
                    <h4 className="text-xs font-black text-white">
                      {hoveredCategory.name}
                    </h4>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {hoveredCategory.description}
                </p>

                <div className="p-2.5 rounded-xl bg-blue-950/50 border border-blue-800/40 text-[11px] space-y-1">
                  <span className="font-bold text-cyan-300">💡 Aplicación sugerida:</span>
                  <p className="text-blue-200 text-[10px] leading-snug">
                    {hoveredCategory.example}
                  </p>
                </div>
              </>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= PREVIEW FLOTANTE MIENTRAS SE ARRASTRA UN BLOQUE AL TABLERO ================= */}
      {draggingTool && (
        <div
          style={{
            position: 'fixed',
            left: `${cursorPos.x + 15}px`,
            top: `${cursorPos.y + 15}px`,
            pointerEvents: 'none',
            zIndex: 999999,
          }}
          className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border-2 border-purple-500 shadow-2xl flex items-center gap-2.5 min-w-[200px] animate-scale-in opacity-90 rotate-2"
        >
          <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${draggingTool.gradient} text-white flex items-center justify-center shrink-0 shadow-md`}>
            <draggingTool.icon className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-purple-600 block">
              Soltar para crear nodo
            </span>
            <h5 className="text-xs font-black text-slate-900 dark:text-white truncate">
              {draggingTool.title}
            </h5>
          </div>
        </div>
      )}
    </aside>
  );
};
