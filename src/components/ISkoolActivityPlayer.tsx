"use client";

import React from 'react';
import { CanvasActivityJSON } from '@/types';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { TriviaPlayer } from '@/components/games/TriviaPlayer';
import { MemoramaPlayer } from '@/components/games/MemoramaPlayer';
import { AhorcadoPlayer } from '@/components/games/AhorcadoPlayer';
import { FlashcardsPlayer } from '@/components/games/FlashcardsPlayer';
import { GenericGameStub } from '@/components/games/GenericGameStub';
import { InteractiveUniversalGamePlayer } from '@/components/games/InteractiveUniversalGamePlayer';

interface ISkoolActivityPlayerProps {
  activity: CanvasActivityJSON;
  templateType?: string;
  onClose?: () => void;
  onComplete?: (score: number) => void;
}

export const ISkoolActivityPlayer: React.FC<ISkoolActivityPlayerProps> = ({
  activity,
  templateType = 'trivia',
  onClose,
  onComplete
}) => {
  const renderGameComponent = () => {
    switch (templateType.toLowerCase()) {
      case 'trivia':
        return <TriviaPlayer activity={activity} onClose={onClose} onComplete={onComplete} />;
      
      case 'memorama':
        return <MemoramaPlayer activity={activity} onClose={onClose} onComplete={onComplete} />;
      
      case 'ahorcado':
        return <AhorcadoPlayer activity={activity} onClose={onClose} onComplete={onComplete} />;
      
      case 'flashcards':
        return <FlashcardsPlayer activity={activity} onClose={onClose} onComplete={onComplete} />;

      default:
        return (
          <InteractiveUniversalGamePlayer
            activity={activity}
            templateType={templateType}
            onClose={onClose}
            onComplete={onComplete}
          />
        );
    }
  };

  return (
    <ErrorBoundary fallbackTitle="Nuestros duendes mágicos están ocupados, intenta de nuevo.">
      {renderGameComponent()}
    </ErrorBoundary>
  );
};
