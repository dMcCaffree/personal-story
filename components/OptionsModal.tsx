"use client";

import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect } from "react";

interface OptionsModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function OptionsModal({ isOpen, onClose }: OptionsModalProps) {
	const { theme, toggleTheme } = useTheme();

	// Close modal on Escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		};

		window.addEventListener("keydown", handleEscape);
		return () => window.removeEventListener("keydown", handleEscape);
	}, [isOpen, onClose]);

	const glassStyle = {
		background:
			theme === "dark" ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.4)",
		backdropFilter: "blur(40px)",
		WebkitBackdropFilter: "blur(40px)",
		boxShadow:
			theme === "dark"
				? "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)"
				: "0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.5)",
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-50 bg-black/60"
						onClick={onClose}
					/>

					{/* Modal */}
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.9, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.9, y: 20 }}
							transition={{
								type: "spring",
								stiffness: 500,
								damping: 30,
								mass: 0.5,
							}}
							className={`relative w-full max-w-md rounded-2xl border p-8 ${
								theme === "dark" ? "border-white/20" : "border-black/20"
							}`}
							style={glassStyle}
							onClick={(e) => e.stopPropagation()}
						>
							{/* Close button */}
							<button
								type="button"
								onClick={onClose}
								className={`absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
									theme === "dark"
										? "hover:bg-white/10 text-white/70 hover:text-white"
										: "hover:bg-black/10 text-black/70 hover:text-black"
								}`}
							>
								<svg
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>

							{/* Title */}
							<h2
								className={`mb-6 text-2xl font-bold ${
									theme === "dark" ? "text-white" : "text-black"
								}`}
							>
								OPTIONS
							</h2>

							{/* Theme toggle */}
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<span
										className={`text-sm font-medium ${
											theme === "dark" ? "text-white/90" : "text-black/90"
										}`}
									>
										Theme
									</span>
									<button
										type="button"
										onClick={toggleTheme}
										className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
											theme === "dark" ? "bg-white/20" : "bg-black/20"
										}`}
									>
										<motion.div
											className={`h-6 w-6 rounded-full ${
												theme === "dark" ? "bg-white" : "bg-black"
											}`}
											animate={{
												x: theme === "dark" ? 36 : 4,
											}}
											transition={{
												type: "spring",
												stiffness: 500,
												damping: 30,
												mass: 0.5,
											}}
										/>
									</button>
								</div>
								<div
									className={`text-xs ${
										theme === "dark" ? "text-white/60" : "text-black/60"
									}`}
								>
									Current: {theme === "dark" ? "Dark" : "Light"} Mode
								</div>
							</div>

							{/* Close button */}
							<div className="mt-8">
								<motion.button
									type="button"
									onClick={onClose}
									className={`w-full rounded-xl border px-6 py-3 font-mono text-sm tracking-wider transition-colors ${
										theme === "dark"
											? "border-white/20 hover:bg-white/10 text-white"
											: "border-black/20 hover:bg-black/10 text-black"
									}`}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									transition={{
										type: "spring",
										stiffness: 500,
										damping: 30,
										mass: 0.5,
									}}
								>
									CLOSE
								</motion.button>
							</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	);
}

