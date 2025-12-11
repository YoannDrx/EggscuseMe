"use client";

import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type ThemeSwitcherProps = {
  className?: string;
};

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "border-neo-border bg-neo-input flex h-9 w-[76px] items-center rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)] p-1",
          className,
        )}
      >
        <div className="size-7 rounded-[var(--radius-neo-lg)]" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex h-9 w-[76px] items-center p-1 transition-all duration-200",
        "border-neo-border rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)]",
        "shadow-[var(--shadow-neo-sm)] hover:shadow-[var(--shadow-neo-md)]",
        "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        isDark ? "bg-neo-card" : "bg-neo-accent/20",
        className,
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Icons */}
      <div className="relative z-10 flex w-full items-center justify-between px-2">
        <Sun
          className={cn(
            "size-4 transition-colors",
            isDark ? "text-neo-text-muted" : "text-neo-accent",
          )}
        />
        <Moon
          className={cn(
            "size-4 transition-colors",
            isDark ? "text-neo-accent" : "text-neo-text-muted",
          )}
        />
      </div>

      {/* Sliding pill - Neo style */}
      <div
        className={cn(
          "absolute top-1 size-7 transition-all duration-200",
          "border-neo-border rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)]",
          "bg-neo-bg shadow-[2px_2px_0_var(--neo-shadow-color)]",
          isDark ? "left-[calc(100%-32px)]" : "left-1",
        )}
      />
    </button>
  );
}
