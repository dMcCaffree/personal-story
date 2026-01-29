"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";

export default function NotFound() {
	const router = useRouter();
	const { theme } = useTheme();

	// Floating particles animation - initialized once
	const [particles] = useState(() =>
		Array.from({ length: 20 }, (_, i) => ({
			id: i,
			x: Math.random() * 100,
			y: Math.random() * 100,
			size: Math.random() * 4 + 2,
			duration: Math.random() * 10 + 10,
			delay: Math.random() * 5,
		})),
	);

	return (
		<div
			className={`fixed inset-0 overflow-hidden transition-colors duration-300 ${
				theme === "dark" ? "bg-black" : "bg-white"
			}`}
		>
			{/* Animated background particles */}
			<div className="absolute inset-0 overflow-hidden">
				{particles.map((particle) => (
					<motion.div
						key={particle.id}
						className={`absolute rounded-full ${
							theme === "dark" ? "bg-white/40" : "bg-black/40"
						}`}
						style={{
							left: `${particle.x}%`,
							top: `${particle.y}%`,
							width: particle.size,
							height: particle.size,
						}}
						animate={{
							y: [0, -100, 0],
							opacity: [0, 0.6, 0],
						}}
						transition={{
							duration: particle.duration,
							repeat: Infinity,
							delay: particle.delay,
							ease: "easeInOut",
						}}
					/>
				))}
			</div>

			{/* Main content */}
			<div className="relative z-10 flex min-h-screen items-center justify-center px-4">
				<div className="w-full max-w-2xl text-center">
					{/* 404 Number with glass morphism */}
					<motion.div
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{
							duration: 0.8,
							ease: [0.16, 1, 0.3, 1],
						}}
						className="mb-8"
					>
						<div
							className={`inline-block rounded-3xl border backdrop-blur-xl ${
								theme === "dark"
									? "border-white/20 bg-white/5"
									: "border-black/20 bg-black/5"
							}`}
						>
							<motion.h1
								className={`px-12 py-8 font-mono text-9xl font-bold tracking-tighter ${
									theme === "dark" ? "text-white" : "text-black"
								}`}
								animate={{
									textShadow:
										theme === "dark"
											? [
													"0 0 20px rgba(255,255,255,0.1)",
													"0 0 40px rgba(255,255,255,0.2)",
													"0 0 20px rgba(255,255,255,0.1)",
												]
											: [
													"0 0 20px rgba(0,0,0,0.1)",
													"0 0 40px rgba(0,0,0,0.2)",
													"0 0 20px rgba(0,0,0,0.1)",
												],
								}}
								transition={{
									duration: 3,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							>
								404
							</motion.h1>
						</div>
					</motion.div>

					{/* Message */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							delay: 0.3,
							ease: "easeOut",
						}}
						className="mb-6"
					>
						<h2
							className={`mb-4 text-4xl font-bold tracking-tight ${
								theme === "dark" ? "text-white" : "text-black"
							}`}
						>
							Page Not Found
						</h2>
						<p
							className={`mx-auto max-w-md text-lg ${
								theme === "dark" ? "text-white/60" : "text-black/60"
							}`}
						>
							The page you&apos;re looking for seems to have wandered off into
							the void. Let&apos;s get you back on track.
						</p>
					</motion.div>

					{/* Action buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							delay: 0.5,
							ease: "easeOut",
						}}
						className="flex flex-col gap-4 sm:flex-row sm:justify-center"
					>
						<motion.button
							type="button"
							onClick={() => router.push("/")}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className={`group relative overflow-hidden rounded-xl border px-8 py-4 font-mono text-sm font-semibold tracking-wider backdrop-blur-xl transition-all ${
								theme === "dark"
									? "border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/20"
									: "border-black/20 bg-black/10 text-black hover:border-black/40 hover:bg-black/20"
							}`}
						>
							<span className="relative z-10">GO HOME</span>
							<motion.div
								className={`absolute inset-0 ${
									theme === "dark" ? "bg-white/10" : "bg-black/10"
								}`}
								initial={{ x: "-100%" }}
								whileHover={{ x: 0 }}
								transition={{ duration: 0.3 }}
							/>
						</motion.button>

						<motion.button
							type="button"
							onClick={() => router.back()}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							className={`group relative overflow-hidden rounded-xl border px-8 py-4 font-mono text-sm font-semibold tracking-wider backdrop-blur-xl transition-all ${
								theme === "dark"
									? "border-white/10 bg-white/5 text-white/80 hover:border-white/20 hover:bg-white/10 hover:text-white"
									: "border-black/10 bg-black/5 text-black/80 hover:border-black/20 hover:bg-black/10 hover:text-black"
							}`}
						>
							<span className="relative z-10">GO BACK</span>
							<motion.div
								className={`absolute inset-0 ${
									theme === "dark" ? "bg-white/5" : "bg-black/5"
								}`}
								initial={{ x: "-100%" }}
								whileHover={{ x: 0 }}
								transition={{ duration: 0.3 }}
							/>
						</motion.button>
					</motion.div>

					{/* Quick links */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							duration: 0.6,
							delay: 0.7,
							ease: "easeOut",
						}}
						className="mt-12"
					>
						<p
							className={`mb-4 font-mono text-xs tracking-wider ${
								theme === "dark" ? "text-white/40" : "text-black/40"
							}`}
						>
							OR EXPLORE
						</p>
						<div className="flex flex-wrap justify-center gap-3">
							{[
								{ label: "Blog", href: "/blog" },
								{ label: "Projects", href: "/projects" },
								{ label: "Story", href: "/story" },
							].map((link, index) => (
								<motion.button
									key={link.href}
									type="button"
									onClick={() => router.push(link.href)}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{
										duration: 0.3,
										delay: 0.8 + index * 0.1,
									}}
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									className={`rounded-full border px-6 py-2 font-mono text-xs tracking-wider backdrop-blur-xl transition-all ${
										theme === "dark"
											? "border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white"
											: "border-black/10 bg-black/5 text-black/60 hover:border-black/20 hover:bg-black/10 hover:text-black"
									}`}
								>
									{link.label}
								</motion.button>
							))}
						</div>
					</motion.div>
				</div>
			</div>

			{/* Gradient orbs for depth */}
			<motion.div
				className={`pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full blur-3xl ${
					theme === "dark" ? "bg-white/20" : "bg-black/20"
				}`}
				animate={{
					scale: [1, 1.2, 1],
					opacity: [0.2, 0.5, 0.3],
				}}
				transition={{
					duration: 8,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
			<motion.div
				className={`pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full blur-3xl ${
					theme === "dark" ? "bg-white/10" : "bg-black/10"
				}`}
				animate={{
					scale: [1.2, 1, 1.2],
					opacity: [0.5, 0.3, 0.5],
				}}
				transition={{
					duration: 8,
					repeat: Infinity,
					ease: "easeInOut",
				}}
			/>
		</div>
	);
}
