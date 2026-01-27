import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [{ hostname: "file.swell.so", protocol: "https" }],
	},
	// Aggressive caching for static pages
	async headers() {
		return [
			{
				// Cache all blog routes aggressively (they're static)
				source: "/blog/:slug*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				// Cache images and media
				source: "/:all*(svg|jpg|jpeg|png|gif|webp|mp4|webm)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
		];
	},
};

export default nextConfig;
