"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useAchievementContext } from "@/contexts/AchievementContext";

export function AchievementNotification() {
	const { activeNotifications, dismissNotification } = useAchievementContext();

	return (
		<div className="fixed top-4 left-1/2 -translate-x-1/2 md:bottom-4 md:left-4 md:top-auto md:translate-x-0 z-[55] flex flex-col gap-3">
			<AnimatePresence mode="popLayout">
				{activeNotifications.map((notification, index) => (
					<motion.div
						key={notification.notificationId}
						initial={{
							opacity: 0,
							y: 50,
							x: -50,
							scale: 0.9,
						}}
						animate={{
							opacity: 1,
							y: 0,
							x: 0,
							scale: 1,
						}}
						exit={{
							opacity: 0,
							scale: 0.8,
							transition: { duration: 0.2 },
						}}
						transition={{
							type: "spring",
							stiffness: 400,
							damping: 25,
							delay: index * 0.1,
						}}
						className="relative w-80 rounded-2xl border border-white/30 p-4 shadow-2xl"
						style={{
							background:
								"linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)",
							backdropFilter: "blur(40px)",
							WebkitBackdropFilter: "blur(40px)",
							boxShadow:
								"0 8px 32px 0 rgba(0, 0, 0, 0.6), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)",
						}}
					>
						{/* Celebratory glow effect */}
						<div
							className="absolute inset-0 rounded-2xl opacity-50 pointer-events-none"
							style={{
								background:
									"radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.3) 0%, transparent 70%)",
								animation: "pulse 2s ease-in-out infinite",
							}}
						/>

						{/* Content */}
						<div className="relative flex items-center gap-4">
							{/* Icon */}
							<div className="relative h-16 w-16 flex-shrink-0">
								<div className="absolute inset-0 rounded-full border-2 border-white/40 bg-black/40" />
								<Image
									src={notification.icon}
									alt={notification.name}
									fill
									className="object-contain p-2"
									unoptimized
								/>
								{/* Shine effect */}
								<motion.div
									initial={{ opacity: 0, rotate: -45 }}
									animate={{
										opacity: [0, 1, 0],
										x: [-20, 20],
									}}
									transition={{
										duration: 1.5,
										repeat: Number.POSITIVE_INFINITY,
										repeatDelay: 2,
									}}
									className="absolute inset-0 overflow-hidden rounded-full"
								>
									<div
										className="h-full w-4"
										style={{
											background:
												"linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
										}}
									/>
								</motion.div>
							</div>

							{/* Text */}
							<div className="flex-1">
								<div className="text-sm font-bold text-yellow-300 uppercase tracking-wide mb-1">
									Achievement Unlocked!
								</div>
								<div className="text-lg font-bold text-white leading-tight">
									{notification.name}
								</div>
								<div className="text-xs text-white/70 mt-1">
									{notification.description}
								</div>
							</div>

							{/* Close button */}
							<button
								type="button"
								onClick={() => dismissNotification(notification.notificationId)}
								className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
								aria-label="Dismiss"
							>
								<svg
									className="h-4 w-4 text-white"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<title>Close</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					</motion.div>
				))}
			</AnimatePresence>

			{/* CSS for pulse animation */}
			<style jsx>{`
				@keyframes pulse {
					0%,
					100% {
						opacity: 0.3;
					}
					50% {
						opacity: 0.6;
					}
				}
			`}</style>
		</div>
	);
}

