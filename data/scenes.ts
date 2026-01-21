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
				name: "Strike 1, Nano Banana",
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
				name: "Strike 2, Little Man",
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
	{
		index: 4,
		title: "I Don't Sleep So Good, Baby",
		hasAsides: true,
		asides: [
			{
				id: "clock",
				name: "2:13 AM",
				source: { x: 2317, y: 1108, width: 259.83, height: 170.59 },
			},
			{
				id: "coffee",
				name: "Strike 3, You're Out",
				source: { x: 1452, y: 746, width: 64.5, height: 96.88 },
			},
			{
				id: "picture",
				name: "Based On A True Story",
				source: { x: 1885, y: 1, width: 551, height: 436 },
			},
			{
				id: "wife",
				name: "Keep My Wife's Name Out of Your F**** Mouth",
				source: { x: 1740, y: 772, width: 536.22, height: 443.71 },
			},
		],
	},
	{
		index: 5,
		title: "No Soliciting",
		hasAsides: true,
		asides: [
			{
				id: "arm",
				name: "Well Beyond Strikes",
				source: { x: 2113.8, y: 570, width: 356.55, height: 396.65 },
			},
			{
				id: "tablet",
				name: "Who's The Real Pest?",
				source: { x: 1719, y: 851, width: 306.8, height: 379.88 },
			},
			{
				id: "sun",
				name: "(insert parched spongebob meme here)",
				source: { x: 832, y: 49, width: 330, height: 330 },
			},
		],
	},
	{
		index: 6,
		title: "Take A Chance On Me",
		hasAsides: true,
		asides: [
			{
				id: "coffee",
				name: "Brews Like Coffee, Tastes Like Heaven",
				source: { x: 2301, y: 1071, width: 217.06, height: 219.07 },
			},
			{
				id: "screen",
				name: "Kids React",
				source: { x: 1839, y: 228, width: 642.5, height: 683.5 },
			},
			{
				id: "smarty",
				name: "SmartyStreets === Smarty",
				source: { x: 1372, y: 337, width: 435, height: 119 },
			},
		],
	},
	{
		index: 7,
		title: "Icarus Has Takeoff",
		hasAsides: true,
		asides: [
			{
				id: "stickies",
				name: "Sticky, Sticky On The Wall",
				source: { x: 1502, y: 269, width: 1095.82, height: 915 },
			},
			{
				id: "mockup",
				name: "The Long & Shirt Of It",
				source: { x: 1695, y: 1109, width: 644.78, height: 214 },
				zIndex: 2,
			},
			{
				id: "desk",
				name: "Pen Tools... IYKYK Ughhh",
				source: { x: 0, y: 510, width: 615.65, height: 781.77 },
			},
		],
	},
	{
		index: 8,
		title: "Never regret thy fall, O Icarus of the fearless flight",
		hasAsides: true,
		asides: [
			{
				id: "hat",
				name: "The Swag That Never Was",
				source: { x: 1034, y: 125, width: 436.98, height: 225.75 },
			},
			{
				id: "screens",
				name: "React Native, Vue, React, Node, MongoDB",
				source: { x: 494, y: 1018, width: 1645.5, height: 352.5 },
			},
		],
	},
	{
		index: 9,
		title: "It Burns Us",
		hasAsides: true,
		asides: [
			{
				id: "calendar",
				name: "X Does Not, In Fact, Mark The Spot",
				source: { x: 584, y: 311, width: 280.02, height: 284 },
			},
			{
				id: "shoes",
				name: "AI <3 Converse",
				source: { x: 1120, y: 1300, width: 266.55, height: 112.32 },
			},
			{
				id: "nate",
				name: "Nate Carr, Product Guy & Design GOAT",
				source: { x: 1586, y: 310, width: 432.5, height: 1117.4 },
			},
		],
	},
	{
		index: 10,
		title: "When It Rains, It's Just Rain",
		hasAsides: true,
		asides: [
			{
				id: "coffee",
				name: "If We're Being Honest, I'm a Celsius Soyboy",
				source: { x: 890, y: 943, width: 155.03, height: 145 },
			},
			{
				id: "window",
				name: "Everything Really Is Bigger",
				source: { x: 313, y: 0, width: 1002, height: 872 },
			},
			{
				id: "secret-plant",
				name: "Our Love Fern",
				source: { x: 2558, y: 628, width: 93, height: 89.5 },
			},
		],
	},
	{
		index: 11,
		title: "4 Years @ Copy.ai",
		hasAsides: true,
		asides: [
			{
				id: "copyai",
				name: "3 Cheers For 4 Years",
				source: { x: 1009.5, y: 176.5, width: 711.5, height: 586 },
			},
			{
				id: "pizza",
				name: "Cowabunga",
				source: { x: 0, y: 740, width: 267.5, height: 509 },
			},
			{
				id: "coffee",
				name: "Son of a...",
				source: { x: 891, y: 942, width: 155, height: 146.06 },
			},
		],
	},
	{
		index: 12,
		title: "GTM Engine (GOATS)",
		hasAsides: true,
		asides: [
			{
				id: "holoscreens",
				name: "It's Giving... Minority Report",
				source: { x: 109, y: 210, width: 2580, height: 1018.13 },
			},
			{
				id: "glowup",
				name: "Dude, You're Glowing",
				source: { x: 1131, y: 86, width: 502.77, height: 817.77 },
				zIndex: 2,
			},
		],
	},
	{
		index: 13,
		title: "The Return",
		hasAsides: true,
		asides: [
			{
				id: "builder",
				name: "That's What She Said",
				source: { x: 1693, y: 124.5, width: 535, height: 163.02 },
			},
			{
				id: "founder",
				name: "Just 1 Letter From Flounder",
				source: { x: 1634, y: 318, width: 533.5, height: 131 },
			},
			{
				id: "operator",
				name: "You Ever Play Operation?",
				source: { x: 1705, y: 494, width: 527.5, height: 139.54 },
			},
			{
				id: "creator",
				name: "We're Meant To Create",
				source: { x: 1663, y: 661, width: 510.06, height: 150 },
			},
			{
				id: "sun",
				name: "The Big Yellow One's The Sun",
				source: { x: 1288, y: 440.5, width: 207, height: 130.01 },
			},
		],
	},
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
