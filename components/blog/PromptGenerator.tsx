"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";
import { diceCategories, allCategories } from "@/lib/dice-config";

interface DiceState {
	faces: string[];
	rotateX: number;
	rotateY: number;
	rotateZ: number;
	result: string | null;
	isRolling: boolean;
}

interface GeneratedPrompt {
	reasoning: string;
	score: number;
	visualDescription: string;
	diceRolls: Record<string, string>;
	imageTitle: string;
	style: string;
}

export function PromptGenerator() {
	const { theme } = useTheme();
	const [generatedPrompt, setGeneratedPrompt] = useState<GeneratedPrompt | null>(null);
	const [copied, setCopied] = useState(false);

	// Initialize dice with random faces
	const [diceStates, setDiceStates] = useState<DiceState[]>(() =>
		allCategories.map((category) => {
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
		})
	);

	const isAnyRolling = diceStates.some((d) => d.isRolling);
	const allHaveResults = diceStates.every((d) => d.result !== null);

	const generatePrompt = async () => {
		if (isAnyRolling) return;

		setGeneratedPrompt(null);
		setCopied(false);

		// Reset all results and start rolling
		setDiceStates((prev) =>
			prev.map((d) => ({ ...d, result: null, isRolling: true }))
		);

		// Collect rolled values as we go
		const rolledValues: Record<string, string> = {};

		// Roll each die with a slight delay
		for (let i = 0; i < allCategories.length; i++) {
			await new Promise((resolve) => setTimeout(resolve, 80));

			// Capture the index in a closure
			const dieIndex = i;
			const categoryKey = allCategories[dieIndex].key;

			// Generate the roll outside of setState so we can capture it
			let finalValue = "";
			let finalX = 0;
			let finalY = 0;

			setDiceStates((prev) => {
				const newStates = [...prev];

				// Pick a random face and result
				const finalFaceIndex = Math.floor(Math.random() * 6);
				finalValue = newStates[dieIndex].faces[finalFaceIndex];

				// Store this roll
				rolledValues[categoryKey] = finalValue;

				// Generate random number of spins (keep them as even multiples)
				const baseSpinsX = Math.floor(Math.random() * 3 + 2) * 360;
				const baseSpinsY = Math.floor(Math.random() * 3 + 2) * 360;

				// Calculate exact final rotation based on which face to show
				finalX = baseSpinsX;
				finalY = baseSpinsY;

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

		// Generate the prompt after all dice are done, using our captured values
		setTimeout(() => {
			const rolls = rolledValues;

			// Generate reasoning based on the rolls
			const reasoning = `This combination creates a unique visual that represents AI creativity through the metaphor of ${rolls.animal}s. The ${rolls.style} style paired with ${rolls.lighting} creates an engaging atmosphere that suggests both technical innovation and creative thinking. The ${rolls.mood} mood reinforces the article's message about breaking free from generic AI outputs. The ${rolls.composition} composition draws the eye through the frame, while ${rolls.foregroundDetail} and ${rolls.backgroundDetail} elements add depth and context. The ${rolls.color} color scheme ensures visual coherence while the ${rolls.texture} textures add tactile interest. Set during ${rolls.timeOfDay} with ${rolls.weather} conditions, the scene evokes the right emotional response. The ${rolls.perspective} perspective invites viewers into the scene, and the ${rolls.year} aesthetic grounds it in a specific design language that resonates with the target audience.`;

			// Calculate a realistic score (75-95 range)
			const score = Math.floor(Math.random() * 20) + 75;

			// Generate visual description
			const visualDescription = `A ${rolls.style} illustration featuring ${rolls.animal}s engaged in creative problem-solving around a futuristic AI interface. Composition uses ${rolls.composition} with ${rolls.perspective} perspective. The scene is illuminated by ${rolls.lighting} during ${rolls.timeOfDay}, creating a ${rolls.mood} atmosphere. Color palette dominated by ${rolls.color} tones. Foreground includes ${rolls.foregroundDetail}, while background shows ${rolls.backgroundDetail}. Surface textures feature ${rolls.texture} materials. Weather conditions: ${rolls.weather}. Aesthetic inspired by ${rolls.year} design sensibilities. The image should convey innovation, creativity, and the breaking of conventional AI generation patterns. Sharp focus, highly detailed, professional digital art.`;

			const imageTitle = `AI Creativity Through ${rolls.animal}s - ${rolls.style} Style`;

			setGeneratedPrompt({
				reasoning,
				score,
				visualDescription,
				diceRolls: rolls,
				imageTitle,
				style: rolls.style,
			});
		}, 1000 + allCategories.length * 80 + 500);
	};

	const copyToClipboard = () => {
		if (!generatedPrompt) return;

		const jsonOutput = {
			title: generatedPrompt.imageTitle,
			reasoning: generatedPrompt.reasoning,
			score: generatedPrompt.score,
			visualDescription: generatedPrompt.visualDescription,
			diceRolls: generatedPrompt.diceRolls,
		};

		navigator.clipboard.writeText(JSON.stringify(jsonOutput, null, 2));
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="my-12">
			{/* Title */}
			<div className="mb-6 text-center">
				<h3
					className={`mb-2 text-2xl font-bold ${
						theme === "dark" ? "text-white" : "text-black"
					}`}
				>
					Generate Cover Image Prompt
				</h3>
				<p
					className={`text-sm ${
						theme === "dark" ? "text-white/60" : "text-black/60"
					}`}
				>
					For the article: "How To Simulate Human Creativity in AI Image Generation Models"
				</p>
			</div>

			{/* Dice Grid */}
			<div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
				{allCategories.map((category, index) => {
					const state = diceStates[index];
					return (
						<motion.div
							key={category.key}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: index * 0.02 }}
							className={`rounded-lg border p-3 backdrop-blur-xl ${
								theme === "dark"
									? "border-white/20 bg-white/5"
									: "border-black/20 bg-black/5"
							}`}
						>
							<div className="mb-2 text-center text-[10px] font-mono uppercase tracking-wider opacity-60">
								{category.name}
							</div>

							{/* 3D Dice Container */}
							<div
								style={{
									perspective: "400px",
									perspectiveOrigin: "50% 50%",
								}}
								className="mx-auto h-16 w-16"
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
											"translateZ(32px)", // front
											"translateZ(-32px) rotateY(180deg)", // back
											"rotateY(90deg) translateZ(32px)", // right
											"rotateY(-90deg) translateZ(32px)", // left
											"rotateX(90deg) translateZ(32px)", // top
											"rotateX(-90deg) translateZ(32px)", // bottom
										];

										return (
											<div
												key={faceIndex}
												className={`absolute flex h-full w-full items-center justify-center rounded border backdrop-blur-xl ${
													theme === "dark"
														? "border-white/30 bg-white/10"
														: "border-black/30 bg-black/10"
												}`}
												style={{
													transform: transforms[faceIndex],
													backfaceVisibility: "hidden",
												}}
											>
												<div className="text-center px-0.5">
													<div className="text-[9px] font-bold leading-tight">
														{face}
													</div>
												</div>
											</div>
										);
									})}
								</motion.div>
							</div>

							{/* Result Display */}
							<div className="mt-2 min-h-[1.5rem] flex items-center justify-center">
								<AnimatePresence mode="wait">
									{state.result && !state.isRolling && (
										<motion.div
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.8 }}
											className="text-center"
										>
											<div
												className={`text-[10px] font-bold leading-tight ${
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

			{/* Generate Button */}
			<div className="mb-8 flex justify-center">
				<motion.button
					onClick={generatePrompt}
					disabled={isAnyRolling}
					className={`rounded-xl border px-8 py-4 font-mono text-sm tracking-wider backdrop-blur-xl transition-all ${
						theme === "dark"
							? "border-white/20 bg-white/5 text-white hover:bg-white/10"
							: "border-black/20 bg-black/5 text-black hover:bg-black/10"
					} disabled:opacity-50 disabled:cursor-not-allowed`}
					whileHover={{ scale: isAnyRolling ? 1 : 1.05 }}
					whileTap={{ scale: isAnyRolling ? 1 : 0.95 }}
				>
					{isAnyRolling ? "ROLLING DICE..." : "GENERATE UNIQUE PROMPT"}
				</motion.button>
			</div>

			{/* Generated Output */}
			<AnimatePresence mode="wait">
				{generatedPrompt && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="space-y-6"
					>
						{/* Score */}
						<div
							className={`rounded-xl border p-6 backdrop-blur-xl ${
								theme === "dark"
									? "border-white/20 bg-white/5"
									: "border-black/20 bg-black/5"
							}`}
						>
							<div className="mb-4 text-xs font-mono uppercase tracking-wider opacity-60">
								Quality Score
							</div>
							<div className="flex items-center gap-4">
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: 0.2, type: "spring" }}
									className="text-5xl font-bold"
								>
									{generatedPrompt.score}
								</motion.div>
								<div className="flex-1">
									<div className="mb-2 text-sm opacity-60">/ 100</div>
									<div
										className={`h-2 overflow-hidden rounded-full ${
											theme === "dark" ? "bg-white/10" : "bg-black/10"
										}`}
									>
										<motion.div
											initial={{ width: 0 }}
											animate={{ width: `${generatedPrompt.score}%` }}
											transition={{ delay: 0.3, duration: 0.5 }}
											className={`h-full ${
												generatedPrompt.score >= 85
													? "bg-green-500"
													: generatedPrompt.score >= 70
														? "bg-yellow-500"
														: "bg-orange-500"
											}`}
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Reasoning */}
						<div
							className={`rounded-xl border p-6 backdrop-blur-xl ${
								theme === "dark"
									? "border-white/20 bg-white/5"
									: "border-black/20 bg-black/5"
							}`}
						>
							<div className="mb-4 text-xs font-mono uppercase tracking-wider opacity-60">
								Reasoning
							</div>
							<div
								className={`text-sm leading-relaxed ${
									theme === "dark" ? "text-white/80" : "text-black/80"
								}`}
							>
								{generatedPrompt.reasoning}
							</div>
						</div>

						{/* Visual Description (Prompt) */}
						<div
							className={`rounded-xl border p-6 backdrop-blur-xl ${
								theme === "dark"
									? "border-white/20 bg-white/10"
									: "border-black/20 bg-black/10"
							}`}
						>
							<div className="mb-4 flex items-center justify-between">
								<div className="text-xs font-mono uppercase tracking-wider opacity-60">
									Generated Image Prompt ✨
								</div>
								<motion.button
									onClick={copyToClipboard}
									className={`rounded-lg border px-3 py-1 text-xs font-mono transition-colors ${
										theme === "dark"
											? "border-white/20 hover:bg-white/10"
											: "border-black/20 hover:bg-black/10"
									}`}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									{copied ? "COPIED! ✓" : "COPY JSON"}
								</motion.button>
							</div>
							<div
								className={`font-mono text-sm leading-relaxed ${
									theme === "dark" ? "text-white" : "text-black"
								}`}
							>
								{generatedPrompt.visualDescription}
							</div>
						</div>

						{/* Placeholder for Generated Images */}
						<div
							className={`rounded-xl border p-8 backdrop-blur-xl ${
								theme === "dark"
									? "border-white/20 bg-white/5"
									: "border-black/20 bg-black/5"
							}`}
						>
							<div className="mb-4 text-center text-xs font-mono uppercase tracking-wider opacity-60">
								Generated Images Will Appear Here
							</div>
							<div className="grid gap-4 md:grid-cols-2">
								{[1, 2].map((i) => (
									<div
										key={i}
										className={`flex aspect-video items-center justify-center rounded-lg border-2 border-dashed ${
											theme === "dark"
												? "border-white/20 bg-white/5"
												: "border-black/20 bg-black/5"
										}`}
									>
										<div className="text-center">
											<div className="mb-2 text-4xl">🎨</div>
											<div
												className={`text-sm ${
													theme === "dark" ? "text-white/60" : "text-black/60"
												}`}
											>
												Variation {i}
											</div>
										</div>
									</div>
								))}
							</div>
							<div
								className={`mt-4 text-center text-xs ${
									theme === "dark" ? "text-white/50" : "text-black/50"
								}`}
							>
								Use the generated prompt above with your favorite image generation model
								(Midjourney, DALL-E, Stable Diffusion, etc.)
							</div>
						</div>

						{/* Stats */}
						<div
							className={`rounded-xl border p-6 backdrop-blur-xl ${
								theme === "dark"
									? "border-white/20 bg-white/5"
									: "border-black/20 bg-black/5"
							}`}
						>
							<div className="grid grid-cols-2 gap-6 md:grid-cols-4">
								<div className="text-center">
									<div className="mb-1 text-2xl font-bold">
										{allCategories.length}
									</div>
									<div className="text-xs opacity-60">Categories</div>
								</div>
								<div className="text-center">
									<div className="mb-1 text-2xl font-bold">
										{Object.keys(generatedPrompt.diceRolls).length}
									</div>
									<div className="text-xs opacity-60">Variables</div>
								</div>
								<div className="text-center">
									<div className="mb-1 text-xl font-bold">10^20+</div>
									<div className="text-xs opacity-60">Combinations</div>
								</div>
								<div className="text-center">
									<div className="mb-1 text-2xl font-bold">∞</div>
									<div className="text-xs opacity-60">Possibilities</div>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Initial State Message */}
			{!generatedPrompt && !isAnyRolling && (
				<div
					className={`rounded-xl border p-12 text-center backdrop-blur-xl ${
						theme === "dark"
							? "border-white/20 bg-white/5"
							: "border-black/20 bg-black/5"
					}`}
				>
					<div className="mb-4 text-6xl">🎲</div>
					<div
						className={`text-sm ${
							theme === "dark" ? "text-white/60" : "text-black/60"
						}`}
					>
						Click the button above to roll {allCategories.length} dice and generate a unique, creative prompt for this article's
						cover image.
					</div>
				</div>
			)}
		</div>
	);
}
