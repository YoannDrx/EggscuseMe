"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { STICKER_STYLE } from "../base/sticker-base";

type FridgeEmptyProps = ComponentProps<"svg"> & {
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
};

const sizeMap = {
  sm: "w-24 h-24",
  md: "w-40 h-40",
  lg: "w-56 h-56",
  xl: "w-72 h-72",
};

/**
 * Empty fridge illustration with sad Eggy
 * Used for empty states when no egg boxes exist
 */
export function IlluFridgeEmpty({
  size = "md",
  animate = true,
  className,
  ...props
}: FridgeEmptyProps) {
  return (
    <svg
      viewBox="0 -15 200 235"
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

      {/* Empty dust particles */}
      <circle cx="60" cy="70" r="2" fill="#CBD5E1" opacity={0.5} />
      <circle cx="120" cy="100" r="1.5" fill="#CBD5E1" opacity={0.4} />
      <circle cx="80" cy="140" r="2" fill="#CBD5E1" opacity={0.3} />
      <circle cx="130" cy="175" r="1.5" fill="#CBD5E1" opacity={0.5} />

      {/* Sad Eggy floating out */}
      <g
        className={animate ? "animate-[float_3s_ease-in-out_infinite]" : ""}
        transform="translate(75, 95)"
      >
        {/* Egg body */}
        <ellipse
          cx="25"
          cy="30"
          rx="20"
          ry="25"
          fill={STICKER_STYLE.fillEgg}
          stroke={STICKER_STYLE.stroke}
          strokeWidth={STICKER_STYLE.strokeWidth}
        />

        {/* Sad eyes */}
        <ellipse cx="18" cy="26" rx="3" ry="4" fill={STICKER_STYLE.stroke} />
        <ellipse cx="32" cy="26" rx="3" ry="4" fill={STICKER_STYLE.stroke} />
        <circle cx="19" cy="25" r="1" fill="white" />
        <circle cx="33" cy="25" r="1" fill="white" />

        {/* Sad eyebrows */}
        <path
          d="M13 20 L21 23"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <path
          d="M37 20 L29 23"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1.5}
          strokeLinecap="round"
        />

        {/* Tear */}
        <ellipse cx="12" cy="32" rx="2" ry="3" fill="#87CEEB" />

        {/* Sad mouth */}
        <path
          d="M18 40 Q25 34, 32 40"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />

        {/* Escape lines */}
        <path
          d="M48 20 L55 15"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1}
          opacity={0.4}
        />
        <path
          d="M50 30 L58 28"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1}
          opacity={0.3}
        />
        <path
          d="M48 40 L54 43"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1}
          opacity={0.4}
        />
      </g>

      {/* "Vide" text */}
      <text
        x="100"
        y="185"
        textAnchor="middle"
        fill="#94A3B8"
        className="text-[14px] font-medium"
      >
        Vide...
      </text>
    </svg>
  );
}
