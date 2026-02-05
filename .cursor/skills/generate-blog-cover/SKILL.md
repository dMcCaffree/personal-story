---
name: generate-blog-cover
description: Generate unique AI cover images for blog posts using dice-rolling randomness, Claude 4.5 Sonnet for prompt creation, and Nano Banana for image generation. Use when the user asks to generate, create, or update a blog post cover image, or when a new blog post needs a cover.
---

# Generate Blog Cover Image

Generates a unique cover image for a blog post by:
1. Rolling creative "dice" (from `lib/dice-config.ts`) across 13 categories for randomness
2. Sending dice rolls + article context to Claude 4.5 Sonnet (Replicate) to craft an image prompt
3. Generating the image with Nano Banana (Fal.ai)
4. Uploading to Cloudflare R2 and updating the MDX metadata

This follows the technique described in `content/blog/simulate-creativity-ai-images.mdx`.

## Prerequisites

### Dependencies

Install these if not already present:

```bash
npm install --save-dev replicate @fal-ai/client @aws-sdk/client-s3 tsx dotenv
```

### Environment Variables

These must be set before running (user will add to `.env.local` or export directly):

| Variable | Description |
|----------|-------------|
| `REPLICATE_API_TOKEN` | Replicate API token |
| `FAL_KEY` | Fal.ai API key |
| `CLOUDFLARE_R2_ENDPOINT` | R2 S3-compatible endpoint (e.g. `https://<account_id>.r2.cloudflarestorage.com`) |
| `CLOUDFLARE_R2_ACCESS_KEY_ID` | R2 access key ID |
| `CLOUDFLARE_R2_SECRET_ACCESS_KEY` | R2 secret access key |
| `CLOUDFLARE_R2_BUCKET` | R2 bucket name |
| `CLOUDFLARE_R2_FOLDER` | Folder path in R2 (e.g. `story/blog`) |

## Usage

Run from the **project root**:

```bash
# Generate and upload cover image
npx tsx .cursor/skills/generate-blog-cover/scripts/generate-cover.ts <slug>

# Dry run (generate prompt only, no image/upload)
npx tsx .cursor/skills/generate-blog-cover/scripts/generate-cover.ts <slug> --dry-run

# Pin specific dice values (rest are still random)
npx tsx .cursor/skills/generate-blog-cover/scripts/generate-cover.ts <slug> --animal=Lobster --color="Deep Crimson"
```

**Examples:**
```bash
# Fully random (animal die + all other dice)
npx tsx .cursor/skills/generate-blog-cover/scripts/generate-cover.ts how-openclaw-sees-the-web

# Pin a specific animal
npx tsx .cursor/skills/generate-blog-cover/scripts/generate-cover.ts how-openclaw-sees-the-web --animal=Lobster --color="Deep Crimson"

# Replace the animal entirely with a custom subject
npx tsx .cursor/skills/generate-blog-cover/scripts/generate-cover.ts how-openclaw-sees-the-web --subject="Vehicle:Red motorcycle" --style=Cyberpunk

# Use a subject without a category label
npx tsx .cursor/skills/generate-blog-cover/scripts/generate-cover.ts how-openclaw-sees-the-web --subject="Shattered mirror" --mood=Mysterious

# Dry run to preview the prompt before generating
npx tsx .cursor/skills/generate-blog-cover/scripts/generate-cover.ts how-openclaw-sees-the-web --dry-run --subject="Concept:Melting clock"
```

### Subject Override

The primary focal element defaults to rolling the "Animal" die. Use `--subject` to replace it with anything:

```bash
# Custom subject (label defaults to "Subject")
--subject="Vintage typewriter"

# Custom label and value (separated by colon)
--subject="Vehicle:Red motorcycle"
--subject="Landmark:Eiffel Tower"
--subject="Concept:Shattered mirror"

# Or just pin a specific animal (shorthand)
--animal=Lobster
```

`--subject` takes priority over `--animal` if both are present.

### Dice Override Flags

Pin any other dice category with `--<category>=<value>`:

`--color`, `--lighting`, `--timeOfDay`, `--texture`, `--weather`, `--style`, `--mood`, `--composition`, `--backgroundDetail`, `--foregroundDetail`, `--perspective`, `--year`

Pinned values don't need to match existing dice options — you can pass any string.

## What the Script Does

1. **Reads the MDX file** at `content/blog/<slug>.mdx` and extracts `title` and `excerpt` from metadata
2. **Rolls 13 dice** (animal, color, lighting, time of day, texture, weather, style, mood, composition, background, foreground, perspective, time period) using categories from `lib/dice-config.ts`
3. **Calls Claude 4.5 Sonnet** (`anthropic/claude-4.5-sonnet` on Replicate) with the article context and all dice rolls to generate a structured JSON image prompt
4. **Validates the score** — if Claude rates the prompt below 60/100, it re-rolls (up to 3 attempts)
5. **Calls Nano Banana** (`fal-ai/nano-banana` on Fal.ai) with the generated prompt at 16:9 aspect ratio
6. **Downloads the image** and **uploads to R2** at `<CLOUDFLARE_R2_FOLDER>/<slug>/<slugified-title>.png` — the filename is derived from the image title Claude generates, so each generation gets a unique filename instead of overwriting previous ones
7. **Updates the MDX file** — sets both `coverImageDark` and `coverImageLight` to the new URL

## Output

The final public URL follows the pattern:
```
https://file.swell.so/{CLOUDFLARE_R2_FOLDER}/{slug}/{slugified-image-title}.png
```

Both `coverImageDark` and `coverImageLight` are set to the same URL (single image for now).

## Customization

### Dice Categories
Edit `lib/dice-config.ts` to add/remove/modify dice options. The script imports `diceCategories` directly.

### Score Threshold
The `MIN_SCORE` constant (default: 60) in the script controls the minimum acceptable quality score from Claude. Raise it for stricter quality, lower it for faster generation.

### Image Model
Change `FAL_MODEL` in the script to swap Nano Banana for another Fal.ai image model. Ensure the input schema matches (prompt, aspect_ratio, output_format).

### Aspect Ratio
Change `IMAGE_ASPECT_RATIO` in the script. Supported values from Nano Banana: `21:9, 16:9, 3:2, 4:3, 5:4, 1:1, 4:5, 3:4, 2:3, 9:16`.

## Troubleshooting

- **"Missing required environment variable"** — The script auto-loads `.env` and `.env.local` from the project root. Ensure your keys are in one of these files.
- **"Blog post not found"** — Check that `content/blog/<slug>.mdx` exists and the slug matches the filename
- **"Failed to parse JSON from Claude"** — Rare; the script retries up to 3 times automatically
- **Low scores on every attempt** — Try adjusting the Claude prompt temperature or lowering `MIN_SCORE`
