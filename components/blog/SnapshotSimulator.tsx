"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

interface Element {
	ref: string;
	label: string;
	role: string;
	x: number;
	y: number;
	w: number;
	h: number;
}

const pageElements: Element[] = [
	{
		ref: "e1",
		label: "Search docs...",
		role: "searchbox",
		x: 20,
		y: 12,
		w: 55,
		h: 8,
	},
	{ ref: "e2", label: "Log In", role: "button", x: 80, y: 12, w: 15, h: 8 },
	{
		ref: "e3",
		label: "Getting Started",
		role: "link",
		x: 8,
		y: 30,
		w: 35,
		h: 6,
	},
	{ ref: "e4", label: "API Reference", role: "link", x: 8, y: 40, w: 30, h: 6 },
	{ ref: "e5", label: "Examples", role: "link", x: 8, y: 50, w: 25, h: 6 },
	{ ref: "e6", label: "Community", role: "link", x: 8, y: 60, w: 28, h: 6 },
	{ ref: "e7", label: "Copy code", role: "button", x: 75, y: 75, w: 18, h: 7 },
];

const agentSteps = [
	{
		thought: "User wants to find the API docs. Let me look for a link...",
		action: null,
		highlight: null,
		typed: "",
	},
	{
		thought: 'I see e4 is "API Reference" with role: link. Clicking it.',
		action: "click e4",
		highlight: "e4",
		typed: "",
	},
	{
		thought: 'Page updated. I need to find the search box to look for "auth".',
		action: null,
		highlight: null,
		typed: "",
	},
	{
		thought: "Found e1, a searchbox. Typing the query now.",
		action: 'type "auth" → e1',
		highlight: "e1",
		typed: "auth",
	},
	{
		thought: "Done. The search results should now be visible.",
		action: "snapshot",
		highlight: null,
		typed: "",
	},
];

function MiniPage({
	theme,
	highlighted,
}: {
	theme: string;
	highlighted: string | null;
}) {
	return (
		<div
			className={`relative h-full w-full overflow-hidden rounded-lg border ${
				theme === "dark"
					? "border-white/10 bg-gradient-to-br from-slate-900 to-slate-800"
					: "border-black/10 bg-gradient-to-br from-white to-slate-50"
			}`}
		>
			{/* Mini browser chrome */}
			<div
				className={`flex items-center gap-1.5 border-b px-3 py-1.5 ${
					theme === "dark"
						? "border-white/10 bg-white/5"
						: "border-black/10 bg-black/5"
				}`}
			>
				<div className="h-1.5 w-1.5 rounded-full bg-red-500/60" />
				<div className="h-1.5 w-1.5 rounded-full bg-yellow-500/60" />
				<div className="h-1.5 w-1.5 rounded-full bg-green-500/60" />
				<div
					className={`ml-2 rounded px-2 py-0.5 text-[8px] ${
						theme === "dark"
							? "bg-white/10 text-white/30"
							: "bg-black/5 text-black/30"
					}`}
				>
					docs.acme.com
				</div>
			</div>

			{/* Page elements rendered as visual blocks */}
			<div className="relative" style={{ height: "200px" }}>
				{pageElements.map((el) => {
					const isHighlighted = highlighted === el.ref;
					return (
						<motion.div
							key={el.ref}
							animate={
								isHighlighted
									? {
											boxShadow: [
												"0 0 0px 0px rgba(59,130,246,0)",
												"0 0 12px 4px rgba(59,130,246,0.5)",
												"0 0 0px 0px rgba(59,130,246,0)",
											],
										}
									: {}
							}
							transition={
								isHighlighted
									? { duration: 1.2, repeat: Number.POSITIVE_INFINITY }
									: {}
							}
							className={`absolute flex items-center justify-center rounded text-[7px] font-medium transition-all duration-300 ${
								isHighlighted ? "z-10 ring-2 ring-blue-500" : ""
							} ${
								el.role === "button"
									? theme === "dark"
										? "bg-blue-600/80 text-white"
										: "bg-blue-600 text-white"
									: el.role === "searchbox"
										? theme === "dark"
											? "border border-white/20 bg-white/10 text-white/50"
											: "border border-black/15 bg-white text-black/40"
										: el.role === "link"
											? theme === "dark"
												? "text-blue-400/70 underline decoration-blue-400/30"
												: "text-blue-600/70 underline decoration-blue-600/30"
											: theme === "dark"
												? "bg-white/5 text-white/40"
												: "bg-black/5 text-black/40"
							}`}
							style={{
								left: `${el.x}%`,
								top: `${el.y}%`,
								width: `${el.w}%`,
								height: `${el.h}%`,
							}}
						>
							{el.label}
						</motion.div>
					);
				})}
			</div>
		</div>
	);
}

export function SnapshotSimulator() {
	const { theme } = useTheme();
	const [step, setStep] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);

	const currentStep = agentSteps[step];

	const play = useCallback(async () => {
		setIsPlaying(true);
		for (let i = 0; i < agentSteps.length; i++) {
			setStep(i);
			await new Promise((r) => setTimeout(r, 2200));
		}
		setIsPlaying(false);
	}, []);

	// Auto-reset after finishing
	useEffect(() => {
		if (!isPlaying && step === agentSteps.length - 1) {
			const timer = setTimeout(() => setStep(0), 3000);
			return () => clearTimeout(timer);
		}
	}, [isPlaying, step]);

	const getRoleStyle = (role: string) => {
		switch (role) {
			case "searchbox":
				return theme === "dark"
					? "border-violet-500/40 bg-violet-500/8"
					: "border-violet-600/40 bg-violet-50";
			case "button":
				return theme === "dark"
					? "border-emerald-500/40 bg-emerald-500/8"
					: "border-emerald-600/40 bg-emerald-50";
			case "link":
				return theme === "dark"
					? "border-blue-500/40 bg-blue-500/8"
					: "border-blue-600/40 bg-blue-50";
			default:
				return theme === "dark"
					? "border-white/10 bg-white/5"
					: "border-black/10 bg-black/5";
		}
	};

	return (
		<div className="my-12">
			<div
				className={`overflow-hidden rounded-xl border backdrop-blur-xl ${
					theme === "dark"
						? "border-white/20 bg-white/5"
						: "border-black/20 bg-black/5"
				}`}
			>
				<div className="grid gap-0 lg:grid-cols-2">
					{/* Left: Mini Page */}
					<div
						className={`border-b p-5 lg:border-r lg:border-b-0 ${
							theme === "dark" ? "border-white/10" : "border-black/10"
						}`}
					>
						<div className="mb-3 flex items-center justify-between">
							<div
								className={`text-xs font-bold uppercase tracking-wider ${
									theme === "dark" ? "text-white/40" : "text-black/40"
								}`}
							>
								Browser
							</div>
							{currentStep.highlight && (
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
										theme === "dark"
											? "bg-blue-500/20 text-blue-300"
											: "bg-blue-100 text-blue-700"
									}`}
								>
									targeting {currentStep.highlight}
								</motion.div>
							)}
						</div>
						<MiniPage theme={theme} highlighted={currentStep.highlight} />
					</div>

					{/* Right: Agent + Snapshot */}
					<div className="flex flex-col p-5">
						{/* Agent Thought */}
						<div className="mb-4">
							<div
								className={`mb-2 text-xs font-bold uppercase tracking-wider ${
									theme === "dark" ? "text-white/40" : "text-black/40"
								}`}
							>
								Agent
							</div>
							<div className="relative min-h-[80px]">
								<AnimatePresence initial={false}>
									<motion.div
										key={step}
										initial={{
											opacity: 0,
											filter: "blur(8px)",
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
											filter: "blur(8px)",
											position: "absolute",
											inset: 0,
										}}
										transition={{ duration: 0.4, ease: "easeInOut" }}
									>
										<div
											className={`rounded-lg border-l-2 p-3 text-sm ${
												theme === "dark"
													? "border-blue-500 bg-blue-500/10 text-blue-200"
													: "border-blue-600 bg-blue-50 text-blue-900"
											}`}
										>
											{currentStep.thought}
										</div>
										{currentStep.action && (
											<motion.div
												initial={{ opacity: 0, y: 4 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.3 }}
												className={`mt-2 rounded border px-2.5 py-1.5 font-mono text-xs ${
													theme === "dark"
														? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
														: "border-emerald-600/30 bg-emerald-50 text-emerald-800"
												}`}
											>
												→ {currentStep.action}
											</motion.div>
										)}
									</motion.div>
								</AnimatePresence>
							</div>
						</div>

						{/* Snapshot */}
						<div className="flex-1">
							<div
								className={`mb-2 text-xs font-bold uppercase tracking-wider ${
									theme === "dark" ? "text-white/40" : "text-black/40"
								}`}
							>
								Snapshot
							</div>
							<div
								className={`space-y-1 rounded-lg border p-3 font-mono text-[11px] ${
									theme === "dark"
										? "border-white/10 bg-black/30"
										: "border-black/10 bg-white"
								}`}
							>
								{pageElements.map((el) => (
									<div
										key={el.ref}
										className={`rounded border-l-2 px-2 py-1 transition-all duration-300 ${
											currentStep.highlight === el.ref
												? theme === "dark"
													? "border-yellow-400 bg-yellow-500/20 text-yellow-200"
													: "border-yellow-500 bg-yellow-50 text-yellow-900"
												: getRoleStyle(el.role)
										}`}
									>
										<span className="font-bold">{el.ref}</span>: {el.label}{" "}
										<span className="opacity-40">[{el.role}]</span>
									</div>
								))}
							</div>
						</div>

						{/* Controls */}
						<div className="mt-4 flex items-center gap-3">
							<button
								type="button"
								onClick={play}
								disabled={isPlaying}
								className={`rounded-lg border px-4 py-2 text-xs font-medium transition-all ${
									isPlaying
										? "cursor-not-allowed opacity-40"
										: theme === "dark"
											? "border-white/20 bg-white/5 text-white hover:bg-white/10"
											: "border-black/20 bg-black/5 text-black hover:bg-black/10"
								}`}
							>
								{isPlaying ? "Running..." : "Run Agent"}
							</button>
							<div
								className={`font-mono text-[10px] ${
									theme === "dark" ? "text-white/30" : "text-black/30"
								}`}
							>
								Step {step + 1}/{agentSteps.length}
							</div>
						</div>
					</div>
				</div>
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
				<span className="font-bold">Watch the loop:</span> Snapshot the page,
				read the element tree, decide what to do, execute using the ref number,
				snapshot again. The agent never looks at pixels. It just reads the tree
				and acts.
			</motion.div>
		</div>
	);
}
