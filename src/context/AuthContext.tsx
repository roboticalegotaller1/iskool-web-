"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { UserProfile } from '@/types';
import { useRouter } from 'next/navigation';
import { STUDENTS_LIST_SEED, TEACHER_SEED, PARENT_SEED } from '@/store/seeds';

import { useSchoolAdminStore } from '@/store/useSchoolAdminStore';

interface AuthContextType {
  session: any | null;
  user: UserProfile | null;
  loading: boolean;
  login: (email: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getDemoUser = (email: string): UserProfile => {
  const emailLower = email.toLowerCase().trim();

  // 1. Verificar si coincide con profesores registrados en el Super Usuario
  try {
    const adminTeachers = useSchoolAdminStore.getState().teachersList || [];
    const matchedTeacher = adminTeachers.find(t => 
      t.email.toLowerCase() === emailLower || 
      t.id === emailLower ||
      `${t.first_name.toLowerCase()}.${t.last_name.toLowerCase()}` === emailLower.replace('@jjrosseau.edu.mx', '')
    );
    if (matchedTeacher) {
      return {
        ...matchedTeacher,
        role: 'teacher'
      };
    }
  } catch {
    // fallback si store no está montado
  }

  if (emailLower.includes('admin') || emailLower.includes('vega') || emailLower.includes('director')) {
    return {
      id: 'usr-admin-1',
      first_name: 'Carlos',
      last_name: 'Vega (Dirección General)',
      role: 'admin',
      email: emailLower,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
  if (emailLower.includes('coord') || emailLower.includes('morales') || emailLower.includes('beatriz')) {
    return {
      id: 'usr-coord-1',
      first_name: 'Beatriz',
      last_name: 'Morales (Coordinación)',
      role: 'coordinator',
      email: emailLower,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }
  if (emailLower === TEACHER_SEED.email.toLowerCase() || emailLower.includes('teacher') || emailLower.includes('prof') || emailLower.includes('docente') || emailLower.includes('israel.lopez')) {
    return TEACHER_SEED;
  }
  if (emailLower === PARENT_SEED.email.toLowerCase() || emailLower.includes('parent') || emailLower.includes('tutor') || emailLower.includes('ejemplo') || emailLower.includes('familia')) {
    return PARENT_SEED;
  }
  const matchedStudent = STUDENTS_LIST_SEED.find(s => s.email.toLowerCase() === emailLower);
  if (matchedStudent) return matchedStudent;

  // Fallback inteligente para cualquier correo ingresado
  const nameParts = emailLower.split('@')[0].split('.');
  const firstName = nameParts[0] ? nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1) : 'Usuario';
  const lastName = nameParts[1] ? nameParts[1].charAt(0).toUpperCase() + nameParts[1].slice(1) : 'Escolar';

  return {
    id: `usr-custom-${Date.now()}`,
    first_name: firstName,
    last_name: lastName,
    role: 'student',
    email: emailLower,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Check session on load
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error && (error.message?.includes('JWT') || error.message?.includes('future'))) {
          console.warn("Stale or skewed JWT detected on startup, clearing session:", error.message);
          await supabase.auth.signOut().catch(() => {});
        }
        const initialSession = data?.session;
        if (initialSession?.user) {
          setSession(initialSession);
          setUser({
            id: initialSession.user.id,
            first_name: initialSession.user.user_metadata?.first_name || 'Usuario',
            last_name: initialSession.user.user_metadata?.last_name || '',
            role: (initialSession.user.user_metadata?.role || 'student') as any,
            email: initialSession.user.email || '',
            created_at: initialSession.user.created_at,
            updated_at: new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn("Supabase auth offline fallback:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth state updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ? {
        id: currentSession.user.id,
        first_name: currentSession.user.user_metadata?.first_name || 'Usuario',
        last_name: currentSession.user.user_metadata?.last_name || '',
        role: (currentSession.user.user_metadata?.role || 'student') as any,
        email: currentSession.user.email || '',
        created_at: currentSession.user.created_at,
        updated_at: new Date().toISOString()
      } : null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    const password = 'ISkoolPassword2026!';
    const resolvedUser = getDemoUser(email);
    
    if (resolvedUser.is_blocked) {
      setLoading(false);
      return { 
        success: false, 
        error: '⛔ Esta cuenta ha sido bloqueada o cancelada por la Dirección Escolar en el Portal de Super Usuario.' 
      };
    }

    try {
      // 1. Intentar autenticación remota
      const signInResult = await supabase.auth.signInWithPassword({ email, password }).catch(() => null);
      
      let userObj: any = null;
      let sessionObj: any = null;

      if (signInResult && !signInResult.error && signInResult.data?.user) {
        userObj = signInResult.data.user;
        sessionObj = signInResult.data.session;
      } else {
        // Modo libre inmediato: Si falla o hay rate limit, entrar de forma fluida con el usuario local
        userObj = {
          id: resolvedUser.id,
          email: resolvedUser.email,
          created_at: resolvedUser.created_at,
          user_metadata: {
            first_name: resolvedUser.first_name,
            last_name: resolvedUser.last_name,
            role: resolvedUser.role
          }
        };
        sessionObj = {
          access_token: 'mock-token-free-access-session',
          user: userObj
        };
      }

      setSession(sessionObj);
      setUser({
        id: userObj.id,
        first_name: userObj.user_metadata?.first_name || resolvedUser.first_name,
        last_name: userObj.user_metadata?.last_name || resolvedUser.last_name,
        role: (userObj.user_metadata?.role || resolvedUser.role) as any,
        email: userObj.email || resolvedUser.email,
        created_at: userObj.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      setLoading(false);
      return { success: true };
    } catch (err: any) {
      console.warn("Acceso libre activado de contingencia:", err);
      setUser(resolvedUser);
      setSession({
        access_token: 'mock-token-free-access-contingency',
        user: {
          id: resolvedUser.id,
          email: resolvedUser.email,
          user_metadata: {
            first_name: resolvedUser.first_name,
            last_name: resolvedUser.last_name,
            role: resolvedUser.role
          }
        }
      });
      setLoading(false);
      return { success: true };
    }
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setLoading(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
