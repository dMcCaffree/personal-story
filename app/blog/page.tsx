import { getAllPosts } from "@/lib/mdx";
import { BlogContent } from "./BlogContent";
import type { Metadata } from "next";

// Force static generation at build time - no runtime functions
export const dynamic = "force-static";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dustin.site";

export const metadata: Metadata = {
	title: "Blog | Dustin McCaffree",
	description:
		"Thoughts on software engineering, product development, and building things from scratch.",
	openGraph: {
		title: "Blog | Dustin McCaffree",
		description:
			"Thoughts on software engineering, product development, and building things from scratch.",
		url: `${baseUrl}/blog`,
		siteName: "Dustin McCaffree",
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary",
		title: "Blog | Dustin McCaffree",
		description:
			"Thoughts on software engineering, product development, and building things from scratch.",
		creator: "@dustinmccaffree",
	},
	alternates: {
		canonical: `${baseUrl}/blog`,
	},
};

async function getBlogPosts() {
	return getAllPosts();
}

export default async function BlogPage() {
	const posts = await getBlogPosts();
	return <BlogContent posts={posts} />;
}
