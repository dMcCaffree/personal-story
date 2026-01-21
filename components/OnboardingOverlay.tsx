"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { AnimatePresence } from "motion/react";
import { OnboardingCallout } from "./OnboardingCallout";
import { OnboardingSpotlight } from "./OnboardingSpotlight";
import { useStory } from "@/contexts/StoryContext";
import { scenes } from "@/data/scenes";

interface OnboardingStep {
	id: number;
	title: string;
	description: string;
	target: "toolbar" | "navigation" | "asides";
}

const STEPS: OnboardingStep[] = [
	{
		id: 1,
		title: "Your Story Player",
		description:
			"Control your narration, view captions, and access helpful tools here.",
		target: "toolbar",
	},
	{
		id: 2,
		title: "Navigate Your Journey",
		description:
			"Hover the left or right edges to preview and move between chapters.",
		target: "navigation",
	},
	{
		id: 3,
		title: "Discover Hidden Stories",
		description:
			"Click glowing objects to hear micro-stories and dive deeper into the scene.",
		target: "asides",
	},
];

export function OnboardingOverlay() {
	const {
		currentSceneIndex,
		toggleHints,
		showHints,
		showOnboarding,
		closeOnboarding,
		hasStarted,
		hasSeenOnboarding,
		markOnboardingComplete,
		setIsOnboardingActive,
		setOnboardingStep,
	} = useStory();
	const [currentStep, setCurrentStep] = useState(1);
	const hintsEnabledForOnboardingRef = useRef(false);

	// Derive visibility from props
	const isVisible =
		hasSeenOnboarding !== null &&
		!hasStarted &&
		(showOnboarding || hasSeenOnboarding === false);

	const prevVisibleRef = useRef(false);

	// Reset step when onboarding becomes visible (use LayoutEffect for immediate synchronous update)
	useLayoutEffect(() => {
		if (isVisible && !prevVisibleRef.current) {
			setCurrentStep(1);
		}
		prevVisibleRef.current = isVisible;
	}, [isVisible]);

	// Sync onboarding active state and step with context
	useEffect(() => {
		setIsOnboardingActive(isVisible);
		if (isVisible) {
			setOnboardingStep(currentStep);
		} else {
			setOnboardingStep(0);
		}
	}, [isVisible, currentStep, setIsOnboardingActive, setOnboardingStep]);

	const handleNext = () => {
		if (currentStep < STEPS.length) {
			setCurrentStep(currentStep + 1);
		} else {
			handleComplete();
		}
	};

	const handleSkip = () => {
		handleComplete();
	};

	const handleComplete = () => {
		// Turn off hints if they were enabled by onboarding
		if (hintsEnabledForOnboardingRef.current && showHints) {
			toggleHints();
			hintsEnabledForOnboardingRef.current = false;
		}

		// Mark as complete (this will cause isVisible to become false)
		markOnboardingComplete();
		closeOnboarding();
	};

	// Enable hints mode for step 3 if asides exist
	useEffect(() => {
		if (!isVisible) {
			// Clean up hints when onboarding closes
			if (hintsEnabledForOnboardingRef.current && showHints) {
				toggleHints();
				hintsEnabledForOnboardingRef.current = false;
			}
			return;
		}

		const currentScene = scenes.find((s) => s.index === currentSceneIndex);
		const shouldShowHints = currentStep === 3 && currentScene?.hasAsides;

		if (shouldShowHints && !showHints) {
			// Enable hints for step 3
			toggleHints();
			hintsEnabledForOnboardingRef.current = true;
		} else if (
			!shouldShowHints &&
			showHints &&
			hintsEnabledForOnboardingRef.current
		) {
			// Disable hints when leaving step 3
			toggleHints();
			hintsEnabledForOnboardingRef.current = false;
		}
	}, [currentStep, isVisible, currentSceneIndex, showHints, toggleHints]);

	// Calculate highlight rectangles based on current step
	const getHighlightRects = () => {
		const currentStepData = STEPS[currentStep - 1];
		if (!currentStepData) return [];

		switch (currentStepData.target) {
			case "toolbar": {
				// Highlight the toolbar at bottom center
				const toolbar = document.querySelector("[data-toolbar]");
				if (toolbar) {
					const rect = toolbar.getBoundingClientRect();
					return [
						{
							top: rect.top - 10,
							left: rect.left - 10,
							width: rect.width + 20,
							height: rect.height + 20,
							borderRadius: 24,
						},
					];
				}
				// Fallback if toolbar not found
				return [
					{
						top: window.innerHeight - 180,
						left: window.innerWidth / 2 - 170,
						width: 340,
						height: 155,
						borderRadius: 24,
					},
				];
			}

			case "navigation": {
				// Highlight right edge navigation preview
				return [
					{
						top: window.innerHeight - 215,
						left: window.innerWidth - 255,
						width: 250,
						height: 200,
						borderRadius: 16,
					},
				];
			}

			case "asides": {
				// Highlight aside objects if they exist
				const asideElements = document.querySelectorAll("[data-aside-object]");
				if (asideElements.length > 0) {
					return Array.from(asideElements).map((el) => {
						const rect = el.getBoundingClientRect();
						return {
							top: rect.top - 10,
							left: rect.left - 10,
							width: rect.width + 20,
							height: rect.height + 20,
							borderRadius: 12,
						};
					});
				}
				// Fallback: show centered message area
				return [
					{
						top: window.innerHeight / 2 - 250,
						left: window.innerWidth / 2 - 280,
						width: 300,
						height: 200,
						borderRadius: 16,
					},
				];
			}

			default:
				return [];
		}
	};

	// Get callout position based on current step
	const getCalloutPosition = () => {
		const currentStepData = STEPS[currentStep - 1];
		if (!currentStepData)
			return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };

		switch (currentStepData.target) {
			case "toolbar":
				return {
					bottom: "12rem",
					left: "50%",
					transform: "translateX(-50%)",
				};

			case "navigation":
			case "asides":
				return {
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
				};

			default:
				return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
		}
	};

	if (!isVisible || hasSeenOnboarding === null) return null;

	const currentStepData = STEPS[currentStep - 1];
	if (!currentStepData) return null;

	return (
		<AnimatePresence>
			<div className="fixed inset-0 z-60">
				{/* Spotlight effect */}
				<OnboardingSpotlight highlightRects={getHighlightRects()} />

				{/* Callout box */}
				<OnboardingCallout
					title={currentStepData.title}
					description={currentStepData.description}
					position={getCalloutPosition()}
					step={currentStep}
					totalSteps={STEPS.length}
					onNext={handleNext}
					onSkip={handleSkip}
				/>
			</div>
		</AnimatePresence>
	);
}
