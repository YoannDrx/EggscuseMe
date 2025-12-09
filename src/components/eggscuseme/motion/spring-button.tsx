"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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
    primary: "bg-amber-400 text-stone-950 shadow-md",
    secondary: "bg-stone-800 text-stone-100 border border-stone-700",
    ghost: "bg-transparent text-stone-400 hover:text-stone-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-4 py-2 text-base rounded-xl",
    lg: "px-6 py-3 text-lg rounded-2xl",
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
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
