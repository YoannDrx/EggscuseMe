"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type TickMarkDialProps = {
  /** Progress from 0 to 1 */
  progress: number;
  /** Size in pixels */
  size?: number;
  /** Number of tick marks */
  tickCount?: number;
  /** Color for active (remaining) ticks */
  activeColor?: string;
  /** Color for inactive (elapsed) ticks */
  inactiveColor?: string;
  /** Accent color for the progress indicator */
  accentColor?: string;
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
 * Circular dial with tick marks that gray out as time passes
 * Inspired by analog clock/timer designs
 */
export function TickMarkDial({
  progress,
  size = 280,
  tickCount = 60,
  activeColor = "hsl(var(--foreground))",
  inactiveColor = "hsl(var(--muted-foreground) / 0.2)",
  accentColor = "hsl(var(--primary))",
  isRunning = false,
  isComplete = false,
  children,
  className,
}: TickMarkDialProps) {
  const center = size / 2;
  const outerRadius = size / 2 - 8;
  const innerRadius = outerRadius - 16;
  const tickLength = 12;

  // Calculate which ticks should be active (remaining time)
  const elapsedTicks = Math.floor(progress * tickCount);

  return (
    <div
      className={cn("relative", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
      >
        {/* Outer glow ring when running */}
        {isRunning && (
          <motion.circle
            cx={center}
            cy={center}
            r={outerRadius + 4}
            fill="none"
            stroke={accentColor}
            strokeWidth={2}
            opacity={0.3}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{
              scale: [0.95, 1.02, 0.95],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius - 8}
          fill="hsl(var(--card))"
          stroke="hsl(var(--border))"
          strokeWidth={2}
        />

        {/* Tick marks */}
        {Array.from({ length: tickCount }).map((_, index) => {
          const angle = (index / tickCount) * 360 - 90; // Start from top
          const radian = (angle * Math.PI) / 180;

          // Determine if this tick is elapsed (should be grayed out)
          const isElapsed = index < elapsedTicks;

          // Calculate tick positions
          const isMajorTick = index % 5 === 0;
          const currentTickLength = isMajorTick ? tickLength + 4 : tickLength;
          const currentTickWidth = isMajorTick ? 3 : 2;

          const x1 =
            center + Math.cos(radian) * (outerRadius - currentTickLength);
          const y1 =
            center + Math.sin(radian) * (outerRadius - currentTickLength);
          const x2 = center + Math.cos(radian) * outerRadius;
          const y2 = center + Math.sin(radian) * outerRadius;

          return (
            <motion.line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isElapsed ? inactiveColor : activeColor}
              strokeWidth={currentTickWidth}
              strokeLinecap="round"
              initial={false}
              animate={{
                stroke: isElapsed ? inactiveColor : activeColor,
                opacity: isElapsed ? 0.3 : 1,
              }}
              transition={{ duration: 0.3 }}
            />
          );
        })}

        {/* Progress arc */}
        {progress > 0 && (
          <motion.circle
            cx={center}
            cy={center}
            r={innerRadius}
            fill="none"
            stroke={accentColor}
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * innerRadius}
            strokeDashoffset={2 * Math.PI * innerRadius * (1 - progress)}
            transform={`rotate(-90 ${center} ${center})`}
            initial={{ strokeDashoffset: 2 * Math.PI * innerRadius }}
            animate={{
              strokeDashoffset: 2 * Math.PI * innerRadius * (1 - progress),
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}

        {/* Completion celebration ring */}
        {isComplete && (
          <motion.circle
            cx={center}
            cy={center}
            r={innerRadius}
            fill="none"
            stroke="hsl(var(--fresh-extra))"
            strokeWidth={6}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [1, 0.8, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Center decorative ring */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius - 20}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={1}
          opacity={0.5}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>

      {/* Bubbles animation when cooking */}
      {isRunning && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 6 + Math.random() * 8,
                height: 6 + Math.random() * 8,
                left: `${20 + Math.random() * 60}%`,
                bottom: "30%",
                background: accentColor,
                opacity: 0.3,
              }}
              animate={{
                y: [0, -80 - Math.random() * 40],
                opacity: [0.4, 0],
                scale: [1, 0.5],
              }}
              transition={{
                duration: 1.5 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
