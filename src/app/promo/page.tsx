"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Trophy,
  BookOpen,
  Heart,
  Users,
  ShieldAlert,
  Sparkles,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  CheckCircle2,
  Zap,
  TrendingUp,
  Star,
  Clock,
  Shield,
  Layers,
  Award,
  Maximize2
} from "lucide-react";

// Tipos de diapositiva
type SlideType = "curtain" | "showcase";

interface SlideData {
  id: number;
  type: SlideType;
  portalName: string;
  badge: string;
  title: string;
  subtitle: string;
  colorTheme: "blue" | "emerald" | "rose" | "purple" | "amber" | "indigo";
  metrics: { label: string; value: string }[];
  features: { iconName: string; title: string; desc: string }[];
  portalUrl?: string;
  portalCode?: string;
}

const SLIDES: SlideData[] = [
  // SLIDE 0: INTRO GRAND PITCH
  {
    id: 0,
    type: "curtain",
    portalName: "ISKOOL 2026",
    badge: "Plataforma EdTech Gamificada · Presentación para Inversionistas",
    title: "La Revolución del Aprendizaje Digital en México",
    subtitle: "Conectando Alumnos, Docentes, Padres y Coordinadores en una sola plataforma inmersiva alineada 100% a la Nueva Escuela Mexicana (NEM).",
    colorTheme: "indigo",
    metrics: [
      { label: "Engagement Estudiantil", value: "+94%" },
      { label: "Eficiencia Docente IA", value: "5x" },
      { label: "Retención de Alumnos", value: "99.8%" },
      { label: "Alineación Oficial", value: "100% SEP" }
    ],
    features: [
      { iconName: "Trophy", title: "Módulo Alumnos Gamificado", desc: "Misiones, avatares PixiJS y tienda de recompensas." },
      { iconName: "Zap", title: "Módulo Docente con IA", desc: "Generación de planeaciones NEM y evaluación formativa instantánea." },
      { iconName: "Heart", title: "Módulo Padres Transparente", desc: "Muro de logros en tiempo real y comunicación sin estrés." },
      { iconName: "Users", title: "Módulo Coordinador & Admin", desc: "Expedientes digitales, horarios automáticos y analítica institucional." }
    ]
  },

  // SLIDE 1: CORTINA PORTAL ALUMNO
  {
    id: 1,
    type: "curtain",
    portalName: "PORTAL DEL ALUMNO",
    badge: "Sección 01 · Gamificación & Portafolios Inteligentes",
    title: "Aprender Jugando: Gamificación Dinámica",
    subtitle: "Los estudiantes superan misiones, ganan puntos de experiencia (XP), cuidan a su mascota virtual PixiJS y acumulan evidencias de aprendizaje.",
    colorTheme: "blue",
    metrics: [
      { label: "Misiones Completadas", value: "12,450+" },
      { label: "Satisfacción de Alumnos", value: "4.9/5 ★" },
      { label: "Asistencia Motivada", value: "98.2%" }
    ],
    features: [
      { iconName: "Trophy", title: "Misiones & Cuestionarios", desc: "Retos diarios interactivos con retroalimentación inmediata." },
      { iconName: "Sparkles", title: "Mascota & Avatar PixiJS", desc: "Personalización lúdica que fomenta la constancia escolar." },
      { iconName: "Award", title: "Tienda de Recompensas", desc: "Canje de XP por incentivos académicos y medallas digitales." }
    ],
    portalUrl: "/student"
  },

  // SLIDE 2: SHOWCASE PORTAL ALUMNO
  {
    id: 2,
    type: "showcase",
    portalName: "PORTAL DEL ALUMNO EN ACCIÓN",
    badge: "Demostración Interactiva del Alumno",
    title: "Experiencia Inmersiva para el Estudiante",
    subtitle: "Navegación fluida por misiones activas, insignias de logro, estado de la mascota y catálogo de premios.",
    colorTheme: "blue",
    metrics: [
      { label: "Nivel Promedio Alumno", value: "Nivel 14 (Élite)" },
      { label: "Gemas Acumuladas", value: "450 💎" }
    ],
    features: [],
    portalUrl: "/student"
  },

  // SLIDE 3: CORTINA PORTAL DOCENTE
  {
    id: 3,
    type: "curtain",
    portalName: "PORTAL DEL DOCENTE",
    badge: "Sección 02 · Asistente Pedagógico con IA Generativa",
    title: "Potenciando al Maestro: Planeación & Evaluación",
    subtitle: "La IA genera planeaciones analíticas alineadas a la NEM en segundos. Evaluación formativa sin papeleo y botón de emergencia escolar.",
    colorTheme: "emerald",
    metrics: [
      { label: "Ahorro de Tiempo Semanal", value: "14 Horas" },
      { label: "Planeaciones Generadas", value: "100% NEM" },
      { label: "Protocolo de Emergencia", value: "Respuesta < 3s" }
    ],
    features: [
      { iconName: "Zap", title: "Creador de Planeación NEM", desc: "Diseño automático de proyectos por campos formativos y ejes articuladores." },
      { iconName: "BookOpen", title: "Evaluación Formativa & Boleta SEP", desc: "Calificación ágil mediante rúbricas y traducción a escala oficial." },
      { iconName: "Shield", title: "Botón de Emergencia (SOS)", desc: "Alerta en tiempo real a coordinadores y brigadas ante cualquier incidente." }
    ],
    portalUrl: "/teacher"
  },

  // SLIDE 4: SHOWCASE PORTAL DOCENTE
  {
    id: 4,
    type: "showcase",
    portalName: "PORTAL DEL DOCENTE EN ACCIÓN",
    badge: "Demostración Interactiva del Docente",
    title: "Gestión Académica Simplificada para Profesores",
    subtitle: "Revisión de entregas de evidencias, asignación de retroalimentación constructiva y herramientas de seguridad.",
    colorTheme: "emerald",
    metrics: [
      { label: "Grupos Gestionados", value: "Grupo 6°A & 6°B" },
      { label: "Evidencias Revisadas", value: "100%" }
    ],
    features: [],
    portalUrl: "/teacher"
  },

  // SLIDE 5: CORTINA PORTAL PADRES
  {
    id: 5,
    type: "curtain",
    portalName: "PORTAL DE PADRES",
    badge: "Sección 03 · Vinculación Familia-Escuela Transparente",
    title: "Padres Involucrados, Estudiantes Motivados",
    subtitle: "Una ventana clara al crecimiento de los hijos: logros diarios, comentarios motivacionales y boletas de evaluación comprensibles.",
    colorTheme: "rose",
    metrics: [
      { label: "Aumento en Participación", value: "+88%" },
      { label: "Mensajes Motivacionales", value: "15,200+" },
      { label: "Satisfacción Familiar", value: "99.1%" }
    ],
    features: [
      { iconName: "Heart", title: "Muro de Logros en Tiempo Real", desc: "Notificaciones instantáneas al completar misiones o destacar en clase." },
      { iconName: "Star", title: "Comentarios Motivacionales", desc: "Envío directo de notas de aliento que aumentan la confianza del alumno." },
      { iconName: "CheckCircle2", title: "Reportes Visuales de Avance", desc: "Comprensión rápida del progreso sin términos académicos confusos." }
    ],
    portalUrl: "/parent"
  },

  // SLIDE 6: SHOWCASE PORTAL PADRES
  {
    id: 6,
    type: "showcase",
    portalName: "PORTAL DE PADRES EN ACCIÓN",
    badge: "Demostración Interactiva del Tutor",
    title: "Acompañamiento Escolar en Tiempo Real",
    subtitle: "Vista del muro de reconocimientos de Sofía, historial de felicitaciones y actualización constante del desempeño.",
    colorTheme: "rose",
    metrics: [
      { label: "Alumno Vinculado", value: "Sofía Martínez" },
      { label: "Estado Escolar", value: "Excelente (10.0)" }
    ],
    features: [],
    portalUrl: "/parent"
  },

  // SLIDE 7: CORTINA PORTAL COORDINADOR
  {
    id: 7,
    type: "curtain",
    portalName: "PORTAL DEL COORDINADOR",
    badge: "Sección 04 · Administración Operativa & Expedientes NEM",
    title: "Control Institucional Eficiente & Analítica",
    subtitle: "Gestión centralizada de expedientes de alumnos, asignación de docentes, horarios sin empalmes y monitoreo escolar.",
    colorTheme: "purple",
    metrics: [
      { label: "Expedientes Digitales", value: "100% Organizados" },
      { label: "Planificación de Horarios", value: "10x Más Rápida" },
      { label: "Seguridad de Datos", value: "Nivel Encriptación A+" }
    ],
    features: [
      { iconName: "Users", title: "Expedientes Digitales NEM", desc: "Registro integral de avance, conductas y portafolios docentes." },
      { iconName: "Clock", title: "Generador Inteligente de Horarios", desc: "Algoritmo para cuadrar bloques académicos y disponibilidad de aulas." },
      { iconName: "TrendingUp", title: "Dashboards de Desempeño", desc: "Métricas consolidadas de reprobación, asistencia y cumplimiento pedagógico." }
    ],
    portalUrl: "/coordinator"
  },

  // SLIDE 8: SHOWCASE PORTAL COORDINADOR
  {
    id: 8,
    type: "showcase",
    portalName: "PORTAL DEL COORDINADOR EN ACCIÓN",
    badge: "Demostración Interactiva de Coordinación",
    title: "Supervisión Académica de Todo el Plantel",
    subtitle: "Monitoreo de grupos, revisión de expedientes oficiales y control administrativo en tiempo real.",
    colorTheme: "purple",
    metrics: [
      { label: "Alumnos Inscritos", value: "480 Estudiantes" },
      { label: "Docentes Activos", value: "24 Profesores" }
    ],
    features: [],
    portalUrl: "/coordinator"
  }
];


export default function PromoPage() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const SLIDE_DURATION = 4500; // 4.5 segundos por diapositiva para fluidez perfecta sin tiempos muertos

  const currentSlide = SLIDES[currentIndex];

  // Avance automático
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    setProgress(0);
    const startTime = Date.now();

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / SLIDE_DURATION) * 100);
      setProgress(pct);
    }, 50);

    timerRef.current = setTimeout(() => {
      handleNext();
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex, isPlaying]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case "Trophy":
        return <Trophy className={className} />;
      case "Zap":
        return <Zap className={className} />;
      case "Heart":
        return <Heart className={className} />;
      case "Users":
        return <Users className={className} />;
      case "Sparkles":
        return <Sparkles className={className} />;
      case "Award":
        return <Award className={className} />;
      case "BookOpen":
        return <BookOpen className={className} />;
      case "Shield":
        return <Shield className={className} />;
      case "Star":
        return <Star className={className} />;
      case "CheckCircle2":
        return <CheckCircle2 className={className} />;
      case "Clock":
        return <Clock className={className} />;
      case "TrendingUp":
        return <TrendingUp className={className} />;
      case "Layers":
        return <Layers className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  // Tema de colores gradientes por cortina
  const getThemeStyles = (theme: string) => {
    switch (theme) {
      case "blue":
        return {
          gradientBg: "from-blue-950 via-slate-900 to-indigo-950",
          accentText: "text-blue-400",
          badgeBg: "bg-blue-500/10 text-blue-300 border-blue-500/30",
          glowColor: "shadow-blue-500/20",
          borderAccent: "border-blue-500/40",
          buttonBg: "bg-blue-600 hover:bg-blue-500 text-white"
        };
      case "emerald":
        return {
          gradientBg: "from-emerald-950 via-slate-900 to-teal-950",
          accentText: "text-emerald-400",
          badgeBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
          glowColor: "shadow-emerald-500/20",
          borderAccent: "border-emerald-500/40",
          buttonBg: "bg-emerald-600 hover:bg-emerald-500 text-white"
        };
      case "rose":
        return {
          gradientBg: "from-rose-950 via-slate-900 to-pink-950",
          accentText: "text-rose-400",
          badgeBg: "bg-rose-500/10 text-rose-300 border-rose-500/30",
          glowColor: "shadow-rose-500/20",
          borderAccent: "border-rose-500/40",
          buttonBg: "bg-rose-600 hover:bg-rose-500 text-white"
        };
      case "purple":
        return {
          gradientBg: "from-purple-950 via-slate-900 to-violet-950",
          accentText: "text-purple-400",
          badgeBg: "bg-purple-500/10 text-purple-300 border-purple-500/30",
          glowColor: "shadow-purple-500/20",
          borderAccent: "border-purple-500/40",
          buttonBg: "bg-purple-600 hover:bg-purple-500 text-white"
        };
      case "amber":
        return {
          gradientBg: "from-amber-950 via-slate-900 to-orange-950",
          accentText: "text-amber-400",
          badgeBg: "bg-amber-500/10 text-amber-300 border-amber-500/30",
          glowColor: "shadow-amber-500/20",
          borderAccent: "border-amber-500/40",
          buttonBg: "bg-amber-600 hover:bg-amber-500 text-white"
        };
      default:
        return {
          gradientBg: "from-indigo-950 via-slate-900 to-purple-950",
          accentText: "text-indigo-400",
          badgeBg: "bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
          glowColor: "shadow-indigo-500/20",
          borderAccent: "border-indigo-500/40",
          buttonBg: "bg-indigo-600 hover:bg-indigo-500 text-white"
        };
    }
  };

  const themeStyles = getThemeStyles(currentSlide.colorTheme);

  return (
    <div className={`relative min-h-screen w-full bg-gradient-to-br ${themeStyles.gradientBg} text-white font-sans overflow-hidden flex flex-col justify-between transition-all duration-700`}>
      
      {/* Background Subtle Animated Particles Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Header / Player Controls */}
      <header className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 group-hover:scale-105 transition-transform">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                ISkool Promo Video
              </span>
              <span className="block text-[10px] text-blue-400 font-bold uppercase tracking-widest">
                Investor Edition 2026
              </span>
            </div>
          </Link>
        </div>

        {/* Progress Bar Container */}
        <div className="hidden md:flex flex-col items-center gap-1.5 w-1/3">
          <div className="flex justify-between w-full text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <span>{currentSlide.portalName}</span>
            <span>Diapositiva {currentIndex + 1} de {SLIDES.length}</span>
          </div>
          <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold transition-all"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 text-amber-400" /> Pausar
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-emerald-400" /> Reproducir
              </>
            )}
          </button>

          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-xs font-bold border border-white/10 transition-all"
          >
            Salir al Sitio
          </Link>
        </div>
      </header>

      {/* MAIN SLIDE CONTENT AREA */}
      <main className="relative z-40 flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        {currentSlide.type === "curtain" ? (
          /* CORTINA DE TRANSICIÓN CINEMATOGRÁFICA */
          <div className="w-full max-w-5xl animate-fadeIn flex flex-col gap-8">
            
            {/* Header Badge */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border ${themeStyles.badgeBg} shadow-lg backdrop-blur-md animate-bounce`}>
                <Sparkles className="h-4 w-4" />
                {currentSlide.badge}
              </span>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                ● CORTINA DE SECCIÓN AUTOMÁTICA
              </span>
            </div>

            {/* Title and Subtitle */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                {currentSlide.title}
              </h1>
              <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl">
                {currentSlide.subtitle}
              </p>
            </div>

            {/* Key Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              {currentSlide.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl bg-white/5 border ${themeStyles.borderAccent} backdrop-blur-md flex flex-col justify-between shadow-xl hover:scale-105 transition-transform`}
                >
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{m.label}</span>
                  <span className={`text-2xl sm:text-3xl font-black mt-2 ${themeStyles.accentText}`}>{m.value}</span>
                </div>
              ))}
            </div>

            {/* Features Highlight */}
            {currentSlide.features.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {currentSlide.features.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md flex flex-col gap-2 hover:border-white/20 transition-all"
                  >
                    <div className={`p-2.5 rounded-xl bg-white/10 w-fit ${themeStyles.accentText}`}>
                      {renderIcon(f.iconName, "h-5 w-5")}
                    </div>
                    <h4 className="text-sm font-bold text-white">{f.title}</h4>
                    <p className="text-xs text-slate-400 leading-normal">{f.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Interactive Link Action */}
            {currentSlide.portalUrl && (
              <div className="flex items-center gap-4 pt-4">
                <Link
                  href={currentSlide.portalUrl}
                  target="_blank"
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-xl ${themeStyles.buttonBg} transition-all hover:scale-105`}
                >
                  Ver Portal Completo en Vivo
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <span className="text-xs text-slate-400 italic">
                  Siguiente vista previa interactiva en segundos...
                </span>
              </div>
            )}
          </div>
        ) : (
          /* SHOWCASE PORTAL EN VIVO / INTERACTIVO */
          <div className="w-full max-w-6xl animate-fadeIn flex flex-col gap-4">
            {/* Bar Above Showcase */}
            <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  VISTA PREVIA EN VIVO · {currentSlide.portalName}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300 font-semibold">
                <span>{currentSlide.title}</span>
                {currentSlide.portalUrl && (
                  <Link
                    href={currentSlide.portalUrl}
                    target="_blank"
                    className="flex items-center gap-1 text-blue-400 hover:underline"
                  >
                    Abrir Pestaña <Maximize2 className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </div>

            {/* Interactive Portal Canvas Container */}
            <div className="relative w-full h-[65vh] rounded-3xl border border-white/15 bg-slate-950 overflow-hidden shadow-2xl">
              {currentSlide.portalUrl ? (
                <iframe
                  src={currentSlide.portalUrl}
                  className="w-full h-full border-none pointer-events-auto"
                  title={currentSlide.portalName}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <GraduationCap className="h-16 w-16 text-blue-400 animate-pulse mb-4" />
                  <h3 className="text-2xl font-bold text-white">Cargando Módulo...</h3>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER / SLIDE NAVIGATION STRIP */}
      <footer className="relative z-50 border-t border-white/10 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Previous / Next buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-bold text-slate-300 transition-all"
          >
            <ChevronLeft className="h-4 w-4" /> Anterior
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-500/20 transition-all"
          >
            Siguiente <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Thumbnail Slide Selector Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-xl py-1 px-2 scrollbar-none">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentIndex(idx);
                setProgress(0);
              }}
              title={s.portalName}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-8 bg-blue-400 shadow-md shadow-blue-400/50"
                  : "w-2.5 bg-slate-700 hover:bg-slate-500"
              }`}
            />
          ))}
        </div>

        {/* Investor Footer Tagline */}
        <div className="text-right text-[11px] text-slate-400 font-medium">
          ISkool Academic © 2026 · Confidential Investor Presentation
        </div>
      </footer>

    </div>
  );
}
