"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { StoryState } from "@/lib/story-config";
import { getTotalScenes } from "@/data/scenes";

interface StoryContextValue extends StoryState {
	goToNextScene: () => void;
	goToPreviousScene: () => void;
	setIsTransitioning: (value: boolean) => void;
	totalScenes: number;
	canGoNext: boolean;
	canGoBack: boolean;
	showHints: boolean;
	toggleHints: () => void;
}

const StoryContext = createContext<StoryContextValue | undefined>(undefined);

export function StoryProvider({ children }: { children: React.ReactNode }) {
	const totalScenes = getTotalScenes();

	const [state, setState] = useState<StoryState>({
		currentSceneIndex: 1,
		previousSceneIndex: null,
		isTransitioning: false,
		playbackDirection: "forward",
	});

	const [showHints, setShowHints] = useState(false);

	const canGoNext = state.currentSceneIndex < totalScenes;
	const canGoBack = state.currentSceneIndex > 1;

	const goToNextScene = useCallback(() => {
		if (state.isTransitioning || !canGoNext) {
			console.log("StoryContext: Cannot go next", {
				isTransitioning: state.isTransitioning,
				canGoNext,
			});
			return;
		}

		console.log("StoryContext: Going to next scene", {
			from: state.currentSceneIndex,
			to: state.currentSceneIndex + 1,
		});

		setState((prev) => ({
			...prev,
			previousSceneIndex: prev.currentSceneIndex,
			currentSceneIndex: prev.currentSceneIndex + 1,
			isTransitioning: true,
			playbackDirection: "forward",
		}));
	}, [state.isTransitioning, state.currentSceneIndex, canGoNext]);

	const goToPreviousScene = useCallback(() => {
		if (state.isTransitioning || !canGoBack) {
			return;
		}

		setState((prev) => ({
			...prev,
			previousSceneIndex: prev.currentSceneIndex,
			currentSceneIndex: prev.currentSceneIndex - 1,
			isTransitioning: true,
			playbackDirection: "reverse",
		}));
	}, [state.isTransitioning, canGoBack]);

	const setIsTransitioning = useCallback((value: boolean) => {
		setState((prev) => ({
			...prev,
			isTransitioning: value,
		}));
	}, []);

	const toggleHints = useCallback(() => {
		setShowHints((prev) => !prev);
	}, []);

	const contextValue: StoryContextValue = {
		...state,
		goToNextScene,
		goToPreviousScene,
		setIsTransitioning,
		totalScenes,
		canGoNext,
		canGoBack,
		showHints,
		toggleHints,
	};

	return (
		<StoryContext.Provider value={contextValue}>
			{children}
		</StoryContext.Provider>
	);
}

export function useStory() {
	const context = useContext(StoryContext);
	if (context === undefined) {
		throw new Error("useStory must be used within a StoryProvider");
	}
	return context;
}
