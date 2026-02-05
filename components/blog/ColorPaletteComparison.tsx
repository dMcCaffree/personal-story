"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";
import { LinkPreview } from "@/components/blog/LinkPreview";

const palettes = [
	{
		name: "Default Purple",
		description: "The shadcn/Tailwind default everyone uses",
		colors: [
			{ hex: "#8B5CF6", name: "Primary", usage: "Buttons, links, CTAs" },
			{ hex: "#A78BFA", name: "Light", usage: "Hover states" },
			{ hex: "#7C3AED", name: "Dark", usage: "Active states" },
			{ hex: "#6D28D9", name: "Darker", usage: "Focus states" },
		],
		verdict: "😴 Seen it a thousand times",
	},
	{
		name: "Ocean",
		description: "Inspired by deep water and marine life",
		colors: [
			{ hex: "#0D9488", name: "Teal", usage: "Primary actions" },
			{ hex: "#0EA5E9", name: "Sky", usage: "Secondary actions" },
			{ hex: "#164E63", name: "Deep", usage: "Headings, emphasis" },
			{ hex: "#06B6D4", name: "Cyan", usage: "Accents, highlights" },
		],
		verdict: "✨ Fresh and memorable",
	},
	{
		name: "Sunset",
		description: "Warm, energetic, and inviting",
		colors: [
			{ hex: "#F97316", name: "Orange", usage: "Primary CTAs" },
			{ hex: "#FB923C", name: "Coral", usage: "Hover effects" },
			{ hex: "#DC2626", name: "Red", usage: "Urgent actions" },
			{ hex: "#FDE047", name: "Yellow", usage: "Highlights, badges" },
		],
		verdict: "🔥 Bold and confident",
	},
	{
		name: "Forest",
		description: "Natural, sustainable, grounded",
		colors: [
			{ hex: "#059669", name: "Emerald", usage: "Success, primary" },
			{ hex: "#10B981", name: "Green", usage: "Positive actions" },
			{ hex: "#065F46", name: "Forest", usage: "Dark mode primary" },
			{ hex: "#34D399", name: "Mint", usage: "Accents, badges" },
		],
		verdict: "🌱 Organic and trustworthy",
	},
	{
		name: "Mono Edge",
		description: "High contrast, brutalist, striking",
		colors: [
			{ hex: "#000000", name: "Black", usage: "Primary elements" },
			{ hex: "#FFFFFF", name: "White", usage: "Contrast, backgrounds" },
			{ hex: "#6B7280", name: "Gray", usage: "Secondary text" },
			{ hex: "#EF4444", name: "Red", usage: "Accents only" },
		],
		verdict: "⚡ Uncompromising and sharp",
	},
];

export function ColorPaletteComparison() {
	const { theme } = useTheme();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const selected = palettes[selectedIndex];

	// Create subtle gradient background from palette colors
	const gradientStyle = {
		background: `linear-gradient(135deg, ${selected.colors[0].hex}08, ${selected.colors[1].hex}08, ${selected.colors[2].hex}08)`,
	};

	return (
		<div className="my-12">
			{/* Palette selector */}
			<div className="mb-6 flex flex-wrap gap-2">
				{palettes.map((palette) => (
					<button
						key={palette.name}
						type="button"
						onClick={() => setSelectedIndex(palettes.indexOf(palette))}
						className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
							selectedIndex === palettes.indexOf(palette)
								? theme === "dark"
									? "border-white/40 bg-white/10 text-white"
									: "border-black/40 bg-black/10 text-black"
								: theme === "dark"
									? "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
									: "border-black/20 bg-black/5 text-black/70 hover:bg-black/10"
						}`}
					>
						{palette.name}
					</button>
				))}
			</div>

			{/* Palette preview */}
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
						style={gradientStyle}
						className={`rounded-xl border backdrop-blur-xl p-8 ${
							theme === "dark" ? "border-white/20" : "border-black/20"
						}`}
					>
						{/* Header with verdict in top-right */}
						<div className="mb-8 flex items-start justify-between gap-4">
							<div className="flex-1">
								<h3
									className={`text-2xl font-bold ${
										theme === "dark" ? "text-white" : "text-black"
									}`}
								>
									{selected.name}
								</h3>
								<p
									className={`mt-1 text-sm ${
										theme === "dark" ? "text-white/60" : "text-black/60"
									}`}
								>
									{selected.description}
								</p>
							</div>
							{/* Verdict badge in top-right using palette colors */}
							<div
								className="rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg"
								style={{
									backgroundColor: selected.colors[0].hex,
								}}
							>
								{selected.verdict}
							</div>
						</div>

						{/* Color swatches - cleaner grid */}
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
							{selected.colors.map((color) => (
								<div
									key={color.hex}
									className="group relative overflow-hidden rounded-xl"
								>
									{/* Large color swatch */}
									<div
										className="aspect-square w-full rounded-xl shadow-lg transition-transform group-hover:scale-105"
										style={{ backgroundColor: color.hex }}
									/>
									{/* Color info overlay */}
									<div
										className={`mt-2 text-center ${
											theme === "dark" ? "text-white" : "text-black"
										}`}
									>
										<div className="font-mono text-sm font-bold">
											{color.name}
										</div>
										<div
											className={`font-mono text-xs ${
												theme === "dark" ? "text-white/40" : "text-black/40"
											}`}
										>
											{color.hex}
										</div>
										<div
											className={`mt-1 text-xs ${
												theme === "dark" ? "text-white/60" : "text-black/60"
											}`}
										>
											{color.usage}
										</div>
									</div>
								</div>
							))}
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
				<span className="font-bold">Pro tip:</span> Use tools like{" "}
				<LinkPreview
					href="https://coolors.co"
					ogImage="https://coolors.co/assets/img/og_image.png"
					ogTitle="Coolors - The super fast color palettes generator!"
					ogDescription="Generate or browse beautiful color combinations for your designs."
				>
					Coolors
				</LinkPreview>{" "}
				or{" "}
				<LinkPreview
					href="https://realtimecolors.com"
					ogImage="https://www.realtimecolors.com/preview.png"
					ogTitle="Realtime Colors"
					ogDescription="Visualize your color palettes on a real website."
				>
					Realtime Colors
				</LinkPreview>{" "}
				to build palettes from inspiration images. Extract colors from designs
				you love, not from defaults.
			</motion.div>
		</div>
	);
}
