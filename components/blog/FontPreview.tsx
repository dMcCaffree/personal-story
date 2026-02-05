"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/contexts/ThemeContext";

interface FontPreviewProps {
  fontName: string;
  fontFamily: string;
  children: React.ReactNode;
}

export function FontPreview({ fontName, fontFamily, children }: FontPreviewProps) {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + rect.width / 2 + window.scrollX,
      });
    }
  };

  useEffect(() => {
    if (isHovered) {
      updatePosition();
      // Update position on scroll and resize while hovered
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);
      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isHovered]);

  return (
    <>
      <span
        ref={triggerRef}
        className="relative inline-block cursor-help"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </span>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: "absolute",
                  top: position.top - 8,
                  left: position.left,
                  transform: "translate(-50%, -100%)",
                }}
                className={`z-50 w-64 rounded-lg border p-4 shadow-xl backdrop-blur-xl ${
                  theme === "dark"
                    ? "border-white/20 bg-black/90"
                    : "border-black/20 bg-white/90"
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
                {/* Arrow */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: 0,
                    transform: "translate(-50%, 50%) rotate(45deg)",
                  }}
                  className={`h-2 w-2 border-b border-r ${
                    theme === "dark"
                      ? "border-white/20 bg-black/90"
                      : "border-black/20 bg-white/90"
                  }`}
                />
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

