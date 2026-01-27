"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";

interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface BreadcrumbsProps {
	items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
	const router = useRouter();
	const { theme } = useTheme();

	return (
		<motion.nav
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="mb-8"
			aria-label="Breadcrumb"
		>
			<ol className="flex items-center gap-2 text-sm">
				{items.map((item, index) => {
					const isLast = index === items.length - 1;

					return (
						<li key={index} className="flex items-center gap-2">
							{item.href ? (
								<motion.button
									type="button"
									onClick={() => router.push(item.href!)}
									className={`group relative overflow-hidden rounded-lg px-3 py-1.5 font-medium transition-all ${
										theme === "dark"
											? "text-white/60 hover:text-white"
											: "text-black/60 hover:text-black"
									}`}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									{/* Glass morphism background on hover */}
									<motion.div
										className="absolute inset-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
										style={{
											background:
												theme === "dark"
													? "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)"
													: "linear-gradient(135deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.02) 100%)",
											backdropFilter: "blur(10px)",
											WebkitBackdropFilter: "blur(10px)",
										}}
									/>
									<span className="relative z-10">{item.label}</span>
								</motion.button>
							) : (
								<span
									className={`rounded-lg px-3 py-1.5 font-medium ${
										theme === "dark" ? "text-white/40" : "text-black/40"
									}`}
								>
									{item.label}
								</span>
							)}

							{/* Separator */}
							{!isLast && (
								<svg
									className={`h-4 w-4 flex-shrink-0 ${
										theme === "dark" ? "text-white/20" : "text-black/20"
									}`}
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							)}
						</li>
					);
				})}
			</ol>
		</motion.nav>
	);
}

