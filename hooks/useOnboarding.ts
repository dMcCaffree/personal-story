import { useState, useEffect } from "react";

const ONBOARDING_KEY = "personal-story-onboarding-complete";

export function useOnboarding() {
	const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

	useEffect(() => {
		// Check localStorage on mount
		const seen = localStorage.getItem(ONBOARDING_KEY);
		setHasSeenOnboarding(seen === "true");
	}, []);

	const markAsComplete = () => {
		localStorage.setItem(ONBOARDING_KEY, "true");
		setHasSeenOnboarding(true);
	};

	const resetOnboarding = () => {
		localStorage.removeItem(ONBOARDING_KEY);
		setHasSeenOnboarding(false);
	};

	return {
		hasSeenOnboarding,
		markAsComplete,
		resetOnboarding,
	};
}

