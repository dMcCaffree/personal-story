"use client";

import { motion } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MDXContent } from "./MDXContent";
import { ScrollTimeline } from "@/components/blog/ScrollTimeline";
import type { Post } from "@/lib/mdx";
import { useRef } from "react";

export function BlogPostContent({
	post,
	children,
}: {
	post: Post;
	children: React.ReactNode;
}) {
	const { theme } = useTheme();
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	return (
		<div
			ref={scrollContainerRef}
			className={`fixed inset-0 overflow-y-auto transition-colors duration-300 ${
				theme === "dark" ? "bg-black" : "bg-white"
			}`}
		>
			{/* Render timeline if post has it */}
			{post.hasTimeline && (
				<ScrollTimeline
					scrollContainerRef={
						scrollContainerRef as React.RefObject<HTMLDivElement>
					}
				/>
			)}
			<article className="mx-auto min-h-full max-w-3xl px-6 py-16 sm:px-8 lg:px-12">
				{/* Breadcrumbs */}
				<Breadcrumbs
					items={[
						{ label: "Home", href: "/" },
						{ label: "Blog", href: "/blog" },
						{ label: post.title },
					]}
				/>

				{/* Header */}
				<motion.header
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.6,
						ease: "easeOut",
					}}
					className="mb-16"
				>
					<div className="mb-6 flex items-center gap-4 text-sm">
						<time
							className={`font-mono tracking-wide ${
								theme === "dark" ? "text-white/40" : "text-black/40"
							}`}
						>
							{new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
								timeZone: "UTC",
							})}
						</time>
						<span
							className={`text-xs ${
								theme === "dark" ? "text-white/20" : "text-black/20"
							}`}
						>
							•
						</span>
						<span
							className={`font-mono tracking-wide ${
								theme === "dark" ? "text-white/40" : "text-black/40"
							}`}
						>
							{post.readTime} read
						</span>
					</div>
					<h1
						className={`mb-8 text-5xl font-bold leading-tight tracking-tight sm:text-6xl ${
							theme === "dark" ? "text-white" : "text-black"
						}`}
					>
						{post.title}
					</h1>

					{/* Cover Image */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.6,
							delay: 0.2,
						}}
						className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl"
					>
						<img
							src={
								theme === "dark" ? post.coverImageDark : post.coverImageLight
							}
							alt={post.title}
							className="h-full w-full object-cover"
						/>
					</motion.div>
				</motion.header>

				{/* Content */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{
						duration: 0.6,
						delay: 0.2,
					}}
				>
					<MDXContent>{children}</MDXContent>
				</motion.div>
			</article>
		</div>
	);
}
