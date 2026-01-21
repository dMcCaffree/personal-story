"use client";

import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	useEffect,
} from "react";
import { useAchievements } from "@/hooks/useAchievements";
import type { Achievement } from "@/lib/achievements";

interface NotificationItem extends Achievement {
	notificationId: string;
}

interface AchievementContextValue {
	achievements: Achievement[];
	stats: {
		completed: number;
		total: number;
		percentage: number;
	};
	unlockAchievement: (achievementId: string) => void;
	hasAchievement: (achievementId: string) => boolean;
	updateProgress: (achievementId: string, progress: number) => void;
	// Scene and coffee tracking
	coffeeFound: Set<string>;
	markCoffeeFound: (sceneIndex: number) => void;
	scenesVisited: Set<number>;
	markSceneVisited: (sceneIndex: number) => void;
	// Notifications
	activeNotifications: NotificationItem[];
	dismissNotification: (notificationId: string) => void;
}

const AchievementContext = createContext<AchievementContextValue | undefined>(
	undefined,
);

export function AchievementProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const {
		achievements,
		stats,
		unlockAchievement: unlockAchievementHook,
		hasAchievement: hasAchievementHook,
		updateAchievementProgress,
	} = useAchievements();

	// Track coffee and scenes
	const [coffeeFound, setCoffeeFound] = useState<Set<string>>(new Set());
	const [scenesVisited, setScenesVisited] = useState<Set<number>>(new Set());

	// Notification queue
	const [activeNotifications, setActiveNotifications] = useState<
		NotificationItem[]
	>([]);

	// Show notification for newly unlocked achievement
	const showNotification = useCallback((achievement: Achievement) => {
		const notificationId = `${achievement.id}-${Date.now()}`;
		const notification: NotificationItem = {
			...achievement,
			notificationId,
		};

		setActiveNotifications((prev) => [...prev, notification]);

		// Auto-dismiss after 4 seconds
		setTimeout(() => {
			setActiveNotifications((prev) =>
				prev.filter((n) => n.notificationId !== notificationId),
			);
		}, 4000);
	}, []);

	// Unlock achievement with notification
	const unlockAchievement = useCallback(
		(achievementId: string) => {
			const wasNewlyUnlocked = unlockAchievementHook(achievementId);
			if (wasNewlyUnlocked) {
				// Find the achievement to show in notification
				const achievement = achievements.find((a) => a.id === achievementId);
				if (achievement) {
					showNotification({ ...achievement, completed: true });
				}
			}
		},
		[unlockAchievementHook, achievements, showNotification],
	);

	// Update progress with automatic unlock check
	const updateProgress = useCallback(
		(achievementId: string, progress: number) => {
			const completedAchievement = updateAchievementProgress(
				achievementId,
				progress,
			);
			if (completedAchievement) {
				showNotification(completedAchievement);
			}
		},
		[updateAchievementProgress, showNotification],
	);

	// Coffee tracking
	const markCoffeeFound = useCallback(
		(sceneIndex: number) => {
			const coffeeKey = `scene-${sceneIndex}-coffee`;
			if (!coffeeFound.has(coffeeKey)) {
				const newCoffeeFound = new Set(coffeeFound);
				newCoffeeFound.add(coffeeKey);
				setCoffeeFound(newCoffeeFound);

				// Update progress
				updateProgress("all-coffee", newCoffeeFound.size);
			}
		},
		[coffeeFound, updateProgress],
	);

	// Scene tracking
	const markSceneVisited = useCallback(
		(sceneIndex: number) => {
			if (!scenesVisited.has(sceneIndex)) {
				const newScenesVisited = new Set(scenesVisited);
				newScenesVisited.add(sceneIndex);
				setScenesVisited(newScenesVisited);

				// Update progress
				updateProgress("complete-story", newScenesVisited.size);
			}
		},
		[scenesVisited, updateProgress],
	);

	// Dismiss notification manually
	const dismissNotification = useCallback((notificationId: string) => {
		setActiveNotifications((prev) =>
			prev.filter((n) => n.notificationId !== notificationId),
		);
	}, []);

	const hasAchievement = useCallback(
		(achievementId: string) => hasAchievementHook(achievementId),
		[hasAchievementHook],
	);

	const contextValue: AchievementContextValue = {
		achievements,
		stats,
		unlockAchievement,
		hasAchievement,
		updateProgress,
		coffeeFound,
		markCoffeeFound,
		scenesVisited,
		markSceneVisited,
		activeNotifications,
		dismissNotification,
	};

	return (
		<AchievementContext.Provider value={contextValue}>
			{children}
		</AchievementContext.Provider>
	);
}

export function useAchievementContext() {
	const context = useContext(AchievementContext);
	if (context === undefined) {
		throw new Error(
			"useAchievementContext must be used within an AchievementProvider",
		);
	}
	return context;
}

