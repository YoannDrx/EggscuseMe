"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { STICKER_STYLE } from "../base/sticker-base";

type FridgeFullProps = ComponentProps<"svg"> & {
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  eggCount?: number;
};

const sizeMap = {
  sm: "w-24 h-24",
  md: "w-40 h-40",
  lg: "w-56 h-56",
  xl: "w-72 h-72",
};

/**
 * Full fridge illustration with happy Eggy and eggs
 * Used for dashboard when user has egg boxes
 */
export function IlluFridgeFull({
  size = "md",
  animate = true,
  className,
  ...props
}: FridgeFullProps) {
  return (
    <svg
      viewBox="0 0 200 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeMap[size], className)}
      {...props}
    >
      {/* Fridge body */}
      <rect
        x="30"
        y="20"
        width="140"
        height="180"
        rx="8"
        fill="#F1F5F9"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={STICKER_STYLE.strokeWidth}
      />

      {/* Fridge door line */}
      <line
        x1="30"
        y1="90"
        x2="170"
        y2="90"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1.5}
      />

      {/* Top door handle */}
      <rect
        x="155"
        y="50"
        width="8"
        height="25"
        rx="4"
        fill="#CBD5E1"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1.5}
      />

      {/* Bottom door handle */}
      <rect
        x="155"
        y="130"
        width="8"
        height="40"
        rx="4"
        fill="#CBD5E1"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1.5}
      />

      {/* Shelf lines */}
      <line x1="35" y1="55" x2="150" y2="55" stroke="#CBD5E1" strokeWidth={2} />
      <line
        x1="35"
        y1="120"
        x2="150"
        y2="120"
        stroke="#CBD5E1"
        strokeWidth={2}
      />
      <line
        x1="35"
        y1="160"
        x2="150"
        y2="160"
        stroke="#CBD5E1"
        strokeWidth={2}
      />

      {/* Top shelf - Milk and cheese */}
      <rect
        x="45"
        y="32"
        width="18"
        height="22"
        rx="2"
        fill="white"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1}
      />
      <rect x="48" y="34" width="12" height="4" fill="#3B82F6" />
      <ellipse
        cx="90"
        cy="42"
        rx="15"
        ry="10"
        fill="#FCD34D"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1}
      />

      {/* Middle shelf - Eggs row 1 */}
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse
            key={`egg1-${i}`}
            cx={50 + i * 22}
            cy="75"
            rx="8"
            ry="10"
            fill={STICKER_STYLE.fillEgg}
            stroke={STICKER_STYLE.stroke}
            strokeWidth={1}
          />
        ))}
      </g>

      {/* Bottom shelf - Eggs row 2 with happy Eggy */}
      <g>
        {[0, 1, 2].map((i) => (
          <ellipse
            key={`egg2-${i}`}
            cx={50 + i * 22}
            cy="140"
            rx="8"
            ry="10"
            fill={STICKER_STYLE.fillEgg}
            stroke={STICKER_STYLE.stroke}
            strokeWidth={1}
          />
        ))}
      </g>

      {/* Happy Eggy mascot */}
      <g
        className={
          animate ? "animate-[bounce-subtle_2s_ease-in-out_infinite]" : ""
        }
        transform="translate(105, 125)"
      >
        {/* Egg body */}
        <ellipse
          cx="20"
          cy="18"
          rx="16"
          ry="20"
          fill={STICKER_STYLE.fillEgg}
          stroke={STICKER_STYLE.stroke}
          strokeWidth={STICKER_STYLE.strokeWidth}
        />

        {/* Happy eyes */}
        <ellipse cx="14" cy="14" rx="3" ry="4" fill={STICKER_STYLE.stroke} />
        <ellipse cx="26" cy="14" rx="3" ry="4" fill={STICKER_STYLE.stroke} />
        <circle cx="15" cy="13" r="1" fill="white" />
        <circle cx="27" cy="13" r="1" fill="white" />

        {/* Blush */}
        <ellipse cx="8" cy="22" rx="4" ry="2.5" fill="#FFB6C1" opacity={0.4} />
        <ellipse cx="32" cy="22" rx="4" ry="2.5" fill="#FFB6C1" opacity={0.4} />

        {/* Happy smile */}
        <path
          d="M12 26 Q20 34, 28 26"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />

        {/* Crown for being the king of eggs */}
        <path
          d="M8 -2 L12 5 L16 -2 L20 5 L24 -2 L28 5 L32 -2"
          stroke="#FBBF24"
          strokeWidth={2}
          fill="#FBBF24"
        />
      </g>

      {/* Vegetables in drawer */}
      <ellipse
        cx="55"
        cy="178"
        rx="12"
        ry="8"
        fill="#22C55E"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1}
      />
      <ellipse
        cx="80"
        cy="180"
        rx="10"
        ry="7"
        fill="#EF4444"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1}
      />
      <ellipse
        cx="105"
        cy="177"
        rx="8"
        ry="9"
        fill="#F97316"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1}
      />

      {/* Sparkles to show freshness */}
      <g
        className={
          animate ? "animate-[glow-pulse_2s_ease-in-out_infinite]" : ""
        }
      >
        <circle cx="140" cy="70" r="3" fill="#FCD34D" />
        <path
          d="M137 70 L143 70 M140 67 L140 73"
          stroke="#FCD34D"
          strokeWidth={1.5}
        />
      </g>
    </svg>
  );
}
