"use client";

import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	useEffect,
} from "react";
import { StoryState } from "@/lib/story-config";
import { getTotalScenes } from "@/data/scenes";

const ONBOARDING_KEY = "personal-story-onboarding-complete";

interface StoryContextValue extends StoryState {
	goToNextScene: () => void;
	goToPreviousScene: () => void;
	jumpToScene: (sceneIndex: number) => void;
	setIsTransitioning: (value: boolean) => void;
	totalScenes: number;
	canGoNext: boolean;
	canGoBack: boolean;
	showHints: boolean;
	toggleHints: () => void;
	activeAsideName: string | null;
	setActiveAsideName: (name: string | null) => void;
	showOnboarding: boolean;
	triggerOnboarding: () => void;
	closeOnboarding: () => void;
	hasStarted: boolean;
	startExperience: () => void;
	hasSeenOnboarding: boolean | null;
	markOnboardingComplete: () => void;
	isOnboardingActive: boolean;
	setIsOnboardingActive: (active: boolean) => void;
	onboardingStep: number;
	setOnboardingStep: (step: number) => void;
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
	const [activeAsideName, setActiveAsideName] = useState<string | null>(null);
	const [showOnboarding, setShowOnboarding] = useState(false);
	const [hasStarted, setHasStarted] = useState(false);
	const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
		null,
	);
	const [isOnboardingActive, setIsOnboardingActive] = useState(false);
	const [onboardingStep, setOnboardingStep] = useState(0);

	// Check localStorage on mount for onboarding status
	useEffect(() => {
		const seen = localStorage.getItem(ONBOARDING_KEY);
		setHasSeenOnboarding(seen === "true");
	}, []);

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

	const jumpToScene = useCallback(
		(sceneIndex: number) => {
			if (state.isTransitioning || sceneIndex < 1 || sceneIndex > totalScenes) {
				return;
			}

			console.log("StoryContext: Jumping to scene", {
				from: state.currentSceneIndex,
				to: sceneIndex,
			});

			setState((prev) => ({
				...prev,
				previousSceneIndex: prev.currentSceneIndex,
				currentSceneIndex: sceneIndex,
				isTransitioning: true, // Use transition with cross-fade
				playbackDirection: "jump",
			}));
		},
		[state.isTransitioning, state.currentSceneIndex, totalScenes],
	);

	const setIsTransitioning = useCallback((value: boolean) => {
		setState((prev) => ({
			...prev,
			isTransitioning: value,
		}));
	}, []);

	const toggleHints = useCallback(() => {
		setShowHints((prev) => !prev);
	}, []);

	const triggerOnboarding = useCallback(() => {
		setShowOnboarding(true);
	}, []);

	const closeOnboarding = useCallback(() => {
		setShowOnboarding(false);
	}, []);

	const startExperience = useCallback(() => {
		setHasStarted(true);
	}, []);

	const markOnboardingComplete = useCallback(() => {
		localStorage.setItem(ONBOARDING_KEY, "true");
		setHasSeenOnboarding(true);
	}, []);

	const contextValue: StoryContextValue = {
		...state,
		goToNextScene,
		goToPreviousScene,
		jumpToScene,
		setIsTransitioning,
		totalScenes,
		canGoNext,
		canGoBack,
		showHints,
		toggleHints,
		activeAsideName,
		setActiveAsideName,
		showOnboarding,
		triggerOnboarding,
		closeOnboarding,
		hasStarted,
		startExperience,
		hasSeenOnboarding,
		markOnboardingComplete,
		isOnboardingActive,
		setIsOnboardingActive,
		onboardingStep,
		setOnboardingStep,
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
