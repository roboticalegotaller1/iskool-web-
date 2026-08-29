"use client";

import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Sparkles, 
  Globe, 
  Users, 
  CheckCircle2, 
  ArrowRight, 
  Palette, 
  HeartHandshake,
  BrainCircuit,
  GraduationCap,
  Shield,
  Zap,
  Radio
} from 'lucide-react';

interface TeacherHubCardsProps {
  onSelectAction: (action: 'classroom' | 'classes' | 'studio' | 'community') => void;
  teacherName?: string;
}

export const TeacherHubCards: React.FC<TeacherHubCardsProps> = ({ 
  onSelectAction, 
  teacherName = 'Profesor(a)' 
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-10 animate-fade-in">
      {/* Saludo y Cabecera del Hub - Diseño Minimalista y Dinámico */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/50 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
          <span>Panel Simplificado • Navegación en 1 Clic</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          ¡Hola, <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">{teacherName}</span>!
        </h1>
        
        <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Bienvenido a tu espacio docente. Diseñado para trabajar sin fricción cognitiva: selecciona una acción para empezar en <span className="font-bold text-slate-900 dark:text-zinc-200">1 solo clic</span>.
        </p>
      </div>

      {/* Grid de las 4 Tarjetas Masivas Visuales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        
        {/* TARJETA 1: AULA DIGITAL & GREMIO */}
        <div 
          onClick={() => onSelectAction('classroom')}
          className="group relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:border-indigo-500/40 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200/40">
                En Vivo & Dinámicas
              </span>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                🏛️ Aula Digital
              </h2>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                Edictos del aula, termómetro socioemocional, modo proyector en vivo y rúbricas formativas IA.
              </p>
            </div>

            <ul className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-zinc-800/60 text-xs">
              <li className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-zinc-400">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Proyector con Ruleta del Héroe</span>
              </li>
              <li className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-zinc-400">
                <Radio className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Termómetro Socioemocional</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-bold text-xs group-hover:translate-x-1 transition-transform relative z-10">
            <span>Entrar al Aula</span>
            <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* TARJETA 2: MIS CLASES & EVALUACIÓN */}
        <div 
          onClick={() => onSelectAction('classes')}
          className="group relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:border-blue-500/40 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200/40">
                Gestión Escolar
              </span>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                📚 Mis Clases
              </h2>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                Gestiona la asistencia diaria, portafolio de evidencias y asigna calificaciones formativas NEM.
              </p>
            </div>

            <ul className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-zinc-800/60 text-xs">
              <li className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-zinc-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Portafolio de evidencias</span>
              </li>
              <li className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-zinc-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Control de asistencia en 1 clic</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-blue-600 dark:text-blue-400 font-bold text-xs group-hover:translate-x-1 transition-transform relative z-10">
            <span>Entrar a Mis Clases</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* TARJETA 3: CREAR ACTIVIDAD (HERO CARD - ESTUDIO ISKOOL) */}
        <Link 
          href="/teacher/studio"
          onClick={() => onSelectAction('studio')}
          className="group relative bg-gradient-to-b from-purple-600 via-violet-600 to-indigo-700 text-white rounded-3xl p-6 shadow-xl shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/40 border border-purple-400/30 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden ring-2 ring-purple-400/30"
        >
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-white/20 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform">
                <Palette className="w-7 h-7 text-yellow-300" />
              </div>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-yellow-400 text-slate-900 shadow-md">
                ✨ Estudio IA
              </span>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-black text-white tracking-tight">
                🎨 Crear Actividad
              </h2>
              <p className="text-xs text-purple-100 leading-relaxed line-clamp-3">
                Diseña experiencias interactivas y retos de lógica matemática asistido por IA en minutos.
              </p>
            </div>

            <ul className="space-y-1.5 pt-2 border-t border-white/20 text-xs">
              <li className="flex items-center gap-1.5 font-semibold text-purple-100">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                <span>40+ Retos de Lógica y Pensamiento</span>
              </li>
              <li className="flex items-center gap-1.5 font-semibold text-purple-100">
                <BrainCircuit className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                <span>Alineación oficial con PDAs</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 mt-4 border-t border-white/20 flex items-center justify-between text-white font-black text-xs group-hover:translate-x-1 transition-transform relative z-10">
            <span className="underline decoration-yellow-300 decoration-2 underline-offset-4">Abrir Estudio ISkool</span>
            <div className="w-8 h-8 rounded-full bg-white text-purple-700 flex items-center justify-center group-hover:bg-yellow-400 group-hover:text-slate-900 transition-all shadow-md">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

        {/* TARJETA 4: COMUNIDAD DOCENTE */}
        <Link 
          href="/teacher/community"
          onClick={() => onSelectAction('community')}
          className="group relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:border-emerald-500/40 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />

          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                <Globe className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200/40">
                Red Docente
              </span>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                🌍 Comunidad
              </h2>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed line-clamp-3">
                Explora actividades creadas por otros profesores, vota por tus favoritas y clónalas a tu aula.
              </p>
            </div>

            <ul className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-zinc-800/60 text-xs">
              <li className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-zinc-400">
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Votación justa comunitaria</span>
              </li>
              <li className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-zinc-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Clona plantillas listas para usar</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold text-xs group-hover:translate-x-1 transition-transform relative z-10">
            <span>Explorar Comunidad</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
};
