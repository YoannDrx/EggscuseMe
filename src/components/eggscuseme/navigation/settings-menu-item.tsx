"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

type SettingsMenuItemProps = {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive?: boolean;
  variant?: "default" | "destructive";
  onClick?: () => void;
};

export function SettingsMenuItem({
  icon: Icon,
  label,
  href,
  isActive = false,
  variant = "default",
  onClick,
}: SettingsMenuItemProps) {
  const isDestructive = variant === "destructive";

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: "spring", damping: 25, stiffness: 300 },
        },
      }}
    >
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "flex items-center gap-4 px-4 py-3.5 transition-all",
          "min-h-[var(--touch-target-comfortable)]",
          "rounded-[var(--radius-neo-xl)]",
          "border-[length:var(--border-neo)]",
          // Default state
          isDestructive
            ? "text-neo-destructive border-transparent"
            : isActive
              ? "bg-neo-accent/10 text-neo-accent border-neo-accent/30 shadow-[var(--shadow-neo-sm)]"
              : "text-neo-text border-transparent",
          // Hover state
          isDestructive
            ? "hover:bg-neo-destructive/10 hover:border-neo-destructive/30"
            : !isActive &&
                "hover:bg-neo-bg hover:border-neo-border/20 hover:shadow-[var(--shadow-neo-sm)]",
          // Active (pressed) state
          "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        )}
      >
        <Icon
          className={cn(
            "size-5 shrink-0",
            isDestructive
              ? "text-neo-destructive"
              : isActive
                ? "text-neo-accent"
                : "text-neo-text-muted",
          )}
        />
        <span className="flex-1 font-medium">{label}</span>
        {!isDestructive && (
          <ChevronRight
            className={cn(
              "size-4 shrink-0",
              isActive ? "text-neo-accent" : "text-neo-text-muted/50",
            )}
          />
        )}
      </Link>
    </motion.div>
  );
}
