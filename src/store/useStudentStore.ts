import { create } from 'zustand';
import { useMemo } from 'react';
import { StudentStats, StudentAvatar, StudentMessage, UserProfile, Quest } from '../types';
import { STATS_MAP_SEED, AVATAR_MAP_SEED, STUDENT_INVENTORY_SEED, STUDENT_MESSAGES_SEED, STUDENTS_LIST_SEED } from './seeds';
import { supabase } from '@/lib/supabaseClient';

let statsChannel: any = null;

interface StudentStoreState {
  activeStudentId: string;
  allStats: Record<string, StudentStats>;
  allAvatars: Record<string, StudentAvatar>;
  studentInventoryMap: Record<string, string[]>;
  studentMessages: StudentMessage[];
  isLoadingStats: boolean;
  activeQuest: Quest | null;
  isQuestModalOpen: boolean;
  
  // Actions
  openQuestModal: (quest: Quest) => void;
  closeQuestModal: () => void;
  switchStudent: (studentId: string) => Promise<void>;
  changeAvatar: (config: Partial<StudentAvatar>) => Promise<void>;
  unlockBranchCosmetic: (cosmeticId: string) => Promise<void>;
  feedPet: (studentId?: string) => void;
  playWithPet: (studentId?: string) => void;
  feedPetRpg: () => Promise<void>;
  trainPetRpg: () => Promise<void>;
  levelUpAttribute: (statName: 'strength' | 'intelligence' | 'defense') => Promise<void>;
  purchaseArtifact: (studentId: string, artifactId: string) => Promise<void>;
  grantArtifact: (studentId: string, artifactId: string) => Promise<void>;
  revokeArtifact: (studentId: string, artifactId: string, reason: string) => Promise<void>;
  markStudentMessageAsRead: (messageId: string) => void;
  fetchStats: (groupId?: string) => Promise<void>;
  subscribeToStudentStats: (studentId: string) => void;
  unsubscribeFromStudentStats: () => void;
  
  // Cross-store helpers
  addXpAndCoins: (studentId: string, xpEarned: number, coinsEarned: number, levelUpCallback?: (leveledUp: boolean) => void) => void;
  updateStatsAfterExam: (
    studentId: string, 
    xpEarned: number, 
    coinsEarned: number, 
    statBoost?: { strength?: number; intelligence?: number; defense?: number },
    customLoot?: string
  ) => void;
  initializeNewStudent: (studentId: string, firstName: string) => void;
  resetStudentStore: () => void;
}

export const useStudentStore = create<StudentStoreState>((set, get) => ({
  activeStudentId: 'std-pa',
  allStats: STATS_MAP_SEED,
  allAvatars: AVATAR_MAP_SEED,
  studentInventoryMap: STUDENT_INVENTORY_SEED,
  studentMessages: STUDENT_MESSAGES_SEED,
  isLoadingStats: false,
  activeQuest: null,
  isQuestModalOpen: false,

  openQuestModal: (quest) => set({ activeQuest: quest, isQuestModalOpen: true }),
  closeQuestModal: () => set({ activeQuest: null, isQuestModalOpen: false }),

  switchStudent: async (studentId) => {
    set({ activeStudentId: studentId });
    const student = STUDENTS_LIST_SEED.find(s => s.id === studentId);
    const email = student?.email;
    if (email) {
      await supabase.auth.signInWithPassword({ email, password: 'ISkoolPassword2026!' });
      // Fetch stats to sync
      const response = await supabase.from('student_stats').select('*');
      if (response && response.data && response.data.length > 0) {
        set((state) => ({
          allStats: {
            ...state.allStats,
            [studentId]: response.data[0]
          }
        }));
      }

      // Fetch avatar to sync
      try {
        const avResponse = await supabase.from('student_avatars').select('*');
        if (avResponse && avResponse.data && avResponse.data.length > 0) {
          const dbAv = avResponse.data[0];
          const normalizedId = normalizeStudentId(dbAv.student_id || studentId);
          set((state) => ({
            allAvatars: {
              ...state.allAvatars,
              [studentId]: dbAv,
              [normalizedId]: dbAv
            }
          }));
        }
      } catch (err) {
        console.error('Error fetching student avatar:', err);
      }
    }
  },

  changeAvatar: async (config) => {
    const rawId = get().activeStudentId;
    const activeId = normalizeStudentId(rawId);
    
    try {
      const dbStudentId = mapStudentIdToUuid(activeId);
      const { error } = await supabase
        .from('student_avatars')
        .update(config)
        .eq('student_id', dbStudentId);
        
      if (error) {
        console.error('Error updating avatar in Supabase:', error.message);
      }
    } catch (err) {
      console.error('Unexpected error updating avatar in Supabase:', err);
    }

    set((state) => {
      const currentAv = state.allAvatars[activeId] || state.allAvatars[rawId] || {};
      const updatedAv = {
        ...currentAv,
        ...config,
        updated_at: new Date().toISOString(),
      };
      return {
        allAvatars: {
          ...state.allAvatars,
          [activeId]: updatedAv,
          [rawId]: updatedAv,
        },
      };
    });
  },

  unlockBranchCosmetic: async (cosmeticId) => {
    const rawId = get().activeStudentId;
    const activeId = normalizeStudentId(rawId);
    
    const currentAv = get().allAvatars[activeId] || get().allAvatars[rawId];
    if (!currentAv) return;
    
    const currentUnlocked = currentAv.unlocked_items || [];
    if (currentUnlocked.includes(cosmeticId)) return;
    
    const updatedUnlocked = [...currentUnlocked, cosmeticId];
    
    try {
      const dbStudentId = mapStudentIdToUuid(activeId);
      const { error } = await supabase
        .from('student_avatars')
        .update({ unlocked_items: updatedUnlocked })
        .eq('student_id', dbStudentId);
        
      if (error) {
        console.error('Error unlocking cosmetic in Supabase:', error.message);
      }
    } catch (err) {
      console.error('Unexpected error unlocking cosmetic:', err);
    }
    
    set((state) => {
      const avatarToUpdate = state.allAvatars[activeId] || state.allAvatars[rawId] || {};
      const updatedAv = {
        ...avatarToUpdate,
        unlocked_items: updatedUnlocked,
        updated_at: new Date().toISOString(),
      };
      return {
        allAvatars: {
          ...state.allAvatars,
          [activeId]: updatedAv,
          [rawId]: updatedAv,
        },
      };
    });
  },

  feedPet: (studentId?: string) => {
    const rawId = studentId || get().activeStudentId;
    const activeId = normalizeStudentId(rawId);
    const { allStats, allAvatars } = get();
    console.log('DEBUG feedPet:', {
      rawId,
      activeId,
      allAvatarsKeys: Object.keys(allAvatars),
      hasActiveId: activeId in allAvatars,
      hasRawId: rawId in allAvatars,
      currentAv: allAvatars[activeId] || allAvatars[rawId]
    });
    const stats = allStats[activeId] || allStats[rawId];
    if (!stats || stats.coins < 5) {
      alert('¡No tienes suficientes monedas! Resuelve retos para ganar monedas.');
      return;
    }

    set((state) => {
      const currentStats = state.allStats[activeId] || state.allStats[rawId];
      const currentAv = state.allAvatars[activeId] || state.allAvatars[rawId] || {};
      const newHunger = Math.max(0, (currentAv.pet_hunger || 50) - 20);
      const newHappiness = Math.min(100, (currentAv.pet_happiness || 50) + 5);

      const updatedStats = {
        ...currentStats,
        coins: currentStats.coins - 5,
        xp: currentStats.xp + 10,
      };

      const updatedAv = {
        ...currentAv,
        pet_hunger: newHunger,
        pet_happiness: newHappiness,
        updated_at: new Date().toISOString(),
      };

      return {
        allStats: {
          ...state.allStats,
          [activeId]: updatedStats,
          [rawId]: updatedStats,
        },
        allAvatars: {
          ...state.allAvatars,
          [activeId]: updatedAv,
          [rawId]: updatedAv,
        },
      };
    });
  },

  playWithPet: (studentId?: string) => {
    const rawId = studentId || get().activeStudentId;
    const activeId = normalizeStudentId(rawId);
    const { allStats, allAvatars } = get();
    console.log('DEBUG playWithPet:', {
      rawId,
      activeId,
      allAvatarsKeys: Object.keys(allAvatars),
      hasActiveId: activeId in allAvatars,
      hasRawId: rawId in allAvatars,
      currentAv: allAvatars[activeId] || allAvatars[rawId]
    });
    const stats = allStats[activeId] || allStats[rawId];
    if (!stats || stats.coins < 2) {
      alert('¡No tienes suficientes monedas!');
      return;
    }

    set((state) => {
      const currentStats = state.allStats[activeId] || state.allStats[rawId];
      const currentAv = state.allAvatars[activeId] || state.allAvatars[rawId] || {};
      const newHunger = Math.min(100, (currentAv.pet_hunger || 50) + 10);
      const newHappiness = Math.min(100, (currentAv.pet_happiness || 50) + 20);

      const updatedStats = {
        ...currentStats,
        coins: currentStats.coins - 2,
        xp: currentStats.xp + 5,
      };

      const updatedAv = {
        ...currentAv,
        pet_hunger: newHunger,
        pet_happiness: newHappiness,
        updated_at: new Date().toISOString(),
      };

      return {
        allStats: {
          ...state.allStats,
          [activeId]: updatedStats,
          [rawId]: updatedStats,
        },
        allAvatars: {
          ...state.allAvatars,
          [activeId]: updatedAv,
          [rawId]: updatedAv,
        },
      };
    });
  },

  feedPetRpg: async () => {
    const rawId = get().activeStudentId;
    const activeId = normalizeStudentId(rawId);
    const currentStats = get().allStats[activeId] || get().allStats[rawId];
    if (!currentStats) return;

    if (currentStats.coins < 50) {
      alert('¡No tienes suficientes monedas! Alimentar a tu mascota cuesta 50 Coins.');
      return;
    }

    try {
      const dbStudentId = mapStudentIdToUuid(activeId);
      const { data, error } = await supabase.rpc('process_reward', {
        p_student_id: dbStudentId,
        p_coins_change: -50,
        p_happiness_change: 20
      });

      if (error) {
        console.error('Error updating pet happiness in Supabase:', error.message);
        alert('Error al alimentar a tu mascota: ' + error.message);
        return;
      }

      if (data) {
        const updatedStats = data as StudentStats;
        set((state) => ({
          allStats: {
            ...state.allStats,
            [activeId]: {
              ...state.allStats[activeId],
              ...updatedStats,
              student_id: activeId
            },
            [rawId]: {
              ...state.allStats[rawId],
              ...updatedStats,
              student_id: rawId
            }
          }
        }));
      }
    } catch (err) {
      console.error('Unexpected error updating pet happiness:', err);
    }
  },

  trainPetRpg: async () => {
    const rawId = get().activeStudentId;
    const activeId = normalizeStudentId(rawId);
    const currentStats = get().allStats[activeId] || get().allStats[rawId];
    if (!currentStats) return;

    const currentEnergy = currentStats.pet_energy ?? 100;
    if (currentEnergy < 25) {
      alert('¡Tu mascota no tiene suficiente energía! Espera a que descanse o resuelve retos para recargarla.');
      return;
    }

    try {
      const dbStudentId = mapStudentIdToUuid(activeId);
      const { data, error } = await supabase.rpc('process_reward', {
        p_student_id: dbStudentId,
        p_energy_change: -25,
        p_xp_change: 40
      });

      if (error) {
        console.error('Error updating pet training in Supabase:', error.message);
        alert('Error al entrenar a tu mascota: ' + error.message);
        return;
      }

      if (data) {
        const updatedStats = data as StudentStats;
        set((state) => ({
          allStats: {
            ...state.allStats,
            [activeId]: {
              ...state.allStats[activeId],
              ...updatedStats,
              student_id: activeId
            },
            [rawId]: {
              ...state.allStats[rawId],
              ...updatedStats,
              student_id: rawId
            }
          }
        }));
      }
    } catch (err) {
      console.error('Unexpected error updating pet training:', err);
    }
  },

  levelUpAttribute: async (statName) => {
    const { activeStudentId } = get();
    try {
      const response = await supabase.rpc('level_up_attribute', {
        student_id: activeStudentId,
        attribute_name: statName
      });
      if (response.error) {
        console.error('SQL / SCHEMA DEVIATION DETECTED: La función RPC "level_up_attribute" no existe o falló en la base de datos de Supabase.', response.error);
        alert('Error al subir de nivel el atributo: ' + response.error.message);
        return;
      }
      if (response && response.data && response.data.success) {
        set((state) => ({
          allStats: {
            ...state.allStats,
            [activeStudentId]: response.data.new_stats
          }
        }));
      }
    } catch (err: any) {
      console.error('Error al subir de nivel el atributo:', err);
      alert(err.message || 'Error al subir de nivel el atributo');
    }
  },

  purchaseArtifact: async (studentId, artifactId) => {
    try {
      const response = await supabase.rpc('purchase_artifact', {
        student_id: studentId,
        artifact_id: artifactId
      });
      if (response.error) {
        console.error('SQL / SCHEMA DEVIATION DETECTED: La función RPC "purchase_artifact" no está definida en Supabase.', response.error);
        alert('Error al comprar el artefacto: ' + response.error.message);
        return;
      }
      if (response && response.data && response.data.success) {
        set((state) => ({
          allStats: {
            ...state.allStats,
            [studentId]: response.data.new_stats
          },
          studentInventoryMap: {
            ...state.studentInventoryMap,
            [studentId]: response.data.new_inventory
          },
          studentMessages: [response.data.new_message, ...state.studentMessages]
        }));
        alert(`¡Compraste el artefacto con éxito!`);
      }
    } catch (err: any) {
      console.error('Error al comprar artefacto:', err);
      alert(err.message || 'Error al comprar el artefacto');
    }
  },

  grantArtifact: async (studentId, artifactId) => {
    try {
      const response = await supabase.rpc('grant_artifact', {
        student_id: studentId,
        artifact_id: artifactId
      });
      if (response.error) {
        console.error('SQL / SCHEMA DEVIATION DETECTED: La función RPC "grant_artifact" no está definida en la base de datos de Supabase.', response.error);
        alert('Error al otorgar artefacto: ' + response.error.message);
        return;
      }
      if (response && response.data && response.data.success) {
        set((state) => ({
          studentInventoryMap: {
            ...state.studentInventoryMap,
            [studentId]: response.data.new_inventory
          },
          studentMessages: [response.data.new_message, ...state.studentMessages]
        }));
        alert("Artefacto otorgado con éxito.");
      }
    } catch (err: any) {
      console.error('Error al otorgar artefacto:', err);
      alert(err.message || 'Error al otorgar artefacto');
    }
  },

  revokeArtifact: async (studentId, artifactId, reason) => {
    try {
      const response = await supabase.rpc('revoke_artifact', {
        student_id: studentId,
        artifact_id: artifactId,
        reason: reason
      });
      if (response.error) {
        console.error('SQL / SCHEMA DEVIATION DETECTED: La función RPC "revoke_artifact" no se encuentra registrada en la base de datos de Supabase.', response.error);
        alert('Error al retirar artefacto: ' + response.error.message);
        return;
      }
      if (response && response.data && response.data.success) {
        set((state) => ({
          studentInventoryMap: {
            ...state.studentInventoryMap,
            [studentId]: response.data.new_inventory
          },
          studentMessages: [response.data.new_message, ...state.studentMessages]
        }));
        alert("Artefacto retirado e informe enviado al alumno.");
      }
    } catch (err: any) {
      console.error('Error al retirar artefacto:', err);
      alert(err.message || 'Error al retirar artefacto');
    }
  },

  markStudentMessageAsRead: (messageId) => {
    set((state) => ({
      studentMessages: state.studentMessages.map((msg) =>
        msg.id === messageId ? { ...msg, is_read: true } : msg
      ),
    }));
  },

  addXpAndCoins: (studentId, xpEarned, coinsEarned, levelUpCallback) => {
    const { allStats } = get();
    const studentStats = allStats[studentId];
    if (!studentStats) return;

    let currentXP = studentStats.xp + xpEarned;
    let currentCoins = studentStats.coins + coinsEarned;
    let level = studentStats.level;
    let leveledUp = false;
    let skillPoints = studentStats.skill_points || 0;

    const xpRequiredForNextLevel = level * 200;
    if (currentXP >= xpRequiredForNextLevel) {
      currentXP -= xpRequiredForNextLevel;
      level += 1;
      leveledUp = true;
      const isSec = studentId === 'std-sec';
      if (isSec) {
        skillPoints += 2;
      }
    }

    let newStreak = studentStats.current_streak;
    const todayStr = new Date().toISOString().split('T')[0];
    if (studentStats.last_active_date !== todayStr) {
      newStreak = studentStats.current_streak + 1;
    }

    set((state) => ({
      allStats: {
        ...state.allStats,
        [studentId]: {
          ...studentStats,
          xp: currentXP,
          level: level,
          coins: currentCoins,
          current_streak: newStreak,
          max_streak: Math.max(newStreak, studentStats.max_streak),
          last_active_date: todayStr,
          skill_points: skillPoints,
          pet_energy: Math.min(100, (studentStats.pet_energy ?? 100) + 15),
          updated_at: new Date().toISOString(),
        },
      },
    }));

    if (levelUpCallback) {
      levelUpCallback(leveledUp);
    }
  },

  updateStatsAfterExam: (studentId, xpEarned, coinsEarned, statBoost, customLoot) => {
    const { allStats } = get();
    const studentStats = allStats[studentId];
    if (!studentStats) return;

    let currentXP = studentStats.xp + xpEarned;
    let currentCoins = studentStats.coins + coinsEarned;
    let level = studentStats.level;
    let skillPoints = studentStats.skill_points || 0;

    const xpRequiredForNextLevel = level * 200;
    if (currentXP >= xpRequiredForNextLevel) {
      currentXP -= xpRequiredForNextLevel;
      level += 1;
      if (studentId === 'std-sec') {
        skillPoints += 2;
      }
    }

    let finalStrength = studentStats.attribute_strength || 1;
    let finalIntelligence = studentStats.attribute_intelligence || 1;
    let finalDefense = studentStats.attribute_defense || 1;

    if (statBoost) {
      if (statBoost.strength) finalStrength += statBoost.strength;
      if (statBoost.intelligence) finalIntelligence += statBoost.intelligence;
      if (statBoost.defense) finalDefense += statBoost.defense;
    }

    set((state) => ({
      allStats: {
        ...state.allStats,
        [studentId]: {
          ...studentStats,
          xp: currentXP,
          level: level,
          coins: currentCoins,
          skill_points: skillPoints,
          attribute_strength: finalStrength,
          attribute_intelligence: finalIntelligence,
          attribute_defense: finalDefense,
          pet_energy: Math.min(100, (studentStats.pet_energy ?? 100) + 15),
          updated_at: new Date().toISOString(),
        },
      },
    }));

    if (customLoot) {
      set((state) => {
        const studentAvatar = state.allAvatars[studentId];
        if (!studentAvatar) return state;
        const currentUnlocked = studentAvatar.unlocked_items || [];
        const nextUnlocked = currentUnlocked.includes(customLoot) ? currentUnlocked : [...currentUnlocked, customLoot];
        return {
          allAvatars: {
            ...state.allAvatars,
            [studentId]: {
              ...studentAvatar,
              unlocked_items: nextUnlocked,
              pet_hunger: 100,
              pet_happiness: 100,
              updated_at: new Date().toISOString(),
            },
          },
        };
      });
    }
  },

  initializeNewStudent: (studentId, firstName) => {
    set((state) => ({
      allStats: {
        ...state.allStats,
        [studentId]: {
          student_id: studentId,
          xp: 0,
          level: 1,
          coins: 0,
          current_streak: 1,
          max_streak: 1,
          updated_at: new Date().toISOString(),
        },
      },
      allAvatars: {
        ...state.allAvatars,
        [studentId]: {
          student_id: studentId,
          avatar_name: firstName,
          hair_style: 'classic',
          hair_color: '#4B5563',
          eyes_style: 'happy',
          outfit_style: 'explorer',
          outfit_color: '#3B82F6',
          background_style: 'forest',
          unlocked_items: ['classic', 'happy', 'explorer', 'forest'],
          updated_at: new Date().toISOString(),
        },
      },
    }));
  },

  fetchStats: async (groupId?: string) => {
    set({ isLoadingStats: true });
    try {
      // The student_stats table does not have a group_id column.
      // We load all stats and filter/match them locally to avoid DB errors.
      const query = supabase.from('student_stats').select('*');
      const response = await query;
      if (response.error) throw new Error(response.error.message);
      
      const statsList = response.data || [];
      const statsMap = { ...get().allStats };
      statsList.forEach((stat: StudentStats) => {
        const normalizedId = normalizeStudentId(stat.student_id);
        statsMap[normalizedId] = {
          ...stat,
          student_id: normalizedId
        };
      });
      set({ allStats: statsMap });
    } catch (err: any) {
      console.error('Error fetching student stats:', err.message);
    } finally {
      set({ isLoadingStats: false });
    }
  },

  subscribeToStudentStats: (studentId) => {
    if (statsChannel) return;

    const dbStudentId = mapStudentIdToUuid(studentId);
    
    statsChannel = supabase
      .channel('custom-stats-channel')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'student_stats', 
        filter: `student_id=eq.${dbStudentId}` 
      }, (payload) => {
        console.log("Realtime stats update received:", payload);
        
        const updatedStats = payload.new as StudentStats;
        const normalizedId = normalizeStudentId(updatedStats.student_id);
        
        set((state) => ({
          allStats: {
            ...state.allStats,
            [studentId]: {
              ...updatedStats,
              student_id: studentId
            },
            [normalizedId]: {
              ...updatedStats,
              student_id: normalizedId
            }
          }
        }));
      })
      .subscribe();
  },

  unsubscribeFromStudentStats: () => {
    if (statsChannel) {
      supabase.removeChannel(statsChannel);
      statsChannel = null;
    }
  },

  resetStudentStore: () => {
    set({
      activeStudentId: 'std-pa',
      allStats: STATS_MAP_SEED,
      allAvatars: AVATAR_MAP_SEED,
      studentInventoryMap: STUDENT_INVENTORY_SEED,
      studentMessages: STUDENT_MESSAGES_SEED,
      isLoadingStats: false,
    });
  },
}));

export const isUuid = (str?: string): boolean => {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
};

export const mapStudentIdToUuid = (id: string): string => {
  if (isUuid(id)) return id;
  if (id === 'std-pa') return 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a11';
  if (id === 'std-sec') return 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a22';
  if (id === 'std-pb') return 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a33';
  if (id === 'std-prep') return 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a44';
  return id;
};

export const normalizeStudentId = (id: string): string => {
  if (id === 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a11') return 'std-pa';
  if (id === 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a22') return 'std-sec';
  if (id === 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a33') return 'std-pb';
  if (id === 'c00a0eeb-9c0b-4ef8-bb6d-6bb9bd380a44') return 'std-prep';
  return id;
};

// Selectores React
export const useCurrentStudentStats = () => {
  const activeStudentId = useStudentStore(state => state.activeStudentId);
  const stats = useStudentStore(state => state.allStats[normalizeStudentId(activeStudentId)] || state.allStats[activeStudentId]);
  
  return useMemo(() => {
    const active = stats || STATS_MAP_SEED[activeStudentId] || STATS_MAP_SEED[normalizeStudentId(activeStudentId)];
    if (active) {
      let petStage = active.pet_stage || 'egg';
      const lvl = active.level || 1;
      if (lvl >= 8) petStage = 'mystic';
      else if (lvl >= 5) petStage = 'adult';
      else if (lvl >= 3) petStage = 'baby';

      return {
        ...active,
        pet_stage: petStage,
        pet_energy: active.pet_energy ?? 100,
        pet_happiness: active.pet_happiness ?? 50
      };
    }
    return {
      student_id: activeStudentId,
      xp: 0,
      level: 1,
      coins: 0,
      current_streak: 1,
      max_streak: 1,
      pet_stage: 'egg' as const,
      pet_energy: 100,
      pet_happiness: 50,
      updated_at: ''
    };
  }, [stats, activeStudentId]);
};

export const useCurrentStudentAvatar = () => {
  const activeStudentId = useStudentStore(state => state.activeStudentId);
  const avatar = useStudentStore(state => state.allAvatars[normalizeStudentId(activeStudentId)] || state.allAvatars[activeStudentId]);
  
  return useMemo(() => {
    const active = avatar || AVATAR_MAP_SEED[activeStudentId] || AVATAR_MAP_SEED[normalizeStudentId(activeStudentId)];
    if (active) {
      return {
        pet_type: 'dragon' as const,
        pet_name: 'Mascota',
        pet_hunger: 50,
        pet_happiness: 50,
        pet_outfit: 'none',
        ...active
      };
    }
    return {
      student_id: activeStudentId,
      avatar_name: 'Estudiante',
      hair_style: 'classic',
      hair_color: '#4B5563',
      eyes_style: 'happy',
      outfit_style: 'explorer',
      outfit_color: '#3B82F6',
      background_style: 'forest',
      unlocked_items: ['classic', 'happy', 'explorer', 'forest'],
      pet_type: 'dragon' as const,
      pet_name: 'Mascota',
      pet_hunger: 50,
      pet_happiness: 50,
      pet_outfit: 'none',
      updated_at: ''
    };
  }, [avatar, activeStudentId]);
};

export const useCurrentStudentProfile = () => {
  const activeStudentId = useStudentStore(state => state.activeStudentId);
  return useMemo(() => {
    const norm = normalizeStudentId(activeStudentId);
    return STUDENTS_LIST_SEED.find(s => s.id === norm) || STUDENTS_LIST_SEED.find(s => s.id === activeStudentId) || STUDENTS_LIST_SEED[1];
  }, [activeStudentId]);
};
