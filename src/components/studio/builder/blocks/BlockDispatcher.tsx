"use client";

import React from 'react';
import { StudioBlock } from '@/types/studioBlocks';
import { TextNarrativeBlockView } from './TextNarrativeBlockView';
import { QuizQuestionBlockView } from './QuizQuestionBlockView';
import { RewardChestBlockView } from './RewardChestBlockView';
import { BossEnemyBlockView } from './BossEnemyBlockView';
import { YouTubeVideoBlockView } from './YouTubeVideoBlockView';
import { ExternalEmbedBlockView } from './ExternalEmbedBlockView';
import { MinigameBlockView } from './MinigameBlockView';
import { LogicBranchBlockView } from './LogicBranchBlockView';
import { AudioSfxBlockView } from './AudioSfxBlockView';

interface Props {
  block: StudioBlock;
}

export const BlockDispatcher: React.FC<Props> = ({ block }) => {
  switch (block.type) {
    case 'text_narrative':
      return <TextNarrativeBlockView block={block} />;
    case 'quiz_question':
      return <QuizQuestionBlockView block={block} />;
    case 'reward_chest':
      return <RewardChestBlockView block={block} />;
    case 'boss_enemy':
      return <BossEnemyBlockView block={block} />;
    case 'youtube_video':
      return <YouTubeVideoBlockView block={block} />;
    case 'external_embed':
      return <ExternalEmbedBlockView block={block} />;
    case 'minigame_action':
      return <MinigameBlockView block={block} />;
    case 'logic_branch':
      return <LogicBranchBlockView block={block} />;
    case 'audio_sfx':
      return <AudioSfxBlockView block={block} />;
    default:
      return (
        <div className="p-4 text-xs text-slate-500 font-bold">
          Bloque no reconocido
        </div>
      );
  }
};
