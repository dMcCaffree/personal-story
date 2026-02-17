"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

interface DepthLevel {
	hops: number;
	label: string;
	description: string;
	sqlJoins: number;
	sqlTime: string;
	sqlTimeMs: number;
	mongoTime: string;
	mongoTimeMs: number;
	neo4jTime: string;
	neo4jTimeMs: number;
	nodes: { id: string; label: string; x: number; y: number }[];
	edges: { from: string; to: string }[];
}

const depthLevels: DepthLevel[] = [
	{
		hops: 1,
		label: "1 Hop",
		description: "Direct connection. \"What topics did this user discuss?\"",
		sqlJoins: 2,
		sqlTime: "3ms",
		sqlTimeMs: 3,
		mongoTime: "2ms",
		mongoTimeMs: 2,
		neo4jTime: "1ms",
		neo4jTimeMs: 1,
		nodes: [
			{ id: "user", label: "User", x: 20, y: 50 },
			{ id: "topic", label: "Topic", x: 80, y: 50 },
		],
		edges: [{ from: "user", to: "topic" }],
	},
	{
		hops: 2,
		label: "2 Hops",
		description:
			"One degree out. \"What memories relate to topics this user discussed?\"",
		sqlJoins: 4,
		sqlTime: "12ms",
		sqlTimeMs: 12,
		mongoTime: "8ms",
		mongoTimeMs: 8,
		neo4jTime: "2ms",
		neo4jTimeMs: 2,
		nodes: [
			{ id: "user", label: "User", x: 10, y: 50 },
			{ id: "topic", label: "Topic", x: 50, y: 30 },
			{ id: "memory", label: "Memory", x: 90, y: 50 },
		],
		edges: [
			{ from: "user", to: "topic" },
			{ from: "topic", to: "memory" },
		],
	},
	{
		hops: 3,
		label: "3 Hops",
		description:
			"Two degrees out. \"What other users share related memories with similar topics?\"",
		sqlJoins: 7,
		sqlTime: "85ms",
		sqlTimeMs: 85,
		mongoTime: "60ms",
		mongoTimeMs: 60,
		neo4jTime: "3ms",
		neo4jTimeMs: 3,
		nodes: [
			{ id: "user", label: "User", x: 8, y: 50 },
			{ id: "topic", label: "Topic", x: 36, y: 25 },
			{ id: "memory", label: "Memory", x: 64, y: 50 },
			{ id: "related", label: "Related", x: 92, y: 25 },
		],
		edges: [
			{ from: "user", to: "topic" },
			{ from: "topic", to: "memory" },
			{ from: "memory", to: "related" },
		],
	},
	{
		hops: 4,
		label: "4 Hops",
		description:
			"Three degrees. \"Find pattern chains across conversations, topics, memories, and entities.\"",
		sqlJoins: 11,
		sqlTime: "420ms",
		sqlTimeMs: 420,
		mongoTime: "340ms",
		mongoTimeMs: 340,
		neo4jTime: "5ms",
		neo4jTimeMs: 5,
		nodes: [
			{ id: "user", label: "User", x: 5, y: 50 },
			{ id: "convo", label: "Convo", x: 28, y: 20 },
			{ id: "topic", label: "Topic", x: 50, y: 50 },
			{ id: "memory", label: "Memory", x: 72, y: 20 },
			{ id: "entity", label: "Entity", x: 95, y: 50 },
		],
		edges: [
			{ from: "user", to: "convo" },
			{ from: "convo", to: "topic" },
			{ from: "topic", to: "memory" },
			{ from: "memory", to: "entity" },
		],
	},
	{
		hops: 5,
		label: "5 Hops",
		description:
			"Deep traversal. \"Surface everything contextually connected to the current conversation.\"",
		sqlJoins: 16,
		sqlTime: "2.4s",
		sqlTimeMs: 2400,
		mongoTime: "1.8s",
		mongoTimeMs: 1800,
		neo4jTime: "8ms",
		neo4jTimeMs: 8,
		nodes: [
			{ id: "user", label: "User", x: 5, y: 50 },
			{ id: "convo", label: "Convo", x: 24, y: 20 },
			{ id: "topic", label: "Topic", x: 43, y: 55 },
			{ id: "memory", label: "Memory", x: 62, y: 20 },
			{ id: "entity", label: "Entity", x: 81, y: 55 },
			{ id: "pref", label: "Pref", x: 95, y: 20 },
		],
		edges: [
			{ from: "user", to: "convo" },
			{ from: "convo", to: "topic" },
			{ from: "topic", to: "memory" },
			{ from: "memory", to: "entity" },
			{ from: "entity", to: "pref" },
		],
	},
];

function PerformanceBar({
	label,
	timeMs,
	timeLabel,
	maxMs,
	color,
	theme,
}: {
	label: string;
	timeMs: number;
	timeLabel: string;
	maxMs: number;
	color: string;
	theme: string;
}) {
	const width = Math.max(4, (timeMs / maxMs) * 100);

	return (
		<div className="flex items-center gap-3">
			<span
				className={`w-20 shrink-0 text-right text-xs font-medium ${
					theme === "dark" ? "text-white/60" : "text-black/60"
				}`}
			>
				{label}
			</span>
			<div className="relative flex-1">
				<div
					className={`h-7 rounded ${
						theme === "dark" ? "bg-white/5" : "bg-black/5"
					}`}
				>
					<motion.div
						initial={{ width: 0 }}
						animate={{ width: `${width}%` }}
						transition={{ duration: 0.6, ease: "easeOut" }}
						className={`flex h-7 items-center justify-end rounded px-2 ${color}`}
					>
						<span className="text-[11px] font-bold text-white">
							{timeLabel}
						</span>
					</motion.div>
				</div>
			</div>
		</div>
	);
}

function NodeGraph({
	level,
	theme,
}: {
	level: DepthLevel;
	theme: string;
}) {
	return (
		<div className="relative h-24 w-full">
			{/* Edges */}
			<svg aria-hidden="true" className="absolute inset-0 h-full w-full">
				{level.edges.map((edge) => {
					const fromNode = level.nodes.find((n) => n.id === edge.from);
					const toNode = level.nodes.find((n) => n.id === edge.to);
					if (!fromNode || !toNode) return null;
					return (
						<motion.line
							key={`${edge.from}-${edge.to}`}
							initial={{ pathLength: 0, opacity: 0 }}
							animate={{ pathLength: 1, opacity: 1 }}
							transition={{ duration: 0.4, ease: "easeOut" }}
							x1={`${fromNode.x}%`}
							y1={`${fromNode.y}%`}
							x2={`${toNode.x}%`}
							y2={`${toNode.y}%`}
							stroke={
								theme === "dark"
									? "rgba(255,255,255,0.2)"
									: "rgba(0,0,0,0.15)"
							}
							strokeWidth="2"
							strokeDasharray="4 4"
						/>
					);
				})}
			</svg>

			{/* Nodes */}
			{level.nodes.map((node, i) => (
				<motion.div
					key={node.id}
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{
						delay: i * 0.08,
						duration: 0.3,
						ease: [0.34, 1.56, 0.64, 1],
					}}
					className={`absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-[9px] font-bold ${
						node.id === "user"
							? "border-blue-500/60 bg-blue-500/20 text-blue-300"
							: theme === "dark"
								? "border-white/30 bg-white/10 text-white/80"
								: "border-black/30 bg-black/10 text-black/80"
					}`}
					style={{ left: `${node.x}%`, top: `${node.y}%` }}
				>
					{node.label}
				</motion.div>
			))}
		</div>
	);
}

export function RelationshipDepthDemo() {
	const { theme } = useTheme();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const selected = depthLevels[selectedIndex];
	const maxMs = depthLevels[depthLevels.length - 1].sqlTimeMs;

	return (
		<div className="my-12">
			{/* Hop selector buttons */}
			<div className="mb-6 flex flex-wrap gap-2">
				{depthLevels.map((level, i) => (
					<button
						key={level.label}
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
						{level.label}
					</button>
				))}
			</div>

			{/* Content with blur crossfade */}
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
						className={`rounded-xl border backdrop-blur-xl p-8 ${
							theme === "dark"
								? "border-white/20 bg-white/5"
								: "border-black/20 bg-black/5"
						}`}
					>
						{/* Description */}
						<div className="mb-6 flex items-start justify-between gap-4">
							<p
								className={`text-sm italic ${
									theme === "dark"
										? "text-white/60"
										: "text-black/60"
								}`}
							>
								{selected.description}
							</p>
							<span
								className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
									selected.sqlJoins <= 4
										? "bg-green-600 text-white"
										: selected.sqlJoins <= 7
											? "bg-yellow-600 text-white"
											: "bg-red-600 text-white"
								}`}
							>
								{selected.sqlJoins} SQL JOINs
							</span>
						</div>

						{/* Node graph visualization */}
						<div
							className={`mb-6 rounded-lg border p-4 ${
								theme === "dark"
									? "border-white/10 bg-black/20"
									: "border-black/10 bg-white/50"
							}`}
						>
							<div
								className={`mb-2 text-xs font-bold uppercase tracking-wider ${
									theme === "dark"
										? "text-white/40"
										: "text-black/40"
								}`}
							>
								Traversal Path
							</div>
							<NodeGraph level={selected} theme={theme} />
						</div>

						{/* Performance bars */}
						<div
							className={`text-xs font-bold uppercase tracking-wider ${
								theme === "dark"
									? "text-white/40"
									: "text-black/40"
							}`}
						>
							Query Time
						</div>
						<div className="mt-3 space-y-2">
							<PerformanceBar
								label="PostgreSQL"
								timeMs={selected.sqlTimeMs}
								timeLabel={selected.sqlTime}
								maxMs={maxMs}
								color="bg-red-500/80"
								theme={theme}
							/>
							<PerformanceBar
								label="MongoDB"
								timeMs={selected.mongoTimeMs}
								timeLabel={selected.mongoTime}
								maxMs={maxMs}
								color="bg-yellow-500/80"
								theme={theme}
							/>
							<PerformanceBar
								label="Neo4j"
								timeMs={selected.neo4jTimeMs}
								timeLabel={selected.neo4jTime}
								maxMs={maxMs}
								color="bg-green-500/80"
								theme={theme}
							/>
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
				<span className="font-bold">Watch the red bar.</span> At 3+ hops,
				SQL performance falls off a cliff while Neo4j barely moves. This is
				the fundamental difference. Relational databases compute relationships
				at query time. Graph databases store them.
			</motion.div>
		</div>
	);
}
