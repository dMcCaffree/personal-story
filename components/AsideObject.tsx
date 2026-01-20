"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import type { Aside } from "@/lib/story-config";
import { getAsideImageUrl } from "@/lib/story-config";
import { useImageCoverPosition } from "@/hooks/useImageCoverPosition";

interface AsideObjectProps {
	aside: Aside;
	sceneIndex: number;
	onClick: () => void;
	isActive: boolean;
}

export function AsideObject({
	aside,
	sceneIndex,
	onClick,
	isActive,
}: AsideObjectProps) {
	const [isHovered, setIsHovered] = useState(false);

	// Calculate position that accounts for object-cover cropping
	const calculatedPosition = useImageCoverPosition(
		aside.source.x,
		aside.source.y,
		aside.source.width,
		aside.source.height,
	);

	// Use calculated position (from source coords) or fallback to manual position
	const position = aside.position || calculatedPosition;

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
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			transition={{
				// Instant position/size changes (no animation on resize)
				top: { duration: 0 },
				left: { duration: 0 },
				width: { duration: 0 },
				height: { duration: 0 },
				// Spring animation for scale (hover/tap)
				scale: { type: "spring", stiffness: 400, damping: 25 },
			}}
		>
			{/* The clickable image */}
			<div className="relative w-full h-full">
				<Image
					src={getAsideImageUrl(sceneIndex, aside.id)}
					alt={aside.name}
					fill
					className="object-contain transition-all duration-200"
					unoptimized
					style={{
						filter: isHovered
							? "drop-shadow(0 0 10px rgba(255, 255, 255, 0.8)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.5)) brightness(1.1)"
							: isActive
								? "brightness(1.2)"
								: "brightness(1)",
					}}
				/>

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
