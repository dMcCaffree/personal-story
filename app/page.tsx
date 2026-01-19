"use client";

import { StoryProvider } from "@/contexts/StoryContext";
import { StoryScene } from "@/components/StoryScene";
import { Toolbar } from "@/components/Toolbar";

export default function Home() {
	return (
		<StoryProvider>
			<main className="fixed inset-0 overflow-hidden bg-black">
				<StoryScene />
				<Toolbar />
			</main>
		</StoryProvider>
	);
}
