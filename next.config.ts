import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [{ hostname: "file.swell.so", protocol: "https" }],
	},
};

export default nextConfig;
