"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

interface Company {
	name: string;
	color: string;
}

const companyPool: Company[] = [
	{ name: "Railway", color: "#8B5CF6" },
	{ name: "Vercel", color: "#3B82F6" },
	{ name: "Linear", color: "#6366F1" },
	{ name: "Figma", color: "#F97316" },
	{ name: "Stripe", color: "#8B5CF6" },
	{ name: "Notion", color: "#EF4444" },
	{ name: "Planetscale", color: "#10B981" },
	{ name: "Resend", color: "#3B82F6" },
	{ name: "Supabase", color: "#22C55E" },
	{ name: "Clerk", color: "#8B5CF6" },
];

interface Touchpoint {
	companyIndex: number;
	day: number;
	type: "initial" | "followup1" | "followup2";
}

const dayLabels = [
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
	"Sun",
];

export function OutreachTracker() {
	const { theme } = useTheme();
	const [companies, setCompanies] = useState<number[]>([]);
	const [touchpoints, setTouchpoints] = useState<Touchpoint[]>([]);

	const addCompany = useCallback(() => {
		if (companies.length >= 10) return;

		const companyIndex = companies.length;
		const startDay = companyIndex; // Each new company starts on the next day

		setCompanies((prev) => [...prev, companyIndex]);
		setTouchpoints((prev) => [
			...prev,
			{ companyIndex, day: startDay, type: "initial" },
			{ companyIndex, day: startDay + 3, type: "followup1" },
			{ companyIndex, day: startDay + 7, type: "followup2" },
		]);
	}, [companies.length]);

	const reset = useCallback(() => {
		setCompanies([]);
		setTouchpoints([]);
	}, []);

	const getTouchpointsForDay = (day: number) =>
		touchpoints.filter((t) => t.day === day);

	const totalTouchpoints = touchpoints.filter((t) => t.day < 14).length;

	return (
		<div className="my-12">
			{/* Controls */}
			<div className="mb-6 flex flex-wrap items-center gap-3">
				<button
					type="button"
					onClick={addCompany}
					disabled={companies.length >= 10}
					className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
						companies.length >= 10
							? "cursor-not-allowed opacity-40"
							: theme === "dark"
								? "border-white/20 bg-white/5 text-white hover:bg-white/10"
								: "border-black/20 bg-black/5 text-black hover:bg-black/10"
					} disabled:cursor-not-allowed disabled:opacity-40`}
				>
					+ Add Company (Day {companies.length + 1})
				</button>
				{companies.length > 0 && (
					<button
						type="button"
						onClick={reset}
						className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
							theme === "dark"
								? "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
								: "border-black/20 bg-black/5 text-black/70 hover:bg-black/10"
						}`}
					>
						Reset
					</button>
				)}

				{/* Legend */}
				<div className="ml-auto flex items-center gap-4">
					<div className="flex items-center gap-1.5">
						<div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
						<span
							className={`text-[10px] ${
								theme === "dark"
									? "text-white/40"
									: "text-black/40"
							}`}
						>
							Initial
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<div className="h-2.5 w-2.5 rounded-full bg-violet-500" />
						<span
							className={`text-[10px] ${
								theme === "dark"
									? "text-white/40"
									: "text-black/40"
							}`}
						>
							+3 days
						</span>
					</div>
					<div className="flex items-center gap-1.5">
						<div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
						<span
							className={`text-[10px] ${
								theme === "dark"
									? "text-white/40"
									: "text-black/40"
							}`}
						>
							+7 days
						</span>
					</div>
				</div>
			</div>

			{/* Timeline grid */}
			<div
				className={`overflow-hidden rounded-xl border backdrop-blur-xl ${
					theme === "dark"
						? "border-white/20 bg-white/5"
						: "border-black/20 bg-black/5"
				}`}
			>
				{/* Week headers */}
				<div className="grid grid-cols-[80px_repeat(14,1fr)]">
					<div
						className={`border-b border-r p-2 ${
							theme === "dark"
								? "border-white/10"
								: "border-black/10"
						}`}
					/>
					{dayLabels.map((label, i) => (
						<div
							key={`header-${label}-${i < 7 ? "w1" : "w2"}`}
							className={`border-b p-2 text-center text-[10px] font-bold uppercase tracking-wider ${
								i === 6
									? theme === "dark"
										? "border-r border-r-white/20 border-b-white/10"
										: "border-r border-r-black/20 border-b-black/10"
									: theme === "dark"
										? "border-white/10"
										: "border-black/10"
							} ${
								i < 5 || (i > 6 && i < 12)
									? theme === "dark"
										? "text-white/40"
										: "text-black/40"
									: theme === "dark"
										? "text-white/20"
										: "text-black/20"
							}`}
						>
							{label}
							<div
								className={`text-[8px] font-normal ${
									theme === "dark"
										? "text-white/20"
										: "text-black/20"
								}`}
							>
								{i < 7 ? `W1` : `W2`}
							</div>
						</div>
					))}
				</div>

				{/* Company rows */}
				<AnimatePresence>
					{companies.length === 0 ? (
						<div
							className={`p-8 text-center text-sm ${
								theme === "dark"
									? "text-white/30"
									: "text-black/30"
							}`}
						>
							Click &quot;Add Company&quot; to start building your
							pipeline
						</div>
					) : (
						companies.map((companyIndex) => {
							const company = companyPool[companyIndex];
							return (
								<motion.div
									key={company.name}
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									transition={{ duration: 0.3 }}
									className="grid grid-cols-[80px_repeat(14,1fr)]"
								>
									{/* Company name */}
									<div
										className={`flex items-center border-b border-r px-2 py-3 ${
											theme === "dark"
												? "border-white/10"
												: "border-black/10"
										}`}
									>
										<div className="flex items-center gap-1.5">
											<div
												className="h-2 w-2 shrink-0 rounded-full"
												style={{
													backgroundColor:
														company.color,
												}}
											/>
											<span
												className={`text-[10px] font-medium sm:text-xs ${
													theme === "dark"
														? "text-white/70"
														: "text-black/70"
												}`}
											>
												{company.name}
											</span>
										</div>
									</div>

									{/* Day cells */}
									{dayLabels.map((_, dayIndex) => {
										const dayTouchpoints =
											getTouchpointsForDay(
												dayIndex,
											).filter(
												(t) =>
													t.companyIndex ===
													companyIndex,
											);
										return (
											<div
												key={`${company.name}-day-${dayIndex}`}
												className={`flex items-center justify-center border-b p-1 ${
													dayIndex === 6
														? theme === "dark"
															? "border-r border-r-white/20 border-b-white/10"
															: "border-r border-r-black/20 border-b-black/10"
														: theme === "dark"
															? "border-white/10"
															: "border-black/10"
												}`}
											>
												{dayTouchpoints.map((tp) => (
													<motion.div
														key={`${tp.companyIndex}-${tp.type}`}
														initial={{
															scale: 0,
															opacity: 0,
														}}
														animate={{
															scale: 1,
															opacity: 1,
														}}
														transition={{
															duration: 0.3,
															delay:
																tp.type ===
																"initial"
																	? 0
																	: tp.type ===
																		  "followup1"
																		? 0.15
																		: 0.3,
															ease: [
																0.34, 1.56,
																0.64, 1,
															],
														}}
														className={`h-4 w-4 rounded-full sm:h-5 sm:w-5 ${
															tp.type ===
															"initial"
																? "bg-blue-500 shadow-lg shadow-blue-500/30"
																: tp.type ===
																	  "followup1"
																	? "bg-violet-500 shadow-lg shadow-violet-500/30"
																	: "bg-emerald-500 shadow-lg shadow-emerald-500/30"
														}`}
														title={`${company.name}: ${
															tp.type ===
															"initial"
																? "Initial outreach"
																: tp.type ===
																	  "followup1"
																	? "First follow-up (+3 days)"
																	: "Second follow-up (+7 days)"
														}`}
													/>
												))}
											</div>
										);
									})}
								</motion.div>
							);
						})
					)}
				</AnimatePresence>

				{/* Summary bar */}
				{companies.length > 0 && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className={`flex items-center justify-between p-4 ${
							theme === "dark"
								? "bg-white/3"
								: "bg-black/3"
						}`}
					>
						<div className="flex items-center gap-6">
							<div>
								<div
									className={`text-lg font-bold ${
										theme === "dark"
											? "text-white"
											: "text-black"
									}`}
								>
									{companies.length}
								</div>
								<div
									className={`text-[10px] ${
										theme === "dark"
											? "text-white/40"
											: "text-black/40"
									}`}
								>
									Companies
								</div>
							</div>
							<div>
								<div
									className={`text-lg font-bold ${
										theme === "dark"
											? "text-white"
											: "text-black"
									}`}
								>
									{totalTouchpoints}
								</div>
								<div
									className={`text-[10px] ${
										theme === "dark"
											? "text-white/40"
											: "text-black/40"
									}`}
								>
									Touchpoints (2 weeks)
								</div>
							</div>
							<div>
								<div
									className={`text-lg font-bold ${
										theme === "dark"
											? "text-blue-400"
											: "text-blue-600"
									}`}
								>
									{companies.length * 3}
								</div>
								<div
									className={`text-[10px] ${
										theme === "dark"
											? "text-white/40"
											: "text-black/40"
									}`}
								>
									Total scheduled
								</div>
							</div>
						</div>
					</motion.div>
				)}
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
				<span className="font-bold">Watch it compound.</span> Click
				&quot;Add Company&quot; a few times. By the end of week one, you
				have 5 companies in your pipeline and 15 touchpoints scheduled.
				By week two, that&apos;s 10 companies and 30 touchpoints. This
				is a real pipeline, not a prayer.
			</motion.div>
		</div>
	);
}
