"use client";

import { motion } from "motion/react";

interface HighlightRect {
	top: number;
	left: number;
	width: number;
	height: number;
	borderRadius?: number;
}

interface OnboardingSpotlightProps {
	highlightRects: HighlightRect[];
}

export function OnboardingSpotlight({ highlightRects }: OnboardingSpotlightProps) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.3 }}
			className="fixed inset-0 z-60 pointer-events-none"
		>
			{/* Dark overlay using SVG mask */}
			<svg
				width="100%"
				height="100%"
				className="absolute inset-0"
				style={{ pointerEvents: "none" }}
			>
				<defs>
					<mask id="spotlight-mask">
						{/* White background - everything is covered */}
						<rect x="0" y="0" width="100%" height="100%" fill="white" />
						
						{/* Black cutouts - these areas will be transparent */}
						{highlightRects.map((rect, index) => (
							<rect
								key={index}
								x={rect.left}
								y={rect.top}
								width={rect.width}
								height={rect.height}
								rx={rect.borderRadius || 16}
								ry={rect.borderRadius || 16}
								fill="black"
							/>
						))}
					</mask>
				</defs>

				{/* Dark overlay with mask applied */}
				<rect
					x="0"
					y="0"
					width="100%"
					height="100%"
					fill="rgba(0, 0, 0, 0.7)"
					mask="url(#spotlight-mask)"
				/>
			</svg>

			{/* Highlight borders for visual emphasis */}
			{highlightRects.map((rect, index) => (
				<motion.div
					key={index}
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.1, duration: 0.3 }}
					className="absolute pointer-events-none"
					style={{
						top: rect.top,
						left: rect.left,
						width: rect.width,
						height: rect.height,
						borderRadius: rect.borderRadius || 16,
						border: "2px solid rgba(255, 255, 255, 0.3)",
						boxShadow: "0 0 20px rgba(255, 255, 255, 0.2)",
					}}
				/>
			))}
		</motion.div>
	);
}

