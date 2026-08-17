import { StudioActivityJSON } from '@/types';

/**
 * Tipos de bloques didácticos soportados en el Taller de Creación
 */
export type StudioBlockType = 
  // Herramientas Principales (Barra Lateral Izquierda)
  | 'text_narrative'     // Instrucción / Fragmento narrativo / Lore
  | 'quiz_question'      // Pregunta de opción múltiple interactiva
  | 'reward_chest'       // Recompensas: XP, Monedas de oro, Gemas, Insignias
  | 'boss_enemy'         // Encuentro de combate contra Boss / Enemigo

  // Herramientas Extendidas (Menú [+])
  | 'youtube_video'      // Video educativo incrustado con marcas de tiempo
  | 'external_embed'     // Simuladores interactivos (PhET, GeoGebra) o Web
  | 'minigame_action'    // Minijuego (Ruleta, Memorama, Ahorcado, Candado)
  | 'logic_branch'       // Ramificación condicional según desempeño
  | 'audio_sfx';         // Efectos de sonido o ambientación

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
    timeLimitSeconds: number; // 0 = sin límite
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
 * 7. Bloque de Minijuego
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
 * 8. Bloque de Ramificación Lógica
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
 * 9. Bloque de Audio / Efecto Sonoro
 */
export interface AudioSfxBlock extends BaseStudioBlock {
  type: 'audio_sfx';
  data: {
    soundType: 'victory_fanfare' | 'battle_drums' | 'mystery_ambient' | 'level_up';
    volume: number; // 0.1 a 1.0
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
  | MinigameActionBlock
  | LogicBranchBlock
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
