"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { CommunityActivity, CanvasActivityJSON } from '@/types';
import { CanvasTriviaPlayer } from './CanvasTriviaPlayer';
import { AssignToClassModal } from './AssignToClassModal';
import { 
  Heart, 
  Sparkles, 
  Globe, 
  Play, 
  Copy, 
  RefreshCw, 
  CheckCircle2, 
  BrainCircuit, 
  User, 
  Search,
  MessageSquare,
  Award,
  Rocket
} from 'lucide-react';

export const TeacherCommunityView: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<CommunityActivity[]>([]);
  const [votedActivityIds, setVotedActivityIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<CommunityActivity | null>(null);
  const [assigningActivity, setAssigningActivity] = useState<CommunityActivity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const teacherId = user?.id || 'usr-teacher-1';

  // Cargar actividades comunitarias y votos del profesor
  const fetchCommunityData = async () => {
    setIsLoading(true);
    try {
      // 1. Obtener actividades ordenadas por votos
      const { data: activitiesData, error: actError } = await supabase
        .from('community_activities')
        .select('*')
        .order('upvotes', { ascending: false });

      if (actError) {
        console.warn('Supabase fetch error, usando mock data:', actError);
        setActivities(getMockCommunityActivities());
      } else if (activitiesData && activitiesData.length > 0) {
        setActivities(activitiesData as CommunityActivity[]);
      } else {
        // Si la tabla está vacía en producción, inyectar plantillas de ejemplo
        setActivities(getMockCommunityActivities());
      }

      // 2. Obtener votos emitidos por el profesor actual
      if (teacherId) {
        const { data: votesData } = await supabase
          .from('activity_votes')
          .select('activity_id')
          .eq('voter_teacher_id', teacherId);

        if (votesData) {
          const ids = new Set(votesData.map(v => v.activity_id));
          setVotedActivityIds(ids);
        }
      }
    } catch (err) {
      console.error('Error cargando comunidad:', err);
      setActivities(getMockCommunityActivities());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityData();
  }, [teacherId]);

  // Manejador del Voto Antifraude
  const handleVote = async (activity: CommunityActivity) => {
    if (votedActivityIds.has(activity.id)) return;

    // Actualización optimista local
    setVotedActivityIds(prev => new Set(prev).add(activity.id));
    setActivities(prev =>
      prev.map(act => act.id === activity.id ? { ...act, upvotes: act.upvotes + 1 } : act)
    );

    try {
      const { error } = await supabase
        .from('activity_votes')
        .insert({
          activity_id: activity.id,
          voter_teacher_id: teacherId
        });

      if (error) {
        // Código 23505: Violación de llave primaria (Ya votó previamente)
        if (error.code === '23505') {
          showToast('Ya habías emitido tu voto en esta actividad.');
        } else {
          console.error('Error insertando voto:', error);
        }
      } else {
        showToast('❤️ ¡Voto registrado con éxito!');
      }
    } catch (err) {
      console.error('Error en votación:', err);
    }
  };

  // Clonar actividad
  const handleCloneActivity = (activity: CommunityActivity) => {
    showToast(`✨ ¡Plantilla "${activity.title}" clonada a tu estudio!`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtrado
  const filteredActivities = activities.filter(act => 
    act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    act.template_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full space-y-8 animate-fade-in">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 font-bold text-sm flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header del Explorador de la Comunidad */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-200/40">
            <Globe className="w-3.5 h-3.5" />
            <span>Red Global de Maestros ISkool</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Comunidad Docente
          </h1>
          <p className="text-sm font-medium text-slate-600 dark:text-zinc-400">
            Explora juegos creados por otros profesores, apóyalos con tu voto y clónalos a tus grupos.
          </p>
        </div>

        {/* Buscador & Reload */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar actividad..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={fetchCommunityData}
            disabled={isLoading}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 transition-all shadow-sm disabled:opacity-50"
            title="Actualizar comunidad"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Modal Reproductor Visual */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl">
            <CanvasTriviaPlayer
              activity={selectedActivity.content_json}
              onClose={() => setSelectedActivity(null)}
            />
          </div>
        </div>
      )}

      {/* Modal Asignación Rápida a Clase (1 Clic) */}
      <AssignToClassModal
        activity={assigningActivity}
        isOpen={!!assigningActivity}
        onClose={() => setAssigningActivity(null)}
        onSuccess={(groupName) => {
          showToast(`🚀 ¡Juego asignado con éxito a ${groupName}!`);
        }}
      />

      {/* Grilla de Tarjetas de la Comunidad */}
      {isLoading ? (
        <div className="py-16 text-center space-y-3">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm font-bold text-slate-500 dark:text-zinc-400">Cargando la red docente...</p>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 space-y-3">
          <Globe className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-base font-bold text-slate-700 dark:text-zinc-300">No se encontraron actividades en la comunidad.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map(activity => {
            const hasVoted = votedActivityIds.has(activity.id);

            return (
              <div
                key={activity.id}
                className="group bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Tipo de Plantilla & Votos */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300 border border-purple-200/40 uppercase tracking-wider">
                      🎮 {activity.template_type || 'Trivia IA'}
                    </span>

                    {/* Botón Votar Antifraude */}
                    <button
                      onClick={() => handleVote(activity)}
                      disabled={hasVoted}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                        hasVoted
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/40 cursor-default'
                          : 'bg-slate-100 dark:bg-zinc-800 hover:bg-rose-500 hover:text-white text-slate-700 dark:text-zinc-300 border border-slate-200/50 dark:border-zinc-700/50'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasVoted ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{activity.upvotes}</span>
                      <span className="text-[10px] opacity-75">{hasVoted ? '(Votado)' : 'Votar'}</span>
                    </button>
                  </div>

                  {/* Título & Descripción */}
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {activity.title}
                    </h3>

                    {/* Badge de Autoría Docente */}
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-800/80 px-2.5 py-1 rounded-xl border border-slate-200/60 dark:border-zinc-700/60 w-fit my-1">
                      <User className="w-3.5 h-3.5 text-blue-500" />
                      <span>Autor: Prof. {activity.teacher_name || 'Elena Rostova'}</span>
                    </div>

                    <p className="text-xs font-normal text-slate-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                      {activity.content_json?.description || 'Actividad interactiva optimizada para el aprendizaje colaborativo.'}
                    </p>
                  </div>

                  {/* Preguntas badge */}
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-zinc-400 pt-1">
                    <BrainCircuit className="w-3.5 h-3.5 text-purple-500" />
                    <span>{activity.content_json?.questions?.length || 0} Preguntas Interactivas</span>
                  </div>
                </div>

                {/* Acciones principales: Jugar / Previsualizar & Asignar a Clase en 1 Clic */}
                <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedActivity(activity)}
                    className="flex-1 py-2.5 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Previsualizar</span>
                  </button>

                  <button
                    onClick={() => setAssigningActivity(activity)}
                    className="py-2.5 px-3.5 rounded-2xl bg-purple-100 dark:bg-purple-950/80 hover:bg-purple-600 hover:text-white text-purple-700 dark:text-purple-300 font-bold text-xs transition-all flex items-center gap-1.5 border border-purple-200/50 dark:border-purple-800/50 shadow-sm cursor-pointer"
                    title="Asignar este juego a mis alumnos en 1 clic"
                  >
                    <Rocket className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 group-hover:text-white" />
                    <span>Asignar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

// Plantillas de ejemplo por defecto para previsualizar si la BD aún no tiene registros
function getMockCommunityActivities(): CommunityActivity[] {
  return [
    {
      id: 'act-mock-1',
      teacher_id: 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a55',
      title: 'Desafío del Biodigestor Anaeróbico',
      template_type: 'trivia',
      upvotes: 24,
      created_at: new Date().toISOString(),
      content_json: {
        title: 'Desafío del Biodigestor Anaeróbico',
        description: 'Demuestra tus conocimientos sobre ecotecnias, descomposición de materia orgánica y generación de biogás para la comunidad.',
        questions: [
          {
            question: '¿Qué tipo de bacterias intervienen en la producción de biogás en ausencia de oxígeno?',
            options: ['Bacterias Anaeróbicas', 'Bacterias Aeróbicas', 'Hongos Filamentosos', 'Virus Sintéticos'],
            correctIndex: 0
          },
          {
            question: '¿Cuál es el gas principal resultante del proceso de digestión anaeróbica?',
            options: ['Dióxido de Carbono', 'Gas Metano (CH4)', 'Oxígeno Puro', 'Nitrógeno Líquido'],
            correctIndex: 1
          },
          {
            question: '¿Cuál es el uso principal del subproducto líquido conocido como biol?',
            options: ['Refrigerante industrial', 'Fertilizante orgánico foliar', 'Combustible de motores', 'Detergente ecológico'],
            correctIndex: 1
          }
        ]
      }
    },
    {
      id: 'act-mock-2',
      teacher_id: 'usr-teacher-2',
      title: 'La Pizza de Fracciones Equivalentes',
      template_type: 'memorama',
      upvotes: 18,
      created_at: new Date().toISOString(),
      content_json: {
        title: 'La Pizza de Fracciones Equivalentes',
        description: 'Resuelve problemas prácticos dividiendo pizzas y descubriendo fracciones equivalentes.',
        questions: [
          {
            question: 'Si dividimos una pizza en 8 rebanadas y comemos 4, ¿qué fracción equivalente representa?',
            options: ['1/4 de la pizza', '1/2 de la pizza', '3/4 de la pizza', '2/3 de la pizza'],
            correctIndex: 1
          },
          {
            question: '¿Cuál de las siguientes fracciones es equivalente a 2/4?',
            options: ['4/8', '3/5', '1/3', '5/6'],
            correctIndex: 0
          }
        ]
      }
    },
    {
      id: 'act-mock-3',
      teacher_id: 'usr-teacher-3',
      title: 'Leyendas y Relatos Regionales de México',
      template_type: 'trivia',
      upvotes: 12,
      created_at: new Date().toISOString(),
      content_json: {
        title: 'Leyendas y Relatos Regionales de México',
        description: 'Explora la riqueza poética y narrativa de las leyendas tradicionales mexicanas.',
        questions: [
          {
            question: '¿Qué elemento caracteriza a una leyenda frente a un mito tradicional?',
            options: ['Está basada únicamente en hechos científicos', 'Combina hechos históricos reales con elementos fantásticos', 'Es escrita en lenguaje de código informático', 'No tiene autores ni tradición oral'],
            correctIndex: 1
          }
        ]
      }
    }
  ];
}
