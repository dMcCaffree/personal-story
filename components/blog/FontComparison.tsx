"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

const fontPairs = [
	{
		name: "The Default",
		heading: "Inter",
		body: "Inter",
		personality: "Safe, clean, forgettable",
		css: {
			heading: { fontFamily: "var(--font-inter)" },
			body: { fontFamily: "var(--font-inter)" },
		},
	},
	{
		name: "The Technical",
		heading: "JetBrains Mono",
		body: "IBM Plex Mono",
		personality: "Precise, developer-focused, modern",
		css: {
			heading: { fontFamily: "var(--font-jetbrains-mono)" },
			body: { fontFamily: "var(--font-ibm-plex-mono)" },
		},
	},
	{
		name: "The Elegant",
		heading: "Playfair Display",
		body: "Source Sans Pro",
		personality: "Sophisticated, editorial, timeless",
		css: {
			heading: { fontFamily: "var(--font-playfair-display)" },
			body: { fontFamily: "var(--font-source-sans)" },
		},
	},
	{
		name: "The Bold",
		heading: "Space Grotesk",
		body: "Inter",
		personality: "Confident, startup energy, geometric",
		css: {
			heading: { fontFamily: "var(--font-space-grotesk)" },
			body: { fontFamily: "var(--font-inter)" },
		},
	},
	{
		name: "The Playful",
		heading: "Outfit",
		body: "DM Sans",
		personality: "Friendly, approachable, contemporary",
		css: {
			heading: { fontFamily: "var(--font-outfit)" },
			body: { fontFamily: "var(--font-dm-sans)" },
		},
	},
];

export function FontComparison() {
	const { theme } = useTheme();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const selected = fontPairs[selectedIndex];

	return (
		<div className="my-12">
			{/* Font selector buttons */}
			<div className="mb-6 flex flex-wrap gap-2">
				{fontPairs.map((pair) => (
					<button
						key={pair.name}
						type="button"
						onClick={() => setSelectedIndex(fontPairs.indexOf(pair))}
						className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
							selectedIndex === fontPairs.indexOf(pair)
								? theme === "dark"
									? "border-white/40 bg-white/10 text-white"
									: "border-black/40 bg-black/10 text-black"
								: theme === "dark"
									? "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
									: "border-black/20 bg-black/5 text-black/70 hover:bg-black/10"
						}`}
					>
						{pair.name}
					</button>
				))}
			</div>

			{/* Font preview */}
			<div className="relative">
				<AnimatePresence initial={false}>
					<motion.div
						key={selectedIndex}
						initial={{
							opacity: 0,
							filter: "blur(10px)",
							position: "absolute",
							inset: 0,
						}}
						animate={{ opacity: 1, filter: "blur(0px)", position: "relative" }}
						exit={{
							opacity: 0,
							filter: "blur(10px)",
							position: "absolute",
							inset: 0,
						}}
						transition={{ duration: 0.5, ease: "easeInOut" }}
						className={`rounded-xl border backdrop-blur-xl p-8 ${
							theme === "dark"
								? "border-white/20 bg-white/5"
								: "border-black/20 bg-black/5"
						}`}
					>
						{/* Font names */}
						<div className="mb-6 flex items-center justify-between">
							<div>
								<div className="text-sm font-medium opacity-60">
									Heading: {selected.heading}
								</div>
								<div className="text-sm opacity-60">Body: {selected.body}</div>
							</div>
							<div className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">
								{selected.personality}
							</div>
						</div>

						{/* Sample content */}
						<div className="space-y-4">
							<h2
								style={selected.css.heading}
								className={`text-4xl font-bold ${
									theme === "dark" ? "text-white" : "text-black"
								}`}
							>
								Ship Products Faster
							</h2>
							<p
								style={selected.css.body}
								className={`text-lg leading-relaxed ${
									theme === "dark" ? "text-white/80" : "text-black/80"
								}`}
							>
								Every great product starts with a vision. But vision without
								execution is just daydreaming. We built this to help you move
								from idea to launch in days, not months. Because the world needs
								what you&apos;re building.
							</p>
						</div>
					</motion.div>
				</AnimatePresence>
			</div>

			{/* Insight note */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2 }}
				className={`mt-4 rounded-lg border p-4 text-sm ${
					theme === "dark"
						? "border-white/10 bg-white/5 text-white/60"
						: "border-black/10 bg-black/5 text-black/60"
				}`}
			>
				<span className="font-bold">Notice the difference?</span> Same content,
				completely different emotional impact. Font choices set the tone before
				anyone reads a word.
			</motion.div>
		</div>
	);
}
