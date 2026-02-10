"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

// 1. DATA FIRST
interface Metric {
	label: string;
	traditional: string;
	aiNative: string;
	traditionalScore: number; // 0-100 for bar width
	aiNativeScore: number;
	higherIsBetter: boolean;
}

interface AgencyType {
	name: string;
	emoji: string;
	description: string;
	metrics: Metric[];
	bottomLine: {
		traditional: string;
		aiNative: string;
	};
}

const agencyTypes: AgencyType[] = [
	{
		name: "Design Firm",
		emoji: "🎨",
		description:
			"Brand identity, web design, UI/UX. Traditionally requires senior designers for every project.",
		metrics: [
			{
				label: "Gross margin",
				traditional: "25%",
				aiNative: "75%",
				traditionalScore: 25,
				aiNativeScore: 75,
				higherIsBetter: true,
			},
			{
				label: "Time to deliver",
				traditional: "2-4 weeks",
				aiNative: "1-2 days",
				traditionalScore: 80,
				aiNativeScore: 15,
				higherIsBetter: false,
			},
			{
				label: "Clients per team member",
				traditional: "2-3",
				aiNative: "20-30",
				traditionalScore: 10,
				aiNativeScore: 90,
				higherIsBetter: true,
			},
			{
				label: "Cost per deliverable",
				traditional: "$5,000-15,000",
				aiNative: "$200-500",
				traditionalScore: 85,
				aiNativeScore: 10,
				higherIsBetter: false,
			},
			{
				label: "Revision cycles",
				traditional: "3-5 rounds",
				aiNative: "Unlimited, instant",
				traditionalScore: 60,
				aiNativeScore: 95,
				higherIsBetter: true,
			},
		],
		bottomLine: {
			traditional: "$180K rev/employee",
			aiNative: "$1.2M rev/employee",
		},
	},
	{
		name: "Ad Agency",
		emoji: "📺",
		description:
			"Video ads, social campaigns, creative production. Physical shoots and post-production used to be the bottleneck.",
		metrics: [
			{
				label: "Gross margin",
				traditional: "20%",
				aiNative: "70%",
				traditionalScore: 20,
				aiNativeScore: 70,
				higherIsBetter: true,
			},
			{
				label: "Time to deliver",
				traditional: "4-8 weeks",
				aiNative: "2-5 days",
				traditionalScore: 90,
				aiNativeScore: 20,
				higherIsBetter: false,
			},
			{
				label: "Clients per team member",
				traditional: "1-2",
				aiNative: "15-25",
				traditionalScore: 8,
				aiNativeScore: 85,
				higherIsBetter: true,
			},
			{
				label: "Cost per deliverable",
				traditional: "$20,000-80,000",
				aiNative: "$500-2,000",
				traditionalScore: 95,
				aiNativeScore: 12,
				higherIsBetter: false,
			},
			{
				label: "Creative variants",
				traditional: "2-3 concepts",
				aiNative: "50+ concepts",
				traditionalScore: 15,
				aiNativeScore: 95,
				higherIsBetter: true,
			},
		],
		bottomLine: {
			traditional: "$150K rev/employee",
			aiNative: "$900K rev/employee",
		},
	},
	{
		name: "Law Firm",
		emoji: "⚖️",
		description:
			"Contract drafting, compliance review, regulatory filings. Junior associates used to bill weeks for document work.",
		metrics: [
			{
				label: "Gross margin",
				traditional: "35%",
				aiNative: "80%",
				traditionalScore: 35,
				aiNativeScore: 80,
				higherIsBetter: true,
			},
			{
				label: "Time to deliver",
				traditional: "1-3 weeks",
				aiNative: "Hours",
				traditionalScore: 70,
				aiNativeScore: 10,
				higherIsBetter: false,
			},
			{
				label: "Clients per team member",
				traditional: "5-8",
				aiNative: "40-60",
				traditionalScore: 12,
				aiNativeScore: 85,
				higherIsBetter: true,
			},
			{
				label: "Cost per deliverable",
				traditional: "$3,000-25,000",
				aiNative: "$100-800",
				traditionalScore: 80,
				aiNativeScore: 8,
				higherIsBetter: false,
			},
			{
				label: "Error rate",
				traditional: "Human variance",
				aiNative: "Consistent + reviewed",
				traditionalScore: 40,
				aiNativeScore: 85,
				higherIsBetter: true,
			},
		],
		bottomLine: {
			traditional: "$220K rev/employee",
			aiNative: "$1.5M rev/employee",
		},
	},
	{
		name: "Marketing Agency",
		emoji: "📊",
		description:
			"SEO, content, email campaigns, social media management. Scale was always limited by the number of writers and strategists.",
		metrics: [
			{
				label: "Gross margin",
				traditional: "22%",
				aiNative: "72%",
				traditionalScore: 22,
				aiNativeScore: 72,
				higherIsBetter: true,
			},
			{
				label: "Time to deliver",
				traditional: "1-2 weeks",
				aiNative: "Same day",
				traditionalScore: 65,
				aiNativeScore: 10,
				higherIsBetter: false,
			},
			{
				label: "Clients per team member",
				traditional: "3-5",
				aiNative: "30-50",
				traditionalScore: 10,
				aiNativeScore: 90,
				higherIsBetter: true,
			},
			{
				label: "Cost per deliverable",
				traditional: "$1,500-5,000",
				aiNative: "$50-300",
				traditionalScore: 70,
				aiNativeScore: 8,
				higherIsBetter: false,
			},
			{
				label: "Content volume",
				traditional: "10-20 pieces/mo",
				aiNative: "200+ pieces/mo",
				traditionalScore: 15,
				aiNativeScore: 95,
				higherIsBetter: true,
			},
		],
		bottomLine: {
			traditional: "$140K rev/employee",
			aiNative: "$1.1M rev/employee",
		},
	},
];

// 2. COMPONENT
export function AgencyEconomics() {
	const { theme } = useTheme();
	const [selectedIndex, setSelectedIndex] = useState(0);
	const selected = agencyTypes[selectedIndex];

	return (
		<div className="my-12">
			{/* 3. SELECTOR */}
			<div className="mb-6 flex flex-wrap gap-2">
				{agencyTypes.map((agency, i) => (
					<button
						key={agency.name}
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
						<span className="mr-1.5">{agency.emoji}</span>
						{agency.name}
					</button>
				))}
			</div>

			{/* 4. CONTENT: Blur crossfade */}
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
						{/* Description */}
						<p
							className={`mb-6 text-sm ${
								theme === "dark" ? "text-white/60" : "text-black/60"
							}`}
						>
							{selected.description}
						</p>

						{/* Column headers */}
						<div className="mb-4 flex items-center justify-end gap-4">
							<span
								className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
									theme === "dark"
										? "bg-red-500/10 text-red-400"
										: "bg-red-50 text-red-600"
								}`}
							>
								Traditional
							</span>
							<span
								className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
									theme === "dark"
										? "bg-emerald-500/10 text-emerald-400"
										: "bg-emerald-50 text-emerald-600"
								}`}
							>
								AI-Native
							</span>
						</div>

						{/* Metrics */}
						<div className="space-y-5">
							{selected.metrics.map((metric, i) => {
								const tradIsGood =
									metric.higherIsBetter
										? metric.traditionalScore > metric.aiNativeScore
										: metric.traditionalScore < metric.aiNativeScore;
								const aiIsGood = !tradIsGood;

								return (
									<motion.div
										key={metric.label}
										initial={{ opacity: 0, x: -8 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: i * 0.05, duration: 0.3 }}
									>
										<div
											className={`mb-2 text-sm font-medium ${
												theme === "dark" ? "text-white/80" : "text-black/80"
											}`}
										>
											{metric.label}
										</div>

										{/* Traditional bar */}
										<div className="mb-1.5 flex items-center gap-3">
											<div
												className={`h-2 flex-1 overflow-hidden rounded-full ${
													theme === "dark" ? "bg-white/10" : "bg-black/10"
												}`}
											>
												<motion.div
													initial={{ width: 0 }}
													animate={{
														width: `${metric.traditionalScore}%`,
													}}
													transition={{
														delay: i * 0.05 + 0.1,
														duration: 0.6,
														ease: "easeOut",
													}}
													className={`h-full rounded-full ${
														tradIsGood ? "bg-emerald-500" : "bg-red-400"
													}`}
												/>
											</div>
											<span
												className={`w-28 text-right text-xs font-bold sm:w-36 ${
													tradIsGood ? "text-emerald-500" : "text-red-400"
												}`}
											>
												{metric.traditional}
											</span>
										</div>

										{/* AI-Native bar */}
										<div className="flex items-center gap-3">
											<div
												className={`h-2 flex-1 overflow-hidden rounded-full ${
													theme === "dark" ? "bg-white/10" : "bg-black/10"
												}`}
											>
												<motion.div
													initial={{ width: 0 }}
													animate={{
														width: `${metric.aiNativeScore}%`,
													}}
													transition={{
														delay: i * 0.05 + 0.2,
														duration: 0.6,
														ease: "easeOut",
													}}
													className={`h-full rounded-full ${
														aiIsGood ? "bg-emerald-500" : "bg-red-400"
													}`}
												/>
											</div>
											<span
												className={`w-28 text-right text-xs font-bold sm:w-36 ${
													aiIsGood ? "text-emerald-500" : "text-red-400"
												}`}
											>
												{metric.aiNative}
											</span>
										</div>
									</motion.div>
								);
							})}
						</div>

						{/* Bottom line comparison */}
						<div className="mt-6 grid grid-cols-2 gap-3">
							<div
								className={`rounded-lg border p-4 text-center ${
									theme === "dark"
										? "border-red-500/30 bg-red-500/5"
										: "border-red-500/30 bg-red-50/50"
								}`}
							>
								<div
									className={`text-xs font-bold uppercase tracking-wider ${
										theme === "dark" ? "text-red-400/60" : "text-red-600/60"
									}`}
								>
									Traditional
								</div>
								<div className="mt-1 text-lg font-bold text-red-400 sm:text-xl">
									{selected.bottomLine.traditional}
								</div>
							</div>
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
									{selected.bottomLine.aiNative}
								</div>
							</div>
						</div>
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
				<span className="font-bold">Notice the pattern.</span> The margin
				gap isn&apos;t 10-20%. It&apos;s 3-4x. When your biggest cost shifts
				from salaries to API calls, the economics of service businesses
				fundamentally change. That&apos;s what YC means by &ldquo;software
				margins.&rdquo;
			</motion.div>
		</div>
	);
}
