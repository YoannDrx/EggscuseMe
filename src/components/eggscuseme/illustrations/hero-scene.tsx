"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Eggy } from "@/features/mascot/components/eggy";

type HeroSceneProps = {
  className?: string;
};

export function HeroScene({ className }: HeroSceneProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      {/* Floating particles */}
      <motion.div
        className="absolute -top-4 -left-8 h-3 w-3 rounded-full bg-amber-400"
        animate={{
          y: [0, -10, 0],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-8 -right-6 h-2 w-2 rounded-full bg-emerald-400"
        animate={{
          y: [0, -15, 0],
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      <motion.div
        className="absolute -bottom-2 left-4 h-4 w-4 rounded-full bg-orange-400"
        animate={{
          y: [0, -8, 0],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Main Eggy with hero mood */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
      >
        <Eggy mood="hero" size="xl" />
      </motion.div>

      {/* Sparkle effects */}
      <motion.svg
        className="absolute -top-2 right-0 h-6 w-6 text-amber-400"
        viewBox="0 0 24 24"
        fill="currentColor"
        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
        transition={{
          rotate: { duration: 8, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </motion.svg>
    </div>
  );
}
