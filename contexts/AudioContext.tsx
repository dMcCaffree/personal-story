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
	loadAndPlay: (src: string) => void;
	preloadAudio: (src: string) => void;
}

const AudioContext = createContext<AudioContextValue | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [volume, setVolumeState] = useState(100);
	const [isMuted, setIsMuted] = useState(false);
	const pendingPlayRef = useRef(false);

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

	// Load and play audio synchronously - MUST be called from user interaction
	const loadAndPlay = useCallback((src: string) => {
		const audio = audioRef.current;
		if (!audio) return;

		// Pause current audio
		audio.pause();
		audio.currentTime = 0;

		// If the src is already loaded, just play it
		if (audio.src.endsWith(src)) {
			audio.play().catch((error) => {
				console.error("Error playing audio:", error);
			});
			return;
		}

		// Set new source and mark that we want to play
		pendingPlayRef.current = true;
		audio.src = src;
		audio.load();

		// Try to play immediately (works if already loaded)
		audio.play().catch(() => {
			// If it fails, it will play when loadeddata fires
		});
	}, []);

	// Preload audio without playing
	const preloadAudio = useCallback((src: string) => {
		const audio = audioRef.current;
		if (!audio) return;

		// Only preload if not already the current src
		if (!audio.src.endsWith(src)) {
			// Create a temporary audio element to preload
			const tempAudio = new Audio();
			tempAudio.src = src;
			tempAudio.preload = "auto";
			tempAudio.load();
		}
	}, []);

	// Auto-play when audio is loaded if pendingPlay is set
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleLoadedData = () => {
			if (pendingPlayRef.current) {
				pendingPlayRef.current = false;
				audio.play().catch((error) => {
					console.error("Error auto-playing loaded audio:", error);
				});
			}
		};

		audio.addEventListener("loadeddata", handleLoadedData);
		return () => audio.removeEventListener("loadeddata", handleLoadedData);
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
		loadAndPlay,
		preloadAudio,
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
