"use client";

import { useEffect } from "react";
import { getNarrationUrl } from "@/lib/story-config";
import { useAudio } from "@/contexts/AudioContext";

interface NarrationPlayerProps {
	sceneIndex: number;
	onEnded?: () => void;
}

export function NarrationPlayer({ sceneIndex, onEnded }: NarrationPlayerProps) {
	const { audioRef } = useAudio();

	// Listen for audio ended event
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleEnded = () => {
			onEnded?.();
		};

		audio.addEventListener("ended", handleEnded);
		return () => audio.removeEventListener("ended", handleEnded);
	}, [audioRef, onEnded]);

	// Render the audio element with initial src for preloading
	return (
		<audio ref={audioRef} src={getNarrationUrl(sceneIndex)} preload="auto">
			<track kind="captions" />
		</audio>
	);
}
