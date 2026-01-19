"use client";

import { useState } from "react";

const RESUME_URL = "#"; // Placeholder for now
const LINKEDIN_URL = "https://linkedin.com/in/dMcCaffree";

export function UtilityButtons() {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div className="fixed top-8 right-8 z-40 flex items-center gap-4">
      {/* Resume button */}
      <div className="relative">
        <a
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all hover:bg-white/30"
          onMouseEnter={() => setHoveredButton("resume")}
          onMouseLeave={() => setHoveredButton(null)}
          aria-label="View Resume"
        >
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 3v6a1 1 0 001 1h6" />
          </svg>
        </a>
        {hoveredButton === "resume" && (
          <div className="absolute top-full mt-2 right-0 whitespace-nowrap rounded-lg bg-black/90 px-3 py-2 text-sm text-white backdrop-blur-sm">
            View Resume
          </div>
        )}
      </div>

      {/* LinkedIn button */}
      <div className="relative">
        <a
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm transition-all hover:bg-white/30"
          onMouseEnter={() => setHoveredButton("linkedin")}
          onMouseLeave={() => setHoveredButton(null)}
          aria-label="Connect on LinkedIn"
        >
          <svg
            className="h-6 w-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
        {hoveredButton === "linkedin" && (
          <div className="absolute top-full mt-2 right-0 whitespace-nowrap rounded-lg bg-black/90 px-3 py-2 text-sm text-white backdrop-blur-sm">
            Connect on LinkedIn
          </div>
        )}
      </div>
    </div>
  );
}

