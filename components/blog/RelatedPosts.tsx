"use client";

import { motion } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

interface RelatedPost {
	slug: string;
	title: string;
	excerpt: string;
	date: string;
	readTime: string;
	coverImageDark: string;
	coverImageLight: string;
}

export function RelatedPosts({ posts }: { posts: RelatedPost[] }) {
	const { theme } = useTheme();

	if (posts.length === 0) return null;

	return (
		<div className="mt-16">
			<h3
				className={`mb-6 text-sm font-bold uppercase tracking-wider ${
					theme === "dark" ? "text-white/40" : "text-black/40"
				}`}
			>
				Related Thoughts
			</h3>

			<div className={`grid gap-4 ${posts.length > 1 ? "sm:grid-cols-2" : "grid-cols-1"}`}>
				{posts.map((post, i) => (
					<motion.a
						key={post.slug}
						href={`/blog/${post.slug}`}
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.1, duration: 0.4 }}
						className={`group block overflow-hidden rounded-xl border transition-all hover:scale-[1.01] ${
							theme === "dark"
						? "border-white/10 bg-white/2 hover:border-white/20 hover:bg-white/5"
						: "border-black/10 bg-black/2 hover:border-black/20 hover:bg-black/5"
						}`}
					>
						{/* Cover image */}
						<div className="aspect-2/1 w-full overflow-hidden">
							<img
								src={theme === "dark" ? post.coverImageDark : post.coverImageLight}
								alt={post.title}
								className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>

						{/* Content */}
						<div className="p-4">
							<div className="mb-2 flex items-center gap-3 text-xs">
								<time
									className={`font-mono ${
										theme === "dark" ? "text-white/35" : "text-black/35"
									}`}
								>
									{new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
										timeZone: "UTC",
									})}
								</time>
								<span className={theme === "dark" ? "text-white/15" : "text-black/15"}>
									·
								</span>
								<span
									className={`font-mono ${
										theme === "dark" ? "text-white/35" : "text-black/35"
									}`}
								>
									{post.readTime}
								</span>
							</div>

							<h4
								className={`text-base font-bold leading-snug tracking-tight transition-colors ${
									theme === "dark"
										? "text-white group-hover:text-white/80"
										: "text-black group-hover:text-black/80"
								}`}
							>
								{post.title}
							</h4>

							<p
								className={`mt-1.5 line-clamp-2 text-sm leading-relaxed ${
									theme === "dark" ? "text-white/45" : "text-black/45"
								}`}
							>
								{post.excerpt}
							</p>
						</div>
					</motion.a>
				))}
			</div>
		</div>
	);
}
