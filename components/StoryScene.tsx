"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getKeyframeUrl } from "@/lib/story-config";
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
	} = useStory();

	const [displayedSceneIndex, setDisplayedSceneIndex] =
		useState(currentSceneIndex);
	const [shouldPlayNarration, setShouldPlayNarration] = useState(false);

	// Update displayed scene when not transitioning
	useEffect(() => {
		if (!isTransitioning) {
			setDisplayedSceneIndex(currentSceneIndex);
		}
	}, [currentSceneIndex, isTransitioning]);

	const handleTransitionStart = () => {
		// Start narration when transition begins (only for forward direction)
		if (playbackDirection === "forward") {
			setShouldPlayNarration(true);
		}
	};

	const handleTransitionEnd = () => {
		setIsTransitioning(false);
		setDisplayedSceneIndex(currentSceneIndex);
		// Stop trying to play narration after transition ends
		setShouldPlayNarration(false);
	};

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
			{isTransitioning && previousSceneIndex !== null && (
				<TransitionPlayer
					fromSceneIndex={previousSceneIndex}
					toSceneIndex={currentSceneIndex}
					direction={playbackDirection}
					isPlaying={isTransitioning}
					onTransitionStart={handleTransitionStart}
					onTransitionEnd={handleTransitionEnd}
				/>
			)}

			{/* Narration audio */}
			<NarrationPlayer
				sceneIndex={currentSceneIndex}
				shouldPlay={shouldPlayNarration}
			/>
		</>
	);
}
