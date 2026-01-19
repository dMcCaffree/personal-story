"use client";

import { useEffect, useState } from "react";
import { getKeyframeUrl, getTransitionUrl, getNarrationUrl } from "@/lib/story-config";

interface PreloadState {
  keyframeLoaded: boolean;
  transitionLoaded: boolean;
  narrationLoaded: boolean;
}

/**
 * Preload assets for the next scene
 */
export function useAssetPreloader(nextSceneIndex: number | null, currentSceneIndex: number) {
  const [preloadState, setPreloadState] = useState<PreloadState>({
    keyframeLoaded: false,
    transitionLoaded: false,
    narrationLoaded: false,
  });

  useEffect(() => {
    if (nextSceneIndex === null) {
      return;
    }

    // Reset state
    setPreloadState({
      keyframeLoaded: false,
      transitionLoaded: false,
      narrationLoaded: false,
    });

    // Preload keyframe
    const keyframeImg = new Image();
    keyframeImg.onload = () => {
      setPreloadState((prev) => ({ ...prev, keyframeLoaded: true }));
    };
    keyframeImg.src = getKeyframeUrl(nextSceneIndex);

    // Preload transition video
    const transitionVideo = document.createElement("video");
    transitionVideo.preload = "auto";
    transitionVideo.onloadeddata = () => {
      setPreloadState((prev) => ({ ...prev, transitionLoaded: true }));
    };
    transitionVideo.src = getTransitionUrl(currentSceneIndex, nextSceneIndex);

    // Preload narration audio
    const narrationAudio = new Audio();
    narrationAudio.preload = "auto";
    narrationAudio.onloadeddata = () => {
      setPreloadState((prev) => ({ ...prev, narrationLoaded: true }));
    };
    narrationAudio.src = getNarrationUrl(nextSceneIndex);

    // Cleanup
    return () => {
      keyframeImg.onload = null;
      transitionVideo.onloadeddata = null;
      narrationAudio.onloadeddata = null;
    };
  }, [nextSceneIndex, currentSceneIndex]);

  return preloadState;
}

