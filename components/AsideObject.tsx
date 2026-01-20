"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import type { Aside } from "@/lib/story-config";
import { getAsideImageUrl } from "@/lib/story-config";
import { useImageCoverPosition } from "@/hooks/useImageCoverPosition";
import { useStory } from "@/contexts/StoryContext";

interface AsideObjectProps {
	aside: Aside;
	sceneIndex: number;
	onClick: () => void;
	isActive: boolean;
	asideIndex: number; // For staggering the shine effect
}

export function AsideObject({
	aside,
	sceneIndex,
	onClick,
	isActive,
	asideIndex,
}: AsideObjectProps) {
	const [isHovered, setIsHovered] = useState(false);
	const [isShining, setIsShining] = useState(false);
	const { showHints } = useStory();

	// Calculate position that accounts for object-cover cropping
	const calculatedPosition = useImageCoverPosition(
		aside.source.x,
		aside.source.y,
		aside.source.width,
		aside.source.height,
	);

	// Use calculated position (from source coords) or fallback to manual position
	const position = aside.position || calculatedPosition;

	// Determine if shadow should show
	const shouldShowShadow = isHovered || showHints || isShining;

	return (
		<motion.button
			type="button"
			onClick={onClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className="absolute cursor-pointer"
			initial={false}
			animate={{
				top: position.top,
				left: position.left,
				width: position.width,
				height: position.height,
			}}
			transition={{
				// Instant position/size changes (no animation on resize)
				top: { duration: 0 },
				left: { duration: 0 },
				width: { duration: 0 },
				height: { duration: 0 },
			}}
			style={{ zIndex: aside.zIndex ?? 1 }}
		>
			{/* The clickable image */}
			<div className="relative w-full h-full">
				<Image
					src={getAsideImageUrl(sceneIndex, aside.id)}
					alt={aside.name}
					fill
					className="object-contain transition-all duration-300"
					unoptimized
					style={{
						filter: shouldShowShadow
							? "drop-shadow(1px 1px 0 rgba(255, 255, 255, 1)) drop-shadow(-1px -1px 0 rgba(255, 255, 255, 1)) drop-shadow(1px -1px 0 rgba(255, 255, 255, 1)) drop-shadow(-1px 1px 0 rgba(255, 255, 255, 1)) brightness(1.4)"
							: isActive
								? "brightness(1.4)"
								: "brightness(1)",
					}}
				/>

				{/* Animated shine effect overlay */}
				{isShining && (
					<motion.div
						className="absolute inset-0 pointer-events-none overflow-hidden"
						initial={{ opacity: 0 }}
						animate={{ opacity: [0, 1, 0] }}
						transition={{ duration: 1.5, times: [0, 0.5, 1] }}
					>
						<motion.div
							className="absolute inset-0"
							style={{
								background:
									"linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
								width: "50%",
							}}
							initial={{ x: "-100%" }}
							animate={{ x: "300%" }}
							transition={{ duration: 1.5, ease: "easeInOut" }}
						/>
					</motion.div>
				)}

				{/* Active indicator */}
				{isActive && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"
						style={{
							boxShadow: "0 0 10px rgba(59, 130, 246, 0.8)",
						}}
					/>
				)}
			</div>
		</motion.button>
	);
}
