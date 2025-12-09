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
          "bg-muted flex h-9 w-[72px] items-center rounded-full p-1",
          className,
        )}
      >
        <div className="size-7 rounded-full" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex h-9 w-[72px] items-center rounded-full p-1 transition-colors",
        isDark ? "bg-stone-800" : "bg-stone-200",
        className,
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {/* Icons */}
      <div className="flex w-full items-center justify-between px-1.5">
        <Sun
          className={cn(
            "size-4 transition-colors",
            isDark ? "text-stone-500" : "text-amber-500",
          )}
        />
        <Moon
          className={cn(
            "size-4 transition-colors",
            isDark ? "text-amber-400" : "text-stone-400",
          )}
        />
      </div>

      {/* Sliding pill */}
      <div
        className={cn(
          "bg-background absolute top-1 size-7 rounded-full shadow-sm transition-all duration-200",
          isDark ? "left-[calc(100%-32px)]" : "left-1",
        )}
      />
    </button>
  );
}
