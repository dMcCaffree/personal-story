"use client";

import { useEffect, useRef } from "react";
import { getNarrationUrl } from "@/lib/story-config";
import { useStory } from "@/contexts/StoryContext";

interface NarrationPlayerProps {
  sceneIndex: number;
  shouldPlay: boolean;
  onEnded?: () => void;
}

export function NarrationPlayer({ sceneIndex, shouldPlay, onEnded }: NarrationPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { hasNarrationPlayed, markNarrationPlayed } = useStory();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Check if narration has already been played in this session
    const alreadyPlayed = hasNarrationPlayed(sceneIndex);

    if (shouldPlay && !alreadyPlayed) {
      // Play the narration
      audio.play().catch((error) => {
        console.error("Error playing narration:", error);
      });

      // Mark as played
      markNarrationPlayed(sceneIndex);
    } else if (!shouldPlay) {
      // Stop and reset if not supposed to play
      audio.pause();
      audio.currentTime = 0;
    }
  }, [sceneIndex, shouldPlay, hasNarrationPlayed, markNarrationPlayed]);

  const handleEnded = () => {
    onEnded?.();
  };

  return (
    <audio
      ref={audioRef}
      src={getNarrationUrl(sceneIndex)}
      onEnded={handleEnded}
      preload="auto"
    />
  );
}

