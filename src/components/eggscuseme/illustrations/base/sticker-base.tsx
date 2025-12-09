"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

/**
 * Sticker style constants - used across all illustrations
 */
export const STICKER_STYLE = {
  stroke: "#1C1917",
  strokeWidth: 2,
  fillEgg: "#FDFBF7",
  fillWhite: "#FFFFFF",
  blush: "#FFB6C1",
  tear: "#87CEEB",
  sparkle: "#FCD34D",
} as const;

/**
 * Base egg shape for all Eggy illustrations
 */
export function BaseEggShape({
  className,
  cx = 50,
  cy = 65,
  rx = 40,
  ry = 50,
}: {
  className?: string;
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
}) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill={STICKER_STYLE.fillEgg}
      stroke={STICKER_STYLE.stroke}
      strokeWidth={STICKER_STYLE.strokeWidth}
      className={className}
    />
  );
}

/**
 * Base eyes for Eggy - normal open eyes
 */
export function BaseEyes({
  leftCx = 35,
  rightCx = 65,
  cy = 55,
  size = "md",
}: {
  leftCx?: number;
  rightCx?: number;
  cy?: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizeMap = {
    sm: { rx: 4, ry: 5, shine: 1.5 },
    md: { rx: 6, ry: 7, shine: 2 },
    lg: { rx: 8, ry: 9, shine: 3 },
  };
  const { rx, ry, shine } = sizeMap[size];

  return (
    <g>
      {/* Left eye */}
      <ellipse
        cx={leftCx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill={STICKER_STYLE.stroke}
      />
      <circle cx={leftCx + 2} cy={cy - 2} r={shine} fill="white" />
      {/* Right eye */}
      <ellipse
        cx={rightCx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill={STICKER_STYLE.stroke}
      />
      <circle cx={rightCx + 2} cy={cy - 2} r={shine} fill="white" />
    </g>
  );
}

/**
 * Heart-shaped eyes for love mood
 */
export function HeartEyes({
  leftCx = 35,
  rightCx = 65,
  cy = 55,
}: {
  leftCx?: number;
  rightCx?: number;
  cy?: number;
}) {
  const HeartPath = ({ cx }: { cx: number }) => (
    <path
      d={`M${cx} ${cy + 4}
         C${cx - 5} ${cy - 2}, ${cx - 8} ${cy - 8}, ${cx} ${cy - 4}
         C${cx + 8} ${cy - 8}, ${cx + 5} ${cy - 2}, ${cx} ${cy + 4}Z`}
      fill="#EF4444"
      stroke={STICKER_STYLE.stroke}
      strokeWidth={1}
    />
  );

  return (
    <g>
      <HeartPath cx={leftCx} />
      <HeartPath cx={rightCx} />
    </g>
  );
}

/**
 * Closed happy eyes (curved lines)
 */
export function ClosedHappyEyes({
  leftCx = 35,
  rightCx = 65,
  cy = 55,
}: {
  leftCx?: number;
  rightCx?: number;
  cy?: number;
}) {
  return (
    <g>
      <path
        d={`M${leftCx - 7} ${cy} Q${leftCx} ${cy + 5}, ${leftCx + 7} ${cy}`}
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d={`M${rightCx - 7} ${cy} Q${rightCx} ${cy + 5}, ${rightCx + 7} ${cy}`}
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2.5}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

/**
 * Sleeping eyes with Zzz
 */
export function SleepingEyes({
  leftCx = 35,
  rightCx = 65,
  cy = 55,
}: {
  leftCx?: number;
  rightCx?: number;
  cy?: number;
}) {
  return (
    <g>
      <ClosedHappyEyes leftCx={leftCx} rightCx={rightCx} cy={cy} />
      {/* Zzz */}
      <text
        x="78"
        y="35"
        fill={STICKER_STYLE.stroke}
        className="text-[12px] font-bold"
      >
        Z
      </text>
      <text
        x="85"
        y="25"
        fill={STICKER_STYLE.stroke}
        className="text-[10px] font-bold"
      >
        z
      </text>
      <text
        x="90"
        y="18"
        fill={STICKER_STYLE.stroke}
        className="text-[8px] font-bold"
      >
        z
      </text>
    </g>
  );
}

/**
 * Standard blush cheeks
 */
export function Blush({
  leftCx = 25,
  rightCx = 75,
  cy = 70,
  color = STICKER_STYLE.blush,
  opacity = 0.4,
}: {
  leftCx?: number;
  rightCx?: number;
  cy?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <g>
      <ellipse
        cx={leftCx}
        cy={cy}
        rx={6}
        ry={4}
        fill={color}
        opacity={opacity}
      />
      <ellipse
        cx={rightCx}
        cy={cy}
        rx={6}
        ry={4}
        fill={color}
        opacity={opacity}
      />
    </g>
  );
}

/**
 * Happy smile
 */
export function HappySmile({
  cx = 50,
  cy = 75,
  width = 30,
}: {
  cx?: number;
  cy?: number;
  width?: number;
}) {
  const half = width / 2;
  return (
    <path
      d={`M${cx - half} ${cy} Q${cx} ${cy + 15}, ${cx + half} ${cy}`}
      stroke={STICKER_STYLE.stroke}
      strokeWidth={2.5}
      strokeLinecap="round"
      fill="none"
    />
  );
}

/**
 * Sad frown
 */
export function SadFrown({
  cx = 50,
  cy = 82,
  width = 24,
}: {
  cx?: number;
  cy?: number;
  width?: number;
}) {
  const half = width / 2;
  return (
    <path
      d={`M${cx - half} ${cy} Q${cx} ${cy - 10}, ${cx + half} ${cy}`}
      stroke={STICKER_STYLE.stroke}
      strokeWidth={2.5}
      strokeLinecap="round"
      fill="none"
    />
  );
}

/**
 * Small O mouth (surprised)
 */
export function OMouth({
  cx = 50,
  cy = 80,
  rx = 5,
  ry = 6,
}: {
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
}) {
  return (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill={STICKER_STYLE.fillEgg}
      stroke={STICKER_STYLE.stroke}
      strokeWidth={2}
    />
  );
}

/**
 * Sweat drop
 */
export function SweatDrop({ cx = 80, cy = 45 }: { cx?: number; cy?: number }) {
  return (
    <path
      d={`M${cx} ${cy - 5} Q${cx + 2} ${cy + 2}, ${cx} ${cy + 6} Q${cx - 2} ${cy + 2}, ${cx} ${cy - 5}`}
      fill={STICKER_STYLE.tear}
      stroke={STICKER_STYLE.stroke}
      strokeWidth={1}
    />
  );
}

/**
 * Sparkles around
 */
export function Sparkles({
  positions = [
    { x: 15, y: 35 },
    { x: 85, y: 35 },
    { x: 20, y: 25 },
    { x: 80, y: 25 },
  ],
}: {
  positions?: { x: number; y: number }[];
}) {
  return (
    <g>
      {positions.map((pos, i) => (
        <g key={i}>
          <circle cx={pos.x} cy={pos.y} r={2} fill={STICKER_STYLE.sparkle} />
          <path
            d={`M${pos.x - 4} ${pos.y} L${pos.x + 4} ${pos.y} M${pos.x} ${pos.y - 4} L${pos.x} ${pos.y + 4}`}
            stroke={STICKER_STYLE.sparkle}
            strokeWidth={1.5}
          />
        </g>
      ))}
    </g>
  );
}

/**
 * Confetti pieces
 */
export function Confetti() {
  const colors = ["#FBBF24", "#34D399", "#F472B6", "#60A5FA", "#A78BFA"];
  const pieces = [
    { x: 15, y: 20, rotate: 15, color: colors[0] },
    { x: 80, y: 15, rotate: -20, color: colors[1] },
    { x: 25, y: 30, rotate: 30, color: colors[2] },
    { x: 78, y: 28, rotate: -25, color: colors[3] },
    { x: 10, y: 40, rotate: 30, color: colors[4] },
    { x: 88, y: 35, rotate: -25, color: colors[0] },
  ];

  return (
    <g>
      {pieces.map((piece, i) => (
        <rect
          key={i}
          x={piece.x}
          y={piece.y}
          width={4}
          height={8}
          rx={1}
          fill={piece.color}
          transform={`rotate(${piece.rotate} ${piece.x + 2} ${piece.y + 4})`}
        />
      ))}
    </g>
  );
}

/**
 * Wrapper for SVG illustrations with consistent sizing
 */
type IllustrationWrapperProps = ComponentProps<"svg"> & {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  viewBox?: string;
};

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-20 h-20",
  lg: "w-32 h-32",
  xl: "w-48 h-48",
  "2xl": "w-64 h-64",
};

export function IllustrationWrapper({
  children,
  size = "md",
  viewBox = "0 0 100 120",
  className,
  ...props
}: IllustrationWrapperProps) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeClasses[size], className)}
      style={{ filter: "var(--sticker-shadow)" }}
      {...props}
    >
      {children}
    </svg>
  );
}
