import { getPost, getAllPosts } from "@/lib/mdx";
import { BlogPostContent } from "./BlogPostContent";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type { Metadata } from "next";

// Force static generation at build time - no runtime functions
export const dynamic = "force-static";
export const dynamicParams = false; // 404 for non-existent posts instead of generating on-demand

export async function generateStaticParams() {
	const posts = getAllPosts();
	return posts.map((post) => ({
		slug: post.slug,
	}));
}

// Generate metadata for each post (SEO + Open Graph)
export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const post = await getPost(slug);

	if (!post) {
		return {
			title: "Post Not Found",
		};
	}

	const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dustin.site";
	const postUrl = `${baseUrl}/blog/${slug}`;

	return {
		title: `${post.title} | Dustin McCaffree`,
		description: post.excerpt,
		authors: [{ name: "Dustin McCaffree" }],
		keywords: [
			"software engineering",
			"product development",
			"web development",
			"building in public",
		],
		openGraph: {
			title: post.title,
			description: post.excerpt,
			url: postUrl,
			siteName: "Dustin McCaffree",
			locale: "en_US",
			type: "article",
			publishedTime: post.date,
			authors: ["Dustin McCaffree"],
			images: [
				{
					url: post.coverImageDark,
					width: 1200,
					height: 630,
					alt: post.title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: post.title,
			description: post.excerpt,
			creator: "@dustinmccaffree",
			images: [post.coverImageDark],
		},
		alternates: {
			canonical: postUrl,
		},
	};
}

async function getPostData(slug: string) {
	return await getPost(slug);
}

export default async function BlogPostPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const post = await getPostData(slug);

	if (!post) {
		return (
			<div className="fixed inset-0 flex items-center justify-center bg-black text-white">
				<div className="text-center">
					<h1 className="mb-4 text-4xl font-bold">Post not found</h1>
					<a
						href="/blog"
						className="rounded-xl border border-white/20 px-8 py-3 font-mono text-sm tracking-wider transition-colors hover:bg-white/10"
					>
						BACK TO BLOG
					</a>
				</div>
			</div>
		);
	}

	// Remove metadata export from content for rendering
	const mdxContent = post.content.replace(
		/export const metadata = {[\s\S]*?}\n\n/,
		"",
	);

	// Render MDX in server component
	const content = (
		<MDXRemote
			source={mdxContent}
			options={{
				mdxOptions: {
					remarkPlugins: [remarkGfm],
					rehypePlugins: [rehypeHighlight],
				},
			}}
		/>
	);

	return <BlogPostContent post={post}>{content}</BlogPostContent>;
}
