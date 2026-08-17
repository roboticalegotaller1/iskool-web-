"use client";

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useActivityBuilderStore } from '@/store/useActivityBuilderStore';
import { StudioBlockType } from '@/types/studioBlocks';
import { 
  X, 
  Sparkles, 
  Video, 
  Globe, 
  Gamepad2, 
  GitBranch, 
  Volume2, 
  Swords, 
  Gift, 
  HelpCircle, 
  BookOpen, 
  CheckCircle2,
  Plus
} from 'lucide-react';

export const ExtendedToolsDrawer: React.FC = () => {
  const { isExtendedMenuOpen, setIsExtendedMenuOpen, addBlock } = useActivityBuilderStore();
  const [activeTab, setActiveTab] = useState<'all' | 'multimedia' | 'games' | 'logic'>('all');

  if (!isExtendedMenuOpen) return null;

  const tools: {
    type: StudioBlockType;
    category: 'multimedia' | 'games' | 'logic' | 'core';
    title: string;
    description: string;
    icon: any;
    color: string;
    badge: string;
  }[] = [
    {
      type: 'youtube_video',
      category: 'multimedia',
      title: 'Video de YouTube',
      description: 'Incrusta videos educativos con marcas de tiempo y pausa formativa.',
      icon: Video,
      color: 'from-red-500 to-rose-600 text-white',
      badge: 'Multimedia'
    },
    {
      type: 'external_embed',
      category: 'multimedia',
      title: 'Simulador / Iframe Web',
      description: 'Integra simuladores científicos (PhET, GeoGebra) o páginas interactivas.',
      icon: Globe,
      color: 'from-cyan-500 to-blue-600 text-white',
      badge: 'Laboratorio'
    },
    {
      type: 'minigame_action',
      category: 'games',
      title: 'Minijuego Gamificado',
      description: 'Añade ruletas de conceptos, memoramas visuales, ahorcados o candados.',
      icon: Gamepad2,
      color: 'from-amber-500 to-yellow-600 text-white',
      badge: 'Minijuego'
    },
    {
      type: 'boss_enemy',
      category: 'games',
      title: 'Encuentro Pixi con Boss',
      description: 'Duelo por turnos con barra de vida (HP) y monstruos animados.',
      icon: Swords,
      color: 'from-rose-500 to-red-600 text-white',
      badge: 'Combate'
    },
    {
      type: 'logic_branch',
      category: 'logic',
      title: 'Ramificación Condicional',
      description: 'Adapta la ruta pedagógica: bifurca según el porcentaje de aciertos.',
      icon: GitBranch,
      color: 'from-indigo-500 to-purple-600 text-white',
      badge: 'Lógica'
    },
    {
      type: 'audio_sfx',
      category: 'multimedia',
      title: 'Efecto de Audio / Fanfarria',
      description: 'Sonidos de victoria, tambores de combate y música ambiental.',
      icon: Volume2,
      color: 'from-violet-500 to-fuchsia-600 text-white',
      badge: 'Audio'
    },
  ];

  const filteredTools = tools.filter(t => activeTab === 'all' || t.category === activeTab);

  const handleSelectTool = (type: StudioBlockType) => {
    addBlock(type);
    setIsExtendedMenuOpen(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-start justify-center p-3 sm:p-4 pt-6 sm:pt-10 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden my-auto sm:my-2 animate-scale-in">
        {/* Cabecera del Menú Extendido */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-850/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Catálogo Extendido de Herramientas Didácticas
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Selecciona un bloque avanzado para insertarlo en tu flujo interactivo.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsExtendedMenuOpen(false)}
            aria-label="Cerrar menú de herramientas"
            className="p-1.5 rounded-xl bg-slate-200/80 dark:bg-zinc-750 hover:bg-rose-500 hover:text-white text-slate-600 dark:text-zinc-300 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pestañas de Filtrado */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-x-auto">
          {[
            { id: 'all', label: 'Todos los Bloques' },
            { id: 'multimedia', label: '🎬 Multimedia & Web' },
            { id: 'games', label: '🎮 Gamificación & Juegos' },
            { id: 'logic', label: '🔀 Lógica & Ramificación' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Cuadrícula de Herramientas */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[60vh] overflow-y-auto">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.type}
                onClick={() => handleSelectTool(tool.type)}
                className="group p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:border-purple-400 dark:hover:border-purple-600 bg-white dark:bg-zinc-850 hover:bg-purple-50/40 dark:hover:bg-purple-950/20 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${tool.color} flex items-center justify-center shrink-0 shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300">
                        {tool.badge}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-purple-600 dark:text-purple-400 group-hover:translate-x-0.5 transition-transform">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Insertar Bloque</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>,
    document.body
  );
};
