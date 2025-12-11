"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import type { ReactNode } from "react";

const statsCardVariants = cva(
  [
    "relative flex flex-col",
    "rounded-[var(--radius-neo-xl)] p-4",
    "bg-neo-card text-neo-text",
    "border-[length:var(--border-neo)] border-neo-border",
    "shadow-[var(--shadow-neo-md)]",
    "min-w-[140px]",
  ],
  {
    variants: {
      size: {
        sm: "gap-1 p-3",
        default: "gap-2",
        lg: "gap-3 p-5",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export type StatsCardProps = VariantProps<typeof statsCardVariants> & {
  /** Icon to display */
  icon?: ReactNode;
  /** Icon background color class */
  iconBg?: string;
  /** Main value to display */
  value: string | number;
  /** Label describing the value */
  label: string;
  /** Trend value (e.g., "+5", "-3", "0") */
  trend?: number;
  /** Trend label (e.g., "ce mois", "cette semaine") */
  trendLabel?: string;
  /** Additional CSS classes */
  className?: string;
  /** Animation delay for staggered entry */
  delay?: number;
};

/**
 * KPI/Stats card for dashboard
 * - Icon with colored background
 * - Large value
 * - Descriptive label
 * - Optional trend indicator
 */
export function StatsCard({
  icon,
  iconBg = "bg-primary/10",
  value,
  label,
  trend,
  trendLabel,
  size,
  className,
  delay = 0,
}: StatsCardProps) {
  const trendDirection =
    trend === undefined
      ? null
      : trend > 0
        ? "up"
        : trend < 0
          ? "down"
          : "neutral";

  return (
    <motion.div
      className={cn(statsCardVariants({ size }), className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {/* Icon */}
      {icon && (
        <div
          className={cn(
            "flex size-10 items-center justify-center rounded-xl",
            iconBg,
          )}
        >
          {icon}
        </div>
      )}

      {/* Value */}
      <motion.span
        className="font-heading text-2xl font-bold tabular-nums"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: delay + 0.1 }}
      >
        {value}
      </motion.span>

      {/* Label */}
      <span className="text-neo-text-muted text-sm font-medium">{label}</span>

      {/* Trend */}
      {trend !== undefined && (
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-medium",
            trendDirection === "up" && "text-success",
            trendDirection === "down" && "text-destructive",
            trendDirection === "neutral" && "text-neo-text-muted",
          )}
        >
          {trendDirection === "up" && <ArrowUp className="size-3" />}
          {trendDirection === "down" && <ArrowDown className="size-3" />}
          {trendDirection === "neutral" && <Minus className="size-3" />}
          <span>
            {trend > 0 ? "+" : ""}
            {trend} {trendLabel}
          </span>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Horizontal scrollable container for stats cards
 */
export function StatsCardCarousel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 overflow-x-auto pb-2",
        "-mx-4 px-4", // Negative margin to allow cards to touch edges
        "scrollbar-none snap-x snap-mandatory",
        className,
      )}
    >
      {children}
    </div>
  );
}
