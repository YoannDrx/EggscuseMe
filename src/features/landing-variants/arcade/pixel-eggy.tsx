"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type PixelEggyProps = {
  className?: string;
  animate?: boolean;
};

export function PixelEggy({ className, animate = true }: PixelEggyProps) {
  return (
    <motion.div
      className={cn("relative", className)}
      animate={
        animate
          ? {
              y: [0, -10, 0],
            }
          : undefined
      }
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        width="64"
        height="80"
        viewBox="0 0 64 80"
        fill="none"
        className="pixelated"
        style={{ imageRendering: "pixelated" }}
      >
        {/* Egg body - pixel art style */}
        <rect x="20" y="8" width="24" height="8" fill="#FDFBF7" />
        <rect x="12" y="16" width="40" height="8" fill="#FDFBF7" />
        <rect x="8" y="24" width="48" height="8" fill="#FDFBF7" />
        <rect x="8" y="32" width="48" height="8" fill="#FDFBF7" />
        <rect x="8" y="40" width="48" height="8" fill="#FDFBF7" />
        <rect x="12" y="48" width="40" height="8" fill="#FDFBF7" />
        <rect x="16" y="56" width="32" height="8" fill="#FDFBF7" />
        <rect x="24" y="64" width="16" height="8" fill="#FDFBF7" />

        {/* Eyes */}
        <rect x="20" y="32" width="8" height="8" fill="#1a1a2e" />
        <rect x="36" y="32" width="8" height="8" fill="#1a1a2e" />

        {/* Eye shine */}
        <rect x="20" y="32" width="4" height="4" fill="white" />
        <rect x="36" y="32" width="4" height="4" fill="white" />

        {/* Blush */}
        <rect x="12" y="40" width="8" height="4" fill="#FFB6C1" opacity="0.6" />
        <rect x="44" y="40" width="8" height="4" fill="#FFB6C1" opacity="0.6" />

        {/* Smile */}
        <rect x="24" y="48" width="4" height="4" fill="#1a1a2e" />
        <rect x="36" y="48" width="4" height="4" fill="#1a1a2e" />
        <rect x="28" y="52" width="8" height="4" fill="#1a1a2e" />
      </svg>
    </motion.div>
  );
}
