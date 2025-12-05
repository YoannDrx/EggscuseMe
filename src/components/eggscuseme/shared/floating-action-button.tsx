"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useThemeColors } from "../theme";

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
  const colors = useThemeColors();

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "fixed right-6 bottom-24 z-[var(--z-fab)]",
        "flex h-14 w-14 items-center justify-center",
        "rounded-full shadow-[var(--shadow-fab)]",
        colors.accentBg,
        colors.accentForeground,
        "transition-shadow hover:shadow-lg",
        className,
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      <Icon size={24} strokeWidth={2.5} />
    </motion.button>
  );
}
