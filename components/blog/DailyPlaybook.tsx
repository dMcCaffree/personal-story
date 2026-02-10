"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

interface PlaybookStep {
	name: string;
	emoji: string;
	duration: string;
	thought: string;
	action: string;
	visual: {
		type: "browser" | "email" | "notes" | "code" | "linkedin";
		url?: string;
		lines: string[];
	};
}

const steps: PlaybookStep[] = [
	{
		name: "Choose",
		emoji: "🎯",
		duration: "15 min",
		thought:
			"I love what Railway is doing with developer infrastructure. Their product is beautiful and they seem to actually care about DX.",
		action:
			"Pick one company you genuinely care about. Not a job posting. A company.",
		visual: {
			type: "browser",
			url: "railway.app",
			lines: [
				"Railway - Infrastructure, Teknically",
				"━━━━━━━━━━━━━━━━━━━━━━━━━━━",
				"Deploy. Scale. Sleep well.",
				"",
				"✦  One-click deploys from GitHub",
				"✦  Automatic scaling & networking",
				"✦  Built for developers who ship",
			],
		},
	},
	{
		name: "Research",
		emoji: "🔍",
		duration: "30 min",
		thought:
			"Their engineering blog shows they care about Rust, Go, and great UX. The team is 40 people. CEO is active on Twitter. They just raised Series B.",
		action:
			"Deep dive into their website, blog, team, values, competitors, and market position.",
		visual: {
			type: "notes",
			lines: [
				"── Railway Deep Dive ──────────",
				"",
				"Team:     ~40 people, eng-heavy",
				"Stack:    Rust, Go, TypeScript",
				"Funding:  Series B ($50M)",
				"Culture:  Remote, async, ship fast",
				"Gap:      Docs could be better",
				"Gap:      Onboarding has friction",
			],
		},
	},
	{
		name: "Find Your Fit",
		emoji: "🧩",
		duration: "15 min",
		thought:
			"Their dashboard is great but the onboarding flow drops off. I've built onboarding flows that reduced churn by 35%. That's where I'd create the most value.",
		action:
			"If this were the only company you could work at, where would you belong?",
		visual: {
			type: "notes",
			lines: [
				"── Where I Fit ───────────────",
				"",
				"Role:     Frontend / DX Engineer",
				"Focus:    Onboarding experience",
				"Why me:   Built 3 onboarding flows",
				"          that cut churn 20-35%",
				"Value:    First-run experience is",
				"          where they lose users",
			],
		},
	},
	{
		name: "Create",
		emoji: "🛠️",
		duration: "1-2 hours",
		thought:
			"I'm going to rebuild their first-run experience with better progressive disclosure and a guided setup wizard. I'll record a 3-minute walkthrough explaining my decisions.",
		action:
			"Build something specific for them. A redesign, a video review, ad copy, a prototype.",
		visual: {
			type: "code",
			lines: [
				"// railway-onboarding-redesign",
				"",
				"├── prototype/",
				"│   ├── guided-setup.tsx",
				"│   ├── progress-tracker.tsx",
				"│   └── first-deploy-flow.tsx",
				"├── walkthrough-video.mp4",
				"└── README.md  (why + how)",
			],
		},
	},
	{
		name: "Outreach",
		emoji: "📨",
		duration: "30 min",
		thought:
			"Found 8 people at Railway on LinkedIn. CEO, CTO, 3 engineers, 2 PMs, head of design. Also guessing emails. Setting up follow-ups for Day 3 and Day 7.",
		action:
			"Send your work to everyone at the company. LinkedIn, email, Twitter. Set up a drip campaign.",
		visual: {
			type: "email",
			lines: [
				"To: jake@railway.app",
				"Subject: I rebuilt your onboarding",
				"─────────────────────────────",
				"Hey Jake,",
				"",
				"I redesigned Railway's first-run",
				"experience. 3-min walkthrough here:",
				"[link to video + prototype]",
				"",
				"Would love to chat about it.",
			],
		},
	},
];

function StepVisual({
	visual,
	theme,
}: {
	visual: PlaybookStep["visual"];
	theme: string;
}) {
	const chromeUrl =
		visual.type === "browser"
			? visual.url
			: visual.type === "email"
				? "mail.google.com"
				: visual.type === "linkedin"
					? "linkedin.com"
					: visual.type === "code"
						? "cursor.sh"
						: "notes.app";

	return (
		<div
			className={`overflow-hidden rounded-lg border ${
				theme === "dark"
					? "border-white/10 bg-linear-to-br from-slate-900 to-slate-800"
					: "border-black/10 bg-linear-to-br from-white to-slate-50"
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
					{chromeUrl}
				</div>
			</div>

			{/* Content */}
			<div className="p-3">
				{visual.lines.map((line, i) => (
					<motion.div
						key={`line-${i}-${line}`}
						initial={{ opacity: 0, x: -4 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: i * 0.04, duration: 0.2 }}
						className={`font-mono text-[10px] leading-relaxed sm:text-xs ${
							line.startsWith("──") || line.startsWith("━")
								? theme === "dark"
									? "text-white/20"
									: "text-black/20"
								: line.startsWith("✦") ||
									  line.startsWith("├") ||
									  line.startsWith("│") ||
									  line.startsWith("└")
									? theme === "dark"
										? "text-blue-400/70"
										: "text-blue-600/70"
									: line.startsWith("To:") ||
										  line.startsWith("Subject:")
										? theme === "dark"
											? "font-semibold text-white/80"
											: "font-semibold text-black/80"
										: line === ""
											? ""
											: theme === "dark"
												? "text-white/50"
												: "text-black/50"
						}`}
					>
						{line || "\u00A0"}
					</motion.div>
				))}
			</div>
		</div>
	);
}

export function DailyPlaybook() {
	const { theme } = useTheme();
	const [step, setStep] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);

	const currentStep = steps[step];

	const play = useCallback(async () => {
		setIsPlaying(true);
		for (let i = 0; i < steps.length; i++) {
			setStep(i);
			await new Promise((r) => setTimeout(r, 3000));
		}
		setIsPlaying(false);
	}, []);

	useEffect(() => {
		if (!isPlaying && step === steps.length - 1) {
			const timer = setTimeout(() => setStep(0), 4000);
			return () => clearTimeout(timer);
		}
	}, [isPlaying, step]);

	return (
		<div className="my-12">
			{/* Step selector */}
			<div className="mb-6 flex flex-wrap gap-2">
				{steps.map((s, i) => (
					<button
						key={s.name}
						type="button"
						onClick={() => {
							setStep(i);
							setIsPlaying(false);
						}}
						className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all sm:px-4 ${
							step === i
								? theme === "dark"
									? "border-white/40 bg-white/10 text-white"
									: "border-black/40 bg-black/10 text-black"
								: theme === "dark"
									? "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
									: "border-black/20 bg-black/5 text-black/70 hover:bg-black/10"
						}`}
					>
						<span className="mr-1.5">{s.emoji}</span>
						{s.name}
					</button>
				))}
			</div>

			{/* Content */}
			<div
				className={`overflow-hidden rounded-xl border backdrop-blur-xl ${
					theme === "dark"
						? "border-white/20 bg-white/5"
						: "border-black/20 bg-black/5"
				}`}
			>
				<div className="grid gap-0 lg:grid-cols-2">
					{/* Left: Visual */}
					<div
						className={`border-b p-5 lg:border-r lg:border-b-0 ${
							theme === "dark"
								? "border-white/10"
								: "border-black/10"
						}`}
					>
						<div className="mb-3 flex items-center justify-between">
							<div
								className={`text-xs font-bold uppercase tracking-wider ${
									theme === "dark"
										? "text-white/40"
										: "text-black/40"
								}`}
							>
								What it looks like
							</div>
							<div
								className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
									theme === "dark"
										? "bg-white/10 text-white/50"
										: "bg-black/10 text-black/50"
								}`}
							>
								~{currentStep.duration}
							</div>
						</div>

						<div className="relative min-h-[200px]">
							<AnimatePresence initial={false}>
								<motion.div
									key={step}
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
									transition={{
										duration: 0.5,
										ease: "easeInOut",
									}}
								>
									<StepVisual
										visual={currentStep.visual}
										theme={theme}
									/>
								</motion.div>
							</AnimatePresence>
						</div>
					</div>

					{/* Right: Thought + Action */}
					<div className="flex flex-col p-5">
						<div className="mb-4">
							<div
								className={`mb-2 text-xs font-bold uppercase tracking-wider ${
									theme === "dark"
										? "text-white/40"
										: "text-black/40"
								}`}
							>
								Your thinking
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
										transition={{
											duration: 0.4,
											ease: "easeInOut",
										}}
									>
										<div
											className={`rounded-lg border-l-2 p-3 text-sm italic ${
												theme === "dark"
													? "border-blue-500 bg-blue-500/10 text-blue-200"
													: "border-blue-600 bg-blue-50 text-blue-900"
											}`}
										>
											&ldquo;{currentStep.thought}&rdquo;
										</div>
									</motion.div>
								</AnimatePresence>
							</div>
						</div>

						<div className="mb-4 flex-1">
							<div
								className={`mb-2 text-xs font-bold uppercase tracking-wider ${
									theme === "dark"
										? "text-white/40"
										: "text-black/40"
								}`}
							>
								The move
							</div>
							<div className="relative">
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
										transition={{
											duration: 0.4,
											ease: "easeInOut",
										}}
									>
										<div
											className={`rounded-lg border p-3 text-sm font-medium ${
												theme === "dark"
													? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
													: "border-emerald-600/30 bg-emerald-50 text-emerald-800"
											}`}
										>
											{currentStep.action}
										</div>
									</motion.div>
								</AnimatePresence>
							</div>
						</div>

						{/* Controls */}
						<div className="flex items-center gap-3">
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
								} disabled:cursor-not-allowed disabled:opacity-40`}
							>
								{isPlaying ? "Running..." : "Play All Steps"}
							</button>
							<div
								className={`font-mono text-[10px] ${
									theme === "dark"
										? "text-white/30"
										: "text-black/30"
								}`}
							>
								Step {step + 1}/{steps.length}
							</div>
						</div>
					</div>
				</div>
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
				<span className="font-bold">
					This entire process takes 2-3 hours.
				</span>{" "}
				That&apos;s it. One company, done right, every single day. Compare
				that to spending 3 hours blasting out 50 generic applications and
				hearing back from exactly zero of them.
			</motion.div>
		</div>
	);
}
