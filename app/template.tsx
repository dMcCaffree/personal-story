"use client";

import { motion } from "motion/react";

const pageVariants = {
	initial: {
		opacity: 0,
		scale: 0.98,
		filter: "blur(10px)",
	},
	enter: {
		opacity: 1,
		scale: 1,
		filter: "blur(0px)",
	},
};

export default function Template({ children }: { children: React.ReactNode }) {
	return (
		<motion.div
			initial="initial"
			animate="enter"
			variants={pageVariants}
			transition={{
				duration: 0.5,
				ease: [0.43, 0.13, 0.23, 0.96],
			}}
			className="h-full w-full"
		>
			{children}
		</motion.div>
	);
}

