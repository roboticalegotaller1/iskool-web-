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
  FolderKanban
} from 'lucide-react';

interface TeacherHubCardsProps {
  onSelectAction: (action: 'classes' | 'studio' | 'community') => void;
  teacherName?: string;
}

export const TeacherHubCards: React.FC<TeacherHubCardsProps> = ({ 
  onSelectAction, 
  teacherName = 'Profesor(a)' 
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-10 animate-fade-in">
      {/* Saludo y Cabecera del Hub - Diseño Minimalista */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/50 dark:border-blue-800/40 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
          <span>Panel Simplificado • Diseño Minimalista</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          ¡Hola, <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">{teacherName}</span>! 👋
        </h1>
        
        <p className="text-base sm:text-lg font-medium text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Bienvenido a tu espacio docente. Diseñado para trabajar sin fricción cognitiva: selecciona una acción para empezar en <span className="font-bold text-slate-900 dark:text-zinc-200">1 solo clic</span>.
        </p>
      </div>

      {/* Grid de las 3 Tarjetas Masivas Visuales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-4">
        
        {/* TARJETA 1: MIS CLASES */}
        <div 
          onClick={() => onSelectAction('classes')}
          className="group relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:border-blue-500/40 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          {/* Fondo sutil decorativo */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200/40 dark:border-blue-800/40">
                Gestión Escolar
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                📚 Mis Clases
              </h2>
              <p className="text-sm font-normal text-slate-600 dark:text-zinc-400 leading-relaxed">
                Gestiona la asistencia de tus grupos, revisa evidencias del portafolio y asigna calificaciones formativas NEM.
              </p>
            </div>

            <ul className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800/60">
              <li className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Portafolio de evidencias y evaluación</span>
              </li>
              <li className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Control de asistencia en 1 clic</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-blue-600 dark:text-blue-400 font-bold text-sm group-hover:translate-x-1 transition-transform relative z-10">
            <span>Entrar a Mis Clases</span>
            <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* TARJETA 2: CREAR ACTIVIDAD (HERO CARD - ESTUDIO ISKOOL) */}
        <Link 
          href="/teacher/studio"
          onClick={() => onSelectAction('studio')}
          className="group relative bg-gradient-to-b from-purple-600 via-violet-600 to-indigo-700 text-white rounded-3xl p-8 shadow-xl shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/40 border border-purple-400/30 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden ring-4 ring-purple-500/20"
        >
          {/* Brillo dinámico minimalista */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-white/20 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform">
                <Palette className="w-8 h-8 text-yellow-300" />
              </div>
              <span className="text-xs font-black px-3.5 py-1 rounded-full bg-yellow-400 text-slate-900 shadow-md animate-bounce">
                ✨ Principal • Estudio IA
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white flex items-center gap-2 tracking-tight">
                🎨 Crear Actividad
              </h2>
              <p className="text-sm font-medium text-purple-100 leading-relaxed">
                Diseña experiencias educativas interactivas en minutos asistido por la Inteligencia Artificial de ISkool.
              </p>
            </div>

            <ul className="space-y-2 pt-2 border-t border-white/20">
              <li className="flex items-center gap-2 text-xs font-semibold text-purple-100">
                <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
                <span>Generador de 20 Plantillas Interactivas IA</span>
              </li>
              <li className="flex items-center gap-2 text-xs font-semibold text-purple-100">
                <BrainCircuit className="w-4 h-4 text-yellow-300 shrink-0" />
                <span>Alineación automática con PDAs NEM</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-white/20 flex items-center justify-between text-white font-black text-sm group-hover:translate-x-1 transition-transform relative z-10">
            <span className="underline decoration-yellow-300 decoration-2 underline-offset-4">Abrir Estudio ISkool</span>
            <div className="w-9 h-9 rounded-full bg-white text-purple-700 flex items-center justify-center group-hover:bg-yellow-400 group-hover:text-slate-900 transition-all shadow-md">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Link>

        {/* TARJETA 3: COMUNIDAD DOCENTE */}
        <Link 
          href="/teacher/community"
          onClick={() => onSelectAction('community')}
          className="group relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-zinc-800/80 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:border-emerald-500/40 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
        >
          {/* Fondo sutil decorativo */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8" />
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-800/40">
                Red Docente
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                🌍 Comunidad Docente
              </h2>
              <p className="text-sm font-normal text-slate-600 dark:text-zinc-400 leading-relaxed">
                Explora actividades creadas por otros profesores, vota por tus favoritas y clónalas directamente a tu aula.
              </p>
            </div>

            <ul className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800/60">
              <li className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400">
                <HeartHandshake className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Votación justa de recursos destacados</span>
              </li>
              <li className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Clona plantillas listas para usar</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold text-sm group-hover:translate-x-1 transition-transform relative z-10">
            <span>Explorar Comunidad</span>
            <div className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
};
