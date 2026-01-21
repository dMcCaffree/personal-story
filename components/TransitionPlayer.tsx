"use client";

import { useEffect, useRef, useState } from "react";
import { getTransitionUrl } from "@/lib/story-config";
import { PlaybackDirection } from "@/lib/story-config";

interface TransitionPlayerProps {
	fromSceneIndex: number;
	toSceneIndex: number;
	direction: PlaybackDirection;
	isPlaying: boolean;
	onTransitionStart?: () => void;
	onTransitionEnd?: () => void;
}

export function TransitionPlayer({
	fromSceneIndex,
	toSceneIndex,
	direction,
	isPlaying,
	onTransitionStart,
	onTransitionEnd,
}: TransitionPlayerProps) {
	const videoRef = useRef<HTMLVideoElement>(null);
	const [isVisible, setIsVisible] = useState(false);
	const [opacity, setOpacity] = useState(0);
	const animationFrameRef = useRef<number | null>(null);
	const hasNotifiedNearEndRef = useRef(false);

	useEffect(() => {
		const video = videoRef.current;
		if (!video || !isPlaying) {
			return;
		}

		let isCancelled = false;
		hasNotifiedNearEndRef.current = false;
		setIsVisible(false);
		setOpacity(0);

		const playTransition = async () => {
			if (isCancelled) return;
			try {
				// Wait for video metadata to be loaded
				await new Promise<void>((resolve) => {
					if (video.readyState >= 1) {
						resolve();
					} else {
						video.addEventListener(
							"loadedmetadata",
							() => {
								resolve();
							},
							{
								once: true,
							},
						);
					}
				});

				if (direction === "forward") {
					// Forward: play normally
					video.currentTime = 0;
					video.playbackRate = 1;

					// Set visible immediately, then fade in
					if (isCancelled) return;
					setIsVisible(true);

					// Start playing
					await video.play();

					if (isCancelled) return;
					onTransitionStart?.();

					// Fade in over 200ms
					requestAnimationFrame(() => {
						if (!isCancelled) {
							setOpacity(1);
						}
					});
				} else {
					// Reverse: manually step through frames backwards

					if (isCancelled) return;

					// Start from the end
					video.currentTime = video.duration;
					setIsVisible(true);
					onTransitionStart?.();

					// Fade in over 200ms
					requestAnimationFrame(() => {
						if (!isCancelled) {
							setOpacity(1);
						}
					});

					const fps = 30; // Approximate framerate for reverse playback
					const frameTime = 1 / fps;
					let lastTime = video.duration;

					let hasFadedOut = false;

					const stepBackward = () => {
						if (!video || lastTime <= 0) {
							// Fade out before ending
							if (!hasFadedOut) {
								hasFadedOut = true;
								setOpacity(0);
								setTimeout(() => {
									setIsVisible(false);
									onTransitionEnd?.();
								}, 200);
							}
							return;
						}

						// Start fade out in last 200ms
						if (lastTime <= 0.2 && !hasFadedOut) {
							hasFadedOut = true;
							setOpacity(0);
						}

						lastTime = Math.max(0, lastTime - frameTime);
						video.currentTime = lastTime;

						if (lastTime > 0) {
							animationFrameRef.current = requestAnimationFrame(stepBackward);
						} else {
							// Already fading, wait for fade to complete
							if (!hasFadedOut) {
								hasFadedOut = true;
								setOpacity(0);
							}
							setTimeout(() => {
								setIsVisible(false);
								onTransitionEnd?.();
							}, 200);
						}
					};

					animationFrameRef.current = requestAnimationFrame(stepBackward);
				}
			} catch (error) {
				onTransitionEnd?.();
				setIsVisible(false);
			}
		};

		playTransition();

		return () => {
			isCancelled = true;
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [direction, isPlaying, onTransitionStart, onTransitionEnd]);

	// Monitor video progress to fade out near end
	useEffect(() => {
		const video = videoRef.current;
		if (!video || !isPlaying || direction !== "forward") return;

		const handleTimeUpdate = () => {
			// Start fading out when close to the end (last 200ms)
			if (
				!hasNotifiedNearEndRef.current &&
				video.duration - video.currentTime < 0.2
			) {
				hasNotifiedNearEndRef.current = true;
				// Start fade out
				setOpacity(0);
				// Complete transition after fade
				setTimeout(() => {
					onTransitionEnd?.();
					setIsVisible(false);
				}, 200);
			}
		};

		video.addEventListener("timeupdate", handleTimeUpdate);
		return () => {
			video.removeEventListener("timeupdate", handleTimeUpdate);
		};
	}, [isPlaying, direction, onTransitionEnd]);

	const handleEnded = () => {
		// Backup handler if timeupdate doesn't fire
		if (direction === "forward" && !hasNotifiedNearEndRef.current) {
			setIsVisible(false);
			onTransitionEnd?.();
		}
	};

	// Use the transition URL based on the actual scene indices
	const actualFrom = direction === "forward" ? fromSceneIndex : toSceneIndex;
	const actualTo = direction === "forward" ? toSceneIndex : fromSceneIndex;
	const transitionUrl = getTransitionUrl(actualFrom, actualTo);

	// Don't render at all if not playing
	if (!isPlaying) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 z-30"
			style={{
				opacity: opacity,
				pointerEvents: "none",
				transition: "opacity 200ms ease-in-out",
				display: isVisible ? "block" : "none",
			}}
		>
			<video
				ref={videoRef}
				src={transitionUrl}
				className="h-full w-full object-cover"
				playsInline
				preload="auto"
				onEnded={handleEnded}
				style={{
					pointerEvents: "none",
					userSelect: "none",
				}}
				onContextMenu={(e) => e.preventDefault()}
			/>
		</div>
	);
}
