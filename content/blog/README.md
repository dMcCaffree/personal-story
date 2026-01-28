# Blog Content

This directory contains MDX blog posts for the personal story site.

## Articles

### How I Built This Site
**File**: `how-i-built-this-site.mdx`

The story behind creating an interactive AI-powered experience with video transitions and narration.

### How To Simulate Human Creativity in AI Image Generation Models
**File**: `simulate-creativity-ai-images.mdx`

An interactive article exploring techniques to break free from generic AI-generated images using controlled randomness and dice-rolling metaphors.

**Interactive Components**:
- `<DiceRoller />` - Single die roller demonstrating basic randomness
- `<MadLibsPrompt />` - Multiple dice with Mad Libs-style prompt filling
- `<PromptGenerator />` - Full JSON prompt generation system with 13 categories

**Note**: The PromptGenerator component includes a placeholder section for generated images. After using the generator to create prompts and generate actual images with your preferred AI model (Midjourney, DALL-E, etc.), you can add those images to the article.

## Adding New Blog Posts

1. Create a new `.mdx` file in this directory
2. Add metadata at the top following this pattern:

```mdx
export const metadata = {
  title: "Your Article Title",
  date: "YYYY-MM-DD",
  excerpt: "A brief description of the article",
  readTime: "X min",
  coverImageDark: "https://...",
  coverImageLight: "https://..."
}
```

3. Write your content using markdown
4. Use custom components by importing them in `mdx-components.tsx`
5. The article will automatically appear in the blog list

## Custom Components

Custom interactive components for blog articles are located in:
- `/components/blog/` - Blog-specific interactive components
- `/mdx-components.tsx` - MDX component configuration

## Dice Configuration

The dice rolling system configuration is in:
- `/lib/dice-config.ts` - 13 categories with 20 options each for image prompt generation
