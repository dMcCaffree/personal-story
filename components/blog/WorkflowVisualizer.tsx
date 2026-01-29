"use client";

import { motion } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

interface WorkflowStep {
	id: string;
	label: string;
	duration: string;
	subSteps?: string[];
}

const oldWorkflowSteps: WorkflowStep[] = [
	{
		id: "leadership",
		label: "Leadership Decision",
		duration: "1-2 days",
		subSteps: ["Direction set", "Budget allocation", "Timeline estimate"],
	},
	{
		id: "product-brief",
		label: "Product Team Planning",
		duration: "3-5 days",
		subSteps: [
			"Requirements doc",
			"Stakeholder alignment",
			"Resource planning",
		],
	},
	{
		id: "design",
		label: "Designer Creates Mockups",
		duration: "1-2 weeks",
		subSteps: ["Wireframes", "High-fidelity designs", "Design system updates"],
	},
	{
		id: "design-approval",
		label: "Design Approval (Leadership/PM)",
		duration: "3-7 days",
		subSteps: ["Feedback rounds", "Revision requests", "Final approval"],
	},
	{
		id: "eng-review",
		label: "Engineering Feasibility Review",
		duration: "2-3 days",
		subSteps: [
			"Technical assessment",
			"Backend requirements",
			"Timeline estimate",
		],
	},
	{
		id: "implementation",
		label: "Engineering Build",
		duration: "2-4 weeks",
		subSteps: ["Backend development", "Frontend implementation", "Integration"],
	},
	{
		id: "design-qa",
		label: "Designer QA",
		duration: "2-3 days",
		subSteps: ["Visual review", "UX testing", "Revision requests"],
	},
	{
		id: "code-review",
		label: "Code Review",
		duration: "1-3 days",
		subSteps: ["Peer review", "Revisions", "Approval"],
	},
	{
		id: "pm-approval",
		label: "PM Final Approval",
		duration: "1-2 days",
		subSteps: ["Feature testing", "Acceptance criteria", "Release decision"],
	},
	{
		id: "release",
		label: "Release Process",
		duration: "1-2 days",
		subSteps: [
			"Feature flag setup",
			"Staging deployment",
			"Production release",
		],
	},
];

const newWorkflowSteps: WorkflowStep[] = [
	{
		id: "idea",
		label: "Anyone Has Idea",
		duration: "instant",
		subSteps: ["Customer feedback", "Team insight", "Market observation"],
	},
	{
		id: "prototype",
		label: "AI-Assisted Prototype",
		duration: "hours",
		subSteps: [
			"Build with Cursor/Claude",
			"Sandboxed environment",
			"Preview ready",
		],
	},
	{
		id: "team-review",
		label: "Team Decides Together",
		duration: "1 day",
		subSteps: ["Share preview link", "Gather feedback", "Decision to pursue"],
	},
	{
		id: "design-pass",
		label: "Designer Refinement",
		duration: "1-2 days",
		subSteps: [
			"Take over branch",
			"Polish experience",
			"Maintain brand standards",
		],
	},
	{
		id: "eng-review-new",
		label: "Engineer Review & Optimization",
		duration: "1-2 days",
		subSteps: [
			"Code quality",
			"Performance optimization",
			"Maintainability review",
		],
	},
	{
		id: "release-new",
		label: "Release",
		duration: "instant",
		subSteps: ["Feature flag", "Preview URL", "Direct release"],
	},
];

interface WorkflowVisualizerProps {
	mode?: "old" | "new" | "comparison";
}

interface WorkflowStepItemProps {
	step: WorkflowStep;
	index: number;
	total: number;
	theme: string;
}

function WorkflowStepItem({
	step,
	index,
	total,
	theme,
}: WorkflowStepItemProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.5 }}
			transition={{ duration: 0.4, delay: index * 0.05 }}
			className="relative"
		>
			<div
				className={`rounded-xl border p-4 backdrop-blur-xl ${
					theme === "dark"
						? "border-white/20 bg-white/5"
						: "border-black/20 bg-black/5"
				}`}
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div
							className={`h-3 w-3 rounded-full ${
								theme === "dark" ? "bg-blue-400" : "bg-blue-600"
							}`}
						/>
						<span
							className={`font-mono text-sm font-bold ${
								theme === "dark" ? "text-white" : "text-black"
							}`}
						>
							{step.label}
						</span>
					</div>
					<span
						className={`rounded-full px-3 py-1 font-mono text-xs ${
							theme === "dark"
								? "bg-white/10 text-white/60"
								: "bg-black/10 text-black/60"
						}`}
					>
						{step.duration}
					</span>
				</div>

				{step.subSteps && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						whileInView={{ opacity: 1, height: "auto" }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.3, delay: index * 0.05 + 0.2 }}
						className={`mt-3 space-y-1 text-xs ${
							theme === "dark" ? "text-white/50" : "text-black/50"
						}`}
					>
						{step.subSteps.map((subStep, idx) => (
							<div key={`${step.id}-substep-${idx}`}>• {subStep}</div>
						))}
					</motion.div>
				)}
			</div>

			{index < total - 1 && (
				<div className="flex justify-center py-2">
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						className={theme === "dark" ? "text-white/20" : "text-black/20"}
					>
						<title>Arrow down</title>
						<path
							d="M12 5v14m0 0l-7-7m7 7l7-7"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
			)}
		</motion.div>
	);
}

export function WorkflowVisualizer({
	mode = "comparison",
}: WorkflowVisualizerProps) {
	const { theme } = useTheme();

	return (
		<div className="not-prose my-12">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.6 }}
			>
				{/* Workflows */}
				<div
					className={`grid gap-8 ${mode === "comparison" ? "md:grid-cols-2" : "md:grid-cols-1 mx-auto max-w-2xl"}`}
				>
					{/* Old Way */}
					{(mode === "old" || mode === "comparison") && (
						<div>
							<div className="mb-6 text-center">
								<h3
									className={`font-mono text-xl font-bold ${
										theme === "dark" ? "text-white" : "text-black"
									}`}
								>
									The Old Way
								</h3>
								<p
									className={`mt-2 text-sm ${
										theme === "dark" ? "text-white/60" : "text-black/60"
									}`}
								>
									Total Time: 6-8 weeks
								</p>
							</div>

							<div className="space-y-0">
								{oldWorkflowSteps.map((step, index) => (
									<WorkflowStepItem
										key={step.id}
										step={step}
										index={index}
										total={oldWorkflowSteps.length}
										theme={theme}
									/>
								))}
							</div>
						</div>
					)}

					{/* New Way */}
					{(mode === "new" || mode === "comparison") && (
						<div>
							<div className="mb-6 text-center">
								<h3
									className={`font-mono text-xl font-bold ${
										theme === "dark" ? "text-white" : "text-black"
									}`}
								>
									The New Way (2026)
								</h3>
								<p
									className={`mt-2 text-sm ${
										theme === "dark" ? "text-white/60" : "text-black/60"
									}`}
								>
									Total Time: 3-5 days
								</p>
							</div>

							<div className="space-y-0">
								{newWorkflowSteps.map((step, index) => (
									<WorkflowStepItem
										key={step.id}
										step={step}
										index={index}
										total={newWorkflowSteps.length}
										theme={theme}
									/>
								))}
							</div>
						</div>
					)}
				</div>

				{/* Summary Stats */}
				{mode === "comparison" && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className={`mx-auto mt-8 max-w-2xl rounded-xl border p-6 text-center backdrop-blur-xl ${
							theme === "dark"
								? "border-white/20 bg-white/5"
								: "border-black/20 bg-black/5"
						}`}
					>
						<div
							className={`text-4xl font-bold ${
								theme === "dark" ? "text-green-400" : "text-green-600"
							}`}
						>
							12x Faster
						</div>
						<div
							className={`mt-2 text-sm ${
								theme === "dark" ? "text-white/60" : "text-black/60"
							}`}
						>
							From 6-8 weeks to 3-5 days
						</div>
					</motion.div>
				)}

				{/* Process Insights */}
				{mode === "comparison" && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className={`mt-6 rounded-xl border p-6 backdrop-blur-xl ${
							theme === "dark"
								? "border-white/20 bg-white/5"
								: "border-black/20 bg-black/5"
						}`}
					>
						<div className="grid gap-6 md:grid-cols-2">
							<div>
								<h4
									className={`mb-3 font-mono text-sm font-bold ${
										theme === "dark" ? "text-red-400" : "text-red-600"
									}`}
								>
									Old Process Bottlenecks
								</h4>
								<ul
									className={`space-y-2 text-sm ${
										theme === "dark" ? "text-white/70" : "text-black/70"
									}`}
								>
									<li>• 10 distinct handoff points</li>
									<li>• 4 separate approval gates</li>
									<li>• Context lost in translation</li>
									<li>• Only 3-4 people directly involved</li>
									<li>• Sequential dependencies</li>
								</ul>
							</div>
							<div>
								<h4
									className={`mb-3 font-mono text-sm font-bold ${
										theme === "dark" ? "text-green-400" : "text-green-600"
									}`}
								>
									New Process Advantages
								</h4>
								<ul
									className={`space-y-2 text-sm ${
										theme === "dark" ? "text-white/70" : "text-black/70"
									}`}
								>
									<li>• 6 streamlined steps</li>
									<li>• 1 team decision point</li>
									<li>• Direct customer-to-code connection</li>
									<li>• Anyone can contribute</li>
									<li>• Parallel collaboration</li>
								</ul>
							</div>
						</div>
					</motion.div>
				)}
			</motion.div>
		</div>
	);
}
