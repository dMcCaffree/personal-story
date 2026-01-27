"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThoughtsPage() {
	const router = useRouter();
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
		<div
			className={`fixed inset-0 transition-colors duration-300 ${
				theme === "dark"
					? "bg-gradient-to-br from-black via-gray-900 to-black"
					: "bg-gradient-to-br from-white via-gray-50 to-white"
			}`}
		>
			<div className="flex h-full w-full flex-col items-center justify-center gap-8 p-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.6,
						ease: "easeOut",
					}}
					className={`rounded-2xl border p-12 text-center ${
						theme === "dark" ? "border-white/20" : "border-black/20"
					}`}
					style={glassStyle}
				>
					<h1
						className={`mb-4 text-4xl font-bold ${
							theme === "dark" ? "text-white" : "text-black"
						}`}
					>
						THOUGHTS
					</h1>
					<p
						className={`mb-8 text-lg ${
							theme === "dark" ? "text-white/70" : "text-black/70"
						}`}
					>
						Coming Soon
					</p>
					<motion.button
						type="button"
						onClick={() => router.push("/")}
						className={`rounded-xl border px-8 py-3 font-mono text-sm tracking-wider transition-colors ${
							theme === "dark"
								? "border-white/20 hover:bg-white/10 text-white"
								: "border-black/20 hover:bg-black/10 text-black"
						}`}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						transition={{
							type: "spring",
							stiffness: 500,
							damping: 30,
							mass: 0.5,
						}}
					>
						BACK TO MENU
					</motion.button>
				</motion.div>
			</div>
		</div>
	);
}

