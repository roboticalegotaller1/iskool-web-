import { create } from 'zustand';
import { Mission, QuestAttempt, StudentBadge, GuildBoss, GuildMemberSubmission, ShopArtifact, Quest, Badge } from '../types';
import { MISSIONS_SEED, BOSS_SEED, GUILD_SUBMISSIONS_SEED, DEFAULT_ARTIFACTS_SEED, SUBJECTS_SEED, BADGES_SEED } from './seeds';
import { useStudentStore } from './useStudentStore';
import { supabase } from '@/lib/supabaseClient';

const isUuid = (str?: string): boolean => {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
};

const mapStudentIdToUuid = (id: string): string => {
  if (isUuid(id)) return id;
  if (id === 'std-pa') return 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a11';
  if (id === 'std-sec') return 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a22';
  if (id === 'std-pb') return 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a33';
  if (id === 'std-prep') return 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a44';
  return id;
};

const ensureSubjectExists = async (subjectId: string): Promise<string> => {
  if (isUuid(subjectId)) {
    const { data, error } = await supabase
      .from('subjects')
      .select('id')
      .eq('id', subjectId)
      .maybeSingle();

    if (error) throw new Error(`Error checking subject: ${error.message}`);
    if (data) return subjectId;
  }

  const name = subjectId === 'sub-math' ? 'Matemáticas' : subjectId === 'sub-sci' ? 'Ciencias Naturales' : 'Español';
  
  const { data: existingSubject, error: findError } = await supabase
    .from('subjects')
    .select('id')
    .eq('name', name)
    .maybeSingle();

  if (findError) throw new Error(`Error finding subject: ${findError.message}`);
  if (existingSubject) return existingSubject.id;

  const { data: newSubject, error: insertError } = await supabase
    .from('subjects')
    .insert({
      school_id: '00000000-0000-0000-0000-000000000000',
      level_grade_id: '1111c019-61c7-4097-8aca-03cc0c4db68a', // Default: Primaria 4º
      name: name,
      sep_code: subjectId.toUpperCase()
    })
    .select('id')
    .single();

  if (insertError) throw new Error(`Error inserting subject: ${insertError.message}`);
  return newSubject.id;
};

const ensureMissionExists = async (subjectId: string, missionId: string, missionsList: Mission[]): Promise<string> => {
  const subjectUuid = await ensureSubjectExists(subjectId);

  if (isUuid(missionId)) {
    const { data, error } = await supabase
      .from('missions')
      .select('id')
      .eq('id', missionId)
      .maybeSingle();

    if (error) throw new Error(`Error checking mission: ${error.message}`);
    if (data) return missionId;
  }

  const { data: existingMission, error: missionError } = await supabase
    .from('missions')
    .select('id')
    .eq('subject_id', subjectUuid)
    .maybeSingle();

  if (missionError) throw new Error(`Error checking mission by subject: ${missionError.message}`);
  if (existingMission) return existingMission.id;

  const localMission = missionsList.find(m => m.id === missionId);
  const title = localMission?.title || `Camino de Aprendizaje`;
  const description = localMission?.description || `Misiones y retos de la asignatura`;
  const storyIntro = localMission?.story_intro || `¡Bienvenido al mapa de aprendizaje!`;

  const { data: newMission, error: insertError } = await supabase
    .from('missions')
    .insert({
      school_id: '00000000-0000-0000-0000-000000000000',
      subject_id: subjectUuid,
      level_grade_id: '1111c019-61c7-4097-8aca-03cc0c4db68a', // Default to 4º Primaria
      title: title,
      description: description,
      story_intro: storyIntro,
      map_position_x: localMission?.map_position_x || 50,
      map_position_y: localMission?.map_position_y || 50,
      is_active: true
    })
    .select('id')
    .single();

  if (insertError) throw new Error(`Error inserting mission: ${insertError.message}`);
  return newMission.id;
};

interface GamificationStoreState {
  missionsList: Mission[];
  questAttempts: QuestAttempt[];
  studentBadges: StudentBadge[];
  guildBoss: GuildBoss;
  guildSubmissions: GuildMemberSubmission[];
  shopArtifacts: ShopArtifact[];
  isLoadingMissions: boolean;
  syncError: string | null;
  isInitialized: boolean;

  // Actions
  submitQuiz: (questId: string, score: number, answers: Record<string, string | number>) => Promise<{
    xpEarned: number;
    coinsEarned: number;
    leveledUp: boolean;
    badgeEarned: Badge | null;
  }>;
  
  submitExam: (
    questId: string,
    score: number,
    answers: Record<string, string | number>,
    statBoost?: { strength?: number; intelligence?: number; defense?: number },
    customLoot?: string
  ) => Promise<{
    xpEarned: number;
    coinsEarned: number;
    leveledUp: boolean;
    badgeEarned: Badge | null;
  }>;
  
  saveQuest: (subjectId: string, questData: Omit<Quest, 'created_at'> & { id?: string }) => Promise<void>;
  triggerGuildAttack: (damage: number) => Promise<void>;
  resetGuildBoss: () => void;
  submitGuildHomework: (studentId: string, onTime: boolean) => void;
  createArtifact: (artifactData: Omit<ShopArtifact, 'id'>) => Promise<void>;
  unlockBadge: (studentId: string, badgeId: string) => Promise<void>;
  fetchMissions: () => Promise<void>;
  fetchQuestAttempts: (studentId: string) => Promise<void>;
  subscribeToGamificationChanges: (studentId: string) => () => void;
  fetchActiveGuildBoss: () => Promise<void>;
  subscribeToGuildChanges: () => () => void;
  grantFormativeLoot: (
    studentId: string,
    questId: string,
    evaluation: 'En proceso' | 'Avanzando' | 'Logrado',
    feedback: string
  ) => Promise<{
    success: boolean;
    xpEarned?: number;
    coinsEarned?: number;
    itemGranted?: string | null;
    error?: string;
  }>;
  resetGamificationStore: () => void;
}


export const useGamificationStore = create<GamificationStoreState>((set, get) => ({
  missionsList: MISSIONS_SEED,
  questAttempts: [],
  studentBadges: [
    { student_id: 'std-pa', badge_id: 'badge-1', earned_at: new Date().toISOString() },
    { student_id: 'std-sec', badge_id: 'badge-3', earned_at: new Date().toISOString() }
  ],
  guildBoss: { id: '', name: 'Cargando Jefe...', hp_max: 1, hp_actual: 1, xp_reward: 0 },
  guildSubmissions: [],
  shopArtifacts: DEFAULT_ARTIFACTS_SEED,
  isLoadingMissions: false,
  syncError: null,
  isInitialized: false,

  submitQuiz: async (questId, score, answers) => {
    const studentStore = useStudentStore.getState();
    const activeStudentId = studentStore.activeStudentId;
    const dbStudentId = mapStudentIdToUuid(activeStudentId);

    // 1. Intentar llamar a la RPC `submit_quiz` de Supabase con UUID normalizado
    try {
      if (isUuid(dbStudentId)) {
        const response = await supabase.rpc('submit_quiz', {
          p_student_id: dbStudentId,
          p_quest_id: isUuid(questId) ? questId : '00000000-0000-0000-0000-000000000001',
          p_score: score,
          p_answers: answers
        });

        if (!response.error && response.data) {
          const data = response.data;
          const attemptId = data.attempt_id || `att-${Date.now()}`;
          const feedback = data.feedback || '';

          const newAttempt: QuestAttempt = {
            id: attemptId,
            student_id: activeStudentId,
            quest_id: questId,
            score: score,
            is_completed: score >= 60,
            answers: answers,
            feedback: feedback,
            created_at: new Date().toISOString()
          };

          set((state) => ({
            questAttempts: [newAttempt, ...state.questAttempts]
          }));

          if (data.new_stats) {
            useStudentStore.setState((state) => ({
              allStats: {
                ...state.allStats,
                [activeStudentId]: {
                  ...state.allStats[activeStudentId],
                  ...data.new_stats
                }
              }
            }));
          }

          if (data.badge_earned) {
            get().unlockBadge(activeStudentId, data.badge_earned.id);
          }

          return {
            xpEarned: data.xp_earned || 0,
            coinsEarned: data.coins_earned || 0,
            leveledUp: !!data.leveled_up,
            badgeEarned: data.badge_earned || null
          };
        }
      }
    } catch (err) {
      console.warn('RPC submit_quiz falló, ejecutando lógica de respaldo:', err);
    }

    // 2. Fallback de respaldo cuando la RPC no está disponible o falla
    let xpBase = 100;
    let coinsBase = 20;
    
    for (const m of get().missionsList) {
      const q = m.quests?.find(item => item.id === questId);
      if (q) {
        xpBase = q.xp_reward || 100;
        coinsBase = q.coins_reward || 20;
        break;
      }
    }

    const xpEarned = Math.round(xpBase * (score / 100.0));
    const coinsEarned = score === 100 ? coinsBase + 5 : Math.round(coinsBase * (score / 100.0));

    let leveledUp = false;
    await useStudentStore.getState().addXpAndCoins(activeStudentId, xpEarned, coinsEarned, (lvl) => {
      leveledUp = lvl;
    });

    const attemptId = `att-${Date.now()}`;
    const feedback = score >= 60 ? '¡Bien hecho! Has superado este reto.' : 'Sigue practicando para dominar el tema.';
    const newAttempt: QuestAttempt = {
      id: attemptId,
      student_id: activeStudentId,
      quest_id: questId,
      score: score,
      is_completed: score >= 60,
      answers: answers,
      feedback: feedback,
      created_at: new Date().toISOString()
    };

    set((state) => ({
      questAttempts: [newAttempt, ...state.questAttempts]
    }));

    if (isUuid(dbStudentId) && isUuid(questId)) {
      try {
        await supabase.from('quest_attempts').insert({
          student_id: dbStudentId,
          quest_id: questId,
          score: score,
          is_completed: score >= 60,
          answers: answers,
          feedback: feedback,
          created_at: new Date().toISOString()
        });
      } catch (err) {
        console.error('Error insertando intento en Supabase:', err);
      }
    }

    return { xpEarned, coinsEarned, leveledUp, badgeEarned: null };
  },

  submitExam: async (questId, score, answers, statBoost, customLoot) => {
    const studentStore = useStudentStore.getState();
    const activeStudentId = studentStore.activeStudentId;
    const dbStudentId = mapStudentIdToUuid(activeStudentId);

    // 1. Intentar llamar a la RPC `submit_exam` de Supabase con UUID normalizado
    try {
      if (isUuid(dbStudentId)) {
        const response = await supabase.rpc('submit_exam', {
          p_student_id: dbStudentId,
          p_quest_id: isUuid(questId) ? questId : '00000000-0000-0000-0000-000000000002',
          p_score: score,
          p_answers: answers,
          p_stat_boost: statBoost || {},
          p_custom_loot: customLoot || null
        });

        if (!response.error && response.data) {
          const data = response.data;
          const attemptId = data.attempt_id || `att-${Date.now()}`;
          const feedback = data.feedback || '';

          const newAttempt: QuestAttempt = {
            id: attemptId,
            student_id: activeStudentId,
            quest_id: questId,
            score: score,
            is_completed: score >= 60,
            answers: answers,
            feedback: feedback,
            created_at: new Date().toISOString()
          };

          set((state) => ({
            questAttempts: [newAttempt, ...state.questAttempts]
          }));

          useStudentStore.setState((state) => ({
            allStats: {
              ...state.allStats,
              [activeStudentId]: {
                ...state.allStats[activeStudentId],
                ...data.new_stats
              }
            },
            allAvatars: {
              ...state.allAvatars,
              [activeStudentId]: data.new_avatar 
                ? { ...state.allAvatars[activeStudentId], ...data.new_avatar }
                : state.allAvatars[activeStudentId]
            }
          }));

          if (data.badge_earned) {
            get().unlockBadge(activeStudentId, data.badge_earned.id);
          }

          return {
            xpEarned: data.xp_earned || 0,
            coinsEarned: data.coins_earned || 0,
            leveledUp: !!data.leveled_up,
            badgeEarned: data.badge_earned || null
          };
        }
      }
    } catch (err) {
      console.warn('RPC submit_exam falló, ejecutando lógica de respaldo:', err);
    }

    // 2. Fallback de respaldo cuando la RPC no está en Supabase
    const xpEarned = Math.round(200 * (score / 100.0));
    const coinsEarned = Math.round(50 * (score / 100.0));

    await useStudentStore.getState().updateStatsAfterExam(
      activeStudentId,
      xpEarned,
      coinsEarned,
      statBoost,
      customLoot
    );

    const attemptId = `att-${Date.now()}`;
    const feedback = '¡Examen final completado!';
    const newAttempt: QuestAttempt = {
      id: attemptId,
      student_id: activeStudentId,
      quest_id: questId,
      score: score,
      is_completed: score >= 60,
      answers: answers,
      feedback: feedback,
      created_at: new Date().toISOString()
    };

    set((state) => ({
      questAttempts: [newAttempt, ...state.questAttempts]
    }));

    if (isUuid(dbStudentId) && isUuid(questId)) {
      try {
        await supabase.from('quest_attempts').insert({
          student_id: dbStudentId,
          quest_id: questId,
          score: score,
          is_completed: score >= 60,
          answers: answers,
          feedback: feedback,
          created_at: new Date().toISOString()
        });
      } catch (err) {
        console.error('Error insertando intento de examen en Supabase:', err);
      }
    }

    return { xpEarned, coinsEarned, leveledUp: false, badgeEarned: null };
  },

  saveQuest: async (subjectId, questData) => {
    set({ syncError: null });
    try {
      // 1. Ensure subject and mission exist in Supabase
      const missionUuid = await ensureMissionExists(subjectId, questData.mission_id, get().missionsList);
      let questUuid = questData.id;
      const isNew = !questUuid || !isUuid(questUuid);

      // 2. Map database columns
      const dbQuest: any = {
        mission_id: missionUuid,
        title: questData.title,
        description: questData.description,
        type: questData.type,
        sequence_order: questData.sequence_order || 1,
        xp_reward: questData.xp_reward,
        coins_reward: questData.coins_reward,
        content: questData.content
      };

      if (!isNew) {
        dbQuest.id = questUuid;
        const { error } = await supabase
          .from('quests')
          .update(dbQuest)
          .eq('id', questUuid);
        if (error) throw new Error(error.message);
      } else {
        const { data, error } = await supabase
          .from('quests')
          .insert(dbQuest)
          .select('id')
          .single();
        if (error) throw new Error(error.message);
        questUuid = data.id;
      }

      // 4. Update Zustand state ONLY if Supabase mutation was successful
      set((state) => {
        const existingMissionIndex = state.missionsList.findIndex(m => m.subject_id === subjectId || m.id === missionUuid);
        
        const newQuest: Quest = {
          ...questData,
          id: questUuid, // Keep consistent with database UUID
          mission_id: missionUuid,
          created_at: new Date().toISOString()
        } as Quest;

        if (existingMissionIndex !== -1) {
          const mission = state.missionsList[existingMissionIndex];
          const quests = mission.quests || [];
          const existingQuestIndex = quests.findIndex(q => q.id === questUuid || q.id === questData.id);

          let updatedQuests;
          if (existingQuestIndex !== -1) {
            updatedQuests = quests.map((q, idx) => idx === existingQuestIndex ? newQuest : q);
          } else {
            updatedQuests = [...quests, { ...newQuest, sequence_order: quests.length + 1 }];
          }

          return {
            missionsList: state.missionsList.map((m, idx) => 
              idx === existingMissionIndex ? { ...mission, quests: updatedQuests } : m
            )
          };
        } else {
          const subject = SUBJECTS_SEED.find(s => s.id === subjectId);
          const subjectName = subject ? subject.name : 'Materia';
          const newMission: Mission = {
            id: missionUuid,
            school_id: '00000000-0000-0000-0000-000000000000',
            subject_id: subjectId,
            level_grade_id: '1111c019-61c7-4097-8aca-03cc0c4db68a',
            title: `Camino de Aprendizaje: ${subjectName}`,
            description: `Misiones y retos de la asignatura de ${subjectName}`,
            story_intro: `¡Bienvenido al mapa de aprendizaje de ${subjectName}! Supera los retos para obtener XP y medallas.`,
            map_position_x: 50,
            map_position_y: 50,
            is_active: true,
            created_at: new Date().toISOString(),
            quests: [{ ...newQuest, sequence_order: 1 }]
          };
          return {
            missionsList: [...state.missionsList, newMission]
          };
        }
      });

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al guardar el reto';
      console.error('Error saving quest:', err);
      set({ syncError: errorMsg });
      throw err;
    }
  },

  triggerGuildAttack: async (damage) => {
    try {
      // 1. Try with RPC first
      const { data, error } = await supabase.rpc('trigger_guild_attack', {
        damage_amount: damage
      });

      if (!error && data && data.success) {
        set({
          guildBoss: {
            id: data.id,
            name: data.name,
            hp_max: data.hp_max,
            hp_actual: data.hp_actual,
            xp_reward: data.xp_reward
          }
        });
        return;
      }
    } catch (err) {
      console.warn('RPC trigger_guild_attack failed, falling back to direct update:', err);
    }

    // Fallback: Direct UPDATE
    try {
      const currentBoss = get().guildBoss;
      const newHp = Math.max(0, currentBoss.hp_actual - damage);
      
      const { error } = await supabase
        .from('guild_bosses')
        .update({ hp_actual: newHp })
        .eq('id', currentBoss.id);

      if (error) throw error;

      set((state) => ({
        guildBoss: {
          ...state.guildBoss,
          hp_actual: newHp
        }
      }));
    } catch (err) {
      console.error('Error in fallback guild attack:', err);
    }
  },

  resetGuildBoss: () => {
    supabase
      .from('guild_bosses')
      .update({ hp_actual: 150 })
      .eq('id', 'boss-historia')
      .then(({ error }) => {
        if (error) console.error('Error resetting guild boss on Supabase:', error);
      });
    set({
      guildBoss: { ...BOSS_SEED, hp_actual: 150 },
      guildSubmissions: GUILD_SUBMISSIONS_SEED
    });
  },

  submitGuildHomework: (studentId, onTime) => {
    set((state) => ({
      guildSubmissions: state.guildSubmissions.map(member => {
        if (member.student_id === studentId) {
          return {
            ...member,
            status: onTime ? 'submitted_on_time' : 'submitted_late',
            submitted_at: new Date().toISOString()
          };
        }
        return member;
      })
    }));
  },

  fetchActiveGuildBoss: async () => {
    try {
      const { data, error } = await supabase
        .from('guild_bosses')
        .select('*')
        .eq('id', 'boss-historia')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        set({ guildBoss: data as GuildBoss });
      } else {
        const { error: insertError } = await supabase
          .from('guild_bosses')
          .insert({
            id: 'boss-historia',
            name: 'Guardián de Historia',
            hp_max: 200,
            hp_actual: 150,
            xp_reward: 500
          });
        if (insertError) throw insertError;
        set({ guildBoss: { id: 'boss-historia', name: 'Guardián de Historia', hp_max: 200, hp_actual: 150, xp_reward: 500 } });
      }
    } catch (err) {
      console.error('Error fetching active guild boss:', err);
    }
  },

  subscribeToGuildChanges: () => {
    const channel = supabase
      .channel('guild_events')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'guild_bosses' },
        (payload) => {
          console.log('Realtime update received for guild boss:', payload);
          if (payload.new) {
            set({ guildBoss: payload.new as GuildBoss });
          }
        }
      )
      .subscribe((status) => {
        console.log('Supabase Realtime subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  },

  createArtifact: async (artifactData) => {
    set({ syncError: null });
    try {
      const artifactId = `art-${Date.now()}`;
      const dbArtifact = {
        id: artifactId,
        name: artifactData.name,
        description: artifactData.description,
        price: artifactData.price,
        icon: artifactData.icon
      };

      const { error } = await supabase
        .from('shop_artifacts')
        .insert(dbArtifact);

      if (error) throw new Error(error.message);

      // Zustand state update only after successful insert
      const newArtifact: ShopArtifact = {
        ...artifactData,
        id: artifactId
      };

      set((state) => ({
        shopArtifacts: [...state.shopArtifacts, newArtifact]
      }));

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al guardar el artefacto';
      console.error('Error creating artifact:', err);
      set({ syncError: errorMsg });
      alert(`Error al sincronizar con Supabase: ${errorMsg}`);
    }
  },

  unlockBadge: async (studentId, badgeId) => {
    set({ syncError: null });
    try {
      const dbStudentId = studentId;
      let dbBadgeId = badgeId;

      if (!isUuid(badgeId)) {
        const seedBadge = BADGES_SEED.find(b => b.id === badgeId);
        if (seedBadge) {
          const { data, error } = await supabase
            .from('badges')
            .select('id')
            .eq('name', seedBadge.name)
            .maybeSingle();
          if (error) throw new Error(error.message);
          if (data) {
            dbBadgeId = data.id;
          }
        }
      }

      if (!isUuid(dbBadgeId)) {
        throw new Error(`Invalid badge ID format: ${badgeId}`);
      }

      const { data, error } = await supabase
        .from('student_badges')
        .insert({
          student_id: dbStudentId,
          badge_id: dbBadgeId
        })
        .select()
        .single();

      if (error) {
        // If already unlocked (duplicate key violation), we don't treat it as a hard failure
        if (error.code === '23505') {
          console.log(`Badge ${badgeId} already unlocked for student ${studentId}`);
          return;
        }
        throw new Error(error.message);
      }

      const earnedAt = data?.earned_at || new Date().toISOString();
      const newBadge: StudentBadge = {
        student_id: studentId,
        badge_id: badgeId,
        earned_at: earnedAt
      };

      set((state) => ({
        studentBadges: [...state.studentBadges, newBadge]
      }));

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al guardar en Supabase';
      console.error('Error unlocking badge:', err);
      set({ syncError: errorMsg });
      alert(`Error al desbloquear la medalla: ${errorMsg}`);
    }
  },

  fetchMissions: async () => {
    set({ isLoadingMissions: true });
    try {
      const response = await supabase.from('missions').select('*, quests(*)');
      if (response.error) throw new Error(response.error.message);
      
      const missionsWithSortedQuests = (response.data || []).map((m) => {
        const mission = m as Mission & { quests?: Quest[] };
        return {
          ...mission,
          quests: mission.quests ? [...mission.quests].sort((a, b) => (a.sequence_order || 0) - (b.sequence_order || 0)) : []
        };
      });

      set({ missionsList: missionsWithSortedQuests });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      console.error('Error fetching missions:', errorMsg);
    } finally {
      set({ isLoadingMissions: false, isInitialized: true });
    }
  },

  fetchQuestAttempts: async (studentId: string) => {
    try {
      const { data, error } = await supabase
        .from('quest_attempts')
        .select('*')
        .eq('student_id', studentId);
      
      if (error) throw error;
      set({ questAttempts: data || [] });
    } catch (err) {
      console.error('Error fetching quest attempts:', err);
    }
  },

  subscribeToGamificationChanges: (studentId: string) => {
    const channel = supabase
      .channel(`gamification_realtime_${studentId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'quest_attempts', filter: `student_id=eq.${studentId}` },
        async (payload) => {
          console.log('Realtime quest_attempts update:', payload);
          // Reload all attempts when a change occurs
          const { data, error } = await supabase
            .from('quest_attempts')
            .select('*')
            .eq('student_id', studentId);
          if (!error && data) {
            set({ questAttempts: data });
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'missions' },
        () => {
          console.log('Realtime missions update');
          get().fetchMissions();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'quests' },
        () => {
          console.log('Realtime quests update');
          get().fetchMissions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  grantFormativeLoot: async (studentId, questId, evaluation, feedback) => {
    const denormalizeStudentId = (id: string): string => {
      if (id === 'std-pa') return 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a11';
      if (id === 'std-sec') return 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a22';
      if (id === 'std-pb') return 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a33';
      if (id === 'std-prep') return 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a44';
      return id;
    };

    const normStudentId = isUuid(studentId) ? studentId : denormalizeStudentId(studentId);

    try {
      // 1. Obtener Quest de Supabase
      const { data: questData, error: questError } = await supabase
        .from('quests')
        .select('*')
        .eq('id', questId)
        .maybeSingle();

      if (questError) throw questError;

      const xpRewardBase = questData?.xp_reward || 100;
      const coinsRewardBase = questData?.coins_reward || 20;

      let xpToGrant = 0;
      let coinsToGrant = 0;
      let itemGranted: string | null = null;

      // 2. Lógica de recompensas
      if (evaluation === 'Logrado') {
        xpToGrant = xpRewardBase * 2;
        coinsToGrant = coinsRewardBase * 2;
      } else if (evaluation === 'Avanzando') {
        xpToGrant = xpRewardBase;
        coinsToGrant = coinsRewardBase;
      } else {
        // En proceso
        xpToGrant = Math.floor(xpRewardBase * 0.2);
        coinsToGrant = Math.floor(coinsRewardBase * 0.2);
        itemGranted = 'art-potion-perseverancia';

        // Insertar item en inventario
        const { error: invError } = await supabase
          .from('student_inventory')
          .insert({
            student_id: normStudentId,
            artifact_id: 'art-potion-perseverancia',
            acquired_at: new Date().toISOString()
          });
        if (invError) console.error('Error inserting perseverance potion in inventory:', invError);

        // Insertar mensaje de aliento
        const { error: msgError } = await supabase
          .from('student_messages')
          .insert({
            student_id: normStudentId,
            title: '¡Mensaje de perseverancia de tu Mentor!',
            message: `¡No te rindas! Sigue intentándolo en el reto "${questData?.title || 'la misión'}". Has recibido una "Poción de perseverancia" para tu inventario.`,
            sent_at: new Date().toISOString(),
            is_read: false,
            type: 'system'
          });
        if (msgError) console.error('Error inserting message in student_messages:', msgError);
      }

      // 3. Registrar o actualizar feedback en quest_attempts
      const { data: existingAttempts, error: attemptsError } = await supabase
        .from('quest_attempts')
        .select('*')
        .eq('student_id', normStudentId)
        .eq('quest_id', questId)
        .order('created_at', { ascending: false });

      if (attemptsError) throw attemptsError;

      if (existingAttempts && existingAttempts.length > 0) {
        const attemptId = existingAttempts[0].id;
        const { error: updateError } = await supabase
          .from('quest_attempts')
          .update({
            feedback: feedback,
            is_completed: evaluation === 'Logrado' || evaluation === 'Avanzando',
            score: evaluation === 'Logrado' ? 100 : evaluation === 'Avanzando' ? 70 : 40
          })
          .eq('id', attemptId);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('quest_attempts')
          .insert({
            student_id: normStudentId,
            quest_id: questId,
            score: evaluation === 'Logrado' ? 100 : evaluation === 'Avanzando' ? 70 : 40,
            is_completed: evaluation === 'Logrado' || evaluation === 'Avanzando',
            feedback: feedback,
            created_at: new Date().toISOString()
          });
        if (insertError) throw insertError;
      }

      // 4. Actualizar estadísticas del alumno (XP y monedas)
      const { data: currentStats, error: statsError } = await supabase
        .from('student_stats')
        .select('*')
        .eq('student_id', normStudentId)
        .maybeSingle();

      if (statsError) throw statsError;

      if (currentStats) {
        let finalXp = (currentStats.xp || 0) + xpToGrant;
        const newCoins = (currentStats.coins || 0) + coinsToGrant;
        let finalLevel = currentStats.level || 1;
        let finalSkillPoints = currentStats.skill_points ?? 0;

        let xpForCurrentLevel = finalLevel * 200;
        while (finalXp >= xpForCurrentLevel) {
          finalXp -= xpForCurrentLevel;
          finalLevel += 1;
          finalSkillPoints += 2;
          xpForCurrentLevel = finalLevel * 200;
        }

        const { error: updateStatsError } = await supabase
          .from('student_stats')
          .update({
            xp: finalXp,
            coins: newCoins,
            level: finalLevel,
            skill_points: finalSkillPoints,
            updated_at: new Date().toISOString()
          })
          .eq('student_id', normStudentId);

        if (updateStatsError) throw updateStatsError;

        // Sincronizar en useStudentStore local
        useStudentStore.setState((state) => {
          const currentA = state.allStats[studentId] || {};
          const currentB = state.allStats[normStudentId] || {};
          return {
            allStats: {
              ...state.allStats,
              [studentId]: {
                ...currentA,
                xp: finalXp,
                coins: newCoins,
                level: finalLevel,
                skill_points: finalSkillPoints
              },
              [normStudentId]: {
                ...currentB,
                xp: finalXp,
                coins: newCoins,
                level: finalLevel,
                skill_points: finalSkillPoints
              }
            }
          };
        });
      }

      // Forzar recarga local de intentos
      await get().fetchQuestAttempts(studentId);

      return {
        success: true,
        xpEarned: xpToGrant,
        coinsEarned: coinsToGrant,
        itemGranted: itemGranted
      };

    } catch (err: any) {
      console.error('Error in grantFormativeLoot:', err.message || err);
      return { success: false, error: err.message || err };
    }
  },

  resetGamificationStore: () => {
    set({
      missionsList: MISSIONS_SEED,
      questAttempts: [],
      studentBadges: [
        { student_id: 'std-pa', badge_id: 'badge-1', earned_at: new Date().toISOString() },
        { student_id: 'std-sec', badge_id: 'badge-3', earned_at: new Date().toISOString() }
      ],
      guildBoss: { id: '', name: 'Cargando Jefe...', hp_max: 1, hp_actual: 1, xp_reward: 0 },
      guildSubmissions: [],
      shopArtifacts: DEFAULT_ARTIFACTS_SEED,
      isLoadingMissions: false,
      syncError: null,
      isInitialized: false
    });
  }
}));
