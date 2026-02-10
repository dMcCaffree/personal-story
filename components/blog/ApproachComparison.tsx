"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

interface Metric {
	label: string;
	massApply: string;
	targeted: string;
	massApplyScore: number; // 0-100 for visual bar
	targetedScore: number;
}

const metrics: Metric[] = [
	{
		label: "Applications per month",
		massApply: "100+",
		targeted: "~20",
		massApplyScore: 95,
		targetedScore: 20,
	},
	{
		label: "Time per application",
		massApply: "2-5 minutes",
		targeted: "2-3 hours",
		massApplyScore: 10,
		targetedScore: 85,
	},
	{
		label: "Response rate",
		massApply: "2-4%",
		targeted: "30-50%",
		massApplyScore: 4,
		targetedScore: 45,
	},
	{
		label: "Interview conversion",
		massApply: "~1%",
		targeted: "~25%",
		massApplyScore: 3,
		targetedScore: 25,
	},
	{
		label: "Personalization",
		massApply: "None",
		targeted: "Custom deliverable",
		massApplyScore: 2,
		targetedScore: 95,
	},
	{
		label: "Offer likelihood",
		massApply: "Low",
		targeted: "High",
		massApplyScore: 5,
		targetedScore: 80,
	},
];

const approaches = [
	{
		name: "Mass Apply",
		description:
			"Blast your resume to every open position. LinkedIn Easy Apply. Spray and pray.",
		color: "red" as const,
	},
	{
		name: "One Per Day",
		description:
			"Pick one company daily. Research deeply. Create something specific. Reach out to everyone.",
		color: "green" as const,
	},
];

export function ApproachComparison() {
	const { theme } = useTheme();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const selected = approaches[selectedIndex];

	return (
		<div className="my-12">
			{/* Selector */}
			<div className="mb-6 flex flex-wrap gap-2">
				{approaches.map((approach, i) => (
					<button
						key={approach.name}
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
						{approach.name}
					</button>
				))}
			</div>

			{/* Content */}
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
						{/* Approach description */}
						<p
							className={`mb-6 text-sm ${
								theme === "dark" ? "text-white/60" : "text-black/60"
							}`}
						>
							{selected.description}
						</p>

						{/* Metrics */}
						<div className="space-y-4">
							{metrics.map((metric, i) => {
								const value =
									selectedIndex === 0
										? metric.massApply
										: metric.targeted;
								const score =
									selectedIndex === 0
										? metric.massApplyScore
										: metric.targetedScore;
								const isGood =
									selectedIndex === 1 &&
									metric.label !== "Applications per month";
								const isBad =
									selectedIndex === 0 &&
									metric.label !== "Applications per month";

								return (
									<motion.div
										key={metric.label}
										initial={{ opacity: 0, x: -8 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{
											delay: i * 0.05,
											duration: 0.3,
										}}
									>
										<div className="mb-1.5 flex items-center justify-between">
											<span
												className={`text-sm font-medium ${
													theme === "dark"
														? "text-white/80"
														: "text-black/80"
												}`}
											>
												{metric.label}
											</span>
											<span
												className={`text-sm font-bold ${
													isGood
														? "text-green-500"
														: isBad
															? "text-red-400"
															: theme === "dark"
																? "text-white"
																: "text-black"
												}`}
											>
												{value}
											</span>
										</div>
										<div
											className={`h-1.5 overflow-hidden rounded-full ${
												theme === "dark"
													? "bg-white/10"
													: "bg-black/10"
											}`}
										>
											<motion.div
												initial={{ width: 0 }}
												animate={{ width: `${score}%` }}
												transition={{
													delay: i * 0.05 + 0.1,
													duration: 0.6,
													ease: "easeOut",
												}}
												className={`h-full rounded-full ${
													isGood
														? "bg-green-500"
														: isBad
															? "bg-red-400"
															: selected.color === "green"
																? "bg-green-500"
																: "bg-red-400"
												}`}
											/>
										</div>
									</motion.div>
								);
							})}
						</div>

						{/* Summary stat */}
						<div
							className={`mt-6 rounded-lg border p-4 text-center ${
								selectedIndex === 0
									? theme === "dark"
										? "border-red-500/30 bg-red-500/5"
										: "border-red-500/30 bg-red-50/50"
									: theme === "dark"
										? "border-green-500/30 bg-green-500/5"
										: "border-green-500/30 bg-green-50/50"
							}`}
						>
							<div
								className={`text-2xl font-bold ${
									selectedIndex === 0
										? "text-red-400"
										: "text-green-500"
								}`}
							>
								{selectedIndex === 0 ? "~1 offer" : "~5 offers"}
							</div>
							<div
								className={`text-xs ${
									theme === "dark"
										? "text-white/40"
										: "text-black/40"
								}`}
							>
								Expected offers per 100 applications
							</div>
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
				<span className="font-bold">The math isn&apos;t close.</span> Twenty
				targeted applications a month with a 40% response rate beats 100
				generic ones with a 2% rate every time. And that&apos;s before you
				factor in the quality of conversations you&apos;re having.
			</motion.div>
		</div>
	);
}
