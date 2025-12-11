"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";

type FloatingActionButtonProps = {
  icon: LucideIcon;
  onClick: () => void;
  label?: string;
  className?: string;
};

export function FloatingActionButton({
  icon: Icon,
  onClick,
  label,
  className,
}: FloatingActionButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "fixed right-6 bottom-24 z-50",
        "flex size-14 items-center justify-center",
        "rounded-full",
        "bg-neo-accent text-neo-accent-foreground",
        "border-neo-border border-[length:var(--border-neo)]",
        "shadow-[var(--shadow-neo-lg)]",
        "hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--neo-shadow-color)]",
        "active:translate-x-[4px] active:translate-y-[4px] active:shadow-none",
        "transition-all duration-200",
        className,
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      <Icon size={24} strokeWidth={2.5} />
    </motion.button>
  );
}
