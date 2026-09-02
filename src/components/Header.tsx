"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStudentStore, useCurrentStudentStats } from '../store/useStudentStore';
import { useSchoolAdminStore, applyThemeCssVariables } from '../store/useSchoolAdminStore';
import { useGamificationStore } from '../store/useGamificationStore';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { Flame, Coins, Trophy, RefreshCw, GraduationCap, Users, User, ArrowRight, LogOut, HelpCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
export const Header: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  const activeStudentId = useStudentStore(state => state.activeStudentId);
  const switchStudent = useStudentStore(state => state.switchStudent);
  const stats = useCurrentStudentStats();
  const detailedStudents = useSchoolAdminStore(state => state.detailedStudents);
  const schoolSettings = useSchoolAdminStore(state => state.schoolSettings);

  useEffect(() => {
    if (schoolSettings?.themeColors) {
      applyThemeCssVariables(schoolSettings.themeColors);
    }
  }, [schoolSettings?.themeColors]);
  
  const studentsList = detailedStudents.map(ds => ({
    id: ds.id,
    first_name: ds.first_name,
    last_name: `${ds.last_name_1} ${ds.last_name_2 || ''}`.trim(),
    role: 'student' as const,
    email: ds.email || `${ds.first_name.toLowerCase()}@iskool.edu.mx`,
    created_at: ds.birth_date,
    updated_at: new Date().toISOString()
  }));

  const resetAllData = () => {
    useStudentStore.getState().resetStudentStore();
    usePortfolioStore.getState().resetPortfolioStore();
    useGamificationStore.getState().resetGamificationStore();
    useSchoolAdminStore.getState().resetSchoolAdminStore();
  };

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const getRoleFromPath = () => {
    if (pathname.startsWith('/student')) return 'student';
    if (pathname.startsWith('/teacher')) return 'teacher';
    if (pathname.startsWith('/parent')) return 'parent';
    if (pathname.startsWith('/coordinator')) return 'coordinator';
    return 'none';
  };

  const currentRole = getRoleFromPath();

  const isIsraelLopez = Boolean(
    user && (
      (user.email || '').toLowerCase().includes('israel') ||
      (user.first_name || '').toLowerCase().includes('israel') ||
      user.id === 'usr-teacher-1'
    )
  );

  const canSwitchRoles = user?.role === 'admin' || isIsraelLopez;

  const getStudentLevelLabel = (id: string) => {
    const studentProfile = detailedStudents?.find(s => s.id === id);
    if (!studentProfile) return 'Preparatoria';
    if (studentProfile.level === 'primaria') {
      const gradeNum = parseInt(studentProfile.grade);
      if (gradeNum <= 3) return 'Primaria Baja';
      return 'Primaria Alta';
    }
    if (studentProfile.level === 'secundaria') return 'Secundaria';
    return 'Preparatoria';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0 mr-6">
          {schoolSettings.logoUrl ? (
            <img 
              src={schoolSettings.logoUrl} 
              alt={schoolSettings.name || "Logo Institucional"} 
              className="h-9 w-9 object-contain rounded-lg"
            />
          ) : (
            <GraduationCap className="h-8 w-8" style={{ color: 'var(--brand-primary)' }} />
          )}
          <Link 
            href="/" 
            aria-label="Página de inicio de ISkool Académico"
            className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-baseline gap-2"
          >
            <span>{schoolSettings.name || 'ISkool'}</span>
            <span className="font-medium text-xs hidden sm:inline" style={{ color: 'var(--brand-primary)' }}>Académico</span>
          </Link>
        </div>

        {/* Navigation by Role */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Navegación principal">
          {currentRole === 'student' && (
            <>
              <Link
                href="/student"
                aria-label="Ir al mapa de misiones académicas"
                style={pathname === '/student' ? { color: 'var(--brand-primary)' } : undefined}
                className={`text-sm font-semibold transition-colors ${
                  pathname === '/student' ? '' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Misiones
              </Link>
              <Link
                href="/student/portfolio"
                aria-label="Ir a mi portafolio digital de evidencias"
                style={pathname === '/student/portfolio' ? { color: 'var(--brand-primary)' } : undefined}
                className={`text-sm font-semibold transition-colors ${
                  pathname === '/student/portfolio' ? '' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Mi Portafolio
              </Link>
              <Link
                href="/student/avatar"
                aria-label="Personalizar mi avatar y mascota"
                style={pathname === '/student/avatar' ? { color: 'var(--brand-primary)' } : undefined}
                className={`text-sm font-semibold transition-colors ${
                  pathname === '/student/avatar' ? '' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Avatar & Mascota
              </Link>
              <Link
                href="/student/shop"
                aria-label="Ir a la tienda de artefactos y mejoras"
                style={pathname === '/student/shop' ? { color: 'var(--brand-primary)' } : undefined}
                className={`text-sm font-semibold transition-colors ${
                  pathname === '/student/shop' ? '' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Tienda Mágica
              </Link>
            </>
          )}

          {currentRole === 'teacher' && (
            <>
              <Link
                href="/teacher"
                aria-label="Ir a planeaciones NEM y revisión de evidencias"
                style={pathname === '/teacher' ? { color: 'var(--brand-primary)' } : undefined}
                className={`text-sm font-semibold transition-colors ${
                  pathname === '/teacher' ? '' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Planeación & Portafolio
              </Link>
              <Link
                href="/teacher/studio"
                aria-label="Ir al estudio creador de actividades"
                style={pathname === '/teacher/studio' ? { color: 'var(--brand-primary)' } : undefined}
                className={`text-sm font-semibold transition-colors ${
                  pathname === '/teacher/studio' ? '' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Estudio Docente
              </Link>
              <Link
                href="/teacher/community"
                aria-label="Ir a la comunidad docente"
                style={pathname === '/teacher/community' ? { color: 'var(--brand-primary)' } : undefined}
                className={`text-sm font-semibold transition-colors ${
                  pathname === '/teacher/community' ? '' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Comunidad Docente
              </Link>
              <Link
                href="/teacher/grades"
                aria-label="Ir a boleta de calificaciones formativas SEP"
                style={pathname === '/teacher/grades' ? { color: 'var(--brand-primary)' } : undefined}
                className={`text-sm font-semibold transition-colors ${
                  pathname === '/teacher/grades' ? '' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Boleta SEP
              </Link>
            </>
          )}

          {currentRole === 'parent' && (
            <>
              <Link
                href="/parent"
                aria-label="Ver muro de evidencias y logros de mi hijo"
                style={pathname === '/parent' ? { color: 'var(--brand-primary)' } : undefined}
                className={`text-sm font-semibold transition-colors ${
                  pathname === '/parent' ? '' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Muro de Logros
              </Link>
              <Link
                href="/parent/financial"
                aria-label="Ir al estado de cuenta, pagos y facturación"
                style={pathname === '/parent/financial' ? { color: 'var(--brand-primary)' } : undefined}
                className={`text-sm font-semibold transition-colors ${
                  pathname === '/parent/financial' ? '' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Estado de Cuenta & Pagos
              </Link>
            </>
          )}

          {currentRole === 'coordinator' && (
            <>
              <Link
                href="/coordinator"
                aria-label="Ir a control escolar, grupos y horarios"
                style={pathname === '/coordinator' ? { color: 'var(--brand-primary)' } : undefined}
                className={`text-sm font-semibold transition-colors ${
                  pathname === '/coordinator' ? '' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Control Escolar
              </Link>
              <Link
                href="/coordinator/billing"
                aria-label="Ir al módulo de cobranza y conciliación"
                style={pathname === '/coordinator/billing' ? { color: 'var(--brand-primary)' } : undefined}
                className={`text-sm font-semibold transition-colors ${
                  pathname === '/coordinator/billing' ? '' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Cobranza
              </Link>
              <Link
                href="/coordinator/fiscal"
                aria-label="Ir a facturación SAT CFDI 4.0"
                style={pathname === '/coordinator/fiscal' ? { color: 'var(--brand-primary)' } : undefined}
                className={`text-sm font-semibold transition-colors ${
                  pathname === '/coordinator/fiscal' ? '' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Facturación SAT
              </Link>
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  aria-label="Ir al panel de administración general"
                  style={pathname === '/admin' ? { color: 'var(--brand-primary)' } : undefined}
                  className={`text-sm font-semibold transition-colors ${
                    pathname === '/admin' ? '' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                  }`}
                >
                  Panel Administrador
                </Link>
              )}
            </>
          )}

          {/* Enlace Global a Guía & Ayuda */}
          <Link
            href={`/guide${currentRole !== 'none' ? `?role=${currentRole}` : ''}`}
            aria-label="Ir a la guía y centro de ayuda"
            style={pathname === '/guide' ? { color: 'var(--brand-primary)' } : undefined}
            className={`text-sm font-semibold transition-colors flex items-center gap-1 ${
              pathname === '/guide' ? '' : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Guía</span>
          </Link>
        </nav>

        {/* Stats & Role Switcher */}
        <div className="flex items-center gap-4">
          {/* Quick Level Simulator (Solo para admin en demo) */}
          {currentRole === 'student' && user?.role === 'admin' && (
            <div className="flex items-center gap-1.5 bg-blue-50/50 dark:bg-blue-950/20 px-2 py-1 rounded-xl border border-blue-200/30 dark:border-blue-900/30">
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 px-1">Demo:</span>
              <select
                value={activeStudentId}
                aria-label="Seleccionar alumno activo para la simulación"
                onChange={(e) => switchStudent(e.target.value)}
                className="bg-transparent text-xs font-bold text-zinc-700 dark:text-zinc-200 border-none outline-none cursor-pointer pr-1 focus:ring-0"
              >
                {studentsList.map((std) => (
                  <option key={std.id} value={std.id} className="bg-white dark:bg-zinc-900 text-zinc-800 dark:text-white">
                    {std.first_name} ({getStudentLevelLabel(std.id)})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Stats for Student */}
          {currentRole === 'student' && (
            <div className="hidden md:flex items-center gap-3 bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-full text-xs font-semibold">
              <div className="flex items-center gap-1 text-amber-500" title="Racha de días activos">
                <Flame className="h-4 w-4 fill-current animate-pulse" />
                <span>{stats.current_streak} d</span>
              </div>
              <div className="h-3 w-px bg-zinc-300 dark:bg-zinc-700" />
              <div className="flex items-center gap-1 text-yellow-500" title="Monedas ganadas">
                <Coins className="h-4 w-4 fill-current" />
                <span>{stats.coins}</span>
              </div>
              <div className="h-3 w-px bg-zinc-300 dark:bg-zinc-700" />
              <div className="flex items-center gap-1 text-indigo-500" title="Nivel actual de personaje">
                <Trophy className="h-4 w-4" />
                <span>Nivel {stats.level}</span>
              </div>
            </div>
          )}

          {/* Student Profile Info Badge */}
          {user?.role === 'student' && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{user.first_name} {user.last_name}</span>
            </div>
          )}

          {/* Quick Role Selector (Para administradores y educadores con multi-módulo como Israel López) */}
          {canSwitchRoles && (
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-lg" role="group" aria-label="Cambio rápido de vista por rol">
              <Link
                href="/student"
                aria-label="Cambiar vista a Alumno"
                className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                  currentRole === 'student'
                    ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Alumno
              </Link>
              <Link
                href="/teacher"
                aria-label="Cambiar vista a Profesor"
                className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                  currentRole === 'teacher'
                    ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Profesor
              </Link>
              <Link
                href="/parent"
                aria-label="Cambiar vista a Tutor"
                className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                  currentRole === 'parent'
                    ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Tutor
              </Link>
              <Link
                href="/coordinator"
                aria-label="Cambiar vista a Coordinador"
                className={`px-2 py-1 rounded text-xs font-semibold transition-all ${
                  currentRole === 'coordinator'
                    ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Coordinador
              </Link>
            </div>
          )}

          {/* Reset Button */}
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            aria-label="Reiniciar datos de prueba"
            title="Reiniciar Datos"
            className="p-2 rounded-full text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          {/* Logout Button */}
          {user && (
            <button
              type="button"
              onClick={logout}
              aria-label="Cerrar sesión de usuario"
              title="Cerrar Sesión"
              className="p-2 rounded-full text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Custom Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl p-6 border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2 mb-2">
              ⚠️ ¿Restablecer Datos Simulados?
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
              Esta acción eliminará todos los alumnos registrados, grupos conformados y horarios creados durante esta sesión de prueba, restaurando las semillas originales. ¿Deseas continuar?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 border rounded-full text-xs font-bold text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setIsResetConfirmOpen(false);
                  window.location.reload();
                }}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs font-bold shadow-md shadow-red-500/10 transition-all"
              >
                Sí, restablecer
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
