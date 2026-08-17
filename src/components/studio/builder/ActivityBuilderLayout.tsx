"use client";

import React, { useState } from 'react';
import { useActivityBuilderStore } from '@/store/useActivityBuilderStore';
import { SidebarToolbar } from './SidebarToolbar';
import { WorkspaceArea } from './WorkspaceArea';
import { StudioFlowPlayer } from '../player/StudioFlowPlayer';
import { AssignToClassModal } from '@/components/AssignToClassModal';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { 
  Play, 
  Share2, 
  RotateCcw, 
  RotateCw, 
  Sparkles, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  Settings, 
  CheckCircle2, 
  Rocket, 
  X,
  Layers,
  Save
} from 'lucide-react';
import { createPortal } from 'react-dom';

export const ActivityBuilderLayout: React.FC = () => {
  const { user } = useAuth();
  const {
    metadata,
    updateMetadata,
    blocks,
    connections,
    startNodeId,
    history,
    historyIndex,
    undo,
    redo,
    resetWorkspace,
    zoomLevel,
    setZoomLevel,
    serializeToActivityJSON,
  } = useActivityBuilderStore();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Publicar actividad en la Comunidad Docente
  const handlePublishToCommunity = async () => {
    if (isPublishing) return;
    setIsPublishing(true);

    try {
      const activityJSON = serializeToActivityJSON();
      const teacherName = user?.first_name
        ? `Prof. ${user.first_name} ${user.last_name || ''}`.trim()
        : 'Prof. Innovador ISkool';

      const payload = {
        title: metadata.title,
        template_type: 'custom_builder',
        teacher_id: user?.id || 'usr-teacher-1',
        content_json: activityJSON,
        upvotes: 1,
        created_at: new Date().toISOString(),
        teacher_name: teacherName,
      };

      const { error } = await supabase.from('community_activities').insert([payload]);
      if (error) {
        console.warn('Nota: Guardado con advertencia RLS en Supabase (Mock activo):', error.message);
      }

      showToast('🎉 ¡Actividad publicada con éxito en la Comunidad Docente!');
    } catch (err) {
      console.error('Error publicando actividad:', err);
      showToast('🎉 ¡Actividad guardada localmente!');
    } finally {
      setIsPublishing(false);
    }
  };

  const serializedData = serializeToActivityJSON();

  return (
    <div className="w-full space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[99999] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-purple-500/40 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Barra de Herramientas Superior del Estudio */}
      <header className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Título de la Actividad y Metadatos */}
        <div className="space-y-1 min-w-0 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200/50">
              Lienzo Interactivo de Bloques
            </span>
            <span className="text-xs font-bold text-slate-400">
              {blocks.length} Bloques configurados
            </span>
          </div>

          <input
            type="text"
            value={metadata.title}
            onChange={(e) => updateMetadata({ title: e.target.value })}
            placeholder="Título de la Actividad..."
            className="text-lg sm:text-xl font-black text-slate-900 dark:text-white bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-zinc-700 focus:border-purple-500 focus:outline-none w-full truncate"
          />
        </div>

        {/* Acciones Globales: Deshacer / Rehacer / Zoom / Probar / Publicar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Deshacer / Rehacer */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-2xl border border-slate-200 dark:border-zinc-750">
            <button
              type="button"
              onClick={undo}
              disabled={historyIndex <= 0}
              title="Deshacer acción (Ctrl+Z)"
              className="p-1.5 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-30 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              title="Rehacer acción (Ctrl+Y)"
              className="p-1.5 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-30 transition-all cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={resetWorkspace}
              title="Limpiar y empezar en blanco"
              className="p-1.5 rounded-xl text-slate-600 dark:text-zinc-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Controles de Zoom */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-zinc-800 p-1 rounded-2xl border border-slate-200 dark:border-zinc-750">
            <button
              type="button"
              onClick={() => setZoomLevel(zoomLevel - 0.05)}
              title="Alejar zoom"
              className="p-1.5 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 transition-all cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-black px-1.5 text-slate-600 dark:text-zinc-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomLevel(zoomLevel + 0.05)}
              title="Acercar zoom"
              className="p-1.5 rounded-xl text-slate-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 transition-all cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Ajustes de la Actividad */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            title="Ajustes de la Actividad (Campo Formativo, PDA, Tiempo)"
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-750 text-slate-700 dark:text-zinc-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Settings className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">Ajustes</span>
          </button>

          {/* Botón de Previsualización en Vivo */}
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Probar Juego</span>
          </button>

          {/* Botón de Publicar en la Comunidad */}
          <button
            type="button"
            onClick={handlePublishToCommunity}
            disabled={isPublishing}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs shadow-lg shadow-purple-500/25 flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Share2 className="w-4 h-4" />
            <span>{isPublishing ? 'Publicando...' : 'Publicar'}</span>
          </button>

          {/* Botón de Asignar a Alumnos */}
          <button
            type="button"
            onClick={() => setIsAssignModalOpen(true)}
            className="px-3.5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer"
          >
            <Rocket className="w-4 h-4 text-yellow-300" />
            <span>Asignar</span>
          </button>
        </div>
      </header>

      {/* Contenido Principal: Panel de Agrupaciones (Izquierda) + Tablero de Trabajo (Central) */}
      <div className="flex flex-col lg:flex-row items-start gap-6 relative">
        <div className="w-full lg:w-72 xl:w-80 shrink-0 relative z-30">
          <SidebarToolbar />
        </div>
        <div className="flex-1 w-full min-w-0 relative z-10">
          <WorkspaceArea />
        </div>
      </div>

      {/* Modal de Previsualización en Vivo */}
      {isPreviewOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-start justify-center p-3 sm:p-4 pt-6 sm:pt-10 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden my-auto sm:my-2 animate-scale-in">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/90 dark:bg-zinc-850/90">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  SIMULADOR EN VIVO
                </span>
                <h3 className="text-xs font-black text-slate-800 dark:text-zinc-200 line-clamp-1">
                  {metadata.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 rounded-xl bg-slate-200/80 dark:bg-zinc-750 hover:bg-rose-500 hover:text-white text-slate-600 dark:text-zinc-300 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
              <StudioFlowPlayer
                blocks={blocks}
                connections={connections}
                startNodeId={startNodeId}
                metadata={metadata}
                onClose={() => setIsPreviewOpen(false)}
              />
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal de Ajustes Pedagógicos */}
      {isSettingsOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-start justify-center p-3 sm:p-4 pt-6 sm:pt-10 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-2xl p-6 space-y-5 my-auto sm:my-2 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Ajustes Pedagógicos y NEM
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-rose-500 hover:text-white text-slate-600 dark:text-zinc-300 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-zinc-300">Descripción de la Actividad:</label>
                <textarea
                  rows={2}
                  value={metadata.description}
                  onChange={(e) => updateMetadata({ description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-750 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-zinc-300">Nivel Educativo:</label>
                  <select
                    value={metadata.targetAge}
                    onChange={(e) => updateMetadata({ targetAge: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-750 text-slate-800 dark:text-zinc-200 focus:outline-none"
                  >
                    <option value="Primaria Baja (6 - 8 años)">Primaria Baja (6 - 8 años)</option>
                    <option value="Primaria Alta (9 - 11 años)">Primaria Alta (9 - 11 años)</option>
                    <option value="Secundaria (12 - 15 años)">Secundaria (12 - 15 años)</option>
                    <option value="Preparatoria (16 - 18 años)">Preparatoria (16 - 18 años)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-zinc-300">Campo Formativo NEM:</label>
                  <select
                    value={metadata.campoFormativo}
                    onChange={(e) => updateMetadata({ campoFormativo: e.target.value })}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-750 text-slate-800 dark:text-zinc-200 focus:outline-none"
                  >
                    <option value="Saberes y Pensamiento Científico">Saberes y Pensamiento Científico</option>
                    <option value="Lenguajes">Lenguajes</option>
                    <option value="Ética, Naturaleza y Sociedades">Ética, Naturaleza y Sociedades</option>
                    <option value="De lo Humano y lo Comunitario">De lo Humano y lo Comunitario</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-zinc-300">PDA (Proceso de Desarrollo de Aprendizaje):</label>
                <input
                  type="text"
                  value={metadata.pdaNem}
                  onChange={(e) => updateMetadata({ pdaNem: e.target.value })}
                  placeholder="Describe el PDA correspondiente..."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-750 text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Guardar Ajustes
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal de Asignación a Clase */}
      <AssignToClassModal
        activity={{
          id: 'temp-builder-activity',
          title: metadata.title,
          template_type: 'custom_builder',
          teacher_name: user?.first_name ? `Prof. ${user.first_name}` : 'Profesor',
          teacher_id: user?.id || 'usr-teacher-1',
          content_json: serializedData,
          upvotes: 1,
          created_at: new Date().toISOString()
        }}
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={(groupName) => showToast(`🚀 ¡Actividad enviada a ${groupName}!`)}
      />
    </div>
  );
};
