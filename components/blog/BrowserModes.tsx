"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

type Mode = "isolated" | "relay" | "remote";

interface ModeData {
	id: Mode;
	name: string;
	tagline: string;
	description: string;
	browserLabel: string;
	tabs: Array<{ title: string; url: string; active?: boolean }>;
	indicators: Array<{ label: string; status: "on" | "off" | "warn" }>;
}

const modes: ModeData[] = [
	{
		id: "isolated",
		name: "Isolated",
		tagline: "Fresh sandbox, zero risk",
		description:
			"A dedicated Chromium instance with a clean profile. No cookies, no history, no connection to your personal browsing. The agent gets a blank slate every time.",
		browserLabel: "openclaw-sandbox",
		tabs: [{ title: "New Tab", url: "about:blank", active: true }],
		indicators: [
			{ label: "Cookies", status: "off" },
			{ label: "Sessions", status: "off" },
			{ label: "Sandbox", status: "on" },
			{ label: "Isolation", status: "on" },
		],
	},
	{
		id: "relay",
		name: "Chrome Relay",
		tagline: "Your real browser, agent-controlled",
		description:
			"Through a browser extension, the agent connects to your actual Chrome instance. It sees your real tabs, your logged-in sessions, everything. Use with care.",
		browserLabel: "chrome (relay)",
		tabs: [
			{ title: "Gmail - Inbox (23)", url: "mail.google.com" },
			{ title: "Calendar", url: "calendar.google.com" },
			{ title: "Notion - Projects", url: "notion.so", active: true },
		],
		indicators: [
			{ label: "Cookies", status: "on" },
			{ label: "Sessions", status: "on" },
			{ label: "Sandbox", status: "off" },
			{ label: "Your Data", status: "warn" },
		],
	},
	{
		id: "remote",
		name: "Remote CDP",
		tagline: "Cloud browsers for scale",
		description:
			"Connect to a remote Chrome DevTools Protocol endpoint. Run agents on cloud services like Browserless for headless deployments and scaling to multiple instances.",
		browserLabel: "browserless.io:3000",
		tabs: [{ title: "Headless Session", url: "remote://cdp", active: true }],
		indicators: [
			{ label: "Local", status: "off" },
			{ label: "Cloud", status: "on" },
			{ label: "Scalable", status: "on" },
			{ label: "Latency", status: "warn" },
		],
	},
];

function BrowserFrame({ mode, theme }: { mode: ModeData; theme: string }) {
	return (
		<div
			className={`overflow-hidden rounded-lg border ${
				theme === "dark"
					? "border-white/10 bg-black/40"
					: "border-black/10 bg-slate-50"
			}`}
		>
			{/* Browser Chrome */}
			<div
				className={`border-b px-3 py-2 ${
					theme === "dark"
						? "border-white/10 bg-white/5"
						: "border-black/10 bg-black/5"
				}`}
			>
				<div className="mb-2 flex items-center gap-1.5">
					<div className="h-2 w-2 rounded-full bg-red-500/70" />
					<div className="h-2 w-2 rounded-full bg-yellow-500/70" />
					<div className="h-2 w-2 rounded-full bg-green-500/70" />
					<div
						className={`ml-3 rounded px-2 py-0.5 font-mono text-[9px] ${
							theme === "dark"
								? "bg-white/10 text-white/40"
								: "bg-black/5 text-black/40"
						}`}
					>
						{mode.browserLabel}
					</div>
				</div>

				{/* Tabs */}
				<div className="flex gap-1 overflow-x-auto">
					{mode.tabs.map((tab) => (
						<div
							key={tab.title}
							className={`flex min-w-0 max-w-[140px] items-center gap-1.5 rounded-t px-2.5 py-1 text-[9px] ${
								tab.active
									? theme === "dark"
										? "bg-white/10 text-white"
										: "bg-white text-black"
									: theme === "dark"
										? "bg-white/5 text-white/40"
										: "bg-black/5 text-black/40"
							}`}
						>
							<span className="truncate">{tab.title}</span>
						</div>
					))}
				</div>
			</div>

			{/* URL bar */}
			<div
				className={`flex items-center gap-2 border-b px-3 py-1.5 ${
					theme === "dark"
						? "border-white/5 bg-white/5"
						: "border-black/5 bg-white"
				}`}
			>
				<div
					className={`flex-1 rounded px-2 py-0.5 font-mono text-[9px] ${
						theme === "dark"
							? "bg-white/5 text-white/30"
							: "bg-black/5 text-black/30"
					}`}
				>
					{mode.tabs.find((t) => t.active)?.url || mode.tabs[0]?.url}
				</div>
			</div>

			{/* Indicators */}
			<div className="flex flex-wrap gap-2 p-3">
				{mode.indicators.map((ind) => (
					<div
						key={ind.label}
						className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium ${
							ind.status === "on"
								? theme === "dark"
									? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
									: "border-emerald-600/30 bg-emerald-50 text-emerald-700"
								: ind.status === "warn"
									? theme === "dark"
										? "border-amber-500/30 bg-amber-500/10 text-amber-300"
										: "border-amber-600/30 bg-amber-50 text-amber-700"
									: theme === "dark"
										? "border-white/10 bg-white/5 text-white/30"
										: "border-black/10 bg-black/5 text-black/30"
						}`}
					>
						<div
							className={`h-1.5 w-1.5 rounded-full ${
								ind.status === "on"
									? "bg-emerald-500"
									: ind.status === "warn"
										? "bg-amber-500"
										: theme === "dark"
											? "bg-white/20"
											: "bg-black/20"
							}`}
						/>
						{ind.label}
					</div>
				))}
			</div>
		</div>
	);
}

export function BrowserModes() {
	const { theme } = useTheme();
	const [selected, setSelected] = useState<Mode>("isolated");

	const currentMode = modes.find((m) => m.id === selected) || modes[0];

	return (
		<div className="my-12">
			{/* Mode selector */}
			<div className="mb-4 flex flex-wrap gap-2">
				{modes.map((mode) => (
					<button
						key={mode.id}
						type="button"
						onClick={() => setSelected(mode.id)}
						className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
							selected === mode.id
								? theme === "dark"
									? "border-white/40 bg-white/10 text-white"
									: "border-black/40 bg-black/10 text-black"
								: theme === "dark"
									? "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
									: "border-black/20 bg-black/5 text-black/70 hover:bg-black/10"
						}`}
					>
						{mode.name}
					</button>
				))}
			</div>

			{/* Content with blur crossfade */}
			<div className="relative">
				<AnimatePresence initial={false}>
					<motion.div
						key={selected}
						initial={{
							opacity: 0,
							filter: "blur(10px)",
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
							filter: "blur(10px)",
							position: "absolute",
							inset: 0,
						}}
						transition={{ duration: 0.5, ease: "easeInOut" }}
						className={`rounded-xl border backdrop-blur-xl p-6 ${
							theme === "dark"
								? "border-white/20 bg-white/5"
								: "border-black/20 bg-black/5"
						}`}
					>
						{/* Header */}
						<div className="mb-5 flex items-start justify-between gap-4">
							<div>
								<h3
									className={`text-xl font-bold ${
										theme === "dark" ? "text-white" : "text-black"
									}`}
								>
									{currentMode.name}
								</h3>
								<p
									className={`mt-0.5 text-sm ${
										theme === "dark" ? "text-white/50" : "text-black/50"
									}`}
								>
									{currentMode.tagline}
								</p>
							</div>
						</div>

						{/* Browser Frame */}
						<BrowserFrame mode={currentMode} theme={theme} />

						{/* Description */}
						<p
							className={`mt-5 text-sm leading-relaxed ${
								theme === "dark" ? "text-white/70" : "text-black/70"
							}`}
						>
							{currentMode.description}
						</p>
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
				<span className="font-bold">My recommendation:</span> Use isolated mode
				for automation and scraping. Switch to relay when you need your existing
				sessions. Remote is for production deployments.
			</motion.div>
		</div>
	);
}
