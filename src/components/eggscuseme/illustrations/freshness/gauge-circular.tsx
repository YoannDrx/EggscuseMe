"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { STICKER_STYLE } from "../base/sticker-base";

type GaugeCircularProps = ComponentProps<"svg"> & {
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  /** Percentage filled (0-100) */
  percentage?: number;
  /** Days remaining or elapsed */
  daysLabel?: string;
  /** Status text */
  statusLabel?: string;
  /** Freshness status for color */
  status?: "extra-fresh" | "fresh" | "cook" | "expired";
};

const sizeMap = {
  sm: "w-24 h-24",
  md: "w-32 h-32",
  lg: "w-40 h-40",
  xl: "w-48 h-48",
};

const statusColors = {
  "extra-fresh": "#22C55E",
  fresh: "#FBBF24",
  cook: "#F97316",
  expired: "#EF4444",
};

/**
 * Circular gauge showing freshness percentage with Eggy
 */
export function IlluGaugeCircular({
  size = "md",
  animate = true,
  percentage = 75,
  daysLabel = "8 jours",
  statusLabel = "Frais",
  status = "fresh",
  className,
  ...props
}: GaugeCircularProps) {
  // SVG arc calculations
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const statusColor = statusColors[status];

  // Get mood expression based on status
  const getMouthPath = () => {
    switch (status) {
      case "extra-fresh":
        return "M-5 3 Q0 10, 5 3"; // Big smile
      case "fresh":
        return "M-4 2 Q0 7, 4 2"; // Happy smile
      case "cook":
        return "M-4 4 Q0 1, 4 4"; // Worried
      case "expired":
        return "M-4 5 Q0 0, 4 5"; // Sad frown
    }
  };

  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeMap[size], className)}
      {...props}
    >
      {/* Background circle */}
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth="8"
      />

      {/* Progress arc */}
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke={statusColor}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform="rotate(-90 60 60)"
        className={animate ? "transition-all duration-1000 ease-out" : ""}
      />

      {/* Center Eggy */}
      <g transform="translate(60, 55)">
        {/* Egg body */}
        <ellipse
          cx="0"
          cy="0"
          rx="18"
          ry="22"
          fill={STICKER_STYLE.fillEgg}
          stroke={STICKER_STYLE.stroke}
          strokeWidth={STICKER_STYLE.strokeWidth}
        />

        {/* Eyes */}
        {status === "expired" ? (
          // X eyes
          <g>
            <path
              d="M-9 -5 L-5 -1 M-9 -1 L-5 -5"
              stroke={STICKER_STYLE.stroke}
              strokeWidth={1.5}
            />
            <path
              d="M5 -5 L9 -1 M5 -1 L9 -5"
              stroke={STICKER_STYLE.stroke}
              strokeWidth={1.5}
            />
          </g>
        ) : (
          // Normal eyes
          <g>
            <ellipse
              cx="-6"
              cy="-4"
              rx="3"
              ry="4"
              fill={STICKER_STYLE.stroke}
            />
            <ellipse cx="6" cy="-4" rx="3" ry="4" fill={STICKER_STYLE.stroke} />
            <circle cx="-5" cy="-5" r="1.2" fill="white" />
            <circle cx="7" cy="-5" r="1.2" fill="white" />
          </g>
        )}

        {/* Blush */}
        {status !== "expired" && (
          <g>
            <ellipse
              cx="-14"
              cy="4"
              rx="4"
              ry="2"
              fill="#FFB6C1"
              opacity={0.4}
            />
            <ellipse
              cx="14"
              cy="4"
              rx="4"
              ry="2"
              fill="#FFB6C1"
              opacity={0.4}
            />
          </g>
        )}

        {/* Mouth */}
        <path
          d={getMouthPath()}
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1.5}
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Days label */}
      <text
        x="60"
        y="90"
        textAnchor="middle"
        fill={STICKER_STYLE.stroke}
        className="text-[10px] font-bold"
      >
        {daysLabel}
      </text>

      {/* Status label */}
      <text
        x="60"
        y="102"
        textAnchor="middle"
        fill={statusColor}
        className="text-[9px] font-medium"
      >
        {statusLabel}
      </text>

      {/* Percentage badge */}
      <g transform="translate(90, 20)">
        <circle
          cx="0"
          cy="0"
          r="14"
          fill={statusColor}
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1.5}
        />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fill="white"
          className="text-[9px] font-bold"
        >
          {percentage}%
        </text>
      </g>
    </svg>
  );
}

export default IlluGaugeCircular;
