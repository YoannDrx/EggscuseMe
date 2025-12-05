"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import {
  type Theme,
  type ThemeId,
  defaultTheme,
  getNextTheme,
  getTheme,
} from "./themes";

const STORAGE_KEY = "eggscuseme-theme";

type ThemeContextType = {
  theme: Theme;
  themeId: ThemeId;
  setTheme: (id: ThemeId) => void;
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

type EggThemeProviderProps = {
  children: ReactNode;
  defaultThemeId?: ThemeId;
};

export function EggThemeProvider({
  children,
  defaultThemeId = defaultTheme,
}: EggThemeProviderProps) {
  const [themeId, setThemeId] = useState<ThemeId>(defaultThemeId);
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (
      stored &&
      (stored === "chef" || stored === "brunch" || stored === "bio")
    ) {
      setThemeId(stored);
    }
    setMounted(true);
  }, []);

  // Save theme to localStorage and update document class
  useEffect(() => {
    if (!mounted) return;

    localStorage.setItem(STORAGE_KEY, themeId);

    // Update document class for Tailwind dark mode
    const theme = getTheme(themeId);
    if (theme.isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Add theme-specific class for custom styling
    document.documentElement.dataset.theme = themeId;
  }, [themeId, mounted]);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeId(id);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeId((current) => getNextTheme(current));
  }, []);

  const theme = useMemo(() => getTheme(themeId), [themeId]);

  const value = useMemo(
    () => ({
      theme,
      themeId,
      setTheme,
      toggleTheme,
      isDark: theme.isDark,
    }),
    [theme, themeId, setTheme, toggleTheme],
  );

  // Always provide context, but show loading state for flash prevention
  return (
    <ThemeContext.Provider value={value}>
      {!mounted ? (
        <div className="min-h-screen bg-stone-950 text-stone-100">
          {children}
        </div>
      ) : (
        children
      )}
    </ThemeContext.Provider>
  );
}

export function useEggTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useEggTheme must be used within an EggThemeProvider");
  }
  return context;
}

/**
 * Hook to get current theme colors
 */
export function useThemeColors() {
  const { theme } = useEggTheme();
  return theme.colors;
}
