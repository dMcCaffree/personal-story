"use client";

import { StoryProvider } from "@/contexts/StoryContext";
import { StoryScene } from "@/components/StoryScene";
import { Toolbar } from "@/components/Toolbar";
import { SceneNavigation } from "@/components/SceneNavigation";

export default function Home() {
	return (
		<StoryProvider>
			<main className="fixed inset-0 overflow-hidden bg-black">
				<StoryScene />
				<SceneNavigation />
				<Toolbar />
			</main>
		</StoryProvider>
	);
}
