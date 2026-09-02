import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SchoolSettings, DetailedStudent, Group, ClassSchedule, Attendance, ParentMessage, Subject, UserProfile, Campus } from '../types';
import { DETAILED_STUDENTS_SEED, GROUPS_SEED, SCHEDULES_SEED, ATTENDANCE_SEED, PARENT_MESSAGES_SEED, TEACHERS_LIST_SEED, SUBJECTS_SEED, CAMPUSES_SEED } from './seeds';
import { useStudentStore } from './useStudentStore';
import { supabase } from '@/lib/supabaseClient';

export const generateRandomPassword = (length = 6): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const isUuid = (str?: string): boolean => {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
};

const mapGroupIdToUuid = (id: string): string => {
  if (isUuid(id)) return id;
  if (id === 'grp-pb-a' || id === 'grp-jar-1a') return 'a00a0eeb-9c0b-4ef8-bb6d-6bb9bd380e11';
  if (id === 'grp-pa-a' || id === 'grp-jar-4a') return 'a00a0eeb-9c0b-4ef8-bb6d-6bb9bd380e22';
  if (id === 'grp-sec-a' || id === 'grp-sec-2a') return 'a00a0eeb-9c0b-4ef8-bb6d-6bb9bd380e33';
  if (id === 'grp-prep-a' || id === 'grp-sec-3a') return 'a00a0eeb-9c0b-4ef8-bb6d-6bb9bd380e44';
  
  let hash1 = 0;
  let hash2 = 0;
  for (let i = 0; i < id.length; i++) {
    hash1 = id.charCodeAt(i) + ((hash1 << 5) - hash1);
    hash2 = id.charCodeAt(id.length - 1 - i) + ((hash2 << 5) - hash2);
  }
  let hex = '';
  for (let i = 0; i < 4; i++) {
    hex += ('00' + ((hash1 >> (i * 8)) & 0xff).toString(16)).slice(-2);
  }
  for (let i = 0; i < 2; i++) {
    hex += ('00' + ((hash2 >> (i * 8)) & 0xff).toString(16)).slice(-2);
  }
  return 'a00a0eeb-9c0b-4ef8-bb6d-' + hex;
};

interface SchoolAdminStoreState {
  schoolSettings: SchoolSettings;
  campusesList: Campus[];
  detailedStudents: DetailedStudent[];
  groupsList: Group[];
  schedulesList: ClassSchedule[];
  subjectsList: Subject[];
  teachersList: UserProfile[];
  attendanceList: Attendance[];
  parentMessages: ParentMessage[];
  syncError: string | null;

  // Actions
  saveSchoolSettings: (settings: SchoolSettings) => void;
  registerStudent: (studentData: Omit<DetailedStudent, 'id'>) => DetailedStudent;
  addStudent: (studentData: any) => DetailedStudent;
  bulkRegisterStudents: (studentsList: Array<Partial<DetailedStudent>>) => DetailedStudent[];
  generateGroupsForGrade: (level: 'primaria' | 'secundaria' | 'preparatoria', grade: string, groupNames: string[], campusName?: string) => void;
  assignStudentToGroup: (studentId: string, groupId: string) => void;
  createSchedule: (scheduleData: Omit<ClassSchedule, 'id'>) => void;
  deleteSchedule: (scheduleId: string) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;
  saveAttendanceList: (records: Omit<Attendance, 'id' | 'created_at' | 'registered_by'>[]) => void;
  sendParentMessage: (msg: Omit<ParentMessage, 'id' | 'sent_at' | 'is_read'>) => void;
  replyToParentMessage: (messageId: string, replyText: string) => void;
  markMessageAsRead: (messageId: string) => void;
  createSubject: (subjectData: Omit<Subject, 'id' | 'created_at'>) => void;
  deleteSubject: (subjectId: string) => Promise<void>;
  updateGroupAnnualPlan: (subjectId: string, groupId: string, planData: Partial<import('@/types').GroupAnnualPlan>) => void;
  updateSubjectSyllabus: (subjectId: string, topics: import('@/types').SyllabusTopic[]) => void;
  registerTeacher: (teacherData: Omit<UserProfile, 'id' | 'role' | 'created_at' | 'updated_at'>) => void;
  updateTeacher: (teacherId: string, updatedData: Partial<UserProfile>) => void;
  deleteTeacher: (teacherId: string) => void;

  // Super User Security Actions
  toggleUserBlock: (userId: string, role: 'teacher' | 'student', isBlocked: boolean) => void;
  changeUserPassword: (userId: string, role: 'teacher' | 'student', newPassword?: string) => string;
  incrementTeacherTokens: (teacherId: string, tokensUsed: number) => void;
  
  // Campus Management
  createCampus: (campus: Omit<Campus, 'id' | 'created_at'>) => void;
  updateCampus: (campusId: string, data: Partial<Campus>) => void;
  deleteCampus: (campusId: string) => void;

  updateStudentStatus: (studentId: string, status: 'activo' | 'suspendido' | 'baja') => void;
  updateStudent: (studentId: string, updatedData: Partial<DetailedStudent>) => void;
  addTeacherNote: (studentId: string, note: { id?: string; date: string; note: string; teacher_name: string; parent_reply?: string; replied_at?: string }) => void;
  addBehaviorReport: (studentId: string, report: { id?: string; date: string; description: string; reporter: string; parent_reply?: string; replied_at?: string }) => void;
  deleteBehaviorReport: (studentId: string, index: number) => void;
  deleteTeacherNote: (studentId: string, index: number) => void;
  
  resetSchoolAdminStore: () => void;
}

export const applyThemeCssVariables = (themeColors?: { primary: string; secondary: string; accent: string }) => {
  if (typeof window === 'undefined' || !themeColors) return;
  try {
    const root = document.documentElement;
    root.style.setProperty('--color-primary-hsl', themeColors.primary);
    root.style.setProperty('--color-secondary-hsl', themeColors.secondary);
    root.style.setProperty('--color-accent-hsl', themeColors.accent);

    root.style.setProperty('--color-primary', `hsl(${themeColors.primary})`);
    root.style.setProperty('--color-secondary', `hsl(${themeColors.secondary})`);
    root.style.setProperty('--color-accent', `hsl(${themeColors.accent})`);

    root.style.setProperty('--color-brand-primary', `hsl(${themeColors.primary})`);
    root.style.setProperty('--color-brand-secondary', `hsl(${themeColors.secondary})`);
    root.style.setProperty('--color-brand-accent', `hsl(${themeColors.accent})`);

    root.style.setProperty('--brand-primary', `hsl(${themeColors.primary})`);
    root.style.setProperty('--brand-secondary', `hsl(${themeColors.secondary})`);
    root.style.setProperty('--brand-accent', `hsl(${themeColors.accent})`);
  } catch (e) {
    console.warn('Error setting theme CSS variables:', e);
  }
};

let saveSettingsTimeout: NodeJS.Timeout | null = null;

export const useSchoolAdminStore = create<SchoolAdminStoreState>()(
  persist(
    (set, get) => ({
      schoolSettings: {
        isConfigured: true,
        name: 'UP Juan Jacobo Rosseau',
        website: 'https://jjrosseau.edu.mx',
        logoUrl: '',
        cct: '09PPR2026R',
        address: 'Calzada de los Filósofos 1712, Col. Del Valle, Ciudad de México',
        phone: '55-4160-8800',
        coordinators: ['Lic. Alejandro Valdés', 'Mtra. Patricia Mendoza'],
        teachers: ['Prof. Israel López', 'Profa. María Fernández', 'Prof. Roberto Díaz', 'Profa. Carmen Morales', 'Prof. David Navarrete', 'Profa. Elena Salazar', 'Prof. Fernando Rangel'],
        themeColors: {
          primary: '221 83% 53%',
          secondary: '250 84% 54%',
          accent: '142 71% 45%'
        }
      },
      campusesList: CAMPUSES_SEED,
      detailedStudents: DETAILED_STUDENTS_SEED,
      groupsList: GROUPS_SEED,
      schedulesList: SCHEDULES_SEED,
      subjectsList: SUBJECTS_SEED,
      teachersList: TEACHERS_LIST_SEED,
      attendanceList: ATTENDANCE_SEED,
      parentMessages: PARENT_MESSAGES_SEED,
      syncError: null,

      saveSchoolSettings: (settings) => {
        applyThemeCssVariables(settings.themeColors);
        set({ schoolSettings: settings, syncError: null });

        if (saveSettingsTimeout) clearTimeout(saveSettingsTimeout);

        saveSettingsTimeout = setTimeout(async () => {
          try {
            const dbSettings = {
              name: settings.name,
              website: settings.website || '',
              logo_url: settings.logoUrl || '',
              cct: settings.cct || '',
              address: settings.address || '',
              phone: settings.phone || '',
              coordinators: settings.coordinators || [],
              teachers: settings.teachers || [],
              theme_colors: settings.themeColors,
              is_configured: settings.isConfigured
            };

            await supabase
              .from('school_settings')
              .upsert({
                id: '00000000-0000-0000-0000-000000000000',
                ...dbSettings,
                updated_at: new Date().toISOString()
              });
          } catch (err) {
            console.warn('Silent local fallback for school settings save:', err);
          }
        }, 1000);
      },

      registerStudent: (studentData) => {
        const newId = (studentData as any).id || `std-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const tempPassword = studentData.temporary_password || generateRandomPassword(6);
        
        let campusName = studentData.campus_name || 'Primaria Jardines';
        if (studentData.level === 'secundaria' && !studentData.campus_name) {
          campusName = 'Secundaria Torres';
        }
        const campusObj = get().campusesList.find(c => c.name.toLowerCase() === campusName.toLowerCase());

        const newStudent: DetailedStudent = {
          ...studentData,
          id: newId,
          campus_id: campusObj?.id || 'cmp-pri-jardines',
          campus_name: campusName,
          temporary_password: tempPassword,
          status: studentData.status || 'activo',
          is_blocked: studentData.is_blocked || false,
          photo_url: studentData.photo_url || '/images/students/default.png'
        };

        set((state) => ({
          detailedStudents: [newStudent, ...(state.detailedStudents || [])]
        }));

        try {
          const studentStore = useStudentStore.getState();
          if (studentStore && typeof studentStore.initializeNewStudent === 'function') {
            studentStore.initializeNewStudent(newId, studentData.first_name);
          }
        } catch (e) {
          console.warn('Could not initialize student stats:', e);
        }

        (async () => {
          try {
            await supabase.from('students').insert({
              id: isUuid(newId) ? newId : undefined,
              school_id: '00000000-0000-0000-0000-000000000000',
              first_name: newStudent.first_name,
              last_name: `${newStudent.last_name_1} ${newStudent.last_name_2 || ''}`.trim(),
              curp: newStudent.curp || '',
              grade: newStudent.grade,
              created_at: new Date().toISOString()
            });
          } catch (e) {}
        })();

        return newStudent;
      },

      addStudent: (studentData) => {
        return get().registerStudent(studentData);
      },

      bulkRegisterStudents: (studentsList) => {
        const createdList: DetailedStudent[] = [];

        studentsList.forEach((st, idx) => {
          if (!st.first_name || !st.last_name_1) return;
          const newId = st.id || `std-bulk-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`;
          const tempPassword = st.temporary_password || generateRandomPassword(6);
          
          let campusName = st.campus_name || 'Primaria Jardines';
          if (st.level === 'secundaria' && !st.campus_name) {
            campusName = 'Secundaria Torres';
          }
          const campusObj = get().campusesList.find(c => c.name.toLowerCase() === campusName.toLowerCase());

          const newStudent: DetailedStudent = {
            id: newId,
            first_name: st.first_name.trim(),
            second_name: st.second_name?.trim() || '',
            last_name_1: st.last_name_1.trim(),
            last_name_2: st.last_name_2?.trim() || '',
            birth_date: st.birth_date || '2016-01-01',
            curp: st.curp || `${st.last_name_1.substring(0, 2).toUpperCase()}${st.first_name.substring(0, 2).toUpperCase()}160101HDFMRN01`,
            enrollment_id: st.enrollment_id || `MAT-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
            gender: st.gender || 'No especificado',
            shift: st.shift || 'matutino',
            status: 'activo',
            is_blocked: false,
            temporary_password: tempPassword,
            level: st.level || 'primaria',
            grade: st.grade || '1º',
            group_id: st.group_id || 'grp-jar-1a',
            campus_id: campusObj?.id || 'cmp-pri-jardines',
            campus_name: campusName,
            email: st.email || `${st.first_name.toLowerCase().replace(/[^a-z0-9]/g, '')}.${st.last_name_1.toLowerCase().replace(/[^a-z0-9]/g, '')}@jjrosseau.edu.mx`,
            phone: st.phone || '55-0000-0000',
            address: st.address || 'Ciudad de México',
            photo_url: '/images/students/default.png',
            pending_payments: [],
            behavior_reports: [],
            teacher_notes: []
          };

          createdList.push(newStudent);

          try {
            const studentStore = useStudentStore.getState();
            if (studentStore && typeof studentStore.initializeNewStudent === 'function') {
              studentStore.initializeNewStudent(newId, newStudent.first_name);
            }
          } catch (e) {}
        });

        set((state) => ({
          detailedStudents: [...createdList, ...(state.detailedStudents || [])]
        }));

        return createdList;
      },

      toggleUserBlock: (userId, role, isBlocked) => {
        if (role === 'teacher') {
          set((state) => ({
            teachersList: (state.teachersList || []).map(t => 
              t.id === userId ? { ...t, is_blocked: isBlocked } : t
            )
          }));
        } else {
          set((state) => ({
            detailedStudents: (state.detailedStudents || []).map(s => 
              s.id === userId ? { ...s, is_blocked: isBlocked, status: isBlocked ? 'suspendido' : 'activo' } : s
            )
          }));
        }
      },

      changeUserPassword: (userId, role, newPassword) => {
        const passwordToSet = newPassword && newPassword.trim().length >= 4 
          ? newPassword.trim() 
          : generateRandomPassword(6);

        if (role === 'teacher') {
          set((state) => ({
            teachersList: (state.teachersList || []).map(t => 
              t.id === userId ? { ...t, temporary_password: passwordToSet } : t
            )
          }));
        } else {
          set((state) => ({
            detailedStudents: (state.detailedStudents || []).map(s => 
              s.id === userId ? { ...s, temporary_password: passwordToSet } : s
            )
          }));
        }

        return passwordToSet;
      },

      incrementTeacherTokens: (teacherId, tokensUsed) => {
        set((state) => ({
          teachersList: (state.teachersList || []).map(t => 
            t.id === teacherId ? { ...t, ai_tokens_consumed: (t.ai_tokens_consumed || 0) + tokensUsed } : t
          )
        }));
      },

      createCampus: (campusData) => {
        const newCampus: Campus = {
          ...campusData,
          id: `cmp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          created_at: new Date().toISOString()
        };
        set((state) => ({
          campusesList: [...(state.campusesList || []), newCampus]
        }));
      },

      updateCampus: (campusId, data) => {
        set((state) => ({
          campusesList: (state.campusesList || []).map(c => 
            c.id === campusId ? { ...c, ...data } : c
          )
        }));
      },

      deleteCampus: (campusId) => {
        set((state) => ({
          campusesList: (state.campusesList || []).filter(c => c.id !== campusId)
        }));
      },

  updateStudentStatus: (studentId, status) => {
    set((state) => ({
      detailedStudents: (state.detailedStudents || []).map(s => 
        s.id === studentId ? { ...s, status } : s
      )
    }));
  },

  updateStudent: (studentId, updatedData) => {
    set((state) => ({
      detailedStudents: (state.detailedStudents || []).map(s => 
        s.id === studentId ? { ...s, ...updatedData } : s
      )
    }));
  },

  addTeacherNote: (studentId, note) => {
    set((state) => {
      const student = (state.detailedStudents || []).find(s => s.id === studentId);
      const studentName = student ? `${student.first_name} ${student.last_name_1}` : 'El Alumno';

      const notificationMsg: ParentMessage = {
        id: `msg-tnote-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        parent_id: 'prt-1',
        student_id: studentId,
        student_name: studentName,
        teacher_id: 'tch-1',
        teacher_name: note.teacher_name || 'Profesor',
        subject_id: 'sub-general',
        subject_name: 'Observación Docente',
        message: `📋 NOTA DE PROFESOR (${note.teacher_name}): "${note.note}"`,
        sent_at: new Date().toISOString(),
        is_read: false
      };

      return {
        detailedStudents: (state.detailedStudents || []).map(s => 
          s.id === studentId ? { ...s, teacher_notes: [note, ...(s.teacher_notes || [])] } : s
        ),
        parentMessages: [notificationMsg, ...(state.parentMessages || [])]
      };
    });
  },

  addBehaviorReport: (studentId, report) => {
    set((state) => {
      const student = (state.detailedStudents || []).find(s => s.id === studentId);
      const studentName = student ? `${student.first_name} ${student.last_name_1}` : 'El Alumno';

      const notificationMsg: ParentMessage = {
        id: `msg-brep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        parent_id: 'prt-1',
        student_id: studentId,
        student_name: studentName,
        teacher_id: 'tch-1',
        teacher_name: report.reporter || 'Coordinación Académica',
        subject_id: 'sub-behavior',
        subject_name: 'Reporte de Conducta',
        message: `⚠️ REPORTE DE CONDUCTA (${report.reporter}): ${report.description}`,
        sent_at: new Date().toISOString(),
        is_read: false
      };

      return {
        detailedStudents: (state.detailedStudents || []).map(s => 
          s.id === studentId ? { ...s, behavior_reports: [report, ...(s.behavior_reports || [])] } : s
        ),
        parentMessages: [notificationMsg, ...(state.parentMessages || [])]
      };
    });
  },

  deleteBehaviorReport: (studentId, index) => {
    set((state) => ({
      detailedStudents: (state.detailedStudents || []).map(s => {
        if (s.id === studentId) {
          const reports = [...(s.behavior_reports || [])];
          reports.splice(index, 1);
          return { ...s, behavior_reports: reports };
        }
        return s;
      })
    }));
  },

  deleteTeacherNote: (studentId, index) => {
    set((state) => ({
      detailedStudents: (state.detailedStudents || []).map(s => {
        if (s.id === studentId) {
          const notes = [...(s.teacher_notes || [])];
          notes.splice(index, 1);
          return { ...s, teacher_notes: notes };
        }
        return s;
      })
    }));
  },

  generateGroupsForGrade: (level, grade, groupNames) => {
    set((state) => {
      const activeLevelGradeKey = `${level}-${grade.replace(/\s+/g, '')}`;
      
      // Buscar grupos existentes para este nivel y grado
      const existingForGrade = state.groupsList.filter(g => 
        g.level_grade_id === activeLevelGradeKey || 
        (g.level === level && g.grade === grade)
      );

      const existingNamesMap = new Map<string, Group>();
      existingForGrade.forEach(g => existingNamesMap.set(g.name.toUpperCase(), g));

      const updatedGroupsList = [...state.groupsList];

      // 1. Asegurar que los grupos solicitados existan (ej. 'A' y 'B')
      groupNames.forEach((name, idx) => {
        const upperName = name.toUpperCase();
        if (!existingNamesMap.has(upperName)) {
          const newGrp: Group = {
            id: `grp-${level.slice(0, 3)}-${grade.replace(/[^0-9a-zA-Z]/g, '')}-${upperName.toLowerCase()}-${Date.now()}-${idx}`,
            school_id: 'sch-1',
            level_grade_id: activeLevelGradeKey,
            academic_year_id: 'ay-25-26',
            name: upperName,
            level,
            grade,
            student_ids: [],
            created_at: new Date().toISOString()
          };
          updatedGroupsList.push(newGrp);
          existingNamesMap.set(upperName, newGrp);
        } else {
          // Asegurar que level_grade_id y level/grade estén actualizados
          const existingGroup = existingNamesMap.get(upperName)!;
          const gIdx = updatedGroupsList.findIndex(g => g.id === existingGroup.id);
          if (gIdx !== -1) {
            updatedGroupsList[gIdx] = {
              ...updatedGroupsList[gIdx],
              level_grade_id: activeLevelGradeKey,
              level,
              grade
            };
            existingNamesMap.set(upperName, updatedGroupsList[gIdx]);
          }
        }
      });

      // Si no es la conformación automática de A y B (ej. creación de grupo C individual)
      const isAutoAB = groupNames.length === 2 && 
        groupNames.map(n => n.toUpperCase()).includes('A') && 
        groupNames.map(n => n.toUpperCase()).includes('B');

      if (!isAutoAB) {
        return { groupsList: updatedGroupsList };
      }

      // 2. Conformación e igualación automática de Grupos A y B
      const groupA = existingNamesMap.get('A');
      const groupB = existingNamesMap.get('B');

      if (!groupA || !groupB) return { groupsList: updatedGroupsList };

      // Obtener TODOS los alumnos correspondientes a este nivel y grado
      const gradeStudents = state.detailedStudents.filter(s => {
        const studentLevel = s.level || (parseInt(s.grade || '1') <= 6 ? 'primaria' : 'secundaria');
        return studentLevel === level && (s.grade === grade || (!s.grade && grade === '1º'));
      });

      const studentIdsA: string[] = [];
      const studentIdsB: string[] = [];
      const updatedDetailedStudents = [...state.detailedStudents];

      // Distribuir alternadamente 50% / 50% entre Grupo A y Grupo B
      gradeStudents.forEach((student, index) => {
        const targetGroup = (index % 2 === 0) ? groupA : groupB;
        if (index % 2 === 0) {
          studentIdsA.push(student.id);
        } else {
          studentIdsB.push(student.id);
        }

        const sIdx = updatedDetailedStudents.findIndex(st => st.id === student.id);
        if (sIdx !== -1) {
          updatedDetailedStudents[sIdx] = {
            ...updatedDetailedStudents[sIdx],
            group_id: targetGroup.id,
            level,
            grade
          };
        }
      });

      // Actualizar listas de student_ids en los grupos A y B
      const finalGroupsList = updatedGroupsList.map(g => {
        if (g.id === groupA.id) {
          return { ...g, student_ids: studentIdsA, level_grade_id: activeLevelGradeKey, level, grade };
        }
        if (g.id === groupB.id) {
          return { ...g, student_ids: studentIdsB, level_grade_id: activeLevelGradeKey, level, grade };
        }
        // Si hay otros grupos en el mismo grado (ej. C), remover a los alumnos asignados a A o B
        if (g.level_grade_id === activeLevelGradeKey || (g.level === level && g.grade === grade)) {
          return { ...g, student_ids: (g.student_ids || []).filter((id: string) => !studentIdsA.includes(id) && !studentIdsB.includes(id)) };
        }
        return g;
      });

      return {
        groupsList: finalGroupsList,
        detailedStudents: updatedDetailedStudents
      };
    });
  },

  assignStudentToGroup: (studentId, groupId) => {
    set((state) => ({
      detailedStudents: state.detailedStudents.map(s => 
        s.id === studentId ? { ...s, group_id: groupId || undefined } : s
      ),
      groupsList: state.groupsList.map(g => {
        const studentIds = g.student_ids || [];
        const hasStudent = studentIds.includes(studentId);
        if (g.id === groupId && !hasStudent) {
          return { ...g, student_ids: [...studentIds, studentId] };
        } else if (g.id !== groupId && hasStudent) {
          return { ...g, student_ids: studentIds.filter((id: string) => id !== studentId) };
        }
        return g;
      })
    }));
  },

  createSchedule: (scheduleData) => {
    const newSchedule: ClassSchedule = {
      ...scheduleData,
      id: `sch-${Date.now()}`
    };
    set((state) => ({
      schedulesList: [...state.schedulesList, newSchedule]
    }));
  },

  deleteSchedule: async (scheduleId) => {
    set({ syncError: null });
    try {
      set((state) => ({
        schedulesList: state.schedulesList.filter(s => s.id !== scheduleId)
      }));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al eliminar el horario';
      console.error('Error deleting schedule:', err);
      set({ syncError: errorMsg });
    }
  },

  deleteGroup: async (groupId) => {
    set({ syncError: null });
    try {
      set((state) => ({
        groupsList: state.groupsList.filter(g => g.id !== groupId),
        detailedStudents: state.detailedStudents.map(s => 
          s.group_id === groupId ? { ...s, group_id: undefined } : s
        ),
        schedulesList: state.schedulesList.filter(s => s.groupId !== groupId)
      }));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al eliminar el grupo';
      console.error('Error deleting group:', err);
      set({ syncError: errorMsg });
    }
  },

  saveAttendanceList: (records) => {
    const timestamp = new Date().toISOString();
    const registered_by = 'usr-teacher-1';

    set((state) => {
      const cleanPrev = state.attendanceList.filter(att => {
        const isSameGroupAndSubjectAndDate = records.some(rec => 
          rec.date === att.date && 
          rec.group_id === att.group_id && 
          rec.subject_id === att.subject_id &&
          rec.student_id === att.student_id
        );
        return !isSameGroupAndSubjectAndDate;
      });

      const newRecords: Attendance[] = records.map((rec, idx) => ({
        ...rec,
        id: `att-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 4)}`,
        registered_by,
        created_at: timestamp
      }));

      return {
        attendanceList: [...cleanPrev, ...newRecords]
      };
    });
  },

  sendParentMessage: (msgData) => {
    const newMsg: ParentMessage = {
      ...msgData,
      id: `msg-${Date.now()}`,
      sent_at: new Date().toISOString(),
      is_read: false
    };

    set((state) => ({
      parentMessages: [newMsg, ...state.parentMessages]
    }));
  },

  replyToParentMessage: (messageId, replyText) => {
    set((state) => {
      const now = new Date().toISOString();
      const targetMsg = (state.parentMessages || []).find(m => m.id === messageId);
      
      const updatedMessages = (state.parentMessages || []).map(msg => {
        if (msg.id === messageId) {
          return {
            ...msg,
            parent_reply: replyText,
            replied_at: now,
            is_read: true
          };
        }
        return msg;
      });

      let updatedStudents = state.detailedStudents || [];
      if (targetMsg) {
        updatedStudents = updatedStudents.map(student => {
          if (student.id !== targetMsg.student_id) return student;

          const updatedReports = (student.behavior_reports || []).map(rep => {
            if (targetMsg.subject_name === 'Reporte de Conducta' || targetMsg.id.startsWith('msg-brep')) {
              return { ...rep, parent_reply: replyText, replied_at: now };
            }
            return rep;
          });

          const updatedNotes = (student.teacher_notes || []).map(nt => {
            if (targetMsg.subject_name === 'Observación Docente' || targetMsg.id.startsWith('msg-tnote')) {
              return { ...nt, parent_reply: replyText, replied_at: now };
            }
            return nt;
          });

          return {
            ...student,
            behavior_reports: updatedReports,
            teacher_notes: updatedNotes
          };
        });
      }

      return {
        parentMessages: updatedMessages,
        detailedStudents: updatedStudents
      };
    });
  },

  markMessageAsRead: (messageId) => {
    set((state) => ({
      parentMessages: state.parentMessages.map(msg => 
        msg.id === messageId ? { ...msg, is_read: true } : msg
      )
    }));
  },

  createSubject: (subjectData) => {
    const newSubject: Subject = {
      ...subjectData,
      id: `sub-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    set((state) => ({
      subjectsList: [...state.subjectsList, newSubject]
    }));
  },

  deleteSubject: async (subjectId) => {
    set({ syncError: null });
    try {
      set((state) => ({
        subjectsList: state.subjectsList.filter(s => s.id !== subjectId),
        schedulesList: state.schedulesList.filter(s => s.subjectId !== subjectId)
      }));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al eliminar la materia';
      console.error('Error deleting subject:', err);
      set({ syncError: errorMsg });
    }
  },

  updateGroupAnnualPlan: (subjectId, groupId, planData) => {
    set((state) => ({
      subjectsList: (state.subjectsList || []).map((sub) => {
        if (sub.id !== subjectId) return sub;

        const currentPlans = sub.group_annual_plans || {};
        const currentGroupPlan = currentPlans[groupId] || {
          group_id: groupId,
          group_name: groupId,
          campus_name: 'General',
          grade: '1º',
          plan_title: `Planeación Anual - ${sub.name}`,
          term_1: '',
          term_2: '',
          term_3: '',
          updated_at: new Date().toISOString()
        };

        const updatedGroupPlan = {
          ...currentGroupPlan,
          ...planData,
          updated_at: new Date().toISOString()
        };

        return {
          ...sub,
          group_annual_plans: {
            ...currentPlans,
            [groupId]: updatedGroupPlan
          }
        };
      })
    }));
  },

  updateSubjectSyllabus: (subjectId, topics) => {
    set((state) => ({
      subjectsList: (state.subjectsList || []).map((sub) => 
        sub.id === subjectId ? { ...sub, syllabus_topics: topics } : sub
      )
    }));
  },

      registerTeacher: (teacherData) => {
        const newTeacher: UserProfile = {
          ...teacherData,
          id: `usr-teacher-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          role: 'teacher',
          ai_tokens_consumed: 0,
          is_blocked: false,
          temporary_password: generateRandomPassword(6),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        set((state) => ({
          teachersList: [...(state.teachersList || []), newTeacher],
          schoolSettings: {
            ...state.schoolSettings,
            teachers: Array.from(new Set([...(state.schoolSettings?.teachers || []), `${teacherData.first_name} ${teacherData.last_name}`]))
          }
        }));
      },

      updateTeacher: (teacherId, updatedData) => {
        set((state) => {
          const teachersList = state.teachersList || [];
          const target = teachersList.find(t => t.id === teacherId);
          if (!target) return state;

          const oldFullName = `${target.first_name} ${target.last_name}`;
          const newFirstName = updatedData.first_name ?? target.first_name;
          const newLastName = updatedData.last_name ?? target.last_name;
          const newFullName = `${newFirstName} ${newLastName}`;

          const updatedTeachersList = teachersList.map(t => 
            t.id === teacherId ? { ...t, ...updatedData, updated_at: new Date().toISOString() } : t
          );

          const currentTeachers = state.schoolSettings?.teachers || [];
          const updatedTeachersNames = currentTeachers.map(name => 
            name === oldFullName ? newFullName : name
          );

          return {
            teachersList: updatedTeachersList,
            schoolSettings: {
              ...state.schoolSettings,
              teachers: Array.from(new Set(updatedTeachersNames))
            }
          };
        });
      },

      deleteTeacher: (teacherId) => {
        set((state) => {
          const teachersList = state.teachersList || [];
          const target = teachersList.find(t => t.id === teacherId);
          if (!target) return state;
          const fullName = `${target.first_name} ${target.last_name}`;

          const updatedSchedulesList = (state.schedulesList || []).map(s => 
            s.teacherId === teacherId ? { ...s, teacherId: '' } : s
          );

          const currentTeachers = state.schoolSettings?.teachers || [];
          return {
            teachersList: teachersList.filter(t => t.id !== teacherId),
            schedulesList: updatedSchedulesList,
            schoolSettings: {
              ...state.schoolSettings,
              teachers: currentTeachers.filter(name => name !== fullName)
            }
          };
        });
      },

      resetSchoolAdminStore: () => {
        set({
          schoolSettings: {
            isConfigured: true,
            name: 'UP Juan Jacobo Rosseau',
            website: 'https://jjrosseau.edu.mx',
            logoUrl: '',
            cct: '09PPR2026R',
            address: 'Calzada de los Filósofos 1712, Col. Del Valle, Ciudad de México',
            phone: '55-4160-8800',
            coordinators: ['Lic. Alejandro Valdés', 'Mtra. Patricia Mendoza'],
            teachers: ['Prof. Israel López', 'Profa. María Fernández', 'Prof. Roberto Díaz', 'Profa. Carmen Morales', 'Prof. David Navarrete', 'Profa. Elena Salazar', 'Prof. Fernando Rangel'],
            themeColors: {
              primary: '221 83% 53%',
              secondary: '250 84% 54%',
              accent: '142 71% 45%'
            }
          },
          campusesList: CAMPUSES_SEED,
          detailedStudents: DETAILED_STUDENTS_SEED,
          groupsList: GROUPS_SEED,
          schedulesList: SCHEDULES_SEED,
          subjectsList: SUBJECTS_SEED,
          teachersList: TEACHERS_LIST_SEED,
          attendanceList: ATTENDANCE_SEED,
          parentMessages: PARENT_MESSAGES_SEED,
          syncError: null
        });
      }
    }),
    {
      name: 'iskool_school_admin_store',
      partialize: (state) => ({
        schoolSettings: state.schoolSettings,
        campusesList: state.campusesList,
        detailedStudents: state.detailedStudents,
        groupsList: state.groupsList,
        schedulesList: state.schedulesList,
        subjectsList: state.subjectsList,
        teachersList: state.teachersList
      })
    }
  )
);
