"use client";

import { motion } from "motion/react";

interface InitialPlayButtonProps {
	onPlay: () => void;
}

export function InitialPlayButton({ onPlay }: InitialPlayButtonProps) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.4 }}
			onClick={onPlay}
			whileTap={{ scale: 0.98 }}
			className="fixed inset-0 z-70 flex items-center justify-center bg-black/30 backdrop-blur-sm cursor-pointer"
			style={{ pointerEvents: "auto" }}
		>
			<motion.div
				className="flex flex-col items-center gap-6 pointer-events-none"
				whileHover={{ scale: 1.05 }}
				transition={{ type: "spring", stiffness: 400, damping: 25 }}
			>
				{/* Play button - visual only */}
				<motion.div
					className="group relative"
					initial={{ scale: 0.9, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{
						type: "spring",
						stiffness: 200,
						damping: 20,
						delay: 0.1,
					}}
				>
					{/* Outer pulsing rings */}
					<motion.div
						className="absolute inset-0 rounded-full"
						style={{
							border: "2px solid rgba(255, 255, 255, 0.3)",
						}}
						animate={{
							scale: [1, 1.3],
							opacity: [0.5, 0],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "easeOut",
						}}
					/>
					<motion.div
						className="absolute inset-0 rounded-full"
						style={{
							border: "2px solid rgba(255, 255, 255, 0.3)",
						}}
						animate={{
							scale: [1, 1.3],
							opacity: [0.5, 0],
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: "easeOut",
							delay: 1,
						}}
					/>

					{/* Main glass button */}
					<div
						className="relative flex h-28 w-28 items-center justify-center rounded-full"
						style={{
							background:
								"linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
							backdropFilter: "blur(20px)",
							WebkitBackdropFilter: "blur(20px)",
							border: "1px solid rgba(255, 255, 255, 0.2)",
							boxShadow:
								"0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 2px 0 rgba(255, 255, 255, 0.2)",
						}}
					>
						{/* Play icon */}
						<svg
							className="relative z-10 h-11 w-11 translate-x-0.5 text-white drop-shadow-lg"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M8 5v14l11-7z" />
						</svg>
					</div>
				</motion.div>

				{/* Text below button */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.4 }}
					className="text-center"
				>
					<div className="text-base font-medium text-white drop-shadow-lg">
						Click anywhere to begin
					</div>
				</motion.div>
			</motion.div>
		</motion.div>
	);
}

