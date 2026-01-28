import type { MDXComponents } from "mdx/types";
import { DiceRoller } from "@/components/blog/DiceRoller";
import { MadLibsPrompt } from "@/components/blog/MadLibsPrompt";
import { PromptGenerator } from "@/components/blog/PromptGenerator";

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		DiceRoller,
		MadLibsPrompt,
		PromptGenerator,
		h1: ({ children }) => (
			<h1 className="mb-8 text-5xl font-bold leading-tight tracking-tight">
				{children}
			</h1>
		),
		h2: ({ children }) => (
			<h2 className="mb-6 mt-16 text-3xl font-bold tracking-tight">
				{children}
			</h2>
		),
		h3: ({ children }) => (
			<h3 className="mb-4 mt-12 text-2xl font-semibold tracking-tight">
				{children}
			</h3>
		),
		p: ({ children }) => (
			<p className="mb-6 text-lg leading-relaxed">{children}</p>
		),
		ul: ({ children }) => (
			<ul className="mb-8 ml-6 list-disc space-y-2">{children}</ul>
		),
		ol: ({ children }) => (
			<ol className="mb-8 ml-6 list-decimal space-y-2">{children}</ol>
		),
		li: ({ children }) => <li className="leading-relaxed">{children}</li>,
		code: ({ children, className }) => {
			const isInline = !className;
			if (isInline) {
				return (
					<code className="rounded bg-black/10 px-2 py-1 font-mono text-base dark:bg-white/10">
						{children}
					</code>
				);
			}
			// Code block inside pre - no background, just inherit from pre
			return (
				<code className={`font-mono text-sm ${className || ""}`}>
					{children}
				</code>
			);
		},
		pre: ({ children }) => (
			<pre className="mb-8 overflow-x-auto rounded-xl border border-black/10 bg-black/5 p-6 dark:border-white/10 dark:bg-white/5">
				{children}
			</pre>
		),
		blockquote: ({ children }) => (
			<blockquote className="mb-8 border-l-4 border-black/20 pl-6 italic dark:border-white/20">
				{children}
			</blockquote>
		),
		a: ({ children, href }) => (
			<a
				href={href}
				className="underline decoration-black/30 underline-offset-4 transition-colors hover:decoration-black/60 dark:decoration-white/30 dark:hover:decoration-white/60"
				target={href?.startsWith("http") ? "_blank" : undefined}
				rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
			>
				{children}
			</a>
		),
		hr: () => (
			<hr className="my-12 border-black/10 dark:border-white/10" />
		),
		...components,
	};
}

