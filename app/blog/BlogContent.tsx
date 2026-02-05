"use client";

import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Post } from "@/lib/mdx";

export function BlogContent({ posts }: { posts: Post[] }) {
	const router = useRouter();
	const { theme } = useTheme();

	return (
		<div
			className={`fixed inset-0 overflow-y-auto transition-colors duration-300 ${
				theme === "dark" ? "bg-black" : "bg-white"
			}`}
		>
			<div className="mx-auto min-h-full max-w-3xl px-6 py-16 sm:px-8 lg:px-12">
				{/* Breadcrumbs */}
				<Breadcrumbs
					items={[{ label: "Home", href: "/" }, { label: "Blog" }]}
				/>

				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.6,
						ease: "easeOut",
					}}
					className="mb-16"
				>
					<h1
						className={`mb-4 text-6xl font-bold tracking-tight ${
							theme === "dark" ? "text-white" : "text-black"
						}`}
					>
						BLOG
					</h1>
					<p
						className={`text-lg ${
							theme === "dark" ? "text-white/50" : "text-black/50"
						}`}
					>
						Thoughts on building, engineering, and creating
					</p>
				</motion.div>

				{/* Posts list */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{
						duration: 0.6,
						delay: 0.2,
					}}
					className="space-y-12"
				>
					{posts.length === 0 ? (
						<div
							className={`py-16 text-center text-lg ${
								theme === "dark" ? "text-white/50" : "text-black/50"
							}`}
						>
							No posts yet. Check back soon!
						</div>
					) : (
						posts.map((post, index) => (
							<motion.article
								key={post.slug}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.5,
									delay: 0.3 + index * 0.1,
								}}
							>
								<a href={`/blog/${post.slug}`} className="group block">
									<div className="mb-3 flex items-center gap-4 text-sm">
										<time
											className={`font-mono tracking-wide ${
												theme === "dark" ? "text-white/40" : "text-black/40"
											}`}
										>
											{new Date(post.date + "T00:00:00").toLocaleDateString(
												"en-US",
												{
													year: "numeric",
													month: "long",
													day: "numeric",
													timeZone: "UTC",
												},
											)}
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
									<h2
										className={`mb-3 text-3xl font-bold tracking-tight transition-all group-hover:translate-x-1 ${
											theme === "dark"
												? "text-white group-hover:text-white/80"
												: "text-black group-hover:text-black/80"
										}`}
									>
										{post.title}
									</h2>
									<p
										className={`text-lg leading-relaxed ${
											theme === "dark" ? "text-white/60" : "text-black/60"
										}`}
									>
										{post.excerpt}
									</p>
								</a>
							</motion.article>
						))
					)}
				</motion.div>
			</div>
		</div>
	);
}
