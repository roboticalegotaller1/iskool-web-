import { StudioActivityJSON } from '@/types';

/**
 * Tipos de bloques didácticos soportados en el Taller de Creación
 */
export type StudioBlockType = 
  // Herramientas Principales (Barra Lateral Izquierda - Acceso Rápido)
  | 'text_narrative'       // Instrucción / Fragmento narrativo / Lore
  | 'quiz_question'        // Pregunta de opción múltiple interactiva
  | 'reward_chest'         // Recompensas: XP, Monedas de oro, Gemas, Insignias
  | 'boss_enemy'           // Encuentro de combate contra Boss / Enemigo Pixi

  // Herramientas Extendidas LMS (Menú [+])
  | 'youtube_video'        // Video educativo incrustado con marcas de tiempo
  | 'external_embed'       // Simuladores interactivos (PhET, GeoGebra, Desmos)
  | 'drag_drop_match'      // Emparejamiento interactivo (Concepto <-> Definición)
  | 'ordering_sequence'    // Ordenar secuencia cronológica o algoritmo
  | 'fill_in_blanks'       // Completar espacios en blanco / Texto mutilado
  | 'open_poll_wordcloud'  // Pregunta abierta con evaluación formativa de IA
  | 'secret_code_puzzle'   // Acertijo de escape room / Código secreto
  | 'minigame_action'      // Minijuego Arcade (Ruleta, Memorama, Ahorcado)
  | 'logic_branch'         // Ramificación condicional según desempeño
  | 'checkpoint_gate'      // Punto de control y autoevaluación / Rúbrica
  | 'badge_certificate'    // Certificado y diploma digital de maestría
  | 'audio_sfx';           // Efectos de sonido o ambientación musical

/**
 * Posición 2D del nodo en el tablero de flujos estilo n8n
 */
export interface FlowNodePosition {
  x: number;
  y: number;
}

/**
 * Conexión direccional (flecha) entre dos nodos
 */
export interface FlowConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string; // Para bifurcaciones: 'success' | 'failure' | 'next'
}

/**
 * Interfaz base para cualquier bloque didáctico del espacio de trabajo
 */
export interface BaseStudioBlock {
  id: string;
  type: StudioBlockType;
  title: string;
  isCollapsed?: boolean;
  badgeLabel?: string;
  connectionTargetId?: string | null;
  position?: FlowNodePosition;
  isStartNode?: boolean;
}

/**
 * 1. Bloque de Texto / Narrativa
 */
export interface TextNarrativeBlock extends BaseStudioBlock {
  type: 'text_narrative';
  data: {
    content: string;
    style: 'narrative_lore' | 'instruction' | 'dialogue';
    speakerName?: string;
    speakerAvatar?: string;
  };
}

/**
 * 2. Bloque de Pregunta de Opción Múltiple
 */
export interface QuizQuestionBlock extends BaseStudioBlock {
  type: 'quiz_question';
  data: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation?: string;
    imageUrl?: string;
    timeLimitSeconds: number;
  };
}

/**
 * 3. Bloque de Recompensa
 */
export interface RewardChestBlock extends BaseStudioBlock {
  type: 'reward_chest';
  data: {
    xpAmount: number;
    coinsAmount: number;
    badgeUnlockId?: string;
    badgeName?: string;
    badgeIcon?: string;
    chestRarity: 'common' | 'rare' | 'epic' | 'legendary';
  };
}

/**
 * 4. Bloque de Boss / Enemigo de Combate
 */
export interface BossEnemyBlock extends BaseStudioBlock {
  type: 'boss_enemy';
  data: {
    bossName: string;
    spriteKey: 'blood_dragon' | 'shadow_golem' | 'cyber_brux';
    maxHp: number;
    attackPower: number;
    victoryCondition: 'defeat_boss' | 'survive_turns';
    backgroundScene: 'volcano' | 'dungeon' | 'forest' | 'temple';
  };
}

/**
 * 5. Bloque de Video de YouTube
 */
export interface YouTubeVideoBlock extends BaseStudioBlock {
  type: 'youtube_video';
  data: {
    videoUrl: string;
    videoTitle?: string;
    startAtSeconds?: number;
    endAtSeconds?: number;
    mustWatchEntirely: boolean;
  };
}

/**
 * 6. Bloque de Recurso Externo / Iframe Seguro
 */
export interface ExternalEmbedBlock extends BaseStudioBlock {
  type: 'external_embed';
  data: {
    embedUrl: string;
    resourceTitle: string;
    instructions: string;
  };
}

/**
 * 7. Bloque de Emparejamiento (Drag & Drop Match)
 */
export interface DragDropMatchBlock extends BaseStudioBlock {
  type: 'drag_drop_match';
  data: {
    instructions: string;
    pairs: { left: string; right: string }[];
    timeLimitSeconds: number;
  };
}

/**
 * 8. Bloque de Ordenar Secuencia / Cronología
 */
export interface OrderingSequenceBlock extends BaseStudioBlock {
  type: 'ordering_sequence';
  data: {
    instructions: string;
    stepsInCorrectOrder: string[];
    randomizeStart: boolean;
  };
}

/**
 * 9. Bloque de Rellenar Espacios (Fill in Blanks)
 */
export interface FillInBlanksBlock extends BaseStudioBlock {
  type: 'fill_in_blanks';
  data: {
    instructions: string;
    textWithBlanks: string; // ej. "El cura [Miguel Hidalgo] dio el grito en [1810]."
    wordBank: string[];
  };
}

/**
 * 10. Bloque de Pregunta Abierta y Reflexión
 */
export interface OpenPollWordcloudBlock extends BaseStudioBlock {
  type: 'open_poll_wordcloud';
  data: {
    prompt: string;
    minWords: number;
    aiFeedbackRubric?: string;
  };
}

/**
 * 11. Bloque de Código Secreto / Acertijo de Escape Room
 */
export interface SecretCodePuzzleBlock extends BaseStudioBlock {
  type: 'secret_code_puzzle';
  data: {
    clueText: string;
    secretAnswer: string;
    hintText?: string;
  };
}

/**
 * 12. Bloque de Minijuego Arcade
 */
export interface MinigameActionBlock extends BaseStudioBlock {
  type: 'minigame_action';
  data: {
    minigameType: 'ruleta' | 'memorama' | 'ahorcado' | 'escape_room';
    difficulty: 'easy' | 'medium' | 'hard';
    items: string[];
  };
}

/**
 * 13. Bloque de Ramificación Lógica Adaptativa
 */
export interface LogicBranchBlock extends BaseStudioBlock {
  type: 'logic_branch';
  data: {
    condition: 'score_above_percentage' | 'has_lives_left' | 'item_collected';
    thresholdValue: number;
    ifTrueNextBlockId: string | null;
    ifFalseNextBlockId: string | null;
  };
}

/**
 * 14. Bloque de Punto de Control / Checkpoint
 */
export interface CheckpointGateBlock extends BaseStudioBlock {
  type: 'checkpoint_gate';
  data: {
    checkpointTitle: string;
    reflectionPrompt: string;
    requiredScorePercent: number;
  };
}

/**
 * 15. Bloque de Certificado / Diploma Digital
 */
export interface BadgeCertificateBlock extends BaseStudioBlock {
  type: 'badge_certificate';
  data: {
    certificateTitle: string;
    recipientHonor: string;
    teacherSignatureName: string;
  };
}

/**
 * 16. Bloque de Audio / Efecto Sonoro
 */
export interface AudioSfxBlock extends BaseStudioBlock {
  type: 'audio_sfx';
  data: {
    soundType: 'victory_fanfare' | 'battle_drums' | 'mystery_ambient' | 'level_up';
    volume: number;
    autoPlay: boolean;
  };
}

/**
 * Unión discriminada de todos los bloques didácticos
 */
export type StudioBlock =
  | TextNarrativeBlock
  | QuizQuestionBlock
  | RewardChestBlock
  | BossEnemyBlock
  | YouTubeVideoBlock
  | ExternalEmbedBlock
  | DragDropMatchBlock
  | OrderingSequenceBlock
  | FillInBlanksBlock
  | OpenPollWordcloudBlock
  | SecretCodePuzzleBlock
  | MinigameActionBlock
  | LogicBranchBlock
  | CheckpointGateBlock
  | BadgeCertificateBlock
  | AudioSfxBlock;

/**
 * Metadatos generales de la actividad creada
 */
export interface ActivityBuilderMetadata {
  title: string;
  description: string;
  subject: string;
  targetAge: string;
  campoFormativo: string;
  pdaNem: string;
  totalTimeLimit: number;
  livesCount: number;
  streakMultiplier: boolean;
}
