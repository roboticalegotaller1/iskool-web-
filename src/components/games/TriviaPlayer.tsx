"use client";

import React from 'react';
import { CanvasTriviaPlayer } from '@/components/CanvasTriviaPlayer';
import { CanvasActivityJSON } from '@/types';

interface TriviaPlayerProps {
  activity: CanvasActivityJSON;
  onClose?: () => void;
  onComplete?: (score: number) => void;
}

export const TriviaPlayer: React.FC<TriviaPlayerProps> = ({ activity, onClose, onComplete }) => {
  return <CanvasTriviaPlayer activity={activity} onClose={onClose} onComplete={onComplete} />;
};
