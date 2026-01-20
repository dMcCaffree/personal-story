"use client";

import { motion } from "motion/react";

interface OnboardingCalloutProps {
	title: string;
	description: string;
	position: {
		top?: string;
		bottom?: string;
		left?: string;
		right?: string;
		transform?: string;
	};
	step: number;
	totalSteps: number;
	onNext: () => void;
	onSkip: () => void;
}

export function OnboardingCallout({
	title,
	description,
	position,
	step,
	totalSteps,
	onNext,
	onSkip,
}: OnboardingCalloutProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{
				type: "spring",
				stiffness: 300,
				damping: 30,
				mass: 0.8,
			}}
			className="fixed z-61 pointer-events-auto"
			style={position}
		>
			<div
				className="relative flex flex-col gap-4 px-6 py-5 rounded-2xl border border-white/20 max-w-sm"
				style={{
					background: "rgba(0, 0, 0, 0.4)",
					backdropFilter: "blur(40px)",
					WebkitBackdropFilter: "blur(40px)",
					boxShadow:
						"0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)",
				}}
			>
				{/* Step counter */}
				<div className="text-xs font-medium text-white/60">
					Step {step} of {totalSteps}
				</div>

				{/* Title */}
				<h3 className="text-xl font-semibold text-white">{title}</h3>

				{/* Description */}
				<p className="text-sm text-white/80 leading-relaxed">{description}</p>

				{/* Buttons */}
				<div className="flex items-center justify-between gap-4 pt-2">
					<button
						type="button"
						onClick={onSkip}
						className="text-sm text-white/60 hover:text-white/90 transition-colors"
					>
						Skip tutorial
					</button>

					<motion.button
						type="button"
						onClick={onNext}
						className="px-5 py-2 rounded-lg bg-white text-black font-medium text-sm"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						transition={{ type: "spring", stiffness: 400, damping: 25 }}
					>
						{step === totalSteps ? "Get Started" : "Next"}
					</motion.button>
				</div>
			</div>
		</motion.div>
	);
}

