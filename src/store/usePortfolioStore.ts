import { create } from 'zustand';
import { PortfolioItem, FeedbackAuthorRole, PortfolioItemStatus, PortfolioFeedback, UserProfile } from '../types';
import { PORTFOLIO_SEED, SUBJECTS_SEED, TEACHER_SEED, PARENT_SEED, STUDENTS_LIST_SEED, BADGES_SEED } from './seeds';
import { useStudentStore, normalizeStudentId, mapStudentIdToUuid } from './useStudentStore';
import { useGamificationStore } from './useGamificationStore';
import { useSchoolAdminStore } from './useSchoolAdminStore';
import { supabase } from '@/lib/supabaseClient';

const isUuid = (str?: string): boolean => {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
};

const ensureSubjectUuid = async (subjectId?: string): Promise<string> => {
  const defaultSub = 'b00a0eeb-9c0b-4ef8-bb6d-6bb9bd380e11'; // "Matemáticas"
  if (!subjectId) return defaultSub;
  if (isUuid(subjectId)) {
    const { data } = await supabase.from('subjects').select('id').eq('id', subjectId).maybeSingle();
    if (data) return subjectId;
  }
  
  const name = subjectId === 'sub-math' ? 'Matemáticas' : subjectId === 'sub-sci' ? 'Ciencias Naturales' : 'Español';
  const { data } = await supabase.from('subjects').select('id').eq('name', name).maybeSingle();
  if (data) return data.id;

  return defaultSub;
};

const ensureQuestUuid = async (questId?: string): Promise<string | null> => {
  if (!questId) return null;
  if (isUuid(questId)) {
    const { data } = await supabase.from('quests').select('id').eq('id', questId).maybeSingle();
    if (data) return questId;
  }
  
  if (questId === 'q-fractions-1' || questId === 'q-fractions-2') {
    return 'e00a0eeb-9c0b-4ef8-bb6d-69bad5a8a9ca';
  }
  if (questId === 'q-selva-1' || questId === 'q-selva-2' || questId === 'q-selva-3') {
    return 'e00a0eeb-9c0b-4ef8-bb6d-44072205c41a';
  }
  
  return null;
};

const normalizeSubjectId = (id: string): string => {
  if (id === 'b00a0eeb-9c0b-4ef8-bb6d-6bb9bd380e11') return 'sub-math';
  return id;
};

const normalizeQuestId = (id?: string | null): string => {
  if (!id) return '';
  if (id === 'e00a0eeb-9c0b-4ef8-bb6d-69bad5a8a9ca') return 'q-fractions-2';
  if (id === 'e00a0eeb-9c0b-4ef8-bb6d-44072205c41a') return 'q-selva-2';
  return id;
};

const mapAuthorIdToUuid = (id: string, role: string): string => {
  if (role === 'teacher') return 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a55';
  if (role === 'student' || role === 'peer') return mapStudentIdToUuid(id);
  if (isUuid(id)) return id;
  return 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a55';
};

let submissionsChannel: any = null;

interface PortfolioStoreState {
  portfolioItems: PortfolioItem[];
  isLoadingPortfolio: boolean;
  
  // Actions
  submitPortfolioItem: (
    title: string,
    description: string,
    fileUrl: string,
    fileType: any,
    selfReflection: string,
    questId?: string,
    subjectId?: string
  ) => Promise<void>;
  
  submitPortfolioItemOnBehalf: (
    studentId: string,
    title: string,
    description: string,
    fileUrl: string,
    fileType: any,
    selfReflection: string,
    questId?: string,
    subjectId?: string
  ) => Promise<void>;
  
  addPortfolioFeedback: (itemId: string, text: string, role: FeedbackAuthorRole, authorId: string) => void;
  addReaction: (itemId: string, roleCategory: string, emoji: string) => void;
  
  reviewPortfolioItem: (
    itemId: string,
    status: PortfolioItemStatus,
    comment: string,
    xpAward?: number,
    campos_formativos?: string[],
    pdas?: string[],
    ejes_articuladores?: string[],
    xp_breakdown?: {
      scientific?: number;
      critical?: number;
      collaborative?: number;
      communication?: number;
    }
  ) => void;
  
  linkPortfolioItemToQuest: (itemId: string, questId: string) => void;
  submitPeerReview: (itemId: string, score: number, comment: string) => void;
  fetchPortfolioItems: (groupId?: string) => Promise<void>;
  subscribeToPortfolioChanges: (onUpdateReceived?: (studentName?: string, questTitle?: string) => void) => void;
  unsubscribeFromPortfolioChanges: () => void;
  resetPortfolioStore: () => void;
}

export const usePortfolioStore = create<PortfolioStoreState>((set, get) => ({
  portfolioItems: PORTFOLIO_SEED,
  isLoadingPortfolio: false,

  submitPortfolioItem: async (title, description, fileUrl, fileType, selfReflection, questId, subjectId) => {
    const studentStore = useStudentStore.getState();
    const gamificationStore = useGamificationStore.getState();
    
    const activeStudentId = studentStore.activeStudentId;
    const currentStudent = STUDENTS_LIST_SEED.find(s => s.id === activeStudentId) || STUDENTS_LIST_SEED[1];
    
    const defaultSubjectId = subjectId || 'sub-math';
    const finalSubject = SUBJECTS_SEED.find(s => s.id === defaultSubjectId) || SUBJECTS_SEED[0];
    
    const quest = gamificationStore.missionsList.flatMap(m => m.quests || []).find(q => q.id === questId);

    try {
      const dbStudentId = mapStudentIdToUuid(activeStudentId);
      const dbSubjectId = await ensureSubjectUuid(defaultSubjectId);
      const dbQuestId = await ensureQuestUuid(questId);

      const { data, error } = await supabase
        .from('portfolio_items')
        .insert({
          student_id: dbStudentId,
          subject_id: dbSubjectId,
          quest_id: dbQuestId,
          title: title,
          description: description,
          file_url: fileUrl,
          file_type: fileType,
          status: 'submitted',
          self_reflection: selfReflection
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      const newItem: PortfolioItem = {
        id: data.id,
        student_id: activeStudentId,
        subject_id: defaultSubjectId,
        quest_id: questId,
        title: title,
        description: description,
        file_url: fileUrl,
        file_type: fileType,
        status: 'submitted',
        self_reflection: selfReflection,
        campos_formativos: quest?.campos_formativos,
        ejes_articuladores: quest?.ejes_articuladores,
        pdas: quest?.pdas,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
        student_profile: currentStudent,
        subject: finalSubject,
        feedbacks: []
      };

      set((state) => ({
        portfolioItems: [newItem, ...state.portfolioItems]
      }));

    } catch (err: any) {
      console.error('Error submitting portfolio item to Supabase:', err.message);
      
      // Fallback local update to keep UX working offline/on failure
      const newItem: PortfolioItem = {
        id: `port-${Date.now()}`,
        student_id: activeStudentId,
        subject_id: defaultSubjectId,
        quest_id: questId,
        title: title,
        description: description,
        file_url: fileUrl,
        file_type: fileType,
        status: 'submitted',
        self_reflection: selfReflection,
        campos_formativos: quest?.campos_formativos,
        ejes_articuladores: quest?.ejes_articuladores,
        pdas: quest?.pdas,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        student_profile: currentStudent,
        subject: finalSubject,
        feedbacks: []
      };

      set((state) => ({
        portfolioItems: [newItem, ...state.portfolioItems]
      }));
    }

    // Si es Elena (Secundaria), enlazar con la entrega del Gremio RPG automáticamente
    if (activeStudentId === 'std-sec') {
      gamificationStore.submitGuildHomework('std-sec', true);
    }

    // Recompensa de XP y monedas
    studentStore.addXpAndCoins(activeStudentId, 50, 10);

    // Medalla por subir audio
    if (fileType === 'audio' && !gamificationStore.studentBadges.some(sb => sb.badge_id === 'badge-2' && sb.student_id === activeStudentId)) {
      gamificationStore.unlockBadge(activeStudentId, 'badge-2');
    }
  },

  submitPortfolioItemOnBehalf: async (studentId, title, description, fileUrl, fileType, selfReflection, questId, subjectId) => {
    const studentStore = useStudentStore.getState();
    const gamificationStore = useGamificationStore.getState();
    const schoolAdminStore = useSchoolAdminStore.getState();

    const defaultSubjectId = subjectId || 'sub-math';
    const finalSubject = SUBJECTS_SEED.find(s => s.id === defaultSubjectId) || SUBJECTS_SEED[0];
    const quest = gamificationStore.missionsList.flatMap(m => m.quests || []).find(q => q.id === questId);

    const sDetail = schoolAdminStore.detailedStudents.find(ds => ds.id === studentId);
    const targetStudentProfile: UserProfile = sDetail ? {
      id: studentId,
      first_name: sDetail.first_name,
      last_name: `${sDetail.last_name_1} ${sDetail.last_name_2 || ''}`.trim(),
      role: 'student',
      email: sDetail.email || `${sDetail.first_name.toLowerCase()}@iskool.edu.mx`,
      created_at: sDetail.birth_date,
      updated_at: new Date().toISOString()
    } : {
      id: studentId,
      first_name: 'Estudiante',
      last_name: 'Simulado',
      role: 'student',
      email: 'student@iskool.edu.mx',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const dbStudentId = mapStudentIdToUuid(studentId);
      const dbSubjectId = await ensureSubjectUuid(defaultSubjectId);
      const dbQuestId = await ensureQuestUuid(questId);

      const { data, error } = await supabase
        .from('portfolio_items')
        .insert({
          student_id: dbStudentId,
          subject_id: dbSubjectId,
          quest_id: dbQuestId,
          title: title,
          description: description,
          file_url: fileUrl,
          file_type: fileType,
          status: 'submitted',
          self_reflection: selfReflection
        })
        .select()
        .single();

      if (error) throw new Error(error.message);

      const newItem: PortfolioItem = {
        id: data.id,
        student_id: studentId,
        subject_id: defaultSubjectId,
        quest_id: questId,
        title: title,
        description: description,
        file_url: fileUrl,
        file_type: fileType,
        status: 'submitted',
        self_reflection: selfReflection,
        campos_formativos: quest?.campos_formativos,
        ejes_articuladores: quest?.ejes_articuladores,
        pdas: quest?.pdas,
        created_at: data.created_at || new Date().toISOString(),
        updated_at: data.updated_at || new Date().toISOString(),
        student_profile: targetStudentProfile,
        subject: finalSubject,
        feedbacks: []
      };

      set((state) => ({
        portfolioItems: [newItem, ...state.portfolioItems]
      }));

    } catch (err: any) {
      console.error('Error submitting portfolio item on behalf to Supabase:', err.message);
      
      // Fallback
      const newItem: PortfolioItem = {
        id: `port-${Date.now()}`,
        student_id: studentId,
        subject_id: defaultSubjectId,
        quest_id: questId,
        title: title,
        description: description,
        file_url: fileUrl,
        file_type: fileType,
        status: 'submitted',
        self_reflection: selfReflection,
        campos_formativos: quest?.campos_formativos,
        ejes_articuladores: quest?.ejes_articuladores,
        pdas: quest?.pdas,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        student_profile: targetStudentProfile,
        subject: finalSubject,
        feedbacks: []
      };

      set((state) => ({
        portfolioItems: [newItem, ...state.portfolioItems]
      }));
    }

    studentStore.addXpAndCoins(studentId, 50, 10);
  },

  addPortfolioFeedback: (itemId, text, role, authorId) => {
    const studentStore = useStudentStore.getState();
    const activeStudentId = studentStore.activeStudentId;
    const currentStudent = STUDENTS_LIST_SEED.find(s => s.id === activeStudentId) || STUDENTS_LIST_SEED[1];

    let authorProfile: UserProfile = currentStudent;
    if (role === 'teacher') authorProfile = TEACHER_SEED;
    if (role === 'parent') authorProfile = PARENT_SEED;

    const newFeedback: PortfolioFeedback = {
      id: `fb-${Date.now()}`,
      portfolio_item_id: itemId,
      author_id: authorId,
      author_role: role,
      feedback_text: text,
      reactions: {},
      created_at: new Date().toISOString(),
      author_profile: authorProfile
    };

    set((state) => ({
      portfolioItems: state.portfolioItems.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            feedbacks: [...(item.feedbacks || []), newFeedback],
            updated_at: new Date().toISOString()
          };
        }
        return item;
      })
    }));

    if (isUuid(itemId)) {
      const dbAuthorId = mapAuthorIdToUuid(authorId, role);
      supabase
        .from('portfolio_feedback')
        .insert({
          portfolio_item_id: itemId,
          author_id: dbAuthorId,
          author_role: role,
          feedback_text: text,
          reactions: {}
        })
        .then(({ error }) => {
          if (error) console.error('Error inserting feedback to Supabase:', error.message);
        });
    }
  },

  addReaction: (itemId, roleCategory, emoji) => {
    set((state) => ({
      portfolioItems: state.portfolioItems.map(item => {
        if (item.id === itemId) {
          const updatedFeedbacks = item.feedbacks ? [...item.feedbacks] : [];
          if (updatedFeedbacks.length > 0) {
            const firstFb = { ...updatedFeedbacks[0] };
            const currentReactions = firstFb.reactions[roleCategory] || [];
            if (!currentReactions.includes(emoji)) {
              firstFb.reactions = {
                ...firstFb.reactions,
                [roleCategory]: [...currentReactions, emoji]
              };
              updatedFeedbacks[0] = firstFb;
            }
          }
          return {
            ...item,
            feedbacks: updatedFeedbacks,
            updated_at: new Date().toISOString()
          };
        }
        return item;
      })
    }));
  },

  reviewPortfolioItem: (itemId, status, comment, xpAward = 100, campos_formativos, pdas, ejes_articuladores, xp_breakdown) => {
    const newFeedback: PortfolioFeedback = {
      id: `fb-${Date.now()}`,
      portfolio_item_id: itemId,
      author_id: TEACHER_SEED.id,
      author_role: 'teacher',
      feedback_text: comment,
      reactions: { teacher: ['👏', '⭐'] },
      created_at: new Date().toISOString(),
      author_profile: TEACHER_SEED
    };

    let targetStudentId = '';

    set((state) => ({
      portfolioItems: state.portfolioItems.map(item => {
        if (item.id === itemId) {
          targetStudentId = item.student_id;
          return {
            ...item,
            status: status,
            feedbacks: [...(item.feedbacks || []), newFeedback],
            campos_formativos,
            pdas,
            ejes_articuladores,
            xp_breakdown,
            updated_at: new Date().toISOString()
          };
        }
        return item;
      })
    }));

    if (status === 'approved' && targetStudentId) {
      const studentStore = useStudentStore.getState();
      studentStore.addXpAndCoins(targetStudentId, xpAward, 20);
    }

    if (isUuid(itemId)) {
      supabase
        .from('portfolio_items')
        .update({ status: status })
        .eq('id', itemId)
        .then(({ error }) => {
          if (error) console.error('Error updating portfolio item status:', error.message);
        });

      supabase
        .from('portfolio_feedback')
        .insert({
          portfolio_item_id: itemId,
          author_id: 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a55',
          author_role: 'teacher',
          feedback_text: comment,
          reactions: { teacher: ['👏', '⭐'] }
        })
        .then(({ error }) => {
          if (error) console.error('Error inserting feedback to Supabase:', error.message);
        });
    }
  },

  linkPortfolioItemToQuest: (itemId, questId) => {
    const gamificationStore = useGamificationStore.getState();
    const quest = gamificationStore.missionsList.flatMap(m => m.quests || []).find(q => q.id === questId);
    
    set((state) => ({
      portfolioItems: state.portfolioItems.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            quest_id: questId,
            campos_formativos: quest?.campos_formativos || item.campos_formativos,
            ejes_articuladores: quest?.ejes_articuladores || item.ejes_articuladores,
            pdas: quest?.pdas || item.pdas,
            updated_at: new Date().toISOString()
          };
        }
        return item;
      })
    }));

    if (isUuid(itemId)) {
      ensureQuestUuid(questId).then(dbQuestId => {
        if (dbQuestId) {
          supabase
            .from('portfolio_items')
            .update({ quest_id: dbQuestId })
            .eq('id', itemId)
            .then(({ error }) => {
              if (error) console.error('Error linking item to quest on Supabase:', error.message);
            });
        }
      });
    }
  },

  submitPeerReview: (itemId, score, comment) => {
    const studentStore = useStudentStore.getState();
    const gamificationStore = useGamificationStore.getState();
    const activeStudentId = studentStore.activeStudentId;

    set((state) => ({
      portfolioItems: state.portfolioItems.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            peer_review_score: score,
            peer_review_comments: comment,
            updated_at: new Date().toISOString()
          };
        }
        return item;
      })
    }));

    // Recompensa al coevaluador
    studentStore.addXpAndCoins(activeStudentId, 100, 15);

    // Desbloquear medalla de Compañero Estelar (badge-5)
    if (!gamificationStore.studentBadges.some(sb => sb.badge_id === 'badge-5' && sb.student_id === activeStudentId)) {
      gamificationStore.unlockBadge(activeStudentId, 'badge-5');
    }

    if (isUuid(itemId)) {
      supabase
        .from('portfolio_items')
        .update({
          peer_review_score: score,
          peer_review_comments: comment
        })
        .eq('id', itemId)
        .then(({ error }) => {
          if (error) console.error('Error updating peer review on Supabase:', error.message);
        });
    }
  },

  fetchPortfolioItems: async (groupId) => {
    set({ isLoadingPortfolio: true });
    try {
      const schoolAdminStore = useSchoolAdminStore.getState();
      let query = supabase
        .from('portfolio_items')
        .select(`
          *,
          portfolio_feedback (
            *,
            profiles:author_id (
              id,
              first_name,
              last_name,
              role,
              email
            )
          )
        `);

      const studentStore = useStudentStore.getState();
      const activeStudentId = studentStore.activeStudentId;

      if (groupId) {
        const groupStudents = schoolAdminStore.detailedStudents
          .filter(s => s.group_id === groupId)
          .map(s => mapStudentIdToUuid(s.id));
          
        if (groupStudents.length > 0) {
          query = query.in('student_id', groupStudents);
        } else {
          set({ portfolioItems: [], isLoadingPortfolio: false });
          return;
        }
      } else if (activeStudentId) {
        const dbStudentId = mapStudentIdToUuid(activeStudentId);
        query = query.eq('student_id', dbStudentId);
      }

      const response = await query;
      if (response.error) throw new Error(response.error.message);

      const mappedItems = (response.data || []).map((dbItem: any) => {
        const studentId = normalizeStudentId(dbItem.student_id);
        const subjectId = normalizeSubjectId(dbItem.subject_id);
        const questId = normalizeQuestId(dbItem.quest_id);

        const currentStudent = STUDENTS_LIST_SEED.find(s => s.id === studentId) || {
          id: studentId,
          first_name: 'Estudiante',
          last_name: 'Desconocido',
          role: 'student' as any,
          email: `${studentId}@iskool.edu.mx`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const finalSubject = SUBJECTS_SEED.find(s => s.id === subjectId) || SUBJECTS_SEED[0];

        const feedbacks = (dbItem.portfolio_feedback || []).map((fb: any) => {
          const authorProfile: UserProfile = fb.profiles ? {
            id: fb.profiles.id,
            first_name: fb.profiles.first_name,
            last_name: fb.profiles.last_name || '',
            role: fb.profiles.role,
            email: fb.profiles.email || '',
            created_at: fb.created_at,
            updated_at: fb.created_at
          } : {
            id: fb.author_id,
            first_name: 'Usuario',
            last_name: 'Desconocido',
            role: fb.author_role,
            email: '',
            created_at: fb.created_at,
            updated_at: fb.created_at
          };

          return {
            id: fb.id,
            portfolio_item_id: fb.portfolio_item_id,
            author_id: fb.author_id,
            author_role: fb.author_role,
            feedback_text: fb.feedback_text,
            reactions: fb.reactions || {},
            created_at: fb.created_at,
            author_profile: authorProfile
          } as PortfolioFeedback;
        });

        return {
          id: dbItem.id,
          student_id: studentId,
          subject_id: subjectId,
          quest_id: questId,
          title: dbItem.title,
          description: dbItem.description,
          file_url: dbItem.file_url,
          file_type: dbItem.file_type,
          status: dbItem.status,
          self_reflection: dbItem.self_reflection,
          peer_review_score: dbItem.peer_review_score,
          peer_review_comments: dbItem.peer_review_comments,
          created_at: dbItem.created_at,
          updated_at: dbItem.updated_at,
          student_profile: currentStudent,
          subject: finalSubject,
          feedbacks: feedbacks
        } as PortfolioItem;
      });

      set({ portfolioItems: mappedItems });
    } catch (err: any) {
      console.error('Error fetching portfolio items:', err.message);
    } finally {
      set({ isLoadingPortfolio: false });
    }
  },

  subscribeToPortfolioChanges: (onUpdateReceived) => {
    if (submissionsChannel) return;
    
    submissionsChannel = supabase
      .channel('custom-portfolio-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'portfolio_items' }, async (payload) => {
        console.log("Realtime portfolio item change received:", payload);
        
        await get().fetchPortfolioItems();
        
        if (onUpdateReceived) {
          let studentName = undefined;
          let questTitle = undefined;
          
          if (payload.eventType === 'INSERT') {
            const studentStore = useStudentStore.getState();
            const gamificationStore = useGamificationStore.getState();
            
            const studentId = normalizeStudentId(payload.new.student_id);
            const questId = normalizeQuestId(payload.new.quest_id);
            
            const currentStudent = STUDENTS_LIST_SEED.find(s => s.id === studentId) || {
              first_name: 'Alumno',
              last_name: 'Desconocido'
            };
            studentName = `${currentStudent.first_name} ${currentStudent.last_name}`;
            
            const quest = questId ? gamificationStore.missionsList.flatMap(m => m.quests || []).find(q => q.id === questId) : null;
            questTitle = payload.new.title || quest?.title || 'Desafío del Gremio';
          }
          
          onUpdateReceived(studentName, questTitle);
        }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'portfolio_feedback' }, async (payload) => {
        console.log("Realtime portfolio feedback received:", payload);
        
        await get().fetchPortfolioItems();
        
        if (onUpdateReceived) {
          onUpdateReceived();
        }
      })
      .subscribe();
  },

  unsubscribeFromPortfolioChanges: () => {
    if (submissionsChannel) {
      supabase.removeChannel(submissionsChannel);
      submissionsChannel = null;
    }
  },

  resetPortfolioStore: () => {
    set({
      portfolioItems: PORTFOLIO_SEED,
      isLoadingPortfolio: false
    });
  }
}));
