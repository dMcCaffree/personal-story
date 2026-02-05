"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

const snapshotElements = [
	{ ref: "e1", label: "Acme Inc", role: "link", color: "blue" },
	{ ref: "e2", label: "Features", role: "link", color: "blue" },
	{ ref: "e3", label: "Pricing", role: "link", color: "blue" },
	{ ref: "e4", label: "Sign In", role: "button", color: "green" },
	{
		ref: "e5",
		label: "Build something people actually want",
		role: "heading",
		color: "gray",
	},
	{
		ref: "e6",
		label: "The platform for shipping fast...",
		role: "paragraph",
		color: "gray",
	},
	{ ref: "e7", label: "Enter your email", role: "textbox", color: "purple" },
	{ ref: "e8", label: "Get Early Access", role: "button", color: "green" },
	{
		ref: "e9",
		label: "Analytics that matter",
		role: "heading",
		color: "gray",
	},
	{ ref: "e10", label: "Instant deploys", role: "heading", color: "gray" },
	{
		ref: "e11",
		label: "Team collaboration",
		role: "heading",
		color: "gray",
	},
];

const roleColors: Record<string, { dark: string; light: string }> = {
	blue: {
		dark: "border-blue-500/40 bg-blue-500/10 text-blue-300",
		light: "border-blue-600/40 bg-blue-50 text-blue-800",
	},
	green: {
		dark: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
		light: "border-emerald-600/40 bg-emerald-50 text-emerald-800",
	},
	purple: {
		dark: "border-violet-500/40 bg-violet-500/10 text-violet-300",
		light: "border-violet-600/40 bg-violet-50 text-violet-800",
	},
	gray: {
		dark: "border-white/10 bg-white/5 text-white/50",
		light: "border-black/10 bg-black/5 text-black/50",
	},
};

function HumanView({ theme }: { theme: string }) {
	return (
		<div className="p-5">
			<div
				className={`overflow-hidden rounded-lg border shadow-xl ${
					theme === "dark"
						? "border-white/10 bg-gradient-to-br from-slate-900 to-slate-800"
						: "border-black/10 bg-gradient-to-br from-white to-slate-50"
				}`}
			>
				{/* Browser Chrome */}
				<div
					className={`flex items-center gap-2 border-b px-4 py-2.5 ${
						theme === "dark"
							? "border-white/10 bg-white/5"
							: "border-black/10 bg-black/5"
					}`}
				>
					<div className="flex gap-1.5">
						<div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
						<div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
						<div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
					</div>
					<div
						className={`ml-4 flex-1 rounded-md px-3 py-1 text-xs ${
							theme === "dark"
								? "bg-white/10 text-white/40"
								: "bg-black/5 text-black/40"
						}`}
					>
						acme.com
					</div>
				</div>

				{/* Nav */}
				<div
					className={`flex items-center justify-between border-b px-5 py-3 ${
						theme === "dark" ? "border-white/5" : "border-black/5"
					}`}
				>
					<span className="text-sm font-bold">Acme Inc</span>
					<div className="flex items-center gap-4 text-xs">
						<span className="opacity-60">Features</span>
						<span className="opacity-60">Pricing</span>
						<span
							className={`rounded-full px-3 py-1 text-white ${
								theme === "dark" ? "bg-blue-600" : "bg-blue-600"
							}`}
						>
							Sign In
						</span>
					</div>
				</div>

				{/* Hero */}
				<div className="px-5 py-10 text-center">
					<h2 className="mb-2 text-xl font-bold tracking-tight">
						Build something people actually want
					</h2>
					<p className="mx-auto mb-5 max-w-xs text-xs opacity-50">
						The platform for shipping fast without cutting corners
					</p>
					<div className="mx-auto flex max-w-xs gap-2">
						<input
							readOnly
							placeholder="Enter your email"
							className={`flex-1 rounded-lg border px-3 py-2 text-xs ${
								theme === "dark"
									? "border-white/20 bg-white/5 text-white placeholder-white/30"
									: "border-black/15 bg-white text-black placeholder-black/30"
							}`}
						/>
						<div className="whitespace-nowrap rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white">
							Get Early Access
						</div>
					</div>
				</div>

				{/* Features */}
				<div className="grid grid-cols-3 gap-3 px-5 pb-5">
					{[
						"Analytics that matter",
						"Instant deploys",
						"Team collaboration",
					].map((f) => (
						<div
							key={f}
							className={`rounded-lg border p-3 text-center ${
								theme === "dark"
									? "border-white/5 bg-white/5"
									: "border-black/5 bg-black/5"
							}`}
						>
							<div className="mb-1 text-xs font-semibold">{f}</div>
							<div className="text-[10px] opacity-40">
								Everything you need to ship
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

function AgentView({ theme }: { theme: string }) {
	return (
		<div className="p-5">
			<div
				className={`overflow-hidden rounded-lg border font-mono ${
					theme === "dark"
						? "border-white/10 bg-black/40"
						: "border-black/10 bg-slate-50"
				}`}
			>
				{/* Terminal Header */}
				<div
					className={`flex items-center gap-2 border-b px-4 py-2.5 ${
						theme === "dark"
							? "border-white/10 bg-white/5"
							: "border-black/10 bg-black/5"
					}`}
				>
					<div className="flex gap-1.5">
						<div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
						<div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
						<div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
					</div>
					<div
						className={`ml-4 text-xs ${
							theme === "dark" ? "text-green-400/70" : "text-green-700/70"
						}`}
					>
						accessibility_snapshot &mdash; acme.com
					</div>
				</div>

				{/* Snapshot Output */}
				<div className="space-y-1 p-4 text-xs">
					{snapshotElements.map((el, i) => (
						<motion.div
							key={el.ref}
							initial={{ opacity: 0, x: -8 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: i * 0.04, duration: 0.3 }}
							className={`rounded border-l-2 px-2.5 py-1.5 ${
								roleColors[el.color][theme === "dark" ? "dark" : "light"]
							}`}
						>
							<span className="font-bold">{el.ref}:</span>{" "}
							<span className="opacity-90">{el.label}</span>{" "}
							<span className="opacity-40">[{el.role}]</span>
						</motion.div>
					))}
				</div>
			</div>
		</div>
	);
}

export function AgentVisionDemo() {
	const { theme } = useTheme();
	const [view, setView] = useState<"human" | "agent">("human");

	return (
		<div className="my-12">
			{/* Selector */}
			<div className="mb-4 flex gap-2">
				{(["human", "agent"] as const).map((v) => (
					<button
						key={v}
						type="button"
						onClick={() => setView(v)}
						className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
							view === v
								? theme === "dark"
									? "border-white/40 bg-white/10 text-white"
									: "border-black/40 bg-black/10 text-black"
								: theme === "dark"
									? "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
									: "border-black/20 bg-black/5 text-black/70 hover:bg-black/10"
						}`}
					>
						{v === "human" ? "What You See" : "What The Agent Sees"}
					</button>
				))}
			</div>

			{/* Content with blur crossfade */}
			<div className="relative">
				<AnimatePresence initial={false}>
					<motion.div
						key={view}
						initial={{
							opacity: 0,
							filter: "blur(12px)",
							position: "absolute",
							inset: 0,
						}}
						animate={{
							opacity: 1,
							filter: "blur(0px)",
							position: "relative",
						}}
						exit={{
							opacity: 0,
							filter: "blur(12px)",
							position: "absolute",
							inset: 0,
						}}
						transition={{ duration: 0.5, ease: "easeInOut" }}
						className={`rounded-xl border backdrop-blur-xl ${
							theme === "dark"
								? "border-white/20 bg-white/5"
								: "border-black/20 bg-black/5"
						}`}
					>
						{view === "human" ? (
							<HumanView theme={theme} />
						) : (
							<AgentView theme={theme} />
						)}
					</motion.div>
				</AnimatePresence>
			</div>

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
				<span className="font-bold">Same page, two realities.</span> You see a
				designed product with visual hierarchy. The agent sees a flat list of
				actions with reference numbers. No colors, no layout, no spatial
				relationships.
			</motion.div>
		</div>
	);
}
