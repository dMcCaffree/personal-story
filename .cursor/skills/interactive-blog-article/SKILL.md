---
name: interactive-blog-article
description: Create interactive blog articles with custom React components, 3D animations, and engaging demos. Use when writing new blog posts that need interactive elements, demonstrations, or custom visualizations.
---

# Interactive Blog Article Writer

Create engaging, interactive blog articles for the personal-story Next.js site with custom React components and demonstrations.

## When to Use

- Writing new blog articles with interactive elements
- Creating demos or visualizations within articles
- Building educational content with hands-on components
- Adding custom functionality to MDX blog posts

## Project Structure

### Blog Content Location
- Articles: `content/blog/*.mdx`
- Components: `components/blog/*.tsx`
- Supporting code: `lib/*.ts`

### Article Format

MDX files must start with metadata:

```typescript
export const metadata = {
  title: "Article Title",
  date: "YYYY-MM-DD",  // Use explicit date format to avoid timezone issues
  excerpt: "Brief description for previews",
  readTime: "X min",
  coverImageDark: "https://...",
  coverImageLight: "https://..."
}
```

**Important**: Use `"YYYY-MM-DD"` format for dates. The display code handles timezone conversion to show the correct date in all timezones.

## NOTES ON WRITING STYLE

Never use em dashes (`---`) in the metadata. Also, avoid AI writing tropes like "In this article, we'll...". Just write the article. Or using colons in the middle of a title or thought. That's not how humans write. Be casual and conversational but not slangy or silly. Write like me, Dustin McCaffree (@terribledustin).

## Creating Interactive Components

### Component Guidelines

1. **Always use "use client"** - All interactive components must be client-side
2. **Theme-aware styling** - Use `useTheme()` from `@/contexts/ThemeContext`
3. **Glass morphism aesthetic** - Match site style with backdrop blur and transparency
4. **Motion animations** - Use `motion.dev` (already installed) for smooth transitions
5. **Responsive design** - Components work on mobile and desktop

### Example Component Template

```typescript
"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

export function MyComponent() {
  const { theme } = useTheme();
  const [state, setState] = useState(null);

  return (
    <div className="my-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl border backdrop-blur-xl p-6 ${
          theme === "dark"
            ? "border-white/20 bg-white/5"
            : "border-black/20 bg-black/5"
        }`}
      >
        {/* Component content */}
      </motion.div>
    </div>
  );
}
```

## Integrating Components with MDX

### Step 1: Register Components

Add imports to `mdx-components.tsx`:

```typescript
import { MyComponent } from "@/components/blog/MyComponent";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    MyComponent,
    // ... other components
  };
}
```

### Step 2: Add to Page Template

Update `app/blog/[slug]/page.tsx` to pass components to MDXRemote:

```typescript
const content = (
  <MDXRemote
    source={mdxContent}
    options={{
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight],
      },
    }}
    components={{
      MyComponent,
      // ... other components
    }}
  />
);
```

### Step 3: Use in MDX

Simply use the component tag in your MDX:

```markdown
Here's some text.

<MyComponent />

More text continues...
```

## 3D Animations & Dice Pattern

### 3D CSS Transforms

When creating 3D elements (like dice):

```typescript
// Container needs perspective
<div style={{ perspective: "1000px" }}>
  <motion.div style={{ transformStyle: "preserve-3d" }}>
    {/* 3D faces */}
  </motion.div>
</div>
```

### Face Positioning for Cubes

```typescript
const faces = [
  { transform: "translateZ(48px)" },                    // front
  { transform: "translateZ(-48px) rotateY(180deg)" },  // back
  { transform: "rotateY(90deg) translateZ(48px)" },    // right
  { transform: "rotateY(-90deg) translateZ(48px)" },   // left
  { transform: "rotateX(90deg) translateZ(48px)" },    // top
  { transform: "rotateX(-90deg) translateZ(48px)" },   // bottom
];
```

### Rotation to Show Specific Face

```typescript
// Face rotations to show each face toward viewer
const faceRotations = [
  { x: 0, y: 0 },      // front (index 0)
  { x: 0, y: 180 },    // back (index 1)
  { x: 0, y: -90 },    // right (index 2)
  { x: 0, y: 90 },     // left (index 3)
  { x: -90, y: 0 },    // top (index 4)
  { x: 90, y: 0 },     // bottom (index 5)
];

// Add spins for animation
const baseSpinsX = Math.floor(Math.random() * 3 + 2) * 360;
const baseSpinsY = Math.floor(Math.random() * 3 + 2) * 360;
const finalRotation = faceRotations[faceIndex];

setRotateX(baseSpinsX + finalRotation.x);
setRotateY(baseSpinsY + finalRotation.y);
setRotateZ(0); // Always keep Z at 0 to avoid gimbal lock
```

**Critical**: Always keep Z rotation at 0 or multiples of 360 to prevent gimbal lock issues.

## Common Pitfalls & Solutions

### 1. Closure Issues in Loops

**Problem**: State updates in async loops capture stale values

**Solution**: Capture the value immediately and set it atomically

```typescript
// BAD - closure captures wrong values
for (let i = 0; i < items.length; i++) {
  setState(prev => { /* update i */ });
  setTimeout(() => {
    setState(prev => { /* i is wrong here */ });
  }, 1000);
}

// GOOD - capture values immediately
const capturedValues = {};
for (let i = 0; i < items.length; i++) {
  const index = i; // Closure capture
  setState(prev => {
    const value = calculateValue(index);
    capturedValues[index] = value; // Store immediately
    return updateState(prev, index, value);
  });
}
```

### 2. Timezone Issues with Dates

**Problem**: "2026-01-28" displays as previous day in certain timezones

**Solution**: Always use UTC timezone in date display

```typescript
// Add T00:00:00 and timeZone: "UTC"
new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
})
```

### 3. Code Block Styling

**Problem**: Double backgrounds on code inside pre tags

**Solution**: Override code styling inside pre blocks

```typescript
// In MDXContent.tsx or similar
className="[&_pre_code]:bg-transparent [&_pre_code]:p-0"
```

### 4. 3D Rotation Mismatches

**Problem**: Dice show wrong face despite correct rotation

**Solution**: Use explicit if/else instead of array mapping, keep Z at 0

```typescript
let finalX = baseSpinsX;
let finalY = baseSpinsY;

if (faceIndex === 1) finalY = baseSpinsY + 180;
else if (faceIndex === 2) finalY = baseSpinsY - 90;
else if (faceIndex === 3) finalY = baseSpinsY + 90;
else if (faceIndex === 4) finalX = baseSpinsX - 90;
else if (faceIndex === 5) finalX = baseSpinsX + 90;
// Index 0 uses baseSpins as-is
```

## Styling Patterns

### Glass Morphism Card

```typescript
className={`rounded-xl border backdrop-blur-xl p-6 ${
  theme === "dark"
    ? "border-white/20 bg-white/5"
    : "border-black/20 bg-black/5"
}`}
```

### Chip/Badge Style

```typescript
className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 font-bold text-white shadow-sm mx-0.5"
```

### Button Style

```typescript
className={`rounded-xl border px-8 py-3 font-mono text-sm tracking-wider backdrop-blur-xl transition-all ${
  theme === "dark"
    ? "border-white/20 bg-white/5 text-white hover:bg-white/10"
    : "border-black/20 bg-black/5 text-black hover:bg-black/10"
} disabled:opacity-50 disabled:cursor-not-allowed`}
```

## Animation Patterns

### Staggered Grid Animation

```typescript
{items.map((item, index) => (
  <motion.div
    key={index}
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
  >
    {/* content */}
  </motion.div>
))}
```

### Cascading Roll Effect

```typescript
for (let i = 0; i < items.length; i++) {
  await new Promise(resolve => setTimeout(resolve, 150)); // Stagger
  // Trigger animation for item i
}
```

### Pop-in with Bounce

```typescript
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ 
    duration: 0.3,
    ease: [0.34, 1.56, 0.64, 1] // Bouncy easing
  }}
>
```

## Data Management

### Configuration Files

Store reusable data in `lib/` directory:

```typescript
// lib/my-data.ts
export const categories = {
  option1: ["Value 1", "Value 2", ...],
  option2: ["Other 1", "Other 2", ...],
};

export function rollDie(category: keyof typeof categories): string {
  const options = categories[category];
  return options[Math.floor(Math.random() * options.length)];
}
```

## Testing Interactive Components

1. **Roll/interact multiple times** - Ensure consistency
2. **Check both themes** - Dark and light mode
3. **Test mobile/desktop** - Responsive behavior
4. **Verify state management** - No stale closures
5. **Check animations** - Smooth, no jank

## Best Practices

- Keep components focused on one purpose
- Extract reusable logic to lib files
- Use TypeScript for type safety
- Add loading states for async operations
- Include helpful explanatory text
- Make interactions obvious (clear buttons/affordances)
- Test with multiple rapid interactions
- Consider accessibility (keyboard navigation where applicable)

## Example: Complete Interactive Component Flow

1. Create data config in `lib/my-config.ts`
2. Build component in `components/blog/MyDemo.tsx`
3. Register in `mdx-components.tsx`
4. Add to page component imports
5. Use `<MyDemo />` in MDX article
6. Test thoroughly

## Resources

- Motion.dev docs: https://motion.dev
- Tailwind CSS: Already configured
- Theme context: `@/contexts/ThemeContext`
- Existing components: Reference `components/blog/` for examples

