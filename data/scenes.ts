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
				name: "That's Just Textbook",
				source: { x: 215, y: 1064, width: 509.87, height: 295.5 },
				zIndex: 2,
			},
			{
				id: "mask",
				name: "Not All Superheroes Wear Masks",
				source: { x: 1065.5, y: 473, width: 220, height: 168.66 },
				zIndex: 2,
			},
			{
				id: "shoes",
				name: "One Shoe, Two Shoe, Red Shoe, Yellow Shoe",
				source: { x: 1904, y: 1120, width: 202.3, height: 310.59 },
				zIndex: 2,
			},
			{
				id: "teeth",
				name: "Teeth",
				source: { x: 779, y: 760, width: 92, height: 62.13 },
				zIndex: 2,
			},
			{
				id: "vineyard",
				name: "Vineyard",
				source: { x: 747, y: 61, width: 2007, height: 1178.5 },
				zIndex: 1,
			},
		],
	},
	{
		index: 2,
		title: "Don't Lecture Me",
		hasAsides: true,
		asides: [
			{
				id: "byu",
				name: "BY-U Don't Know What It's Like",
				source: { x: 613, y: 0, width: 216.5, height: 338 },
			},
			{
				id: "professor",
				name: "Generic Mormon Dude",
				source: { x: 1746.8, y: 258.2, width: 252.21, height: 222.51 },
				zIndex: 2,
			},
			{
				id: "chalkboard",
				name: "We Need To Chalk",
				source: { x: 1326, y: 63, width: 1213.5, height: 436.37 },
				zIndex: 1,
			},
			{
				id: "desk",
				name: "First Strike, Nano Banana",
				source: { x: 831, y: 1031, width: 1006.56, height: 505 },
			},
		],
	},
	{
		index: 3,
		title: "If You Build It",
		hasAsides: true,
		asides: [
			{
				id: "screens",
				name: "More Screens Please",
				source: { x: 73, y: 90, width: 1345.11, height: 1225.25 },
			},
			{
				id: "coffee",
				name: "I've Literally Never Had One",
				source: { x: 1051, y: 822, width: 142.91, height: 217.55 },
				zIndex: 2,
			},
			{
				id: "phone",
				name: "It Was The Best Of Times",
				source: { x: 751, y: 1325, width: 444.24, height: 181.15 },
			},
		],
	},
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
