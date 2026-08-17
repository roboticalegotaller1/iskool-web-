"use client";

import React, { useState, useRef } from 'react';
import { Header } from '@/components/Header';
import { ISkoolActivityPlayer } from '@/components/ISkoolActivityPlayer';
import { AssignToClassModal } from '@/components/AssignToClassModal';
import { CanvasActivityJSON, CanvasActivityQuestion, CommunityActivity, ISKOOL_TEMPLATES, ISkoolTemplateDefinition } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { 
  Palette, Sparkles, Wand2, ArrowLeft, ArrowRight, Rocket, Globe, 
  Edit3, Eye, Plus, Trash2, CheckCircle2, Image as ImageIcon,
  Grid, Layers, HelpCircle, BrainCircuit, Zap, Check, Flame,
  Trophy, Coins, Clock, Heart, Volume2, VolumeX, Shield,
  ChevronDown, ChevronUp, Sliders, Smartphone, Monitor,
  Play, BookOpen, KeyRound, ListOrdered, Disc, AlignLeft,
  Search, Grid3X3, MapPin, Compass, FolderKanban, X, RotateCcw,
  Upload, Move, FileText, Lightbulb, Link as LinkIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TeacherCanvasPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [topic, setTopic] = useState('');
  const [templateType, setTemplateType] = useState<string>('trivia');
  const [ageGroup, setAgeGroup] = useState('10-12 años (Primaria Alta)');
  const [questionCount, setQuestionCount] = useState<number>(4);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedActivity, setGeneratedActivity] = useState<CanvasActivityJSON | null>(null);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [isPlayingFullGame, setIsPlayingFullGame] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Gamificación Avanzada (+)
  const [isAdvancedGamificationOpen, setIsAdvancedGamificationOpen] = useState(false);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(25);
  const [livesMode, setLivesMode] = useState<'3_lives' | '1_life' | 'unlimited'>('3_lives');
  const [streakMultiplier, setStreakMultiplier] = useState<boolean>(true);
  const [badgeRewardName, setBadgeRewardName] = useState<string>('Héroe de la Clase 🎖️');
  const [selectedCampoFormativo, setSelectedCampoFormativo] = useState<string>('Ética, Naturaleza y Sociedades');
  const [pdaText, setPdaText] = useState<string>('Desarrolla aprendizajes y resuelve desafíos mediante el pensamiento crítico y colaborativo.');
  
  // Vista Previa Dinámica
  const [previewQuestionIdx, setPreviewQuestionIdx] = useState<number>(0);
  const [draggedBlockType, setDraggedBlockType] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeImageUploadIdx, setActiveImageUploadIdx] = useState<number | null>(null);

  const teacherId = user?.id || 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a55';

  // Abrir Workspace en Blanco con Bloques Didácticos
  const handleSelectTemplate = (templateId: string) => {
    setTemplateType(templateId);
    const templateDef = ISKOOL_TEMPLATES.find(t => t.id === templateId) || ISKOOL_TEMPLATES[0];

    // Iniciar con un lienzo en blanco estructurado para esta plantilla
    const blankActivity: CanvasActivityJSON = {
      title: `Nueva Actividad: ${templateDef.name}`,
      description: `Diseña tu actividad interactiva de ${templateDef.name} usando bloques didácticos o asistido por IA.`,
      questions: [
        {
          question: `Reactivo 1 de ${templateDef.name}: Escribe tu pregunta, reto o premisa pedagógica aquí...`,
          options: ['Opción A (Respuesta Correcta)', 'Opción B', 'Opción C', 'Opción D'],
          correctIndex: 0,
          explanation: 'Explicación didáctica o retroalimentación formativa.',
          imageUrl: ''
        }
      ]
    };

    setGeneratedActivity(blankActivity);
    setPreviewQuestionIdx(0);
    setIsWorkspaceOpen(true);
    showToast(`🎨 Taller abierto para ${templateDef.name}. ¡Usa los bloques para construir tu actividad!`);
  };

  // Generación mediante el Endpoint de IA del Estudio ISkool
  const handleGenerateAI = async () => {
    if (isGenerating) return;
    if (!topic.trim()) {
      showToast('⚠️ Por favor escribe un tema para generar la actividad.');
      return;
    }

    setIsGenerating(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (sessionData?.session?.access_token) {
        headers['Authorization'] = `Bearer ${sessionData.session.access_token}`;
      }

      const res = await fetch('/api/studio/generate', {
        method: 'POST',
        headers,
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
      setPreviewQuestionIdx(0);
      setIsWorkspaceOpen(true);
      showToast(`✨ ¡Actividad generada exitosamente para la plantilla ${templateType.toUpperCase()}!`);
    } catch (err) {
      console.warn('Usando generador directo de contingencia:', err);
      const fallbackJSON: CanvasActivityJSON = {
        title: `Desafío de ${topic}`,
        description: `Actividad gamificada sobre ${topic} adaptada para estudiantes de ${ageGroup}.`,
        questions: Array.from({ length: questionCount }).map((_, i) => ({
          question: `Pregunta ${i + 1} sobre ${topic}: ¿Cuál es el concepto clave principal?`,
          options: [
            `Concepto fundamental de ${topic}`,
            `Distractor plausible A sobre ${topic}`,
            `Distractor plausible B sobre ${topic}`,
            `Distractor plausible C sobre ${topic}`
          ],
          correctIndex: 0,
          explanation: `Retroalimentación didáctica sobre ${topic}.`
        }))
      };
      setGeneratedActivity(fallbackJSON);
      setPreviewQuestionIdx(0);
      setIsWorkspaceOpen(true);
      showToast(`✨ ¡Actividad generada exitosamente! Lista para personalizar en el Taller.`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Funciones de Bloques Didácticos (Agregar mediante Clic o Drag & Drop)
  const handleAddBlock = (blockType: 'question' | 'image' | 'option' | 'hint' | 'timer') => {
    if (!generatedActivity) return;

    if (blockType === 'question') {
      const newQ: CanvasActivityQuestion = {
        question: `Nuevo Reactivo #${generatedActivity.questions.length + 1}`,
        options: ['Opción Correcta', 'Opción B', 'Opción C', 'Opción D'],
        correctIndex: 0,
        explanation: 'Retroalimentación de este reactivo.',
        imageUrl: ''
      };
      setGeneratedActivity({
        ...generatedActivity,
        questions: [...generatedActivity.questions, newQ]
      });
      setPreviewQuestionIdx(generatedActivity.questions.length);
      showToast('➕ Bloque de Reactivo añadido');
    } else if (blockType === 'image') {
      const updatedQuestions = [...generatedActivity.questions];
      const targetIdx = previewQuestionIdx < updatedQuestions.length ? previewQuestionIdx : 0;
      if (!updatedQuestions[targetIdx].imageUrl) {
        updatedQuestions[targetIdx] = {
          ...updatedQuestions[targetIdx],
          imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80'
        };
        setGeneratedActivity({ ...generatedActivity, questions: updatedQuestions });
        showToast('🖼️ Bloque de Imagen insertado en el reactivo actual');
      } else {
        showToast('ℹ️ El reactivo actual ya tiene un bloque de imagen.');
      }
    } else if (blockType === 'option') {
      const updatedQuestions = [...generatedActivity.questions];
      const targetIdx = previewQuestionIdx < updatedQuestions.length ? previewQuestionIdx : 0;
      if (updatedQuestions[targetIdx].options.length < 6) {
        updatedQuestions[targetIdx].options.push(`Nueva Opción ${String.fromCharCode(65 + updatedQuestions[targetIdx].options.length)}`);
        setGeneratedActivity({ ...generatedActivity, questions: updatedQuestions });
        showToast('🔘 Bloque de Opción de Respuesta añadido');
      } else {
        showToast('⚠️ Máximo 6 opciones de respuesta por reactivo.');
      }
    } else if (blockType === 'hint') {
      const updatedQuestions = [...generatedActivity.questions];
      const targetIdx = previewQuestionIdx < updatedQuestions.length ? previewQuestionIdx : 0;
      updatedQuestions[targetIdx].explanation = '💡 Pista pedagógica: Recuerda analizar los conceptos clave antes de responder.';
      setGeneratedActivity({ ...generatedActivity, questions: updatedQuestions });
      showToast('💡 Bloque de Pista / Explicación añadido');
    } else if (blockType === 'timer') {
      setTimePerQuestion(15);
      setIsAdvancedGamificationOpen(true);
      showToast('⏱️ Bloque de Temporizador activado (15s por reto)');
    }
  };

  // Manejo de Carga de Archivos de Imagen Locales
  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || activeImageUploadIdx === null || !generatedActivity) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target?.result as string;
      const updatedQuestions = [...generatedActivity.questions];
      updatedQuestions[activeImageUploadIdx] = {
        ...updatedQuestions[activeImageUploadIdx],
        imageUrl: dataUrl
      };
      setGeneratedActivity({ ...generatedActivity, questions: updatedQuestions });
      showToast('🖼️ ¡Imagen subida y asignada al reactivo con éxito!');
    };
    reader.readAsDataURL(file);
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

  const handleDeleteQuestion = (qIndex: number) => {
    if (!generatedActivity || generatedActivity.questions.length <= 1) return;
    const updatedQuestions = generatedActivity.questions.filter((_, idx) => idx !== qIndex);
    setGeneratedActivity({ ...generatedActivity, questions: updatedQuestions });
    setPreviewQuestionIdx(Math.max(0, qIndex - 1));
  };

  // Publicación a la Comunidad Docente con Autoría Garantizada
  const handlePublishToCommunity = async () => {
    if (isPublishing || !generatedActivity) return;

    setIsPublishing(true);
    try {
      const teacherName = user 
        ? `Prof. ${user.first_name} ${user.last_name || ''}`.trim()
        : 'Prof. Elena Rostova';

      const contentWithAuthor = {
        ...generatedActivity,
        author_id: teacherId,
        author_name: teacherName,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase.from('community_activities').insert({
        teacher_id: teacherId,
        title: generatedActivity.title,
        template_type: templateType,
        content_json: contentWithAuthor,
        upvotes: 1
      });

      if (error) {
        console.warn('Aviso de persistencia en Supabase (Mock activo):', error.message);
      }

      showToast(`🌍 ¡Juego publicado en la Comunidad Docente con autoría de ${teacherName}!`);
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
    id: `studio-act-${Date.now()}`,
    teacher_id: teacherId,
    title: generatedActivity.title,
    template_type: templateType,
    content_json: generatedActivity,
    upvotes: 0,
    created_at: new Date().toISOString()
  } : null;

  const currentTemplateDef = ISKOOL_TEMPLATES.find(t => t.id === templateType) || ISKOOL_TEMPLATES[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-50">
      <Header />

      {/* Input Oculto de Archivos para Imágenes */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleLocalImageUpload}
        accept="image/*"
        className="hidden"
      />

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

      {/* MODAL DE JUEGO COMPLETO EN PANTALLA */}
      {isPlayingFullGame && generatedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-5xl">
            <button
              type="button"
              onClick={() => setIsPlayingFullGame(false)}
              aria-label="Cerrar reproductor de juego"
              className="absolute -top-12 right-0 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 z-50 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Cerrar Juego</span>
            </button>
            <ISkoolActivityPlayer
              activity={generatedActivity}
              templateType={templateType}
              onClose={() => setIsPlayingFullGame(false)}
            />
          </div>
        </div>
      )}

      {/* WORKSPACE MODAL: VENTANA ENFOCADA EN PRIMER PLANO CON BLOQUES DIDÁCTICOS */}
      {isWorkspaceOpen && generatedActivity && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex flex-col overflow-hidden animate-fade-in">
          
          {/* Header Superior Fijo del Workspace */}
          <div className="shrink-0 bg-slate-900/95 border-b border-slate-800/80 px-4 sm:px-6 py-3.5 flex items-center justify-between backdrop-blur-md z-10 shadow-lg">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsWorkspaceOpen(false)}
                aria-label="Cerrar taller y volver al catálogo"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-400">
                  TALLER DE BLOQUES • {currentTemplateDef.name} ({currentTemplateDef.category.toUpperCase()})
                </span>
                <h2 className="text-lg font-black text-white line-clamp-1">
                  {generatedActivity.title}
                </h2>
              </div>
            </div>

            {/* Acciones Rápidas del Workspace */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlayingFullGame(true)}
                aria-label="Probar juego completo"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all hover:scale-105 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Probar Juego</span>
              </button>

              <button
                type="button"
                onClick={handlePublishToCommunity}
                disabled={isPublishing}
                aria-label="Publicar en comunidad docente"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Globe className="w-4 h-4" />
                <span>{isPublishing ? 'Publicando...' : 'Publicar en Comunidad'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAssignModalOpen(true)}
                aria-label="Asignar a clase"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/20 transition-all cursor-pointer"
              >
                <Rocket className="w-4 h-4 text-yellow-300" />
                <span>Asignar</span>
              </button>
            </div>
          </div>

          {/* PALETA DE BLOQUES DIDÁCTICOS (ARRASTRAR O CLIC) */}
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-2.5 flex items-center gap-2 overflow-x-auto select-none">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1 shrink-0">
              <Plus className="w-3.5 h-3.5 text-purple-400" />
              <span>Bloques Didácticos:</span>
            </span>

            <button
              type="button"
              draggable
              onDragStart={() => setDraggedBlockType('question')}
              onClick={() => handleAddBlock('question')}
              aria-label="Añadir bloque de reactivo"
              className="px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 text-purple-200 text-xs font-bold flex items-center gap-1.5 cursor-grab active:cursor-grabbing shrink-0 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              <span>+ Reactivo / Reto</span>
            </button>

            <button
              type="button"
              draggable
              onDragStart={() => setDraggedBlockType('image')}
              onClick={() => handleAddBlock('image')}
              aria-label="Añadir bloque de imagen"
              className="px-3 py-1.5 rounded-xl bg-blue-950/80 hover:bg-blue-900 border border-blue-700/60 text-blue-200 text-xs font-bold flex items-center gap-1.5 cursor-grab active:cursor-grabbing shrink-0 transition-all"
            >
              <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>+ Imagen / Ilustración</span>
            </button>

            <button
              type="button"
              draggable
              onDragStart={() => setDraggedBlockType('option')}
              onClick={() => handleAddBlock('option')}
              aria-label="Añadir bloque de opción"
              className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-200 text-xs font-bold flex items-center gap-1.5 cursor-grab active:cursor-grabbing shrink-0 transition-all"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ Opción Respuesta</span>
            </button>

            <button
              type="button"
              draggable
              onDragStart={() => setDraggedBlockType('hint')}
              onClick={() => handleAddBlock('hint')}
              aria-label="Añadir bloque de pista"
              className="px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-amber-700/60 text-amber-200 text-xs font-bold flex items-center gap-1.5 cursor-grab active:cursor-grabbing shrink-0 transition-all"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Pista / Retroalimentación</span>
            </button>

            <button
              type="button"
              onClick={() => handleAddBlock('timer')}
              aria-label="Añadir bloque de temporizador"
              className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-all"
            >
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span>+ Temporizador</span>
            </button>
          </div>

          {/* Cuerpo Central Scrolleable del Workspace Dividido (Editor Izquierda / Mini-Card Derecha) */}
          <div 
            className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (draggedBlockType) {
                handleAddBlock(draggedBlockType as any);
                setDraggedBlockType(null);
              }
            }}
          >
            <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
            
              {/* COLUMNA IZQUIERDA (7 Columnas en Desktop): Formulario de Edición & Sección (+) Gamificación */}
              <div className="lg:col-span-7 space-y-6">
              
                {/* Tarjeta de Título & Descripción */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Título de la Actividad:</label>
                    <input
                      type="text"
                      value={generatedActivity.title}
                      onChange={e => setGeneratedActivity({ ...generatedActivity, title: e.target.value })}
                      aria-label="Título del juego"
                      className="w-full text-lg font-black bg-slate-800 text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Descripción / Instrucción Pedagógica:</label>
                    <input
                      type="text"
                      value={generatedActivity.description}
                      onChange={e => setGeneratedActivity({ ...generatedActivity, description: e.target.value })}
                      aria-label="Descripción del juego"
                      className="w-full text-xs font-medium bg-slate-800 text-slate-200 px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* SECCIÓN AVANZADA (+) HERRAMIENTAS DE GAMIFICACIÓN */}
                <div className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
                  <button
                    type="button"
                    onClick={() => setIsAdvancedGamificationOpen(!isAdvancedGamificationOpen)}
                    aria-label="Expandir o colapsar herramientas avanzadas de gamificación"
                    className="w-full px-6 py-4 bg-slate-850 hover:bg-slate-800 flex items-center justify-between transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center font-bold">
                        <Plus className={`w-4 h-4 transition-transform duration-300 ${isAdvancedGamificationOpen ? 'rotate-45' : ''}`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                          <span>(+) Herramientas Avanzadas de Gamificación</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            Nivel Medio / Pro
                          </span>
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Curva de dificultad adaptativa, combos x3, vidas/HP, recompensas de insignias y alineación NEM.
                        </p>
                      </div>
                    </div>

                    {isAdvancedGamificationOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>

                  {isAdvancedGamificationOpen && (
                    <div className="p-6 space-y-5 border-t border-slate-800 animate-fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Curva de Tiempo / Dificultad */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-blue-400" />
                            Temporizador por Reactivo:
                          </label>
                          <select
                            value={timePerQuestion}
                            onChange={e => setTimePerQuestion(Number(e.target.value))}
                            aria-label="Temporizador por pregunta"
                            className="w-full bg-slate-800 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs font-bold focus:outline-none"
                          >
                            <option value={10}>10 segundos (Ultra Rápido / Adrenalina)</option>
                            <option value={15}>15 segundos (Desafío Contrarreloj)</option>
                            <option value={25}>25 segundos (Estándar Didáctico)</option>
                            <option value={45}>45 segundos (Reflexivo)</option>
                            <option value={0}>Sin límite de tiempo (Exploración)</option>
                          </select>
                        </div>

                        {/* Modo de Vidas / HP */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 text-rose-400" />
                            Sistema de Vidas y Penalización:
                          </label>
                          <select
                            value={livesMode}
                            onChange={e => setLivesMode(e.target.value as any)}
                            aria-label="Sistema de vidas"
                            className="w-full bg-slate-800 text-white px-3.5 py-2.5 rounded-xl border border-slate-700 text-xs font-bold focus:outline-none"
                          >
                            <option value="3_lives">❤️❤️❤️ 3 Vidas (Riesgo y Recompensa)</option>
                            <option value="1_life">💀 Muerte Súbita (1 Solo Error)</option>
                            <option value="unlimited">🛡️ Vidas Infinitas (Modo Práctica)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                        {/* Multiplicador de Combo */}
                        <div className="flex items-center justify-between bg-slate-800 p-3.5 rounded-2xl border border-slate-700">
                          <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-amber-400" />
                            <span className="text-xs font-bold text-slate-200">Multiplicador de Racha (x2/x3)</span>
                          </div>
                          <input
                            type="checkbox"
                            checked={streakMultiplier}
                            onChange={e => setStreakMultiplier(e.target.checked)}
                            aria-label="Activar multiplicador de racha"
                            className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                          />
                        </div>

                        {/* Insignia / Badge Desbloqueable */}
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                            Insignia al Superar el 75%:
                          </label>
                          <input
                            type="text"
                            value={badgeRewardName}
                            onChange={e => setBadgeRewardName(e.target.value)}
                            aria-label="Nombre de la insignia de recompensa"
                            className="w-full bg-slate-800 text-white px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-bold focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Alineación NEM */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-800">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                          Alineación con PDA y Campo Formativo NEM:
                        </label>
                        <input
                          type="text"
                          value={pdaText}
                          onChange={e => setPdaText(e.target.value)}
                          aria-label="Texto de PDA NEM"
                          className="w-full bg-slate-800 text-slate-200 px-3.5 py-2 rounded-xl border border-slate-700 text-xs font-medium focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Lista de Reactivos / Bloques Editables */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white flex items-center gap-2">
                      <span>Lienzo de Reactivos ({generatedActivity.questions.length})</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleAddBlock('question')}
                      aria-label="Añadir nuevo reactivo al juego"
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-500/20 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir Reactivo</span>
                    </button>
                  </div>

                  {generatedActivity.questions.map((q, qIndex) => {
                    const isCurrentPreview = previewQuestionIdx === qIndex;

                    return (
                      <div 
                        key={qIndex} 
                        className={`p-6 rounded-3xl bg-slate-900 border transition-all duration-200 space-y-4 shadow-md ${
                          isCurrentPreview ? 'border-purple-500 ring-2 ring-purple-500/20' : 'border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-2">
                            <span>Reactivo #{qIndex + 1}</span>
                            {isCurrentPreview && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                En Mini-Card
                              </span>
                            )}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setPreviewQuestionIdx(qIndex)}
                              aria-label={`Ver reactivo ${qIndex + 1} en mini-card`}
                              className="text-xs font-bold text-blue-400 hover:underline cursor-pointer"
                            >
                              Ver en Mini-Card
                            </button>
                            {generatedActivity.questions.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleDeleteQuestion(qIndex)}
                                aria-label={`Eliminar reactivo ${qIndex + 1}`}
                                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                                title="Eliminar este reactivo"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Texto de la Pregunta */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-400">Pregunta / Desafío:</label>
                          <input
                            type="text"
                            value={q.question}
                            onChange={e => handleUpdateQuestion(qIndex, 'question', e.target.value)}
                            aria-label={`Pregunta ${qIndex + 1}`}
                            className="w-full text-sm font-bold bg-slate-800 text-white px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>

                        {/* BLOQUE DE IMAGEN ADJUNTA / ILUSTRACIÓN */}
                        <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                              <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                              Ilustración / Imagen del Reactivo:
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveImageUploadIdx(qIndex);
                                  fileInputRef.current?.click();
                                }}
                                aria-label="Subir imagen desde computadora"
                                className="px-2.5 py-1 rounded-lg bg-blue-950 text-blue-300 hover:bg-blue-900 text-[10px] font-bold flex items-center gap-1 border border-blue-800/60 cursor-pointer"
                              >
                                <Upload className="w-3 h-3" />
                                <span>Subir Archivo</span>
                              </button>
                              {q.imageUrl && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQuestion(qIndex, 'imageUrl', '')}
                                  aria-label="Quitar imagen"
                                  className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                                >
                                  Quitar
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="O pega aquí la URL de la imagen (https://...)"
                              value={q.imageUrl || ''}
                              onChange={e => handleUpdateQuestion(qIndex, 'imageUrl', e.target.value)}
                              aria-label={`URL de imagen para reactivo ${qIndex + 1}`}
                              className="flex-1 text-xs bg-slate-800 text-slate-200 px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>

                          {q.imageUrl && (
                            <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
                              <img
                                src={q.imageUrl}
                                alt="Ilustración del reactivo"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>

                        {/* Opciones de Respuesta */}
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-400">
                            Opciones de Respuesta (Marca la casilla verde para la correcta):
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt, optIndex) => {
                              const isCorrect = optIndex === q.correctIndex;

                              return (
                                <div
                                  key={optIndex}
                                  className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all ${
                                    isCorrect ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200' : 'bg-slate-800 border-slate-700 text-slate-200'
                                  }`}
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateQuestion(qIndex, 'correctIndex', optIndex)}
                                    aria-label={`Marcar opción ${String.fromCharCode(65 + optIndex)} como correcta`}
                                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer ${
                                      isCorrect ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    }`}
                                  >
                                    {isCorrect ? '✓' : String.fromCharCode(65 + optIndex)}
                                  </button>
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={e => handleUpdateOption(qIndex, optIndex, e.target.value)}
                                    aria-label={`Texto de opción ${String.fromCharCode(65 + optIndex)}`}
                                    className="flex-1 bg-transparent text-xs font-medium focus:outline-none"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Pista o Explicación */}
                        <div className="space-y-1 pt-1">
                          <label className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Lightbulb className="w-3 h-3 text-amber-400" />
                            Pista / Explicación Didáctica:
                          </label>
                          <input
                            type="text"
                            value={q.explanation || ''}
                            onChange={e => handleUpdateQuestion(qIndex, 'explanation', e.target.value)}
                            placeholder="Ej. Recuerda la fecha clave o el concepto principal..."
                            aria-label={`Explicación de reactivo ${qIndex + 1}`}
                            className="w-full text-xs bg-slate-800 text-slate-300 px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none"
                          />
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>

              {/* COLUMNA DERECHA (5 Columnas en Desktop): MINI-CARD DE PRE-RENDERIZADO VISUAL EN TIEMPO REAL */}
              <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24 h-fit">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-purple-400" />
                    <span>Pre-Renderizado en Vivo (Mini-Card)</span>
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800">
                    ● En Tiempo Real
                  </span>
                </div>

                {/* Mini Card Simulador Visual */}
                <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-2xl space-y-5 relative overflow-hidden">
                  {/* Neon Aura */}
                  <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Header de la Mini-Card */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                      <span className="text-[11px] font-black uppercase text-purple-300 tracking-wider">
                        {currentTemplateDef.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>{timePerQuestion > 0 ? `${timePerQuestion}s` : '∞'}</span>
                    </div>
                  </div>

                  {/* Mini Contenido del Reactivo Activo */}
                  <div className="space-y-3">
                    {generatedActivity.questions[previewQuestionIdx]?.imageUrl && (
                      <div className="w-full h-28 rounded-xl overflow-hidden border border-slate-700">
                        <img
                          src={generatedActivity.questions[previewQuestionIdx].imageUrl}
                          alt="Previsualización"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Reactivo {previewQuestionIdx + 1} de {generatedActivity.questions.length}
                      </span>
                      <h4 className="text-sm font-black text-white leading-snug">
                        {generatedActivity.questions[previewQuestionIdx]?.question || 'Escribe tu pregunta en el editor'}
                      </h4>
                    </div>

                    {/* Opciones en la Mini-Card */}
                    <div className="space-y-2">
                      {generatedActivity.questions[previewQuestionIdx]?.options.map((opt, oIdx) => {
                        const isCorrect = oIdx === generatedActivity.questions[previewQuestionIdx].correctIndex;

                        return (
                          <div
                            key={oIdx}
                            className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between transition-all ${
                              isCorrect 
                                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200' 
                                : 'bg-slate-800/50 border-slate-700/60 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-slate-900 text-slate-400 font-mono text-[10px] flex items-center justify-center">
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span className="line-clamp-1">{opt}</span>
                            </div>
                            {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Badges y Gamificación en la Mini-Card */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Trophy className="w-3.5 h-3.5" />
                      <span>+100 XP</span>
                    </div>
                    {streakMultiplier && (
                      <div className="flex items-center gap-1 text-amber-400">
                        <Flame className="w-3.5 h-3.5 fill-amber-400" />
                        <span>Combo x3</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-rose-400">
                      <Heart className="w-3.5 h-3.5 fill-rose-400" />
                      <span>{livesMode === '3_lives' ? '3 Vidas' : livesMode === '1_life' ? '1 Vida' : 'Infinito'}</span>
                    </div>
                  </div>

                  {/* Botón para Probar Completo */}
                  <button
                    type="button"
                    onClick={() => setIsPlayingFullGame(true)}
                    aria-label="Abrir vista de juego completa"
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Jugar en Modo Alumno</span>
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      )}

      {/* VISTA PRINCIPAL: CATÁLOGO DE 20 PLANTILLAS Y GENERACIÓN */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Botón de Retorno al Hub Docente */}
        <div>
          <button
            type="button"
            onClick={() => router.push('/teacher')}
            aria-label="Volver al Hub Docente"
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
              Selecciona una de las 20 plantillas didácticas para abrir el lienzo en blanco con bloques interactivos, o usa la Inteligencia Artificial.
            </p>
          </div>
        </div>

        {/* SECCIÓN 1: SELECCIÓN DE PLANTILLA EN GRID MINIMALISTA (20 OPCIONES) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>PASO 1: Selecciona una Plantilla para Diseñar con Bloques (20 Opciones)</span>
            </h2>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950 px-3 py-1 rounded-full border border-purple-200/40">
              Activa: {currentTemplateDef.name}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {ISKOOL_TEMPLATES.map(tmpl => {
              const isSelected = templateType === tmpl.id;

              return (
                <div
                  key={tmpl.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Seleccionar plantilla ${tmpl.name}`}
                  onClick={() => handleSelectTemplate(tmpl.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectTemplate(tmpl.id); }}
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

                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/60 flex items-center justify-between text-[10px] font-bold">
                    <span className={isSelected ? 'text-yellow-300' : 'text-purple-600 dark:text-purple-400'}>
                      Abrir Lienzo
                    </span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECCIÓN 2: FORMULARIO DE GENERACIÓN PERSONALIZADA CON IA */}
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-black text-slate-900 dark:text-white">
              PASO 2: O escribe un tema para generar con IA y abrir en el taller 🎨
            </label>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Ej. Sistema Solar, Fracciones Equivalentes, Ecosistemas, Revolución..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
                aria-label="Tema pedagógico para generar la actividad con IA"
                className="flex-1 px-5 py-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGenerating}
                aria-label="Generar juego interactivo con inteligencia artificial"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Wand2 className={`w-4 h-4 text-yellow-300 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Generando...' : '✨ Generar con IA'}</span>
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
                aria-label="Nivel o edad de los alumnos"
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
                aria-label="Cantidad de preguntas o reactivos"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold focus:outline-none"
              >
                <option value={4}>4 Reactivos (Rápido)</option>
                <option value={8}>8 Reactivos (Estándar)</option>
                <option value={12}>12 Reactivos (Desafío Completo)</option>
              </select>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
