"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

// 1. DATA FIRST
interface WorkflowStep {
	label: string;
	detail: string;
	tech: "openclaw" | "mcp" | "skill" | "workflow";
	techLabel: string;
	duration: number; // ms for animation delay
}

interface Scenario {
	name: string;
	brief: string;
	steps: WorkflowStep[];
	result: string;
	totalTime: string;
	humanTime: string;
}

const techColors = {
	openclaw: { dark: "text-blue-400", light: "text-blue-600", bg: "bg-blue-600" },
	mcp: { dark: "text-violet-400", light: "text-violet-600", bg: "bg-violet-600" },
	skill: { dark: "text-emerald-400", light: "text-emerald-600", bg: "bg-emerald-600" },
	workflow: { dark: "text-amber-400", light: "text-amber-600", bg: "bg-amber-600" },
};

const scenarios: Scenario[] = [
	{
		name: "Design Agency",
		brief: "\"We need a landing page redesign for our product launch next week.\"",
		steps: [
			{
				label: "Client brief arrives via email",
				detail: "OpenClaw agent monitors inbox, parses the brief, extracts requirements",
				tech: "openclaw",
				techLabel: "OpenClaw",
				duration: 400,
			},
			{
				label: "Skill activates: client-design-brief",
				detail: "Loads the agency's proven redesign workflow with brand guidelines template",
				tech: "skill",
				techLabel: "Skill",
				duration: 350,
			},
			{
				label: "Fetch client's current brand assets",
				detail: "MCP connects to Figma, downloads existing logos, colors, fonts, components",
				tech: "mcp",
				techLabel: "MCP",
				duration: 500,
			},
			{
				label: "Generate 5 design concepts",
				detail: "Agent creates layout variations using brand assets and brief requirements",
				tech: "workflow",
				techLabel: "Workflow",
				duration: 600,
			},
			{
				label: "Deploy preview site",
				detail: "MCP connects to Vercel, pushes concept previews to staging URLs",
				tech: "mcp",
				techLabel: "MCP",
				duration: 400,
			},
			{
				label: "Send client preview links",
				detail: "OpenClaw composes email with all 5 concepts, context notes, and feedback form",
				tech: "openclaw",
				techLabel: "OpenClaw",
				duration: 350,
			},
		],
		result: "5 design concepts delivered",
		totalTime: "47 minutes",
		humanTime: "2-3 weeks",
	},
	{
		name: "Ad Agency",
		brief: "\"We need 10 video ad variants for our Q2 social campaign across Instagram and TikTok.\"",
		steps: [
			{
				label: "Campaign brief received via Slack",
				detail: "OpenClaw agent picks up the message, extracts campaign goals and audience",
				tech: "openclaw",
				techLabel: "OpenClaw",
				duration: 400,
			},
			{
				label: "Skill activates: social-ad-campaign",
				detail: "Loads creative brief template, platform specs, and brand voice guidelines",
				tech: "skill",
				techLabel: "Skill",
				duration: 350,
			},
			{
				label: "Pull performance data from past campaigns",
				detail: "MCP connects to Meta Ads and TikTok Ads APIs to analyze what worked before",
				tech: "mcp",
				techLabel: "MCP",
				duration: 500,
			},
			{
				label: "Generate 10 ad concepts with scripts",
				detail: "Agent creates copy, storyboards, and visual direction for each variant",
				tech: "workflow",
				techLabel: "Workflow",
				duration: 700,
			},
			{
				label: "Produce video assets",
				detail: "MCP connects to video generation API, renders all 10 variants in platform specs",
				tech: "mcp",
				techLabel: "MCP",
				duration: 600,
			},
			{
				label: "Upload to ad platforms as drafts",
				detail: "OpenClaw navigates Meta and TikTok ad managers, creates draft campaigns",
				tech: "openclaw",
				techLabel: "OpenClaw",
				duration: 450,
			},
		],
		result: "10 ad variants ready for review",
		totalTime: "2 hours",
		humanTime: "4-6 weeks",
	},
	{
		name: "Law Firm",
		brief: "\"We need an NDA reviewed and a counter-proposal drafted for our Series B investor.\"",
		steps: [
			{
				label: "Document received via secure portal",
				detail: "OpenClaw agent downloads the NDA PDF from the client's shared drive",
				tech: "openclaw",
				techLabel: "OpenClaw",
				duration: 400,
			},
			{
				label: "Skill activates: nda-review-workflow",
				detail: "Loads clause checklist, red flag patterns, and firm's standard terms library",
				tech: "skill",
				techLabel: "Skill",
				duration: 350,
			},
			{
				label: "Cross-reference with legal database",
				detail: "MCP connects to legal research API, checks clause enforceability and precedents",
				tech: "mcp",
				techLabel: "MCP",
				duration: 500,
			},
			{
				label: "Generate risk analysis and redlines",
				detail: "Agent identifies 12 problematic clauses, generates annotated markup with explanations",
				tech: "workflow",
				techLabel: "Workflow",
				duration: 550,
			},
			{
				label: "Draft counter-proposal",
				detail: "MCP connects to document generation service, produces clean counter-NDA",
				tech: "mcp",
				techLabel: "MCP",
				duration: 450,
			},
			{
				label: "Send to partner for final review",
				detail: "OpenClaw emails the senior partner a summary, risk report, and both documents",
				tech: "openclaw",
				techLabel: "OpenClaw",
				duration: 350,
			},
		],
		result: "Reviewed NDA + counter-proposal",
		totalTime: "35 minutes",
		humanTime: "1-2 weeks",
	},
	{
		name: "Marketing Agency",
		brief: "\"We need a full content calendar for March with SEO-optimized blog posts and social posts.\"",
		steps: [
			{
				label: "Brief submitted via project management tool",
				detail: "OpenClaw agent picks up the task from Notion, extracts content themes and KPIs",
				tech: "openclaw",
				techLabel: "OpenClaw",
				duration: 400,
			},
			{
				label: "Skill activates: content-calendar-build",
				detail: "Loads SEO keyword strategy, brand voice guide, and content templates",
				tech: "skill",
				techLabel: "Skill",
				duration: 350,
			},
			{
				label: "Analyze competitor content and rankings",
				detail: "MCP connects to SEO tools API, pulls keyword gaps and trending topics",
				tech: "mcp",
				techLabel: "MCP",
				duration: 500,
			},
			{
				label: "Generate 20 blog posts + 60 social posts",
				detail: "Agent produces full drafts, meta descriptions, social copy, and hashtag sets",
				tech: "workflow",
				techLabel: "Workflow",
				duration: 700,
			},
			{
				label: "Schedule across platforms",
				detail: "MCP connects to Buffer/Hootsuite API, queues all social posts with optimal timing",
				tech: "mcp",
				techLabel: "MCP",
				duration: 450,
			},
			{
				label: "Deliver calendar and drafts to client",
				detail: "OpenClaw updates Notion board with calendar view, links all drafts for approval",
				tech: "openclaw",
				techLabel: "OpenClaw",
				duration: 350,
			},
		],
		result: "80 pieces of content ready",
		totalTime: "3 hours",
		humanTime: "2-3 weeks",
	},
];

// 2. COMPONENT
export function AgencyWorkflowDemo() {
	const { theme } = useTheme();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [currentStep, setCurrentStep] = useState(-1);
	const [isPlaying, setIsPlaying] = useState(false);
	const [hasCompleted, setHasCompleted] = useState(false);

	const scenario = scenarios[selectedIndex];

	const runWorkflow = useCallback(() => {
		if (isPlaying) return;
		setIsPlaying(true);
		setHasCompleted(false);
		setCurrentStep(-1);

		const totalSteps = scenario.steps.length;

		for (let i = 0; i < totalSteps; i++) {
			const delay = scenario.steps
				.slice(0, i)
				.reduce((sum, s) => sum + s.duration, 300);

			setTimeout(() => {
				setCurrentStep(i);
				if (i === totalSteps - 1) {
					setTimeout(() => {
						setIsPlaying(false);
						setHasCompleted(true);
					}, 500);
				}
			}, delay);
		}
	}, [isPlaying, scenario]);

	// Reset when scenario changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: selectedIndex is needed as a trigger to reset state
	useEffect(() => {
		setCurrentStep(-1);
		setIsPlaying(false);
		setHasCompleted(false);
	}, [selectedIndex]);

	return (
		<div className="my-12">
			{/* 3. SELECTOR */}
			<div className="mb-6 flex flex-wrap gap-2">
				{scenarios.map((s, i) => (
					<button
						key={s.name}
						type="button"
						onClick={() => setSelectedIndex(i)}
						className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
							selectedIndex === i
								? theme === "dark"
									? "border-white/40 bg-white/10 text-white"
									: "border-black/40 bg-black/10 text-black"
								: theme === "dark"
									? "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
									: "border-black/20 bg-black/5 text-black/70 hover:bg-black/10"
						}`}
					>
						{s.name}
					</button>
				))}
			</div>

			{/* 4. CONTENT */}
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
						className={`rounded-xl border backdrop-blur-xl p-6 sm:p-8 ${
							theme === "dark"
								? "border-white/20 bg-white/5"
								: "border-black/20 bg-black/5"
						}`}
					>
						{/* Client brief */}
						<div
							className={`mb-6 rounded-lg border p-4 ${
								theme === "dark"
									? "border-white/10 bg-white/5"
									: "border-black/10 bg-black/5"
							}`}
						>
							<span
								className={`text-xs font-bold uppercase tracking-wider ${
									theme === "dark" ? "text-white/40" : "text-black/40"
								}`}
							>
								Client Brief
							</span>
							<p
								className={`mt-1 text-sm italic ${
									theme === "dark" ? "text-white/70" : "text-black/70"
								}`}
							>
								{scenario.brief}
							</p>
						</div>

						{/* Play button */}
						<div className="mb-5 flex items-center gap-3">
							<button
								type="button"
								onClick={runWorkflow}
								disabled={isPlaying}
								className={`rounded-lg border px-4 py-2 text-xs font-medium transition-all ${
									theme === "dark"
										? "border-white/20 bg-white/5 text-white hover:bg-white/10"
										: "border-black/20 bg-black/5 text-black hover:bg-black/10"
								} disabled:cursor-not-allowed disabled:opacity-40`}
							>
								{isPlaying
									? "Running..."
									: hasCompleted
										? "Run Again"
										: "Run Workflow"}
							</button>
							{currentStep >= 0 && (
								<span
									className={`text-xs font-mono ${
										theme === "dark" ? "text-white/40" : "text-black/40"
									}`}
								>
									Step {currentStep + 1}/{scenario.steps.length}
								</span>
							)}
						</div>

						{/* Tech legend */}
						<div className="mb-5 flex flex-wrap gap-3">
							{(
								[
									{ key: "openclaw" as const, label: "OpenClaw" },
									{ key: "mcp" as const, label: "MCP" },
									{ key: "skill" as const, label: "Skill" },
									{ key: "workflow" as const, label: "Workflow" },
								]
							).map((t) => (
								<div key={t.key} className="flex items-center gap-1.5">
									<div
										className={`h-2 w-2 rounded-full ${techColors[t.key].bg}`}
									/>
									<span
										className={`text-[10px] font-medium uppercase tracking-wider ${
											theme === "dark" ? "text-white/40" : "text-black/40"
										}`}
									>
										{t.label}
									</span>
								</div>
							))}
						</div>

						{/* Steps */}
						<div className="space-y-2">
							{scenario.steps.map((step, i) => {
								const isActive = i <= currentStep;
								const isCurrent = i === currentStep;
								const colors = techColors[step.tech];

								return (
									<motion.div
										key={step.label}
										initial={{ opacity: 0.3 }}
										animate={{
											opacity: isActive ? 1 : 0.3,
										}}
										transition={{ duration: 0.3 }}
										className={`relative flex items-start gap-3 rounded-lg border px-4 py-3 transition-all ${
											isCurrent
												? theme === "dark"
													? "border-white/20 bg-white/5"
													: "border-black/20 bg-black/5"
												: theme === "dark"
													? "border-white/5 bg-transparent"
													: "border-black/5 bg-transparent"
										}`}
									>
										{/* Step number */}
										<div
											className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white transition-all ${
												isActive ? colors.bg : theme === "dark" ? "bg-white/10" : "bg-black/10"
											}`}
										>
											{isActive ? "✓" : i + 1}
										</div>

										{/* Content */}
										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2">
												<span
													className={`text-sm font-semibold ${
														isActive
															? theme === "dark"
																? "text-white"
																: "text-black"
															: theme === "dark"
																? "text-white/40"
																: "text-black/40"
													}`}
												>
													{step.label}
												</span>
												<span
													className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
														isActive
															? `${colors.bg} text-white`
															: theme === "dark"
																? "bg-white/10 text-white/30"
																: "bg-black/10 text-black/30"
													}`}
												>
													{step.techLabel}
												</span>
											</div>
											<AnimatePresence>
												{isCurrent && (
													<motion.div
														initial={{ opacity: 0, height: 0 }}
														animate={{ opacity: 1, height: "auto" }}
														exit={{ opacity: 0, height: 0 }}
														transition={{ duration: 0.2 }}
														className={`mt-1 text-xs ${
															theme === "dark"
																? "text-white/50"
																: "text-black/50"
														}`}
													>
														{step.detail}
													</motion.div>
												)}
											</AnimatePresence>
										</div>
									</motion.div>
								);
							})}
						</div>

						{/* Result */}
						<AnimatePresence>
							{hasCompleted && (
								<motion.div
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
									className="mt-5 grid grid-cols-2 gap-3"
								>
									<div
										className={`rounded-lg border p-4 text-center ${
											theme === "dark"
												? "border-emerald-500/30 bg-emerald-500/5"
												: "border-emerald-500/30 bg-emerald-50/50"
										}`}
									>
										<div
											className={`text-xs font-bold uppercase tracking-wider ${
												theme === "dark"
													? "text-emerald-400/60"
													: "text-emerald-600/60"
											}`}
										>
											AI-Native
										</div>
										<div className="mt-1 text-lg font-bold text-emerald-500 sm:text-xl">
											{scenario.totalTime}
										</div>
										<div
											className={`mt-0.5 text-xs ${
												theme === "dark"
													? "text-white/40"
													: "text-black/40"
											}`}
										>
											{scenario.result}
										</div>
									</div>
									<div
										className={`rounded-lg border p-4 text-center ${
											theme === "dark"
												? "border-red-500/30 bg-red-500/5"
												: "border-red-500/30 bg-red-50/50"
										}`}
									>
										<div
											className={`text-xs font-bold uppercase tracking-wider ${
												theme === "dark"
													? "text-red-400/60"
													: "text-red-600/60"
											}`}
										>
											Traditional
										</div>
										<div className="mt-1 text-lg font-bold text-red-400 sm:text-xl">
											{scenario.humanTime}
										</div>
										<div
											className={`mt-0.5 text-xs ${
												theme === "dark"
													? "text-white/40"
													: "text-black/40"
											}`}
										>
											Same deliverable
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				</AnimatePresence>
			</div>

			{/* 5. INSIGHT NOTE */}
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
				<span className="font-bold">Watch the color badges.</span> Each step
				is powered by a different piece of the stack. OpenClaw handles browser
				actions and communication. MCP connects to external services. Skills
				encode the agency&apos;s expertise. Workflows orchestrate everything
				end-to-end. No single tool does it alone.
			</motion.div>
		</div>
	);
}
