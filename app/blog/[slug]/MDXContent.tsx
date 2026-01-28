"use client";

import { useTheme } from "@/contexts/ThemeContext";

export function MDXContent({ children }: { children: React.ReactNode }) {
	const { theme } = useTheme();

	return (
		<div
			className={`prose prose-lg max-w-none ${
				theme === "dark"
					? "prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-5xl prose-h1:mb-8 prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4 prose-p:text-white/70 prose-p:leading-relaxed prose-p:text-lg prose-a:text-white prose-a:underline prose-a:decoration-white/30 prose-a:underline-offset-4 hover:prose-a:decoration-white/60 prose-a:transition-colors prose-strong:text-white prose-strong:font-semibold prose-code:text-white/90 prose-code:bg-white/10 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-base prose-code:before:content-none prose-code:after:content-none prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-li:text-white/70 prose-li:leading-relaxed prose-ul:my-8 prose-ol:my-8 prose-blockquote:border-l-white/20 prose-blockquote:text-white/60 prose-blockquote:italic prose-hr:border-white/10 prose-hr:my-12 [&_pre_code]:bg-transparent [&_pre_code]:p-0"
					: "prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-5xl prose-h1:mb-8 prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4 prose-p:text-black/70 prose-p:leading-relaxed prose-p:text-lg prose-a:text-black prose-a:underline prose-a:decoration-black/30 prose-a:underline-offset-4 hover:prose-a:decoration-black/60 prose-a:transition-colors prose-strong:text-black prose-strong:font-semibold prose-code:text-black/90 prose-code:bg-black/10 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-base prose-code:before:content-none prose-code:after:content-none prose-pre:bg-black/5 prose-pre:border prose-pre:border-black/10 prose-pre:rounded-xl prose-li:text-black/70 prose-li:leading-relaxed prose-ul:my-8 prose-ol:my-8 prose-blockquote:border-l-black/20 prose-blockquote:text-black/60 prose-blockquote:italic prose-hr:border-black/10 prose-hr:my-12 [&_pre_code]:bg-transparent [&_pre_code]:p-0"
			}`}
		>
			{children}
		</div>
	);
}

