"use client";

import React from 'react';
import { ExternalEmbedBlock } from '@/types/studioBlocks';
import { useActivityBuilderStore } from '@/store/useActivityBuilderStore';
import { Globe, ExternalLink, HelpCircle } from 'lucide-react';

interface Props {
  block: ExternalEmbedBlock;
}

export const ExternalEmbedBlockView: React.FC<Props> = ({ block }) => {
  const { updateBlockData } = useActivityBuilderStore();
  const { embedUrl, resourceTitle, instructions } = block.data;

  return (
    <div className="space-y-4">
      {/* URL del Iframe o Simulador */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-cyan-500" />
          <span>URL del Simulador o Recurso Web:</span>
        </label>
        <input
          type="text"
          value={embedUrl}
          onChange={(e) => updateBlockData(block.id, { embedUrl: e.target.value })}
          placeholder="https://phet.colorado.edu/sims/html/..."
          className="w-full px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-750 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-900 dark:text-white"
        />
      </div>

      {/* Título del Recurso */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-slate-500 dark:text-zinc-400">
          Nombre del Recurso:
        </label>
        <input
          type="text"
          value={resourceTitle}
          onChange={(e) => updateBlockData(block.id, { resourceTitle: e.target.value })}
          placeholder="Ej. Simulador de Circuitos Eléctricos..."
          className="w-full px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-750 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 dark:text-zinc-200"
        />
      </div>

      {/* Instrucciones */}
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-slate-600 dark:text-zinc-400 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Instrucciones para la interacción:</span>
        </label>
        <input
          type="text"
          value={instructions}
          onChange={(e) => updateBlockData(block.id, { instructions: e.target.value })}
          placeholder="Ej. Ajusta la masa a 50kg y observa la fuerza requerida..."
          className="w-full px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-750 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 dark:text-zinc-200"
        />
      </div>
    </div>
  );
};
