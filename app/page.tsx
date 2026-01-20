"use client";

import { StoryProvider } from "@/contexts/StoryContext";
import { AudioProvider } from "@/contexts/AudioContext";
import { StoryScene } from "@/components/StoryScene";
import { Toolbar } from "@/components/Toolbar";
import { SceneNavigation } from "@/components/SceneNavigation";
import { OnboardingOverlay } from "@/components/OnboardingOverlay";

export default function Home() {
	return (
		<StoryProvider>
			<AudioProvider>
				<main className="fixed inset-0 overflow-hidden bg-black">
					<StoryScene />
					<SceneNavigation />
					<Toolbar />
					<OnboardingOverlay />
				</main>
			</AudioProvider>
		</StoryProvider>
	);
}
