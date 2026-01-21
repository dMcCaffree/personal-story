"use client";

import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useAchievementContext } from "@/contexts/AchievementContext";

interface AchievementsModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function AchievementsModal({ isOpen, onClose }: AchievementsModalProps) {
	const { achievements, stats } = useAchievementContext();

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
						className="fixed inset-0 z-[60] bg-black/70"
						onClick={onClose}
					/>

					{/* Modal */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 30,
						}}
						className="fixed left-1/2 top-1/2 z-[70] w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/20 p-8 shadow-2xl max-h-[85vh] overflow-hidden flex flex-col"
						style={{
							background:
								"linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.08) 100%)",
							backdropFilter: "blur(40px)",
							WebkitBackdropFilter: "blur(40px)",
							boxShadow:
								"0 8px 32px 0 rgba(0, 0, 0, 0.7), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)",
						}}
						onClick={(e) => e.stopPropagation()}
					>
						{/* Header */}
						<div className="mb-6">
							<div className="flex items-center justify-between">
								<div>
									<h2 className="text-3xl font-bold text-white mb-2">
										Achievements
									</h2>
									<p className="text-white/60 text-sm">
										{stats.completed} of {stats.total} completed ({stats.percentage}
										%)
									</p>
								</div>
								<button
									type="button"
									onClick={onClose}
									className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
									aria-label="Close"
								>
									<svg
										className="h-6 w-6 text-white"
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

							{/* Progress bar */}
							<div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
								<motion.div
									initial={{ width: 0 }}
									animate={{ width: `${stats.percentage}%` }}
									transition={{ duration: 0.6, delay: 0.2 }}
									className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600"
								/>
							</div>
						</div>

						{/* Achievement Grid */}
						<div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{achievements.map((achievement) => (
									<motion.div
										key={achievement.id}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3 }}
										className={`relative rounded-xl border p-4 transition-all ${
											achievement.completed
												? "border-white/30 bg-white/5"
												: "border-white/10 bg-black/20"
										}`}
									>
										{/* Completed overlay */}
										{achievement.completed && (
											<div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent rounded-xl pointer-events-none" />
										)}

										<div className="relative flex items-start gap-4">
											{/* Icon */}
											<div
												className={`relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden ${
													achievement.completed
														? "opacity-100"
														: "opacity-40 grayscale"
												}`}
											>
												<div className="absolute inset-0 border-2 border-white/20 rounded-lg bg-black/60" />
												<Image
													src={achievement.icon}
													alt={achievement.name}
													fill
													className="object-contain p-2"
													unoptimized
												/>
												{/* Checkmark for completed */}
												{achievement.completed && (
													<div className="absolute top-0 right-0 h-6 w-6 bg-yellow-500 rounded-bl-lg flex items-center justify-center">
														<svg
															className="h-4 w-4 text-black"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<title>Completed</title>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={3}
																d="M5 13l4 4L19 7"
															/>
														</svg>
													</div>
												)}
											</div>

											{/* Text */}
											<div className="flex-1 min-w-0">
												<h3
													className={`text-lg font-bold mb-1 ${
														achievement.completed
															? "text-white"
															: "text-white/40"
													}`}
													style={
														achievement.completed
															? { textDecoration: "line-through" }
															: {}
													}
												>
													{achievement.name}
												</h3>
												<p
													className={`text-sm ${
														achievement.completed
															? "text-white/70"
															: "text-white/30"
													}`}
												>
													{achievement.description}
												</p>

												{/* Progress indicator for multi-step achievements */}
												{achievement.maxProgress &&
													achievement.maxProgress > 1 && (
														<div className="mt-2 flex items-center gap-2">
															<div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
																<motion.div
																	initial={{ width: 0 }}
																	animate={{
																		width: `${
																			((achievement.progress ?? 0) /
																				achievement.maxProgress) *
																			100
																		}%`,
																	}}
																	transition={{ duration: 0.4 }}
																	className="h-full bg-yellow-400"
																/>
															</div>
															<span className="text-xs text-white/50">
																{achievement.progress ?? 0}/{achievement.maxProgress}
															</span>
														</div>
													)}

												{/* Locked indicator */}
												{!achievement.completed && (
													<div className="mt-2 flex items-center gap-1 text-white/30 text-xs">
														<svg
															className="h-3 w-3"
															fill="currentColor"
															viewBox="0 0 20 20"
														>
															<title>Locked</title>
															<path
																fillRule="evenodd"
																d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
																clipRule="evenodd"
															/>
														</svg>
														<span>Locked</span>
													</div>
												)}
											</div>
										</div>
									</motion.div>
								))}
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}

