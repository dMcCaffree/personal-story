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
import { TOTAL_ASIDES } from "@/lib/achievements";

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
	// Aside tracking for completionist
	asidesClicked: Set<string>;
	markAsideClicked: (sceneIndex: number, asideId: string) => void;
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
	const [asidesClicked, setAsidesClicked] = useState<Set<string>>(new Set());

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

	// Aside tracking for completionist
	const markAsideClicked = useCallback(
		(sceneIndex: number, asideId: string) => {
			const asideKey = `scene-${sceneIndex}-${asideId}`;
			if (!asidesClicked.has(asideKey)) {
				const newAsidesClicked = new Set(asidesClicked);
				newAsidesClicked.add(asideKey);
				setAsidesClicked(newAsidesClicked);

				// Update progress
				updateProgress("completionist", newAsidesClicked.size);
			}
		},
		[asidesClicked, updateProgress],
	);

	// Check for completionist achievement when all other achievements are done
	useEffect(() => {
		// Get all non-completionist achievements
		const otherAchievements = achievements.filter(
			(a) => a.id !== "completionist",
		);
		const allOthersComplete = otherAchievements.every((a) => a.completed);

		// If all other achievements are complete AND all asides are clicked
		if (
			allOthersComplete &&
			asidesClicked.size === TOTAL_ASIDES &&
			!hasAchievementHook("completionist")
		) {
			console.log("Unlocking completionist achievement!");
			unlockAchievement("completionist");
		}
	}, [
		achievements,
		asidesClicked,
		hasAchievementHook,
		unlockAchievement,
	]);

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
		asidesClicked,
		markAsideClicked,
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

