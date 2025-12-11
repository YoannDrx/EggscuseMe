"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { ReactNode } from "react";

type SpringButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function SpringButton({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  className,
}: SpringButtonProps) {
  const variants = {
    primary: [
      "bg-neo-accent text-neo-accent-foreground",
      "border-[length:var(--border-neo)] border-neo-border",
      "shadow-[var(--shadow-neo-md)]",
      "hover:shadow-[var(--shadow-neo-lg)]",
      "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
    ].join(" "),
    secondary: [
      "bg-neo-card text-neo-text",
      "border-[length:var(--border-neo)] border-neo-border",
      "shadow-[var(--shadow-neo-sm)]",
      "hover:shadow-[var(--shadow-neo-md)]",
      "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
    ].join(" "),
    ghost: [
      "bg-transparent text-neo-text-muted",
      "hover:text-neo-text hover:bg-neo-card/50",
    ].join(" "),
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-[var(--radius-neo-sm)]",
    md: "px-4 py-2 text-base rounded-[var(--radius-neo-lg)]",
    lg: "px-6 py-3 text-lg rounded-[var(--radius-neo-xl)]",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "font-bold transition-all duration-200",
        "focus-visible:ring-neo-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        variants[variant],
        sizes[size],
        disabled && "pointer-events-none opacity-50",
        className,
      )}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
    >
      {children}
    </motion.button>
  );
}
