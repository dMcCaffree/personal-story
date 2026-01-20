import { useState, useLayoutEffect } from "react";
import { SOURCE_IMAGE_DIMENSIONS } from "@/lib/story-config";

/**
 * Hook to calculate correct positioning for objects on an object-cover image
 * Accounts for how the image is cropped at different viewport aspect ratios
 */
export function useImageCoverPosition(sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number) {
	const [position, setPosition] = useState({ left: "0%", top: "0%", width: "0%", height: "0%" });

	useLayoutEffect(() => {
		const calculatePosition = () => {
			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;
			
			const imageAspect = SOURCE_IMAGE_DIMENSIONS.width / SOURCE_IMAGE_DIMENSIONS.height;
			const viewportAspect = viewportWidth / viewportHeight;

			let scale: number;
			let offsetX = 0;
			let offsetY = 0;
			let visibleWidth: number;
			let visibleHeight: number;

			if (viewportAspect > imageAspect) {
				// Viewport is wider than image - image fills width, crops top/bottom
				scale = viewportWidth / SOURCE_IMAGE_DIMENSIONS.width;
				visibleWidth = SOURCE_IMAGE_DIMENSIONS.width;
				visibleHeight = viewportHeight / scale;
				offsetY = (SOURCE_IMAGE_DIMENSIONS.height - visibleHeight) / 2;
			} else {
				// Viewport is taller than image - image fills height, crops left/right
				scale = viewportHeight / SOURCE_IMAGE_DIMENSIONS.height;
				visibleWidth = viewportWidth / scale;
				visibleHeight = SOURCE_IMAGE_DIMENSIONS.height;
				offsetX = (SOURCE_IMAGE_DIMENSIONS.width - visibleWidth) / 2;
			}

			// Adjust source coordinates for the visible portion
			const adjustedX = sourceX - offsetX;
			const adjustedY = sourceY - offsetY;

			// Convert to percentages of viewport
			const left = (adjustedX / visibleWidth) * 100;
			const top = (adjustedY / visibleHeight) * 100;
			const width = (sourceWidth / visibleWidth) * 100;
			const height = (sourceHeight / visibleHeight) * 100;

			setPosition({
				left: `${left}%`,
				top: `${top}%`,
				width: `${width}%`,
				height: `${height}%`,
			});
		};

		calculatePosition();
		window.addEventListener("resize", calculatePosition);
		
		return () => window.removeEventListener("resize", calculatePosition);
	}, [sourceX, sourceY, sourceWidth, sourceHeight]);

	return position;
}

