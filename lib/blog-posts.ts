export interface BlogPost {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	readTime: string;
}

// This will be dynamically loaded from MDX files
export const blogPosts: BlogPost[] = [];

