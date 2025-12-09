"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { STICKER_STYLE } from "../base/sticker-base";

type TimelineSelectorProps = ComponentProps<"svg"> & {
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  /** Current freshness value (0-28+ days) */
  currentDay?: number;
  /** Highlighted status: extra-fresh, fresh, cook, expired */
  highlightStatus?: "extra-fresh" | "fresh" | "cook" | "expired";
};

const sizeMap = {
  sm: "w-48 h-24",
  md: "w-72 h-32",
  lg: "w-96 h-40",
  xl: "w-[500px] h-48",
};

/**
 * Interactive freshness timeline with Eggy indicator
 * Shows progression from extra-fresh to expired
 */
export function IlluTimelineSelector({
  size = "md",
  animate = true,
  currentDay = 0,
  highlightStatus = "extra-fresh",
  className,
  ...props
}: TimelineSelectorProps) {
  // Calculate position (0-100%) based on day
  const getPosition = (day: number) => {
    if (day <= 9) return (day / 9) * 25; // 0-25%
    if (day <= 21) return 25 + ((day - 9) / 12) * 25; // 25-50%
    if (day <= 28) return 50 + ((day - 21) / 7) * 25; // 50-75%
    return 75 + Math.min((day - 28) / 7, 1) * 25; // 75-100%
  };

  const position = getPosition(currentDay);
  const indicatorX = 30 + (position / 100) * 240; // Map to SVG coords

  // Get mood based on status
  const getMoodPath = () => {
    switch (highlightStatus) {
      case "extra-fresh":
        // Big happy smile
        return "M-6 4 Q0 12, 6 4";
      case "fresh":
        // Content smile
        return "M-5 3 Q0 8, 5 3";
      case "cook":
        // Worried line
        return "M-4 5 Q0 2, 4 5";
      case "expired":
        // Sad frown
        return "M-5 6 Q0 1, 5 6";
    }
  };

  const getEyeStyle = () => {
    if (highlightStatus === "expired") {
      // X eyes for expired
      return (
        <g>
          <path
            d="M-6 -4 L-2 0 M-6 0 L-2 -4"
            stroke={STICKER_STYLE.stroke}
            strokeWidth={1.5}
          />
          <path
            d="M2 -4 L6 0 M2 0 L6 -4"
            stroke={STICKER_STYLE.stroke}
            strokeWidth={1.5}
          />
        </g>
      );
    }
    // Normal eyes
    return (
      <g>
        <ellipse cx="-4" cy="-2" rx="2" ry="2.5" fill={STICKER_STYLE.stroke} />
        <ellipse cx="4" cy="-2" rx="2" ry="2.5" fill={STICKER_STYLE.stroke} />
        <circle cx="-3" cy="-3" r="0.8" fill="white" />
        <circle cx="5" cy="-3" r="0.8" fill="white" />
      </g>
    );
  };

  return (
    <svg
      viewBox="0 0 300 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeMap[size], className)}
      {...props}
    >
      {/* Timeline base */}
      <rect
        x="30"
        y="50"
        width="240"
        height="8"
        rx="4"
        fill="#E5E7EB"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1}
      />

      {/* Extra-fresh zone (green) */}
      <rect x="30" y="50" width="60" height="8" rx="4" fill="#22C55E" />

      {/* Fresh zone (yellow) */}
      <rect x="90" y="50" width="60" height="8" fill="#FBBF24" />

      {/* Cook zone (orange) */}
      <rect x="150" y="50" width="60" height="8" fill="#F97316" />

      {/* Expired zone (red) */}
      <rect x="210" y="50" width="60" height="8" rx="4" fill="#EF4444" />

      {/* Zone markers */}
      <line
        x1="90"
        y1="46"
        x2="90"
        y2="62"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1}
      />
      <line
        x1="150"
        y1="46"
        x2="150"
        y2="62"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1}
      />
      <line
        x1="210"
        y1="46"
        x2="210"
        y2="62"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1}
      />

      {/* Labels */}
      <text
        x="60"
        y="75"
        textAnchor="middle"
        fill="#22C55E"
        className="text-[8px] font-bold"
      >
        Extra-frais
      </text>
      <text
        x="120"
        y="75"
        textAnchor="middle"
        fill="#FBBF24"
        className="text-[8px] font-bold"
      >
        Frais
      </text>
      <text
        x="180"
        y="75"
        textAnchor="middle"
        fill="#F97316"
        className="text-[8px] font-bold"
      >
        À cuire
      </text>
      <text
        x="240"
        y="75"
        textAnchor="middle"
        fill="#EF4444"
        className="text-[8px] font-bold"
      >
        Périmé
      </text>

      {/* Day labels */}
      <text
        x="30"
        y="90"
        textAnchor="middle"
        fill="#9CA3AF"
        className="text-[7px]"
      >
        J0
      </text>
      <text
        x="90"
        y="90"
        textAnchor="middle"
        fill="#9CA3AF"
        className="text-[7px]"
      >
        J9
      </text>
      <text
        x="150"
        y="90"
        textAnchor="middle"
        fill="#9CA3AF"
        className="text-[7px]"
      >
        J21
      </text>
      <text
        x="210"
        y="90"
        textAnchor="middle"
        fill="#9CA3AF"
        className="text-[7px]"
      >
        J28
      </text>
      <text
        x="270"
        y="90"
        textAnchor="middle"
        fill="#9CA3AF"
        className="text-[7px]"
      >
        J35+
      </text>

      {/* Eggy indicator */}
      <g
        transform={`translate(${indicatorX}, 30)`}
        className={
          animate ? "animate-[bounce-subtle_2s_ease-in-out_infinite]" : ""
        }
      >
        {/* Egg body */}
        <ellipse
          cx="0"
          cy="0"
          rx="12"
          ry="15"
          fill={STICKER_STYLE.fillEgg}
          stroke={STICKER_STYLE.stroke}
          strokeWidth={STICKER_STYLE.strokeWidth}
        />

        {/* Eyes */}
        {getEyeStyle()}

        {/* Blush */}
        {highlightStatus !== "expired" && (
          <g>
            <ellipse
              cx="-10"
              cy="4"
              rx="3"
              ry="1.5"
              fill="#FFB6C1"
              opacity={0.4}
            />
            <ellipse
              cx="10"
              cy="4"
              rx="3"
              ry="1.5"
              fill="#FFB6C1"
              opacity={0.4}
            />
          </g>
        )}

        {/* Mouth */}
        <path
          d={getMoodPath()}
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1.5}
          strokeLinecap="round"
          fill="none"
        />

        {/* Arrow pointing down */}
        <path
          d="M0 16 L0 22 M-4 18 L0 22 L4 18"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Current day display */}
      <text
        x={indicatorX}
        y="12"
        textAnchor="middle"
        fill={STICKER_STYLE.stroke}
        className="text-[10px] font-bold"
      >
        Jour {currentDay}
      </text>
    </svg>
  );
}

export default IlluTimelineSelector;
