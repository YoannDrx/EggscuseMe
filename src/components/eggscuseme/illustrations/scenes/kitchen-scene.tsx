"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { STICKER_STYLE } from "../base/sticker-base";

type KitchenSceneProps = ComponentProps<"svg"> & {
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  cooking?: boolean;
};

const sizeMap = {
  sm: "w-24 h-24",
  md: "w-40 h-40",
  lg: "w-56 h-56",
  xl: "w-72 h-72",
};

/**
 * Kitchen/cooking scene with pan and chef Eggy
 * Used for timer page and recipes
 */
export function IlluKitchenScene({
  size = "md",
  animate = true,
  cooking = true,
  className,
  ...props
}: KitchenSceneProps) {
  return (
    <svg
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeMap[size], className)}
      {...props}
    >
      {/* Stovetop */}
      <rect
        x="20"
        y="120"
        width="160"
        height="50"
        rx="4"
        fill="#374151"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={STICKER_STYLE.strokeWidth}
      />

      {/* Burner glow */}
      {cooking && (
        <g
          className={
            animate ? "animate-[glow-pulse_1s_ease-in-out_infinite]" : ""
          }
        >
          <ellipse
            cx="100"
            cy="135"
            rx="35"
            ry="8"
            fill="#EF4444"
            opacity={0.6}
          />
          <ellipse
            cx="100"
            cy="135"
            rx="25"
            ry="5"
            fill="#F97316"
            opacity={0.8}
          />
        </g>
      )}

      {/* Burner rings */}
      <ellipse
        cx="100"
        cy="135"
        rx="30"
        ry="6"
        fill="none"
        stroke="#1F2937"
        strokeWidth={3}
      />
      <ellipse
        cx="100"
        cy="135"
        rx="20"
        ry="4"
        fill="none"
        stroke="#1F2937"
        strokeWidth={2}
      />

      {/* Pan */}
      <ellipse
        cx="100"
        cy="115"
        rx="50"
        ry="15"
        fill="#4B5563"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={STICKER_STYLE.strokeWidth}
      />
      <ellipse cx="100" cy="112" rx="42" ry="10" fill="#374151" />

      {/* Pan handle */}
      <rect
        x="145"
        y="108"
        width="45"
        height="12"
        rx="3"
        fill="#92400E"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1.5}
      />
      <ellipse cx="185" cy="114" rx="8" ry="5" fill="#78350F" />

      {/* Fried egg in pan */}
      <ellipse cx="100" cy="108" rx="25" ry="8" fill="white" />
      <ellipse cx="100" cy="106" rx="10" ry="5" fill="#FCD34D" />

      {/* Steam wisps */}
      {cooking && (
        <g
          className={animate ? "animate-[steam-rise_2s_ease-out_infinite]" : ""}
        >
          <path
            d="M85 90 Q80 80, 85 70"
            stroke="#9CA3AF"
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
            opacity={0.6}
          />
          <path
            d="M100 85 Q105 75, 100 65"
            stroke="#9CA3AF"
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
            opacity={0.5}
          />
          <path
            d="M115 88 Q120 78, 115 68"
            stroke="#9CA3AF"
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
            opacity={0.6}
          />
        </g>
      )}

      {/* Chef Eggy */}
      <g
        className={animate ? "animate-[float_3s_ease-in-out_infinite]" : ""}
        transform="translate(15, 45)"
      >
        {/* Egg body */}
        <ellipse
          cx="25"
          cy="35"
          rx="20"
          ry="25"
          fill={STICKER_STYLE.fillEgg}
          stroke={STICKER_STYLE.stroke}
          strokeWidth={STICKER_STYLE.strokeWidth}
        />

        {/* Chef hat */}
        <ellipse
          cx="25"
          cy="8"
          rx="18"
          ry="6"
          fill="white"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1.5}
        />
        <rect x="10" y="6" width="30" height="8" fill="white" />
        <circle
          cx="15"
          cy="5"
          r="6"
          fill="white"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1}
        />
        <circle
          cx="25"
          cy="3"
          r="7"
          fill="white"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1}
        />
        <circle
          cx="35"
          cy="5"
          r="6"
          fill="white"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1}
        />

        {/* Happy eyes */}
        <ellipse cx="18" cy="30" rx="4" ry="5" fill={STICKER_STYLE.stroke} />
        <ellipse cx="32" cy="30" rx="4" ry="5" fill={STICKER_STYLE.stroke} />
        <circle cx="19" cy="28" r="1.5" fill="white" />
        <circle cx="33" cy="28" r="1.5" fill="white" />

        {/* Blush */}
        <ellipse cx="10" cy="40" rx="4" ry="2.5" fill="#FFB6C1" opacity={0.4} />
        <ellipse cx="40" cy="40" rx="4" ry="2.5" fill="#FFB6C1" opacity={0.4} />

        {/* Proud smile */}
        <path
          d="M15 48 Q25 58, 35 48"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Spatula */}
      <g transform="translate(155, 30) rotate(15)">
        <rect x="0" y="0" width="6" height="35" rx="2" fill="#92400E" />
        <ellipse
          cx="3"
          cy="-8"
          rx="12"
          ry="6"
          fill="#6B7280"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1}
        />
        <ellipse cx="3" cy="-8" rx="8" ry="3" fill="#9CA3AF" />
      </g>

      {/* Control knobs */}
      <circle
        cx="40"
        cy="155"
        r="8"
        fill="#1F2937"
        stroke="#4B5563"
        strokeWidth={2}
      />
      <circle
        cx="70"
        cy="155"
        r="8"
        fill="#1F2937"
        stroke="#4B5563"
        strokeWidth={2}
      />
      <circle
        cx="130"
        cy="155"
        r="8"
        fill="#EF4444"
        stroke="#4B5563"
        strokeWidth={2}
      />
      <circle
        cx="160"
        cy="155"
        r="8"
        fill="#1F2937"
        stroke="#4B5563"
        strokeWidth={2}
      />
    </svg>
  );
}

export default IlluKitchenScene;
