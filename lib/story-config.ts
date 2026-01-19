// Story configuration and types

export const R2_BASE_URL = "https://file.swell.so/story/";

export type PlaybackDirection = "forward" | "reverse";

export interface Scene {
	index: number;
	title: string;
	hasAsides: boolean;
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
