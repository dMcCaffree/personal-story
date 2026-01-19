# Personal Story - Interactive Portfolio

An immersive, choose-your-own-adventure style portfolio that tells your story through cinematic transitions, narration, and beautiful keyframe images.

## Phase 1 - Core Story Engine ✅

The core experience is now fully implemented with:

- **Full-screen immersive scenes** with keyframe images
- **Cinematic transition videos** between scenes (forward and reverse playback)
- **Synchronized narration audio** that starts with transitions
- **Session-based playback tracking** (narration plays only once per session)
- **Navigation controls** (Continue and Go Back)
- **Utility buttons** (Resume and LinkedIn)
- **Asset preloading** for smooth transitions

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the experience.

### Asset Structure

All assets are hosted on Cloudflare R2 at: `https://file.swell.so/`

#### Required Asset Structure:

```
keyframes/
  scene-001.jpg
  scene-002.jpg
  scene-003.jpg

transitions/
  scene-001-to-002.mp4
  scene-002-to-003.mp4

narration/
  scene-001.mp3
  scene-002.mp3
  scene-003.mp3
```

### Adding Scenes

To add more scenes, edit `data/scenes.ts`:

```typescript
export const scenes: Scene[] = [
  { index: 1, title: "Opening", hasAsides: false },
  { index: 2, title: "Chapter Two", hasAsides: false },
  { index: 3, title: "Chapter Three", hasAsides: false },
  // Add more scenes here...
];
```

Make sure corresponding assets (keyframe, transition, narration) are uploaded to R2.

## Architecture

### Key Components

- **`StoryProvider`** - Global state management for the story experience
- **`StoryScene`** - Main scene display with keyframe images
- **`TransitionPlayer`** - Video transition handler (forward/reverse)
- **`NarrationPlayer`** - Audio narration with session tracking
- **`NavigationControls`** - Continue and Go Back buttons
- **`UtilityButtons`** - Resume and LinkedIn links

### State Management

The story state machine manages:
- Current and previous scene indices
- Transition state (prevents interaction during playback)
- Playback direction (forward/reverse)
- Session tracking for narration playback

### Key Features

#### Synchronized Playback
When you click "Continue," the transition video and narration audio start simultaneously, creating a seamless cinematic experience.

#### Session-Based Tracking
Narration plays only once per scene during your browser session. Navigating back doesn't replay narration.

#### Reverse Transitions
The "Go Back" button plays the transition video in reverse (using `playbackRate = -1`) without replaying narration.

#### No Media Controls
All images and videos have no controls, can't be selected, copied, or right-clicked - maintaining the immersive experience.

## Configuration

### Cloudflare R2 URL

Update the base URL in `lib/story-config.ts`:

```typescript
export const R2_BASE_URL = "https://file.swell.so/";
```

### Resume Link

Update the resume URL in `components/UtilityButtons.tsx`:

```typescript
const RESUME_URL = "#"; // Replace with your actual resume URL
```

## Phase 2 - Coming Soon

Phase 2 will add:
- Interactive captions with timing
- "Aside" narrations (micro stories triggered by clicking objects)
- Caption swapping for asides
- Enhanced visual polish

## Technical Details

### Stack
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**

### Browser Support
Modern browsers with support for:
- Video playback rate control
- HTML5 Audio/Video APIs
- CSS Grid/Flexbox
- SessionStorage

## Development Notes

### Hot Reloading
The project runs in development mode with hot reloading enabled. Changes to code will automatically reflect in the browser.

### Debugging
- Check browser console for asset loading errors
- Use sessionStorage viewer to see narration tracking
- Verify R2 URLs are accessible and CORS is configured

## License

Private project - All rights reserved.
