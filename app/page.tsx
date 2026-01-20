"use client";

import { StoryProvider } from "@/contexts/StoryContext";
import { AudioProvider } from "@/contexts/AudioContext";
import { StoryScene } from "@/components/StoryScene";
import { Toolbar } from "@/components/Toolbar";
import { SceneNavigation } from "@/components/SceneNavigation";
import { OnboardingOverlay } from "@/components/OnboardingOverlay";
import { InitialPlayButton } from "@/components/InitialPlayButton";
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
		</main>
	);
}

export default function Home() {
	return (
		<StoryProvider>
			<AudioProvider>
				<StoryExperience />
			</AudioProvider>
		</StoryProvider>
	);
}
