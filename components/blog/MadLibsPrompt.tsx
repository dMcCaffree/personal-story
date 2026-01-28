"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";
import { diceCategories, madLibsCategories } from "@/lib/dice-config";

interface DiceState {
	faces: string[];
	rotateX: number;
	rotateY: number;
	rotateZ: number;
	result: string | null;
	isRolling: boolean;
}

export function MadLibsPrompt() {
	const { theme } = useTheme();
	const [showComparison, setShowComparison] = useState(false);

	// Initialize dice with random faces
	const [diceStates, setDiceStates] = useState<DiceState[]>(() =>
		madLibsCategories.map((category) => {
			const options = diceCategories[category.key];
			const faces = [];
			for (let i = 0; i < 6; i++) {
				faces.push(options[Math.floor(Math.random() * options.length)]);
			}
			return {
				faces,
				rotateX: 0,
				rotateY: 0,
				rotateZ: 0,
				result: null,
				isRolling: false,
			};
		}),
	);

	const isAnyRolling = diceStates.some((d) => d.isRolling);
	const allHaveResults = diceStates.every((d) => d.result !== null);

	const handleRollAll = async () => {
		if (isAnyRolling) return;

		setShowComparison(false);

		// Reset all results
		setDiceStates((prev) =>
			prev.map((d) => ({ ...d, result: null, isRolling: true })),
		);

		// Roll each die with a slight delay
		for (let i = 0; i < madLibsCategories.length; i++) {
			await new Promise((resolve) => setTimeout(resolve, 150));

			// Capture the index in a closure
			const dieIndex = i;

			setDiceStates((prev) => {
				const newStates = [...prev];

				// Pick a random face and result
				const finalFaceIndex = Math.floor(Math.random() * 6);
				const finalValue = newStates[dieIndex].faces[finalFaceIndex];

				// Generate random number of spins (keep them as even multiples)
				const baseSpinsX = Math.floor(Math.random() * 3 + 2) * 360;
				const baseSpinsY = Math.floor(Math.random() * 3 + 2) * 360;

				// Calculate exact final rotation based on which face to show
				let finalX = baseSpinsX;
				let finalY = baseSpinsY;

				if (finalFaceIndex === 1) {
					// Back face
					finalY = baseSpinsY + 180;
				} else if (finalFaceIndex === 2) {
					// Right face
					finalY = baseSpinsY - 90;
				} else if (finalFaceIndex === 3) {
					// Left face
					finalY = baseSpinsY + 90;
				} else if (finalFaceIndex === 4) {
					// Top face
					finalX = baseSpinsX - 90;
				} else if (finalFaceIndex === 5) {
					// Bottom face
					finalX = baseSpinsX + 90;
				}
				// Index 0 (front) uses baseSpins as-is

				// Set rotation AND result together to avoid mismatches
				newStates[dieIndex] = {
					...newStates[dieIndex],
					rotateX: finalX,
					rotateY: finalY,
					rotateZ: 0,
					result: finalValue,
				};

				// Mark as not rolling after animation completes
				setTimeout(() => {
					setDiceStates((current) => {
						const updated = [...current];
						updated[dieIndex] = { ...updated[dieIndex], isRolling: false };
						return updated;
					});
				}, 1000);

				return newStates;
			});
		}

		// Show comparison after all are done
		setTimeout(
			() => {
				setShowComparison(true);
			},
			1000 + madLibsCategories.length * 150,
		);
	};

	const results = diceStates.reduce(
		(acc, state, i) => {
			acc[madLibsCategories[i].key] = state.result || "";
			return acc;
		},
		{} as Record<string, string>,
	);

	const genericPrompt =
		"A professional person working at a desk, natural lighting, neutral color palette, standard textures";

	const filledPrompt = `A professional ${results.animal || "[ANIMAL]"} working at a desk, ${results.timeOfDay || "[TIME_OF_DAY]"} with ${results.lighting || "[LIGHTING]"}, ${results.color || "[COLOR]"} color palette, ${results.texture || "[TEXTURE]"} textures, ${results.mood || "[MOOD]"} mood`;

	return (
		<div className="my-12">
			{/* Dice Grid */}
			<div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
				{madLibsCategories.map((category, index) => {
					const state = diceStates[index];
					return (
						<motion.div
							key={category.key}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className={`rounded-xl border p-4 backdrop-blur-xl ${
								theme === "dark"
									? "border-white/20 bg-white/5"
									: "border-black/20 bg-black/5"
							}`}
						>
							<div className="mb-3 text-center text-xs font-mono uppercase tracking-wider opacity-60">
								{category.name}
							</div>

							{/* 3D Dice Container */}
							<div
								style={{
									perspective: "600px",
									perspectiveOrigin: "50% 50%",
								}}
								className="mx-auto h-24 w-24"
							>
								<motion.div
									className="relative h-full w-full"
									style={{
										transformStyle: "preserve-3d",
									}}
									animate={{
										rotateX: state.rotateX,
										rotateY: state.rotateY,
										rotateZ: state.rotateZ,
									}}
									transition={{
										duration: 1,
										ease: [0.34, 1.56, 0.64, 1],
									}}
								>
									{/* 6 Faces of the die */}
									{state.faces.map((face, faceIndex) => {
										const transforms = [
											"translateZ(48px)", // front
											"translateZ(-48px) rotateY(180deg)", // back
											"rotateY(90deg) translateZ(48px)", // right
											"rotateY(-90deg) translateZ(48px)", // left
											"rotateX(90deg) translateZ(48px)", // top
											"rotateX(-90deg) translateZ(48px)", // bottom
										];

										return (
											<div
												key={`${face}-${faceIndex + 1}`}
												className={`absolute flex h-full w-full items-center justify-center rounded-lg border backdrop-blur-xl ${
													theme === "dark"
														? "border-white/30 bg-white/10"
														: "border-black/30 bg-black/10"
												}`}
												style={{
													transform: transforms[faceIndex],
													backfaceVisibility: "hidden",
												}}
											>
												<div className="text-center px-1">
													<div className="text-xs font-bold leading-tight">
														{face}
													</div>
												</div>
											</div>
										);
									})}
								</motion.div>
							</div>

							{/* Result Display */}
							<div className="mt-3 min-h-[2rem] flex items-center justify-center">
								<AnimatePresence mode="wait">
									{state.result && !state.isRolling && (
										<motion.div
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.8 }}
											className="text-center"
										>
											<div
												className={`text-xs font-bold ${
													theme === "dark" ? "text-white" : "text-black"
												}`}
											>
												{state.result}
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</motion.div>
					);
				})}
			</div>

			{/* Roll Button */}
			<div className="mb-8 flex justify-center">
				<motion.button
					onClick={handleRollAll}
					disabled={isAnyRolling}
					className={`rounded-xl border px-8 py-3 font-mono text-sm tracking-wider backdrop-blur-xl transition-all ${
						theme === "dark"
							? "border-white/20 bg-white/5 text-white hover:bg-white/10"
							: "border-black/20 bg-black/5 text-black hover:bg-black/10"
					} disabled:opacity-50 disabled:cursor-not-allowed`}
					whileHover={{ scale: isAnyRolling ? 1 : 1.05 }}
					whileTap={{ scale: isAnyRolling ? 1 : 0.95 }}
				>
					{isAnyRolling ? "ROLLING..." : "ROLL ALL DICE"}
				</motion.button>
			</div>

			{/* Prompt Display */}
			<div className="space-y-4">
				{/* Generic Prompt */}
				<div
					className={`rounded-xl border p-6 backdrop-blur-xl ${
						theme === "dark"
							? "border-white/20 bg-white/5"
							: "border-black/20 bg-black/5"
					}`}
				>
					<div className="mb-2 text-xs font-mono uppercase tracking-wider opacity-60">
						Generic Prompt (Boring)
					</div>
					<div
						className={`font-mono text-sm ${
							theme === "dark" ? "text-white/70" : "text-black/70"
						}`}
					>
						{genericPrompt}
					</div>
				</div>

				{/* Filled Prompt */}
				<AnimatePresence>
					{allHaveResults && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className={`rounded-xl border p-6 backdrop-blur-xl ${
								theme === "dark"
									? "border-white/20 bg-white/10"
									: "border-black/20 bg-black/10"
							}`}
						>
							<div className="mb-2 flex items-center justify-between">
								<div className="text-xs font-mono uppercase tracking-wider opacity-60">
									Your Unique Prompt ✨
								</div>
								{showComparison && (
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										className="text-xl"
									>
										🎉
									</motion.div>
								)}
							</div>
							<div
								className={`font-mono text-sm leading-loose ${
									theme === "dark" ? "text-white" : "text-black"
								}`}
							>
								{filledPrompt.split(/(\[.*?\])/g).map((part, i) => {
									if (part.startsWith("[") && part.endsWith("]")) {
										const key = part
											.slice(1, -1)
											.toLowerCase()
											.replace(/_/g, "") as keyof typeof results;
										const value = results[key];
										return (
											<motion.span
												key={`${part}-${i + 1}`}
												initial={{ scale: 0.8, opacity: 0 }}
												animate={{ scale: 1, opacity: 1 }}
												transition={{ duration: 0.3, delay: i * 0.05 }}
												className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 font-bold text-white shadow-sm mx-0.5"
											>
												{value || part}
											</motion.span>
										);
									}
									return part;
								})}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Comparison Stats */}
			<AnimatePresence>
				{showComparison && allHaveResults && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className={`mt-6 rounded-xl border p-6 backdrop-blur-xl ${
							theme === "dark"
								? "border-white/20 bg-white/5"
								: "border-black/20 bg-black/5"
						}`}
					>
						<div className="grid grid-cols-2 gap-6 md:grid-cols-3">
							<div className="text-center">
								<div className="mb-1 text-2xl font-bold">
									{madLibsCategories.length}
								</div>
								<div className="text-xs opacity-60">Variables Added</div>
							</div>
							<div className="text-center">
								<div className="mb-1 text-2xl font-bold">
									{madLibsCategories
										.reduce(
											(acc, cat) => acc * diceCategories[cat.key].length,
											1,
										)
										.toLocaleString()}
								</div>
								<div className="text-xs opacity-60">Possible Combinations</div>
							</div>
							<div className="text-center col-span-2 md:col-span-1">
								<div className="mb-1 text-2xl font-bold">♾️</div>
								<div className="text-xs opacity-60">Creativity Unlocked</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Explanation */}
			<div
				className={`mt-6 text-center text-sm ${
					theme === "dark" ? "text-white/60" : "text-black/60"
				}`}
			>
				By adding just {madLibsCategories.length} random variables, you
				transform a generic prompt into something unique. With{" "}
				{madLibsCategories
					.reduce((acc, cat) => acc * diceCategories[cat.key].length, 1)
					.toLocaleString()}{" "}
				possible combinations, your images will never feel samey.
			</div>
		</div>
	);
}
