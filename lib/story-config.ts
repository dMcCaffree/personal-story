// Story configuration and types

export const R2_BASE_URL = "https://file.swell.so/story/";

export type PlaybackDirection = "forward" | "reverse";

export interface Aside {
	id: string;
	name: string;
	// Store source coordinates for accurate positioning with object-cover
	source: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	// Legacy: For backwards compatibility or manual positioning
	position?: {
		top: string;
		left: string;
		width: string;
		height: string;
	};
}

/**
 * Source image dimensions for Scene 1
 * All asides should be positioned relative to these dimensions
 */
export const SOURCE_IMAGE_DIMENSIONS = {
	width: 2752,
	height: 1536,
};

export interface Scene {
	index: number;
	title: string;
	hasAsides: boolean;
	asides?: Aside[];
}

export interface StoryState {
	currentSceneIndex: number;
	previousSceneIndex: number | null;
	isTransitioning: boolean;
	playbackDirection: PlaybackDirection;
}

export interface AssetUrls {
	keyframe: string;
	transition?: string;
	narration: string;
}

/**
 * Format scene index as zero-padded string (e.g., 1 -> "001")
 */
export function formatSceneIndex(index: number): string {
	return index.toString().padStart(3, "0");
}

/**
 * Get the keyframe image URL for a scene
 */
export function getKeyframeUrl(sceneIndex: number): string {
	const formatted = formatSceneIndex(sceneIndex);
	return `${R2_BASE_URL}keyframes/scene-${formatted}.jpeg`;
}

/**
 * Get the transition video URL between two scenes
 */
export function getTransitionUrl(fromIndex: number, toIndex: number): string {
	const fromFormatted = formatSceneIndex(fromIndex);
	const toFormatted = formatSceneIndex(toIndex);
	return `${R2_BASE_URL}transitions/scene-${fromFormatted}-to-${toFormatted}.mp4`;
}

/**
 * Get the narration audio URL for a scene
 */
export function getNarrationUrl(sceneIndex: number): string {
	const formatted = formatSceneIndex(sceneIndex);
	return `${R2_BASE_URL}narration/scene-${formatted}.mp3`;
}

/**
 * Get the aside image URL for a scene
 */
export function getAsideImageUrl(sceneIndex: number, asideId: string): string {
	const formatted = formatSceneIndex(sceneIndex);
	return `${R2_BASE_URL}asides/scene-${formatted}/${asideId}.png`;
}

/**
 * Get the aside audio URL for a scene
 */
export function getAsideAudioUrl(sceneIndex: number, asideId: string): string {
	const formatted = formatSceneIndex(sceneIndex);
	return `${R2_BASE_URL}asides/scene-${formatted}/${asideId}.mp3`;
}

/**
 * Get all asset URLs for a scene
 */
export function getSceneAssets(
	sceneIndex: number,
	nextSceneIndex?: number,
): AssetUrls {
	return {
		keyframe: getKeyframeUrl(sceneIndex),
		transition: nextSceneIndex
			? getTransitionUrl(sceneIndex, nextSceneIndex)
			: undefined,
		narration: getNarrationUrl(sceneIndex),
	};
}
