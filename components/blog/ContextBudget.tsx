"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

interface ToolItem {
	name: string;
	type: "mcp" | "skill";
	idleTokens: number;
	activeTokens: number;
	description: string;
	color: string;
}

const tools: ToolItem[] = [
	{
		name: "GitHub",
		type: "mcp",
		idleTokens: 18200,
		activeTokens: 18200,
		description: "87 tools, full REST + GraphQL schemas",
		color: "#8B5CF6",
	},
	{
		name: "Database",
		type: "mcp",
		idleTokens: 14800,
		activeTokens: 14800,
		description: "Query builder, table schemas, migrations",
		color: "#3B82F6",
	},
	{
		name: "Sentry",
		type: "mcp",
		idleTokens: 11500,
		activeTokens: 11500,
		description: "Error tracking, issue management, alerts",
		color: "#EF4444",
	},
	{
		name: "Slack",
		type: "mcp",
		idleTokens: 8400,
		activeTokens: 8400,
		description: "Channels, messages, users, reactions",
		color: "#10B981",
	},
	{
		name: "Jira",
		type: "mcp",
		idleTokens: 9800,
		activeTokens: 9800,
		description: "Issues, sprints, boards, workflows",
		color: "#F59E0B",
	},
	{
		name: "Cover Image Gen",
		type: "skill",
		idleTokens: 180,
		activeTokens: 3200,
		description: "Dice roll → Claude → Fal.ai → R2",
		color: "#EC4899",
	},
	{
		name: "Deploy Script",
		type: "skill",
		idleTokens: 120,
		activeTokens: 1800,
		description: "Build, test, stage, promote to prod",
		color: "#06B6D4",
	},
	{
		name: "Code Review",
		type: "skill",
		idleTokens: 140,
		activeTokens: 2400,
		description: "Lint, test, diff analysis, PR summary",
		color: "#84CC16",
	},
	{
		name: "Bug Triage",
		type: "skill",
		idleTokens: 110,
		activeTokens: 2100,
		description: "Classify, reproduce, assign, notify",
		color: "#F97316",
	},
];

const TOTAL_CONTEXT = 128000;

function formatTokens(n: number): string {
	if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
	return `${n}`;
}

function TokenBlock({
	tool,
	isActive,
}: {
	tool: ToolItem;
	isActive: boolean;
}) {
	const { theme } = useTheme();
	const tokens = isActive ? tool.activeTokens : 0;
	const widthPercent = (tokens / TOTAL_CONTEXT) * 100;

	return (
		<motion.div
			layout
			className={`shrink-0 overflow-hidden rounded-md transition-all ${
				isActive ? "opacity-100" : "opacity-0"
			}`}
			style={{
				width: isActive ? `${Math.max(widthPercent, 0.5)}%` : "0%",
				height: "100%",
				backgroundColor: `${tool.color}${theme === "dark" ? "CC" : "99"}`,
			}}
			transition={{ duration: 0.5, ease: "easeInOut" }}
		/>
	);
}

export function ContextBudget() {
	const { theme } = useTheme();
	const [activeTools, setActiveTools] = useState<Set<string>>(new Set());

	const toggleTool = (name: string) => {
		setActiveTools((prev) => {
			const next = new Set(prev);
			if (next.has(name)) {
				next.delete(name);
			} else {
				next.add(name);
			}
			return next;
		});
	};

	const usedTokens = useMemo(() => {
		return tools.reduce((total, tool) => {
			if (!activeTools.has(tool.name)) return total;
			return total + (tool.type === "skill" ? tool.activeTokens : tool.activeTokens);
		}, 0);
	}, [activeTools]);

	const usedPercent = (usedTokens / TOTAL_CONTEXT) * 100;
	const remaining = TOTAL_CONTEXT - usedTokens;
	const isDanger = usedPercent > 75;
	const isCritical = usedPercent > 90;

	const mcpTools = tools.filter((t) => t.type === "mcp");
	const skillTools = tools.filter((t) => t.type === "skill");

	const mcpTokens = tools
		.filter((t) => t.type === "mcp" && activeTools.has(t.name))
		.reduce((sum, t) => sum + t.activeTokens, 0);
	const skillTokens = tools
		.filter((t) => t.type === "skill" && activeTools.has(t.name))
		.reduce((sum, t) => sum + t.activeTokens, 0);

	return (
		<div className="my-12">
			{/* Context window bar */}
			<div
				className={`mb-6 rounded-xl border backdrop-blur-xl p-6 ${
					theme === "dark" ? "border-white/20 bg-white/5" : "border-black/20 bg-black/5"
				}`}
			>
				{/* Header with budget counter */}
				<div className="mb-4 flex items-center justify-between">
					<div>
						<h3
							className={`text-sm font-bold uppercase tracking-wider ${
								theme === "dark" ? "text-white/60" : "text-black/60"
							}`}
						>
							Context Window Budget
						</h3>
						<div
							className={`mt-1 font-mono text-2xl font-bold tabular-nums ${
								isCritical
									? "text-red-500"
									: isDanger
										? "text-amber-500"
										: theme === "dark"
											? "text-white"
											: "text-black"
							}`}
						>
							{formatTokens(remaining)}{" "}
							<span className="text-sm font-normal opacity-50">
								of {formatTokens(TOTAL_CONTEXT)} remaining
							</span>
						</div>
					</div>
					<div className="text-right">
						{activeTools.size > 0 && (
							<motion.div
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								className="space-y-1"
							>
								{mcpTokens > 0 && (
									<div className="font-mono text-xs">
										<span className={theme === "dark" ? "text-white/40" : "text-black/40"}>
											MCP:{" "}
										</span>
										<span className={theme === "dark" ? "text-white/80" : "text-black/80"}>
											{formatTokens(mcpTokens)}
										</span>
									</div>
								)}
								{skillTokens > 0 && (
									<div className="font-mono text-xs">
										<span className={theme === "dark" ? "text-white/40" : "text-black/40"}>
											Skills:{" "}
										</span>
										<span className={theme === "dark" ? "text-white/80" : "text-black/80"}>
											{formatTokens(skillTokens)}
										</span>
									</div>
								)}
							</motion.div>
						)}
					</div>
				</div>

				{/* Visual bar */}
				<div
					className={`relative h-12 overflow-hidden rounded-lg ${
						theme === "dark" ? "bg-white/5" : "bg-black/5"
					}`}
				>
					<div className="absolute inset-0 flex gap-px p-1">
						{tools.map((tool) => (
							<TokenBlock
								key={tool.name}
								tool={tool}
								isActive={activeTools.has(tool.name)}
							/>
						))}
					</div>

					{/* Danger zone markers */}
					<div
						className="absolute top-0 bottom-0 border-l border-dashed border-amber-500/40"
						style={{ left: "75%" }}
					/>
					<div
						className="absolute top-0 bottom-0 border-l border-dashed border-red-500/40"
						style={{ left: "90%" }}
					/>

					{/* Percentage label */}
					<div
						className={`absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs font-bold ${
							isCritical
								? "text-red-400"
								: isDanger
									? "text-amber-400"
									: theme === "dark"
										? "text-white/40"
										: "text-black/40"
						}`}
					>
						{usedPercent.toFixed(0)}% used
					</div>
				</div>

				{/* Legend */}
				<AnimatePresence>
					{isCritical && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: "auto" }}
							exit={{ opacity: 0, height: 0 }}
							className="mt-3 overflow-hidden rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 font-mono text-xs text-red-400"
						>
							Agent performance degrades here. Less room for reasoning,
							conversation history, and code context.
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Tool toggles */}
			<div className="grid gap-4 sm:grid-cols-2">
				{/* MCP Servers */}
				<div>
					<h4
						className={`mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
							theme === "dark" ? "text-white/50" : "text-black/50"
						}`}
					>
						<span
							className={`h-2 w-2 rounded-full ${
								theme === "dark" ? "bg-blue-400" : "bg-blue-600"
							}`}
						/>
						MCP Servers
						<span className="font-normal normal-case opacity-60">
							(always-on schemas)
						</span>
					</h4>
					<div className="space-y-2">
						{mcpTools.map((tool) => {
							const isActive = activeTools.has(tool.name);
							return (
								<button
									key={tool.name}
									type="button"
									onClick={() => toggleTool(tool.name)}
									className={`w-full rounded-lg border px-4 py-3 text-left transition-all ${
										isActive
											? theme === "dark"
												? "border-white/30 bg-white/10"
												: "border-black/30 bg-black/10"
											: theme === "dark"
												? "border-white/10 bg-white/2 hover:bg-white/5"
												: "border-black/10 bg-black/2 hover:bg-black/5"
									}`}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div
												className="h-3 w-3 rounded-full transition-all"
												style={{
													backgroundColor: isActive ? tool.color : "transparent",
													border: `2px solid ${tool.color}`,
												}}
											/>
											<span
												className={`text-sm font-semibold ${
													theme === "dark" ? "text-white" : "text-black"
												}`}
											>
												{tool.name}
											</span>
										</div>
										<span
											className={`font-mono text-xs font-bold ${
												isActive
													? theme === "dark"
														? "text-white/80"
														: "text-black/80"
													: theme === "dark"
														? "text-white/30"
														: "text-black/30"
											}`}
										>
											+{formatTokens(tool.activeTokens)}
										</span>
									</div>
									<div
										className={`mt-1 ml-6 text-xs ${
											theme === "dark" ? "text-white/40" : "text-black/40"
										}`}
									>
										{tool.description}
									</div>
								</button>
							);
						})}
					</div>
				</div>

				{/* Skills */}
				<div>
					<h4
						className={`mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${
							theme === "dark" ? "text-white/50" : "text-black/50"
						}`}
					>
						<span
							className={`h-2 w-2 rounded-full ${
								theme === "dark" ? "bg-emerald-400" : "bg-emerald-600"
							}`}
						/>
						Agent Skills
						<span className="font-normal normal-case opacity-60">
							(loaded on demand)
						</span>
					</h4>
					<div className="space-y-2">
						{skillTools.map((tool) => {
							const isActive = activeTools.has(tool.name);
							return (
								<button
									key={tool.name}
									type="button"
									onClick={() => toggleTool(tool.name)}
									className={`w-full rounded-lg border px-4 py-3 text-left transition-all ${
										isActive
											? theme === "dark"
												? "border-white/30 bg-white/10"
												: "border-black/30 bg-black/10"
											: theme === "dark"
												? "border-white/10 bg-white/2 hover:bg-white/5"
												: "border-black/10 bg-black/2 hover:bg-black/5"
									}`}
								>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<div
												className="h-3 w-3 rounded-full transition-all"
												style={{
													backgroundColor: isActive ? tool.color : "transparent",
													border: `2px solid ${tool.color}`,
												}}
											/>
											<span
												className={`text-sm font-semibold ${
													theme === "dark" ? "text-white" : "text-black"
												}`}
											>
												{tool.name}
											</span>
										</div>
										<div className="flex items-center gap-2">
											<span
												className={`font-mono text-[10px] ${
													theme === "dark" ? "text-white/30" : "text-black/30"
												}`}
											>
												idle: {formatTokens(tool.idleTokens)}
											</span>
											<span
												className={`font-mono text-xs font-bold ${
													isActive
														? theme === "dark"
															? "text-white/80"
															: "text-black/80"
														: theme === "dark"
															? "text-white/30"
															: "text-black/30"
												}`}
											>
												+{formatTokens(tool.activeTokens)}
											</span>
										</div>
									</div>
									<div
										className={`mt-1 ml-6 text-xs ${
											theme === "dark" ? "text-white/40" : "text-black/40"
										}`}
									>
										{tool.description}
									</div>
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{/* Insight */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2 }}
				className={`mt-6 rounded-lg border p-4 text-sm ${
					theme === "dark"
						? "border-white/10 bg-white/5 text-white/60"
						: "border-black/10 bg-black/5 text-black/60"
				}`}
			>
				<span className="font-bold">Try it:</span> Toggle on all 5 MCP servers. Then
				toggle them off and turn on all 4 skills instead. Notice the difference? MCP
				schemas consume ~63k tokens (half your context) just by being connected. Skills
				use ~9.5k total, and only when active.
			</motion.div>
		</div>
	);
}
