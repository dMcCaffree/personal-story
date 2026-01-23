"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useStory } from "@/contexts/StoryContext";
import { useAudio } from "@/contexts/AudioContext";
import { getKeyframeUrl, getNarrationUrl } from "@/lib/story-config";
import { scenes } from "@/data/scenes";
import Image from "next/image";

export function SceneNavigation() {
	const {
		goToNextScene,
		goToPreviousScene,
		canGoNext,
		canGoBack,
		currentSceneIndex,
		isTransitioning,
		hasStarted,
		isOnboardingActive,
		onboardingStep,
	} = useStory();
	const { loadAndPlay, preloadAudio } = useAudio();
	const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null);
	const [isMobile, setIsMobile] = useState(false);

	// Detect mobile device
	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Force show previews during onboarding step 2
	const showLeftPreview = hoveredSide === "left" || onboardingStep === 2;
	const showRightPreview = hoveredSide === "right" || onboardingStep === 2;

	const getSceneName = (index: number) => {
		const scene = scenes.find((s) => s.index === index);
		return scene?.title || `Scene ${index}`;
	};

	const nextSceneIndex = currentSceneIndex + 1;
	const prevSceneIndex = currentSceneIndex - 1;

	// Preload next scene narration when available
	useEffect(() => {
		if (canGoNext) {
			preloadAudio(getNarrationUrl(nextSceneIndex));
		}
	}, [canGoNext, nextSceneIndex, preloadAudio]);

	// Handle navigation - load and play audio synchronously for iOS
	const handleNext = () => {
		// CRITICAL: Call loadAndPlay synchronously in click handler for iOS
		loadAndPlay(getNarrationUrl(nextSceneIndex));
		goToNextScene();
	};

	const handlePrevious = () => {
		// CRITICAL: Call loadAndPlay synchronously in click handler for iOS
		loadAndPlay(getNarrationUrl(prevSceneIndex));
		goToPreviousScene();
	};

	// Don't show navigation until user has started the experience or onboarding is active
	if (!hasStarted && !isOnboardingActive) return null;

	return (
		<>
			{/* Left Navigation - Go Back */}
			{canGoBack && (
				<>
					{/* Desktop: Full-width hover area */}
					{!isMobile && (
						<button
							type="button"
							onClick={handlePrevious}
							disabled={isTransitioning}
							onMouseEnter={() => !isTransitioning && setHoveredSide("left")}
							onMouseLeave={() => setHoveredSide(null)}
							className={`fixed left-0 top-0 bottom-0 w-24 md:w-64 z-40 cursor-pointer disabled:cursor-not-allowed bg-linear-to-r to-transparent transition-all duration-300 ${showLeftPreview ? "from-black/40" : "from-black/10"}`}
						>
							{/* Preview card that slides out */}
							<AnimatePresence>
								{showLeftPreview && !isTransitioning && (
									<motion.div
										initial={{ x: -300 }}
										animate={{ x: 0 }}
										exit={{ x: -300 }}
										transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
										className="absolute left-4 bottom-8 pointer-events-none"
									>
										{/* Card with image and text overlay */}
										<motion.div
											initial={{ opacity: 0, scale: 0.95 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: 0.1 }}
											className="relative rounded-2xl border border-white/20 overflow-hidden shadow-2xl"
										>
											{/* Preview image */}
											<div className="relative h-40 w-56">
												<Image
													src={getKeyframeUrl(prevSceneIndex)}
													alt={getSceneName(prevSceneIndex)}
													fill
													className="object-cover"
													unoptimized
												/>
												{/* Text overlay */}
												<div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-t from-black/60 via-transparent to-transparent">
													<div
														className="text-2xl text-white font-bold leading-tight text-center"
														style={{
															textShadow:
																"0 2px 8px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.6)",
														}}
													>
														Chapter {prevSceneIndex}
													</div>
													<div
														className="text-sm text-white/90 font-medium leading-tight text-center mt-1"
														style={{
															textShadow:
																"0 2px 8px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.6)",
														}}
													>
														{getSceneName(prevSceneIndex)}
													</div>
												</div>
											</div>
										</motion.div>
									</motion.div>
								)}
							</AnimatePresence>
						</button>
					)}

					{/* Mobile: Small visible button */}
					{isMobile && (
						<motion.button
							type="button"
							onClick={handlePrevious}
							disabled={isTransitioning}
							className="fixed left-3 top-1/2 -translate-y-1/2 z-40 h-8 w-8 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
							whileTap={{ scale: 0.9 }}
							style={{
								boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.4)",
							}}
							aria-label="Previous scene"
						>
							<svg
								className="h-5 w-5 text-white"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
						</motion.button>
					)}
				</>
			)}

			{/* Right Navigation - Continue */}
			{canGoNext && (
				<>
					{/* Desktop: Full-width hover area */}
					{!isMobile && (
						<button
							type="button"
							onClick={handleNext}
							disabled={isTransitioning}
							onMouseEnter={() => !isTransitioning && setHoveredSide("right")}
							onMouseLeave={() => setHoveredSide(null)}
							className={`fixed right-0 top-0 bottom-0 w-24 md:w-64 z-40 cursor-pointer disabled:cursor-not-allowed bg-linear-to-l from-black/10 to-transparent transition-all duration-300 ${showRightPreview ? "from-black/40" : "from-black/10"}`}
						>
							{/* Preview card that slides out */}
							<AnimatePresence>
								{showRightPreview && !isTransitioning && (
									<motion.div
										initial={{ x: 300 }}
										animate={{ x: 0 }}
										exit={{ x: 300 }}
										transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
										className="absolute right-4 bottom-8 pointer-events-none"
									>
										{/* Card with image and text overlay */}
										<motion.div
											initial={{ opacity: 0, scale: 0.95 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: 0.1 }}
											className="relative rounded-2xl border border-white/20 overflow-hidden shadow-2xl"
										>
											{/* Preview image */}
											<div className="relative h-40 w-56">
												<Image
													src={getKeyframeUrl(nextSceneIndex)}
													alt={getSceneName(nextSceneIndex)}
													fill
													className="object-cover"
													unoptimized
												/>
												{/* Text overlay */}
												<div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-t from-black/60 via-transparent to-transparent">
													<div
														className="text-2xl text-white font-bold leading-tight text-center"
														style={{
															textShadow:
																"0 2px 8px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.6)",
														}}
													>
														Chapter {nextSceneIndex}
													</div>
													<div
														className="text-sm text-white/90 font-medium leading-tight text-center mt-1"
														style={{
															textShadow:
																"0 2px 8px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.6)",
														}}
													>
														{getSceneName(nextSceneIndex)}
													</div>
												</div>
											</div>
										</motion.div>
									</motion.div>
								)}
							</AnimatePresence>
						</button>
					)}

					{/* Mobile: Small visible button */}
					{isMobile && (
						<motion.button
							type="button"
							onClick={handleNext}
							disabled={isTransitioning}
							className="fixed right-3 top-1/2 -translate-y-1/2 z-40 h-8 w-8 rounded-lg bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
							whileTap={{ scale: 0.9 }}
							style={{
								boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.4)",
							}}
							aria-label="Next scene"
						>
							<svg
								className="h-5 w-5 text-white"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</motion.button>
					)}
				</>
			)}
		</>
	);
}
