"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";
import { TitleMenuItem } from "@/components/TitleMenuItem";
import { OptionsModal } from "@/components/OptionsModal";
import { getKeyframeUrl } from "@/lib/story-config";

const ONBOARDING_KEY = "personal-story-onboarding-complete";

// Background images for each menu option
const MENU_BACKGROUNDS = {
	story: getKeyframeUrl(1), // First scene for NEW GAME/CONTINUE
	projects: getKeyframeUrl(5), // Scene 5 for PROJECTS
	thoughts: getKeyframeUrl(3), // Scene 3 for THOUGHTS
	options: getKeyframeUrl(7), // Scene 7 for OPTIONS
};

export function TitleScreen() {
	const router = useRouter();
	const { theme } = useTheme();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [showOptions, setShowOptions] = useState(false);
	const [hasSeenStory, setHasSeenStory] = useState(false);

	// Check if user has seen the story before
	useEffect(() => {
		const seen = localStorage.getItem(ONBOARDING_KEY);
		setHasSeenStory(seen === "true");
	}, []);

	const menuItems = [
		{
			label: hasSeenStory ? "CONTINUE" : "NEW GAME",
			action: () => router.push("/story"),
			background: MENU_BACKGROUNDS.story,
		},
		{
			label: "PROJECTS",
			action: () => router.push("/projects"),
			background: MENU_BACKGROUNDS.projects,
		},
		{
			label: "THOUGHTS",
			action: () => router.push("/thoughts"),
			background: MENU_BACKGROUNDS.thoughts,
		},
		{
			label: "OPTIONS",
			action: () => setShowOptions(true),
			background: MENU_BACKGROUNDS.options,
		},
	];

	const currentBackground = menuItems[selectedIndex].background;

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (showOptions) return; // Don't handle keyboard when modal is open

			switch (e.key) {
				case "ArrowUp":
					e.preventDefault();
					setSelectedIndex((prev) => (prev === 0 ? menuItems.length - 1 : prev - 1));
					break;
				case "ArrowDown":
					e.preventDefault();
					setSelectedIndex((prev) => (prev === menuItems.length - 1 ? 0 : prev + 1));
					break;
				case "Enter":
				case " ":
					e.preventDefault();
					menuItems[selectedIndex].action();
					break;
			}
		},
		[selectedIndex, menuItems, showOptions],
	);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	return (
		<>
			<div className="fixed inset-0">
				{/* Animated background images */}
				<div className="absolute inset-0 overflow-hidden">
					<AnimatePresence initial={false}>
						<motion.div
							key={currentBackground}
							initial={{ opacity: 0, scale: 1.1 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{
								duration: 0.8,
								ease: [0.43, 0.13, 0.23, 0.96],
							}}
							className="absolute inset-0"
							style={{
								backgroundImage: `url(${currentBackground})`,
								backgroundSize: "cover",
								backgroundPosition: "center",
								filter: "blur(20px) brightness(0.4)",
							}}
						/>
					</AnimatePresence>
				</div>

				{/* Gradient overlay */}
				<div
					className={`absolute inset-0 transition-colors duration-300 ${
						theme === "dark"
							? "bg-gradient-to-br from-black/60 via-black/40 to-black/60"
							: "bg-gradient-to-br from-white/60 via-white/40 to-white/60"
					}`}
				/>

				{/* Content */}
				<div className="relative flex h-full w-full flex-col items-center justify-center gap-8">
					{/* Title */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.8,
							ease: "easeOut",
						}}
						className="mb-8"
					>
						<h1
							className={`text-5xl font-bold tracking-wider ${
								theme === "dark" ? "text-white" : "text-black"
							}`}
						>
							DUSTIN MCCAFFREE
						</h1>
					</motion.div>

					{/* Menu items */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							duration: 0.6,
							delay: 0.3,
						}}
						className="flex flex-col gap-4"
					>
						{menuItems.map((item, index) => (
							<motion.div
								key={item.label}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{
									duration: 0.5,
									delay: 0.4 + index * 0.1,
								}}
							>
								<TitleMenuItem
									label={item.label}
									isSelected={selectedIndex === index}
									onClick={item.action}
									onMouseEnter={() => setSelectedIndex(index)}
								/>
							</motion.div>
						))}
					</motion.div>

					{/* Subtle hint text */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							duration: 0.6,
							delay: 1.2,
						}}
						className={`mt-8 text-xs ${
							theme === "dark" ? "text-white/40" : "text-black/40"
						}`}
					>
						Use arrow keys or mouse to navigate
					</motion.div>
				</div>
			</div>

			{/* Options Modal */}
			<OptionsModal isOpen={showOptions} onClose={() => setShowOptions(false)} />
		</>
	);
}

