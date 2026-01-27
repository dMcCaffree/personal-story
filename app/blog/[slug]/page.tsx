import { getPost, getAllPosts } from "@/lib/mdx";
import { BlogPostContent } from "./BlogPostContent";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export async function generateStaticParams() {
	const posts = getAllPosts();
	return posts.map((post) => ({
		slug: post.slug,
	}));
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
