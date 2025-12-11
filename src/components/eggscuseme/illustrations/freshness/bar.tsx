"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { STICKER_STYLE } from "../base/sticker-base";

type FreshnessBarProps = ComponentProps<"svg"> & {
  size?: "sm" | "md" | "lg";
  animate?: boolean;
  /** Percentage filled (0-100) */
  percentage?: number;
  /** Current day number */
  currentDay?: number;
  /** Show Eggy indicator */
  showEggy?: boolean;
  /** Compact mode without labels */
  compact?: boolean;
};

const sizeMap = {
  sm: "w-32 h-8",
  md: "w-48 h-12",
  lg: "w-64 h-16",
};

/**
 * Horizontal progress bar showing egg freshness
 * Great for list views and compact displays
 */
export function IlluFreshnessBar({
  size = "md",
  animate = true,
  percentage = 70,
  currentDay = 8,
  showEggy = true,
  compact = false,
  className,
  ...props
}: FreshnessBarProps) {
  // Determine status and color based on percentage (100% = fresh, 0% = expired)
  const getStatus = () => {
    if (percentage >= 75) return { status: "extra-fresh", color: "#22C55E" };
    if (percentage >= 40) return { status: "fresh", color: "#FBBF24" };
    if (percentage >= 15) return { status: "cook", color: "#F97316" };
    return { status: "expired", color: "#EF4444" };
  };

  const { color } = getStatus();
  const barWidth = compact ? 100 : 140;
  const filledWidth = (percentage / 100) * barWidth;
  const eggyX = 30 + filledWidth;

  // ViewBox dimensions based on compact mode
  const viewBoxHeight = compact ? 20 : 40;
  const viewBox = `0 0 180 ${viewBoxHeight}`;

  return (
    <svg
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeMap[size], className)}
      {...props}
    >
      {/* Background bar */}
      <rect
        x="20"
        y={compact ? 6 : 18}
        width={barWidth + 20}
        height="8"
        rx="4"
        fill="#E5E7EB"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1}
      />

      {/* Gradient fill */}
      <defs>
        <linearGradient
          id="freshnessGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="33%" stopColor="#FBBF24" />
          <stop offset="66%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>
      </defs>

      {/* Full gradient bar (background) */}
      <rect
        x="20"
        y={compact ? 6 : 18}
        width={barWidth + 20}
        height="8"
        rx="4"
        fill="url(#freshnessGradient)"
        opacity={0.2}
      />

      {/* Filled portion */}
      <rect
        x="20"
        y={compact ? 6 : 18}
        width={Math.max(4, filledWidth)}
        height="8"
        rx="4"
        fill={color}
        className={animate ? "transition-all duration-500 ease-out" : ""}
      />

      {/* Labels (if not compact) */}
      {!compact && (
        <>
          <text x="20" y="12" fill="#22C55E" className="text-[6px] font-medium">
            Frais
          </text>
          <text
            x="155"
            y="12"
            textAnchor="end"
            fill="#EF4444"
            className="text-[6px] font-medium"
          >
            Périmé
          </text>
        </>
      )}

      {/* Day indicator (if not compact) */}
      {!compact && (
        <text
          x={eggyX}
          y="36"
          textAnchor="middle"
          fill={STICKER_STYLE.stroke}
          className="text-[7px] font-bold"
        >
          J{currentDay}
        </text>
      )}

      {/* Mini Eggy indicator */}
      {showEggy && (
        <g
          transform={`translate(${eggyX}, ${compact ? 10 : 22})`}
          className={
            animate ? "animate-[bounce-subtle_2s_ease-in-out_infinite]" : ""
          }
        >
          {/* Mini egg body */}
          <ellipse
            cx="0"
            cy="0"
            rx="6"
            ry="7"
            fill={STICKER_STYLE.fillEgg}
            stroke={STICKER_STYLE.stroke}
            strokeWidth={1}
          />

          {/* Eyes - tiny dots */}
          <circle cx="-2" cy="-1" r="1" fill={STICKER_STYLE.stroke} />
          <circle cx="2" cy="-1" r="1" fill={STICKER_STYLE.stroke} />

          {/* Simple smile/frown based on freshness */}
          {percentage >= 40 ? (
            <path
              d="M-2 2 Q0 4, 2 2"
              stroke={STICKER_STYLE.stroke}
              strokeWidth={0.8}
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <path
              d="M-2 3 Q0 1, 2 3"
              stroke={STICKER_STYLE.stroke}
              strokeWidth={0.8}
              strokeLinecap="round"
              fill="none"
            />
          )}
        </g>
      )}
    </svg>
  );
}
