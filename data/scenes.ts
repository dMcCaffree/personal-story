import { Scene } from "@/lib/story-config";

/**
 * Scene configuration
 * Add or remove scenes here as needed
 */
export const scenes: Scene[] = [
	{ index: 1, title: "Opening", hasAsides: false },
	{ index: 2, title: "Chapter Two", hasAsides: false },
	{ index: 3, title: "Chapter Three", hasAsides: false },
	{ index: 4, title: "Chapter Four", hasAsides: false },
	{ index: 5, title: "Chapter Five", hasAsides: false },
	{ index: 6, title: "Chapter Six", hasAsides: false },
	{ index: 7, title: "Chapter Seven", hasAsides: false },
	{ index: 8, title: "Chapter Eight", hasAsides: false },
	{ index: 9, title: "Chapter Nine", hasAsides: false },
	{ index: 10, title: "Chapter Ten", hasAsides: false },
	{ index: 11, title: "Chapter Eleven", hasAsides: false },
	{ index: 12, title: "Chapter Twelve", hasAsides: false },
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
