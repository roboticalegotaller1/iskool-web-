"use client";

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
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
  HelpCircle, 
  Swords, 
  BookOpen,
  GripVertical,
  ArrowRight,
  Flame,
  Gamepad2
} from 'lucide-react';

export const WorkspaceArea: React.FC = () => {
  const { 
    blocks, 
    reorderBlocks, 
    addBlock, 
    loadPresetBlocks,
    isExtendedMenuOpen,
    setIsExtendedMenuOpen,
    zoomLevel 
  } = useActivityBuilderStore();

  const [activeId, setActiveId] = useState<string | null>(null);
  const activeBlock = blocks.find((b) => b.id === activeId);

  // Sensores optimizados con umbral de 5px para distinguir clics de arrastres
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderBlocks(String(active.id), String(over.id));
    }
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  // Cargar plantilla temática
  const handleLoadIndependencePreset = () => {
    loadPresetBlocks([
      {
        id: `blk-${Date.now()}-1`,
        type: 'text_narrative',
        title: '📖 El Grito de Dolores (1810)',
        isCollapsed: false,
        data: {
          content: 'En la madrugada del 16 de septiembre de 1810, el cura Miguel Hidalgo convocó al pueblo para iniciar la lucha por la libertad.',
          style: 'instruction',
          speakerName: 'Prof. de Historia',
        }
      },
      {
        id: `blk-${Date.now()}-2`,
        type: 'quiz_question',
        title: '❓ Personajes Insurgentes',
        isCollapsed: false,
        data: {
          question: '¿Quién es conocida como "La Corregidora", pieza clave en la conspiración de Querétaro?',
          options: ['Josefa Ortiz de Domínguez (Correcta)', 'Leona Vicario', 'Sor Juana Inés', 'Frida Kahlo'],
          correctIndex: 0,
          explanation: 'Josefa Ortiz de Domínguez alertó oportunamente a los insurgentes sobre el descubrimiento de la conspiración.',
          timeLimitSeconds: 30,
        }
      },
      {
        id: `blk-${Date.now()}-3`,
        type: 'boss_enemy',
        title: '⚔️ Toma de la Alhóndiga de Granaditas',
        isCollapsed: false,
        data: {
          bossName: 'Guardián Realista de Guanajuato',
          spriteKey: 'blood_dragon',
          maxHp: 100,
          attackPower: 15,
          victoryCondition: 'defeat_boss',
          backgroundScene: 'dungeon',
        }
      },
      {
        id: `blk-${Date.now()}-4`,
        type: 'reward_chest',
        title: '🏆 Gloria Insurgente',
        isCollapsed: false,
        data: {
          xpAmount: 200,
          coinsAmount: 50,
          badgeName: 'Héroe de la Independencia 🎖️',
          chestRarity: 'legendary',
        }
      }
    ], {
      title: '🇲🇽 Misión Histórica: Independencia de México',
      description: 'Actividad gamificada con narrativa histórica, reactivos clave y batalla en la Alhóndiga.',
      subject: 'Ética, Naturaleza y Sociedades'
    });
  };

  return (
    <div className="flex-1 w-full min-w-0">
      {/* Contenedor del Espacio de Trabajo con Zoom Reactivo */}
      <div 
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
        className="transition-transform duration-150"
      >
        {blocks.length === 0 ? (
          /* Estado Vacío: Lienzo Limpio y Neutro que hace destacar los bloques e imágenes */
          <div className="relative rounded-3xl border-2 border-dashed border-slate-300 dark:border-zinc-800 bg-[#f8fafc]/90 dark:bg-zinc-950/90 backdrop-blur-sm p-6 sm:p-12 text-center space-y-6 shadow-sm overflow-hidden min-h-[520px] flex flex-col justify-center items-center">
            {/* Patrón de cuadrícula de puntos suave sobre fondo neutro */}
            <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:22px_22px] opacity-35 pointer-events-none" />

            <div className="relative z-10 space-y-2.5 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-violet-600 via-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-purple-500/25 animate-pulse">
                <Layers className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Lienzo de Diseño Gamificado
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
                Selecciona una herramienta lúdica o arrastra bloques para comenzar a crear tu misión didáctica.
              </p>
            </div>

            {/* Tarjetas de Inicio Rápido con Micro-interacciones de Escala */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-xl mx-auto">
              <button
                type="button"
                onClick={() => addBlock('quiz_question')}
                aria-label="Agregar bloque de pregunta didáctica"
                className="group p-4 rounded-2xl border border-slate-200/90 dark:border-zinc-800 hover:border-purple-400 dark:hover:border-purple-600 bg-white dark:bg-zinc-900 hover:bg-purple-50/70 dark:hover:bg-purple-950/30 text-left transition-all duration-200 ease-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl active:scale-95 cursor-pointer flex flex-col justify-between space-y-2.5"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    + Pregunta Didáctica
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    Reactivo formativo con retroalimentación inmediata.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => addBlock('text_narrative')}
                aria-label="Agregar bloque de texto o instrucción"
                className="group p-4 rounded-2xl border border-slate-200/90 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-600 bg-white dark:bg-zinc-900 hover:bg-blue-50/70 dark:hover:bg-blue-950/30 text-left transition-all duration-200 ease-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl active:scale-95 cursor-pointer flex flex-col justify-between space-y-2.5"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    + Instrucción o Lectura
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    Narrativa, contexto pedagógico o instrucciones.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => addBlock('boss_enemy')}
                aria-label="Agregar bloque de combate Pixi"
                className="group p-4 rounded-2xl border border-slate-200/90 dark:border-zinc-800 hover:border-rose-400 dark:hover:border-rose-600 bg-white dark:bg-zinc-900 hover:bg-rose-50/70 dark:hover:bg-rose-950/30 text-left transition-all duration-200 ease-out hover:scale-105 hover:-translate-y-1 hover:shadow-xl active:scale-95 cursor-pointer flex flex-col justify-between space-y-2.5"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform">
                  <Swords className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    + Duelo de Combate
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    Batalla por turnos con monstruo animado PixiJS.
                  </p>
                </div>
              </button>
            </div>

            {/* Plantilla sugerida en 1 Clic con Micro-interacción */}
            <div className="relative z-10 pt-2">
              <button
                type="button"
                onClick={handleLoadIndependencePreset}
                aria-label="Cargar plantilla temática de Independencia de México"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black text-slate-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 hover:bg-purple-100 dark:hover:bg-purple-950 hover:text-purple-700 dark:hover:text-purple-300 border border-slate-200 dark:border-zinc-700 transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95 cursor-pointer"
              >
                <span>🇲🇽 Plantilla: <strong>Independencia de México (4 Bloques)</strong></span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Lista de Bloques Ordenables con dnd-kit y DragOverlay */
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
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

            {/* Overlay Flotante Elevado durante el Arrastre */}
            <DragOverlay adjustScale={false}>
              {activeBlock ? (
                <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl border-2 border-purple-500 shadow-2xl p-4 sm:p-5 opacity-95 scale-[1.02] rotate-1 cursor-grabbing ring-4 ring-purple-500/20">
                  <div className="flex items-center gap-2.5">
                    <GripVertical className="w-4 h-4 text-purple-500" />
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {activeBlock.type}
                    </span>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {activeBlock.title}
                    </h4>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}

        {/* Barra de Inserción Final al Pie del Lienzo */}
        {blocks.length > 0 && (
          <div className="pt-6 pb-28 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => addBlock('quiz_question')}
              aria-label="Añadir siguiente reactivo al final"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Añadir Siguiente Reactivo</span>
            </button>
            <button
              type="button"
              onClick={() => setIsExtendedMenuOpen(true)}
              aria-label="Abrir panel inferior de catálogo de bloques"
              className="px-5 py-3 rounded-2xl bg-white dark:bg-zinc-850 hover:bg-purple-50 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-750 font-black text-xs shadow-sm hover:shadow-md flex items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>(+) Catálogo de Bloques</span>
            </button>
          </div>
        )}
      </div>

      {/* Botón Flotante Principal (+) Fijo con Estilo Gamificado Vibrante */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-30">
        <button
          type="button"
          onClick={() => setIsExtendedMenuOpen(!isExtendedMenuOpen)}
          aria-label="Abrir panel inferior de catálogo de bloques"
          className="px-5 py-3.5 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-black text-sm shadow-2xl shadow-purple-600/40 ring-4 ring-purple-400/30 flex items-center gap-2.5 transition-all duration-200 ease-out hover:scale-105 active:scale-95 cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
            <Plus className={`w-4 h-4 text-white transition-transform duration-200 ${isExtendedMenuOpen ? 'rotate-45' : ''}`} />
          </div>
          <span className="hidden sm:inline font-black tracking-wide">Añadir Bloque</span>
          <span className="font-black">(+)</span>
        </button>
      </div>
    </div>
  );
};
