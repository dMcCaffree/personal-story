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

	// Update audio source when scene changes
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		// Always update the source for the current scene
		const narrationUrl = getNarrationUrl(sceneIndex);
		
		// Only reload if the scene actually changed
		if (currentSceneRef.current !== sceneIndex) {
			console.log("NarrationPlayer: Scene changed, loading new audio", sceneIndex);
			currentSceneRef.current = sceneIndex;
			audio.pause();
			audio.currentTime = 0;
			audio.src = narrationUrl;
			audio.load(); // This triggers loadedmetadata event
		} else if (audio.src !== narrationUrl || !audio.src) {
			// Initial load or src mismatch
			console.log("NarrationPlayer: Initial load for scene", sceneIndex);
			audio.src = narrationUrl;
			audio.load(); // This triggers loadedmetadata event
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
		
		// Ensure audio metadata is loaded before playing
		// readyState >= 1 means HAVE_METADATA (duration is available)
		if (audio.readyState < 1) {
			console.log("NarrationPlayer: Waiting for audio metadata to load");
			const handleMetadataLoaded = () => {
				console.log("NarrationPlayer: Metadata loaded, starting playback");
				audio.play().catch((error) => {
					console.error("NarrationPlayer: Error playing narration:", error);
				});
			};
			audio.addEventListener("loadedmetadata", handleMetadataLoaded, { once: true });
			audio.load();
			return () => audio.removeEventListener("loadedmetadata", handleMetadataLoaded);
		}
		
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
