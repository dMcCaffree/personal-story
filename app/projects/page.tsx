"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { ProjectListItem } from "@/components/ProjectListItem";
import { projects, type Project } from "@/lib/projects-data";
import Image from "next/image";

export default function ProjectsPage() {
	const router = useRouter();
	const { theme } = useTheme();
	const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

	return (
		<div
			className={`fixed inset-0 overflow-y-auto transition-colors duration-300 ${
				theme === "dark" ? "bg-black" : "bg-white"
			}`}
		>
			<div className="flex min-h-full w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
				<div className="w-full max-w-3xl">
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							ease: "easeOut",
						}}
						className="mb-8"
					>
						<h1
							className={`text-5xl font-bold tracking-wider ${
								theme === "dark" ? "text-white" : "text-black"
							}`}
						>
							PROJECTS
						</h1>
					</motion.div>

					{/* Project list */}
					<motion.ul
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							duration: 0.6,
							delay: 0.2,
						}}
						className="mb-12 space-y-1"
					>
						{projects.map((project, index) => (
							<ProjectListItem
								key={project.url}
								project={project}
								index={index}
								onHover={setHoveredProject}
							/>
						))}
					</motion.ul>

					{/* Back button */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							duration: 0.6,
							delay: 0.6,
						}}
					>
						<motion.button
							type="button"
							onClick={() => router.push("/")}
							className={`rounded-xl border px-8 py-3 font-mono text-sm tracking-wider transition-colors ${
								theme === "dark"
									? "border-white/20 hover:bg-white/10 text-white"
									: "border-black/20 hover:bg-black/10 text-black"
							}`}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							transition={{
								type: "spring",
								stiffness: 500,
								damping: 30,
								mass: 0.5,
							}}
						>
							BACK TO MENU
						</motion.button>
					</motion.div>
				</div>
			</div>

			{/* Screenshot panel - rendered at page level */}
			<AnimatePresence>
				{hoveredProject && (
					<motion.div
						initial={{ opacity: 0, x: 100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 100 }}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 30,
							mass: 0.8,
						}}
						className="pointer-events-none fixed sm:-right-96 lg:-right-64 xl:right-0 transform translate-x-1/2 top-1/2 z-9999 -translate-y-1/2 aspect-video"
						style={{
							height: "80vh",
						}}
					>
						<div
							className="h-full w-full overflow-hidden rounded-2xl border shadow-2xl"
							style={{
								borderColor:
									theme === "dark"
										? "rgba(255, 255, 255, 0.1)"
										: "rgba(0, 0, 0, 0.1)",
								background:
									theme === "dark"
										? "rgba(0, 0, 0, 0.8)"
										: "rgba(255, 255, 255, 0.8)",
							}}
						>
							<div className="relative h-full w-full">
								<Image
									src={hoveredProject.image}
									alt={`${hoveredProject.name} screenshot`}
									fill
									className="object-cover"
									unoptimized
								/>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
