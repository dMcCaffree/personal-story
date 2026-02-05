"use client";

import { useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/contexts/ThemeContext";
import Image from "next/image";
import { ExternalLinkIcon } from "lucide-react";

interface LinkPreviewProps {
	href: string;
	ogImage?: string;
	ogTitle?: string;
	ogDescription?: string;
	children: React.ReactNode;
}

export function LinkPreview({
	href,
	ogImage,
	ogTitle,
	ogDescription,
	children,
}: LinkPreviewProps) {
	const { theme } = useTheme();
	const [imageSrc, setImageSrc] = useState<string | undefined>(ogImage);

	// If no OG data, just render a regular link
	if (!imageSrc && !ogTitle) {
		return (
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className="underline decoration-black/30 underline-offset-4 transition-colors hover:decoration-black/60 dark:decoration-white/30 dark:hover:decoration-white/60"
			>
				{children}
			</a>
		);
	}

	return (
		<TooltipProvider delayDuration={500}>
			<Tooltip>
				<TooltipTrigger asChild>
					<a
						href={href}
						target="_blank"
						rel="noopener noreferrer"
						className="hover:underline decoration-black/30 underline-offset-4 transition-colors focus:outline-none focus:ring-0"
					>
						{children}
					</a>
				</TooltipTrigger>
				<TooltipContent
					side="top"
					align="center"
					sideOffset={8}
					showArrow={false}
					className={`w-80 overflow-hidden rounded-lg p-0 backdrop-blur-xl text-wrap ${
						theme === "dark"
							? "border border-white/20 bg-black/90"
							: "border border-black/20 bg-white/90"
					}`}
				>
					{/* OG Image */}
					{imageSrc && (
						<div className="aspect-video w-full relative overflow-hidden bg-black/5 dark:bg-white/5">
							<Image
								src={imageSrc}
								alt={ogTitle || "Link preview"}
								className="h-full w-full object-cover"
								fill
								unoptimized
								onError={() => {
									setImageSrc(undefined);
								}}
							/>
						</div>
					)}
					{/* Content */}
					<div className="p-3">
						{ogTitle && (
							<div
								className={`line-clamp-2 text-sm font-bold ${
									theme === "dark" ? "text-white" : "text-black"
								}`}
							>
								{ogTitle}
							</div>
						)}
						{ogDescription && (
							<div
								className={`line-clamp-2 mt-1 text-xs ${
									theme === "dark" ? "text-white/60" : "text-black/60"
								}`}
							>
								{ogDescription}
							</div>
						)}
						{/* Domain */}
						<div
							className={`mt-2 font-mono text-xs ${
								theme === "dark" ? "text-white/40" : "text-black/40"
							}`}
						>
							<a
								href={href}
								target="_blank"
								rel="noopener noreferrer"
								className="hover:underline decoration-black/30 underline-offset-4 transition-none duration-75 hover:decoration-black/60 dark:decoration-white/30 dark:hover:decoration-white/60 focus:outline-none focus:ring-0 inline-flex items-center gap-1.5 hover:text-white/60 dark:hover:text-black/60"
							>
								{new URL(href).hostname}{" "}
								<ExternalLinkIcon className="w-3 h-3 shrink-0" />
							</a>
						</div>
					</div>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
