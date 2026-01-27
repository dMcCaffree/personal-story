"use client";

import { StoryProvider } from "@/contexts/StoryContext";
import { AudioProvider } from "@/contexts/AudioContext";
import { AchievementProvider } from "@/contexts/AchievementContext";
import { StoryScene } from "@/components/StoryScene";
import { Toolbar } from "@/components/Toolbar";
import { SceneNavigation } from "@/components/SceneNavigation";
import { OnboardingOverlay } from "@/components/OnboardingOverlay";
import { InitialPlayButton } from "@/components/InitialPlayButton";
import { AchievementNotification } from "@/components/AchievementNotification";
import { useStory } from "@/contexts/StoryContext";
import { AnimatePresence } from "motion/react";

function StoryExperience() {
	const { currentSceneIndex, hasStarted, startExperience, hasSeenOnboarding } =
		useStory();

	// Show play button only on scene 1, after onboarding, before they've started
	const showPlayButton =
		currentSceneIndex === 1 &&
		!hasStarted &&
		hasSeenOnboarding !== null &&
		hasSeenOnboarding === true;

	return (
		<main className="fixed inset-0 overflow-hidden bg-black">
			<StoryScene />
			<SceneNavigation />
			<Toolbar />
			<OnboardingOverlay />

			{/* Initial play button */}
			<AnimatePresence>
				{showPlayButton && <InitialPlayButton onPlay={startExperience} />}
			</AnimatePresence>

			{/* Achievement notifications */}
			<AchievementNotification />
		</main>
	);
}

export default function StoryPage() {
	return (
		<StoryProvider>
			<AudioProvider>
				<AchievementProvider>
					<StoryExperience />
				</AchievementProvider>
			</AudioProvider>
		</StoryProvider>
	);
}

