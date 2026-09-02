import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SchoolSettings, DetailedStudent, Group, ClassSchedule, Attendance, ParentMessage, Subject, UserProfile, Campus, TuitionPricing, FamilyBillingRecord, Institution } from '../types';
import { DETAILED_STUDENTS_SEED, GROUPS_SEED, SCHEDULES_SEED, ATTENDANCE_SEED, PARENT_MESSAGES_SEED, TEACHERS_LIST_SEED, SUBJECTS_SEED, CAMPUSES_SEED, TUITION_PRICINGS_SEED, BILLING_RECORDS_SEED, INSTITUTIONS_SEED } from './seeds';
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

export const getTuitionFeeForStudent = (
  level: string, 
  grade: string, 
  tuitionPricings: TuitionPricing[] = TUITION_PRICINGS_SEED
): number => {
  const lvlLower = (level || '').toLowerCase();
  const gradeNum = parseInt(grade || '1');

  if (lvlLower.includes('primaria')) {
    if (gradeNum >= 4) {
      const alta = tuitionPricings.find(p => p.level === 'primaria_alta');
      return alta?.monthly_fee || 3450.00;
    } else {
      const baja = tuitionPricings.find(p => p.level === 'primaria_baja');
      return baja?.monthly_fee || 3200.00;
    }
  }
  if (lvlLower.includes('secundaria')) {
    const sec = tuitionPricings.find(p => p.level === 'secundaria');
    return sec?.monthly_fee || 3800.00;
  }
  const prep = tuitionPricings.find(p => p.level === 'preparatoria');
  return prep?.monthly_fee || 4100.00;
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

// ==========================================
// FUNCIONES DE PARTICIONADO Y AISLAMIENTO ESCOLAR (MULTI-COLEGIO)
// ==========================================

export const getSchoolCampuses = (campusesList: Campus[], schoolId: string | null): Campus[] => {
  const allCampuses = (campusesList && campusesList.length > 0) ? campusesList : CAMPUSES_SEED;
  if (!schoolId) return allCampuses;

  const filtered = allCampuses.filter(c => {
    if (c.school_id) return c.school_id === schoolId;
    if (schoolId === 'sch-jjrosseau') {
      return !c.name.toLowerCase().includes('montessori') && !c.name.toLowerCase().includes('demo') && !c.name.toLowerCase().includes('laboratorio');
    }
    if (schoolId === 'sch-test-case') {
      return c.name.toLowerCase().includes('demo') || c.name.toLowerCase().includes('laboratorio') || c.id.includes('test');
    }
    return false;
  });

  if (filtered.length === 0) {
    if (schoolId === 'sch-jjrosseau') {
      return CAMPUSES_SEED.filter(c => c.school_id === 'sch-jjrosseau');
    }
    if (schoolId === 'sch-test-case') {
      return CAMPUSES_SEED.filter(c => c.school_id === 'sch-test-case');
    }
  }

  return filtered;
};

export const getSchoolStudents = (studentsList: DetailedStudent[], schoolId: string | null, schoolCampuses?: Campus[]): DetailedStudent[] => {
  const allStudents = (studentsList && studentsList.length > 0) ? studentsList : DETAILED_STUDENTS_SEED;
  if (!schoolId) return allStudents;

  const filtered = allStudents.filter(s => {
    // Si tiene school_id explícito
    if (s.school_id) {
      if (s.school_id !== schoolId) return false;
      if (schoolId === 'sch-jjrosseau') {
        const isPrepa = s.level === 'preparatoria' || (s.grade || '').toLowerCase().includes('semestre') || (s.group_id || '').includes('prep');
        return !isPrepa && (s.level === 'primaria' || s.level === 'secundaria');
      }
      return true;
    }

    // Colegio Test Case / Demo
    if (schoolId === 'sch-test-case') {
      const isTestPrep = s.level === 'preparatoria' || (s.grade || '').toLowerCase().includes('semestre') || (s.group_id || '').includes('prep');
      const isTestId = s.id === 'std-pb' || s.id === 'std-pa' || s.id === 'std-sec' || s.id === 'std-prep' || s.id.includes('test') || (s.campus_name || '').toLowerCase().includes('demo');
      return isTestPrep || isTestId;
    }

    // UP Juan Jacobo Rosseau: Solo Primaria y Secundaria oficiales
    if (schoolId === 'sch-jjrosseau') {
      const isTest = s.id === 'std-pb' || s.id === 'std-pa' || s.id === 'std-sec' || s.id === 'std-prep' || s.id.includes('test');
      const isOther = (s.campus_name || '').toLowerCase().includes('montessori') || (s.campus_name || '').toLowerCase().includes('demo');
      const isPrepa = s.level === 'preparatoria' || (s.grade || '').toLowerCase().includes('semestre') || (s.group_id || '').includes('prep');
      return !isTest && !isOther && !isPrepa && (s.level === 'primaria' || s.level === 'secundaria');
    }

    // Cualquier otra institución
    if (schoolCampuses && schoolCampuses.length > 0) {
      return schoolCampuses.some(c => c.name.toLowerCase() === (s.campus_name || '').toLowerCase() || c.id === s.campus_id);
    }
    return false;
  });

  return filtered.map(s => {
    if (s.campus_name && s.campus_name !== 'Primaria Jardines') return s;
    if (s.level === 'secundaria') return { ...s, campus_name: 'Secundaria Torres' };
    if (s.level === 'primaria') {
      const gradeNum = parseInt(s.grade || '1');
      return { ...s, campus_name: gradeNum >= 4 ? 'Primaria Torres' : 'Primaria Jardines' };
    }
    if (s.level === 'preparatoria') return { ...s, campus_name: 'Campus Laboratorio Demo' };
    return s;
  });
};

export const getSchoolTeachers = (teachersList: UserProfile[], schoolId: string | null, schoolCampuses?: Campus[]): UserProfile[] => {
  const allTeachers = (teachersList && teachersList.length > 0) ? teachersList : TEACHERS_LIST_SEED;
  if (!schoolId) return allTeachers;

  const filtered = allTeachers.filter(t => {
    if (t.school_id) return t.school_id === schoolId;
    if (schoolId === 'sch-test-case') {
      return t.id?.includes('test') || t.first_name.toLowerCase().includes('test') || t.last_name.toLowerCase().includes('test') || (t.campus_name || '').toLowerCase().includes('demo');
    }
    if (schoolId === 'sch-jjrosseau') {
      const isTest = t.id?.includes('test') || t.first_name.toLowerCase().includes('test') || t.last_name.toLowerCase().includes('test');
      const isOther = (t.campus_name || '').toLowerCase().includes('montessori') || (t.campus_name || '').toLowerCase().includes('demo');
      return !isTest && !isOther;
    }
    if (schoolCampuses && schoolCampuses.length > 0) {
      return schoolCampuses.some(c => c.name.toLowerCase() === (t.campus_name || '').toLowerCase() || t.campus_name === 'Todos los Planteles');
    }
    return false;
  });

  if (filtered.length === 0 && schoolId === 'sch-jjrosseau') {
    return TEACHERS_LIST_SEED;
  }

  return filtered;
};

export const getSchoolGroups = (groupsList: Group[], schoolId: string | null, schoolCampuses?: Campus[]): Group[] => {
  const allGroups = (groupsList && groupsList.length > 0) ? groupsList : GROUPS_SEED;
  if (!schoolId) return allGroups;

  const filtered = allGroups.filter(g => {
    if (g.school_id) return g.school_id === schoolId;
    if (schoolCampuses && schoolCampuses.length > 0) {
      return schoolCampuses.some(c => c.name.toLowerCase() === (g.campus_name || '').toLowerCase() || c.id === g.campus_id);
    }
    if (schoolId === 'sch-jjrosseau') {
      return !g.campus_name?.toLowerCase().includes('montessori') && !g.campus_name?.toLowerCase().includes('demo');
    }
    return false;
  });

  if (filtered.length === 0 && schoolId === 'sch-jjrosseau') {
    return GROUPS_SEED;
  }

  return filtered;
};

export const getSchoolSubjects = (subjectsList: Subject[], schoolId: string | null, schoolCampuses?: Campus[]): Subject[] => {
  const allSubjects = (subjectsList && subjectsList.length > 0) ? subjectsList : SUBJECTS_SEED;
  if (!schoolId) return allSubjects;

  const filtered = allSubjects.filter(sub => {
    if (sub.school_id) return sub.school_id === schoolId;
    if (schoolId === 'sch-test-case') {
      return sub.campus_name?.toLowerCase().includes('demo') || sub.id.includes('test');
    }
    if (schoolId === 'sch-jjrosseau') {
      return !sub.campus_name?.toLowerCase().includes('montessori') && !sub.campus_name?.toLowerCase().includes('demo');
    }
    if (schoolCampuses && schoolCampuses.length > 0) {
      return schoolCampuses.some(c => c.name.toLowerCase() === (sub.campus_name || '').toLowerCase() || sub.campus_name === 'Todos los Planteles');
    }
    return false;
  });

  if (filtered.length === 0 && schoolId === 'sch-jjrosseau') {
    return SUBJECTS_SEED;
  }

  return filtered;
};

interface SchoolAdminStoreState {
  institutionsList: Institution[];
  activeSchoolId: string | null; // null = Directorio General Multi-Colegios
  schoolSettings: SchoolSettings;
  campusesList: Campus[];
  detailedStudents: DetailedStudent[];
  groupsList: Group[];
  schedulesList: ClassSchedule[];
  subjectsList: Subject[];
  teachersList: UserProfile[];
  attendanceList: Attendance[];
  parentMessages: ParentMessage[];
  tuitionPricings: TuitionPricing[];
  billingRecords: FamilyBillingRecord[];
  syncError: string | null;

  // Multi-School Actions
  selectSchool: (schoolId: string | null) => void;
  createInstitution: (instData: {
    name: string;
    tagline?: string;
    cct: string;
    logoUrl?: string;
    address?: string;
    phone?: string;
    website?: string;
    coordinatorName?: string;
    campusesCount?: number;
    initialPlanteles?: Array<{ name: string; level: 'primaria' | 'secundaria' | 'preparatoria'; address?: string }>;
  }) => Institution;
  updateInstitution: (schoolId: string, data: Partial<Institution>) => void;
  deleteInstitution: (schoolId: string) => void;

  // Financial and Tuition Actions
  updateTuitionPricing: (levelId: string, data: Partial<TuitionPricing>) => void;
  assignScholarship: (studentId: string, scholarship: { percentage: number; type?: string; notes?: string }) => void;
  recordBillingPayment: (recordId: string, paymentData?: { method?: string; reference?: string; notes?: string }) => void;
  createManualBillingCharge: (charge: Omit<FamilyBillingRecord, 'id' | 'invoiceNumber'>) => FamilyBillingRecord;

  // Actions
  saveSchoolSettings: (settings: SchoolSettings) => void;
  registerStudent: (studentData: Omit<DetailedStudent, 'id'>) => DetailedStudent;
  addStudent: (studentData: any) => DetailedStudent;
  bulkRegisterStudents: (studentsList: Array<Partial<DetailedStudent>>) => DetailedStudent[];
  generateGroupsForGrade: (level: 'primaria' | 'secundaria' | 'preparatoria', grade: string, groupNames: string[], campusName?: string) => void;
  assignStudentToGroup: (studentId: string, groupId: string) => void;
  createSchedule: (scheduleData: Omit<ClassSchedule, 'id'>) => void;
  deleteSchedule: (scheduleId: string) => Promise<void>;
  createGroup: (groupData: Partial<Group>) => Group;
  updateGroup: (groupId: string, data: Partial<Group>) => void;
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
      institutionsList: INSTITUTIONS_SEED,
      activeSchoolId: null,
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
      tuitionPricings: TUITION_PRICINGS_SEED,
      billingRecords: BILLING_RECORDS_SEED,
      syncError: null,

      selectSchool: (schoolId) => {
        set((state) => {
          if (!schoolId) {
            return { activeSchoolId: null };
          }
          const inst = (state.institutionsList || []).find(i => i.id === schoolId);
          if (inst && inst.settings) {
            applyThemeCssVariables(inst.settings.themeColors);
            return {
              activeSchoolId: schoolId,
              schoolSettings: inst.settings
            };
          }
          return { activeSchoolId: schoolId };
        });
      },

      createInstitution: (instData) => {
        const newId = `sch-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
        const initialCampusesCount = instData.initialPlanteles?.length || instData.campusesCount || 2;
        
        const newInstitution: Institution = {
          id: newId,
          name: instData.name.trim(),
          tagline: instData.tagline || 'Institución Educativa Oficial',
          cct: instData.cct.trim(),
          logoUrl: instData.logoUrl || '',
          isTestCase: false,
          status: 'active',
          createdAt: new Date().toISOString(),
          address: instData.address || 'Ciudad de México',
          phone: instData.phone || '55-0000-0000',
          website: instData.website || '',
          coordinatorName: instData.coordinatorName || 'Dirección General',
          campusesCount: initialCampusesCount,
          studentsCount: 0,
          teachersCount: 1,
          aiTokensConsumed: 0,
          currency: 'MXN',
          settings: {
            isConfigured: true,
            name: instData.name.trim(),
            website: instData.website || '',
            logoUrl: instData.logoUrl || '',
            cct: instData.cct.trim(),
            address: instData.address || 'Ciudad de México',
            phone: instData.phone || '55-0000-0000',
            coordinators: [instData.coordinatorName || 'Dirección General'],
            teachers: ['Prof. Coordinador Inicial'],
            themeColors: {
              primary: '221 83% 53%',
              secondary: '250 84% 54%',
              accent: '142 71% 45%'
            }
          }
        };

        // Crear planteles iniciales para el colegio
        const generatedCampuses: Campus[] = (instData.initialPlanteles || [
          { name: `Primaria ${instData.name}`, level: 'primaria' as const, address: instData.address },
          { name: `Secundaria ${instData.name}`, level: 'secundaria' as const, address: instData.address }
        ]).map((p, idx) => ({
          id: `cmp-${newId}-${idx}`,
          school_id: newId,
          name: p.name,
          level: p.level,
          grades: p.level === 'primaria' ? ['1º', '2º', '3º', '4º', '5º', '6º'] : ['1º', '2º', '3º'],
          address: p.address || instData.address,
          phone: instData.phone,
          created_at: new Date().toISOString()
        }));

        set((state) => ({
          institutionsList: [newInstitution, ...(state.institutionsList || [])],
          campusesList: [...generatedCampuses, ...(state.campusesList || [])],
          activeSchoolId: newId,
          schoolSettings: newInstitution.settings!
        }));

        return newInstitution;
      },

      updateInstitution: (schoolId, data) => {
        set((state) => {
          const updated = (state.institutionsList || []).map(inst => {
            if (inst.id === schoolId) {
              const currentSettings = inst.settings || state.schoolSettings;
              const updatedSettings: SchoolSettings = {
                ...currentSettings,
                name: data.name !== undefined ? data.name : (currentSettings.name || inst.name),
                cct: data.cct !== undefined ? data.cct : (currentSettings.cct || inst.cct),
                address: data.address !== undefined ? data.address : (currentSettings.address || inst.address || ''),
                phone: data.phone !== undefined ? data.phone : (currentSettings.phone || inst.phone || ''),
                website: data.website !== undefined ? data.website : (currentSettings.website || inst.website || ''),
                logoUrl: data.logoUrl !== undefined ? data.logoUrl : (currentSettings.logoUrl || inst.logoUrl || ''),
                coordinators: data.coordinatorName !== undefined ? [data.coordinatorName] : (currentSettings.coordinators || ['Dirección General'])
              };

              return {
                ...inst,
                ...data,
                settings: updatedSettings
              };
            }
            return inst;
          });

          // Si es el colegio activo o no hay colegio activo seleccionado, sincronizar schoolSettings
          let updatedSettings = state.schoolSettings;
          if (!state.activeSchoolId || state.activeSchoolId === schoolId) {
            const target = updated.find(i => i.id === schoolId);
            if (target?.settings) {
              updatedSettings = target.settings;
            }
          }

          return {
            institutionsList: updated,
            schoolSettings: updatedSettings
          };
        });
      },

      deleteInstitution: (schoolId) => {
        set((state) => ({
          institutionsList: (state.institutionsList || []).filter(i => i.id !== schoolId),
          activeSchoolId: state.activeSchoolId === schoolId ? null : state.activeSchoolId
        }));
      },

      updateTuitionPricing: (levelId, data) => {
        set((state) => {
          const updated = (state.tuitionPricings || TUITION_PRICINGS_SEED).map(p => 
            (p.id === levelId || p.level === levelId) ? { ...p, ...data } : p
          );
          return { tuitionPricings: updated };
        });
      },

      assignScholarship: (studentId, scholarship) => {
        set((state) => {
          const student = (state.detailedStudents || []).find(s => s.id === studentId);
          if (!student) return state;

          const updatedStudents = (state.detailedStudents || []).map(s => {
            if (s.id === studentId) {
              return {
                ...s,
                scholarship_percentage: scholarship.percentage,
                scholarship_type: (scholarship.type || 'academica') as any,
                scholarship_notes: scholarship.notes || ''
              };
            }
            return s;
          });

          // Recalcular o actualizar cargos pendientes de este alumno en billingRecords
          const updatedBilling = (state.billingRecords || []).map(rec => {
            if (rec.studentId === studentId && (rec.status === 'pending' || rec.status === 'overdue')) {
              const base = rec.baseAmount || rec.amount;
              const discount = (scholarship.percentage / 100) * base;
              const finalAmount = Math.max(0, base - discount);

              return {
                ...rec,
                baseAmount: base,
                scholarshipPercentage: scholarship.percentage,
                scholarshipType: scholarship.type || 'academica',
                discountAmount: discount,
                amount: finalAmount
              };
            }
            return rec;
          });

          return {
            detailedStudents: updatedStudents,
            billingRecords: updatedBilling
          };
        });
      },

      recordBillingPayment: (recordId, paymentData) => {
        set((state) => {
          const updatedRecords = (state.billingRecords || []).map(rec => {
            if (rec.id === recordId) {
              return {
                ...rec,
                status: 'paid' as const,
                paidAt: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
              };
            }
            return rec;
          });
          return { billingRecords: updatedRecords };
        });
      },

      createManualBillingCharge: (chargeData) => {
        const newRecord: FamilyBillingRecord = {
          ...chargeData,
          id: `inv-custom-${Date.now()}`,
          invoiceNumber: `COL-2026-${Math.floor(10000 + Math.random() * 90000)}`
        };

        set((state) => ({
          billingRecords: [newRecord, ...(state.billingRecords || [])]
        }));

        return newRecord;
      },

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
        const activeSchool = get().activeSchoolId || 'sch-jjrosseau';
        
        let campusName = studentData.campus_name || 'Primaria Jardines';
        if (studentData.level === 'secundaria' && !studentData.campus_name) {
          campusName = 'Secundaria Torres';
        }
        const campusObj = get().campusesList.find(c => c.name.toLowerCase() === campusName.toLowerCase());

        // Calcular costo de colegiatura según su nivel educativo
        const tuitionPricings = get().tuitionPricings || TUITION_PRICINGS_SEED;
        const baseFee = getTuitionFeeForStudent(studentData.level, studentData.grade, tuitionPricings);
        const discount = ((studentData.scholarship_percentage || 0) / 100) * baseFee;
        const finalAmount = Math.max(0, baseFee - discount);

        const newStudent: DetailedStudent = {
          ...studentData,
          id: newId,
          school_id: studentData.school_id || activeSchool,
          campus_id: campusObj?.id || 'cmp-pri-jardines',
          campus_name: campusName,
          temporary_password: tempPassword,
          status: studentData.status || 'activo',
          is_blocked: studentData.is_blocked || false,
          photo_url: studentData.photo_url || '/images/students/default.png',
          pending_payments: ['Colegiatura de Septiembre 2026']
        };

        // Generar folio de cobro en el portal de finanzas institucional
        const newBillingRecord: FamilyBillingRecord = {
          id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          invoiceNumber: `COL-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          studentId: newId,
          parentName: newStudent.tutor_name || newStudent.father_name || newStudent.mother_name || `${newStudent.last_name_1} ${newStudent.last_name_2 || ''}`.trim() || 'Tutor Familiar',
          parentPhone: newStudent.emergency_contact_phone || newStudent.phone || '55-4160-8800',
          parentEmail: newStudent.email ? `tutor.${newStudent.email}` : 'tutor@jjrosseau.edu.mx',
          studentName: `${newStudent.first_name} ${newStudent.second_name || ''} ${newStudent.last_name_1} ${newStudent.last_name_2 || ''}`.replace(/\s+/g, ' ').trim(),
          level: newStudent.level === 'primaria' ? 'Primaria' : newStudent.level === 'secundaria' ? 'Secundaria' : 'Preparatoria',
          grade: newStudent.grade,
          group: (newStudent.group_id || 'A').toUpperCase().includes('B') ? 'B' : 'A',
          concept: `Colegiatura de Septiembre 2026 - ${newStudent.level === 'primaria' ? 'Primaria' : newStudent.level === 'secundaria' ? 'Secundaria' : 'Preparatoria'} ${newStudent.grade}`,
          baseAmount: baseFee,
          scholarshipPercentage: newStudent.scholarship_percentage || 0,
          scholarshipType: newStudent.scholarship_type || 'ninguna',
          discountAmount: discount,
          amount: finalAmount,
          dueDate: '10 Septiembre 2026',
          status: 'pending',
          autoInvoice: true
        };

        set((state) => ({
          detailedStudents: [newStudent, ...(state.detailedStudents || [])],
          billingRecords: [newBillingRecord, ...(state.billingRecords || [])]
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
        const activeSchool = get().activeSchoolId || 'sch-jjrosseau';
        const createdList: DetailedStudent[] = [];
        const createdBilling: FamilyBillingRecord[] = [];
        const tuitionPricings = get().tuitionPricings || TUITION_PRICINGS_SEED;

        studentsList.forEach((st, idx) => {
          if (!st.first_name || !st.last_name_1) return;
          const newId = st.id || `std-bulk-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`;
          const tempPassword = st.temporary_password || generateRandomPassword(6);
          
          let campusName = st.campus_name || 'Primaria Jardines';
          if (st.level === 'secundaria' && !st.campus_name) {
            campusName = 'Secundaria Torres';
          }
          const campusObj = get().campusesList.find(c => c.name.toLowerCase() === campusName.toLowerCase());

          const baseFee = getTuitionFeeForStudent(st.level || 'primaria', st.grade || '1º', tuitionPricings);
          const discount = ((st.scholarship_percentage || 0) / 100) * baseFee;
          const finalAmount = Math.max(0, baseFee - discount);

          const newStudent: DetailedStudent = {
            id: newId,
            school_id: st.school_id || activeSchool,
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
            pending_payments: ['Colegiatura de Septiembre 2026'],
            behavior_reports: [],
            teacher_notes: []
          };

          createdList.push(newStudent);

          // Generar registro de cobro
          createdBilling.push({
            id: `inv-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
            invoiceNumber: `COL-2026-${Math.floor(10000 + Math.random() * 90000)}`,
            studentId: newId,
            parentName: newStudent.tutor_name || newStudent.father_name || newStudent.mother_name || `${newStudent.last_name_1} ${newStudent.last_name_2 || ''}`.trim() || 'Tutor Familiar',
            parentPhone: newStudent.emergency_contact_phone || newStudent.phone || '55-4160-8800',
            parentEmail: newStudent.email ? `tutor.${newStudent.email}` : 'tutor@jjrosseau.edu.mx',
            studentName: `${newStudent.first_name} ${newStudent.second_name || ''} ${newStudent.last_name_1} ${newStudent.last_name_2 || ''}`.replace(/\s+/g, ' ').trim(),
            level: newStudent.level === 'primaria' ? 'Primaria' : newStudent.level === 'secundaria' ? 'Secundaria' : 'Preparatoria',
            grade: newStudent.grade,
            group: (newStudent.group_id || 'A').toUpperCase().includes('B') ? 'B' : 'A',
            concept: `Colegiatura de Septiembre 2026 - ${newStudent.level === 'primaria' ? 'Primaria' : newStudent.level === 'secundaria' ? 'Secundaria' : 'Preparatoria'} ${newStudent.grade}`,
            baseAmount: baseFee,
            scholarshipPercentage: newStudent.scholarship_percentage || 0,
            scholarshipType: newStudent.scholarship_type || 'ninguna',
            discountAmount: discount,
            amount: finalAmount,
            dueDate: '10 Septiembre 2026',
            status: 'pending',
            autoInvoice: true
          });

          try {
            const studentStore = useStudentStore.getState();
            if (studentStore && typeof studentStore.initializeNewStudent === 'function') {
              studentStore.initializeNewStudent(newId, newStudent.first_name);
            }
          } catch (e) {}
        });

        set((state) => ({
          detailedStudents: [...createdList, ...(state.detailedStudents || [])],
          billingRecords: [...createdBilling, ...(state.billingRecords || [])]
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
        set((state) => {
          const updatedTeachers = (state.teachersList || []).map(t => 
            t.id === teacherId ? { ...t, ai_tokens_consumed: (t.ai_tokens_consumed || 0) + tokensUsed } : t
          );

          const updatedInstitutions = (state.institutionsList || []).map(inst => {
            if (state.activeSchoolId && inst.id === state.activeSchoolId) {
              return { ...inst, aiTokensConsumed: (inst.aiTokensConsumed || 0) + tokensUsed };
            }
            if (!state.activeSchoolId && !inst.isTestCase) {
              return { ...inst, aiTokensConsumed: (inst.aiTokensConsumed || 0) + tokensUsed };
            }
            return inst;
          });

          return {
            teachersList: updatedTeachers,
            institutionsList: updatedInstitutions
          };
        });
      },

      createCampus: (campusData) => {
        const activeSchool = get().activeSchoolId || 'sch-jjrosseau';
        const newCampus: Campus = {
          ...campusData,
          id: `cmp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          school_id: campusData.school_id || activeSchool,
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

      createGroup: (groupData) => {
        const activeSchool = get().activeSchoolId || 'sch-jjrosseau';
        const newGroup: Group = {
          id: groupData.id || `grp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          school_id: groupData.school_id || activeSchool,
          campus_id: groupData.campus_id,
          campus_name: groupData.campus_name || 'Primaria Jardines',
          level_grade_id: groupData.level_grade_id || 'lvl-pri-1',
          academic_year_id: groupData.academic_year_id || 'ay-2025-2026',
          name: groupData.name || 'A',
          grade: groupData.grade || '1º',
          level: groupData.level || 'primaria',
          student_ids: groupData.student_ids || [],
          created_at: new Date().toISOString()
        };
        set((state) => ({
          groupsList: [...(state.groupsList || []), newGroup]
        }));
        return newGroup;
      },

      updateGroup: (groupId, data) => {
        set((state) => ({
          groupsList: (state.groupsList || []).map(g => 
            g.id === groupId ? { ...g, ...data } : g
          )
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
    const activeSchool = get().activeSchoolId || 'sch-jjrosseau';
    const newSubject: Subject = {
      ...subjectData,
      id: `sub-${Date.now()}`,
      school_id: subjectData.school_id || activeSchool,
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
        const activeSchool = get().activeSchoolId || 'sch-jjrosseau';
        const newTeacher: UserProfile = {
          ...teacherData,
          id: `usr-teacher-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          school_id: teacherData.school_id || activeSchool,
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
          institutionsList: INSTITUTIONS_SEED,
          activeSchoolId: null,
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
          tuitionPricings: TUITION_PRICINGS_SEED,
          billingRecords: BILLING_RECORDS_SEED,
          syncError: null
        });
      }
    }),
    {
      name: 'iskool_school_admin_store',
      partialize: (state) => ({
        institutionsList: state.institutionsList,
        activeSchoolId: state.activeSchoolId,
        schoolSettings: state.schoolSettings,
        campusesList: state.campusesList,
        detailedStudents: state.detailedStudents,
        groupsList: state.groupsList,
        schedulesList: state.schedulesList,
        subjectsList: state.subjectsList,
        teachersList: state.teachersList,
        tuitionPricings: state.tuitionPricings,
        billingRecords: state.billingRecords
      })
    }
  )
);
