"use client";

import { motion, AnimatePresence } from "motion/react";
import { scenes } from "@/data/scenes";
import { getKeyframeUrl } from "@/lib/story-config";
import { useStory } from "@/contexts/StoryContext";
import Image from "next/image";
import { useState } from "react";

interface SceneSelectorProps {
	isOpen: boolean;
	onClose: () => void;
	currentSceneIndex: number;
}

export function SceneSelector({
	isOpen,
	onClose,
	currentSceneIndex,
}: SceneSelectorProps) {
	const { goToNextScene, goToPreviousScene } = useStory();
	const [hoveredScene, setHoveredScene] = useState<number | null>(null);

	const handleSceneClick = (targetIndex: number) => {
		// Calculate how many scenes to navigate
		const diff = targetIndex - currentSceneIndex;

		// Navigate multiple times
		if (diff > 0) {
			for (let i = 0; i < diff; i++) {
				setTimeout(() => goToNextScene(), i * 100);
			}
		} else if (diff < 0) {
			for (let i = 0; i < Math.abs(diff); i++) {
				setTimeout(() => goToPreviousScene(), i * 100);
			}
		}

		onClose();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop - invisible but clickable */}
					{/** biome-ignore lint/a11y/noStaticElementInteractions: false positive */}
					<div
						className="fixed inset-0 z-60"
						onClick={onClose}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								onClose();
							}
						}}
					/>

					{/* Popover */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 10 }}
						transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
						className="fixed bottom-24 left-1/2 -translate-x-1/2 z-70 w-[520px] max-h-[450px] rounded-2xl border border-white/30 backdrop-blur-3xl shadow-2xl overflow-hidden"
						style={{
							background:
								"linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)",
							boxShadow:
								"0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.3)",
						}}
					>
						{/* Header */}
						<div className="px-6 py-4 border-b border-white/10">
							<h3 className="text-sm font-bold text-white tracking-tight">
								Select Chapter
							</h3>
						</div>

						{/* Scene Grid */}
						<div className="overflow-y-auto px-6 py-6 scrollbar-hide max-h-[370px]">
							<div className="grid grid-cols-5 gap-2.5">
								{scenes.map((scene, index) => (
									<motion.button
										key={scene.index}
										type="button"
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{
											delay: index * 0.015,
											duration: 0.3,
											ease: [0.34, 1.56, 0.64, 1],
										}}
										onClick={() => handleSceneClick(scene.index)}
										onMouseEnter={() => setHoveredScene(scene.index)}
										onMouseLeave={() => setHoveredScene(null)}
										disabled={scene.index === currentSceneIndex}
										className={`group relative overflow-hidden rounded-md border ${
											scene.index === currentSceneIndex
												? "border-white ring-2 ring-white/50"
												: "border-white/25 hover:border-white/60"
										} transition-all duration-200 ${
											scene.index === currentSceneIndex
												? "cursor-default"
												: "cursor-pointer"
										}`}
										whileHover={
											scene.index !== currentSceneIndex ? { scale: 1.08 } : {}
										}
										whileTap={
											scene.index !== currentSceneIndex ? { scale: 0.95 } : {}
										}
										style={{
											boxShadow:
												scene.index === currentSceneIndex
													? "0 4px 16px rgba(255,255,255,0.3), inset 0 0 0 1px rgba(255,255,255,0.5)"
													: "0 2px 6px rgba(0,0,0,0.3)",
										}}
									>
										{/* Image */}
										<div className="relative aspect-square w-full overflow-hidden">
											<Image
												src={getKeyframeUrl(scene.index)}
												alt={scene.title}
												fill
												className="object-cover transition-transform duration-300 group-hover:scale-110"
												unoptimized
											/>
											{/* Subtle gradient overlay */}
											<div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

											{/* Hover title */}
											<AnimatePresence>
												{hoveredScene === scene.index &&
													scene.index !== currentSceneIndex && (
														<motion.div
															initial={{ opacity: 0, y: 5 }}
															animate={{ opacity: 1, y: 0 }}
															exit={{ opacity: 0, y: 5 }}
															transition={{ duration: 0.15 }}
															className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-black/90 backdrop-blur-sm"
														>
															<div className="text-[8px] text-white/70 font-semibold uppercase tracking-wider">
																Chapter {scene.index}
															</div>
															<div className="text-[9px] text-white font-bold line-clamp-1 leading-tight">
																{scene.title}
															</div>
														</motion.div>
													)}
											</AnimatePresence>
										</div>
									</motion.button>
								))}
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
