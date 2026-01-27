"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { MDXContent } from "./MDXContent";
import type { Post } from "@/lib/mdx";

export function BlogPostContent({
	post,
	children,
}: {
	post: Post;
	children: React.ReactNode;
}) {
	const router = useRouter();
	const { theme } = useTheme();

	return (
		<div
			className={`fixed inset-0 overflow-y-auto transition-colors duration-300 ${
				theme === "dark" ? "bg-black" : "bg-white"
			}`}
		>
			<article className="mx-auto min-h-full max-w-3xl px-6 py-16 sm:px-8 lg:px-12">
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
							{new Date(post.date).toLocaleDateString("en-US", {
								year: "numeric",
								month: "long",
								day: "numeric",
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

				{/* Navigation */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{
						duration: 0.6,
						delay: 0.4,
					}}
					className="mt-24 flex flex-wrap gap-3"
				>
					<motion.button
						type="button"
						onClick={() => router.push("/blog")}
						className={`group flex items-center gap-2 rounded-2xl border px-6 py-3.5 font-mono text-sm tracking-wider transition-all ${
							theme === "dark"
								? "border-white/20 hover:border-white/40 hover:bg-white/5 text-white"
								: "border-black/20 hover:border-black/40 hover:bg-black/5 text-black"
						}`}
						whileHover={{ x: -4 }}
						whileTap={{ scale: 0.98 }}
						transition={{
							type: "spring",
							stiffness: 400,
							damping: 25,
						}}
					>
						<span className="transition-transform group-hover:-translate-x-1">←</span>
						<span>ALL POSTS</span>
					</motion.button>
					<motion.button
						type="button"
						onClick={() => router.push("/")}
						className={`rounded-2xl border px-6 py-3.5 font-mono text-sm tracking-wider transition-all ${
							theme === "dark"
								? "border-white/20 hover:border-white/40 hover:bg-white/5 text-white"
								: "border-black/20 hover:border-black/40 hover:bg-black/5 text-black"
						}`}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						transition={{
							type: "spring",
							stiffness: 400,
							damping: 25,
						}}
					>
						HOME
					</motion.button>
				</motion.div>
			</article>
		</div>
	);
}

