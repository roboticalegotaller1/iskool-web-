import { create } from 'zustand';
import { 
  StudioBlock, 
  StudioBlockType, 
  ActivityBuilderMetadata,
  TextNarrativeBlock,
  QuizQuestionBlock,
  RewardChestBlock,
  BossEnemyBlock,
  YouTubeVideoBlock,
  ExternalEmbedBlock,
  MinigameActionBlock,
  LogicBranchBlock,
  AudioSfxBlock
} from '@/types/studioBlocks';
import { StudioActivityJSON } from '@/types';

interface ActivityBuilderState {
  // Metadatos de la Actividad
  metadata: ActivityBuilderMetadata;
  
  // Lista de Bloques en el Espacio de Trabajo
  blocks: StudioBlock[];
  selectedBlockId: string | null;
  
  // Historial para Deshacer / Rehacer (Undo / Redo)
  history: StudioBlock[][];
  historyIndex: number;
  
  // Estados de la Interfaz
  isExtendedMenuOpen: boolean;
  isPreviewModalOpen: boolean;
  zoomLevel: number; // 0.85 a 1.15
  
  // Acciones sobre Bloques
  addBlock: (type: StudioBlockType, insertAtIndex?: number) => string;
  updateBlockData: (id: string, partialData: any) => void;
  updateBlockTitle: (id: string, title: string) => void;
  removeBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  reorderBlocks: (activeId: string, overId: string) => void;
  moveBlock: (id: string, direction: 'up' | 'down') => void;
  toggleCollapseBlock: (id: string) => void;
  setSelectedBlockId: (id: string | null) => void;
  
  // Acciones de Metadatos
  updateMetadata: (partial: Partial<ActivityBuilderMetadata>) => void;
  
  // Historial
  undo: () => void;
  redo: () => void;
  
  // Control de UI
  setIsExtendedMenuOpen: (isOpen: boolean) => void;
  setIsPreviewModalOpen: (isOpen: boolean) => void;
  setZoomLevel: (zoom: number) => void;
  
  // Serialización y Plantillas
  loadPresetBlocks: (presetBlocks: StudioBlock[], meta?: Partial<ActivityBuilderMetadata>) => void;
  serializeToActivityJSON: () => StudioActivityJSON;
  resetWorkspace: () => void;
}

const DEFAULT_METADATA: ActivityBuilderMetadata = {
  title: 'Nueva Actividad Didáctica',
  description: 'Actividad construida con bloques interactivos para estudiantes.',
  subject: 'Saberes y Pensamiento Científico',
  targetAge: 'Primaria Alta (9 - 11 años)',
  campoFormativo: 'Saberes y Pensamiento Científico',
  pdaNem: 'Explora y construye conocimientos a través de dinámicas activas.',
  totalTimeLimit: 0,
  livesCount: 3,
  streakMultiplier: true,
};

// Generador de bloques por defecto según el tipo
const createDefaultBlock = (type: StudioBlockType): StudioBlock => {
  const id = `blk-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

  switch (type) {
    case 'text_narrative':
      return {
        id,
        type: 'text_narrative',
        title: 'Instrucción / Narrativa',
        isCollapsed: false,
        data: {
          content: '¡Bienvenidos, exploradores del saber! Lean con atención el siguiente desafío para comenzar su aventura.',
          style: 'instruction',
          speakerName: 'Profesor Guía',
        }
      } as TextNarrativeBlock;

    case 'quiz_question':
      return {
        id,
        type: 'quiz_question',
        title: 'Pregunta de Opción Múltiple',
        isCollapsed: false,
        data: {
          question: '¿Cuál es el concepto clave que aprendimos en esta sesión?',
          options: ['Opción A (Respuesta correcta)', 'Opción B', 'Opción C', 'Opción D'],
          correctIndex: 0,
          explanation: 'Explicación pedagógica: Esta es la opción adecuada porque fundamenta el principio estudiado.',
          timeLimitSeconds: 30,
        }
      } as QuizQuestionBlock;

    case 'reward_chest':
      return {
        id,
        type: 'reward_chest',
        title: 'Cofre de Recompensas',
        isCollapsed: false,
        data: {
          xpAmount: 150,
          coinsAmount: 30,
          badgeName: 'Maestro del Saber',
          chestRarity: 'rare',
        }
      } as RewardChestBlock;

    case 'boss_enemy':
      return {
        id,
        type: 'boss_enemy',
        title: 'Encuentro de Combate Pixi',
        isCollapsed: false,
        data: {
          bossName: 'Gólem del Olvido',
          spriteKey: 'blood_dragon',
          maxHp: 100,
          attackPower: 15,
          victoryCondition: 'defeat_boss',
          backgroundScene: 'volcano',
        }
      } as BossEnemyBlock;

    case 'youtube_video':
      return {
        id,
        type: 'youtube_video',
        title: 'Video Explicativo',
        isCollapsed: false,
        data: {
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          videoTitle: 'Cápsula de Aprendizaje',
          mustWatchEntirely: false,
        }
      } as YouTubeVideoBlock;

    case 'external_embed':
      return {
        id,
        type: 'external_embed',
        title: 'Simulador / Iframe Web',
        isCollapsed: false,
        data: {
          embedUrl: 'https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_es.html',
          resourceTitle: 'Simulador Científico Interactivo',
          instructions: 'Interactúa con los controles del simulador antes de continuar con la siguiente pregunta.',
        }
      } as ExternalEmbedBlock;

    case 'minigame_action':
      return {
        id,
        type: 'minigame_action',
        title: 'Minijuego Didáctico',
        isCollapsed: false,
        data: {
          minigameType: 'ruleta',
          difficulty: 'medium',
          items: ['Concepto 1', 'Concepto 2', 'Concepto 3', 'Concepto 4'],
        }
      } as MinigameActionBlock;

    case 'logic_branch':
      return {
        id,
        type: 'logic_branch',
        title: 'Condición Pedagógica',
        isCollapsed: false,
        data: {
          condition: 'score_above_percentage',
          thresholdValue: 70,
          ifTrueNextBlockId: null,
          ifFalseNextBlockId: null,
        }
      } as LogicBranchBlock;

    case 'audio_sfx':
      return {
        id,
        type: 'audio_sfx',
        title: 'Efecto de Audio / Fanfarria',
        isCollapsed: false,
        data: {
          soundType: 'victory_fanfare',
          volume: 0.8,
          autoPlay: true,
        }
      } as AudioSfxBlock;
  }
};

const INITIAL_BLOCKS: StudioBlock[] = [
  createDefaultBlock('text_narrative'),
  createDefaultBlock('quiz_question'),
  createDefaultBlock('reward_chest')
];

export const useActivityBuilderStore = create<ActivityBuilderState>((set, get) => ({
  metadata: DEFAULT_METADATA,
  blocks: INITIAL_BLOCKS,
  selectedBlockId: INITIAL_BLOCKS[0].id,
  history: [INITIAL_BLOCKS],
  historyIndex: 0,
  
  isExtendedMenuOpen: false,
  isPreviewModalOpen: false,
  zoomLevel: 1.0,

  // Registrar un snapshot en el historial
  addBlock: (type: StudioBlockType, insertAtIndex?: number) => {
    const newBlock = createDefaultBlock(type);
    set((state) => {
      const newBlocks = [...state.blocks];
      if (typeof insertAtIndex === 'number' && insertAtIndex >= 0 && insertAtIndex <= newBlocks.length) {
        newBlocks.splice(insertAtIndex, 0, newBlock);
      } else {
        newBlocks.push(newBlock);
      }

      const updatedHistory = state.history.slice(0, state.historyIndex + 1);
      updatedHistory.push(newBlocks);

      return {
        blocks: newBlocks,
        selectedBlockId: newBlock.id,
        history: updatedHistory,
        historyIndex: updatedHistory.length - 1,
      };
    });
    return newBlock.id;
  },

  updateBlockData: (id: string, partialData: any) => {
    set((state) => {
      const newBlocks = state.blocks.map((b) => {
        if (b.id !== id) return b;
        return {
          ...b,
          data: {
            ...b.data,
            ...partialData,
          },
        } as StudioBlock;
      });

      return { blocks: newBlocks };
    });
  },

  updateBlockTitle: (id: string, title: string) => {
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, title } : b)),
    }));
  },

  removeBlock: (id: string) => {
    set((state) => {
      const newBlocks = state.blocks.filter((b) => b.id !== id);
      const updatedHistory = state.history.slice(0, state.historyIndex + 1);
      updatedHistory.push(newBlocks);

      return {
        blocks: newBlocks,
        selectedBlockId: state.selectedBlockId === id ? (newBlocks[0]?.id || null) : state.selectedBlockId,
        history: updatedHistory,
        historyIndex: updatedHistory.length - 1,
      };
    });
  },

  duplicateBlock: (id: string) => {
    set((state) => {
      const blockToDup = state.blocks.find((b) => b.id === id);
      if (!blockToDup) return state;

      const idx = state.blocks.findIndex((b) => b.id === id);
      const duplicated: StudioBlock = {
        ...blockToDup,
        id: `blk-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title: `${blockToDup.title} (Copia)`,
        data: JSON.parse(JSON.stringify(blockToDup.data)),
      };

      const newBlocks = [...state.blocks];
      newBlocks.splice(idx + 1, 0, duplicated);

      const updatedHistory = state.history.slice(0, state.historyIndex + 1);
      updatedHistory.push(newBlocks);

      return {
        blocks: newBlocks,
        selectedBlockId: duplicated.id,
        history: updatedHistory,
        historyIndex: updatedHistory.length - 1,
      };
    });
  },

  reorderBlocks: (activeId: string, overId: string) => {
    set((state) => {
      if (activeId === overId) return state;
      const oldIndex = state.blocks.findIndex((b) => b.id === activeId);
      const newIndex = state.blocks.findIndex((b) => b.id === overId);
      if (oldIndex === -1 || newIndex === -1) return state;

      const newBlocks = [...state.blocks];
      const [movedItem] = newBlocks.splice(oldIndex, 1);
      newBlocks.splice(newIndex, 0, movedItem);

      const updatedHistory = state.history.slice(0, state.historyIndex + 1);
      updatedHistory.push(newBlocks);

      return {
        blocks: newBlocks,
        history: updatedHistory,
        historyIndex: updatedHistory.length - 1,
      };
    });
  },

  moveBlock: (id: string, direction: 'up' | 'down') => {
    set((state) => {
      const idx = state.blocks.findIndex((b) => b.id === id);
      if (idx === -1) return state;
      if (direction === 'up' && idx === 0) return state;
      if (direction === 'down' && idx === state.blocks.length - 1) return state;

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      const newBlocks = [...state.blocks];
      const [item] = newBlocks.splice(idx, 1);
      newBlocks.splice(targetIdx, 0, item);

      const updatedHistory = state.history.slice(0, state.historyIndex + 1);
      updatedHistory.push(newBlocks);

      return {
        blocks: newBlocks,
        history: updatedHistory,
        historyIndex: updatedHistory.length - 1,
      };
    });
  },

  toggleCollapseBlock: (id: string) => {
    set((state) => ({
      blocks: state.blocks.map((b) => (b.id === id ? { ...b, isCollapsed: !b.isCollapsed } : b)),
    }));
  },

  setSelectedBlockId: (id: string | null) => {
    set({ selectedBlockId: id });
  },

  updateMetadata: (partial: Partial<ActivityBuilderMetadata>) => {
    set((state) => ({
      metadata: { ...state.metadata, ...partial },
    }));
  },

  undo: () => {
    set((state) => {
      if (state.historyIndex <= 0) return state;
      const newIdx = state.historyIndex - 1;
      const prevBlocks = state.history[newIdx];
      return {
        blocks: prevBlocks,
        historyIndex: newIdx,
        selectedBlockId: prevBlocks[0]?.id || null,
      };
    });
  },

  redo: () => {
    set((state) => {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIdx = state.historyIndex + 1;
      const nextBlocks = state.history[newIdx];
      return {
        blocks: nextBlocks,
        historyIndex: newIdx,
        selectedBlockId: nextBlocks[0]?.id || null,
      };
    });
  },

  setIsExtendedMenuOpen: (isOpen: boolean) => set({ isExtendedMenuOpen: isOpen }),
  setIsPreviewModalOpen: (isOpen: boolean) => set({ isPreviewModalOpen: isOpen }),
  setZoomLevel: (zoom: number) => set({ zoomLevel: Math.min(1.2, Math.max(0.8, zoom)) }),

  loadPresetBlocks: (presetBlocks: StudioBlock[], meta?: Partial<ActivityBuilderMetadata>) => {
    set((state) => {
      const newHistory = [presetBlocks];
      return {
        blocks: presetBlocks,
        selectedBlockId: presetBlocks[0]?.id || null,
        metadata: meta ? { ...state.metadata, ...meta } : state.metadata,
        history: newHistory,
        historyIndex: 0,
      };
    });
  },

  serializeToActivityJSON: (): StudioActivityJSON => {
    const state = get();
    const quizQuestions: any[] = [];

    state.blocks.forEach((block, idx) => {
      if (block.type === 'quiz_question') {
        const qData = block.data;
        quizQuestions.push({
          question: qData.question,
          options: qData.options,
          correctIndex: qData.correctIndex,
          explanation: qData.explanation,
          imageUrl: qData.imageUrl,
        });
      } else if (block.type === 'text_narrative') {
        quizQuestions.push({
          question: `📖 ${block.title}: ${block.data.content}`,
          options: ['¡Entendido! Continuar', 'Revisar detalles'],
          correctIndex: 0,
          explanation: block.data.content,
        });
      } else if (block.type === 'reward_chest') {
        quizQuestions.push({
          question: `🎁 ${block.title} (+${block.data.xpAmount} XP, +${block.data.coinsAmount} Monedas)`,
          options: ['¡Reclamar Recompensa! 🏆', 'Continuar la Misión'],
          correctIndex: 0,
          explanation: `Has obtenido ${block.data.xpAmount} XP para tu avatar.`,
        });
      } else if (block.type === 'boss_enemy') {
        quizQuestions.push({
          question: `⚔️ Desafío contra ${block.data.bossName}: ¡Responde rápido para atacar!`,
          options: ['¡Atacar con Sabiduría!', 'Defenderse', 'Usar Poción', 'Estrategia de Equipo'],
          correctIndex: 0,
          explanation: `¡Golpe crítico acertado al ${block.data.bossName}!`,
        });
      } else {
        quizQuestions.push({
          question: `✨ Módulo Especial: ${block.title}`,
          options: ['Continuar', 'Explorar'],
          correctIndex: 0,
          explanation: 'Actividad interactiva completada.',
        });
      }
    });

    return {
      title: state.metadata.title,
      description: state.metadata.description,
      questions: quizQuestions.length > 0 ? quizQuestions : [
        {
          question: '¿Listo para comenzar?',
          options: ['Sí, empezar', 'Ver instrucciones'],
          correctIndex: 0,
        }
      ],
    };
  },

  resetWorkspace: () => {
    const initial = [createDefaultBlock('text_narrative'), createDefaultBlock('quiz_question')];
    set({
      metadata: DEFAULT_METADATA,
      blocks: initial,
      selectedBlockId: initial[0].id,
      history: [initial],
      historyIndex: 0,
      isExtendedMenuOpen: false,
      isPreviewModalOpen: false,
      zoomLevel: 1.0,
    });
  },
}));
