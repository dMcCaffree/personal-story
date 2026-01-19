"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { getKeyframeUrl, getTransitionUrl } from "@/lib/story-config";
import { TransitionPlayer } from "./TransitionPlayer";
import { NarrationPlayer } from "./NarrationPlayer";
import { useStory } from "@/contexts/StoryContext";

export function StoryScene() {
	const {
		currentSceneIndex,
		previousSceneIndex,
		isTransitioning,
		playbackDirection,
		setIsTransitioning,
		canGoNext,
		totalScenes,
	} = useStory();

	const [narrationTrigger, setNarrationTrigger] = useState<{
		sceneIndex: number;
		shouldPlay: boolean;
	}>({ sceneIndex: currentSceneIndex, shouldPlay: false });

	const [delayedSceneIndex, setDelayedSceneIndex] = useState(currentSceneIndex);

	// Delay keyframe change for forward transitions
	useEffect(() => {
		if (isTransitioning && playbackDirection === "forward") {
			// Wait 4 seconds before updating the keyframe behind the video
			const timer = setTimeout(() => {
				setDelayedSceneIndex(currentSceneIndex);
			}, 4000);
			return () => clearTimeout(timer);
		}
	}, [currentSceneIndex, isTransitioning, playbackDirection]);

	// Compute displayed scene based on transition state
	const displayedSceneIndex = (() => {
		if (!isTransitioning) {
			// Not transitioning: show current scene
			return currentSceneIndex;
		} else if (playbackDirection === "reverse") {
			// Reverse: show previous scene
			return previousSceneIndex ?? currentSceneIndex;
		} else {
			// Forward: show delayed scene (stays on old scene for 4s)
			return delayedSceneIndex;
		}
	})();

	// Preload next transition video
	useEffect(() => {
		if (canGoNext && currentSceneIndex < totalScenes) {
			const nextTransitionUrl = getTransitionUrl(
				currentSceneIndex,
				currentSceneIndex + 1,
			);

			// Preload the video
			const video = document.createElement("video");
			video.preload = "auto";
			video.src = nextTransitionUrl;
		}
	}, [currentSceneIndex, canGoNext, totalScenes]);

	const handleTransitionStart = useCallback(() => {
		console.log("StoryScene: Transition started", {
			direction: playbackDirection,
			currentScene: currentSceneIndex,
		});

		// Start narration when transition begins (only for forward direction)
		if (playbackDirection === "forward") {
			console.log(
				"StoryScene: Triggering narration for scene",
				currentSceneIndex,
			);
			setNarrationTrigger({
				sceneIndex: currentSceneIndex,
				shouldPlay: true,
			});
		}
	}, [playbackDirection, currentSceneIndex]);

	const handleTransitionEnd = useCallback(() => {
		console.log("StoryScene: Transition ended");
		// Transition is complete
		setIsTransitioning(false);
		// Don't stop narration here - let it play to completion
	}, [setIsTransitioning]);

	return (
		<>
			{/* Main keyframe image */}
			<div className="fixed inset-0 z-0">
				<Image
					src={getKeyframeUrl(displayedSceneIndex)}
					alt={`Scene ${displayedSceneIndex}`}
					fill
					priority
					className="object-cover"
					style={{
						pointerEvents: "none",
						userSelect: "none",
					}}
					onContextMenu={(e) => e.preventDefault()}
					draggable={false}
					unoptimized
				/>
			</div>

			{/* Transition video overlay */}
			{(() => {
				if (!isTransitioning || previousSceneIndex === null) {
					console.log("StoryScene: Not rendering transition", {
						isTransitioning,
						previousSceneIndex,
					});
					return null;
				}
				return (
					<TransitionPlayer
						fromSceneIndex={previousSceneIndex}
						toSceneIndex={currentSceneIndex}
						direction={playbackDirection}
						isPlaying={isTransitioning}
						onTransitionStart={handleTransitionStart}
						onTransitionEnd={handleTransitionEnd}
					/>
				);
			})()}

			{/* Narration audio */}
			<NarrationPlayer
				sceneIndex={narrationTrigger.sceneIndex}
				shouldPlay={
					narrationTrigger.shouldPlay &&
					narrationTrigger.sceneIndex === currentSceneIndex
				}
			/>
		</>
	);
}
