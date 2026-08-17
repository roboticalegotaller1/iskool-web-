"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StudioBlock, ActivityBuilderMetadata, FlowConnection } from '@/types/studioBlocks';
import { 
  Sparkles, 
  Trophy, 
  Coins, 
  Flame, 
  Heart, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  BookOpen, 
  Swords, 
  Video, 
  Globe, 
  Gamepad2, 
  Gift, 
  ExternalLink, 
  Play, 
  RotateCcw,
  Shield,
  Zap,
  Check,
  Link2,
  ListOrdered,
  FileEdit,
  MessageSquare,
  KeyRound,
  ShieldCheck,
  Award,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  Star,
  GitBranch,
  Music,
  Flag
} from 'lucide-react';

interface Props {
  blocks: StudioBlock[];
  connections?: FlowConnection[];
  startNodeId?: string | null;
  metadata: ActivityBuilderMetadata;
  onClose?: () => void;
  onComplete?: (score: number) => void;
}

// Extraer ID y tiempo de inicio de YouTube de forma robusta
export function getYouTubeEmbedUrl(url: string, startAtSeconds?: number): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (!match || match[2].length !== 11) return null;
  const videoId = match[2];

  let start = startAtSeconds || 0;
  const tMatch = url.match(/[?&]t=(\d+)s?/);
  if (tMatch && tMatch[1]) {
    start = parseInt(tMatch[1], 10);
  }

  const queryParams = new URLSearchParams();
  queryParams.set('rel', '0');
  queryParams.set('modestbranding', '1');
  if (start > 0) {
    queryParams.set('start', String(start));
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?${queryParams.toString()}`;
}

export const StudioFlowPlayer: React.FC<Props> = ({
  blocks,
  connections = [],
  startNodeId,
  metadata,
  onClose,
  onComplete
}) => {
  // Determinar nodo inicial del grafo
  const initialNodeId = startNodeId || blocks.find(b => b.isStartNode)?.id || blocks[0]?.id || null;
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(initialNodeId);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [accumulatedXp, setAccumulatedXp] = useState(0);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(3);
  const [isFinished, setIsFinished] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Estados de Pregunta (Quiz)
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);

  // Estados de Combate contra Boss
  const [bossHp, setBossHp] = useState(100);
  const [bossMaxHp, setBossMaxHp] = useState(100);
  const [isBossDefeated, setIsBossDefeated] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);

  // Estados de Recompensa
  const [isChestOpened, setIsChestOpened] = useState(false);

  // Estados de Emparejamiento (Drag & Drop Match)
  const [selectedLeftIndex, setSelectedLeftIndex] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<number, number>>({});

  // Estados de Ordenamiento (Secuencia Cronológica)
  const [orderedList, setOrderedList] = useState<string[]>([]);
  const [isSequenceChecked, setIsSequenceChecked] = useState(false);
  const [isSequenceCorrect, setIsSequenceCorrect] = useState(false);

  // Estados de Completar Espacios
  const [userFilledWords, setUserFilledWords] = useState<string[]>([]);

  // Estados de Pregunta Abierta IA
  const [openAnswerText, setOpenAnswerText] = useState('');
  const [isAiEvaluating, setIsAiEvaluating] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  // Estados de Código Secreto / Escape Room
  const [secretCodeInput, setSecretCodeInput] = useState('');
  const [isSecretUnlocked, setIsSecretUnlocked] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Estados de Checkpoint
  const [confidenceRating, setConfidenceRating] = useState<number>(5);

  // Estados de Minijuego Ruleta
  const [spinning, setSpinning] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<string | null>(null);

  const activeBlock: StudioBlock | undefined = 
    (currentNodeId ? blocks.find(b => b.id === currentNodeId) : undefined) || 
    blocks[currentStepIndex] || 
    blocks[0];

  // Sintetizador Web Audio
  const playSound = (type: 'correct' | 'wrong' | 'victory' | 'attack' | 'chest' | 'match' | 'fanfare') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'correct' || type === 'match') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'wrong') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.25);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'attack') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'chest' || type === 'victory' || type === 'fanfare') {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
          const oscN = ctx.createOscillator();
          const gainN = ctx.createGain();
          oscN.connect(gainN);
          gainN.connect(ctx.destination);
          oscN.frequency.setValueAtTime(freq, now + i * 0.1);
          gainN.gain.setValueAtTime(0.1, now + i * 0.1);
          gainN.gain.linearRampToValueAtTime(0.01, now + i * 0.1 + 0.15);
          oscN.start(now + i * 0.1);
          oscN.stop(now + i * 0.1 + 0.15);
        });
      }
    } catch (e) {
      console.warn('Web Audio error:', e);
    }
  };

  // Inicializar estado al cambiar de bloque
  useEffect(() => {
    setSelectedOption(null);
    setIsQuestionAnswered(false);
    setIsChestOpened(false);
    setSelectedLeftIndex(null);
    setMatchedPairs({});
    setIsSequenceChecked(false);
    setIsSequenceCorrect(false);
    setUserFilledWords([]);
    setOpenAnswerText('');
    setIsAiEvaluating(false);
    setAiFeedback(null);
    setSecretCodeInput('');
    setIsSecretUnlocked(false);
    setShowHint(false);
    setSelectedPrize(null);

    if (activeBlock) {
      if (activeBlock.type === 'boss_enemy') {
        const max = activeBlock.data.maxHp || 100;
        setBossHp(max);
        setBossMaxHp(max);
        setIsBossDefeated(false);
        setBattleLog([`⚔️ ¡Un ${activeBlock.data.bossName} ha aparecido para desafiarte!`]);
      } else if (activeBlock.type === 'ordering_sequence') {
        const shuffled = [...activeBlock.data.stepsInCorrectOrder].sort(() => Math.random() - 0.5);
        setOrderedList(shuffled);
      } else if (activeBlock.type === 'audio_sfx') {
        playSound('fanfare');
      }
    }
  }, [currentNodeId, currentStepIndex, activeBlock]);

  // Avanzar al siguiente bloque siguiendo el flujo del grafo
  const handleNextStep = (earnedXp: number = 0) => {
    const totalXp = accumulatedXp + earnedXp;
    setAccumulatedXp(totalXp);

    // Si existen conexiones en el grafo, seguir la flecha correspondiente
    if (connections.length > 0 && activeBlock) {
      const outgoing = connections.filter(c => c.sourceNodeId === activeBlock.id);

      if (outgoing.length > 0) {
        // Enlazar al nodo objetivo de la flecha
        const nextNodeId = outgoing[0].targetNodeId;
        setCurrentNodeId(nextNodeId);
        setCurrentStepIndex(prev => prev + 1);
        return;
      } else {
        // No tiene conexión saliente: es un nodo final del juego
        setIsFinished(true);
        playSound('victory');
        if (onComplete) onComplete(totalXp);
        return;
      }
    }

    // Fallback para recorrido lineal
    if (currentStepIndex + 1 < blocks.length) {
      const nextBlock = blocks[currentStepIndex + 1];
      setCurrentNodeId(nextBlock.id);
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      playSound('victory');
      if (onComplete) onComplete(totalXp);
    }
  };

  // Manejar respuesta de pregunta
  const handleAnswerQuestion = (index: number) => {
    if (isQuestionAnswered || !activeBlock || activeBlock.type !== 'quiz_question') return;
    setSelectedOption(index);
    setIsQuestionAnswered(true);

    const isCorrect = index === activeBlock.data.correctIndex;
    if (isCorrect) {
      playSound('correct');
      setStreak(prev => prev + 1);
      setAccumulatedXp(prev => prev + 30 + (streak > 0 ? 15 : 0));
    } else {
      playSound('wrong');
      setStreak(0);
      setLives(prev => Math.max(0, prev - 1));
    }
  };

  // Manejar emparejamiento (Drag & Drop Match)
  const handleMatchClick = (side: 'left' | 'right', index: number) => {
    if (!activeBlock || activeBlock.type !== 'drag_drop_match') return;

    if (side === 'left') {
      setSelectedLeftIndex(index);
    } else if (side === 'right' && selectedLeftIndex !== null) {
      const isCorrectMatch = selectedLeftIndex === index;
      if (isCorrectMatch) {
        playSound('match');
        const newMatched = { ...matchedPairs, [selectedLeftIndex]: index };
        setMatchedPairs(newMatched);
        setSelectedLeftIndex(null);
        setAccumulatedXp(prev => prev + 15);
      } else {
        playSound('wrong');
        setSelectedLeftIndex(null);
      }
    }
  };

  // Manejar ordenamiento de secuencia
  const handleMoveSequenceItem = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= orderedList.length) return;
    const updated = [...orderedList];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setOrderedList(updated);
  };

  const handleVerifySequence = () => {
    if (!activeBlock || activeBlock.type !== 'ordering_sequence') return;
    const isExact = orderedList.every((item, idx) => item === activeBlock.data.stepsInCorrectOrder[idx]);
    setIsSequenceChecked(true);
    setIsSequenceCorrect(isExact);
    if (isExact) {
      playSound('correct');
      setAccumulatedXp(prev => prev + 35);
    } else {
      playSound('wrong');
      setLives(prev => Math.max(0, prev - 1));
    }
  };

  // Manejar análisis reflexivo de IA
  const handleEvaluateAiReflection = () => {
    if (!openAnswerText.trim() || !activeBlock || activeBlock.type !== 'open_poll_wordcloud') return;
    setIsAiEvaluating(true);
    setTimeout(() => {
      setIsAiEvaluating(false);
      playSound('correct');
      setAiFeedback(
        `🌟 ¡Excelente reflexión pedagógica! Has articulado de forma clara la importancia de las fuerzas y el movimiento en el entorno cotidiano.`
      );
      setAccumulatedXp(prev => prev + 40);
    }, 1000);
  };

  // Manejar desbloqueo de código secreto
  const handleVerifySecretCode = () => {
    if (!activeBlock || activeBlock.type !== 'secret_code_puzzle') return;
    const cleanInput = secretCodeInput.trim().toUpperCase();
    const cleanAnswer = activeBlock.data.secretAnswer.trim().toUpperCase();

    if (cleanInput === cleanAnswer) {
      playSound('victory');
      setIsSecretUnlocked(true);
      setAccumulatedXp(prev => prev + 50);
      setCoins(prev => prev + 20);
    } else {
      playSound('wrong');
      setLives(prev => Math.max(0, prev - 1));
    }
  };

  // Manejar ataque al Boss
  const handleAttackBoss = (attackType: 'crit' | 'magic' | 'potion') => {
    if (isBossDefeated || !activeBlock || activeBlock.type !== 'boss_enemy') return;

    playSound('attack');
    let damage = 35;
    let logMsg = '';

    if (attackType === 'crit') {
      damage = Math.floor(Math.random() * 20) + 35;
      logMsg = `💥 ¡Ataque Crítico de Sabiduría! Causaste ${damage} de daño.`;
    } else if (attackType === 'magic') {
      damage = 45;
      logMsg = `✨ ¡Hechizo Didáctico! Impacto directo de ${damage} puntos de daño.`;
    } else {
      damage = 25;
      setLives(prev => Math.min(3, prev + 1));
      logMsg = `🧪 ¡Poción de Enfoque! Curaste 1 vida y causaste ${damage} de daño.`;
    }

    const nextHp = Math.max(0, bossHp - damage);
    setBossHp(nextHp);
    setBattleLog(prev => [logMsg, ...prev.slice(0, 3)]);

    if (nextHp <= 0) {
      setIsBossDefeated(true);
      playSound('victory');
      setBattleLog(prev => [`🏆 ¡Has derrotado al ${activeBlock.data.bossName}!`, ...prev]);
    }
  };

  // Si no hay bloques
  if (!blocks || blocks.length === 0) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-black text-slate-800 dark:text-zinc-200">
          No hay bloques para reproducir
        </h3>
        <p className="text-xs text-slate-500">
          Añade al menos un bloque didáctico al espacio de trabajo antes de probar.
        </p>
      </div>
    );
  }

  // Pantalla de Victoria / Finalización
  if (isFinished) {
    return (
      <div className="p-6 sm:p-10 text-center space-y-6 animate-scale-in">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/25 animate-bounce">
          <Trophy className="w-10 h-10" />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300">
            ¡MISIÓN LMS COMPLETADA CON ÉXITO!
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {metadata.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto">
            Has experimentado las mecánicas pedagógicas e interactivas tal como las vivirán tus alumnos.
          </p>
        </div>

        {/* Resumen de Recompensas */}
        <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto p-4 rounded-2xl bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-750">
          <div className="text-center">
            <span className="text-xs font-black text-purple-600 dark:text-purple-400">
              +{accumulatedXp}
            </span>
            <p className="text-[9px] font-bold uppercase text-slate-400">XP Ganada</p>
          </div>
          <div className="text-center">
            <span className="text-xs font-black text-amber-500">
              +{coins}
            </span>
            <p className="text-[9px] font-bold uppercase text-slate-400">Monedas</p>
          </div>
          <div className="text-center">
            <span className="text-xs font-black text-rose-500">
              {lives}/3
            </span>
            <p className="text-[9px] font-bold uppercase text-slate-400">Vidas</p>
          </div>
        </div>

        <div className="flex justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              setCurrentStepIndex(0);
              setAccumulatedXp(0);
              setCoins(0);
              setStreak(0);
              setLives(3);
              setIsFinished(false);
            }}
            className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 text-slate-700 dark:text-zinc-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Repetir Misión</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 text-white font-black text-xs shadow-lg shadow-purple-500/25 flex items-center gap-1.5 transition-all transform active:scale-95 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Finalizar y Volver al Estudio</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentStepIndex) / blocks.length) * 100);

  return (
    <div className="space-y-5 select-none">
      {/* Barra Superior del Simulador: Progreso + XP + Vidas */}
      <div className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-750">
        {/* Progreso */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 shrink-0">
            Paso {currentStepIndex + 1}/{blocks.length}
          </span>
          <div className="w-full bg-slate-200 dark:bg-zinc-700 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${Math.max(10, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* Métricas en Vivo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-black text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+{accumulatedXp} XP</span>
          </div>

          <div className="flex items-center gap-0.5">
            {[...Array(3)].map((_, i) => (
              <Heart 
                key={i} 
                className={`w-3.5 h-3.5 ${i < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-300 dark:text-zinc-600'}`} 
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Renderizado Polimórfico del Bloque Activo */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeBlock?.id || currentStepIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* ================= 1. VIDEO DE YOUTUBE ================= */}
          {activeBlock?.type === 'youtube_video' && (() => {
            const embedUrl = getYouTubeEmbedUrl(activeBlock.data.videoUrl, activeBlock.data.startAtSeconds);
            return (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-red-600 dark:text-red-400">
                      Cápsula Audiovisual
                    </span>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {activeBlock.data.videoTitle || activeBlock.title}
                    </h3>
                  </div>
                </div>

                {embedUrl ? (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-750 bg-black shadow-lg">
                    <iframe
                      src={embedUrl}
                      title={activeBlock.data.videoTitle || 'Video Educativo'}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-100 dark:bg-zinc-800 rounded-2xl border border-dashed border-slate-300 dark:border-zinc-700">
                    <p className="text-xs text-slate-500">Ingresa un enlace de YouTube válido en el editor para reproducirlo.</p>
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => handleNextStep(25)}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 text-white font-black text-xs shadow-md shadow-red-500/20 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
                  >
                    <span>Completar Video y Continuar (+25 XP)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })()}

          {/* ================= 2. SIMULADOR / RECURSO WEB ================= */}
          {activeBlock?.type === 'external_embed' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-cyan-600 dark:text-cyan-400">
                      Laboratorio / Simulador Interactivo
                    </span>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {activeBlock.data.resourceTitle || activeBlock.title}
                    </h3>
                  </div>
                </div>

                {activeBlock.data.embedUrl && (
                  <a
                    href={activeBlock.data.embedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-slate-200 text-xs font-bold flex items-center gap-1"
                    title="Abrir en pestaña nueva"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Pestaña Externa</span>
                  </a>
                )}
              </div>

              {activeBlock.data.instructions && (
                <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 text-xs text-cyan-800 dark:text-cyan-200 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                  <span>{activeBlock.data.instructions}</span>
                </div>
              )}

              {activeBlock.data.embedUrl ? (
                <div className="relative w-full h-[400px] sm:h-[460px] rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-750 bg-white dark:bg-zinc-950 shadow-md">
                  <iframe
                    src={activeBlock.data.embedUrl}
                    title={activeBlock.data.resourceTitle || 'Simulador Web'}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  />
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-100 dark:bg-zinc-800 rounded-2xl border border-dashed border-slate-300 dark:border-zinc-700">
                  <p className="text-xs text-slate-500">Ingresa la URL del simulador PhET / GeoGebra en el editor para interactuar.</p>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleNextStep(30)}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 text-white font-black text-xs shadow-md shadow-cyan-500/20 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
                >
                  <span>Completar Simulación y Continuar (+30 XP)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= 3. EMPAREJAMIENTO (DRAG & DROP MATCH) ================= */}
          {activeBlock?.type === 'drag_drop_match' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                  Mecánica de Emparejamiento
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {activeBlock.data.instructions}
                </h3>
                <p className="text-xs text-slate-500">
                  Haz clic en un término de la izquierda y luego en su definición correspondiente a la derecha.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase">Conceptos</h4>
                  {activeBlock.data.pairs.map((pair, idx) => {
                    const isMatched = matchedPairs[idx] !== undefined;
                    const isSelected = selectedLeftIndex === idx;

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isMatched}
                        onClick={() => handleMatchClick('left', idx)}
                        className={`w-full p-3 rounded-2xl border text-left font-bold text-xs transition-all cursor-pointer ${
                          isMatched 
                            ? 'bg-emerald-500 text-white border-emerald-600 line-through opacity-80' 
                            : isSelected
                            ? 'bg-violet-600 text-white border-violet-700 shadow-md shadow-violet-500/25 scale-[1.02]'
                            : 'bg-white dark:bg-zinc-850 border-slate-200 dark:border-zinc-750 text-slate-800 dark:text-zinc-200 hover:border-violet-400'
                        }`}
                      >
                        {pair.left}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  <h4 className="text-[11px] font-black text-slate-400 uppercase">Definiciones</h4>
                  {activeBlock.data.pairs.map((pair, idx) => {
                    const isMatched = Object.values(matchedPairs).includes(idx);

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={isMatched}
                        onClick={() => handleMatchClick('right', idx)}
                        className={`w-full p-3 rounded-2xl border text-left font-medium text-xs transition-all cursor-pointer ${
                          isMatched
                            ? 'bg-emerald-500 text-white border-emerald-600 line-through opacity-80'
                            : 'bg-white dark:bg-zinc-850 border-slate-200 dark:border-zinc-750 text-slate-800 dark:text-zinc-200 hover:border-violet-400'
                        }`}
                      >
                        {pair.right}
                      </button>
                    );
                  })}
                </div>
              </div>

              {Object.keys(matchedPairs).length === activeBlock.data.pairs.length && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => handleNextStep(35)}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 text-white font-black text-xs shadow-md shadow-violet-500/20 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
                  >
                    <span>¡Todos Conectados! Continuar (+35 XP)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= 4. ORDENAR SECUENCIA / CRONOLOGÍA ================= */}
          {activeBlock?.type === 'ordering_sequence' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  Mecánica de Secuencia
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {activeBlock.data.instructions}
                </h3>
                <p className="text-xs text-slate-500">
                  Usa las flechas para mover los elementos al orden cronológico o procedimental correcto:
                </p>
              </div>

              <div className="space-y-2 pt-1">
                {orderedList.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3 rounded-2xl bg-white dark:bg-zinc-850 border border-slate-200 dark:border-zinc-750 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-black flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">{item}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveSequenceItem(idx, idx - 1)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === orderedList.length - 1}
                        onClick={() => handleMoveSequenceItem(idx, idx + 1)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-500 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {!isSequenceChecked ? (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleVerifySequence}
                    className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
                  >
                    <span>Comprobar Orden Secuencial</span>
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-2 animate-fade-in">
                  <div className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                    isSequenceCorrect 
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border border-emerald-300'
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border border-rose-300'
                  }`}>
                    {isSequenceCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span>{isSequenceCorrect ? '¡Secuencia ordenada a la perfección!' : 'El orden no es correcto, revisa la cronología de nuevo.'}</span>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleNextStep(isSequenceCorrect ? 35 : 10)}
                      className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <span>Siguiente Etapa</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 5. COMPLETAR ESPACIOS (FILL IN BLANKS) ================= */}
          {activeBlock?.type === 'fill_in_blanks' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">
                  Completar Espacios
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {activeBlock.data.instructions}
                </h3>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 text-xs sm:text-sm text-slate-800 dark:text-zinc-200 leading-relaxed">
                {activeBlock.data.textWithBlanks.replace(/\[(.*?)\]/g, '_____')}
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="text-[11px] font-black text-slate-400 uppercase">Banco de Palabras Didáctico:</h4>
                <div className="flex flex-wrap gap-2">
                  {activeBlock.data.wordBank.map((word, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        playSound('match');
                        setUserFilledWords(prev => [...prev, word]);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-850 border border-slate-200 dark:border-zinc-750 text-xs font-bold text-teal-700 dark:text-teal-300 hover:bg-teal-500 hover:text-white transition-all cursor-pointer"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleNextStep(25)}
                  className="px-6 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs shadow-md shadow-teal-500/20 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
                >
                  <span>Validar Enunciado y Continuar (+25 XP)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= 6. PREGUNTA ABIERTA & REFLEXIÓN IA ================= */}
          {activeBlock?.type === 'open_poll_wordcloud' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-950 text-fuchsia-700 dark:text-fuchsia-300">
                  Reflexión & Evaluación Formativa IA
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {activeBlock.data.prompt}
                </h3>
              </div>

              <textarea
                rows={3}
                value={openAnswerText}
                onChange={(e) => setOpenAnswerText(e.target.value)}
                placeholder="Escribe tu argumento pedagógico aquí..."
                className="w-full p-3 rounded-2xl text-xs bg-white dark:bg-zinc-850 border border-slate-200 dark:border-zinc-750 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              />

              {!aiFeedback ? (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    disabled={openAnswerText.length < 5 || isAiEvaluating}
                    onClick={handleEvaluateAiReflection}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 text-white font-black text-xs shadow-md shadow-fuchsia-500/20 flex items-center gap-2 disabled:opacity-50 transition-all cursor-pointer"
                  >
                    {isAiEvaluating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>{isAiEvaluating ? 'Analizando con IA...' : 'Enviar y Recibir Feedback IA (+40 XP)'}</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-1 animate-scale-in">
                  <div className="p-3.5 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-950/40 border border-fuchsia-200 text-xs text-fuchsia-900 dark:text-fuchsia-200">
                    <p className="font-bold">{aiFeedback}</p>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleNextStep(40)}
                      className="px-6 py-2.5 rounded-2xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-black text-xs shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <span>Continuar al Siguiente Paso</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= 7. MISTERIO & CÓDIGO SECRETO (ESCAPE ROOM) ================= */}
          {activeBlock?.type === 'secret_code_puzzle' && (
            <div className="space-y-4">
              <div className="p-5 rounded-3xl bg-gradient-to-b from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border border-amber-200 dark:border-amber-800/60 space-y-3 text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-md">
                  {isSecretUnlocked ? <Unlock className="w-6 h-6 text-white" /> : <Lock className="w-6 h-6 text-white" />}
                </div>

                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {activeBlock.data.clueText}
                </h3>

                {!isSecretUnlocked ? (
                  <div className="space-y-3 max-w-xs mx-auto">
                    <input
                      type="text"
                      value={secretCodeInput}
                      onChange={(e) => setSecretCodeInput(e.target.value.toUpperCase())}
                      placeholder="CÓDIGO SECRETO"
                      className="w-full px-4 py-2.5 rounded-xl text-center text-sm font-black tracking-widest bg-white dark:bg-zinc-900 border-2 border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-amber-700 dark:text-amber-300"
                    />

                    {showHint && activeBlock.data.hintText && (
                      <p className="text-xs text-amber-800 dark:text-amber-200 font-bold bg-amber-100/80 dark:bg-amber-900/40 p-2 rounded-xl">
                        💡 {activeBlock.data.hintText}
                      </p>
                    )}

                    <div className="flex items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleVerifySecretCode}
                        className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md cursor-pointer"
                      >
                        Abrir Candado
                      </button>
                      {activeBlock.data.hintText && !showHint && (
                        <button
                          type="button"
                          onClick={() => setShowHint(true)}
                          className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-xs cursor-pointer"
                        >
                          Ver Pista
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 animate-scale-in">
                    <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                      🎉 ¡Candado abierto con éxito! Has desbloqueado el paso secreto.
                    </p>
                    <button
                      type="button"
                      onClick={() => handleNextStep(50)}
                      className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2 mx-auto cursor-pointer"
                    >
                      <span>Avanzar al siguiente bloque</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= 8. PUNTO DE CONTROL & CHECKPOINT ================= */}
          {activeBlock?.type === 'checkpoint_gate' && (
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-750 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-slate-400">Punto de Control Metacognitivo</span>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  {activeBlock.data.checkpointTitle}
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-300">
                  {activeBlock.data.reflectionPrompt}
                </p>
              </div>

              {/* Escala de Confianza (Estrellas) */}
              <div className="flex items-center justify-center gap-2 pt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      setConfidenceRating(star);
                      playSound('match');
                    }}
                    className={`p-2 rounded-xl transition-transform hover:scale-125 cursor-pointer ${
                      star <= confidenceRating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-zinc-600'
                    }`}
                  >
                    <Star className="w-6 h-6" />
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleNextStep(20)}
                  className="px-6 py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs shadow-md flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <span>Confirmar Autoevaluación y Continuar</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= 9. DIPLOMA & CERTIFICADO ================= */}
          {activeBlock?.type === 'badge_certificate' && (
            <div className="p-6 rounded-3xl bg-gradient-to-tr from-yellow-50 to-amber-100 dark:from-yellow-950/40 dark:to-amber-900/40 border-2 border-yellow-400/80 shadow-2xl text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 flex items-center justify-center mx-auto shadow-lg shadow-yellow-500/30">
                <Award className="w-8 h-8 text-slate-950" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-yellow-800 dark:text-yellow-300 tracking-widest">
                  DISTINCIÓN DE HONOR ACADÉMICO
                </span>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {activeBlock.data.certificateTitle}
                </h2>
                <p className="text-xs font-bold text-amber-700 dark:text-amber-300">
                  Otorgado con el grado de: {activeBlock.data.recipientHonor}
                </p>
              </div>

              <div className="pt-3 border-t border-yellow-300/60 flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-zinc-300">
                <span>Colegio Anglo Mexicano</span>
                <span>Firma: {activeBlock.data.teacherSignatureName}</span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleNextStep(50)}
                  className="px-6 py-2.5 rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <span>Reclamar Diploma (+50 XP)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= 10. TEXTO / NARRATIVA ================= */}
          {activeBlock?.type === 'text_narrative' && (
            <div className="space-y-4">
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-blue-50/70 to-indigo-50/70 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800/60 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400">
                      {activeBlock.data.speakerName || 'Instrucción Pedagógica'}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {activeBlock.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
                  {activeBlock.data.content}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => handleNextStep(15)}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white font-black text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
                >
                  <span>Continuar Lectura (+15 XP)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= 11. PREGUNTA DE OPCIÓN MÚLTIPLE ================= */}
          {activeBlock?.type === 'quiz_question' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  Pregunta de Evaluación
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {activeBlock.data.question}
                </h3>
              </div>

              {activeBlock.data.imageUrl && (
                <div className="relative w-full max-h-56 rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-100">
                  <img 
                    src={activeBlock.data.imageUrl} 
                    alt="Ilustración" 
                    className="w-full h-full object-contain mx-auto"
                  />
                </div>
              )}

              {/* Opciones */}
              <div className="grid grid-cols-1 gap-2.5 pt-1">
                {activeBlock.data.options.map((opt, optIdx) => {
                  const isSelected = selectedOption === optIdx;
                  const isCorrect = optIdx === activeBlock.data.correctIndex;
                  
                  let btnStyle = 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 hover:border-purple-400 dark:hover:border-purple-600 text-slate-800 dark:text-zinc-200';
                  
                  if (isQuestionAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/20';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-500 text-white border-rose-600';
                    } else {
                      btnStyle = 'opacity-50 border-slate-200 dark:border-zinc-800';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isQuestionAnswered}
                      onClick={() => handleAnswerQuestion(optIdx)}
                      className={`p-3.5 rounded-2xl border text-left font-bold text-xs transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-black text-[10px] flex items-center justify-center shrink-0">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isQuestionAnswered && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                      )}
                      {isQuestionAnswered && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-white shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explicación formativa tras responder */}
              {isQuestionAnswered && (
                <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200 space-y-1 animate-fade-in">
                  <span className="font-black">Retroalimentación Didáctica:</span>
                  <p>{activeBlock.data.explanation || '¡Excelente análisis conceptual!'}</p>
                </div>
              )}

              {isQuestionAnswered && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => handleNextStep(0)}
                    className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md shadow-purple-500/25 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
                  >
                    <span>Siguiente Reactivo</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= 12. COMBATE CONTRA BOSS PIXI ================= */}
          {activeBlock?.type === 'boss_enemy' && (
            <div className="space-y-4">
              <div className="relative p-5 rounded-3xl bg-gradient-to-b from-slate-900 to-rose-950 text-white border border-rose-800/60 shadow-xl overflow-hidden">
                {/* Cabecera del Boss */}
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-rose-900/60">
                  <div className="flex items-center gap-2">
                    <Swords className="w-4 h-4 text-rose-400" />
                    <h3 className="text-xs font-black uppercase text-rose-300">
                      {activeBlock.data.bossName}
                    </h3>
                  </div>
                  <span className="text-xs font-black text-rose-400">
                    {bossHp} / {bossMaxHp} HP
                  </span>
                </div>

                {/* Barra de Vida del Boss */}
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden my-3 border border-rose-900">
                  <div 
                    className="bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${Math.max(0, (bossHp / bossMaxHp) * 100)}%` }}
                  />
                </div>

                {/* Avatar del Monstruo */}
                <div className="py-4 text-center">
                  <div className={`w-20 h-20 rounded-full bg-rose-600/30 border-2 border-rose-500 flex items-center justify-center mx-auto shadow-2xl text-3xl transition-transform ${isBossDefeated ? 'opacity-40 grayscale scale-75' : 'animate-pulse'}`}>
                    {activeBlock.data.spriteKey === 'blood_dragon' ? '🐉' : activeBlock.data.spriteKey === 'shadow_golem' ? '🗿' : '👾'}
                  </div>
                </div>

                {/* Registro de Batalla */}
                <div className="p-2.5 rounded-xl bg-black/40 text-[11px] text-slate-300 space-y-1 font-mono">
                  {battleLog.map((log, idx) => (
                    <p key={idx}>{log}</p>
                  ))}
                </div>
              </div>

              {/* Botones de Acción de Combate */}
              {!isBossDefeated ? (
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleAttackBoss('crit')}
                    className="p-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md shadow-rose-500/25 flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
                  >
                    <Zap className="w-4 h-4 text-yellow-300" />
                    <span>Ataque Crítico</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAttackBoss('magic')}
                    className="p-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md shadow-purple-500/25 flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-300" />
                    <span>Hechizo Didáctico</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAttackBoss('potion')}
                    className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-500/25 flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
                  >
                    <Shield className="w-4 h-4 text-emerald-200" />
                    <span>Poción de Enfoque</span>
                  </button>
                </div>
              ) : (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => handleNextStep(50)}
                    className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 text-white font-black text-xs shadow-md shadow-rose-500/25 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
                  >
                    <span>Victoria: Reclamar Victoria (+50 XP)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ================= 13. COFRE DE RECOMPENSAS ================= */}
          {activeBlock?.type === 'reward_chest' && (
            <div className="p-6 text-center space-y-5 rounded-3xl bg-gradient-to-b from-amber-500/10 to-amber-500/20 border border-amber-300 dark:border-amber-700">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Recompensa Especial
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {activeBlock.title}
                </h3>
              </div>

              <div 
                onClick={() => {
                  if (!isChestOpened) {
                    setIsChestOpened(true);
                    playSound('chest');
                    setCoins(prev => prev + (activeBlock.data.coinsAmount || 25));
                  }
                }}
                className={`w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/30 text-4xl cursor-pointer transition-all transform hover:scale-110 active:scale-95 ${isChestOpened ? 'rotate-6 scale-105' : 'animate-bounce'}`}
              >
                {isChestOpened ? '💎' : '🎁'}
              </div>

              {isChestOpened ? (
                <div className="space-y-2 animate-scale-in">
                  <h4 className="text-sm font-black text-amber-700 dark:text-amber-300">
                    ¡Has desbloqueado: {activeBlock.data.badgeName || 'Insignia de Honor'}!
                  </h4>
                  <div className="flex items-center justify-center gap-3 text-xs font-black">
                    <span className="text-purple-600 dark:text-purple-400">+{activeBlock.data.xpAmount || 100} XP</span>
                    <span className="text-amber-500">+{activeBlock.data.coinsAmount || 25} Monedas</span>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleNextStep(activeBlock.data.xpAmount || 100)}
                      className="px-6 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2 mx-auto cursor-pointer"
                    >
                      <span>Reclamar Recompensa y Continuar</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-amber-800 dark:text-amber-200 font-bold">
                  ¡Haz clic en el cofre para abrir tu botín de aprendizaje!
                </p>
              )}
            </div>
          )}

          {/* ================= 14. MINIJUEGO ARCADE ================= */}
          {activeBlock?.type === 'minigame_action' && (
            <div className="p-6 text-center space-y-4 rounded-3xl bg-slate-50 dark:bg-zinc-850 border border-slate-200 dark:border-zinc-750">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {activeBlock.title} ({activeBlock.data.minigameType.toUpperCase()})
              </h3>
              <p className="text-xs text-slate-500">
                Gira la ruleta de saberes o desafía tus reflejos pedagógicos:
              </p>

              {/* Ruleta interactiva */}
              <div className="py-2">
                <button
                  type="button"
                  disabled={spinning}
                  onClick={() => {
                    setSpinning(true);
                    playSound('attack');
                    setTimeout(() => {
                      setSpinning(false);
                      const items = activeBlock.data.items || ['Sabiduría +50 XP', 'Escudo de Enfoque', 'Gema Épica'];
                      const winner = items[Math.floor(Math.random() * items.length)];
                      setSelectedPrize(winner);
                      playSound('victory');
                    }, 1200);
                  }}
                  className={`px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm shadow-xl shadow-emerald-500/25 transition-transform cursor-pointer ${
                    spinning ? 'animate-spin' : 'hover:scale-105 active:scale-95'
                  }`}
                >
                  {spinning ? '🎰 Girando...' : '🎲 ¡Girar Ruleta de Saberes!'}
                </button>
              </div>

              {selectedPrize && (
                <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 rounded-xl text-xs font-black text-emerald-800 dark:text-emerald-200 animate-scale-in">
                  🎉 ¡Premio obtenido: {selectedPrize}!
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleNextStep(30)}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <span>Continuar Misión (+30 XP)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= 15. RAMIFICACIÓN CONDICIONAL ================= */}
          {activeBlock?.type === 'logic_branch' && (
            <div className="p-6 text-center space-y-4 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
                <GitBranch className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-indigo-500">Ruta Adaptativa</span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Evaluación de Ruta de Aprendizaje
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-300">
                  Condición: Aciertos &ge; {activeBlock.data.thresholdValue}%. ¡Has superado el umbral con éxito y desbloqueado la ruta de maestría!
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleNextStep(20)}
                  className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <span>Avanzar por Ruta de Maestría (+20 XP)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= 16. EFECTO DE AUDIO SFX ================= */}
          {activeBlock?.type === 'audio_sfx' && (
            <div className="p-6 text-center space-y-4 rounded-3xl bg-violet-50/70 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 text-violet-950 dark:text-violet-200">
              <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center mx-auto shadow-md animate-bounce">
                <Music className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-violet-500">Inmersión Sonora</span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {activeBlock.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-300">
                  Fanfarria de victoria y efectos auditivos reproducidos con éxito.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleNextStep(10)}
                  className="px-6 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 mx-auto cursor-pointer"
                >
                  <span>Continuar (+10 XP)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
