"use client";

import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { NeoToggle } from "./neo-toggle";

type ThemeSwitcherProps = {
  className?: string;
};

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-10 w-20 rounded-full",
          "border-neo-border border-[length:var(--border-neo)]",
          "bg-neo-card",
          className,
        )}
      />
    );
  }

  const currentTheme = theme === "dark" ? "dark" : "light";

  return (
    <NeoToggle
      value={currentTheme}
      options={["light", "dark"]}
      onChange={setTheme}
      className={className}
      renderOption={(option, isActive) => {
        const Icon = option === "light" ? Sun : Moon;
        return (
          <Icon
            className={cn(
              "size-5 transition-colors duration-200",
              isActive ? "text-neo-accent-foreground" : "text-neo-text-muted",
            )}
          />
        );
      }}
    />
  );
}
