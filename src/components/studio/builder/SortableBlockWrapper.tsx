"use client";

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { StudioBlock, StudioBlockType } from '@/types/studioBlocks';
import { useActivityBuilderStore } from '@/store/useActivityBuilderStore';
import { BlockDispatcher } from './blocks/BlockDispatcher';
import { 
  GripVertical, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  Swords, 
  Video, 
  Globe, 
  Gamepad2, 
  GitBranch, 
  Volume2 
} from 'lucide-react';

interface Props {
  block: StudioBlock;
  index: number;
  totalBlocks: number;
}

// Configuración de estilo e ícono por tipo de bloque
const BLOCK_META: Record<StudioBlockType, { label: string; icon: any; colorScheme: string; badgeBg: string }> = {
  text_narrative: {
    label: 'Texto / Narrativa',
    icon: BookOpen,
    colorScheme: 'border-blue-200 dark:border-blue-900/60 shadow-blue-500/5',
    badgeBg: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200/50'
  },
  quiz_question: {
    label: 'Pregunta de Opción Múltiple',
    icon: HelpCircle,
    colorScheme: 'border-purple-200 dark:border-purple-900/60 shadow-purple-500/5',
    badgeBg: 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200/50'
  },
  reward_chest: {
    label: 'Cofre de Recompensas',
    icon: Sparkles,
    colorScheme: 'border-amber-200 dark:border-amber-900/60 shadow-amber-500/5',
    badgeBg: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200/50'
  },
  boss_enemy: {
    label: 'Combate Pixi / Boss',
    icon: Swords,
    colorScheme: 'border-rose-200 dark:border-rose-900/60 shadow-rose-500/5',
    badgeBg: 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200/50'
  },
  youtube_video: {
    label: 'Video Educativo YouTube',
    icon: Video,
    colorScheme: 'border-red-200 dark:border-red-900/60 shadow-red-500/5',
    badgeBg: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200/50'
  },
  external_embed: {
    label: 'Simulador / Iframe Web',
    icon: Globe,
    colorScheme: 'border-cyan-200 dark:border-cyan-900/60 shadow-cyan-500/5',
    badgeBg: 'bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 border-cyan-200/50'
  },
  minigame_action: {
    label: 'Minijuego Gamificado',
    icon: Gamepad2,
    colorScheme: 'border-amber-200 dark:border-amber-900/60 shadow-amber-500/5',
    badgeBg: 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200/50'
  },
  logic_branch: {
    label: 'Condición & Ramificación',
    icon: GitBranch,
    colorScheme: 'border-indigo-200 dark:border-indigo-900/60 shadow-indigo-500/5',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200/50'
  },
  audio_sfx: {
    label: 'Audio / Ambientación',
    icon: Volume2,
    colorScheme: 'border-violet-200 dark:border-violet-900/60 shadow-violet-500/5',
    badgeBg: 'bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border-violet-200/50'
  },
};

export const SortableBlockWrapper: React.FC<Props> = ({ block, index, totalBlocks }) => {
  const {
    selectedBlockId,
    setSelectedBlockId,
    removeBlock,
    duplicateBlock,
    moveBlock,
    toggleCollapseBlock,
    updateBlockTitle,
  } = useActivityBuilderStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const isSelected = selectedBlockId === block.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const meta = BLOCK_META[block.type] || BLOCK_META.text_narrative;
  const BlockIcon = meta.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded-3xl transition-shadow ${
        isDragging ? 'opacity-40 z-50 scale-105' : 'opacity-100 z-10'
      }`}
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={() => setSelectedBlockId(block.id)}
        className={`w-full bg-white dark:bg-zinc-900 rounded-3xl border ${meta.colorScheme} ${
          isSelected
            ? 'ring-2 ring-purple-500 shadow-xl dark:shadow-purple-950/40'
            : 'shadow-lg hover:shadow-xl dark:shadow-zinc-950/50'
        } overflow-hidden transition-all`}
      >
        {/* Cabecera del Bloque */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-850/60 select-none">
          {/* Manija de Arrastre e Información */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              {...attributes}
              {...listeners}
              title="Arrastra para reordenar"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-200/60 dark:hover:bg-zinc-750 cursor-grab active:cursor-grabbing transition-colors"
            >
              <GripVertical className="w-4 h-4" />
            </button>

            {/* Número secuencial */}
            <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-zinc-750 text-slate-700 dark:text-zinc-300 text-[10px] font-black flex items-center justify-center shrink-0">
              {index + 1}
            </span>

            {/* Badge del tipo */}
            <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border flex items-center gap-1 shrink-0 ${meta.badgeBg}`}>
              <BlockIcon className="w-3 h-3" />
              <span className="hidden sm:inline">{meta.label}</span>
            </span>

            {/* Título editable */}
            {isEditingTitle ? (
              <input
                type="text"
                value={block.title}
                autoFocus
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                onChange={(e) => updateBlockTitle(block.id, e.target.value)}
                className="px-2 py-0.5 text-xs font-bold bg-white dark:bg-zinc-800 border border-purple-400 rounded-lg text-slate-900 dark:text-white focus:outline-none"
              />
            ) : (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingTitle(true);
                }}
                title="Clic para editar título"
                className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer flex items-center gap-1"
              >
                <span>{block.title}</span>
                <Edit3 className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100" />
              </span>
            )}
          </div>

          {/* Barra de Acciones del Bloque */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Mover arriba / abajo */}
            <button
              type="button"
              disabled={index === 0}
              onClick={(e) => {
                e.stopPropagation();
                moveBlock(block.id, 'up');
              }}
              title="Mover arriba"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-200/60 dark:hover:bg-zinc-750 disabled:opacity-30 cursor-pointer transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={index === totalBlocks - 1}
              onClick={(e) => {
                e.stopPropagation();
                moveBlock(block.id, 'down');
              }}
              title="Mover abajo"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-200/60 dark:hover:bg-zinc-750 disabled:opacity-30 cursor-pointer transition-colors"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>

            {/* Duplicar */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                duplicateBlock(block.id);
              }}
              title="Duplicar bloque"
              className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            {/* Eliminar */}
            {totalBlocks > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeBlock(block.id);
                }}
                title="Eliminar bloque"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Colapsar / Expandir */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleCollapseBlock(block.id);
              }}
              title={block.isCollapsed ? 'Expandir bloque' : 'Colapsar bloque'}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200/60 dark:hover:bg-zinc-750 transition-colors cursor-pointer"
            >
              {block.isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Cuerpo del Bloque */}
        <AnimatePresence initial={false}>
          {!block.isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-6"
            >
              <BlockDispatcher block={block} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
