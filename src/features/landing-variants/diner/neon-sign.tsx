"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type NeonSignProps = {
  text: string;
  color?: "pink" | "yellow" | "turquoise" | "red";
  className?: string;
  size?: "sm" | "md" | "lg";
};

const colorStyles = {
  pink: {
    text: "text-[var(--diner-neon-pink)]",
    glow: "drop-shadow-[0_0_10px_var(--diner-neon-pink)] drop-shadow-[0_0_20px_var(--diner-neon-pink)] drop-shadow-[0_0_40px_var(--diner-neon-pink)]",
    border: "border-[var(--diner-neon-pink)]",
  },
  yellow: {
    text: "text-[var(--diner-neon-yellow)]",
    glow: "drop-shadow-[0_0_10px_var(--diner-neon-yellow)] drop-shadow-[0_0_20px_var(--diner-neon-yellow)] drop-shadow-[0_0_40px_var(--diner-neon-yellow)]",
    border: "border-[var(--diner-neon-yellow)]",
  },
  turquoise: {
    text: "text-[var(--diner-turquoise)]",
    glow: "drop-shadow-[0_0_10px_var(--diner-turquoise)] drop-shadow-[0_0_20px_var(--diner-turquoise)] drop-shadow-[0_0_40px_var(--diner-turquoise)]",
    border: "border-[var(--diner-turquoise)]",
  },
  red: {
    text: "text-[var(--diner-red)]",
    glow: "drop-shadow-[0_0_10px_var(--diner-red)] drop-shadow-[0_0_20px_var(--diner-red)] drop-shadow-[0_0_40px_var(--diner-red)]",
    border: "border-[var(--diner-red)]",
  },
};

const sizeStyles = {
  sm: "text-2xl sm:text-3xl",
  md: "text-4xl sm:text-5xl",
  lg: "text-5xl sm:text-7xl lg:text-8xl",
};

export function NeonSign({
  text,
  color = "pink",
  className,
  size = "md",
}: NeonSignProps) {
  const styles = colorStyles[color];

  return (
    <motion.div
      className={cn("relative inline-block", className)}
      animate={{
        filter: [
          "brightness(1)",
          "brightness(0.8)",
          "brightness(1.1)",
          "brightness(0.9)",
          "brightness(1)",
        ],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <span
        className={cn(
          "font-heading font-bold tracking-tight italic",
          sizeStyles[size],
          styles.text,
          styles.glow,
        )}
        style={{
          textShadow: `0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor, 0 0 80px currentColor`,
        }}
      >
        {text}
      </span>
    </motion.div>
  );
}

type NeonBorderProps = {
  children: React.ReactNode;
  color?: "pink" | "yellow" | "turquoise" | "red";
  className?: string;
};

export function NeonBorder({
  children,
  color = "pink",
  className,
}: NeonBorderProps) {
  const styles = colorStyles[color];

  return (
    <motion.div
      className={cn(
        "relative rounded-2xl border-4 p-6",
        styles.border,
        className,
      )}
      animate={{
        boxShadow: [
          `0 0 10px currentColor, 0 0 20px currentColor, inset 0 0 10px currentColor`,
          `0 0 15px currentColor, 0 0 30px currentColor, inset 0 0 15px currentColor`,
          `0 0 10px currentColor, 0 0 20px currentColor, inset 0 0 10px currentColor`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        color: `var(--diner-neon-${color === "yellow" ? "yellow" : color})`,
      }}
    >
      {children}
    </motion.div>
  );
}
