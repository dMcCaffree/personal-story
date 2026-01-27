import { getAllPosts } from "@/lib/mdx";
import { BlogContent } from "./BlogContent";

async function getBlogPosts() {
	return getAllPosts();
}

export default async function BlogPage() {
	const posts = await getBlogPosts();
	return <BlogContent posts={posts} />;
}
