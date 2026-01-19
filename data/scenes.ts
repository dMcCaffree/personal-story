import { Scene } from "@/lib/story-config";

/**
 * Scene configuration
 * Add or remove scenes here as needed
 */
export const scenes: Scene[] = [
	{ index: 1, title: "Brace Yourself", hasAsides: false },
	{ index: 2, title: "Don't Lecture Me", hasAsides: false },
	{ index: 3, title: "If You Build It", hasAsides: false },
	{ index: 4, title: "I Don't Sleep So Good, Baby", hasAsides: false },
	{ index: 5, title: "No Soliciting", hasAsides: false },
	{ index: 6, title: "Take A Chance On Me", hasAsides: false },
	{ index: 7, title: "Icarus Has Takeoff", hasAsides: false },
	{ index: 8, title: "Brothers Near The Sun", hasAsides: false },
	{ index: 9, title: "It Burns Us", hasAsides: false },
	{ index: 10, title: "When It Rains, It's Just Rain", hasAsides: false },
	{ index: 11, title: "4 Years @ Copy.ai", hasAsides: false },
	{ index: 12, title: "GTM Engine (GOATS)", hasAsides: false },
	{ index: 13, title: "The Return", hasAsides: false },
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
