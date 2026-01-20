# Interactive Asides Guide

## Overview
Asides are clickable objects in scenes that play alternative narrations. When clicked, they replace the main narration with a micro-story, keeping the same visual keyframe.

## How It Works

### 1. **Scene Configuration** (`data/scenes.ts`)
Each scene can have an array of asides:

```typescript
{
  index: 1,
  title: "Brace Yourself",
  hasAsides: true,
  asides: [
    {
      id: "books",           // Must match filename (books.png, books.mp3)
      name: "Books",          // Display name
      position: {
        top: "30%",          // Distance from top (% of viewport)
        left: "20%",         // Distance from left (% of viewport)  
        width: "15%",        // Width of clickable area
        height: "20%"        // Height of clickable area
      }
    }
  ]
}
```

### 2. **Asset URLs**
Assets are automatically loaded from:
- **Images**: `https://file.swell.so/story/asides/scene-001/{id}.png`
- **Audio**: `https://file.swell.so/story/asides/scene-001/{id}.mp3`

### 3. **Positioning with Source Coordinates**

Asides are positioned using **source image coordinates** (measured in your image editor). The system automatically adjusts for `object-cover` cropping at any screen size!

**How it works:**
- Base image dimensions: **2752×1536**
- Measure object position (X, Y) and size (width, height) in your image editor
- The system calculates the correct screen position accounting for aspect ratio cropping
- Objects stay pixel-perfect aligned regardless of screen size

**Example:**
```typescript
{
  id: "books",
  name: "Books",
  source: { x: 215, y: 1064, width: 509.87, height: 295.5 },
}
```

**How to measure:**
1. Open your keyframe image in an image editor (Photoshop, Figma, etc.)
2. Select the Rectangle tool and draw around your object
3. Note the X, Y coordinates (top-left corner)
4. Note the width and height
5. Add these values to the `source` object in `scenes.ts`

**Why this works:**
- When the viewport is wider than 16:9, the image crops top/bottom
- When the viewport is taller than 16:9, the image crops left/right
- The `useImageCoverPosition` hook recalculates positions on resize
- Objects stay aligned with the source image at any aspect ratio

### 4. **Behavior**
- ✨ Hover: Glow effect appears
- 🎵 Click: Plays aside audio, pauses main narration
- 🔵 Active indicator: Shows which aside is playing
- ↩️ On End: Audio stops, aside indicator clears

### 5. **Scene 1 Asides**
Currently configured:
- **books** - Placeholder at 30% top, 20% left
- **mask** - Placeholder at 40% top, 50% left
- **shoes** - Placeholder at 70% top, 30% left  
- **teeth** - Placeholder at 50% top, 70% left
- **vineyard** - Placeholder at 20% top, 80% left

## Adding Asides to Other Scenes

1. Upload assets to R2: `asides/scene-{XXX}/{id}.png` and `.mp3`
2. Update scene in `data/scenes.ts`:
   ```typescript
   {
     index: 2,
     title: "Your Scene",
     hasAsides: true,
     asides: [
       {
         id: "your-object",
         name: "Your Object Name",
         position: { top: "50%", left: "50%", width: "10%", height: "10%" }
       }
     ]
   }
   ```
3. Position objects by adjusting percentages

## Tips
- **Use viewport units (`vw`/`vh`) for consistent scaling** across screen sizes
- The image uses `object-cover` to fill the entire screen (may crop on different aspect ratios)
- Start with `width: "10vw"` and `height: "10vh"` then adjust
- Use browser dev tools to inspect positioning
- Position objects on your primary viewing device/aspect ratio
- Objects scale on hover (1.05x) for feedback
- Only one aside can play at a time
- Asides are hidden during scene transitions

## Positioning Examples

**Source coordinates (recommended):**
```typescript
{
  id: "books",
  name: "Books",
  source: { x: 215, y: 1064, width: 509.87, height: 295.5 },
}
```

**All placeholder asides in Scene 1:**
```typescript
asides: [
  {
    id: "books",
    name: "Books",
    source: { x: 215, y: 1064, width: 509.87, height: 295.5 },
  },
  {
    id: "mask",
    name: "Mask",
    source: { x: 1376, y: 614, width: 275, height: 230 },
  },
  // ... etc
]
```

**Pro tip:** 
- Open your keyframe in Photoshop/Figma
- Use the selection tool to measure each object
- Copy the X, Y, width, height values directly
- The system handles all the math for responsive positioning!

