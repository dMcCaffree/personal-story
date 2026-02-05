"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

interface TimelinePoint {
  id: string;
  label: string;
  title: string;
}

const timelinePoints: TimelinePoint[] = [
  { id: "intro", label: "Now", title: "Introduction" },
  { id: "three-months", label: "3 Months", title: "Agent Experimentation" },
  { id: "twelve-months", label: "12 Months", title: "Design Paradigm Shift" },
  { id: "three-years", label: "3 Years", title: "Generative Interfaces" },
  { id: "ten-years", label: "10 Years", title: "Post-AI Bubble" },
  { id: "fifty-years", label: "50 Years", title: "AI Everywhere" },
];

interface ScrollTimelineProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export function ScrollTimeline({ scrollContainerRef }: ScrollTimelineProps) {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerHeight = container.clientHeight;

      // Find which section is currently in view and calculate progress
      let currentIndex = 0;
      let progress = 0;
      
      // Check each section to see which one is most visible
      for (let i = timelinePoints.length - 1; i >= 0; i--) {
        const element = document.getElementById(timelinePoints[i].id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the section's top is above the middle of the screen, it's the active one
          if (rect.top <= containerHeight / 2) {
            currentIndex = i;
            
            // Calculate progress within this section
            if (i < timelinePoints.length - 1) {
              const nextElement = document.getElementById(timelinePoints[i + 1].id);
              if (nextElement) {
                const nextRect = nextElement.getBoundingClientRect();
                const sectionStart = rect.top;
                const sectionEnd = nextRect.top;
                const sectionHeight = sectionEnd - sectionStart;
                
                if (sectionHeight > 0) {
                  // How far through this section are we? (0 to 1)
                  const sectionProgress = Math.max(0, Math.min(1, (containerHeight / 2 - sectionStart) / sectionHeight));
                  progress = i + sectionProgress;
                } else {
                  progress = i;
                }
              } else {
                progress = i;
              }
            } else {
              // Last section - clamp to not go beyond it
              progress = i;
            }
            
            break;
          }
        }
      }
      
      setActiveIndex(currentIndex);
      // Clamp progress to never exceed the last section
      setScrollProgress(Math.min(progress, timelinePoints.length - 1));
    };

    // Initial check after a short delay for DOM to be ready
    const timer = setTimeout(handleScroll, 200);
    
    // Add scroll listener to the container
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [scrollContainerRef]);

  const scrollToSection = (id: string) => {
    const container = scrollContainerRef.current;
    const element = document.getElementById(id);
    
    if (container && element) {
      const yOffset = -100; // Offset for fixed headers
      const elementTop = element.offsetTop;
      const scrollY = elementTop + yOffset;
      
      container.scrollTo({ top: scrollY, behavior: "smooth" });
      
      // Update active index immediately for better UX
      const index = timelinePoints.findIndex(point => point.id === id);
      if (index !== -1) {
        setActiveIndex(index);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
    >
      <div
        className={`rounded-2xl border backdrop-blur-xl p-4 ${
          theme === "dark"
            ? "border-white/10 bg-black/40"
            : "border-black/10 bg-white/40"
        }`}
      >
        <div className="relative">
          {/* Vertical line */}
          <div
            className={`absolute left-2 top-2 bottom-2 w-0.5 ${
              theme === "dark" ? "bg-white/20" : "bg-black/20"
            }`}
          />
          
          {/* Active indicator line - animates from top down based on scroll progress */}
          <motion.div
            className="absolute left-2 top-2 w-0.5 bg-blue-500"
            initial={false}
            animate={{
              height: `calc(${(scrollProgress / (timelinePoints.length - 1)) * 100}% - 8px)`,
            }}
            transition={{ duration: 0.1, ease: "linear" }}
          />

          {/* Timeline points */}
          <div className="relative space-y-6">
                {timelinePoints.map((point, index) => {
                  const isActive = index === activeIndex;
                  const isPast = index < activeIndex;

                  return (
                    <button
                      key={point.id}
                      type="button"
                      onClick={() => scrollToSection(point.id)}
                      className="group flex items-center gap-3 text-left"
                    >
                      {/* Dot - with background to cover the line */}
                      <div className="relative flex h-4 w-4 shrink-0 items-center justify-center">
                        {/* Larger background circle to fully cover the lines */}
                        <div
                          className={`absolute h-6 w-6 rounded-full ${
                            theme === "dark" ? "bg-black/80" : "bg-white/80"
                          }`}
                        />
                        <motion.div
                          className={`relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                            isActive
                              ? "border-blue-500 bg-blue-500"
                              : isPast
                              ? theme === "dark"
                                ? "border-blue-400 bg-blue-400/50"
                                : "border-blue-600 bg-blue-600/50"
                              : theme === "dark"
                              ? "border-white/40 bg-black/40"
                              : "border-black/40 bg-white/40"
                          } ${isActive ? "scale-125" : "scale-100"} group-hover:scale-125`}
                          initial={false}
                          animate={{
                            scale: isActive ? 1.25 : 1,
                          }}
                        >
                          {(isActive || isPast) && (
                            <motion.div
                              className="h-2 w-2 rounded-full bg-white"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                        </motion.div>
                      </div>

                      {/* Label */}
                      <div className="min-w-[120px]">
                        <div
                          className={`font-mono text-xs font-bold tracking-wider transition-all ${
                            isActive
                              ? "text-blue-500"
                              : theme === "dark"
                              ? "text-white/60 group-hover:text-white/90"
                              : "text-black/60 group-hover:text-black/90"
                          }`}
                        >
                          {point.label}
                        </div>
                        <div
                          className={`text-xs transition-all ${
                            isActive
                              ? theme === "dark"
                                ? "text-white"
                                : "text-black"
                              : theme === "dark"
                              ? "text-white/40 group-hover:text-white/70"
                              : "text-black/40 group-hover:text-black/70"
                          }`}
                        >
                          {point.title}
                        </div>
                      </div>
                    </button>
                  );
                })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
