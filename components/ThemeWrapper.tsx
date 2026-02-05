"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { useEffect } from "react";

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
	const { theme } = useTheme();

	useEffect(() => {
		const root = document.documentElement;
		if (theme === "light") {
			root.classList.add("light");
			root.classList.remove("dark");
		} else {
			root.classList.add("dark");
			root.classList.remove("light");
		}
	}, [theme]);

	return <>{children}</>;
}

