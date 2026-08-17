"use client";

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useActivityBuilderStore } from '@/store/useActivityBuilderStore';
import { SortableBlockWrapper } from './SortableBlockWrapper';
import { WorkspaceConnectionLine } from './WorkspaceConnectionLine';
import { 
  Sparkles, 
  Plus, 
  Layers, 
  Zap, 
  HelpCircle, 
  Swords, 
  BookOpen 
} from 'lucide-react';

export const WorkspaceArea: React.FC = () => {
  const { 
    blocks, 
    reorderBlocks, 
    addBlock, 
    setIsExtendedMenuOpen,
    zoomLevel 
  } = useActivityBuilderStore();

  // Sensores modernos de arrastre con distancia de activación para no interferir con clicks
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6, // 6px de movimiento antes de iniciar el arrastre
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderBlocks(String(active.id), String(over.id));
    }
  };

  return (
    <div className="flex-1 w-full min-w-0 space-y-6">
      {/* Contenedor del Espacio de Trabajo con Zoom Reactivo */}
      <div 
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
        className="transition-transform duration-150"
      >
        {blocks.length === 0 ? (
          /* Estado Vacío Intuitivo */
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border-2 border-dashed border-slate-300 dark:border-zinc-800 p-8 sm:p-12 text-center space-y-5 shadow-sm">
            <div className="w-16 h-16 rounded-3xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-md">
              <Layers className="w-8 h-8" />
            </div>

            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Tu Lienzo de Actividades está en Blanco
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Arrastra o haz clic en un bloque de la barra izquierda para comenzar a construir el flujo didáctico.
              </p>
            </div>

            {/* Sugerencias Rápidas en 1 Clic */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => addBlock('quiz_question')}
                className="px-4 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-bold text-xs hover:bg-purple-100 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>+ Agregar Pregunta</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock('text_narrative')}
                className="px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 font-bold text-xs hover:bg-blue-100 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>+ Agregar Instrucción</span>
              </button>
              <button
                type="button"
                onClick={() => addBlock('boss_enemy')}
                className="px-4 py-2 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold text-xs hover:bg-rose-100 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Swords className="w-3.5 h-3.5" />
                <span>+ Duelo Pixi</span>
              </button>
            </div>
          </div>
        ) : (
          /* Lista de Bloques Ordenables con dnd-kit */
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-0">
                {blocks.map((block, idx) => (
                  <React.Fragment key={block.id}>
                    {/* Bloque Arrastrable */}
                    <SortableBlockWrapper
                      block={block}
                      index={idx}
                      totalBlocks={blocks.length}
                    />

                    {/* Conector Visual entre Bloques */}
                    {idx < blocks.length - 1 && (
                      <WorkspaceConnectionLine insertIndex={idx + 1} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* Barra de Inserción Final al Pie del Lienzo */}
        {blocks.length > 0 && (
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => addBlock('quiz_question')}
              className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-lg shadow-purple-500/25 flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Añadir Siguiente Reactivo</span>
            </button>
            <button
              type="button"
              onClick={() => setIsExtendedMenuOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-850 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-750 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>(+) Menú Extendido de Bloques</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
