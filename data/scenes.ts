import { Scene } from "@/lib/story-config";

/**
 * Scene configuration
 * Add or remove scenes here as needed
 */
export const scenes: Scene[] = [
  { index: 1, title: "Opening", hasAsides: false },
  { index: 2, title: "Chapter Two", hasAsides: false },
  { index: 3, title: "Chapter Three", hasAsides: false },
];

/**
 * Get total number of scenes
 */
export function getTotalScenes(): number {
  return scenes.length;
}

/**
 * Get scene by index
 */
export function getScene(index: number): Scene | undefined {
  return scenes.find((scene) => scene.index === index);
}

/**
 * Check if scene index is valid
 */
export function isValidSceneIndex(index: number): boolean {
  return index >= 1 && index <= scenes.length;
}

