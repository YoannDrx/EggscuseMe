"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { STICKER_STYLE } from "../base/sticker-base";

type OnboardingStep = 1 | 2 | 3 | 4;

type OnboardingIllustrationProps = ComponentProps<"svg"> & {
  step: OnboardingStep;
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
};

const sizeMap = {
  sm: "w-32 h-32",
  md: "w-48 h-48",
  lg: "w-64 h-64",
  xl: "w-80 h-80",
};

/**
 * Step 1: Add your eggs (phone + egg)
 */
function Step1({ animate }: { animate: boolean }) {
  return (
    <g>
      {/* Phone */}
      <rect
        x="60"
        y="30"
        width="50"
        height="90"
        rx="6"
        fill="white"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />
      <rect x="65" y="40" width="40" height="65" rx="2" fill="#E5E7EB" />
      <circle cx="85" cy="115" r="4" fill="#D1D5DB" />

      {/* Eggy going into phone */}
      <g
        transform="translate(120, 60)"
        className={
          animate ? "animate-[bounce-subtle_2s_ease-in-out_infinite]" : ""
        }
      >
        <ellipse
          cx="0"
          cy="0"
          rx="18"
          ry="22"
          fill={STICKER_STYLE.fillEgg}
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
        />
        <ellipse cx="-6" cy="-4" rx="3" ry="4" fill={STICKER_STYLE.stroke} />
        <ellipse cx="6" cy="-4" rx="3" ry="4" fill={STICKER_STYLE.stroke} />
        <circle cx="-5" cy="-5" r="1" fill="white" />
        <circle cx="7" cy="-5" r="1" fill="white" />
        <path
          d="M-5 6 Q0 12, 5 6"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1.5}
          strokeLinecap="round"
          fill="none"
        />
        {/* Blush */}
        <ellipse cx="-14" cy="4" rx="4" ry="2" fill="#FFB6C1" opacity={0.4} />
        <ellipse cx="14" cy="4" rx="4" ry="2" fill="#FFB6C1" opacity={0.4} />
      </g>

      {/* Arrow */}
      <path
        d="M140 75 L115 75"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
        markerEnd="url(#arrowhead)"
      />
      <defs>
        <marker
          id="arrowhead"
          markerWidth="6"
          markerHeight="6"
          refX="3"
          refY="3"
          orient="auto"
        >
          <path d="M0 0 L6 3 L0 6 Z" fill={STICKER_STYLE.stroke} />
        </marker>
      </defs>

      {/* Plus sparkles */}
      <g fill="#22C55E">
        <circle cx="75" cy="55" r="3" />
        <path
          d="M72 55 L78 55 M75 52 L75 58"
          stroke="#22C55E"
          strokeWidth={1.5}
        />
      </g>
    </g>
  );
}

/**
 * Step 2: Track freshness (chart with gauge)
 */
function Step2({ animate }: { animate: boolean }) {
  return (
    <g>
      {/* Chart board */}
      <rect
        x="50"
        y="30"
        width="80"
        height="100"
        rx="4"
        fill="white"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />

      {/* Gauge */}
      <g transform="translate(90, 75)">
        <circle
          cx="0"
          cy="0"
          r="30"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={6}
        />
        <circle
          cx="0"
          cy="0"
          r="30"
          fill="none"
          stroke="#22C55E"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray="140 200"
          transform="rotate(-90)"
          className={animate ? "transition-all duration-1000" : ""}
        />

        {/* Mini Eggy in center */}
        <ellipse
          cx="0"
          cy="0"
          rx="12"
          ry="15"
          fill={STICKER_STYLE.fillEgg}
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1.5}
        />
        <ellipse cx="-4" cy="-2" rx="2" ry="2.5" fill={STICKER_STYLE.stroke} />
        <ellipse cx="4" cy="-2" rx="2" ry="2.5" fill={STICKER_STYLE.stroke} />
        <path
          d="M-3 4 Q0 7, 3 4"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1}
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Bar chart */}
      <g>
        <rect x="55" y="115" width="8" height="10" fill="#22C55E" rx="1" />
        <rect x="68" y="110" width="8" height="15" fill="#FBBF24" rx="1" />
        <rect x="81" y="105" width="8" height="20" fill="#F97316" rx="1" />
      </g>
    </g>
  );
}

/**
 * Step 3: Cook at the right time (chef hat + timer)
 */
function Step3({ animate }: { animate: boolean }) {
  return (
    <g>
      {/* Chef Eggy */}
      <g
        transform="translate(90, 80)"
        className={animate ? "animate-[float_3s_ease-in-out_infinite]" : ""}
      >
        {/* Egg body */}
        <ellipse
          cx="0"
          cy="0"
          rx="28"
          ry="35"
          fill={STICKER_STYLE.fillEgg}
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
        />

        {/* Chef hat */}
        <g transform="translate(0, -42)">
          <circle
            cx="-10"
            cy="5"
            r="8"
            fill="white"
            stroke={STICKER_STYLE.stroke}
            strokeWidth={1.5}
          />
          <circle
            cx="0"
            cy="2"
            r="10"
            fill="white"
            stroke={STICKER_STYLE.stroke}
            strokeWidth={1.5}
          />
          <circle
            cx="10"
            cy="5"
            r="8"
            fill="white"
            stroke={STICKER_STYLE.stroke}
            strokeWidth={1.5}
          />
          <rect x="-15" y="8" width="30" height="8" fill="white" />
          <rect
            x="-18"
            y="12"
            width="36"
            height="5"
            fill="white"
            stroke={STICKER_STYLE.stroke}
            strokeWidth={1.5}
          />
        </g>

        {/* Eyes */}
        <ellipse cx="-10" cy="-8" rx="4" ry="5" fill={STICKER_STYLE.stroke} />
        <ellipse cx="10" cy="-8" rx="4" ry="5" fill={STICKER_STYLE.stroke} />
        <circle cx="-9" cy="-9" r="1.5" fill="white" />
        <circle cx="11" cy="-9" r="1.5" fill="white" />

        {/* Proud smile */}
        <path
          d="M-8 8 Q0 18, 8 8"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />

        {/* Blush */}
        <ellipse cx="-22" cy="2" rx="5" ry="3" fill="#FFB6C1" opacity={0.4} />
        <ellipse cx="22" cy="2" rx="5" ry="3" fill="#FFB6C1" opacity={0.4} />
      </g>

      {/* Timer */}
      <g transform="translate(145, 50)">
        <circle
          cx="0"
          cy="0"
          r="18"
          fill="white"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
        />
        <path
          d="M0 -5 L0 0 L5 3"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <rect
          x="-4"
          y="-22"
          width="8"
          height="4"
          fill={STICKER_STYLE.stroke}
          rx="1"
        />
      </g>

      {/* Steam */}
      <g
        className={animate ? "animate-[steam-rise_2s_ease-out_infinite]" : ""}
        opacity={0.5}
      >
        <path
          d="M55 110 Q50 100, 55 90"
          stroke="#9CA3AF"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M70 108 Q75 98, 70 88"
          stroke="#9CA3AF"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </g>
  );
}

/**
 * Step 4: Save money (piggy bank + coins)
 */
function Step4({ animate }: { animate: boolean }) {
  return (
    <g>
      {/* Piggy bank Eggy */}
      <g transform="translate(90, 75)">
        {/* Egg body as piggy */}
        <ellipse
          cx="0"
          cy="0"
          rx="35"
          ry="30"
          fill="#FFB6C1"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={2}
        />

        {/* Snout */}
        <ellipse
          cx="30"
          cy="5"
          rx="10"
          ry="8"
          fill="#FF9CAD"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1.5}
        />
        <circle cx="27" cy="3" r="2" fill={STICKER_STYLE.stroke} />
        <circle cx="33" cy="3" r="2" fill={STICKER_STYLE.stroke} />

        {/* Ears */}
        <ellipse
          cx="-20"
          cy="-25"
          rx="10"
          ry="8"
          fill="#FFB6C1"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1.5}
          transform="rotate(-20)"
        />
        <ellipse
          cx="5"
          cy="-28"
          rx="10"
          ry="8"
          fill="#FFB6C1"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1.5}
          transform="rotate(20)"
        />

        {/* Eyes */}
        <ellipse cx="-8" cy="-5" rx="4" ry="5" fill={STICKER_STYLE.stroke} />
        <ellipse cx="10" cy="-5" rx="4" ry="5" fill={STICKER_STYLE.stroke} />
        <circle cx="-7" cy="-6" r="1.5" fill="white" />
        <circle cx="11" cy="-6" r="1.5" fill="white" />

        {/* Coin slot */}
        <rect
          x="-8"
          y="-30"
          width="16"
          height="4"
          rx="2"
          fill={STICKER_STYLE.stroke}
        />
      </g>

      {/* Falling coins */}
      <g
        className={
          animate ? "animate-[bounce-subtle_1s_ease-in-out_infinite]" : ""
        }
      >
        <circle
          cx="85"
          cy="35"
          r="10"
          fill="#FCD34D"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1.5}
        />
        <text
          x="85"
          y="39"
          textAnchor="middle"
          fill={STICKER_STYLE.stroke}
          fontSize="10"
          fontWeight="bold"
        >
          €
        </text>
      </g>
      <g
        className={
          animate ? "animate-[bounce-subtle_1.2s_ease-in-out_infinite]" : ""
        }
        style={{ animationDelay: "0.3s" }}
      >
        <circle
          cx="105"
          cy="28"
          r="8"
          fill="#FCD34D"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1.5}
        />
        <text
          x="105"
          y="31"
          textAnchor="middle"
          fill={STICKER_STYLE.stroke}
          fontSize="8"
          fontWeight="bold"
        >
          €
        </text>
      </g>

      {/* Sparkles */}
      <g fill="#FCD34D">
        <circle cx="140" cy="60" r="4" />
        <path
          d="M136 60 L144 60 M140 56 L140 64"
          stroke="#FCD34D"
          strokeWidth={2}
        />
      </g>
    </g>
  );
}

/**
 * Onboarding illustration component with 4 steps
 */
export function OnboardingIllustration({
  step,
  size = "md",
  animate = true,
  className,
  ...props
}: OnboardingIllustrationProps) {
  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 animate={animate} />;
      case 2:
        return <Step2 animate={animate} />;
      case 3:
        return <Step3 animate={animate} />;
      case 4:
        return <Step4 animate={animate} />;
    }
  };

  return (
    <svg
      viewBox="0 0 180 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(sizeMap[size], className)}
      {...props}
    >
      {renderStep()}
    </svg>
  );
}
