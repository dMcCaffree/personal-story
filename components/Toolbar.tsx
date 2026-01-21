"use client";

import { useState, useRef, useLayoutEffect, useEffect, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useStory } from "@/contexts/StoryContext";
import { useAudio } from "@/contexts/AudioContext";
import { scenes } from "@/data/scenes";
import { getKeyframeUrl } from "@/lib/story-config";
import { SceneSelector } from "@/components/SceneSelector";
import { Tooltip } from "@/components/Tooltip";
import Image from "next/image";

const LINKEDIN_URL = "https://linkedin.com/in/dMcCaffree";
const RESUME_URL = "#"; // Placeholder for now
const MAX_TITLE_LENGTH_BEFORE_ANIMATING = 50;

interface ToolbarButtonProps {
	icon: React.ReactNode;
	label: string;
	onClick?: () => void;
	href?: string;
	disabled?: boolean;
	isActive?: boolean;
}

function ToolbarButton({
	icon,
	label,
	onClick,
	href,
	disabled = false,
	isActive = false,
}: ToolbarButtonProps) {
	const buttonContent = (
		<motion.button
			type="button"
			className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-all ${
				disabled
					? "cursor-not-allowed opacity-40"
					: "hover:bg-white/20 active:scale-95"
			} ${isActive ? "bg-white/20" : ""}`}
			disabled={disabled}
			onClick={onClick}
			whileHover={{ scale: disabled ? 1 : 1.1 }}
			whileTap={{ scale: disabled ? 1 : 0.9 }}
			transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
		>
			{icon}
		</motion.button>
	);

	const wrappedButton = (
		<Tooltip label={label} delay={300}>
			{buttonContent}
		</Tooltip>
	);

	if (href) {
		return (
			<a href={href} target="_blank" rel="noopener noreferrer">
				{wrappedButton}
			</a>
		);
	}

	return wrappedButton;
}

// Polaroid Stack Button - Memoized to prevent re-renders
const PolaroidStackButton = memo(
	({
		currentSceneIndex,
		polaroidHovered,
		setPolaroidHovered,
		onClick,
	}: {
		currentSceneIndex: number;
		polaroidHovered: boolean;
		setPolaroidHovered: (hovered: boolean) => void;
		onClick: () => void;
	}) => {
		const prevIndex = Math.max(1, currentSceneIndex - 1);
		const nextIndex = Math.min(scenes.length, currentSceneIndex + 1);

		return (
			<Tooltip label="Scene Selector" delay={300}>
				<motion.button
					type="button"
					className="relative flex h-9 w-16 items-center justify-center"
					onClick={onClick}
					onMouseEnter={() => setPolaroidHovered(true)}
					onMouseLeave={() => setPolaroidHovered(false)}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					transition={{
						type: "spring",
						stiffness: 500,
						damping: 30,
						mass: 0.5,
					}}
				>
					{/* Stack of polaroids */}
					<div className="relative h-7 w-10">
						{/* Previous scene - bottom left */}
						<motion.div
							className="absolute left-0 top-0 h-6 w-8 rounded-sm border border-white/40 bg-white shadow-lg overflow-hidden"
							animate={{
								rotate: polaroidHovered ? -12 : -5,
								x: polaroidHovered ? -2 : 0,
								y: polaroidHovered ? 1 : 0,
							}}
							transition={{ type: "spring", stiffness: 400, damping: 25 }}
							style={{ zIndex: 1 }}
						>
							<div className="relative h-full w-full p-0.5">
								<Image
									src={getKeyframeUrl(prevIndex)}
									alt=""
									fill
									className="object-cover"
									unoptimized
								/>
							</div>
						</motion.div>

						{/* Next scene - bottom right */}
						<motion.div
							className="absolute right-0 top-0 h-6 w-8 rounded-sm border border-white/40 bg-white shadow-lg overflow-hidden"
							animate={{
								rotate: polaroidHovered ? 12 : 5,
								x: polaroidHovered ? 2 : 0,
								y: polaroidHovered ? 1 : 0,
							}}
							transition={{ type: "spring", stiffness: 400, damping: 25 }}
							style={{ zIndex: 2 }}
						>
							<div className="relative h-full w-full p-0.5">
								<Image
									src={getKeyframeUrl(nextIndex)}
									alt=""
									fill
									className="object-cover"
									unoptimized
								/>
							</div>
						</motion.div>

						{/* Current scene - on top center */}
						<motion.div
							className="absolute left-1/2 top-0 -translate-x-1/2 h-6 w-8 rounded-sm border-2 border-white bg-white shadow-xl overflow-hidden"
							animate={{
								y: polaroidHovered ? -3 : 0,
							}}
							transition={{ type: "spring", stiffness: 400, damping: 25 }}
							style={{ zIndex: 3 }}
						>
							<div className="relative h-full w-full p-0.5">
								<Image
									src={getKeyframeUrl(currentSceneIndex)}
									alt=""
									fill
									className="object-cover"
									unoptimized
								/>
							</div>
						</motion.div>
					</div>
				</motion.button>
			</Tooltip>
		);
	},
);

PolaroidStackButton.displayName = "PolaroidStackButton";

export function Toolbar() {
	const {
		currentSceneIndex,
		showHints,
		toggleHints,
		activeAsideName,
		triggerOnboarding,
		hasStarted,
		isOnboardingActive,
		onboardingStep,
	} = useStory();
	const {
		isPlaying,
		currentTime,
		duration,
		volume,
		isMuted,
		setVolume,
		setMuted,
		togglePlayPause,
		seek,
	} = useAudio();

	const [isHovered, setIsHovered] = useState(false);
	// Force toolbar to be expanded during onboarding step 1
	const isToolbarExpanded = isHovered || onboardingStep === 1;
	const [showVolumeSlider, setShowVolumeSlider] = useState(false);
	const [captionsEnabled, setCaptionsEnabled] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [titleScrollDistance, setTitleScrollDistance] = useState(0);
	const [sceneSelectorOpen, setSceneSelectorOpen] = useState(false);
	const [polaroidHovered, setPolaroidHovered] = useState(false);
	const [isDraggingProgress, setIsDraggingProgress] = useState(false);
	const [isInteractingWithControls, setIsInteractingWithControls] =
		useState(false);
	const titleRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const progressBarRef = useRef<HTMLDivElement>(null);
	const volumeSliderTimerRef = useRef<NodeJS.Timeout | null>(null);

	// Get current scene name or aside name
	const currentScene = scenes.find((s) => s.index === currentSceneIndex);
	const sceneTitle = currentScene?.title || `Scene ${currentSceneIndex}`;
	const displayTitle = activeAsideName || sceneTitle;

	// Calculate scroll distance for long titles
	useLayoutEffect(() => {
		const calculateScroll = () => {
			if (titleRef.current && containerRef.current) {
				const titleWidth = titleRef.current.scrollWidth;
				const containerWidth = containerRef.current.clientWidth;
				const scrollNeeded = titleWidth - containerWidth + 24; // 24px for padding/margins
				setTitleScrollDistance(scrollNeeded > 0 ? scrollNeeded : 0);
			}
		};

		// Small delay to ensure DOM has updated
		const timer = setTimeout(calculateScroll, 0);

		// Recalculate on window resize
		window.addEventListener("resize", calculateScroll);
		return () => {
			clearTimeout(timer);
			window.removeEventListener("resize", calculateScroll);
		};
	}, []);

	const handleMuteToggle = () => {
		setMuted(!isMuted);
	};

	const handleVolumeChange = (newVolume: number) => {
		setVolume(newVolume);
		if (newVolume === 0) {
			setMuted(true);
		} else if (isMuted) {
			setMuted(false);
		}
	};

	const handlePlayPause = () => {
		togglePlayPause();
	};

	const handleCaptionsToggle = () => {
		setCaptionsEnabled(!captionsEnabled);
		// TODO: Implement captions toggle
	};

	const handleHintToggle = () => {
		toggleHints();
	};

	const handleHelpClick = () => {
		triggerOnboarding();
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, "0")}`;
	};

	// Handle progress bar scrubbing
	const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!progressBarRef.current || duration === 0) return;

		const rect = progressBarRef.current.getBoundingClientRect();
		const clickX = e.clientX - rect.left;
		const percentage = Math.max(0, Math.min(1, clickX / rect.width));
		const newTime = percentage * duration;
		seek(newTime);
	};

	const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation(); // Prevent toolbar from being dragged
		setIsDraggingProgress(true);
		setIsInteractingWithControls(true);
		handleProgressClick(e);
	};

	const handleProgressClickWrapper = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation(); // Prevent toolbar from being dragged
		handleProgressClick(e);
	};

	useEffect(() => {
		if (!isDraggingProgress) return;

		const handleMouseMove = (e: MouseEvent) => {
			if (!progressBarRef.current || duration === 0) return;

			const rect = progressBarRef.current.getBoundingClientRect();
			const clickX = e.clientX - rect.left;
			const percentage = Math.max(0, Math.min(1, clickX / rect.width));
			const newTime = percentage * duration;
			seek(newTime);
		};

		const handleMouseUp = () => {
			setIsDraggingProgress(false);
			setIsInteractingWithControls(false);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDraggingProgress, duration, seek]);

	// Global cleanup for control interactions
	useEffect(() => {
		const handleGlobalMouseUp = () => {
			if (isInteractingWithControls && !isDraggingProgress) {
				setIsInteractingWithControls(false);
			}
		};

		document.addEventListener("mouseup", handleGlobalMouseUp);
		return () => {
			document.removeEventListener("mouseup", handleGlobalMouseUp);
		};
	}, [isInteractingWithControls, isDraggingProgress]);

	// Better volume slider dismissal - close if mouse moves away from both button and slider
	useEffect(() => {
		if (!showVolumeSlider) return;

		let hideTimer: NodeJS.Timeout;

		const handleMouseMove = (e: MouseEvent) => {
			// Clear any existing timer
			if (hideTimer) clearTimeout(hideTimer);

			// Get the volume button and slider elements
			const volumeButton = document
				.querySelector('[aria-label="Volume"]')
				?.closest("button");
			const volumeSlider = document
				.querySelector(".vertical-slider")
				?.closest('[class*="absolute bottom-full"]');

			if (!volumeButton) return;

			// Check if mouse is over button or slider
			const buttonRect = volumeButton.getBoundingClientRect();
			const isOverButton =
				e.clientX >= buttonRect.left &&
				e.clientX <= buttonRect.right &&
				e.clientY >= buttonRect.top &&
				e.clientY <= buttonRect.bottom;

			let isOverSlider = false;
			if (volumeSlider) {
				const sliderRect = volumeSlider.getBoundingClientRect();
				isOverSlider =
					e.clientX >= sliderRect.left &&
					e.clientX <= sliderRect.right &&
					e.clientY >= sliderRect.top &&
					e.clientY <= sliderRect.bottom;
			}

			// If not over either, set a timer to hide
			if (!isOverButton && !isOverSlider) {
				hideTimer = setTimeout(() => {
					setShowVolumeSlider(false);
				}, 100);
			}
		};

		document.addEventListener("mousemove", handleMouseMove);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			if (hideTimer) clearTimeout(hideTimer);
		};
	}, [showVolumeSlider]);

	// Cleanup volume slider timer on unmount
	useEffect(() => {
		return () => {
			if (volumeSliderTimerRef.current) {
				clearTimeout(volumeSliderTimerRef.current);
			}
		};
	}, []);

	// Utility buttons that pop out on hover
	const utilityButtons = [
		{
			icon: (
				<svg
					className="h-4 w-4 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-label="Help"
				>
					<title>Help</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			),
			label: "Tutorial",
			onClick: handleHelpClick,
		},
		{
			icon: (
				<svg
					className="h-4 w-4 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-label="Captions"
				>
					<title>Captions</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
					/>
				</svg>
			),
			label: captionsEnabled ? "Hide Captions" : "Show Captions",
			onClick: handleCaptionsToggle,
			isActive: captionsEnabled,
		},
		{
			icon: (
				<svg
					className="h-4 w-4 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-label="Hints"
				>
					<title>Hints</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
					/>
				</svg>
			),
			label: showHints ? "Hide Hints" : "Show Hints",
			onClick: handleHintToggle,
			isActive: showHints,
		},
		{
			icon: (
				<svg
					className="h-4 w-4 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					aria-label="Resume"
				>
					<title>Resume</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
					/>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M13 3v6a1 1 0 001 1h6"
					/>
				</svg>
			),
			label: "View Resume",
			href: RESUME_URL,
		},
		{
			icon: (
				<svg
					className="h-4 w-4 text-white"
					fill="currentColor"
					viewBox="0 0 24 24"
					aria-label="LinkedIn"
				>
					<title>LinkedIn</title>
					<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
				</svg>
			),
			label: "LinkedIn",
			href: LINKEDIN_URL,
		},
	];

	// Don't show toolbar until user has started the experience or onboarding is active
	if (!hasStarted && !isOnboardingActive) return null;

	return (
		<>
			<motion.div
				drag={!isInteractingWithControls}
				dragMomentum={false}
				dragElastic={0.1}
				onDragStart={() => setIsDragging(true)}
				onDragEnd={() => setIsDragging(false)}
				className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 cursor-grab active:cursor-grabbing"
				whileDrag={{ scale: 1.05, cursor: "grabbing" }}
			>
				<motion.div
					data-toolbar
					className="relative flex flex-col rounded-2xl border border-white/20 px-3 py-2"
					onMouseEnter={() => !isDragging && setIsHovered(true)}
					onMouseLeave={() => {
						if (!isDragging) {
							setIsHovered(false);
						}
					}}
					style={{
						background: "rgba(0, 0, 0, 0.4)",
						backdropFilter: "blur(40px)",
						WebkitBackdropFilter: "blur(40px)",
						boxShadow:
							"0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
					}}
				>
					{/* Top section - Scene info and narration controls */}
					<motion.div
						className="flex flex-col gap-1"
						animate={{
							paddingBottom: isToolbarExpanded ? "0.5rem" : "0rem",
						}}
						transition={{
							duration: 0.2,
							ease: "easeInOut",
						}}
					>
						{/* Scene name with scrolling for long titles */}
						<div
							ref={containerRef}
							className="relative px-1 text-center text-xs font-medium text-white/90 overflow-hidden max-w-[280px] mx-auto"
						>
							{displayTitle.length > MAX_TITLE_LENGTH_BEFORE_ANIMATING ? (
								<div className="flex items-center justify-center w-full">
									<motion.div
										ref={titleRef}
										key={`scroll-${currentSceneIndex}`}
										animate={{
											x: [
												0,
												0,
												-titleScrollDistance,
												-titleScrollDistance,
												-titleScrollDistance,
											],
										}}
										transition={{
											duration: 12,
											times: [0, 0.25, 0.5, 0.75, 1],
											ease: "linear",
											repeat: Infinity,
										}}
										className="whitespace-nowrap will-change-transform"
										style={{ paddingLeft: "2rem" }}
									>
										{displayTitle}
									</motion.div>
								</div>
							) : (
								<div ref={titleRef} className="whitespace-nowrap">
									{displayTitle}
								</div>
							)}
						</div>

						{/* Narration controls */}
						<div className="flex items-center justify-between gap-3">
							{/* Play/Pause */}
							<button
								type="button"
								onClick={handlePlayPause}
								onPointerDown={(e) => {
									e.stopPropagation();
									setIsInteractingWithControls(true);
								}}
								onPointerUp={() => setIsInteractingWithControls(false)}
								className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/10 transition-colors ml-2"
							>
								{isPlaying ? (
									<svg
										className="h-3 w-3 text-white"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-label="Pause"
									>
										<title>Pause</title>
										<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
									</svg>
								) : (
									<svg
										className="h-3 w-3 text-white"
										fill="currentColor"
										viewBox="0 0 24 24"
										aria-label="Play"
									>
										<title>Play</title>
										<path d="M8 5v14l11-7z" />
									</svg>
								)}
							</button>

							{/* Time display */}
							<div className="flex-1 text-center">
								<div className="text-[10px] text-white/70 font-mono">
									{formatTime(currentTime)} / {formatTime(duration)}
								</div>
								{/* Progress bar */}
								<div
									ref={progressBarRef}
									role="slider"
									aria-label="Audio progress"
									aria-valuemin={0}
									aria-valuemax={duration}
									aria-valuenow={currentTime}
									tabIndex={0}
									className="mt-0.5 py-1.5 w-full cursor-pointer group relative"
									onClick={handleProgressClickWrapper}
									onMouseDown={handleProgressMouseDown}
									onPointerDown={(e) => e.stopPropagation()}
									onKeyDown={(e) => {
										if (e.key === "ArrowLeft") {
											seek(Math.max(0, currentTime - 5));
										} else if (e.key === "ArrowRight") {
											seek(Math.min(duration, currentTime + 5));
										}
									}}
								>
									<div className="h-0.5 w-full rounded-full bg-white/20 relative">
										<motion.div
											className="h-full rounded-full bg-white/70 relative"
											style={{ width: `${(currentTime / duration) * 100}%` }}
											transition={{ duration: 0.2, ease: "linear" }}
										>
											{/* Scrubber handle */}
											<div className="absolute right-0 top-1/2 -translate-y-1/2 h-2.5 w-2.5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
										</motion.div>
									</div>
								</div>
							</div>

							{/* Volume control */}
							<div className="relative flex items-center mr-2">
								<button
									type="button"
									onClick={handleMuteToggle}
									onMouseEnter={() => {
										// Clear any pending hide timer
										if (volumeSliderTimerRef.current) {
											clearTimeout(volumeSliderTimerRef.current);
											volumeSliderTimerRef.current = null;
										}
										setShowVolumeSlider(true);
									}}
									onMouseLeave={() => {
										// Set a timer to hide the slider if mouse doesn't enter it
										volumeSliderTimerRef.current = setTimeout(() => {
											setShowVolumeSlider(false);
										}, 200);
									}}
									onPointerDown={(e) => {
										e.stopPropagation();
										setIsInteractingWithControls(true);
									}}
									onPointerUp={() => setIsInteractingWithControls(false)}
									className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-white/10 transition-colors"
								>
									{isMuted || volume === 0 ? (
										<svg
											className="h-3 w-3 text-white"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											aria-label="Muted"
										>
											<title>Muted</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
											/>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
											/>
										</svg>
									) : (
										<svg
											className="h-3 w-3 text-white"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											aria-label="Volume"
										>
											<title>Volume</title>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
											/>
										</svg>
									)}
								</button>

								{/* Volume slider */}
								<AnimatePresence>
									{showVolumeSlider && (
										<motion.div
											initial={{ opacity: 0, y: 10, scale: 0.95 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, y: 10, scale: 0.95 }}
											transition={{
												type: "spring",
												stiffness: 500,
												damping: 30,
												mass: 0.5,
											}}
											onMouseEnter={() => {
												// Clear any pending hide timer when entering slider
												if (volumeSliderTimerRef.current) {
													clearTimeout(volumeSliderTimerRef.current);
													volumeSliderTimerRef.current = null;
												}
												setShowVolumeSlider(true);
											}}
											onMouseLeave={() => setShowVolumeSlider(false)}
											onPointerDown={(e) => {
												e.stopPropagation();
												setIsInteractingWithControls(true);
											}}
											onPointerUp={() => setIsInteractingWithControls(false)}
											className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 rounded-2xl border border-white/20 px-3 py-3"
											style={{
												background: "rgba(0, 0, 0, 0.4)",
												backdropFilter: "blur(40px)",
												WebkitBackdropFilter: "blur(40px)",
												boxShadow:
													"0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
											}}
										>
											{/* Volume percentage */}
											<span className="text-[10px] font-mono font-semibold text-white drop-shadow-lg">
												{volume}%
											</span>

											{/* Vertical slider */}
											<div className="relative h-24 w-6 flex items-center justify-center">
												{/* Track background */}
												<div className="absolute left-1/2 -translate-x-1/2 w-1 h-full rounded-full bg-white/20" />

												{/* Filled track */}
												<motion.div
													className="absolute left-1/2 -translate-x-1/2 bottom-0 w-1 rounded-full"
													style={{
														height: `${volume}%`,
														background:
															"linear-gradient(to top, rgb(255,255,255), rgba(255,255,255,0.8))",
													}}
													transition={{ duration: 0.1, ease: "linear" }}
												/>

												{/* Vertical range input */}
												<input
													type="range"
													min="0"
													max="100"
													value={volume}
													onChange={(e) =>
														handleVolumeChange(Number(e.target.value))
													}
													className="absolute h-full w-6 cursor-pointer appearance-none bg-transparent vertical-slider"
													style={{
														writingMode: "vertical-lr",
														direction: "rtl",
													}}
												/>
											</div>

											{/* Min indicator */}
											<div className="text-[8px] text-white/50 drop-shadow">
												0
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</div>
					</motion.div>

					{/* Utility buttons - pop out on hover */}
					<AnimatePresence initial={false}>
						{isToolbarExpanded && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: "auto", opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{
									height: { duration: 0.2, ease: "easeInOut" },
									opacity: { duration: 0.15 },
								}}
								className="overflow-hidden"
							>
								<div className="pt-2 pb-2">
									{/* Separator */}
									<motion.div
										initial={{ opacity: 0, scaleX: 0 }}
										animate={{ opacity: 1, scaleX: 1 }}
										exit={{ opacity: 0, scaleX: 0 }}
										transition={{
											duration: 0.15,
											ease: "easeOut",
										}}
										className="h-px w-full bg-white/10 mb-2"
									/>

									{/* Buttons container */}
									<motion.div
										className="flex items-center justify-center gap-2"
										initial={{ width: 0 }}
										animate={{ width: "auto" }}
										exit={{ width: 0 }}
										transition={{
											duration: 0.2,
											ease: "easeInOut",
										}}
										style={{ overflow: "visible" }}
									>
										{/* Polaroid Stack Button */}
										<motion.div
											initial={{ opacity: 0, y: 10, scale: 0.8 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, y: 10, scale: 0.8 }}
											transition={{
												duration: 0.2,
												ease: [0.34, 1.56, 0.64, 1],
												delay: 0,
											}}
										>
											<PolaroidStackButton
												currentSceneIndex={currentSceneIndex}
												polaroidHovered={polaroidHovered}
												setPolaroidHovered={setPolaroidHovered}
												onClick={() => setSceneSelectorOpen(true)}
											/>
										</motion.div>

										{/* Divider */}
										<div className="h-6 w-px bg-white/20" />

										{/* Other utility buttons */}
										{utilityButtons.map((button, index) => (
											<motion.div
												key={`utility-${button.label}-${index}`}
												initial={{ opacity: 0, y: 10, scale: 0.8 }}
												animate={{ opacity: 1, y: 0, scale: 1 }}
												exit={{ opacity: 0, y: 10, scale: 0.8 }}
												transition={{
													duration: 0.2,
													ease: [0.34, 1.56, 0.64, 1],
													delay: (index + 1) * 0.05,
												}}
											>
												<ToolbarButton {...button} />
											</motion.div>
										))}
									</motion.div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</motion.div>

			{/* Scene Selector Modal - Outside toolbar container */}
			<SceneSelector
				isOpen={sceneSelectorOpen}
				onClose={() => setSceneSelectorOpen(false)}
				currentSceneIndex={currentSceneIndex}
			/>
		</>
	);
}
