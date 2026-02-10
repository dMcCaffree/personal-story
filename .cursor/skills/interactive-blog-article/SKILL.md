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

### Core Principles

These are non-negotiable rules for every interactive component:

1. **Always use "use client"** - All interactive components must be client-side
2. **Theme-aware styling** - Use `useTheme()` from `@/contexts/ThemeContext` for every color decision
3. **Glass morphism aesthetic** - Backdrop blur, transparency, and subtle borders everywhere
4. **Blur crossfade transitions** - State changes blur out the old content and blur in the new. This is our signature animation.
5. **Responsive design** - Components work on mobile and desktop
6. **Data-driven architecture** - Define content as typed arrays/objects at the top of the file, render below

### Component Architecture Pattern

Every interactive component follows this exact structure:

```typescript
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

// 1. DATA FIRST: Define all content as typed arrays at the top
const items = [
  { name: "Option A", description: "...", /* fields */ },
  { name: "Option B", description: "...", /* fields */ },
];

// 2. COMPONENT: Stateful with blur crossfade
export function MyComponent() {
  const { theme } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = items[selectedIndex];

  return (
    <div className="my-12">
      {/* 3. SELECTOR: Tab-style buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        {items.map((item, i) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setSelectedIndex(i)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
              selectedIndex === i
                ? theme === "dark"
                  ? "border-white/40 bg-white/10 text-white"
                  : "border-black/40 bg-black/10 text-black"
                : theme === "dark"
                  ? "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
                  : "border-black/20 bg-black/5 text-black/70 hover:bg-black/10"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* 4. CONTENT: Blur crossfade between states */}
      <div className="relative">
        <AnimatePresence initial={false}>
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, filter: "blur(10px)", position: "absolute", inset: 0 }}
            animate={{ opacity: 1, filter: "blur(0px)", position: "relative" }}
            exit={{ opacity: 0, filter: "blur(10px)", position: "absolute", inset: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`rounded-xl border backdrop-blur-xl p-8 ${
              theme === "dark"
                ? "border-white/20 bg-white/5"
                : "border-black/20 bg-black/5"
            }`}
          >
            {/* Render selected content */}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 5. INSIGHT NOTE: Always end with a takeaway */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`mt-4 rounded-lg border p-4 text-sm ${
          theme === "dark"
            ? "border-white/10 bg-white/5 text-white/60"
            : "border-black/10 bg-black/5 text-black/60"
        }`}
      >
        <span className="font-bold">Key insight:</span> Explain what the reader
        should notice or take away from interacting with this component.
      </motion.div>
    </div>
  );
}
```

**This pattern is not optional.** Every interactive component must follow this 5-part structure: data at top, selector buttons, blur crossfade content, and an insight note at the bottom.

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

## Inline Preview Components

### LinkPreview Component

The `LinkPreview` component (`@/components/blog/LinkPreview.tsx`) provides rich preview tooltips for external links with Open Graph metadata.

**Usage in MDX**:

```markdown
Check out <LinkPreview href="https://example.com" ogImage="https://example.com/og.png" ogTitle="Example Site" ogDescription="A great example site">Example Site</LinkPreview> for inspiration.
```

**Props**:
- `href`: URL of the external link (required)
- `ogImage`: Open Graph image URL
- `ogTitle`: Page title
- `ogDescription`: Page description
- `children`: Link text content

**Behavior**:
- Shows a tooltip with OG metadata after 500ms hover delay
- Gracefully degrades to regular link if no OG data provided
- Handles image loading errors
- Theme-aware styling (dark/light mode)
- Displays site hostname

**Fetching OG Metadata with firecrawl-mcp**:

Use the `firecrawl-mcp` tools to scrape Open Graph metadata from websites:

```typescript
// Use the firecrawl_scrape tool with formats: ['markdown']
user-firecrawl-mcp-firecrawl_scrape({
  url: "https://example.com",
  formats: ["markdown"]
})
```

The tool returns metadata including `ogImage`, `ogTitle`, and `ogDescription` which can be directly used in the LinkPreview component.

**Important Notes**:
- Some sites (like Pinterest) may not be supported by Firecrawl
- Always check if the scraped `ogImage` is relative and convert to absolute URL if needed
- Test the link preview to ensure images load correctly

**Example from Article**:

```markdown
- <LinkPreview href="https://dribbble.com" ogImage="https://cdn.dribbble.com/assets/dribbble-logo-facebook-aa0c755e3a5efa2374e0d19b4bb9a02238385c5ff0cb6c0817c6d78c0d8d1506.png" ogTitle="Dribbble - Discover the World's Top Designers & Creative Professionals" ogDescription="Find Top Designers & Creative Professionals on Dribbble. We are where designers gain inspiration, feedback, community, and jobs.">**Dribbble**</LinkPreview> for interface design patterns
```

### FontPreview Component

The `FontPreview` component provides hover tooltips that display font samples.

**Usage in MDX**:

```markdown
Instead of <FontPreview fontName="Inter" fontFamily="Inter, sans-serif">Inter</FontPreview>, try something with personality.
```

**Props**:
- `fontName`: Display name of the font
- `fontFamily`: CSS font-family value
- `children`: Inline text to trigger tooltip

**Behavior**:
- Shows font sample after 500ms hover delay
- Displays font name and "quick brown fox" sample
- Theme-aware styling

### ColorSwatch Component

The `ColorSwatch` component displays inline color swatches next to hex codes.

**Usage in MDX**:

```markdown
Use colors like <ColorSwatch color="#FF6B6B">#FF6B6B</ColorSwatch> instead of default Tailwind colors.
```

**Props**:
- `color`: Hex color code
- `children`: Inline text (typically the hex code)

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

### The Design Language (2026 Aesthetic)

Our components follow a sleek, modern design language. This is NOT generic Tailwind. Every component should feel like it belongs in a polished, high-end product demo.

**Key characteristics:**
- Glass morphism with `backdrop-blur-xl` on every container
- Subtle transparency (`bg-white/5`, `bg-black/5`) instead of solid backgrounds
- Thin borders with low opacity (`border-white/20`, `border-black/20`)
- Generous padding and spacing (`p-8`, `my-12`)
- `rounded-xl` on primary containers, `rounded-lg` on secondary elements
- No hard shadows. Only subtle `shadow-lg` on colored elements.

### Glass Morphism Card (Primary Container)

```typescript
className={`rounded-xl border backdrop-blur-xl p-8 ${
  theme === "dark"
    ? "border-white/20 bg-white/5"
    : "border-black/20 bg-black/5"
}`}
```

### Insight Note (Secondary Container)

Every component ends with one of these. The bold lead-in text varies: "Pro tip:", "Notice the difference?", "The test:", "Watch the loop:", etc.

```typescript
className={`mt-4 rounded-lg border p-4 text-sm ${
  theme === "dark"
    ? "border-white/10 bg-white/5 text-white/60"
    : "border-black/10 bg-black/5 text-black/60"
}`}
```

### Tab Selector Buttons

Used in EVERY component that switches between views. Active state has higher opacity borders/backgrounds.

```typescript
// Active state
theme === "dark"
  ? "border-white/40 bg-white/10 text-white"
  : "border-black/40 bg-black/10 text-black"

// Inactive state
theme === "dark"
  ? "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
  : "border-black/20 bg-black/5 text-black/70 hover:bg-black/10"
```

### Badge/Chip Style

For labels, verdicts, status indicators. Use semantic colors on solid backgrounds.

```typescript
className="rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white"
```

### Semantic Color Coding

When showing comparisons or status:
- **Red/negative**: `border-red-500/30 bg-red-500/5` (dark) / `border-red-500/30 bg-red-50/50` (light)
- **Green/positive**: `border-green-500/30 bg-green-500/5` (dark) / `border-green-500/30 bg-green-50/50` (light)
- **Blue/interactive**: `border-blue-500/40 bg-blue-500/10` (dark) / `border-blue-600/40 bg-blue-50` (light)
- **Purple/input**: `border-violet-500/40 bg-violet-500/8` (dark) / `border-violet-600/40 bg-violet-50` (light)
- **Emerald/action**: `border-emerald-500/40 bg-emerald-500/8` (dark) / `border-emerald-600/40 bg-emerald-50` (light)

### Section Labels

Use uppercase tracking-wider labels to title sections within components:

```typescript
className={`text-xs font-bold uppercase tracking-wider ${
  theme === "dark" ? "text-white/40" : "text-black/40"
}`}
```

### Mini Browser Chrome

When simulating a browser window inside a component, always include the traffic light dots:

```typescript
<div className={`flex items-center gap-1.5 border-b px-3 py-1.5 ${
  theme === "dark" ? "border-white/10 bg-white/5" : "border-black/10 bg-black/5"
}`}>
  <div className="h-1.5 w-1.5 rounded-full bg-red-500/60" />
  <div className="h-1.5 w-1.5 rounded-full bg-yellow-500/60" />
  <div className="h-1.5 w-1.5 rounded-full bg-green-500/60" />
  <div className={`ml-2 rounded px-2 py-0.5 text-[8px] ${
    theme === "dark" ? "bg-white/10 text-white/30" : "bg-black/5 text-black/30"
  }`}>
    example.com
  </div>
</div>
```

### Action/Control Button

For "Run", "Roll", "Play" type buttons within components:

```typescript
className={`rounded-lg border px-4 py-2 text-xs font-medium transition-all ${
  theme === "dark"
    ? "border-white/20 bg-white/5 text-white hover:bg-white/10"
    : "border-black/20 bg-black/5 text-black hover:bg-black/10"
} disabled:cursor-not-allowed disabled:opacity-40`}
```

### Text Opacity Scale

Use these consistently for text hierarchy:
- **Primary text**: `text-white` / `text-black` (full opacity)
- **Secondary text**: `text-white/80` / `text-black/80`
- **Tertiary text**: `text-white/60` / `text-black/60`
- **Muted/labels**: `text-white/40` / `text-black/40`
- **Barely visible**: `text-white/30` / `text-black/30`

## Animation Patterns

### The Blur Crossfade (Signature Transition)

This is the most important animation pattern. It is used for **every** state transition where content changes. Old content blurs out while new content blurs in. This creates a sleek, modern feel that avoids jarring cuts.

```typescript
<div className="relative">
  <AnimatePresence initial={false}>
    <motion.div
      key={selectedIndex}  // MUST change to trigger animation
      initial={{ opacity: 0, filter: "blur(10px)", position: "absolute", inset: 0 }}
      animate={{ opacity: 1, filter: "blur(0px)", position: "relative" }}
      exit={{ opacity: 0, filter: "blur(10px)", position: "absolute", inset: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {/* content */}
    </motion.div>
  </AnimatePresence>
</div>
```

**Critical details:**
- `initial={false}` on AnimatePresence prevents the blur animation on first render
- The wrapping `<div className="relative">` is required for absolute positioning during crossfade
- `position: "absolute"` in initial/exit keeps both states overlapping during transition
- `position: "relative"` in animate ensures normal flow after transition completes
- Use `filter: "blur(10px)"` for standard content, `filter: "blur(12px)"` for larger content blocks, `filter: "blur(8px)"` for smaller elements
- Always 0.5s duration with easeInOut. This is the sweet spot.

### Staggered List Entry

For items that appear one after another (snapshot elements, checklist items):

```typescript
{items.map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: i * 0.04, duration: 0.3 }}
  >
    {/* content */}
  </motion.div>
))}
```

Use `delay: i * 0.04` for fast cascades (many items), `delay: i * 0.05` for medium cascades, `delay: i * 0.1` for slow/dramatic cascades.

### Delayed Fade In

For secondary content that appears after the main content:

```typescript
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
>
```

### Pulsing Highlight (Attention Indicator)

For elements that need to draw attention (like a targeted element in a simulation):

```typescript
animate={{
  boxShadow: [
    "0 0 0px 0px rgba(59,130,246,0)",
    "0 0 12px 4px rgba(59,130,246,0.5)",
    "0 0 0px 0px rgba(59,130,246,0)",
  ],
}}
transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
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

### Cascading Roll Effect

```typescript
for (let i = 0; i < items.length; i++) {
  await new Promise(resolve => setTimeout(resolve, 150)); // Stagger
  // Trigger animation for item i
}
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

### Component Design Rules

1. **One concept per component** - Each component illustrates a single idea. If it does two things, split it.
2. **Data-driven, not hardcoded** - All content lives in typed arrays/objects at the top of the file. The render logic is generic.
3. **Every state change uses blur crossfade** - No exceptions. No hard cuts. No slide-in/slide-out. Blur in, blur out.
4. **Every component has an insight note** - The bottom callout with bold lead text that tells the reader what to notice.
5. **Tab selectors for multi-view components** - Use the exact button pattern (active/inactive styles) shown above. Don't invent new selector patterns.
6. **Always `type="button"` on buttons** - Prevents form submission in MDX context.
7. **No `index` as `key`** - Use a meaningful identifier from the data (name, id, category).
8. **Extract reusable logic to `lib/` files** - Data configs, utility functions, etc.

### Theme Handling Rules

1. **Always use ternary with `theme === "dark"`** - Never use Tailwind's `dark:` prefix in interactive components. Always use the ThemeContext.
2. **Every color must have a dark AND light variant** - No color should look good in only one mode.
3. **Use opacity-based colors, not solid colors** - `bg-white/5` not `bg-gray-900`. `border-white/20` not `border-gray-700`. This is what gives the glass morphism effect.
4. **The only solid colors allowed** are semantic badges/chips (e.g., `bg-blue-600`, `bg-red-600`, `bg-green-600` for status indicators).

### What NOT To Do

- **Don't use Tailwind `dark:` classes** in interactive components (use ThemeContext ternaries instead)
- **Don't use solid backgrounds** on containers (`bg-gray-800` is wrong, `bg-white/5` is right)
- **Don't use `opacity-60`** for text (use `text-white/60` instead - it's the same effect but more explicit)
- **Don't use slide/transform animations** for state transitions (blur crossfade only)
- **Don't skip the insight note** at the bottom of the component
- **Don't use generic Tailwind card patterns** (no `shadow-md rounded-lg bg-white p-4`)
- **Don't use `indexOf` in event handlers** - capture the index from `map` directly
- **Don't forget `initial={false}` on AnimatePresence** - without it, the first render will blur in annoyingly

## Component Categories

When building interactive components, they generally fall into one of these categories. Use the right pattern for the right job.

### 1. Comparison/Switcher Components

**Use when**: The reader needs to see the same concept rendered differently (fonts, colors, code styles, before/after).

**Pattern**: Tab selector buttons + blur crossfade between states. See `FontComparison.tsx`, `ColorPaletteComparison.tsx`, `CopywritingComparison.tsx`, `AgentVisionDemo.tsx`.

**Structure**:
- Data array of options at top
- `selectedIndex` state to track which option is active
- Tab buttons to switch
- `AnimatePresence` with blur crossfade for content
- Insight note at bottom

### 2. Simulation/Stepper Components

**Use when**: Demonstrating a multi-step process (agent workflow, build pipeline, animation sequence).

**Pattern**: Play/step controls + blur crossfade between steps + visual representation. See `SnapshotSimulator.tsx`.

**Structure**:
- Steps array with `thought`, `action`, `highlight` fields
- `step` state + `isPlaying` state
- Auto-play function with `setTimeout` delays between steps
- Split layout (visual on left, data on right)
- Step counter (`Step 2/5`) in controls area

### 3. Inline Preview Components

**Use when**: Enriching inline text with hover tooltips (links, fonts, colors).

**Pattern**: `TooltipProvider` + `Tooltip` from `@/components/ui/tooltip` with glass morphism content. See `FontPreview.tsx`, `LinkPreview.tsx`, `ColorSwatch.tsx`.

**Structure**:
- Wraps inline `<span>` or `<a>` elements
- `TooltipContent` with `backdrop-blur-xl` and theme-aware borders
- `delayDuration={500}` on TooltipProvider
- `showArrow={false}` on TooltipContent (our style doesn't use arrows)
- `sideOffset={8}` for spacing

### 4. Complex Interactive Components

**Use when**: More elaborate interactions like 3D dice, drag-and-drop, multi-panel simulators.

**Pattern**: Custom state management + motion animations. See `DiceRoller.tsx`, `BrowserModes.tsx`.

**Structure**:
- Complex state (`isRolling`, `rotateX`, `rotateY`, etc.)
- Multiple animation phases
- Still wrapped in glass morphism container
- Still ends with insight note

## Example: Complete Interactive Component Flow

1. Create data config in `lib/my-config.ts`
2. Build component in `components/blog/MyDemo.tsx`
3. Register in `mdx-components.tsx`
4. Add to page component imports
5. Use `<MyDemo />` in MDX article
6. Test thoroughly

## Quick Reference Checklist

Before submitting any interactive component, verify all of the following:

- [ ] `"use client"` at the top
- [ ] `useTheme()` from `@/contexts/ThemeContext` for all colors
- [ ] Data defined as typed arrays/objects at the top of the file
- [ ] Tab selector buttons with exact active/inactive styling pattern
- [ ] `AnimatePresence initial={false}` wrapping blur crossfade
- [ ] Blur crossfade uses `filter: "blur(10px)"`, 0.5s duration, easeInOut
- [ ] `position: "absolute"/"relative"` pattern in crossfade initial/animate/exit
- [ ] Wrapping `<div className="relative">` around the AnimatePresence
- [ ] Glass morphism container: `rounded-xl border backdrop-blur-xl p-8` + theme ternary
- [ ] Insight note at the bottom with bold lead text
- [ ] `my-12` spacing on the outermost wrapper
- [ ] `type="button"` on all button elements
- [ ] Both dark and light mode look good
- [ ] No use of Tailwind `dark:` prefix (use ThemeContext ternaries)
- [ ] No solid backgrounds on containers (use transparency)
- [ ] No hard cuts between states (blur crossfade everywhere)

## Resources

- Motion.dev docs: https://motion.dev
- Tailwind CSS: Already configured
- Theme context: `@/contexts/ThemeContext`
- Existing components: Reference `components/blog/` for examples
- Best reference components: `FontComparison.tsx`, `ColorPaletteComparison.tsx`, `AgentVisionDemo.tsx`

