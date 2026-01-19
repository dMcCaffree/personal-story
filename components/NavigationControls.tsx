"use client";

import { useStory } from "@/contexts/StoryContext";

export function NavigationControls() {
  const { goToNextScene, goToPreviousScene, canGoNext, canGoBack, isTransitioning } = useStory();

  return (
    <>
      {/* Continue button - bottom right */}
      {canGoNext && (
        <button
          onClick={goToNextScene}
          disabled={isTransitioning}
          className="fixed bottom-8 right-8 z-40 flex items-center gap-3 rounded-full bg-red-600 px-6 py-4 text-white shadow-lg transition-all hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Continue to next scene"
        >
          <span className="text-lg font-medium">Continue</span>
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      )}

      {/* Go Back button - bottom left */}
      {canGoBack && (
        <button
          onClick={goToPreviousScene}
          disabled={isTransitioning}
          className="fixed bottom-8 left-8 z-40 flex items-center gap-3 rounded-full border-2 border-white/30 bg-black/40 px-6 py-4 text-white backdrop-blur-sm transition-all hover:bg-black/60 hover:border-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Go back to previous scene"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          <span className="text-lg font-medium">Go Back</span>
        </button>
      )}
    </>
  );
}

