"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
	getKeyframeUrl,
	getTransitionUrl,
	getAsideAudioUrl,
} from "@/lib/story-config";
import { TransitionPlayer } from "./TransitionPlayer";
import { NarrationPlayer } from "./NarrationPlayer";
import { AsideObject } from "./AsideObject";
import { useStory } from "@/contexts/StoryContext";
import { useAudio } from "@/contexts/AudioContext";
import { scenes } from "@/data/scenes";

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
	const [activeAsideId, setActiveAsideId] = useState<string | null>(null);
	const { audioRef } = useAudio();

	// Get current scene data
	const currentScene = scenes.find((s) => s.index === currentSceneIndex);

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

	// Handle aside click
	const handleAsideClick = useCallback(
		(asideId: string) => {
			console.log("StoryScene: Aside clicked", asideId);

			// If this aside is already playing, do nothing
			if (activeAsideId === asideId) return;

			// Stop current audio
			const audio = audioRef.current;
			if (audio) {
				audio.pause();
				audio.src = getAsideAudioUrl(currentSceneIndex, asideId);
				audio.load();
				audio.play().catch((error) => {
					console.error("Error playing aside audio:", error);
				});
			}

			setActiveAsideId(asideId);

			// Listen for when aside ends to return to main narration
			const handleAsideEnd = () => {
				console.log("StoryScene: Aside ended");
				setActiveAsideId(null);
				// Could resume main narration here if needed
				audio?.removeEventListener("ended", handleAsideEnd);
			};

			audio?.addEventListener("ended", handleAsideEnd);
		},
		[activeAsideId, audioRef, currentSceneIndex],
	);

	// Reset active aside when scene changes
	useEffect(() => {
		setActiveAsideId(null);
	}, [currentSceneIndex]);

	return (
		<>
			{/* Full-screen keyframe image */}
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

			{/* Aside objects overlay - scales with viewport */}
			{!isTransitioning && currentScene?.asides && (
				<div className="fixed inset-0 z-10">
					{currentScene.asides.map((aside, index) => (
						<AsideObject
							key={aside.id}
							aside={aside}
							sceneIndex={currentSceneIndex}
							onClick={() => handleAsideClick(aside.id)}
							isActive={activeAsideId === aside.id}
							asideIndex={index}
						/>
					))}
				</div>
			)}

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
