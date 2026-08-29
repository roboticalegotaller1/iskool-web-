"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSchoolAdminStore } from '@/store/useSchoolAdminStore';
import { useClassroomStore } from '@/store/useClassroomStore';
import { 
  X, 
  Sparkles, 
  Trophy, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Users, 
  Volume2, 
  VolumeX, 
  Zap, 
  CheckCircle2, 
  BarChart2, 
  Coins, 
  Flame, 
  Smile, 
  Award,
  Maximize2,
  Minimize2,
  Radio,
  Vote
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const LiveClassModeModal: React.FC<Props> = ({ onClose }) => {
  const detailedStudents = useSchoolAdminStore(state => state.detailedStudents);
  const groupsList = useSchoolAdminStore(state => state.groupsList);
  const { 
    selectedGroupId, 
    logHeroPicker, 
    activeLivePoll, 
    startLivePoll, 
    voteLivePoll, 
    closeLivePoll 
  } = useClassroomStore();

  const [activeTab, setActiveTab] = useState<'picker' | 'timer' | 'poll' | 'energy'>('picker');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // === 1. ESTADOS DE LA RULETA DEL HÉROE ===
  const groupStudents = detailedStudents.filter(s => s.groupId === selectedGroupId || selectedGroupId === 'all');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<typeof detailedStudents[0] | null>(null);
  const [rewardGranted, setRewardGranted] = useState(false);

  // === 2. ESTADOS DEL TEMPORIZADOR DE CONCENTRACIÓN ===
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 min por defecto
  const [initialTimerSeconds, setInitialTimerSeconds] = useState(300);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // === 3. ESTADOS DEL SONDEO RELÁMPAGO ===
  const [pollQuestion, setPollQuestion] = useState('¿Cuál es la hipótesis principal de nuestro experimento de hoy?');
  const [pollOptions, setPollOptions] = useState([
    { text: 'A) El agua se evaporará más rápido con calor directo' },
    { text: 'B) La planta crecerá igual en la sombra' },
    { text: 'C) El bicarbonato neutraliza el ácido' }
  ]);

  // === 4. SINTETIZADOR WEB AUDIO NATIVO ===
  const playSfx = (type: 'spin' | 'win' | 'alarm' | 'click') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'click') {
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'spin') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300 + Math.random() * 300, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'win') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
        osc.start(now);
        osc.stop(now + 0.7);
      } else if (type === 'alarm') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.setValueAtTime(440, now + 0.2);
        osc.frequency.setValueAtTime(880, now + 0.4);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
      }
    } catch (e) {}
  };

  // Temporizador Tick
  useEffect(() => {
    let interval: any;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            playSfx('alarm');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Manejador de la Ruleta del Héroe
  const handleSpinHeroPicker = () => {
    if (isSpinning || groupStudents.length === 0) return;
    setIsSpinning(true);
    setSelectedStudent(null);
    setRewardGranted(false);

    let counter = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
      counter++;
      const randomIdx = Math.floor(Math.random() * groupStudents.length);
      setSelectedStudent(groupStudents[randomIdx]);
      playSfx('spin');

      if (counter >= maxSpins) {
        clearInterval(interval);
        setIsSpinning(false);
        playSfx('win');
      }
    }, 100);
  };

  const handleGrantHeroReward = () => {
    if (!selectedStudent || rewardGranted) return;
    setRewardGranted(true);
    playSfx('win');
    logHeroPicker({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      rewardGiven: {
        xp: 25,
        coins: 15,
        badgeName: 'Héroe del Día 🌟'
      }
    });
  };

  // Formato mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const timerProgress = initialTimerSeconds > 0 
    ? ((initialTimerSeconds - timerSeconds) / initialTimerSeconds) * 100 
    : 0;

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-md flex flex-col text-white select-none overflow-y-auto animate-fade-in">
      {/* ========================================================================= */}
      {/* 1. BARRA SUPERIOR PROYECTABLE */}
      {/* ========================================================================= */}
      <div className="p-4 sm:px-8 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
            <Zap className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-950 border border-amber-700/80 text-amber-300">
                Modo Proyector de Clase
              </span>
              <span className="text-xs text-slate-400 font-bold">
                • {groupsList.find(g => g.id === selectedGroupId)?.name || 'Todos los Alumnos'}
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-black text-white">
              Centro de Dinámicas en Vivo
            </h1>
          </div>
        </div>

        {/* Pestañas de Dinámicas */}
        <div className="hidden sm:flex items-center gap-1.5 p-1 bg-slate-800/80 rounded-2xl border border-slate-700">
          <button
            type="button"
            onClick={() => { playSfx('click'); setActiveTab('picker'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'picker' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎯 Ruleta del Héroe
          </button>
          <button
            type="button"
            onClick={() => { playSfx('click'); setActiveTab('timer'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'timer' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⏱️ Temporizador
          </button>
          <button
            type="button"
            onClick={() => { playSfx('click'); setActiveTab('poll'); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'poll' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Sondeo Relámpago
          </button>
        </div>

        {/* Controles: Audio & Salir */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-amber-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Cerrar Proyector</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ÁREA PRINCIPAL PROYECTABLE */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 max-w-5xl mx-auto w-full">
        
        {/* === CASO 1: RULETA DEL HÉROE ELEGIDO === */}
        {activeTab === 'picker' && (
          <div className="text-center space-y-8 w-full max-w-2xl">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                Participación Equitativa Gamificada
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                ¿Quién será el Héroe Elegido?
              </h2>
            </div>

            {/* Tarjeta de Alumno Seleccionado / Girando */}
            <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-amber-500/50 shadow-2xl shadow-amber-500/10 flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />

              {selectedStudent ? (
                <motion.div
                  key={selectedStudent.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-4 text-center relative z-10"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center mx-auto shadow-2xl shadow-amber-500/30 text-4xl font-black">
                    ⭐
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-4xl font-black text-white">
                      {selectedStudent.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-bold text-amber-400 mt-1">
                      {selectedStudent.groupName || 'Estudiante Valiente'}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-3 text-slate-500">
                  <Users className="w-16 h-16 mx-auto opacity-40 animate-pulse" />
                  <p className="text-sm font-bold">
                    Presiona el botón para girar la ruleta y elegir al participante al azar.
                  </p>
                </div>
              )}
            </div>

            {/* Controles de la Ruleta */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                disabled={isSpinning}
                onClick={handleSpinHeroPicker}
                className={`px-10 py-4 rounded-2xl font-black text-base sm:text-lg transition-all shadow-xl flex items-center gap-2.5 cursor-pointer ${
                  isSpinning 
                    ? 'bg-slate-800 text-slate-500' 
                    : 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-950 shadow-amber-500/30 hover:scale-105 active:scale-95'
                }`}
              >
                <Sparkles className="w-5 h-5 fill-slate-950" />
                <span>{isSpinning ? 'Girando el Destino...' : 'Girar Ruleta del Héroe'}</span>
              </button>

              {selectedStudent && !rewardGranted && (
                <button
                  type="button"
                  onClick={handleGrantHeroReward}
                  className="px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-sm shadow-xl shadow-emerald-500/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
                >
                  <Coins className="w-5 h-5 text-yellow-300" />
                  <span>Premiar Participación (+15 🪙 / +25 XP)</span>
                </button>
              )}

              {rewardGranted && (
                <div className="px-6 py-3 rounded-2xl bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs font-black flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Recompensa de participación otorgada!</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* === CASO 2: TEMPORIZADOR DE CONCENTRACIÓN / POMODORO === */}
        {activeTab === 'timer' && (
          <div className="text-center space-y-8 w-full max-w-xl">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-indigo-400">
                Enfoque & Misión Contrarreloj
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Tiempo de Concentración
              </h2>
            </div>

            {/* Display Gigante del Cronómetro */}
            <div className="p-10 rounded-3xl bg-slate-900 border border-indigo-800/60 shadow-2xl flex flex-col items-center justify-center space-y-4">
              <div className="text-6xl sm:text-8xl font-black tracking-tight text-indigo-300 font-mono">
                {formatTime(timerSeconds)}
              </div>

              {/* Barra de progreso */}
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300"
                  style={{ width: `${timerProgress}%` }}
                />
              </div>
            </div>

            {/* Presets Rápidos */}
            <div className="flex flex-wrap justify-center gap-2 text-xs font-bold">
              {[
                { label: '⚡ 3 Minutos', sec: 180 },
                { label: '⏱️ 5 Minutos', sec: 300 },
                { label: '👥 15 Minutos (Equipo)', sec: 900 },
                { label: '🎯 25 Minutos (Pomodoro)', sec: 1500 }
              ].map(preset => (
                <button
                  key={preset.sec}
                  type="button"
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimerSeconds(preset.sec);
                    setInitialTimerSeconds(preset.sec);
                    playSfx('click');
                  }}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    initialTimerSeconds === preset.sec 
                      ? 'bg-indigo-600 border-indigo-500 text-white' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Controles de Reproducción */}
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  setIsTimerRunning(!isTimerRunning);
                  playSfx('click');
                }}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-sm shadow-xl shadow-indigo-500/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
              >
                {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                <span>{isTimerRunning ? 'Pausar' : 'Iniciar Tiempo'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(initialTimerSeconds);
                  playSfx('click');
                }}
                className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm flex items-center gap-2 cursor-pointer transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reiniciar</span>
              </button>
            </div>
          </div>
        )}

        {/* === CASO 3: SONDEO RELÁMPAGO EN PANTALLA === */}
        {activeTab === 'poll' && (
          <div className="space-y-6 w-full max-w-2xl text-center">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                Evaluación Diagnóstica en Vivo
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Sondeo Relámpago del Aula
              </h2>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-800/60 shadow-2xl text-left space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-black text-emerald-400 uppercase">Pregunta Proyectada:</span>
                <span className="text-xs text-slate-400 font-bold">Votación en Vivo</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white">
                {pollQuestion}
              </h3>

              <div className="space-y-3 pt-2">
                {pollOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs sm:text-sm font-semibold"
                  >
                    <span>{opt.text}</span>
                    <button
                      type="button"
                      onClick={() => {
                        playSfx('win');
                      }}
                      className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all cursor-pointer"
                    >
                      +1 Voto
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
