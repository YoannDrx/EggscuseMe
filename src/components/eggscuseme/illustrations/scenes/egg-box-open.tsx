"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { STICKER_STYLE } from "../base/sticker-base";

type EggBoxOpenProps = ComponentProps<"svg"> & {
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  /** Number of eggs in box (0-6) */
  eggCount?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /** Show one happy Eggy mascot */
  showMascot?: boolean;
};

const sizeMap = {
  sm: "w-24 h-24",
  md: "w-40 h-40",
  lg: "w-56 h-56",
  xl: "w-72 h-72",
};

/**
 * Open egg box with eggs inside - 3D perspective view
 * Used for adding boxes, stock management
 */
export function IlluEggBoxOpen({
  size = "md",
  animate = true,
  eggCount = 6,
  showMascot = true,
  className,
  ...props
}: EggBoxOpenProps) {
  // Egg positions in 2x3 grid
  const eggPositions = [
    { x: 55, y: 95 },
    { x: 95, y: 95 },
    { x: 135, y: 95 },
    { x: 55, y: 125 },
    { x: 95, y: 125 },
    { x: 135, y: 125 },
  ];

  const mascotIndex = showMascot
    ? Math.min(eggCount - 1, eggPositions.length - 1)
    : -1;

  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeMap[size], className)}
      {...props}
    >
      {/* Box lid (open) */}
      <g transform="translate(30, 10) rotate(-5)">
        {/* Lid top surface */}
        <path
          d="M0 30 L120 20 L140 35 L20 45 Z"
          fill="#E5E7EB"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={STICKER_STYLE.strokeWidth}
        />
        {/* Lid front edge */}
        <path
          d="M0 30 L0 35 L20 50 L20 45 Z"
          fill="#D1D5DB"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1}
        />
        {/* Lid inner label */}
        <rect
          x="40"
          y="28"
          width="60"
          height="12"
          rx="2"
          fill="#FCD34D"
          opacity={0.6}
        />
        <text
          x="70"
          y="37"
          textAnchor="middle"
          fill={STICKER_STYLE.stroke}
          className="text-[6px]"
        >
          6 OEUFS
        </text>
      </g>

      {/* Box base - 3D perspective */}
      {/* Front face */}
      <path
        d="M30 140 L30 80 L170 80 L170 140 Z"
        fill="#F3F4F6"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={STICKER_STYLE.strokeWidth}
      />

      {/* Right face (3D depth) */}
      <path
        d="M170 80 L185 70 L185 130 L170 140 Z"
        fill="#E5E7EB"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1.5}
      />

      {/* Top edge of box */}
      <path
        d="M30 80 L45 70 L185 70 L170 80 Z"
        fill="#D1D5DB"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1.5}
      />

      {/* Egg holder dividers */}
      <line x1="75" y1="80" x2="75" y2="140" stroke="#CBD5E1" strokeWidth={1} />
      <line
        x1="115"
        y1="80"
        x2="115"
        y2="140"
        stroke="#CBD5E1"
        strokeWidth={1}
      />
      <line
        x1="30"
        y1="110"
        x2="170"
        y2="110"
        stroke="#CBD5E1"
        strokeWidth={1}
      />

      {/* Eggs */}
      {eggPositions.slice(0, eggCount).map((pos, i) => {
        const isMascot = i === mascotIndex && showMascot;

        return (
          <g
            key={i}
            transform={`translate(${pos.x}, ${pos.y})`}
            className={
              isMascot && animate
                ? "animate-[bounce-subtle_2s_ease-in-out_infinite]"
                : ""
            }
          >
            {/* Egg body */}
            <ellipse
              cx="0"
              cy="0"
              rx="14"
              ry="12"
              fill={STICKER_STYLE.fillEgg}
              stroke={STICKER_STYLE.stroke}
              strokeWidth={isMascot ? STICKER_STYLE.strokeWidth : 1.5}
            />

            {isMascot && (
              <>
                {/* Mascot eyes */}
                <ellipse
                  cx="-4"
                  cy="-2"
                  rx="2"
                  ry="2.5"
                  fill={STICKER_STYLE.stroke}
                />
                <ellipse
                  cx="4"
                  cy="-2"
                  rx="2"
                  ry="2.5"
                  fill={STICKER_STYLE.stroke}
                />
                <circle cx="-3" cy="-3" r="0.8" fill="white" />
                <circle cx="5" cy="-3" r="0.8" fill="white" />

                {/* Blush */}
                <ellipse
                  cx="-10"
                  cy="2"
                  rx="3"
                  ry="1.5"
                  fill="#FFB6C1"
                  opacity={0.4}
                />
                <ellipse
                  cx="10"
                  cy="2"
                  rx="3"
                  ry="1.5"
                  fill="#FFB6C1"
                  opacity={0.4}
                />

                {/* Happy smile */}
                <path
                  d="M-4 4 Q0 8, 4 4"
                  stroke={STICKER_STYLE.stroke}
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  fill="none"
                />
              </>
            )}
          </g>
        );
      })}

      {/* Empty slots indicator */}
      {eggCount < 6 &&
        eggPositions.slice(eggCount).map((pos, i) => (
          <g key={`empty-${i}`} transform={`translate(${pos.x}, ${pos.y})`}>
            <ellipse
              cx="0"
              cy="0"
              rx="12"
              ry="10"
              fill="none"
              stroke="#CBD5E1"
              strokeWidth={1}
              strokeDasharray="4 2"
            />
            <text
              x="0"
              y="3"
              textAnchor="middle"
              fill="#9CA3AF"
              className="text-[8px]"
            >
              ?
            </text>
          </g>
        ))}

      {/* Sparkle for fresh eggs */}
      {eggCount > 0 && animate && (
        <g className="animate-[glow-pulse_2s_ease-in-out_infinite]">
          <circle cx="165" cy="75" r="4" fill="#FCD34D" />
          <path
            d="M161 75 L169 75 M165 71 L165 79"
            stroke="#FCD34D"
            strokeWidth={2}
          />
        </g>
      )}
    </svg>
  );
}
