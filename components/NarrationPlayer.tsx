"use client";

import { useEffect, useRef } from "react";
import { getNarrationUrl } from "@/lib/story-config";

interface NarrationPlayerProps {
	sceneIndex: number;
	shouldPlay: boolean;
	onEnded?: () => void;
}

export function NarrationPlayer({
	sceneIndex,
	shouldPlay,
	onEnded,
}: NarrationPlayerProps) {
	const audioRef = useRef<HTMLAudioElement>(null);
	const currentSceneRef = useRef(sceneIndex);

	// Reset when scene changes
	useEffect(() => {
		if (currentSceneRef.current !== sceneIndex) {
			currentSceneRef.current = sceneIndex;
			const audio = audioRef.current;
			if (audio) {
				audio.pause();
				audio.currentTime = 0;
			}
		}
	}, [sceneIndex]);

	// Handle playback
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !shouldPlay) {
			console.log("NarrationPlayer: Not playing", {
				audio: !!audio,
				shouldPlay,
			});
			return;
		}

		console.log("NarrationPlayer: Starting playback for scene", sceneIndex);
		// Play the narration
		audio
			.play()
			.then(() => {
				console.log("NarrationPlayer: Playback started successfully");
			})
			.catch((error) => {
				console.error("NarrationPlayer: Error playing narration:", error);
			});
	}, [sceneIndex, shouldPlay]);

	const handleEnded = () => {
		onEnded?.();
	};

	return (
		<audio
			ref={audioRef}
			src={getNarrationUrl(sceneIndex)}
			onEnded={handleEnded}
			preload="auto"
		/>
	);
}
