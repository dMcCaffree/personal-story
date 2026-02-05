"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/contexts/ThemeContext";

interface FontPreviewProps {
  fontName: string;
  fontFamily: string;
  children: React.ReactNode;
}

export function FontPreview({
  fontName,
  fontFamily,
  children,
}: FontPreviewProps) {
  const { theme } = useTheme();

  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="center"
          sideOffset={8}
          showArrow={false}
          className={`w-64 p-4 backdrop-blur-xl rounded-lg ${
            theme === "dark"
              ? "border border-white/20 bg-black/90"
              : "border border-black/20 bg-white/90"
          }`}
        >
          <div className="text-center">
            <div
              style={{ fontFamily }}
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              {fontName}
            </div>
            <div
              style={{ fontFamily }}
              className={`mt-2 text-sm ${
                theme === "dark" ? "text-white/70" : "text-black/70"
              }`}
            >
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

