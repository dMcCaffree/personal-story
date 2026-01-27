"use client";

import { motion } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

interface TitleMenuItemProps {
	label: string;
	isSelected: boolean;
	onClick: () => void;
	onMouseEnter: () => void;
}

export function TitleMenuItem({
	label,
	isSelected,
	onClick,
	onMouseEnter,
}: TitleMenuItemProps) {
	const { theme } = useTheme();

	const glassStyle = {
		background:
			theme === "dark" ? "rgba(0, 0, 0, 0.4)" : "rgba(255, 255, 255, 0.4)",
		backdropFilter: "blur(40px)",
		WebkitBackdropFilter: "blur(40px)",
		boxShadow:
			theme === "dark"
				? "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)"
				: "0 8px 32px 0 rgba(0, 0, 0, 0.1), inset 0 1px 1px 0 rgba(255, 255, 255, 0.5)",
	};

	return (
		<motion.button
			type="button"
			onClick={onClick}
			onMouseEnter={onMouseEnter}
			className={`relative px-12 py-4 rounded-2xl border transition-colors ${
				theme === "dark" ? "border-white/20" : "border-black/20"
			}`}
			style={isSelected ? glassStyle : {}}
			animate={{
				scale: isSelected ? 1.1 : 1,
			}}
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.95 }}
			transition={{
				type: "spring",
				stiffness: 500,
				damping: 30,
				mass: 0.5,
			}}
		>
			<span
				className={`text-base font-mono tracking-wider ${
					theme === "dark" ? "text-white" : "text-black"
				} ${isSelected ? "font-semibold" : ""}`}
			>
				{label}
			</span>
		</motion.button>
	);
}

