"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";
import { OptionsModal } from "@/components/OptionsModal";
import { getKeyframeUrl } from "@/lib/story-config";
import { projects } from "@/lib/projects-data";

const ONBOARDING_KEY = "personal-story-onboarding-complete";

// Background images for each menu option
const MENU_BACKGROUNDS = {
	story: getKeyframeUrl(1), // First scene for NEW GAME/CONTINUE
	projects: projects[2].image, // Scene 5 for PROJECTS
	thoughts: getKeyframeUrl(3), // Scene 3 for THOUGHTS
	options: undefined, // Scene 7 for OPTIONS
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

	const menuItems = useMemo(
		() => [
			{
				label: hasSeenStory ? "CONTINUE STORY" : "START STORY",
				action: () => router.push("/story"),
				background: MENU_BACKGROUNDS.story,
			},
			{
				label: "PROJECTS",
				action: () => router.push("/projects"),
				background: MENU_BACKGROUNDS.projects,
			},
			{
				label: "BLOG",
				action: () => router.push("/blog"),
				background: MENU_BACKGROUNDS.thoughts,
			},
			{
				label: "OPTIONS",
				action: () => setShowOptions(true),
				background: MENU_BACKGROUNDS.options,
			},
		],
		[hasSeenStory, router],
	);

	const currentBackground = menuItems[selectedIndex].background;

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (showOptions) return; // Don't handle keyboard when modal is open

			switch (e.key) {
				case "ArrowUp":
					e.preventDefault();
					setSelectedIndex((prev) =>
						prev === 0 ? menuItems.length - 1 : prev - 1,
					);
					break;
				case "ArrowDown":
					e.preventDefault();
					setSelectedIndex((prev) =>
						prev === menuItems.length - 1 ? 0 : prev + 1,
					);
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
								backgroundImage: currentBackground
									? `url(${currentBackground})`
									: "none",
								backgroundSize: "cover",
								backgroundPosition: "center",
								filter: "blur(5px) brightness(0.3)",
							}}
						/>
					</AnimatePresence>
				</div>

				{/* Vignette overlay */}
				<div
					className="absolute inset-0"
					style={{
						background:
							"radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.6) 100%)",
					}}
				/>

				{/* Gradient overlay */}
				<div
					className={`absolute inset-0 ${
						theme === "dark"
							? "bg-gradient-to-r from-black/80 via-black/40 to-transparent"
							: "bg-gradient-to-r from-white/80 via-white/40 to-transparent"
					}`}
				/>

				{/* Content */}
				<div className="relative flex h-full w-full items-center px-12 sm:px-16 md:px-24">
					<div className="w-full max-w-xl">
						{/* Title */}
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{
								duration: 0.8,
								ease: "easeOut",
							}}
							className="mb-16"
						>
							<h1
								className={`mb-2 text-6xl font-bold tracking-wider ${
									theme === "dark" ? "text-white" : "text-black"
								}`}
								style={{
									textShadow:
										theme === "dark"
											? "0 0 20px rgba(0,0,0,0.5)"
											: "0 0 20px rgba(255,255,255,0.5)",
								}}
							>
								DUSTIN MCCAFFREE
							</h1>
							<div
								className={`h-0.5 w-32 ${
									theme === "dark" ? "bg-white/30" : "bg-black/30"
								}`}
							/>
						</motion.div>

						{/* Menu items */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{
								duration: 0.6,
								delay: 0.3,
							}}
							className="space-y-2"
						>
							{menuItems.map((item, index) => {
								const isSelected = selectedIndex === index;
								return (
									<motion.button
										key={item.label}
										type="button"
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{
											duration: 0.5,
											delay: 0.4 + index * 0.08,
										}}
										onClick={item.action}
										onMouseEnter={() => setSelectedIndex(index)}
										className={`group relative w-full text-left transition-all ${
											isSelected ? "pl-6" : "pl-4"
										}`}
									>
										{/* Border indicator */}
										<motion.div
											className={`absolute left-0 top-0 h-full w-1 ${
												theme === "dark" ? "bg-white" : "bg-black"
											}`}
											initial={{ scaleY: 0 }}
											animate={{ scaleY: isSelected ? 1 : 0 }}
											transition={{
												type: "spring",
												stiffness: 500,
												damping: 30,
											}}
										/>

										{/* Text */}
										<span
											className={`block py-3 font-mono text-lg tracking-wider transition-colors ${
												isSelected
													? theme === "dark"
														? "text-white"
														: "text-black"
													: theme === "dark"
														? "text-white/50"
														: "text-black/50"
											}`}
											style={{
												textShadow: isSelected
													? theme === "dark"
														? "0 0 10px rgba(255,255,255,0.3)"
														: "0 0 10px rgba(0,0,0,0.3)"
													: "none",
											}}
										>
											{item.label}
										</span>

										{/* Subtle background on hover */}
										{isSelected && (
											<motion.div
												layoutId="menu-bg"
												className={`absolute inset-0 -z-10 ${
													theme === "dark" ? "bg-white/5" : "bg-black/5"
												}`}
												transition={{
													type: "spring",
													stiffness: 500,
													damping: 30,
												}}
											/>
										)}
									</motion.button>
								);
							})}
						</motion.div>

						{/* Hint text */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{
								duration: 0.6,
								delay: 1.2,
							}}
							className={`mt-12 flex items-center gap-4 text-xs font-mono ${
								theme === "dark" ? "text-white/30" : "text-black/30"
							}`}
						>
							<div className="flex items-center gap-2">
								<kbd className="rounded border border-current px-1.5 py-0.5">
									↑
								</kbd>
								<kbd className="rounded border border-current px-1.5 py-0.5">
									↓
								</kbd>
								<span>NAVIGATE</span>
							</div>
							<div className="flex items-center gap-2">
								<kbd className="rounded border border-current px-2 py-0.5">
									ENTER
								</kbd>
								<span>SELECT</span>
							</div>
						</motion.div>
					</div>
				</div>
			</div>

			{/* Options Modal */}
			<OptionsModal
				isOpen={showOptions}
				onClose={() => setShowOptions(false)}
			/>
		</>
	);
}
