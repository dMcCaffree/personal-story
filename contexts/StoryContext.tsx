"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { StoryState, PlaybackDirection } from "@/lib/story-config";
import { getTotalScenes } from "@/data/scenes";
import {
  getNarrationsPlayed,
  markNarrationPlayed as saveNarrationPlayed,
  hasNarrationPlayed as checkNarrationPlayed,
} from "@/utils/session-storage";

interface StoryContextValue extends StoryState {
  goToNextScene: () => void;
  goToPreviousScene: () => void;
  setIsTransitioning: (value: boolean) => void;
  markNarrationPlayed: (sceneIndex: number) => void;
  hasNarrationPlayed: (sceneIndex: number) => boolean;
  totalScenes: number;
  canGoNext: boolean;
  canGoBack: boolean;
}

const StoryContext = createContext<StoryContextValue | undefined>(undefined);

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const totalScenes = getTotalScenes();

  const [state, setState] = useState<StoryState>({
    currentSceneIndex: 1,
    previousSceneIndex: null,
    isTransitioning: false,
    playbackDirection: "forward",
  });

  const canGoNext = state.currentSceneIndex < totalScenes;
  const canGoBack = state.currentSceneIndex > 1;

  const goToNextScene = useCallback(() => {
    if (state.isTransitioning || !canGoNext) {
      return;
    }

    setState((prev) => ({
      ...prev,
      previousSceneIndex: prev.currentSceneIndex,
      currentSceneIndex: prev.currentSceneIndex + 1,
      isTransitioning: true,
      playbackDirection: "forward",
    }));
  }, [state.isTransitioning, canGoNext]);

  const goToPreviousScene = useCallback(() => {
    if (state.isTransitioning || !canGoBack) {
      return;
    }

    setState((prev) => ({
      ...prev,
      previousSceneIndex: prev.currentSceneIndex,
      currentSceneIndex: prev.currentSceneIndex - 1,
      isTransitioning: true,
      playbackDirection: "reverse",
    }));
  }, [state.isTransitioning, canGoBack]);

  const setIsTransitioning = useCallback((value: boolean) => {
    setState((prev) => ({
      ...prev,
      isTransitioning: value,
    }));
  }, []);

  const markNarrationPlayed = useCallback((sceneIndex: number) => {
    saveNarrationPlayed(sceneIndex);
  }, []);

  const hasNarrationPlayed = useCallback((sceneIndex: number): boolean => {
    return checkNarrationPlayed(sceneIndex);
  }, []);

  const contextValue: StoryContextValue = {
    ...state,
    goToNextScene,
    goToPreviousScene,
    setIsTransitioning,
    markNarrationPlayed,
    hasNarrationPlayed,
    totalScenes,
    canGoNext,
    canGoBack,
  };

  return <StoryContext.Provider value={contextValue}>{children}</StoryContext.Provider>;
}

export function useStory() {
  const context = useContext(StoryContext);
  if (context === undefined) {
    throw new Error("useStory must be used within a StoryProvider");
  }
  return context;
}

