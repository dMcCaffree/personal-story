"use client";

import {
	useState,
	useRef,
	useEffect,
	useCallback,
	type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";

interface TooltipProps {
	children: ReactNode;
	label: string;
	delay?: number; // Delay in milliseconds before showing tooltip
}

export function Tooltip({ children, label, delay = 0 }: TooltipProps) {
	const [showTooltip, setShowTooltip] = useState(false);
	const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
	const containerRef = useRef<HTMLSpanElement>(null);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const updateTooltipPosition = useCallback(() => {
		if (containerRef.current) {
			const rect = containerRef.current.getBoundingClientRect();
			setTooltipPos({
				x: rect.left + rect.width / 2,
				y: rect.top,
			});
		}
	}, []);

	// Update position when tooltip becomes visible
	useEffect(() => {
		if (showTooltip) {
			updateTooltipPosition();
		}
	}, [showTooltip, updateTooltipPosition]);

	const handleMouseEnter = () => {
		updateTooltipPosition();

		if (delay > 0) {
			timeoutRef.current = setTimeout(() => {
				setShowTooltip(true);
			}, delay);
		} else {
			setShowTooltip(true);
		}
	};

	const handleMouseLeave = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setShowTooltip(false);
	};

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return (
		<>
			{/* biome-ignore lint/a11y/noStaticElementInteractions: Tooltip wrapper needs mouse events */}
			<span
				ref={containerRef}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onFocus={handleMouseEnter}
				onBlur={handleMouseLeave}
				style={{ display: "inline-flex" }}
			>
				{children}
			</span>

			{/* Tooltip via Portal */}
			{typeof window !== "undefined" &&
				showTooltip &&
				createPortal(
					<AnimatePresence>
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 10 }}
							transition={{
								type: "spring",
								stiffness: 500,
								damping: 30,
								mass: 0.5,
							}}
							className="pointer-events-none fixed whitespace-nowrap rounded-md bg-black/90 px-2 py-1 text-xs text-white backdrop-blur-xl z-100 translate-x-[-50%] -translate-y-full"
							style={{
								left: `${tooltipPos.x}px`,
								top: `${tooltipPos.y}px`,
							}}
						>
							{label}
							<div className="absolute -bottom-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-black/90" />
						</motion.div>
					</AnimatePresence>,
					document.body,
				)}
		</>
	);
}
