"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { STICKER_STYLE } from "../base/sticker-base";

type FreshnessStatus = "extra-fresh" | "fresh" | "cook" | "expired";

type FreshnessTagProps = ComponentProps<"div"> & {
  status: FreshnessStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animate?: boolean;
};

const statusConfig = {
  "extra-fresh": {
    label: "Extra-frais",
    bgColor: "bg-fresh-extra/20",
    borderColor: "border-fresh-extra",
    textColor: "text-fresh-extra",
    fillColor: "#22C55E",
    sparkle: true,
  },
  fresh: {
    label: "Frais",
    bgColor: "bg-fresh/20",
    borderColor: "border-fresh",
    textColor: "text-fresh",
    fillColor: "#FBBF24",
    sparkle: false,
  },
  cook: {
    label: "À cuire",
    bgColor: "bg-fresh-cook/20",
    borderColor: "border-fresh-cook",
    textColor: "text-fresh-cook",
    fillColor: "#F97316",
    sparkle: false,
  },
  expired: {
    label: "Périmé",
    bgColor: "bg-expired/20",
    borderColor: "border-expired",
    textColor: "text-expired",
    fillColor: "#EF4444",
    sparkle: false,
  },
};

const sizeClasses = {
  sm: "h-6 px-2 text-xs gap-1",
  md: "h-8 px-3 text-sm gap-1.5",
  lg: "h-10 px-4 text-base gap-2",
};

const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
};

/**
 * Illustrated freshness tag with mini Eggy icon
 */
export function FreshnessTag({
  status,
  size = "md",
  showLabel = true,
  animate = true,
  className,
  ...props
}: FreshnessTagProps) {
  const config = statusConfig[status];
  const iconSize = iconSizes[size];

  // Get mood based on status
  const getMouthPath = (s: number) => {
    switch (status) {
      case "extra-fresh":
        return `M${-s * 0.4} ${s * 0.2} Q0 ${s * 0.6}, ${s * 0.4} ${s * 0.2}`;
      case "fresh":
        return `M${-s * 0.3} ${s * 0.15} Q0 ${s * 0.4}, ${s * 0.3} ${s * 0.15}`;
      case "cook":
        return `M${-s * 0.25} ${s * 0.25} Q0 ${s * 0.1}, ${s * 0.25} ${s * 0.25}`;
      case "expired":
        return `M${-s * 0.3} ${s * 0.35} Q0 ${s * 0.05}, ${s * 0.3} ${s * 0.35}`;
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border-2 font-medium",
        config.bgColor,
        config.borderColor,
        config.textColor,
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {/* Mini Eggy icon */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        className={
          animate && status !== "expired"
            ? "animate-[bounce-subtle_2s_ease-in-out_infinite]"
            : ""
        }
      >
        {/* Egg body */}
        <ellipse
          cx="12"
          cy="13"
          rx="8"
          ry="9"
          fill={STICKER_STYLE.fillEgg}
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1.5}
        />

        {/* Eyes */}
        {status === "expired" ? (
          // X eyes
          <g stroke={STICKER_STYLE.stroke} strokeWidth={1}>
            <path d="M8 10 L10 12 M8 12 L10 10" />
            <path d="M14 10 L16 12 M14 12 L16 10" />
          </g>
        ) : (
          // Normal eyes
          <g>
            <ellipse
              cx="9"
              cy="11"
              rx="1.5"
              ry="2"
              fill={STICKER_STYLE.stroke}
            />
            <ellipse
              cx="15"
              cy="11"
              rx="1.5"
              ry="2"
              fill={STICKER_STYLE.stroke}
            />
            <circle cx="9.5" cy="10.5" r="0.5" fill="white" />
            <circle cx="15.5" cy="10.5" r="0.5" fill="white" />
          </g>
        )}

        {/* Mouth */}
        <path
          d={getMouthPath(10)}
          transform="translate(12, 15)"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1}
          strokeLinecap="round"
          fill="none"
        />

        {/* Status indicator */}
        <circle
          cx="19"
          cy="6"
          r="3"
          fill={config.fillColor}
          stroke={STICKER_STYLE.stroke}
          strokeWidth={0.5}
        />

        {/* Sparkle for extra-fresh */}
        {config.sparkle && (
          <g fill={config.fillColor}>
            <circle cx="4" cy="6" r="1" />
            <path
              d="M3 6 L5 6 M4 5 L4 7"
              stroke={config.fillColor}
              strokeWidth={0.5}
            />
          </g>
        )}
      </svg>

      {showLabel && <span>{config.label}</span>}
    </div>
  );
}

/**
 * All freshness tags exported as a set
 */
export function FreshnessTagSet({
  size = "md",
  showLabel = true,
  className,
}: {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <FreshnessTag status="extra-fresh" size={size} showLabel={showLabel} />
      <FreshnessTag status="fresh" size={size} showLabel={showLabel} />
      <FreshnessTag status="cook" size={size} showLabel={showLabel} />
      <FreshnessTag status="expired" size={size} showLabel={showLabel} />
    </div>
  );
}
