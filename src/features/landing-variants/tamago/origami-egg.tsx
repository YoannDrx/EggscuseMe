"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type OrigamiEggProps = {
  className?: string;
};

export function OrigamiEgg({ className }: OrigamiEggProps) {
  return (
    <motion.div
      className={cn("relative", className)}
      initial={{ rotateX: 90, opacity: 0 }}
      animate={{ rotateX: 0, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <svg
        width="200"
        height="260"
        viewBox="0 0 200 260"
        fill="none"
        className="drop-shadow-lg"
      >
        {/* Main egg shape - origami style with geometric facets */}
        <defs>
          <linearGradient id="zenGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--zen-washi)" />
            <stop offset="100%" stopColor="var(--zen-kinari)" />
          </linearGradient>
          <linearGradient id="zenGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--zen-kinari)" />
            <stop offset="100%" stopColor="var(--zen-washi)" />
          </linearGradient>
        </defs>

        {/* Left facet */}
        <motion.path
          d="M100 10 L30 80 L30 180 L100 250 L100 10"
          fill="url(#zenGradient1)"
          stroke="var(--zen-sumi)"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        />

        {/* Right facet */}
        <motion.path
          d="M100 10 L170 80 L170 180 L100 250 L100 10"
          fill="url(#zenGradient2)"
          stroke="var(--zen-sumi)"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        />

        {/* Top left facet */}
        <motion.path
          d="M100 10 L30 80 L100 100 L100 10"
          fill="var(--zen-washi)"
          stroke="var(--zen-sumi)"
          strokeWidth="0.5"
          opacity="0.8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        />

        {/* Top right facet */}
        <motion.path
          d="M100 10 L170 80 L100 100 L100 10"
          fill="var(--zen-kinari)"
          stroke="var(--zen-sumi)"
          strokeWidth="0.5"
          opacity="0.9"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        />

        {/* Center fold line */}
        <motion.line
          x1="100"
          y1="10"
          x2="100"
          y2="250"
          stroke="var(--zen-sumi)"
          strokeWidth="0.5"
          opacity="0.3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 1, duration: 1 }}
        />

        {/* Decorative enso circle */}
        <motion.circle
          cx="100"
          cy="130"
          r="30"
          fill="none"
          stroke="var(--zen-matcha)"
          strokeWidth="2"
          opacity="0.4"
          strokeDasharray="150"
          strokeDashoffset="30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        />
      </svg>
    </motion.div>
  );
}
