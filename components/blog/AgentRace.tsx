"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

interface Step {
	action: string;
	detail: string;
	tokens: number;
	duration: number; // ms for animation
}

interface Scenario {
	name: string;
	task: string;
	mcp: {
		steps: Step[];
		verdict: string;
	};
	skills: {
		steps: Step[];
		verdict: string;
	};
	winner: "mcp" | "skills" | "tie";
	insight: string;
}

const scenarios: Scenario[] = [
	{
		name: "Query Errors",
		task: "Find the top 5 unresolved errors from the last 24 hours",
		mcp: {
			steps: [
				{ action: "Read tool schema", detail: "sentry.list_issues", tokens: 340, duration: 200 },
				{ action: "Call MCP tool", detail: 'query: "is:unresolved age:-24h"', tokens: 180, duration: 800 },
				{ action: "Parse response", detail: "5 issues returned with stack traces", tokens: 420, duration: 150 },
				{ action: "Format result", detail: "Summarize for user", tokens: 260, duration: 100 },
			],
			verdict: "3 seconds, live data",
		},
		skills: {
			steps: [
				{ action: "Read SKILL.md", detail: "Load error triage instructions", tokens: 2100, duration: 300 },
				{ action: "Build curl command", detail: "Construct Sentry API request", tokens: 380, duration: 400 },
				{ action: "Execute in shell", detail: "curl -H 'Authorization: ...'", tokens: 150, duration: 1200 },
				{ action: "Parse JSON output", detail: "Extract issue titles and counts", tokens: 520, duration: 300 },
				{ action: "Format result", detail: "Summarize for user", tokens: 260, duration: 100 },
			],
			verdict: "5 seconds, needs API key in env",
		},
		winner: "mcp",
		insight:
			"Live data queries are MCP's sweet spot. The agent doesn't need to know curl syntax or manage auth headers. The MCP server handles all of that.",
	},
	{
		name: "Generate Cover",
		task: "Generate a unique cover image for the latest blog post",
		mcp: {
			steps: [
				{ action: "Read tool schemas", detail: "3 servers: replicate, fal, r2", tokens: 14200, duration: 200 },
				{ action: "Call Replicate MCP", detail: "Generate image prompt via Claude", tokens: 680, duration: 2000 },
				{ action: "Parse prompt result", detail: "Extract JSON from response", tokens: 340, duration: 150 },
				{ action: "Call Fal MCP", detail: "Send prompt to nano-banana", tokens: 520, duration: 3000 },
				{ action: "Call R2 MCP", detail: "Upload generated image", tokens: 380, duration: 800 },
				{ action: "Update MDX file", detail: "Set coverImage metadata", tokens: 240, duration: 200 },
			],
			verdict: "7 seconds, 16k tokens on schemas alone",
		},
		skills: {
			steps: [
				{ action: "Match skill", detail: "generate-blog-cover (180 token metadata)", tokens: 180, duration: 100 },
				{ action: "Load SKILL.md", detail: "Full instructions + script path", tokens: 3200, duration: 200 },
				{ action: "Execute script", detail: "npx tsx generate-cover.ts [slug]", tokens: 120, duration: 5000 },
				{ action: "Script handles all", detail: "Dice → Claude → Fal → R2 → MDX", tokens: 0, duration: 0 },
				{ action: "Read output", detail: "Cover uploaded, MDX updated", tokens: 280, duration: 100 },
			],
			verdict: "6 seconds, 3.8k tokens total",
		},
		winner: "skills",
		insight:
			"Multi-service workflows are where skills dominate. One script replaces three MCP servers. The agent spends tokens on execution, not schema comprehension.",
	},
	{
		name: "File a Bug",
		task: "Create a bug report in Jira from a Sentry error",
		mcp: {
			steps: [
				{ action: "Read Sentry schema", detail: "11.5k tokens of tool definitions", tokens: 11500, duration: 200 },
				{ action: "Query Sentry", detail: "Get error details + stack trace", tokens: 480, duration: 800 },
				{ action: "Read Jira schema", detail: "9.8k tokens of tool definitions", tokens: 9800, duration: 200 },
				{ action: "Create Jira issue", detail: "Map error data to Jira fields", tokens: 620, duration: 600 },
				{ action: "Link back to Sentry", detail: "Add external link to issue", tokens: 280, duration: 300 },
			],
			verdict: "4 seconds, but 21k tokens on schemas",
		},
		skills: {
			steps: [
				{ action: "Load skill", detail: "Bug triage workflow instructions", tokens: 2100, duration: 200 },
				{ action: "Read Sentry API", detail: "curl to get error details", tokens: 380, duration: 1000 },
				{ action: "Transform data", detail: "Map Sentry fields → Jira format", tokens: 440, duration: 300 },
				{ action: "Create via API", detail: "curl POST to Jira REST API", tokens: 350, duration: 800 },
				{ action: "Link issues", detail: "curl to add Sentry link", tokens: 280, duration: 400 },
			],
			verdict: "5 seconds, 3.5k tokens total",
		},
		winner: "tie",
		insight:
			"Cross-service workflows reveal the trade-off. MCP is faster and more reliable (typed schemas), but skills use 6x fewer tokens. For frequent workflows, encode it as a skill. For ad-hoc queries, reach for MCP.",
	},
];

function StepRow({
	step,
	index,
	isVisible,
	accentColor,
}: {
	step: Step;
	index: number;
	isVisible: boolean;
	accentColor: string;
}) {
	const { theme } = useTheme();

	return (
		<motion.div
			initial={{ opacity: 0, x: -8 }}
			animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
			transition={{ delay: index * 0.03, duration: 0.15 }}
		className={`flex items-start gap-3 rounded-lg px-3 py-2 ${
			theme === "dark" ? "bg-white/3" : "bg-black/3"
		}`}
		>
			{/* Step number */}
			<div
				className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
				style={{ backgroundColor: accentColor }}
			>
				{index + 1}
			</div>

			{/* Content */}
			<div className="min-w-0 flex-1">
				<div
					className={`text-sm font-semibold ${
						theme === "dark" ? "text-white" : "text-black"
					}`}
				>
					{step.action}
				</div>
				<div
					className={`text-xs ${
						theme === "dark" ? "text-white/40" : "text-black/40"
					}`}
				>
					{step.detail}
				</div>
			</div>

			{/* Token cost */}
			<div
				className={`shrink-0 font-mono text-xs tabular-nums ${
					step.tokens > 5000
						? "font-bold text-red-400"
						: step.tokens > 1000
							? "text-amber-400"
							: theme === "dark"
								? "text-white/40"
								: "text-black/40"
				}`}
			>
				{step.tokens > 0 ? `${(step.tokens / 1000).toFixed(1)}k` : "—"}
			</div>
		</motion.div>
	);
}

export function AgentRace() {
	const { theme } = useTheme();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isRunning, setIsRunning] = useState(false);
	const [visibleSteps, setVisibleSteps] = useState({ mcp: 0, skills: 0 });

	const scenario = scenarios[selectedIndex];

	const totalTokens = (steps: Step[]) =>
		steps.reduce((sum, s) => sum + s.tokens, 0);

	const runSimulation = useCallback(() => {
		setIsRunning(true);
		setVisibleSteps({ mcp: 0, skills: 0 });

		const mcpTotal = scenario.mcp.steps.length;
		const skillsTotal = scenario.skills.steps.length;
		const maxSteps = Math.max(mcpTotal, skillsTotal);

		for (let i = 0; i <= maxSteps; i++) {
			setTimeout(() => {
				setVisibleSteps({
					mcp: Math.min(i + 1, mcpTotal),
					skills: Math.min(i + 1, skillsTotal),
				});
				if (i === maxSteps) {
					setIsRunning(false);
				}
			}, i * 150);
		}
	}, [scenario]);

	// Auto-run on scenario change
	useEffect(() => {
		const timer = setTimeout(() => {
			runSimulation();
		}, 600);
		return () => clearTimeout(timer);
	}, [runSimulation]);

	const mcpTotal = totalTokens(scenario.mcp.steps);
	const skillsTotal = totalTokens(scenario.skills.steps);

	return (
		<div className="my-12">
			{/* Scenario selector */}
			<div className="mb-6 flex flex-wrap gap-2">
				{scenarios.map((s, i) => (
					<button
						key={s.name}
						type="button"
						onClick={() => {
							setSelectedIndex(i);
							setVisibleSteps({ mcp: 0, skills: 0 });
						}}
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

			{/* Task description */}
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
					>
						<div
							className={`mb-4 rounded-lg border px-4 py-3 ${
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
								Task
							</span>
							<p
								className={`mt-1 text-sm font-medium ${
									theme === "dark" ? "text-white" : "text-black"
								}`}
							>
								{scenario.task}
							</p>
						</div>

						{/* Side-by-side race */}
						<div className="grid gap-4 sm:grid-cols-2">
							{/* MCP Column */}
							<div
								className={`rounded-xl border backdrop-blur-xl p-4 ${
									theme === "dark"
										? "border-blue-500/20 bg-blue-500/5"
										: "border-blue-500/20 bg-blue-50/50"
								}`}
							>
								<div className="mb-3 flex items-center justify-between">
									<span
										className={`font-mono text-sm font-bold ${
											theme === "dark" ? "text-blue-400" : "text-blue-600"
										}`}
									>
										MCP
									</span>
									<span
										className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
											scenario.winner === "mcp"
												? "bg-blue-600 text-white"
												: theme === "dark"
													? "bg-white/10 text-white/50"
													: "bg-black/10 text-black/50"
										}`}
									>
										{(mcpTotal / 1000).toFixed(1)}k tokens
									</span>
								</div>

								<div className="space-y-1.5">
									{scenario.mcp.steps.map((step, i) => (
										<StepRow
											key={`mcp-${step.action}`}
											step={step}
											index={i}
											isVisible={i < visibleSteps.mcp}
											accentColor="#3B82F6"
										/>
									))}
								</div>

								<AnimatePresence>
									{visibleSteps.mcp >= scenario.mcp.steps.length && (
										<motion.div
											initial={{ opacity: 0, y: 8 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.2 }}
											className={`mt-3 rounded-lg px-3 py-2 text-xs ${
												theme === "dark"
													? "bg-blue-500/10 text-blue-300"
													: "bg-blue-100 text-blue-700"
											}`}
										>
											{scenario.mcp.verdict}
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							{/* Skills Column */}
							<div
								className={`rounded-xl border backdrop-blur-xl p-4 ${
									theme === "dark"
										? "border-emerald-500/20 bg-emerald-500/5"
										: "border-emerald-500/20 bg-emerald-50/50"
								}`}
							>
								<div className="mb-3 flex items-center justify-between">
									<span
										className={`font-mono text-sm font-bold ${
											theme === "dark"
												? "text-emerald-400"
												: "text-emerald-600"
										}`}
									>
										SKILL.md
									</span>
									<span
										className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
											scenario.winner === "skills"
												? "bg-emerald-600 text-white"
												: theme === "dark"
													? "bg-white/10 text-white/50"
													: "bg-black/10 text-black/50"
										}`}
									>
										{(skillsTotal / 1000).toFixed(1)}k tokens
									</span>
								</div>

								<div className="space-y-1.5">
									{scenario.skills.steps.map((step, i) => (
										<StepRow
											key={`skills-${step.action}`}
											step={step}
											index={i}
											isVisible={i < visibleSteps.skills}
											accentColor="#10B981"
										/>
									))}
								</div>

								<AnimatePresence>
									{visibleSteps.skills >= scenario.skills.steps.length && (
										<motion.div
											initial={{ opacity: 0, y: 8 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.2 }}
											className={`mt-3 rounded-lg px-3 py-2 text-xs ${
												theme === "dark"
													? "bg-emerald-500/10 text-emerald-300"
													: "bg-emerald-100 text-emerald-700"
											}`}
										>
											{scenario.skills.verdict}
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</div>

						{/* Winner insight */}
						<AnimatePresence>
							{!isRunning &&
								visibleSteps.mcp >= scenario.mcp.steps.length && (
									<motion.div
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.4 }}
										className={`mt-4 rounded-lg border p-4 text-sm ${
											theme === "dark"
												? "border-white/10 bg-white/5 text-white/60"
												: "border-black/10 bg-black/5 text-black/60"
										}`}
									>
										<span className="font-bold">
											{scenario.winner === "mcp"
												? "MCP wins this one."
												: scenario.winner === "skills"
													? "Skills win this one."
													: "It's a toss-up."}
										</span>{" "}
										{scenario.insight}
									</motion.div>
								)}
						</AnimatePresence>
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}
