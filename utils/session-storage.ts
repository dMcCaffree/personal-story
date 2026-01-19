/**
 * Session storage utilities for tracking narration playback
 */

const NARRATIONS_PLAYED_KEY = "story_narrations_played";

/**
 * Get the set of scene indices where narration has been played
 */
export function getNarrationsPlayed(): Set<number> {
  if (typeof window === "undefined") {
    return new Set();
  }

  try {
    const stored = sessionStorage.getItem(NARRATIONS_PLAYED_KEY);
    if (!stored) {
      return new Set();
    }
    const array = JSON.parse(stored);
    return new Set(array);
  } catch (error) {
    console.error("Error reading narrations from sessionStorage:", error);
    return new Set();
  }
}

/**
 * Mark a scene's narration as played
 */
export function markNarrationPlayed(sceneIndex: number): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const played = getNarrationsPlayed();
    played.add(sceneIndex);
    sessionStorage.setItem(NARRATIONS_PLAYED_KEY, JSON.stringify(Array.from(played)));
  } catch (error) {
    console.error("Error saving narration to sessionStorage:", error);
  }
}

/**
 * Check if a scene's narration has been played
 */
export function hasNarrationPlayed(sceneIndex: number): boolean {
  return getNarrationsPlayed().has(sceneIndex);
}

/**
 * Clear all narration tracking (useful for testing)
 */
export function clearNarrationsPlayed(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.removeItem(NARRATIONS_PLAYED_KEY);
  } catch (error) {
    console.error("Error clearing narrations from sessionStorage:", error);
  }
}

