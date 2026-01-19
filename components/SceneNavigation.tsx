"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useStory } from "@/contexts/StoryContext";
import { getKeyframeUrl } from "@/lib/story-config";
import { scenes } from "@/data/scenes";
import Image from "next/image";

export function SceneNavigation() {
	const { goToNextScene, goToPreviousScene, canGoNext, canGoBack, currentSceneIndex, isTransitioning } = useStory();
	const [hoveredSide, setHoveredSide] = useState<"left" | "right" | null>(null);

	const getSceneName = (index: number) => {
		const scene = scenes.find((s) => s.index === index);
		return scene?.title || `Scene ${index}`;
	};

	const nextSceneIndex = currentSceneIndex + 1;
	const prevSceneIndex = currentSceneIndex - 1;

	return (
		<>
			{/* Left Navigation - Go Back */}
			{canGoBack && (
				<>
					{/* Hover trigger area */}
					<div
						className="fixed left-0 top-0 bottom-0 w-32 z-40"
						onMouseEnter={() => !isTransitioning && setHoveredSide("left")}
						onMouseLeave={() => setHoveredSide(null)}
					/>

					{/* Preview card */}
					<AnimatePresence>
						{hoveredSide === "left" && (
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
								className="fixed left-8 top-1/2 -translate-y-1/2 z-40 flex items-center gap-4"
							>
								{/* Preview thumbnail */}
								<motion.div
									initial={{ scale: 0.9, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ delay: 0.05 }}
									className="relative h-24 w-24 overflow-hidden rounded-xl border-2 border-white/30 shadow-2xl"
								>
									<Image
										src={getKeyframeUrl(prevSceneIndex)}
										alt={getSceneName(prevSceneIndex)}
										fill
										className="object-cover"
										unoptimized
									/>
								</motion.div>

								{/* Scene info */}
								<motion.div
									initial={{ x: -10, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									transition={{ delay: 0.1 }}
									className="flex flex-col gap-1"
								>
									<div className="text-xs text-white/60 font-medium">Previous</div>
									<div className="text-sm text-white font-semibold">
										{getSceneName(prevSceneIndex)}
									</div>
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Chevron button */}
					<motion.button
						type="button"
						onClick={goToPreviousScene}
						disabled={isTransitioning}
						onMouseEnter={() => !isTransitioning && setHoveredSide("left")}
						className="fixed left-4 top-1/2 -translate-y-1/2 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-xl transition-all hover:bg-black/60 hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
					>
						<svg
							className="h-6 w-6 text-white"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2.5}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</motion.button>
				</>
			)}

			{/* Right Navigation - Continue */}
			{canGoNext && (
				<>
					{/* Hover trigger area */}
					<div
						className="fixed right-0 top-0 bottom-0 w-32 z-40"
						onMouseEnter={() => !isTransitioning && setHoveredSide("right")}
						onMouseLeave={() => setHoveredSide(null)}
					/>

					{/* Preview card */}
					<AnimatePresence>
						{hoveredSide === "right" && (
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 20 }}
								transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
								className="fixed right-8 top-1/2 -translate-y-1/2 z-40 flex items-center gap-4"
							>
								{/* Scene info */}
								<motion.div
									initial={{ x: 10, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									transition={{ delay: 0.1 }}
									className="flex flex-col gap-1 text-right"
								>
									<div className="text-xs text-white/60 font-medium">Next</div>
									<div className="text-sm text-white font-semibold">
										{getSceneName(nextSceneIndex)}
									</div>
								</motion.div>

								{/* Preview thumbnail */}
								<motion.div
									initial={{ scale: 0.9, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ delay: 0.05 }}
									className="relative h-24 w-24 overflow-hidden rounded-xl border-2 border-white/30 shadow-2xl"
								>
									<Image
										src={getKeyframeUrl(nextSceneIndex)}
										alt={getSceneName(nextSceneIndex)}
										fill
										className="object-cover"
										unoptimized
									/>
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Chevron button */}
					<motion.button
						type="button"
						onClick={goToNextScene}
						disabled={isTransitioning}
						onMouseEnter={() => !isTransitioning && setHoveredSide("right")}
						className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-xl transition-all hover:bg-black/60 hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
					>
						<svg
							className="h-6 w-6 text-white"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2.5}
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</motion.button>
				</>
			)}
		</>
	);
}

