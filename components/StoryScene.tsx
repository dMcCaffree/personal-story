"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
	getKeyframeUrl,
	getTransitionUrl,
	getAsideAudioUrl,
} from "@/lib/story-config";
import { TransitionPlayer } from "./TransitionPlayer";
import { CrossFadeTransition } from "./CrossFadeTransition";
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
		setActiveAsideName,
		hasStarted,
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
		} else if (
			playbackDirection === "reverse" ||
			playbackDirection === "jump"
		) {
			// Reverse/Jump: show destination scene (cross-fade overlay will show source)
			return currentSceneIndex;
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

	// Start narration when user clicks play on scene 1
	useEffect(() => {
		if (hasStarted && currentSceneIndex === 1) {
			console.log("StoryScene: Starting initial narration for scene 1");
			setNarrationTrigger({
				sceneIndex: 1,
				shouldPlay: true,
			});
		}
	}, [hasStarted, currentSceneIndex]);

	// Start narration when jumping to a scene (no transition)
	useEffect(() => {
		if (
			!isTransitioning &&
			previousSceneIndex !== null &&
			previousSceneIndex !== currentSceneIndex
		) {
			console.log(
				"StoryScene: Scene jumped, starting narration for scene",
				currentSceneIndex,
			);
			setNarrationTrigger({
				sceneIndex: currentSceneIndex,
				shouldPlay: true,
			});
			// Update delayed scene index immediately when jumping
			setDelayedSceneIndex(currentSceneIndex);
		}
	}, [currentSceneIndex, previousSceneIndex, isTransitioning]);

	const handleTransitionStart = useCallback(() => {
		console.log("StoryScene: Transition started", {
			direction: playbackDirection,
			currentScene: currentSceneIndex,
		});

		// Start narration when transition begins (for forward and jump directions)
		if (playbackDirection === "forward" || playbackDirection === "jump") {
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

			// Find the aside to get its name
			const aside = currentScene?.asides?.find((a) => a.id === asideId);
			const asideName = aside?.name || asideId;

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
			setActiveAsideName(asideName);

			// Listen for when aside ends to return to main narration
			const handleAsideEnd = () => {
				console.log("StoryScene: Aside ended");
				setActiveAsideId(null);
				setActiveAsideName(null);

				// Reset audio to beginning of main narration
				if (audio) {
					audio.currentTime = 0;
				}

				audio?.removeEventListener("ended", handleAsideEnd);
			};

			audio?.addEventListener("ended", handleAsideEnd);
		},
		[
			activeAsideId,
			audioRef,
			currentSceneIndex,
			currentScene,
			setActiveAsideName,
		],
	);

	// Reset active aside when scene changes

	useEffect(() => {
		setActiveAsideId(null);
		setActiveAsideName(null);
	}, [currentSceneIndex, setActiveAsideName]);

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
			{!isTransitioning && hasStarted && currentScene?.asides && (
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

			{/* Transition overlay - video for forward, cross-fade for reverse/jump */}
			{(() => {
				if (!isTransitioning || previousSceneIndex === null) {
					console.log("StoryScene: Not rendering transition", {
						isTransitioning,
						previousSceneIndex,
					});
					return null;
				}

				// Use sleek cross-fade for going back or jumping (more reliable than reverse video)
				if (playbackDirection === "reverse" || playbackDirection === "jump") {
					return (
						<CrossFadeTransition
							fromSceneIndex={previousSceneIndex}
							toSceneIndex={currentSceneIndex}
							isPlaying={isTransitioning}
							onTransitionStart={handleTransitionStart}
							onTransitionEnd={handleTransitionEnd}
						/>
					);
				}

				// Use video transition for going forward
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
