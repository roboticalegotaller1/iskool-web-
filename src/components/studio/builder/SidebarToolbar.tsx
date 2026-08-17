"use client";

import React from 'react';
import { useActivityBuilderStore } from '@/store/useActivityBuilderStore';
import { StudioBlockType } from '@/types/studioBlocks';
import { 
  Plus, 
  HelpCircle, 
  BookOpen, 
  Sparkles, 
  Swords, 
  Layers, 
  Clock, 
  Award,
  Zap,
  ChevronRight
} from 'lucide-react';

export const SidebarToolbar: React.FC = () => {
  const { 
    blocks, 
    addBlock, 
    setIsExtendedMenuOpen,
    metadata 
  } = useActivityBuilderStore();

  const primaryTools: {
    type: StudioBlockType;
    name: string;
    description: string;
    icon: any;
    color: string;
    badge: string;
  }[] = [
    {
      type: 'quiz_question',
      name: 'Pregunta de Opción Múltiple',
      description: 'Reactivo interactivo con alternativas y retroalimentación.',
      icon: HelpCircle,
      color: 'bg-purple-500 text-white shadow-purple-500/20',
      badge: 'Reactivo'
    },
    {
      type: 'text_narrative',
      name: 'Texto & Instrucción',
      description: 'Instrucciones pedagógicas, diálogos o fragmento de historia.',
      icon: BookOpen,
      color: 'bg-blue-500 text-white shadow-blue-500/20',
      badge: 'Lectura'
    },
    {
      type: 'reward_chest',
      name: 'Cofre de Recompensas',
      description: 'Otorga XP, monedas de oro e insignias coleccionables.',
      icon: Sparkles,
      color: 'bg-amber-500 text-white shadow-amber-500/20',
      badge: 'Gamificación'
    },
    {
      type: 'boss_enemy',
      name: 'Duelo contra Boss Pixi',
      description: 'Encuentro de combate por turnos con monstruos animados.',
      icon: Swords,
      color: 'bg-rose-500 text-white shadow-rose-500/20',
      badge: 'Combate'
    },
  ];

  // Métricas en tiempo real de la actividad
  const totalQuestions = blocks.filter(b => b.type === 'quiz_question').length;
  const totalXp = blocks.reduce((acc, b) => {
    if (b.type === 'reward_chest') return acc + (b.data.xpAmount || 0);
    if (b.type === 'quiz_question') return acc + 20;
    return acc;
  }, 0);

  return (
    <aside className="w-full lg:w-80 flex flex-col gap-5 select-none">
      {/* Panel de Herramientas Esenciales */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 p-4 sm:p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-zinc-200">
              Herramientas de Diseño
            </h2>
          </div>
          <span className="text-[10px] font-bold text-slate-400">
            {blocks.length} Bloques
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Haz clic o inserta directamente los bloques más utilizados en tu flujo:
        </p>

        {/* Lista de Bloques Primarios */}
        <div className="space-y-2.5">
          {primaryTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.type}
                type="button"
                onClick={() => addBlock(tool.type)}
                className="w-full group p-3 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:border-purple-400 dark:hover:border-purple-600 bg-slate-50/70 dark:bg-zinc-850 hover:bg-purple-50/60 dark:hover:bg-purple-950/30 transition-all text-left flex items-start gap-3 cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className={`w-9 h-9 rounded-xl ${tool.color} flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-black text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">
                      {tool.name}
                    </span>
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 shrink-0">
                      {tool.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                    {tool.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Botón Extendido (+) Sin Ruido Visual */}
        <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => setIsExtendedMenuOpen(true)}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs shadow-lg shadow-purple-500/25 transition-all transform active:scale-95 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-yellow-300" />
              <span>(+) Más Herramientas Didácticas</span>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-200" />
          </button>
          <p className="text-[10px] text-center text-slate-400 dark:text-zinc-500 mt-1.5">
            Videos, simuladores PhET, minijuegos y lógica condicional.
          </p>
        </div>
      </div>

      {/* Resumen de Métricas Gamificadas */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 p-4 shadow-sm space-y-3">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
          Métricas de la Actividad
        </span>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/30 text-center">
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">Preguntas</span>
            <p className="text-lg font-black text-purple-700 dark:text-purple-300">{totalQuestions}</p>
          </div>
          <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/30 text-center">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">XP Estimada</span>
            <p className="text-lg font-black text-amber-700 dark:text-amber-300">+{totalXp} XP</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
