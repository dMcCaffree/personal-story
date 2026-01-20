"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { OnboardingCallout } from "./OnboardingCallout";
import { OnboardingSpotlight } from "./OnboardingSpotlight";
import { useOnboarding } from "@/hooks/useOnboarding";
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
	const { hasSeenOnboarding, markAsComplete } = useOnboarding();
	const { currentSceneIndex, toggleHints, showOnboarding, closeOnboarding } =
		useStory();
	const [currentStep, setCurrentStep] = useState(1);
	const [isVisible, setIsVisible] = useState(false);

	// Determine if onboarding should be visible
	useEffect(() => {
		if (hasSeenOnboarding === null) return; // Still loading

		if (showOnboarding || hasSeenOnboarding === false) {
			setIsVisible(true);
			setCurrentStep(1);
		}
	}, [hasSeenOnboarding, showOnboarding]);

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
		setIsVisible(false);
		markAsComplete();
		closeOnboarding();

		// Turn off hints if they were enabled
		const currentScene = scenes.find((s) => s.index === currentSceneIndex);
		if (currentStep === 3 && currentScene?.hasAsides) {
			// Hints were toggled on for step 3, toggle them off
			toggleHints();
		}
	};

	// Enable hints mode for step 3 if asides exist
	useEffect(() => {
		if (!isVisible) return;

		const currentScene = scenes.find((s) => s.index === currentSceneIndex);
		if (currentStep === 3 && currentScene?.hasAsides) {
			// Temporarily enable hints to show the asides
			toggleHints();
		}
	}, [currentStep, isVisible, currentSceneIndex, toggleHints]);

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
							top: rect.top - 20,
							left: rect.left - 20,
							width: rect.width + 40,
							height: rect.height + 40,
							borderRadius: 24,
						},
					];
				}
				// Fallback if toolbar not found
				return [
					{
						top: window.innerHeight - 200,
						left: window.innerWidth / 2 - 200,
						width: 400,
						height: 150,
						borderRadius: 24,
					},
				];
			}

			case "navigation": {
				// Highlight left and right edges
				const edgeWidth = Math.min(window.innerWidth * 0.2, 300);
				return [
					// Left edge
					{
						top: window.innerHeight - 320,
						left: 20,
						width: edgeWidth,
						height: 300,
						borderRadius: 16,
					},
					// Right edge
					{
						top: window.innerHeight - 320,
						left: window.innerWidth - edgeWidth - 20,
						width: edgeWidth,
						height: 300,
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
						top: window.innerHeight / 2 - 100,
						left: window.innerWidth / 2 - 200,
						width: 400,
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
