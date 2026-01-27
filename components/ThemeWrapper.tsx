"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useEffect } from "react";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
	const { theme } = useTheme();

	useEffect(() => {
		const root = document.documentElement;
		if (theme === "light") {
			root.classList.add("light");
		} else {
			root.classList.remove("light");
		}
	}, [theme]);

	return <>{children}</>;
}

