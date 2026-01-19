"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useStory } from "@/contexts/StoryContext";

const LINKEDIN_URL = "https://linkedin.com/in/dMcCaffree";
const RESUME_URL = "#"; // Placeholder for now

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
	const [showTooltip, setShowTooltip] = useState(false);

	const buttonContent = (
		<motion.button
			className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all ${
				disabled
					? "cursor-not-allowed opacity-40"
					: "hover:bg-white/20 active:scale-95"
			} ${isActive ? "bg-white/20" : ""}`}
			disabled={disabled}
			onClick={onClick}
			onMouseEnter={() => setShowTooltip(true)}
			onMouseLeave={() => setShowTooltip(false)}
			whileHover={{ scale: disabled ? 1 : 1.05 }}
			whileTap={{ scale: disabled ? 1 : 0.95 }}
			transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
		>
			{icon}

			{/* Tooltip */}
			<AnimatePresence>
				{showTooltip && (
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 10 }}
						transition={{
							type: "spring",
							stiffness: 500,
							damping: 30,
							mass: 0.5,
						}}
						className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-black/90 px-3 py-1.5 text-sm text-white backdrop-blur-xl"
					>
						{label}
						<div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-black/90" />
					</motion.div>
				)}
			</AnimatePresence>
		</motion.button>
	);

	if (href) {
		return (
			<a href={href} target="_blank" rel="noopener noreferrer">
				{buttonContent}
			</a>
		);
	}

	return buttonContent;
}

export function Toolbar() {
	const {
		goToNextScene,
		goToPreviousScene,
		canGoNext,
		canGoBack,
		isTransitioning,
	} = useStory();
	const [isMenuExpanded, setIsMenuExpanded] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const [captionsEnabled, setCaptionsEnabled] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const handleMuteToggle = () => {
		setIsMuted(!isMuted);
		// TODO: Implement actual mute functionality
	};

	const handleCaptionsToggle = () => {
		setCaptionsEnabled(!captionsEnabled);
		// TODO: Implement captions toggle
	};

	const handleHintToggle = () => {
		// TODO: Implement hint/aside highlighting
		console.log("Show hints for clickable asides");
	};

	// Always visible buttons
	const coreButtons = [
		{
			icon: (
				<svg
					className="h-5 w-5 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			),
			label: "Go Back",
			onClick: goToPreviousScene,
			disabled: !canGoBack || isTransitioning,
		},
		{
			icon: (
				<svg
					className="h-5 w-5 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 5l7 7-7 7"
					/>
				</svg>
			),
			label: "Continue",
			onClick: goToNextScene,
			disabled: !canGoNext || isTransitioning,
		},
		{
			icon: isMuted ? (
				<svg
					className="h-5 w-5 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
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
					className="h-5 w-5 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
					/>
				</svg>
			),
			label: isMuted ? "Unmute" : "Mute",
			onClick: handleMuteToggle,
			isActive: isMuted,
		},
	];

	// Hover-revealed buttons
	const expandedButtons = [
		{
			icon: (
				<svg
					className="h-5 w-5 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
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
					className="h-5 w-5 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
					/>
				</svg>
			),
			label: "Show Hints",
			onClick: handleHintToggle,
		},
		{
			icon: (
				<svg
					className="h-5 w-5 text-white"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
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
					className="h-5 w-5 text-white"
					fill="currentColor"
					viewBox="0 0 24 24"
				>
					<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
				</svg>
			),
			label: "LinkedIn",
			href: LINKEDIN_URL,
		},
	];

	return (
		<motion.div
			drag
			dragMomentum={false}
			dragElastic={0.1}
			dragConstraints={{
				top: -window.innerHeight / 2 + 100,
				bottom: window.innerHeight / 2 - 100,
				left: -window.innerWidth / 2 + 200,
				right: window.innerWidth / 2 - 200,
			}}
			onDragStart={() => setIsDragging(true)}
			onDragEnd={() => setIsDragging(false)}
			className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 cursor-grab active:cursor-grabbing"
			whileDrag={{ scale: 1.05, cursor: "grabbing" }}
		>
			<motion.div
				className="relative flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 backdrop-blur-2xl"
				onMouseLeave={() => !isDragging && setIsMenuExpanded(false)}
				style={{
					boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
				}}
			>
				{/* Core buttons - always visible */}
				{coreButtons.map((button, index) => (
					<ToolbarButton key={`core-${button.label}-${index}`} {...button} />
				))}

				{/* Separator - shows when menu is expanded */}
				<AnimatePresence>
					{isMenuExpanded && (
						<motion.div
							initial={{ opacity: 0, scaleY: 0 }}
							animate={{ opacity: 1, scaleY: 1 }}
							exit={{ opacity: 0, scaleY: 0 }}
							transition={{
								duration: 0.15,
								ease: "easeOut",
							}}
							className="h-6 w-px bg-white/20"
						/>
					)}
				</AnimatePresence>

				{/* Expanded buttons - morph from menu button */}
				<AnimatePresence mode="wait">
					{isMenuExpanded ? (
						expandedButtons.map((button, index) => (
							<motion.div
								key={`expanded-${button.label}-${index}`}
								initial={{ opacity: 0, scale: 0, width: 0 }}
								animate={{ opacity: 1, scale: 1, width: "auto" }}
								exit={{ opacity: 0, scale: 0, width: 0 }}
								transition={{
									duration: 0.15,
									ease: [0.34, 1.56, 0.64, 1], // Custom ease for snappy spring effect
									delay: index * 0.02,
								}}
							>
								<ToolbarButton {...button} />
							</motion.div>
						))
					) : (
						<motion.button
							key="menu-button"
							className="relative flex h-10 w-10 items-center justify-center rounded-full transition-all hover:bg-white/20 active:scale-95"
							onMouseEnter={() => !isDragging && setIsMenuExpanded(true)}
							initial={{ opacity: 0, scale: 0 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0 }}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							transition={{
								duration: 0.15,
								ease: [0.34, 1.56, 0.64, 1],
							}}
						>
							<svg
								className="h-5 w-5 text-white"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
								/>
							</svg>
						</motion.button>
					)}
				</AnimatePresence>
			</motion.div>
		</motion.div>
	);
}
