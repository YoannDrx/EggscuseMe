"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { ReactNode } from "react";

type PowerUpCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  color: "pink" | "cyan" | "green" | "yellow";
  className?: string;
};

const colorStyles = {
  pink: {
    border: "border-[var(--arcade-neon-pink)]",
    glow: "shadow-[0_0_20px_var(--arcade-neon-pink),inset_0_0_20px_var(--arcade-neon-pink)/20]",
    text: "text-[var(--arcade-neon-pink)]",
  },
  cyan: {
    border: "border-[var(--arcade-neon-cyan)]",
    glow: "shadow-[0_0_20px_var(--arcade-neon-cyan),inset_0_0_20px_var(--arcade-neon-cyan)/20]",
    text: "text-[var(--arcade-neon-cyan)]",
  },
  green: {
    border: "border-[var(--arcade-neon-green)]",
    glow: "shadow-[0_0_20px_var(--arcade-neon-green),inset_0_0_20px_var(--arcade-neon-green)/20]",
    text: "text-[var(--arcade-neon-green)]",
  },
  yellow: {
    border: "border-[var(--arcade-neon-yellow)]",
    glow: "shadow-[0_0_20px_var(--arcade-neon-yellow),inset_0_0_20px_var(--arcade-neon-yellow)/20]",
    text: "text-[var(--arcade-neon-yellow)]",
  },
};

export function PowerUpCard({
  icon,
  title,
  description,
  color,
  className,
}: PowerUpCardProps) {
  const styles = colorStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -5 }}
      className={cn(
        "relative rounded-lg border-2 bg-[var(--arcade-dark)] p-6",
        styles.border,
        styles.glow,
        className,
      )}
    >
      {/* Icon */}
      <div className={cn("mb-4 text-4xl", styles.text)}>{icon}</div>

      {/* Title */}
      <h3
        className={cn("font-heading text-xl font-bold", styles.text)}
        style={{
          textShadow: `0 0 10px currentColor`,
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p className="mt-2 text-sm text-white/70">{description}</p>

      {/* Corner decorations */}
      <div
        className={cn(
          "absolute top-2 left-2 size-2",
          styles.border,
          "border-t-2 border-l-2",
        )}
      />
      <div
        className={cn(
          "absolute top-2 right-2 size-2",
          styles.border,
          "border-t-2 border-r-2",
        )}
      />
      <div
        className={cn(
          "absolute bottom-2 left-2 size-2",
          styles.border,
          "border-b-2 border-l-2",
        )}
      />
      <div
        className={cn(
          "absolute right-2 bottom-2 size-2",
          styles.border,
          "border-r-2 border-b-2",
        )}
      />
    </motion.div>
  );
}
