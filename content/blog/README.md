# Blog Posts

This directory contains all blog posts written in MDX (Markdown + JSX).

## Adding a New Post

1. Create a new `.mdx` file in this directory (e.g., `my-new-post.mdx`)
2. Add the required metadata at the top:

```mdx
export const metadata = {
  title: "Your Post Title",
  date: "2026-01-27",
  excerpt: "A brief description that appears in the blog index.",
  readTime: "5 min"
}

# Your Post Title

Your content here...
```

3. Write your content using standard Markdown syntax
4. The post will automatically appear on the blog index page

## MDX Features

You can use:
- All standard Markdown syntax (headings, lists, links, etc.)
- GitHub Flavored Markdown (tables, task lists, strikethrough)
- Syntax highlighting for code blocks
- Custom React components (imported at the top of your MDX file)

## File Naming

The filename becomes the URL slug. For example:
- `welcome.mdx` → `/blog/welcome`
- `building-with-nextjs.mdx` → `/blog/building-with-nextjs`

Use lowercase and hyphens for best URL formatting.

