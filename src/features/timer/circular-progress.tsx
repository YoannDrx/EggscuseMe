"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type CircularProgressProps = {
  /** Progress from 0 to 1 (0 = full, 1 = empty/consumed) */
  progress: number;
  /** Size in pixels */
  size?: number;
  /** Stroke width for the progress ring */
  strokeWidth?: number;
  /** Color for the remaining time (the arc) */
  progressColor?: string;
  /** Color for the consumed time (background track) */
  trackColor?: string;
  /** Whether timer is running */
  isRunning?: boolean;
  /** Whether timer is complete */
  isComplete?: boolean;
  /** Content to display in center */
  children?: React.ReactNode;
  /** Additional class name */
  className?: string;
};

/**
 * Simple circular progress that shows time being consumed
 * The arc decreases as time passes (like a countdown)
 */
export function CircularProgress({
  progress,
  size = 260,
  strokeWidth = 12,
  progressColor = "hsl(var(--primary))",
  trackColor = "hsl(var(--muted))",
  isRunning = false,
  isComplete = false,
  children,
  className,
}: CircularProgressProps) {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Remaining progress (1 - progress because we want to show what's LEFT)
  const remainingProgress = 1 - progress;
  const strokeDashoffset = circumference * (1 - remainingProgress);

  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-90"
      >
        {/* Background track (consumed time) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          className="opacity-30"
        />

        {/* Progress arc (remaining time) */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={isComplete ? "hsl(var(--fresh-extra))" : progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: 0 }}
          animate={{
            strokeDashoffset,
            stroke: isComplete ? "hsl(var(--fresh-extra))" : progressColor,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Pulsing glow when running */}
        {isRunning && (
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={progressColor}
            strokeWidth={strokeWidth + 8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            opacity={0.2}
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>

      {/* Completion celebration effect */}
      {isComplete && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, hsl(var(--fresh-extra) / 0.1) 0%, transparent 70%)`,
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </div>
  );
}
