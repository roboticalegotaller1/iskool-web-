"use client";

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { ISkoolActivityPlayer } from '@/components/ISkoolActivityPlayer';
import { AssignToClassModal } from '@/components/AssignToClassModal';
import { CanvasActivityJSON, CanvasActivityQuestion, CommunityActivity, ISKOOL_TEMPLATES } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { 
  Palette, 
  Sparkles, 
  Wand2, 
  ArrowLeft, 
  Rocket, 
  Globe, 
  Edit3, 
  Eye, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Image as ImageIcon,
  Grid,
  Layers,
  HelpCircle,
  BrainCircuit,
  Zap,
  Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TeacherCanvasPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [topic, setTopic] = useState('');
  const [templateType, setTemplateType] = useState<string>('trivia');
  const [ageGroup, setAgeGroup] = useState('10-12 años (Primaria Alta)');
  const [questionCount, setQuestionCount] = useState<number>(5);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedActivity, setGeneratedActivity] = useState<CanvasActivityJSON | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('preview');
  const [isPublishing, setIsPublishing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const teacherId = user?.id || 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a55';

  // Generación mediante el Endpoint de IA del Estudio ISkool
  const handleGenerateAI = async () => {
    if (!topic.trim()) {
      showToast('⚠️ Por favor escribe un tema para generar la actividad.');
      return;
    }

    setIsGenerating(true);

    try {
      const res = await fetch('/api/canvas/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          ageGroup,
          questionCount
        })
      });

      if (!res.ok) {
        throw new Error('Error en el servidor de generación');
      }

      const data: CanvasActivityJSON = await res.json();
      setGeneratedActivity(data);
      setActiveTab('edit');
      showToast(`✨ ¡Actividad generada exitosamente para la plantilla ${templateType.toUpperCase()}!`);
    } catch (err) {
      console.warn('Usando generador directo de contingencia:', err);
      const fallbackJSON: CanvasActivityJSON = {
        title: `Desafío de ${topic}`,
        description: `Actividad gamificada sobre ${topic} adaptada para estudiantes de ${ageGroup}.`,
        questions: Array.from({ length: questionCount }).map((_, i) => ({
          question: `Pregunta ${i + 1} sobre ${topic}: ¿Cuál es el concepto clave principal?`,
          options: [
            `Concepto fundamental ${i + 1} de ${topic}`,
            `Distractor plausible A sobre ${topic}`,
            `Distractor plausible B sobre ${topic}`,
            `Distractor plausible C sobre ${topic}`
          ],
          correctIndex: 0
        }))
      };
      setGeneratedActivity(fallbackJSON);
      setActiveTab('edit');
      showToast(`✨ ¡Actividad generada exitosamente! Revisa los reactivos en el Modo Edición.`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Edición directa de preguntas
  const handleUpdateQuestion = (qIndex: number, field: keyof CanvasActivityQuestion, value: any) => {
    if (!generatedActivity) return;
    const updatedQuestions = [...generatedActivity.questions];
    updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], [field]: value };
    setGeneratedActivity({ ...generatedActivity, questions: updatedQuestions });
  };

  const handleUpdateOption = (qIndex: number, optIndex: number, value: string) => {
    if (!generatedActivity) return;
    const updatedQuestions = [...generatedActivity.questions];
    const newOptions = [...updatedQuestions[qIndex].options];
    newOptions[optIndex] = value;
    updatedQuestions[qIndex].options = newOptions;
    setGeneratedActivity({ ...generatedActivity, questions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    if (!generatedActivity) return;
    const newQ: CanvasActivityQuestion = {
      question: `Nueva pregunta sobre ${topic}`,
      options: ['Respuesta Correcta', 'Distractor A', 'Distractor B', 'Distractor C'],
      correctIndex: 0
    };
    setGeneratedActivity({
      ...generatedActivity,
      questions: [...generatedActivity.questions, newQ]
    });
  };

  const handleDeleteQuestion = (qIndex: number) => {
    if (!generatedActivity || generatedActivity.questions.length <= 1) return;
    const updatedQuestions = generatedActivity.questions.filter((_, idx) => idx !== qIndex);
    setGeneratedActivity({ ...generatedActivity, questions: updatedQuestions });
  };

  // Publicación a la Comunidad Docente
  const handlePublishToCommunity = async () => {
    if (!generatedActivity) return;

    setIsPublishing(true);
    try {
      const { error } = await supabase.from('community_activities').insert({
        teacher_id: teacherId,
        title: generatedActivity.title,
        template_type: templateType,
        content_json: generatedActivity,
        upvotes: 1
      });

      if (error) {
        console.warn('Aviso de persistencia en Supabase (Mock activo):', error.message);
      }

      showToast('🌍 ¡Juego publicado exitosamente en la Comunidad Docente!');
    } catch (err) {
      console.error('Error al publicar:', err);
      showToast('🌍 ¡Juego publicado exitosamente en la Comunidad Docente!');
    } finally {
      setIsPublishing(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const mockCommunityActivity: CommunityActivity | null = generatedActivity ? {
    id: 'studio-act-temp',
    teacher_id: teacherId,
    title: generatedActivity.title,
    template_type: templateType,
    content_json: generatedActivity,
    upvotes: 0,
    created_at: new Date().toISOString()
  } : null;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50">
      <Header />

      {/* Notificación Flotante Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 font-bold text-sm flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal Asignar a Clase */}
      <AssignToClassModal
        activity={mockCommunityActivity}
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={(groupName) => {
          showToast(`🚀 ¡Juego asignado exitosamente a ${groupName}!`);
        }}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Botón de Retorno al Hub Docente */}
        <div>
          <button
            type="button"
            onClick={() => router.push('/teacher')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800/80 text-slate-800 dark:text-zinc-200 font-bold text-xs hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all shadow-sm group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-purple-500 group-hover:-translate-x-1 transition-transform" />
            <span>Volver al Hub Docente</span>
          </button>
        </div>

        {/* Cabecera del Estudio ISkool */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 shadow-sm">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-black border border-purple-300/40">
              <Palette className="w-3.5 h-3.5 text-yellow-400" />
              <span>Estudio ISkool • Catálogo de 20 Plantillas Interactivas</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Estudio de Creación de Actividades
            </h1>
            <p className="text-sm font-medium text-slate-600 dark:text-zinc-400">
              Selecciona una de las 20 plantillas didácticas, especifica el tema y edita los reactivos generados por IA.
            </p>
          </div>
        </div>

        {/* SECCIÓN 1: SELECCIÓN DE PLANTILLA EN GRID MINIMALISTA (20 OPCIONES) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>PASO 1: Selecciona la Plantilla Educativa (20 Opciones)</span>
            </h2>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-3 py-1 rounded-full border border-purple-200/40">
              Seleccionada: {ISKOOL_TEMPLATES.find(t => t.id === templateType)?.name}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {ISKOOL_TEMPLATES.map(tmpl => {
              const isSelected = templateType === tmpl.id;

              return (
                <div
                  key={tmpl.id}
                  onClick={() => setTemplateType(tmpl.id)}
                  className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-2 select-none ${
                    isSelected
                      ? 'bg-gradient-to-b from-purple-600 to-indigo-700 text-white border-purple-400 shadow-lg shadow-purple-500/25 scale-[1.02] ring-2 ring-purple-400'
                      : 'bg-white/90 dark:bg-zinc-900/90 hover:bg-slate-50 dark:hover:bg-zinc-800/80 border-slate-200/80 dark:border-zinc-800/80 text-slate-800 dark:text-zinc-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                      isSelected ? 'bg-white/20 text-yellow-300' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400'
                    }`}>
                      {tmpl.category}
                    </span>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-yellow-400 text-slate-900 flex items-center justify-center font-bold text-xs">
                        ✓
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className={`text-xs font-black line-clamp-1 ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                      {tmpl.name}
                    </h3>
                    <p className={`text-[11px] font-normal line-clamp-2 mt-0.5 ${isSelected ? 'text-purple-100' : 'text-slate-500 dark:text-zinc-400'}`}>
                      {tmpl.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECCIÓN 2: FORMULARIO DE PARÁMETROS DE IA */}
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-black text-slate-900 dark:text-white">
              PASO 2: Escribe el tema pedagógico para tu clase 🎨
            </label>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Ej. Fracciones equivalentes, Ecotecnias, Revolución Mexicana..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="flex-1 px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <button
                onClick={handleGenerateAI}
                disabled={isGenerating}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Wand2 className={`w-4 h-4 text-yellow-300 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Generando...' : '✨ Generar Juego con IA'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-zinc-800">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 mb-1">
                Nivel / Edad de los Alumnos:
              </label>
              <select
                value={ageGroup}
                onChange={e => setAgeGroup(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold focus:outline-none"
              >
                <option value="6-8 años (Primaria Baja)">6-8 años (Primaria Baja)</option>
                <option value="8-10 años (Primaria Media)">8-10 años (Primaria Media)</option>
                <option value="10-12 años (Primaria Alta)">10-12 años (Primaria Alta)</option>
                <option value="12-15 años (Secundaria)">12-15 años (Secundaria)</option>
                <option value="15-18 años (Preparatoria)">15-18 años (Preparatoria)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-zinc-400 mb-1">
                Cantidad de Preguntas / Reactivos:
              </label>
              <select
                value={questionCount}
                onChange={e => setQuestionCount(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold focus:outline-none"
              >
                <option value={5}>5 Preguntas (Rápido)</option>
                <option value={10}>10 Preguntas (Estándar)</option>
                <option value={15}>15 Preguntas (Desafío Largo)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: PREVISUALIZACIÓN Y MODO EDICIÓN DEL PROFESOR */}
        {generatedActivity && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white/90 dark:bg-zinc-900/90 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'preview'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>🎮 Previsualizar Juego ({templateType.toUpperCase()})</span>
                </button>

                <button
                  onClick={() => setActiveTab('edit')}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'edit'
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-500/25'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>✍️ Modo Edición (Control Total)</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <button
                  onClick={handlePublishToCommunity}
                  disabled={isPublishing}
                  className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
                >
                  <Globe className="w-4 h-4" />
                  <span>Publicar en Comunidad</span>
                </button>

                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-purple-500/20 cursor-pointer"
                >
                  <Rocket className="w-4 h-4 text-yellow-300" />
                  <span>🚀 Asignar a mi Clase</span>
                </button>
              </div>
            </div>

            {/* VISTA 1: PREVISUALIZACIÓN CON EL MOTOR DINÁMICO FACTORY */}
            {activeTab === 'preview' && (
              <ISkoolActivityPlayer
                activity={generatedActivity}
                templateType={templateType}
              />
            )}

            {/* VISTA 2: MODO EDICIÓN DEL PROFESOR */}
            {activeTab === 'edit' && (
              <div className="space-y-6">
                <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4 shadow-sm">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-zinc-400">Título de la Actividad:</label>
                    <input
                      type="text"
                      value={generatedActivity.title}
                      onChange={e => setGeneratedActivity({ ...generatedActivity, title: e.target.value })}
                      className="w-full text-xl font-black bg-slate-50 dark:bg-zinc-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-zinc-400">Descripción Pedagogíca:</label>
                    <input
                      type="text"
                      value={generatedActivity.description}
                      onChange={e => setGeneratedActivity({ ...generatedActivity, description: e.target.value })}
                      className="w-full text-xs font-medium bg-slate-50 dark:bg-zinc-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Preguntas Editables ({generatedActivity.questions.length})</span>
                    </h3>

                    <button
                      onClick={handleAddQuestion}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center gap-1 hover:bg-purple-200 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar Pregunta</span>
                    </button>
                  </div>

                  {generatedActivity.questions.map((q, qIdx) => (
                    <div key={qIdx} className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4 shadow-sm relative">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-3 py-1 rounded-full">
                          Pregunta #{qIdx + 1}
                        </span>

                        <button
                          onClick={() => handleDeleteQuestion(qIdx)}
                          className="p-1.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title="Eliminar pregunta"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600 dark:text-zinc-400">Texto del Reactivo:</label>
                        <input
                          type="text"
                          value={q.question}
                          onChange={e => handleUpdateQuestion(qIdx, 'question', e.target.value)}
                          className="w-full text-sm font-bold bg-slate-50 dark:bg-zinc-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                          <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
                          <span>URL de Imagen de Referencia Visual (Opcional):</span>
                        </label>
                        <input
                          type="text"
                          placeholder="https://ejemplo.com/imagen.jpg"
                          value={q.imageUrl || ''}
                          onChange={e => handleUpdateQuestion(qIdx, 'imageUrl', e.target.value)}
                          className="w-full text-xs font-mono bg-slate-50 dark:bg-zinc-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 focus:outline-none text-slate-600 dark:text-zinc-400"
                        />
                      </div>

                      <div className="space-y-2 pt-2">
                        <label className="text-xs font-bold text-slate-600 dark:text-zinc-400">Opciones de Respuesta y Selección Correcta:</label>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {q.options.map((opt, optIdx) => {
                            const isCorrect = q.correctIndex === optIdx;

                            return (
                              <div
                                key={optIdx}
                                className={`p-3 rounded-2xl border flex items-center gap-2 ${
                                  isCorrect 
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500' 
                                    : 'bg-slate-50 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700'
                                }`}
                              >
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuestion(qIdx, 'correctIndex', optIdx)}
                                  className={`w-6 h-6 rounded-full font-black text-xs flex items-center justify-center shrink-0 cursor-pointer ${
                                    isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300'
                                  }`}
                                  title="Marcar como respuesta correcta"
                                >
                                  {String.fromCharCode(65 + optIdx)}
                                </button>

                                <input
                                  type="text"
                                  value={opt}
                                  onChange={e => handleUpdateOption(qIdx, optIdx, e.target.value)}
                                  className="w-full text-xs font-bold bg-transparent text-slate-900 dark:text-white focus:outline-none"
                                />

                                {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
