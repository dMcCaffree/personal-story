"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { getKeyframeUrl } from "@/lib/story-config";

interface CrossFadeTransitionProps {
	fromSceneIndex: number;
	toSceneIndex: number;
	isPlaying: boolean;
	onTransitionStart?: () => void;
	onTransitionEnd?: () => void;
}

export function CrossFadeTransition({
	fromSceneIndex,
	toSceneIndex,
	isPlaying,
	onTransitionStart,
	onTransitionEnd,
}: CrossFadeTransitionProps) {
	useEffect(() => {
		if (!isPlaying) {
			return;
		}

		console.log("CrossFadeTransition: Starting", {
			from: fromSceneIndex,
			to: toSceneIndex,
		});

		onTransitionStart?.();

		// Duration: 600ms for a snappy but smooth cross-fade
		const timer = setTimeout(() => {
			console.log("CrossFadeTransition: Complete");
			onTransitionEnd?.();
		}, 600);

		return () => clearTimeout(timer);
	}, [isPlaying, fromSceneIndex, toSceneIndex, onTransitionStart, onTransitionEnd]);

	if (!isPlaying) return null;

	return (
		<motion.div
			key={`${fromSceneIndex}-${toSceneIndex}`}
			initial={{ opacity: 1 }}
			animate={{ opacity: 0 }}
			transition={{
				duration: 0.6,
				ease: [0.4, 0, 0.2, 1], // Cubic bezier for smooth easing
			}}
			className="fixed inset-0 z-30"
			style={{ pointerEvents: "none" }}
		>
			{/* Show the "from" scene image that fades out */}
			<Image
				src={getKeyframeUrl(fromSceneIndex)}
				alt=""
				fill
				className="object-cover"
				unoptimized
				priority
			/>
		</motion.div>
	);
}

