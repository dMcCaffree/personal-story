import type { Scene } from "@/lib/story-config";

/**
 * Scene configuration
 * Add or remove scenes here as needed
 */
export const scenes: Scene[] = [
	{
		index: 1,
		title: "Brace Yourself",
		hasAsides: true,
		// Aside coordinates from source image (2752x1536)
		// Measure X, Y (top-left), width, and height in your image editor
		// The system automatically adjusts for object-cover cropping at any screen size
		asides: [
			{
				id: "books",
				name: "Books",
				source: { x: 215, y: 1064, width: 509.87, height: 295.5 },
			},
			{
				id: "mask",
				name: "Mask",
				// Placeholder coordinates - measure from your source image
				source: { x: 1065.5, y: 473, width: 220, height: 168.66 },
			},
			{
				id: "shoes",
				name: "Shoes",
				// Placeholder coordinates - measure from your source image
				source: { x: 1904, y: 1120, width: 202.3, height: 310.59 },
			},
			{
				id: "teeth",
				name: "Teeth",
				// Placeholder coordinates - measure from your source image
				source: { x: 779, y: 760, width: 92, height: 62.13 },
			},
			{
				id: "vineyard",
				name: "Vineyard",
				// Placeholder coordinates - measure from your source image
				source: { x: 747, y: 61, width: 2007, height: 1178.5 },
			},
		],
	},
	{ index: 2, title: "Don't Lecture Me", hasAsides: false },
	{ index: 3, title: "If You Build It", hasAsides: false },
	{ index: 4, title: "I Don't Sleep So Good, Baby", hasAsides: false },
	{ index: 5, title: "No Soliciting", hasAsides: false },
	{ index: 6, title: "Take A Chance On Me", hasAsides: false },
	{ index: 7, title: "Icarus Has Takeoff", hasAsides: false },
	{
		index: 8,
		title: "Never regret thy fall, O Icarus of the fearless flight",
		hasAsides: false,
	},
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
