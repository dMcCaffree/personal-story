"use client";

import React, {
	createContext,
	useContext,
	useState,
	useRef,
	useCallback,
	useEffect,
} from "react";

interface AudioContextValue {
	audioRef: React.RefObject<HTMLAudioElement | null>;
	isPlaying: boolean;
	currentTime: number;
	duration: number;
	volume: number;
	isMuted: boolean;
	setVolume: (volume: number) => void;
	setMuted: (muted: boolean) => void;
	togglePlayPause: () => void;
	seek: (time: number) => void;
}

const AudioContext = createContext<AudioContextValue | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolumeState] = useState(100);
	const [isMuted, setIsMuted] = useState(false);

	// Update current time and listen for audio events
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const updateTime = () => {
			setCurrentTime(audio.currentTime);
		};

		const updateDuration = () => {
			const newDuration = audio.duration || 0;
			// Check if duration is valid (not NaN or Infinity)
			if (Number.isFinite(newDuration) && newDuration > 0) {
				setDuration(newDuration);
			}
		};

		const handlePlay = () => setIsPlaying(true);
		const handlePause = () => setIsPlaying(false);
		const handleEnded = () => setIsPlaying(false);

		// Also check duration on mount in case metadata is already loaded
		if (audio.readyState >= 1) {
			updateDuration();
		}

		audio.addEventListener("timeupdate", updateTime);
		audio.addEventListener("durationchange", updateDuration);
		audio.addEventListener("loadedmetadata", updateDuration);
		audio.addEventListener("loadeddata", updateDuration); // Additional event for duration
		audio.addEventListener("canplay", updateDuration); // Additional event for duration
		audio.addEventListener("play", handlePlay);
		audio.addEventListener("pause", handlePause);
		audio.addEventListener("ended", handleEnded);

		return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("durationchange", updateDuration);
			audio.removeEventListener("loadedmetadata", updateDuration);
			audio.removeEventListener("loadeddata", updateDuration);
			audio.removeEventListener("canplay", updateDuration);
			audio.removeEventListener("play", handlePlay);
			audio.removeEventListener("pause", handlePause);
			audio.removeEventListener("ended", handleEnded);
		};
	}, []);

	const setVolume = useCallback((newVolume: number) => {
		setVolumeState(newVolume);
		if (audioRef.current) {
			audioRef.current.volume = newVolume / 100;
		}
	}, []);

	const setMuted = useCallback((muted: boolean) => {
		setIsMuted(muted);
		if (audioRef.current) {
			audioRef.current.muted = muted;
		}
	}, []);

	const togglePlayPause = useCallback(() => {
		const audio = audioRef.current;
		if (!audio) return;

		if (isPlaying) {
			audio.pause();
		} else {
			audio.play().catch((error) => {
				console.error("Error playing audio:", error);
			});
		}
	}, [isPlaying]);

	const seek = useCallback((time: number) => {
		if (audioRef.current) {
			audioRef.current.currentTime = time;
			setCurrentTime(time);
		}
	}, []);

	const contextValue: AudioContextValue = {
		audioRef,
		isPlaying,
		currentTime,
		duration,
		volume,
		isMuted,
		setVolume,
		setMuted,
		togglePlayPause,
		seek,
	};

	return (
		<AudioContext.Provider value={contextValue}>
			{children}
		</AudioContext.Provider>
	);
}

export function useAudio() {
	const context = useContext(AudioContext);
	if (context === undefined) {
		throw new Error("useAudio must be used within an AudioProvider");
	}
	return context;
}
