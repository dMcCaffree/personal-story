"use client";

import { useEffect, useRef } from "react";
import { getNarrationUrl } from "@/lib/story-config";
import { useAudio } from "@/contexts/AudioContext";

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
	const { audioRef } = useAudio();
	const currentSceneRef = useRef(sceneIndex);

	// Reset when scene changes
	useEffect(() => {
		if (currentSceneRef.current !== sceneIndex) {
			currentSceneRef.current = sceneIndex;
			const audio = audioRef.current;
			if (audio) {
				audio.pause();
				audio.currentTime = 0;
				audio.src = getNarrationUrl(sceneIndex);
				audio.load();
			}
		}
	}, [sceneIndex, audioRef]);

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
	}, [sceneIndex, shouldPlay, audioRef]);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleEnded = () => {
			onEnded?.();
		};

		audio.addEventListener("ended", handleEnded);
		return () => audio.removeEventListener("ended", handleEnded);
	}, [audioRef, onEnded]);

	return (
		<audio ref={audioRef} src={getNarrationUrl(sceneIndex)} preload="auto">
			<track kind="captions" />
		</audio>
	);
}
