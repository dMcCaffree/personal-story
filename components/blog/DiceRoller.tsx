"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";
import { animalDie } from "@/lib/dice-config";

export function DiceRoller() {
	const { theme } = useTheme();
	const [currentValue, setCurrentValue] = useState<string | null>(null);
	const [isRolling, setIsRolling] = useState(false);
	const [rotateX, setRotateX] = useState(0);
	const [rotateY, setRotateY] = useState(0);
	const [rotateZ, setRotateZ] = useState(0);

	// Get 6 random animals for the dice faces
	const [diceFaces] = useState(() => {
		const faces = [];
		for (let i = 0; i < 6; i++) {
			faces.push(animalDie[Math.floor(Math.random() * animalDie.length)]);
		}
		return faces;
	});

	const handleRoll = () => {
		if (isRolling) return;

		setIsRolling(true);

		// Generate random final rotation (multiple full rotations + final face)
		const finalFaceIndex = Math.floor(Math.random() * 6);
		const finalValue = diceFaces[finalFaceIndex];

		// Generate random number of spins (keep them as even multiples)
		const baseSpinsX = Math.floor(Math.random() * 3 + 2) * 360;
		const baseSpinsY = Math.floor(Math.random() * 3 + 2) * 360;

		// Face rotations: EXACT rotations needed to show each face
		// These map directly to diceFaces[0] through diceFaces[5]
		let finalX = 0;
		let finalY = 0;

		if (finalFaceIndex === 0) {
			// Front face
			finalX = baseSpinsX;
			finalY = baseSpinsY;
		} else if (finalFaceIndex === 1) {
			// Back face
			finalX = baseSpinsX;
			finalY = baseSpinsY + 180;
		} else if (finalFaceIndex === 2) {
			// Right face
			finalX = baseSpinsX;
			finalY = baseSpinsY - 90;
		} else if (finalFaceIndex === 3) {
			// Left face
			finalX = baseSpinsX;
			finalY = baseSpinsY + 90;
		} else if (finalFaceIndex === 4) {
			// Top face
			finalX = baseSpinsX - 90;
			finalY = baseSpinsY;
		} else if (finalFaceIndex === 5) {
			// Bottom face
			finalX = baseSpinsX + 90;
			finalY = baseSpinsY;
		}

		setRotateX(finalX);
		setRotateY(finalY);
		setRotateZ(0);

		setTimeout(() => {
			setCurrentValue(finalValue);
			setIsRolling(false);
		}, 1000);
	};

	return (
		<div className="my-12 flex flex-col items-center gap-8">
			{/* 3D Perspective Container */}
			<div
				style={{
					perspective: "1000px",
					perspectiveOrigin: "50% 50%",
				}}
				className="h-48 w-48"
			>
				{/* 3D Dice */}
				<motion.div
					className="relative h-full w-full"
					style={{
						transformStyle: "preserve-3d",
					}}
					animate={{
						rotateX: rotateX,
						rotateY: rotateY,
						rotateZ: rotateZ,
					}}
					transition={{
						duration: 1,
						ease: [0.34, 1.56, 0.64, 1], // Bouncy easing
					}}
				>
					{/* Front Face */}
					<div
						className={`absolute flex h-full w-full items-center justify-center rounded-xl border backdrop-blur-xl ${
							theme === "dark"
								? "border-white/30 bg-white/10"
								: "border-black/30 bg-black/10"
						}`}
						style={{
							transform: "translateZ(96px)",
						}}
					>
						<div className="text-center">
							<div className="text-3xl font-bold">{diceFaces[0]}</div>
						</div>
					</div>

					{/* Back Face */}
					<div
						className={`absolute flex h-full w-full items-center justify-center rounded-xl border backdrop-blur-xl ${
							theme === "dark"
								? "border-white/30 bg-white/10"
								: "border-black/30 bg-black/10"
						}`}
						style={{
							transform: "translateZ(-96px) rotateY(180deg)",
						}}
					>
						<div className="text-center">
							<div className="text-3xl font-bold">{diceFaces[1]}</div>
						</div>
					</div>

					{/* Right Face */}
					<div
						className={`absolute flex h-full w-full items-center justify-center rounded-xl border backdrop-blur-xl ${
							theme === "dark"
								? "border-white/30 bg-white/10"
								: "border-black/30 bg-black/10"
						}`}
						style={{
							transform: "rotateY(90deg) translateZ(96px)",
						}}
					>
						<div className="text-center">
							<div className="text-3xl font-bold">{diceFaces[2]}</div>
						</div>
					</div>

					{/* Left Face */}
					<div
						className={`absolute flex h-full w-full items-center justify-center rounded-xl border backdrop-blur-xl ${
							theme === "dark"
								? "border-white/30 bg-white/10"
								: "border-black/30 bg-black/10"
						}`}
						style={{
							transform: "rotateY(-90deg) translateZ(96px)",
						}}
					>
						<div className="text-center">
							<div className="text-3xl font-bold">{diceFaces[3]}</div>
						</div>
					</div>

					{/* Top Face */}
					<div
						className={`absolute flex h-full w-full items-center justify-center rounded-xl border backdrop-blur-xl ${
							theme === "dark"
								? "border-white/30 bg-white/10"
								: "border-black/30 bg-black/10"
						}`}
						style={{
							transform: "rotateX(90deg) translateZ(96px)",
						}}
					>
						<div className="text-center">
							<div className="text-3xl font-bold">{diceFaces[4]}</div>
						</div>
					</div>

					{/* Bottom Face */}
					<div
						className={`absolute flex h-full w-full items-center justify-center rounded-xl border backdrop-blur-xl ${
							theme === "dark"
								? "border-white/30 bg-white/10"
								: "border-black/30 bg-black/10"
						}`}
						style={{
							transform: "rotateX(-90deg) translateZ(96px)",
						}}
					>
						<div className="text-center">
							<div className="text-3xl font-bold">{diceFaces[5]}</div>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Roll Button */}
			<motion.button
				onClick={handleRoll}
				disabled={isRolling}
				className={`rounded-xl border px-8 py-3 font-mono text-sm tracking-wider backdrop-blur-xl transition-all ${
					theme === "dark"
						? "border-white/20 bg-white/5 text-white hover:bg-white/10"
						: "border-black/20 bg-black/5 text-black hover:bg-black/10"
				} disabled:opacity-50 disabled:cursor-not-allowed`}
				whileHover={{ scale: isRolling ? 1 : 1.05 }}
				whileTap={{ scale: isRolling ? 1 : 0.95 }}
			>
				{isRolling ? "ROLLING..." : "ROLL THE DIE"}
			</motion.button>

			{/* Result Display */}
			{currentValue && !isRolling && (
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className={`rounded-xl border px-6 py-3 backdrop-blur-xl ${
						theme === "dark"
							? "border-white/20 bg-white/5 text-white"
							: "border-black/20 bg-black/5 text-black"
					}`}
				>
					<div className="text-center">
						<div className="text-sm opacity-60">Your character will be</div>
						<div className="mt-1 font-mono text-lg font-bold">{currentValue}</div>
					</div>
				</motion.div>
			)}

			{/* Explanation */}
			<div
				className={`max-w-md text-center text-sm ${
					theme === "dark" ? "text-white/60" : "text-black/60"
				}`}
			>
				Try rolling the die to see how a simple random element can add uniqueness to your image prompts. Each roll gives you a different animal to feature in your scene.
			</div>
		</div>
	);
}

