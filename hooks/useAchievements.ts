"use client";

import { useState, useEffect, useCallback } from "react";
import {
	getAllAchievements,
	unlockAchievement as unlockAchievementUtil,
	updateAchievementProgress as updateProgressUtil,
	getCompletionStats,
	type Achievement,
} from "@/lib/achievements";

export function useAchievements() {
	const [achievements, setAchievements] = useState<Achievement[]>([]);
	const [stats, setStats] = useState({
		completed: 0,
		total: 0,
		percentage: 0,
	});

	// Load achievements from localStorage on mount
	useEffect(() => {
		const loadedAchievements = getAllAchievements();
		setAchievements(loadedAchievements);
		setStats(getCompletionStats());
	}, []);

	// Refresh achievements
	const refreshAchievements = useCallback(() => {
		setAchievements(getAllAchievements());
		setStats(getCompletionStats());
	}, []);

	// Unlock an achievement
	const unlockAchievement = useCallback(
		(achievementId: string): boolean => {
			const wasNewlyUnlocked = unlockAchievementUtil(achievementId);
			if (wasNewlyUnlocked) {
				refreshAchievements();
			}
			return wasNewlyUnlocked;
		},
		[refreshAchievements],
	);

	// Update achievement progress
	const updateAchievementProgress = useCallback(
		(achievementId: string, progress: number): Achievement | null => {
			const completedAchievement = updateProgressUtil(achievementId, progress);
			refreshAchievements();
			return completedAchievement;
		},
		[refreshAchievements],
	);

	// Check if user has a specific achievement
	const hasAchievement = useCallback(
		(achievementId: string): boolean => {
			return achievements.find((a) => a.id === achievementId)?.completed ?? false;
		},
		[achievements],
	);

	return {
		achievements,
		stats,
		unlockAchievement,
		updateAchievementProgress,
		hasAchievement,
		refreshAchievements,
	};
}

