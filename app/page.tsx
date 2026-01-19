"use client";

import { StoryProvider } from "@/contexts/StoryContext";
import { StoryScene } from "@/components/StoryScene";
import { NavigationControls } from "@/components/NavigationControls";
import { UtilityButtons } from "@/components/UtilityButtons";

export default function Home() {
  return (
    <StoryProvider>
      <main className="fixed inset-0 overflow-hidden bg-black">
        <StoryScene />
        <NavigationControls />
        <UtilityButtons />
      </main>
    </StoryProvider>
  );
}
