"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useCallback,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
	theme: Theme;
	toggleTheme: () => void;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_STORAGE_KEY = "personal-story-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setThemeState] = useState<Theme>("dark");
	const [mounted, setMounted] = useState(false);

	// Load theme from localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem(THEME_STORAGE_KEY);
		if (stored === "light" || stored === "dark") {
			setThemeState(stored);
		} else {
			// Set default to dark if no preference
			setThemeState("dark");
		}
		setMounted(true);
	}, []);

	// Update localStorage when theme changes
	useEffect(() => {
		if (mounted) {
			localStorage.setItem(THEME_STORAGE_KEY, theme);
		}
	}, [theme, mounted]);

	const setTheme = useCallback((newTheme: Theme) => {
		setThemeState(newTheme);
	}, []);

	const toggleTheme = useCallback(() => {
		setThemeState((prev) => (prev === "light" ? "dark" : "light"));
	}, []);

	const value: ThemeContextValue = {
		theme,
		toggleTheme,
		setTheme,
	};

	// Prevent flash of wrong theme
	if (!mounted) {
		return null;
	}

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

export function useTheme() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
}

