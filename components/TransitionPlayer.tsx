"use client";

import { useEffect, useRef, useState } from "react";
import { getTransitionUrl } from "@/lib/story-config";
import { PlaybackDirection } from "@/lib/story-config";

interface TransitionPlayerProps {
  fromSceneIndex: number;
  toSceneIndex: number;
  direction: PlaybackDirection;
  isPlaying: boolean;
  onTransitionStart?: () => void;
  onTransitionEnd?: () => void;
}

export function TransitionPlayer({
  fromSceneIndex,
  toSceneIndex,
  direction,
  isPlaying,
  onTransitionStart,
  onTransitionEnd,
}: TransitionPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isPlaying) return;

    const playTransition = async () => {
      try {
        setIsVisible(true);

        // Reset video to start or end depending on direction
        if (direction === "forward") {
          video.currentTime = 0;
          video.playbackRate = 1;
        } else {
          // For reverse, we need to wait for metadata to know duration
          await new Promise<void>((resolve) => {
            if (video.readyState >= 1) {
              resolve();
            } else {
              video.addEventListener("loadedmetadata", () => resolve(), { once: true });
            }
          });
          video.currentTime = video.duration;
          video.playbackRate = -1;
        }

        onTransitionStart?.();
        await video.play();
      } catch (error) {
        console.error("Error playing transition:", error);
        onTransitionEnd?.();
        setIsVisible(false);
      }
    };

    playTransition();
  }, [fromSceneIndex, toSceneIndex, direction, isPlaying, onTransitionStart, onTransitionEnd]);

  const handleEnded = () => {
    setIsVisible(false);
    onTransitionEnd?.();
  };

  // Use the transition URL based on the actual scene indices
  // For reverse, we still use the same file but play it backwards
  const actualFrom = direction === "forward" ? fromSceneIndex : toSceneIndex;
  const actualTo = direction === "forward" ? toSceneIndex : fromSceneIndex;
  const transitionUrl = getTransitionUrl(actualFrom, actualTo);

  if (!isPlaying && !isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isPlaying ? "auto" : "none",
        transition: isVisible ? "none" : "opacity 0.3s",
      }}
    >
      <video
        ref={videoRef}
        src={transitionUrl}
        className="h-full w-full object-cover"
        playsInline
        preload="auto"
        onEnded={handleEnded}
        style={{
          pointerEvents: "none",
          userSelect: "none",
        }}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}

