// Achievement system types and utilities

import { getAsideImageUrl } from "./story-config";
import { scenes } from "@/data/scenes";

// Calculate total number of asides across all scenes dynamically
export const TOTAL_ASIDES = scenes.reduce((total, scene) => {
	return total + (scene.asides?.length || 0);
}, 0);

export interface Achievement {
	id: string;
	name: string;
	description: string;
	icon: string; // URL to icon image
	completed: boolean;
	unlockedAt?: string; // ISO timestamp
	progress?: number; // For achievements with progress tracking
	maxProgress?: number; // Total items needed
}

export interface AchievementData {
	completed: boolean;
	unlockedAt?: string;
	progress?: number;
}

export type AchievementStorage = Record<string, AchievementData>;

const STORAGE_KEY = "personal-story-achievements";

/**
 * All available achievements in the story
 */
export const ACHIEVEMENT_DEFINITIONS: Omit<
	Achievement,
	"completed" | "unlockedAt" | "progress"
>[] = [
	{
		id: "first-aside",
		name: "Curious Explorer",
		description: "Listen to one side quest",
		icon: getAsideImageUrl(1, "books"), // books.png from scene 1
	},
	{
		id: "all-coffee",
		name: "Caffeine Collector",
		description: "Find every traitorous coffee",
		icon: getAsideImageUrl(3, "coffee"), // coffee.png
		maxProgress: 5,
	},
	{
		id: "final-plea",
		name: "Solar Listener",
		description: "Listen to Dustin's final plea",
		icon: getAsideImageUrl(13, "sun"), // sun.png from scene 13
	},
	{
		id: "hints-enabled",
		name: "Illuminated",
		description: "Try enabling hints",
		icon: "/achievements/lightbulb.svg", // Custom SVG
	},
	{
		id: "secret-plant",
		name: "Green Thumb",
		description: "Find the secret plant",
		icon: getAsideImageUrl(10, "secret-plant"), // secret-plant.png from scene 10
	},
	{
		id: "complete-story",
		name: "Journey Complete",
		description: "Watch Dustin's entire career story",
		icon: "/achievements/film.svg", // Custom SVG
		maxProgress: 13,
	},
	{
		id: "view-resume",
		name: "Document Inspector",
		description: "Look at Dustin's resume",
		icon: "/achievements/document.svg", // Custom SVG
	},
	{
		id: "completionist",
		name: "Completionist",
		description: "Complete all achievements and discover every aside",
		icon: getAsideImageUrl(12, "glowup"), // glowup from scene 12
		maxProgress: TOTAL_ASIDES,
	},
];

/**
 * Load achievements from localStorage
 */
export function loadAchievements(): AchievementStorage {
	if (typeof window === "undefined") return {};

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return {};
		return JSON.parse(stored);
	} catch (error) {
		console.error("Failed to load achievements:", error);
		return {};
	}
}

/**
 * Save achievements to localStorage
 */
export function saveAchievements(achievements: AchievementStorage): void {
	if (typeof window === "undefined") return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
	} catch (error) {
		console.error("Failed to save achievements:", error);
	}
}

/**
 * Get all achievements with their current state
 */
export function getAllAchievements(): Achievement[] {
	const stored = loadAchievements();

	return ACHIEVEMENT_DEFINITIONS.map((def) => {
		const data = stored[def.id];
		return {
			...def,
			completed: data?.completed ?? false,
			unlockedAt: data?.unlockedAt,
			progress: data?.progress ?? 0,
		};
	});
}

/**
 * Check if an achievement is completed
 */
export function isAchievementCompleted(achievementId: string): boolean {
	const stored = loadAchievements();
	return stored[achievementId]?.completed ?? false;
}

/**
 * Unlock an achievement
 * Returns true if this is a new unlock, false if already unlocked
 */
export function unlockAchievement(achievementId: string): boolean {
	const stored = loadAchievements();

	// Check if already completed
	if (stored[achievementId]?.completed) {
		return false; // Already unlocked
	}

	// Mark as completed
	stored[achievementId] = {
		completed: true,
		unlockedAt: new Date().toISOString(),
		progress: stored[achievementId]?.progress,
	};

	saveAchievements(stored);
	return true; // Newly unlocked
}

/**
 * Update achievement progress
 * Returns the achievement if it was just completed, null otherwise
 */
export function updateAchievementProgress(
	achievementId: string,
	progress: number,
): Achievement | null {
	const stored = loadAchievements();
	const def = ACHIEVEMENT_DEFINITIONS.find((a) => a.id === achievementId);

	if (!def || stored[achievementId]?.completed) {
		return null;
	}

	stored[achievementId] = {
		...stored[achievementId],
		completed: false,
		progress,
	};

	// Check if achievement should be unlocked
	if (def.maxProgress && progress >= def.maxProgress) {
		stored[achievementId].completed = true;
		stored[achievementId].unlockedAt = new Date().toISOString();
		saveAchievements(stored);

		return {
			...def,
			completed: true,
			unlockedAt: stored[achievementId].unlockedAt,
			progress,
		};
	}

	saveAchievements(stored);
	return null;
}

/**
 * Get achievement progress
 */
export function getAchievementProgress(achievementId: string): number {
	const stored = loadAchievements();
	return stored[achievementId]?.progress ?? 0;
}

/**
 * Get completion stats
 */
export function getCompletionStats(): {
	completed: number;
	total: number;
	percentage: number;
} {
	const achievements = getAllAchievements();
	const completed = achievements.filter((a) => a.completed).length;
	const total = achievements.length;
	const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

	return { completed, total, percentage };
}
