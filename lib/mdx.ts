import fs from "fs";
import path from "path";

const contentDirectory = path.join(process.cwd(), "content/blog");

export interface PostMetadata {
	title: string;
	date: string;
	excerpt: string;
	readTime: string;
	coverImageDark: string;
	coverImageLight: string;
	hasTimeline?: boolean;
	relatedPosts?: string[];
}

export interface Post extends PostMetadata {
	slug: string;
	content: string;
}

export async function getPost(slug: string): Promise<Post | null> {
	try {
		const filePath = path.join(contentDirectory, `${slug}.mdx`);
		const fileContent = fs.readFileSync(filePath, "utf8");

		// Extract metadata from the file
		const metadataMatch = fileContent.match(
			/export const metadata = ({[\s\S]*?})/,
		);

		if (!metadataMatch) {
			return null;
		}

		// Parse metadata
		const metadataString = metadataMatch[1];
		// biome-ignore lint: Using eval for simple metadata extraction
		const metadata = eval(`(${metadataString})`) as PostMetadata;

		return {
			slug,
			...metadata,
			content: fileContent,
		};
	} catch {
		return null;
	}
}

export function getAllPosts(): Post[] {
	try {
		if (!fs.existsSync(contentDirectory)) {
			return [];
		}

		const files = fs.readdirSync(contentDirectory);
		const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

		const posts = mdxFiles
			.map((file) => {
				const slug = file.replace(/\.mdx$/, "");
				const filePath = path.join(contentDirectory, file);
				const fileContent = fs.readFileSync(filePath, "utf8");

				const metadataMatch = fileContent.match(
					/export const metadata = ({[\s\S]*?})/,
				);
				if (!metadataMatch) return null;

				const metadataString = metadataMatch[1];
				// biome-ignore lint: Using eval for simple metadata extraction
				const metadata = eval(`(${metadataString})`) as PostMetadata;

				return {
					slug,
					...metadata,
					content: fileContent,
				};
			})
			.filter((post): post is Post => post !== null)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

		return posts;
	} catch {
		return [];
	}
}

