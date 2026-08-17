"use client";

import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';

interface ToolItem {
  type: StudioBlockType;
  title: string;
  description: string;
  badge: string;
  icon: any;
  gradient: string;
  glowColor: string;
}

export const SidebarToolbar: React.FC = () => {
  const { 
    blocks, 
    addBlock, 
    setIsExtendedMenuOpen,
  } = useActivityBuilderStore();

  const [hoveredTool, setHoveredTool] = useState<ToolItem | null>(null);
  const [hoveredPlus, setHoveredPlus] = useState(false);

  const tools: ToolItem[] = [
    {
      type: 'quiz_question',
      title: 'Pregunta de Opción Múltiple',
      description: 'Añade un reactivo interactivo con feedback formativo y tiempo límite.',
      badge: '⚡ Básico',
      icon: HelpCircle,
      gradient: 'from-purple-500 to-indigo-600',
      glowColor: 'shadow-purple-500/30'
    },
    {
      type: 'text_narrative',
      title: 'Instrucción o Lectura',
      description: 'Inserta texto narrativo, instrucciones pedagógicas o diálogos de guía.',
      badge: '📖 Lectura',
      icon: BookOpen,
      gradient: 'from-blue-500 to-cyan-600',
      glowColor: 'shadow-blue-500/30'
    },
    {
      type: 'reward_chest',
      title: 'Cofre de Recompensas',
      description: 'Otorga puntos XP, monedas de oro e insignias coleccionables a los alumnos.',
      badge: '🎁 Recompensa',
      icon: Gift,
      gradient: 'from-amber-500 to-yellow-600',
      glowColor: 'shadow-amber-500/30'
    },
    {
      type: 'boss_enemy',
      title: 'Duelo contra Boss Pixi',
      description: 'Configura un combate por turnos con dragones y monstruos animados PixiJS.',
      badge: '⚔️ Combate',
      icon: Swords,
      gradient: 'from-rose-500 to-red-600',
      glowColor: 'shadow-rose-500/30'
    },
  ];

  // Métricas acumuladas
  const totalQuestions = blocks.filter(b => b.type === 'quiz_question').length;
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

        {/* Lista de Íconos de Herramientas */}
        <div className="flex flex-row lg:flex-col items-center gap-2">
          {tools.map((tool) => {
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
                  onClick={() => addBlock(tool.type)}
                  aria-label={tool.title}
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr ${tool.gradient} text-white flex items-center justify-center shadow-md ${tool.glowColor} hover:scale-110 active:scale-95 transition-all transform cursor-pointer group`}
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>

                {/* Tooltip con Animación Fade-in Suave */}
                <AnimatePresence>
                  {hoveredTool?.type === tool.type && (
                    <motion.div
                      initial={{ opacity: 0, x: -8, scale: 0.94 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.14, ease: 'easeOut' }}
                      className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-[9999] pointer-events-none"
                    >
                      <div className="relative bg-slate-900/95 dark:bg-zinc-900/95 text-white backdrop-blur-xl border border-slate-700/80 dark:border-zinc-700/80 shadow-2xl rounded-2xl p-3 w-56 space-y-1">
                        {/* Triángulo indicador hacia el botón */}
                        <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-slate-900 dark:bg-zinc-900 border-l border-b border-slate-700/80 dark:border-zinc-700/80 rotate-45" />

                        <div className="flex items-center justify-between gap-1 relative z-10">
                          <h4 className="text-xs font-black text-white truncate">
                            {tool.title}
                          </h4>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-white/10 text-purple-200 shrink-0">
                            {tool.badge}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300 dark:text-zinc-400 relative z-10 leading-relaxed">
                          {tool.description}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Separador */}
        <div className="hidden lg:block w-full h-px bg-slate-100 dark:border-zinc-800 my-1" />

        {/* Botón Catálogo (+) */}
        <div 
          className={`relative ${hoveredPlus ? 'z-50' : 'z-10'}`}
          onMouseEnter={() => setHoveredPlus(true)}
          onMouseLeave={() => setHoveredPlus(false)}
        >
          <button
            type="button"
            onClick={() => setIsExtendedMenuOpen(true)}
            aria-label="Abrir catálogo completo de bloques"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-2 border-dashed border-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50 flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all transform cursor-pointer group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>

          {/* Tooltip del Botón Catálogo (+) */}
          <AnimatePresence>
            {hoveredPlus && (
              <motion.div
                initial={{ opacity: 0, x: -8, scale: 0.94 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.14, ease: 'easeOut' }}
                className="hidden lg:block absolute left-full top-1/2 -translate-y-1/2 ml-3.5 z-[9999] pointer-events-none"
              >
                <div className="relative bg-slate-900/95 dark:bg-zinc-900/95 text-white backdrop-blur-xl border border-slate-700/80 dark:border-zinc-700/80 shadow-2xl rounded-2xl p-3 w-52 space-y-1">
                  <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-slate-900 dark:bg-zinc-900 border-l border-b border-slate-700/80 dark:border-zinc-700/80 rotate-45" />
                  <h4 className="text-xs font-black text-purple-300 relative z-10">
                    (+) Catálogo LMS Gamificado
                  </h4>
                  <p className="text-[11px] text-slate-300 dark:text-zinc-400 relative z-10">
                    Explora más de 15 mecánicas interactivas y avanzadas de evaluación.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
    </aside>
  );
};
