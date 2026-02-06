"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

type Variant = "hero" | "inline";

// Pre-compute random values outside the component to keep renders pure
const CONFETTI_SEEDS = Array.from({ length: 24 }, (_, i) => ({
	distanceSeed: (((i * 7 + 3) * 13) % 80),
	sizeSeed: (((i * 11 + 5) * 17) % 40) / 10,
	rotationSeed: (((i * 19 + 7) * 23) % 360),
	delaySeed: (((i * 31 + 11) * 37) % 15) / 100,
}));

function Confetti({ theme }: { theme: string }) {
	const particles = CONFETTI_SEEDS.map((seed, i) => {
		const angle = (i / 24) * 360;
		const distance = 60 + seed.distanceSeed;
		const x = Math.cos((angle * Math.PI) / 180) * distance;
		const y = Math.sin((angle * Math.PI) / 180) * distance;
		const colors =
			theme === "dark"
				? ["#8B5CF6", "#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#06B6D4"]
				: ["#7C3AED", "#2563EB", "#059669", "#D97706", "#DB2777", "#0891B2"];
		const color = colors[i % colors.length];
		const size = 3 + seed.sizeSeed;
		const rotation = seed.rotationSeed;

		return { x, y, color, size, rotation, delay: seed.delaySeed };
	});

	return (
		<div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
			{particles.map((p, i) => (
				<motion.div
					key={`confetti-${i}-${p.color}`}
					initial={{
						x: 0,
						y: 0,
						scale: 0,
						opacity: 1,
						rotate: 0,
					}}
					animate={{
						x: p.x,
						y: p.y,
						scale: [0, 1.2, 0.8],
						opacity: [1, 1, 0],
						rotate: p.rotation + 180,
					}}
					transition={{
						duration: 0.8,
						delay: p.delay,
						ease: [0.16, 1, 0.3, 1],
					}}
					className="absolute rounded-full"
					style={{
						width: p.size,
						height: p.size,
						backgroundColor: p.color,
					}}
				/>
			))}
		</div>
	);
}

function SuccessCheckmark({ theme }: { theme: string }) {
	return (
		<motion.div
			initial={{ scale: 0, rotate: -45 }}
			animate={{ scale: 1, rotate: 0 }}
			transition={{
				type: "spring",
				stiffness: 300,
				damping: 15,
				delay: 0.1,
			}}
			className="relative mx-auto mb-4"
		>
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: [0, 1.3, 1] }}
				transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
				className={`flex h-14 w-14 items-center justify-center rounded-full ${
					theme === "dark" ? "bg-emerald-500/20" : "bg-emerald-100"
				}`}
			>
				<motion.svg
					width="28"
					height="28"
					viewBox="0 0 24 24"
					fill="none"
					role="img"
					aria-label="Success checkmark"
					initial={{ pathLength: 0, opacity: 0 }}
					animate={{ pathLength: 1, opacity: 1 }}
					transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
				>
					<title>Success checkmark</title>
					<motion.path
						d="M5 13l4 4L19 7"
						stroke={theme === "dark" ? "#34D399" : "#059669"}
						strokeWidth="2.5"
						strokeLinecap="round"
						strokeLinejoin="round"
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
					/>
				</motion.svg>
			</motion.div>

			{/* Glow ring */}
			<motion.div
				initial={{ scale: 0.5, opacity: 0.8 }}
				animate={{ scale: 2.5, opacity: 0 }}
				transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
				className={`absolute inset-0 rounded-full ${
					theme === "dark"
						? "bg-emerald-400/20"
						: "bg-emerald-400/15"
				}`}
			/>
		</motion.div>
	);
}

function LoadingDots() {
	return (
		<span className="inline-flex gap-0.5">
			{[0, 1, 2].map((i) => (
				<motion.span
					key={`dot-${i}`}
					initial={{ opacity: 0.3, y: 0 }}
					animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
					transition={{
						duration: 0.6,
						repeat: Number.POSITIVE_INFINITY,
						delay: i * 0.15,
					}}
					className="inline-block h-1 w-1 rounded-full bg-current"
				/>
			))}
		</span>
	);
}

export function EmailSignup({ variant = "inline" }: { variant?: Variant }) {
	const { theme } = useTheme();
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [errorMessage, setErrorMessage] = useState("");
	const [showConfetti, setShowConfetti] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !email.includes("@")) return;

		setStatus("loading");
		setErrorMessage("");

		try {
			const response = await fetch("/api/subscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Something went wrong");
			}

			setShowConfetti(true);
			setStatus("success");
			setEmail("");

			// Clean up confetti after animation
			setTimeout(() => setShowConfetti(false), 1500);
		} catch (err: unknown) {
			setStatus("error");
			setErrorMessage(
				err instanceof Error ? err.message : "Something went wrong. Please try again.",
			);
			// Reset error state after a few seconds
			setTimeout(() => {
				setStatus("idle");
				setErrorMessage("");
			}, 4000);
		}
	};

	const isHero = variant === "hero";

	return (
		<div
			className={`relative overflow-hidden rounded-xl border backdrop-blur-xl ${
				isHero ? "p-8" : "p-6"
			} ${
				theme === "dark"
					? "border-white/15 bg-white/5"
					: "border-black/15 bg-black/3"
			}`}
		>
			{/* Confetti burst on success */}
			<AnimatePresence>
				{showConfetti && <Confetti theme={theme} />}
			</AnimatePresence>

			<AnimatePresence mode="wait">
				{status === "success" ? (
					<motion.div
						key="success"
						initial={{ opacity: 0, filter: "blur(12px)", scale: 0.95 }}
						animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
						exit={{ opacity: 0, filter: "blur(12px)", scale: 0.95 }}
						transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
						className={`relative text-center ${isHero ? "py-6" : "py-4"}`}
					>
						<SuccessCheckmark theme={theme} />

						<motion.div
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.35, duration: 0.4 }}
							className={`${isHero ? "text-2xl" : "text-xl"} font-bold ${
								theme === "dark" ? "text-white" : "text-black"
							}`}
						>
							You&apos;re in.
						</motion.div>

						<motion.p
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.45, duration: 0.4 }}
							className={`mt-2 text-sm ${
								theme === "dark" ? "text-white/50" : "text-black/50"
							}`}
						>
							Check your inbox for a welcome email. New posts drop as I write them.
						</motion.p>

						<motion.div
							initial={{ scaleX: 0 }}
							animate={{ scaleX: 1 }}
							transition={{ delay: 0.55, duration: 0.6, ease: "easeOut" }}
							className={`mx-auto mt-4 h-px w-16 origin-center ${
								theme === "dark" ? "bg-emerald-400/30" : "bg-emerald-600/20"
							}`}
						/>
					</motion.div>
				) : (
					<motion.div
						key="form"
						initial={{ opacity: 0, filter: "blur(10px)" }}
						animate={{ opacity: 1, filter: "blur(0px)" }}
						exit={{ opacity: 0, filter: "blur(10px)" }}
						transition={{ duration: 0.4, ease: "easeInOut" }}
					>
						<div className={isHero ? "mb-4" : "mb-3"}>
							<h3
								className={`${isHero ? "text-xl" : "text-base"} font-bold ${
									theme === "dark" ? "text-white" : "text-black"
								}`}
							>
								{isHero
									? "Get new posts straight to your inbox"
									: "Enjoyed this? Get the next one."}
							</h3>
							<p
								className={`mt-1 ${isHero ? "text-sm" : "text-xs"} ${
									theme === "dark" ? "text-white/50" : "text-black/50"
								}`}
							>
								{isHero
									? "I write about building products, engineering decisions, and the tools I use. No spam, unsubscribe anytime."
									: "New posts on building, engineering, and tools. No spam."}
							</p>
						</div>

						<form
							onSubmit={handleSubmit}
							className="flex flex-col gap-2 sm:flex-row"
						>
							<input
								ref={inputRef}
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="you@email.com"
								required
								disabled={status === "loading"}
								className={`flex-1 rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors placeholder:opacity-40 disabled:opacity-50 ${
									status === "error"
										? theme === "dark"
											? "border-red-500/40 bg-red-500/5 text-white"
											: "border-red-500/40 bg-red-50 text-black"
										: theme === "dark"
											? "border-white/15 bg-white/5 text-white focus:border-white/30"
											: "border-black/15 bg-black/3 text-black focus:border-black/30"
								}`}
							/>
							<motion.button
								type="submit"
								disabled={status === "loading"}
								whileTap={status !== "loading" ? { scale: 0.97 } : undefined}
								className={`shrink-0 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
									status === "loading"
										? "cursor-wait"
										: "hover:opacity-90"
								} ${
									theme === "dark"
										? "bg-white text-black"
										: "bg-black text-white"
								}`}
							>
								{status === "loading" ? <LoadingDots /> : "Subscribe"}
							</motion.button>
						</form>

						{/* Error message */}
						<AnimatePresence>
							{status === "error" && errorMessage && (
								<motion.p
									initial={{ opacity: 0, height: 0, marginTop: 0 }}
									animate={{ opacity: 1, height: "auto", marginTop: 8 }}
									exit={{ opacity: 0, height: 0, marginTop: 0 }}
									className={`overflow-hidden text-xs font-medium ${
										theme === "dark" ? "text-red-400" : "text-red-600"
									}`}
								>
									{errorMessage}
								</motion.p>
							)}
						</AnimatePresence>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
