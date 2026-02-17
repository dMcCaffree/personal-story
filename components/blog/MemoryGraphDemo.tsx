"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

interface GraphNode {
	id: string;
	label: string;
	type: "user" | "message" | "topic" | "entity" | "preference";
	x: number;
	y: number;
}

interface GraphEdge {
	from: string;
	to: string;
	label: string;
}

interface ConversationStep {
	message: string;
	sender: "user" | "ai";
	newNodes: GraphNode[];
	newEdges: GraphEdge[];
	relevanceQuery: boolean;
	relevancePath?: string[];
	explanation: string;
}

const steps: ConversationStep[] = [
	{
		message: "Hey, I'm flying to Paris next week for a work trip",
		sender: "user",
		newNodes: [
			{ id: "u1", label: "You", type: "user", x: 8, y: 50 },
			{ id: "m1", label: "msg 1", type: "message", x: 30, y: 30 },
			{ id: "t_travel", label: "Travel", type: "topic", x: 55, y: 15 },
			{ id: "e_paris", label: "Paris", type: "entity", x: 55, y: 50 },
			{ id: "t_work", label: "Work", type: "topic", x: 80, y: 30 },
		],
		newEdges: [
			{ from: "u1", to: "m1", label: "SENT" },
			{ from: "m1", to: "t_travel", label: "ABOUT" },
			{ from: "m1", to: "e_paris", label: "MENTIONS" },
			{ from: "m1", to: "t_work", label: "ABOUT" },
		],
		relevanceQuery: false,
		explanation:
			"First message creates the user node and links to extracted topics and entities.",
	},
	{
		message: "My sister Sarah actually lives there, maybe I'll visit her",
		sender: "user",
		newNodes: [
			{ id: "m2", label: "msg 2", type: "message", x: 30, y: 68 },
			{ id: "e_sarah", label: "Sarah", type: "entity", x: 80, y: 65 },
			{ id: "t_family", label: "Family", type: "topic", x: 55, y: 82 },
		],
		newEdges: [
			{ from: "u1", to: "m2", label: "SENT" },
			{ from: "m2", to: "e_sarah", label: "MENTIONS" },
			{ from: "m2", to: "e_paris", label: "MENTIONS" },
			{ from: "m2", to: "t_family", label: "ABOUT" },
			{ from: "e_sarah", to: "e_paris", label: "LIVES_IN" },
		],
		relevanceQuery: false,
		explanation:
			"New entities connect to existing ones. Sarah gets linked to Paris through a LIVES_IN edge.",
	},
	{
		message: "Oh and I always forget -- I absolutely hate window seats",
		sender: "user",
		newNodes: [
			{ id: "m3", label: "msg 3", type: "message", x: 8, y: 82 },
			{
				id: "p_seat",
				label: "No Window",
				type: "preference",
				x: 8, y: 15,
			},
		],
		newEdges: [
			{ from: "u1", to: "m3", label: "SENT" },
			{ from: "m3", to: "t_travel", label: "ABOUT" },
			{ from: "u1", to: "p_seat", label: "PREFERS" },
			{ from: "p_seat", to: "t_travel", label: "CONTEXT" },
		],
		relevanceQuery: false,
		explanation:
			"Preferences get their own node type, linked to the user and the relevant context (travel).",
	},
	{
		message:
			"Time to book a flight to Europe next month...",
		sender: "user",
		newNodes: [],
		newEdges: [],
		relevanceQuery: true,
		relevancePath: [
			"u1",
			"m1",
			"t_travel",
			"e_paris",
			"e_sarah",
			"p_seat",
		],
		explanation:
			"New message triggers a relevance query. The graph traverses: You -> Travel -> Paris -> Sarah lives there -> You prefer aisle seats. All surfaced in milliseconds.",
	},
];

const nodeColors: Record<
	string,
	{ dark: string; light: string; dot: string }
> = {
	user: {
		dark: "border-blue-500/60 bg-blue-500/20 text-blue-300",
		light: "border-blue-600/60 bg-blue-100 text-blue-800",
		dot: "bg-blue-500",
	},
	message: {
		dark: "border-white/20 bg-white/10 text-white/60",
		light: "border-black/20 bg-black/5 text-black/50",
		dot: "bg-gray-400",
	},
	topic: {
		dark: "border-violet-500/60 bg-violet-500/20 text-violet-300",
		light: "border-violet-600/60 bg-violet-100 text-violet-800",
		dot: "bg-violet-500",
	},
	entity: {
		dark: "border-emerald-500/60 bg-emerald-500/20 text-emerald-300",
		light: "border-emerald-600/60 bg-emerald-100 text-emerald-800",
		dot: "bg-emerald-500",
	},
	preference: {
		dark: "border-amber-500/60 bg-amber-500/20 text-amber-300",
		light: "border-amber-600/60 bg-amber-100 text-amber-800",
		dot: "bg-amber-500",
	},
};

export function MemoryGraphDemo() {
	const { theme } = useTheme();
	const [currentStep, setCurrentStep] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);

	const visibleNodes: GraphNode[] = [];
	const visibleEdges: GraphEdge[] = [];

	for (let i = 0; i <= currentStep; i++) {
		for (const node of steps[i].newNodes) {
			if (!visibleNodes.find((n) => n.id === node.id)) {
				visibleNodes.push(node);
			}
		}
		for (const edge of steps[i].newEdges) {
			visibleEdges.push(edge);
		}
	}

	const current = steps[currentStep];
	const isRelevanceStep = current.relevanceQuery;
	const relevanceSet = new Set(current.relevancePath ?? []);

	const play = useCallback(async () => {
		setIsPlaying(true);
		for (let i = 0; i < steps.length; i++) {
			setCurrentStep(i);
			await new Promise((r) => setTimeout(r, 2500));
		}
		setIsPlaying(false);
	}, []);

	const getNodePosition = (id: string) => {
		const node = visibleNodes.find((n) => n.id === id);
		return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
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
					{/* Left: Graph visualization */}
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
								Knowledge Graph
							</div>
							{isRelevanceStep && (
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
										theme === "dark"
											? "bg-amber-500/20 text-amber-300"
											: "bg-amber-100 text-amber-700"
									}`}
								>
									relevance query active
								</motion.div>
							)}
						</div>

						{/* Graph canvas */}
						<div
							className={`relative overflow-hidden rounded-lg border ${
								theme === "dark"
									? "border-white/10 bg-black/30"
									: "border-black/10 bg-white/60"
							}`}
							style={{ height: "280px" }}
						>
							{/* Edges */}
							<svg aria-hidden="true" className="absolute inset-0 h-full w-full">
								{visibleEdges.map((edge) => {
									const from = getNodePosition(edge.from);
									const to = getNodePosition(edge.to);
									const isHighlighted =
										isRelevanceStep &&
										relevanceSet.has(edge.from) &&
										relevanceSet.has(edge.to);

									return (
										<motion.line
											key={`${edge.from}-${edge.to}-${edge.label}`}
											initial={{ opacity: 0 }}
											animate={{
												opacity: isHighlighted
													? 1
													: 0.3,
											}}
											transition={{ duration: 0.4 }}
											x1={`${from.x}%`}
											y1={`${from.y}%`}
											x2={`${to.x}%`}
											y2={`${to.y}%`}
											stroke={
												isHighlighted
													? "#f59e0b"
													: theme === "dark"
														? "rgba(255,255,255,0.15)"
														: "rgba(0,0,0,0.1)"
											}
											strokeWidth={
												isHighlighted ? 3 : 1.5
											}
											strokeDasharray={
												isHighlighted
													? undefined
													: "4 4"
											}
										/>
									);
								})}
							</svg>

							{/* Nodes */}
							{visibleNodes.map((node, i) => {
								const colors =
									nodeColors[node.type];
								const isHighlighted =
									isRelevanceStep &&
									relevanceSet.has(node.id);

								return (
									<motion.div
										key={node.id}
										initial={{
											scale: 0,
											opacity: 0,
										}}
										animate={{
											scale: isHighlighted
												? 1.15
												: 1,
											opacity: 1,
											boxShadow: isHighlighted
												? [
														"0 0 0px 0px rgba(245,158,11,0)",
														"0 0 14px 4px rgba(245,158,11,0.5)",
														"0 0 0px 0px rgba(245,158,11,0)",
													]
												: "none",
										}}
										transition={
											isHighlighted
												? {
														scale: {
															duration: 0.3,
														},
														boxShadow: {
															duration: 1.2,
															repeat: Number.POSITIVE_INFINITY,
														},
													}
												: {
														delay:
															i *
															0.06,
														duration:
															0.3,
														ease: [
															0.34,
															1.56,
															0.64,
															1,
														],
													}
										}
										className={`absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border px-2 py-1 text-[9px] font-bold ${
											colors[
												theme === "dark"
													? "dark"
													: "light"
											]
										} ${
											isHighlighted
												? "ring-2 ring-amber-400/60 z-10"
												: ""
										}`}
										style={{
											left: `${node.x}%`,
											top: `${node.y}%`,
										}}
									>
										{node.label}
									</motion.div>
								);
							})}

							{/* Legend */}
							<div
								className={`absolute bottom-2 left-2 flex flex-wrap gap-2 text-[8px] ${
									theme === "dark"
										? "text-white/40"
										: "text-black/40"
								}`}
							>
								{(
									[
										"user",
										"message",
										"topic",
										"entity",
										"preference",
									] as const
								).map((type) => (
									<div
										key={type}
										className="flex items-center gap-1"
									>
										<div
											className={`h-1.5 w-1.5 rounded-full ${nodeColors[type].dot}`}
										/>
										<span className="capitalize">
											{type}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Right: Messages + explanation */}
					<div className="flex flex-col p-5">
						{/* Message bubble */}
						<div className="mb-4">
							<div
								className={`mb-2 text-xs font-bold uppercase tracking-wider ${
									theme === "dark"
										? "text-white/40"
										: "text-black/40"
								}`}
							>
								{isRelevanceStep
									? "New Incoming Message"
									: "SMS Conversation"}
							</div>
							<div className="relative min-h-[80px]">
								<AnimatePresence initial={false}>
									<motion.div
										key={currentStep}
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
											className={`rounded-lg border-l-2 p-3 text-sm ${
												isRelevanceStep
													? theme ===
														  "dark"
														? "border-amber-400 bg-amber-500/10 text-amber-200"
														: "border-amber-500 bg-amber-50 text-amber-900"
													: theme ===
														  "dark"
														? "border-blue-500 bg-blue-500/10 text-blue-200"
														: "border-blue-600 bg-blue-50 text-blue-900"
											}`}
										>
											&ldquo;{current.message}
											&rdquo;
										</div>
									</motion.div>
								</AnimatePresence>
							</div>
						</div>

						{/* Explanation */}
						<div className="mb-4 flex-1">
							<div
								className={`mb-2 text-xs font-bold uppercase tracking-wider ${
									theme === "dark"
										? "text-white/40"
										: "text-black/40"
								}`}
							>
								{isRelevanceStep
									? "Surfaced Context"
									: "Graph Update"}
							</div>
							<div className="relative min-h-[60px]">
								<AnimatePresence initial={false}>
									<motion.div
										key={currentStep}
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
										<p
											className={`text-sm leading-relaxed ${
												theme === "dark"
													? "text-white/60"
													: "text-black/60"
											}`}
										>
											{current.explanation}
										</p>

										{isRelevanceStep &&
											current.relevancePath && (
												<div
													className={`mt-3 rounded border p-2 font-mono text-[11px] ${
														theme === "dark"
															? "border-amber-500/30 bg-amber-500/10 text-amber-300"
															: "border-amber-600/30 bg-amber-50 text-amber-800"
													}`}
												>
													{current.relevancePath
														.map((id) => {
															const node =
																visibleNodes.find(
																	(n) =>
																		n.id ===
																		id,
																);
															return node
																? node.label
																: id;
														})
														.join(" -> ")}
												</div>
											)}
									</motion.div>
								</AnimatePresence>
							</div>
						</div>

						{/* Stats */}
						<div
							className={`mb-4 grid grid-cols-3 gap-2 text-center ${
								theme === "dark"
									? "text-white/60"
									: "text-black/60"
							}`}
						>
							<div
								className={`rounded-lg border p-2 ${
									theme === "dark"
										? "border-white/10 bg-white/5"
										: "border-black/10 bg-black/5"
								}`}
							>
								<div className="text-lg font-bold">
									{visibleNodes.length}
								</div>
								<div className="text-[10px] uppercase tracking-wider opacity-60">
									Nodes
								</div>
							</div>
							<div
								className={`rounded-lg border p-2 ${
									theme === "dark"
										? "border-white/10 bg-white/5"
										: "border-black/10 bg-black/5"
								}`}
							>
								<div className="text-lg font-bold">
									{visibleEdges.length}
								</div>
								<div className="text-[10px] uppercase tracking-wider opacity-60">
									Edges
								</div>
							</div>
							<div
								className={`rounded-lg border p-2 ${
									theme === "dark"
										? "border-white/10 bg-white/5"
										: "border-black/10 bg-black/5"
								}`}
							>
								<div className="text-lg font-bold">
									{currentStep + 1}
								</div>
								<div className="text-[10px] uppercase tracking-wider opacity-60">
									Messages
								</div>
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
								{isPlaying
									? "Building..."
									: "Build Graph"}
							</button>
							<div className="flex gap-1">
								{steps.map((_, i) => (
									<button
										key={`step-${steps[i].message.slice(0, 10)}`}
										type="button"
										disabled={isPlaying}
										onClick={() =>
											setCurrentStep(i)
										}
										className={`h-2 w-2 rounded-full transition-all ${
											i === currentStep
												? "bg-blue-500"
												: i <= currentStep
													? theme ===
														  "dark"
														? "bg-white/30"
														: "bg-black/30"
													: theme ===
														  "dark"
														? "bg-white/10"
														: "bg-black/10"
										}`}
									/>
								))}
							</div>
							<div
								className={`font-mono text-[10px] ${
									theme === "dark"
										? "text-white/30"
										: "text-black/30"
								}`}
							>
								Step {currentStep + 1}/{steps.length}
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
					Every message enriches the graph.
				</span>{" "}
				When a new topic comes up, the AI traverses connections to
				surface what matters. Your sister lives in Paris. You hate
				window seats. All connected, all instant.
			</motion.div>
		</div>
	);
}
