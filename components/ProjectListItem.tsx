"use client";

import { motion } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";
import type { Project } from "@/lib/projects-data";

interface ProjectListItemProps {
	project: Project;
	index: number;
	onHover: (project: Project | null) => void;
}

export function ProjectListItem({
	project,
	index,
	onHover,
}: ProjectListItemProps) {
	const { theme } = useTheme();

	return (
		<motion.li
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{
				duration: 0.5,
				delay: index * 0.1,
				ease: "easeOut",
			}}
		>
			<a
				href={project.url}
				target="_blank"
				rel="noopener noreferrer"
				onMouseEnter={() => onHover(project)}
				onMouseLeave={() => onHover(null)}
				className={`group flex items-baseline gap-3 py-2 transition-all ${
					theme === "dark"
						? "text-white hover:text-white/80"
						: "text-black hover:text-black/80"
				}`}
			>
				{/* Bullet point */}
				<span
					className={`text-xl ${
						theme === "dark" ? "text-white/40" : "text-black/40"
					}`}
				>
					•
				</span>

				{/* Project name */}
				<span className="text-lg font-medium transition-all group-hover:tracking-wide">
					{project.name}
				</span>

				{/* Description */}
				<span
					className={`text-sm ${
						theme === "dark" ? "text-white/50" : "text-black/50"
					}`}
				>
					{project.description}
				</span>

				{/* External link icon */}
				<svg
					className={`h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 ${
						theme === "dark" ? "text-white/40" : "text-black/40"
					}`}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<title>External link</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
					/>
				</svg>
			</a>
		</motion.li>
	);
}
