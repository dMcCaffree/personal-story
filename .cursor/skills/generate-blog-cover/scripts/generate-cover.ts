#!/usr/bin/env npx tsx

/**
 * generate-cover.ts
 *
 * Generates a unique blog cover image using:
 * 1. Dice rolling (from lib/dice-config.ts) for creative randomness
 * 2. Claude 4.5 Sonnet (via Replicate) for prompt generation
 * 3. Nano Banana (via Fal.ai) for image generation
 * 4. Cloudflare R2 for hosting
 *
 * Usage:
 *   npx tsx .cursor/skills/generate-blog-cover/scripts/generate-cover.ts <slug> [--dry-run] [--color="Deep Crimson"] ...
 *
 * Subject override (replaces the Animal die with any subject):
 *   --subject="Vintage typewriter"              → label: "Subject"
 *   --subject="Vehicle:Red motorcycle"           → label: "Vehicle"
 *   --animal=Lobster                             → label: "Animal" (shorthand)
 *
 * Environment variables required:
 *   REPLICATE_API_TOKEN  - Replicate API token
 *   FAL_KEY              - Fal.ai API key
 *   CLOUDFLARE_R2_ENDPOINT         - R2 S3-compatible endpoint
 *   CLOUDFLARE_R2_ACCESS_KEY_ID    - R2 access key
 *   CLOUDFLARE_R2_SECRET_ACCESS_KEY - R2 secret key
 *   CLOUDFLARE_R2_BUCKET           - R2 bucket name
 *   CLOUDFLARE_R2_FOLDER           - R2 folder path (e.g. "story/blog")
 */

import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import Replicate from "replicate";
import { fal } from "@fal-ai/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { diceCategories } from "../../../../lib/dice-config";

// Load .env and .env.local from project root
dotenv.config({ path: path.resolve(process.cwd(), ".env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true });

// ─── Config ──────────────────────────────────────────────────────────────────

const REPLICATE_MODEL = "anthropic/claude-4.5-sonnet" as const;
const FAL_MODEL = "fal-ai/nano-banana" as const;
const PUBLIC_DOMAIN = "https://file.swell.so";
const IMAGE_ASPECT_RATIO = "16:9" as const;
const MAX_RETRIES = 3;
const MIN_SCORE = 60;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getEnv(name: string): string {
	const val = process.env[name];
	if (!val) {
		console.error(`\n❌ Missing required environment variable: ${name}`);
		process.exit(1);
	}
	return val;
}

function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function rollDie(options: string[]): string {
	return options[Math.floor(Math.random() * options.length)];
}

// ─── Subject System ──────────────────────────────────────────────────────────
// The "subject" is the primary focal element in the image. By default it rolls
// from the "animal" die, but --subject lets you replace it with anything:
//   --subject="Vintage typewriter"             → { label: "Subject", value: "Vintage typewriter" }
//   --subject="Vehicle:Red motorcycle"         → { label: "Vehicle", value: "Red motorcycle" }
//   --animal=Lobster                           → { label: "Animal",  value: "Lobster" }
//   (no flag)                                  → { label: "Animal",  value: <random from die> }

interface SubjectConfig {
	label: string;
	value: string;
	pinned: boolean;
}

function parseSubject(args: string[]): SubjectConfig | null {
	// --subject takes priority over --animal
	for (const arg of args) {
		const subjectMatch = arg.match(/^--subject=(.+)$/);
		if (subjectMatch) {
			const raw = subjectMatch[1];
			const colonIdx = raw.indexOf(":");
			if (colonIdx > 0) {
				return {
					label: raw.slice(0, colonIdx).trim(),
					value: raw.slice(colonIdx + 1).trim(),
					pinned: true,
				};
			}
			return { label: "Subject", value: raw.trim(), pinned: true };
		}
	}

	// Fall back to --animal if present
	for (const arg of args) {
		const animalMatch = arg.match(/^--animal=(.+)$/);
		if (animalMatch) {
			return { label: "Animal", value: animalMatch[1].trim(), pinned: true };
		}
	}

	return null; // will roll from animal die
}

function resolveSubject(parsed: SubjectConfig | null): SubjectConfig {
	if (parsed) return parsed;
	return { label: "Animal", value: rollDie(diceCategories.animal), pinned: false };
}

// ─── Dice Rolling ────────────────────────────────────────────────────────────

function rollAllDice(overrides: Record<string, string> = {}): Record<string, string> {
	const rolls: Record<string, string> = {};
	for (const [key, options] of Object.entries(diceCategories)) {
		// Skip "animal" — handled separately by the subject system
		if (key === "animal") continue;
		if (overrides[key]) {
			rolls[key] = overrides[key];
		} else {
			rolls[key] = rollDie(options);
		}
	}
	return rolls;
}

// Parse --key=value args into dice overrides (excludes animal/subject, handled separately)
function parseOverrides(args: string[]): Record<string, string> {
	const overrides: Record<string, string> = {};
	const validKeys = new Set(Object.keys(diceCategories));
	validKeys.delete("animal"); // handled by subject system

	for (const arg of args) {
		const match = arg.match(/^--([a-zA-Z]+)=(.+)$/);
		if (match) {
			const [, key, value] = match;
			if (validKeys.has(key)) {
				overrides[key] = value;
			}
		}
	}
	return overrides;
}

// ─── Claude Prompt Builder ───────────────────────────────────────────────────

function buildClaudePrompt(
	title: string,
	excerpt: string,
	rolls: Record<string, string>,
	subject: SubjectConfig,
): string {
	return `You are an expert image prompt designer specializing in creating unique, memorable visuals for blog articles.

I need you to create a detailed image generation prompt for a blog cover image.

Article Title: "${title}"
Article Excerpt: "${excerpt}"

I've rolled creative dice to ensure uniqueness. You MUST incorporate ALL of these elements naturally into your image description:

- ${subject.label}: ${subject.value}
- Color Palette: ${rolls.color}
- Lighting: ${rolls.lighting}
- Time of Day: ${rolls.timeOfDay}
- Texture: ${rolls.texture}
- Weather: ${rolls.weather}
- Style: ${rolls.style}
- Mood: ${rolls.mood}
- Composition: ${rolls.composition}
- Background Detail: ${rolls.backgroundDetail}
- Foreground Detail: ${rolls.foregroundDetail}
- Perspective: ${rolls.perspective}
- Time Period: ${rolls.year}

Respond with ONLY valid JSON (no markdown fences, no commentary) in this exact format:
{
  "reasoning": "Brief explanation of why this combination works for this article",
  "score": 85,
  "prompt": "A detailed, vivid image generation prompt as a single paragraph describing a cohesive scene.",
  "title": "A short title for this image"
}

Rules:
- The prompt must naturally incorporate ALL dice roll elements listed above
- The image should metaphorically represent the article's theme, not literally illustrate it
- Describe a single cohesive scene, not a collage or montage
- Frame for 16:9 landscape aspect ratio
- Make it unique, memorable, and visually striking
- Keep the prompt under 300 words
- Do NOT include any text, words, or typography in the image description
- Do NOT mention the article title or any UI elements`;
}

// ─── Step 1: Generate image prompt via Claude on Replicate ───────────────────

interface PromptResult {
	reasoning: string;
	score: number;
	prompt: string;
	title: string;
}

async function generateImagePrompt(
	replicate: Replicate,
	title: string,
	excerpt: string,
	overrides: Record<string, string> = {},
	parsedSubject: SubjectConfig | null = null,
): Promise<{ promptData: PromptResult; rolls: Record<string, string>; subject: SubjectConfig }> {
	for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
		const rolls = rollAllDice(overrides);
		const subject = resolveSubject(parsedSubject);

		console.log(`\n🎲 Dice rolls (attempt ${attempt}/${MAX_RETRIES}):`);
		const subjectPin = subject.pinned ? " 📌" : "";
		console.log(`   ${subject.label}: ${subject.value}${subjectPin}`);
		for (const [key, value] of Object.entries(rolls)) {
			const pinned = overrides[key] ? " 📌" : "";
			console.log(`   ${key}: ${value}${pinned}`);
		}

		console.log("\n🤖 Generating image prompt via Claude 4.5 Sonnet...");
		const claudePrompt = buildClaudePrompt(title, excerpt, rolls, subject);

		const output = await replicate.run(REPLICATE_MODEL, {
			input: {
				prompt: claudePrompt,
				max_tokens: 4096,
				temperature: 0.9,
			},
		});

		// Output can be a string, array of strings, or other format
		let rawText: string;
		if (typeof output === "string") {
			rawText = output;
		} else if (Array.isArray(output)) {
			rawText = output.join("");
		} else {
			rawText = String(output);
		}

		// Parse JSON from response
		let promptData: PromptResult;
		try {
			promptData = JSON.parse(rawText);
		} catch {
			const jsonMatch = rawText.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				promptData = JSON.parse(jsonMatch[0]);
			} else {
				console.error(
					`   ⚠️  Failed to parse JSON (attempt ${attempt}): ${rawText.slice(0, 200)}`,
				);
				if (attempt === MAX_RETRIES) {
					throw new Error("Failed to get valid JSON from Claude after all retries");
				}
				continue;
			}
		}

		console.log(`   Title: ${promptData.title}`);
		console.log(`   Score: ${promptData.score}/100`);
		console.log(`   Reasoning: ${promptData.reasoning}`);
		console.log(`   Prompt: ${promptData.prompt.slice(0, 150)}...`);

		if (promptData.score >= MIN_SCORE) {
			return { promptData, rolls, subject };
		}

		console.log(
			`   ⚠️  Score ${promptData.score} below threshold ${MIN_SCORE}, re-rolling...`,
		);
	}

	throw new Error(`Could not generate prompt with score >= ${MIN_SCORE} after ${MAX_RETRIES} attempts`);
}

// ─── Step 2: Generate image via Nano Banana on Fal.ai ───────────────────────

async function generateImage(prompt: string): Promise<string> {
	console.log("\n🍌 Generating image via Nano Banana...");

	const result = await fal.subscribe(FAL_MODEL, {
		input: {
			prompt,
			aspect_ratio: IMAGE_ASPECT_RATIO,
			output_format: "png" as const,
			num_images: 1,
		},
		logs: true,
		onQueueUpdate: (update) => {
			if (update.status === "IN_PROGRESS") {
				for (const log of update.logs ?? []) {
					console.log(`   ${log.message}`);
				}
			}
		},
	});

	const imageUrl = result.data.images[0].url;
	console.log(`   Image generated: ${imageUrl}`);
	return imageUrl;
}

// ─── Step 3: Download image ──────────────────────────────────────────────────

async function downloadImage(url: string): Promise<Buffer> {
	console.log("\n⬇️  Downloading image...");
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Failed to download image: ${res.status}`);
	const buffer = Buffer.from(await res.arrayBuffer());
	console.log(`   Size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
	return buffer;
}

// ─── Step 4: Upload to Cloudflare R2 ─────────────────────────────────────────

async function uploadToR2(key: string, body: Buffer): Promise<void> {
	const client = new S3Client({
		region: "auto",
		endpoint: getEnv("CLOUDFLARE_R2_ENDPOINT"),
		credentials: {
			accessKeyId: getEnv("CLOUDFLARE_R2_ACCESS_KEY_ID"),
			secretAccessKey: getEnv("CLOUDFLARE_R2_SECRET_ACCESS_KEY"),
		},
	});

	console.log(`\n☁️  Uploading to R2: ${key}`);
	await client.send(
		new PutObjectCommand({
			Bucket: getEnv("CLOUDFLARE_R2_BUCKET"),
			Key: key,
			Body: body,
			ContentType: "image/png",
			CacheControl: "public, max-age=31536000, immutable",
		}),
	);
	console.log("   Upload complete.");
}

// ─── Step 5: Update MDX metadata ─────────────────────────────────────────────

function updateMdxCoverImage(
	filePath: string,
	content: string,
	imageUrl: string,
): void {
	console.log("\n✏️  Updating MDX metadata...");
	const updated = content
		.replace(/coverImageDark:\s*"[^"]*"/, `coverImageDark: "${imageUrl}"`)
		.replace(/coverImageLight:\s*"[^"]*"/, `coverImageLight: "${imageUrl}"`);

	if (updated === content) {
		console.log("   ⚠️  No coverImage fields found to update. Adding them is not yet supported.");
		console.log(`   Manually set both coverImageDark and coverImageLight to: ${imageUrl}`);
		return;
	}

	fs.writeFileSync(filePath, updated, "utf8");
	console.log("   MDX file updated.");
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
	const args = process.argv.slice(2);
	const dryRun = args.includes("--dry-run");
	const slug = args.find((a) => !a.startsWith("--"));
	const overrides = parseOverrides(args);
	const parsedSubject = parseSubject(args);

	if (!slug) {
		console.error(
			"Usage: npx tsx .cursor/skills/generate-blog-cover/scripts/generate-cover.ts <slug> [--dry-run]",
		);
		process.exit(1);
	}

	// Validate env vars early (skip R2 vars for dry run)
	getEnv("REPLICATE_API_TOKEN");
	if (!dryRun) {
		getEnv("FAL_KEY");
		getEnv("CLOUDFLARE_R2_ENDPOINT");
		getEnv("CLOUDFLARE_R2_ACCESS_KEY_ID");
		getEnv("CLOUDFLARE_R2_SECRET_ACCESS_KEY");
		getEnv("CLOUDFLARE_R2_BUCKET");
		getEnv("CLOUDFLARE_R2_FOLDER");
	}

	// Read MDX file
	const projectRoot = process.cwd();
	const mdxPath = path.join(projectRoot, "content", "blog", `${slug}.mdx`);

	if (!fs.existsSync(mdxPath)) {
		console.error(`\n❌ Blog post not found: ${mdxPath}`);
		process.exit(1);
	}

	const mdxContent = fs.readFileSync(mdxPath, "utf8");
	const metadataMatch = mdxContent.match(
		/export const metadata = ({[\s\S]*?})/,
	);
	if (!metadataMatch) {
		console.error("❌ Could not extract metadata from MDX file");
		process.exit(1);
	}

	// biome-ignore lint: Using eval for metadata extraction (same pattern as lib/mdx.ts)
	const metadata = eval(`(${metadataMatch[1]})`) as {
		title: string;
		excerpt: string;
	};

	console.log(`\n📝 Generating cover for: "${metadata.title}"`);
	if (dryRun) console.log("   (dry run — no image generation or upload)");
	const hasPins = Object.keys(overrides).length > 0 || parsedSubject !== null;
	if (hasPins) {
		console.log("   Pinned dice:");
		if (parsedSubject) {
			console.log(`     ${parsedSubject.label}: ${parsedSubject.value}`);
		}
		for (const [key, value] of Object.entries(overrides)) {
			console.log(`     ${key}: ${value}`);
		}
	}

	// Initialize Replicate client (reads REPLICATE_API_TOKEN from env)
	const replicate = new Replicate();

	// Step 1: Generate image prompt
	const { promptData } = await generateImagePrompt(
		replicate,
		metadata.title,
		metadata.excerpt,
		overrides,
		parsedSubject,
	);

	if (dryRun) {
		console.log("\n── Dry Run Result ──────────────────────────────────────");
		console.log(JSON.stringify(promptData, null, 2));
		console.log("────────────────────────────────────────────────────────\n");
		return;
	}

	// Step 2: Generate image
	const imageUrl = await generateImage(promptData.prompt);

	// Step 3: Download image
	const imageBuffer = await downloadImage(imageUrl);

	// Step 4: Upload to R2
	const folder = getEnv("CLOUDFLARE_R2_FOLDER");
	const imageSlug = slugify(promptData.title);
	const r2Key = `${folder}/${slug}/${imageSlug}.png`;
	await uploadToR2(r2Key, imageBuffer);

	// Step 5: Update MDX
	const publicUrl = `${PUBLIC_DOMAIN}/${r2Key}`;
	updateMdxCoverImage(mdxPath, mdxContent, publicUrl);

	console.log("\n✅ Done!");
	console.log(`   ${publicUrl}\n`);
}

main().catch((err) => {
	console.error("\n❌ Error:", err.message || err);
	process.exit(1);
});
