"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { STICKER_STYLE } from "../base/sticker-base";

type ChickenMomProps = ComponentProps<"svg"> & {
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  /** Number of baby eggs to show (1-4) */
  eggCount?: 1 | 2 | 3 | 4;
};

const sizeMap = {
  sm: "w-24 h-24",
  md: "w-40 h-40",
  lg: "w-56 h-56",
  xl: "w-72 h-72",
};

/**
 * Mother hen with baby Eggy eggs
 * Used for family/organization features and onboarding
 */
export function IlluChickenMom({
  size = "md",
  animate = true,
  eggCount = 3,
  className,
  ...props
}: ChickenMomProps) {
  const babyPositions = [
    { x: 50, delay: "0s" },
    { x: 90, delay: "0.2s" },
    { x: 130, delay: "0.4s" },
    { x: 170, delay: "0.6s" },
  ];

  return (
    <svg
      viewBox="0 0 220 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeMap[size], className)}
      {...props}
    >
      {/* Nest */}
      <ellipse
        cx="110"
        cy="150"
        rx="80"
        ry="20"
        fill="#92400E"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={STICKER_STYLE.strokeWidth}
      />
      {/* Nest straw texture */}
      <g opacity={0.5}>
        <path d="M40 145 Q60 140, 80 148" stroke="#78350F" strokeWidth={2} />
        <path d="M70 152 Q100 145, 130 150" stroke="#78350F" strokeWidth={2} />
        <path d="M120 148 Q150 142, 180 150" stroke="#78350F" strokeWidth={2} />
        <path d="M50 155 Q80 150, 100 158" stroke="#78350F" strokeWidth={1.5} />
        <path
          d="M110 155 Q140 148, 170 155"
          stroke="#78350F"
          strokeWidth={1.5}
        />
      </g>

      {/* Mother hen body */}
      <g
        className={animate ? "animate-[float_4s_ease-in-out_infinite]" : ""}
        transform="translate(75, 40)"
      >
        {/* Tail feathers */}
        <g transform="translate(-25, 30)">
          <ellipse
            cx="0"
            cy="0"
            rx="8"
            ry="25"
            fill="#D97706"
            transform="rotate(-30)"
          />
          <ellipse
            cx="10"
            cy="5"
            rx="6"
            ry="22"
            fill="#F59E0B"
            transform="rotate(-20)"
          />
          <ellipse
            cx="20"
            cy="8"
            rx="5"
            ry="20"
            fill="#FBBF24"
            transform="rotate(-10)"
          />
        </g>

        {/* Body */}
        <ellipse
          cx="35"
          cy="50"
          rx="40"
          ry="35"
          fill="#FBBF24"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={STICKER_STYLE.strokeWidth}
        />

        {/* Wing */}
        <ellipse
          cx="20"
          cy="55"
          rx="15"
          ry="20"
          fill="#F59E0B"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1.5}
        />

        {/* Head */}
        <circle
          cx="60"
          cy="25"
          r="22"
          fill="#FBBF24"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={STICKER_STYLE.strokeWidth}
        />

        {/* Comb (crête) */}
        <g fill="#EF4444" stroke={STICKER_STYLE.stroke} strokeWidth={1.5}>
          <circle cx="55" cy="5" r="6" />
          <circle cx="65" cy="3" r="7" />
          <circle cx="75" cy="6" r="5" />
        </g>

        {/* Beak */}
        <path
          d="M78 28 L95 30 L78 35 Z"
          fill="#F97316"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />

        {/* Wattle (barbillon) */}
        <ellipse cx="80" cy="42" rx="5" ry="8" fill="#EF4444" />

        {/* Eye */}
        <circle cx="68" cy="22" r="5" fill={STICKER_STYLE.stroke} />
        <circle cx="69" cy="21" r="2" fill="white" />

        {/* Blush */}
        <ellipse cx="55" cy="35" rx="5" ry="3" fill="#FFB6C1" opacity={0.5} />

        {/* Happy expression line */}
        <path
          d="M72 32 Q78 36, 82 33"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1}
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Baby Eggy eggs */}
      {babyPositions.slice(0, eggCount).map((pos, i) => (
        <g
          key={i}
          transform={`translate(${pos.x}, 130)`}
          className={
            animate ? "animate-[bounce-subtle_2s_ease-in-out_infinite]" : ""
          }
          style={{ animationDelay: pos.delay }}
        >
          {/* Baby egg body */}
          <ellipse
            cx="0"
            cy="0"
            rx="14"
            ry="18"
            fill={STICKER_STYLE.fillEgg}
            stroke={STICKER_STYLE.stroke}
            strokeWidth={STICKER_STYLE.strokeWidth}
          />

          {/* Tiny eyes */}
          <ellipse
            cx="-5"
            cy="-4"
            rx="2.5"
            ry="3"
            fill={STICKER_STYLE.stroke}
          />
          <ellipse cx="5" cy="-4" rx="2.5" ry="3" fill={STICKER_STYLE.stroke} />
          <circle cx="-4" cy="-5" r="1" fill="white" />
          <circle cx="6" cy="-5" r="1" fill="white" />

          {/* Tiny blush */}
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

          {/* Cute smile */}
          <path
            d="M-4 6 Q0 10, 4 6"
            stroke={STICKER_STYLE.stroke}
            strokeWidth={1.5}
            strokeLinecap="round"
            fill="none"
          />
        </g>
      ))}

      {/* Love hearts floating */}
      {animate && (
        <g className="animate-[float_3s_ease-in-out_infinite]">
          <path
            d="M180 60 C175 55, 170 60, 180 70 C190 60, 185 55, 180 60"
            fill="#EF4444"
            opacity={0.6}
          />
          <path
            d="M40 50 C37 47, 34 50, 40 56 C46 50, 43 47, 40 50"
            fill="#EF4444"
            opacity={0.4}
          />
        </g>
      )}
    </svg>
  );
}

export default IlluChickenMom;
