"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { STICKER_STYLE } from "../base/sticker-base";

type AchievementType =
  | "first-egg"
  | "ten-eggs"
  | "anti-waste"
  | "chef"
  | "streak"
  | "explorer";

type AchievementBadgeProps = ComponentProps<"svg"> & {
  type: AchievementType;
  size?: "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  unlocked?: boolean;
};

const sizeMap = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
  xl: "w-40 h-40",
};

const achievementConfig: Record<
  AchievementType,
  {
    name: string;
    color: string;
    secondaryColor: string;
  }
> = {
  "first-egg": {
    name: "Premier œuf",
    color: "#FBBF24",
    secondaryColor: "#F59E0B",
  },
  "ten-eggs": {
    name: "10 œufs",
    color: "#8B5CF6",
    secondaryColor: "#7C3AED",
  },
  "anti-waste": {
    name: "Anti-gaspi",
    color: "#22C55E",
    secondaryColor: "#16A34A",
  },
  chef: {
    name: "Chef étoilé",
    color: "#F97316",
    secondaryColor: "#EA580C",
  },
  streak: {
    name: "Série parfaite",
    color: "#EC4899",
    secondaryColor: "#DB2777",
  },
  explorer: {
    name: "Explorateur",
    color: "#3B82F6",
    secondaryColor: "#2563EB",
  },
};

/**
 * First egg achievement - Eggy with medal
 */
function FirstEggBadge({
  color,
  unlocked,
}: {
  color: string;
  unlocked: boolean;
}) {
  return (
    <g opacity={unlocked ? 1 : 0.4}>
      {/* Medal ribbon */}
      <path d="M50 10 L45 25 L50 22 L55 25 L50 10" fill={color} />

      {/* Eggy body */}
      <ellipse
        cx="50"
        cy="55"
        rx="25"
        ry="30"
        fill={STICKER_STYLE.fillEgg}
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />

      {/* Medal */}
      <circle
        cx="50"
        cy="25"
        r="12"
        fill={color}
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1.5}
      />
      <text
        x="50"
        y="29"
        textAnchor="middle"
        fill="white"
        fontSize="10"
        fontWeight="bold"
      >
        1
      </text>

      {/* Eyes */}
      <ellipse cx="42" cy="48" rx="4" ry="5" fill={STICKER_STYLE.stroke} />
      <ellipse cx="58" cy="48" rx="4" ry="5" fill={STICKER_STYLE.stroke} />
      <circle cx="43" cy="47" r="1.5" fill="white" />
      <circle cx="59" cy="47" r="1.5" fill="white" />

      {/* Proud smile */}
      <path
        d="M42 65 Q50 75, 58 65"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

/**
 * Ten eggs achievement - Eggy with crown
 */
function TenEggsBadge({
  color,
  unlocked,
}: {
  color: string;
  unlocked: boolean;
}) {
  return (
    <g opacity={unlocked ? 1 : 0.4}>
      {/* Eggy body */}
      <ellipse
        cx="50"
        cy="55"
        rx="25"
        ry="30"
        fill={STICKER_STYLE.fillEgg}
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />

      {/* Crown */}
      <path
        d="M30 25 L35 35 L42 22 L50 35 L58 22 L65 35 L70 25 L70 40 L30 40 Z"
        fill={color}
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1.5}
      />
      <circle cx="35" cy="28" r="3" fill="#FCD34D" />
      <circle cx="50" cy="25" r="3" fill="#FCD34D" />
      <circle cx="65" cy="28" r="3" fill="#FCD34D" />

      {/* Eyes */}
      <ellipse cx="42" cy="50" rx="4" ry="5" fill={STICKER_STYLE.stroke} />
      <ellipse cx="58" cy="50" rx="4" ry="5" fill={STICKER_STYLE.stroke} />
      <circle cx="43" cy="49" r="1.5" fill="white" />
      <circle cx="59" cy="49" r="1.5" fill="white" />

      {/* Smile */}
      <path
        d="M42 65 Q50 75, 58 65"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

/**
 * Anti-waste achievement - Eggy with earth/leaf
 */
function AntiWasteBadge({
  color,
  unlocked,
}: {
  color: string;
  unlocked: boolean;
}) {
  return (
    <g opacity={unlocked ? 1 : 0.4}>
      {/* Eggy body */}
      <ellipse
        cx="50"
        cy="55"
        rx="25"
        ry="30"
        fill={STICKER_STYLE.fillEgg}
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />

      {/* Leaf crown */}
      <g fill={color} stroke={STICKER_STYLE.stroke} strokeWidth={1}>
        <path d="M35 25 Q45 15, 40 30 Q35 20, 35 25" />
        <path d="M50 20 Q60 8, 55 25 Q50 12, 50 20" />
        <path d="M65 25 Q55 15, 60 30 Q65 20, 65 25" />
      </g>

      {/* Eyes - closed happy */}
      <path
        d="M38 48 Q42 52, 46 48"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M54 48 Q58 52, 62 48"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />

      {/* Smile */}
      <path
        d="M40 62 Q50 72, 60 62"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />

      {/* Blush */}
      <ellipse cx="32" cy="58" rx="5" ry="3" fill="#FFB6C1" opacity={0.5} />
      <ellipse cx="68" cy="58" rx="5" ry="3" fill="#FFB6C1" opacity={0.5} />
    </g>
  );
}

/**
 * Chef achievement - Eggy with stars
 */
function ChefBadge({ color, unlocked }: { color: string; unlocked: boolean }) {
  return (
    <g opacity={unlocked ? 1 : 0.4}>
      {/* Eggy body */}
      <ellipse
        cx="50"
        cy="55"
        rx="25"
        ry="30"
        fill={STICKER_STYLE.fillEgg}
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />

      {/* Chef hat */}
      <g transform="translate(50, 18)">
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
        <rect x="-15" y="8" width="30" height="5" fill="white" />
      </g>

      {/* Stars around */}
      <g fill={color}>
        <path d="M25 35 L27 40 L32 40 L28 43 L30 48 L25 45 L20 48 L22 43 L18 40 L23 40 Z" />
        <path d="M75 35 L77 40 L82 40 L78 43 L80 48 L75 45 L70 48 L72 43 L68 40 L73 40 Z" />
        <path d="M50 80 L52 85 L57 85 L53 88 L55 93 L50 90 L45 93 L47 88 L43 85 L48 85 Z" />
      </g>

      {/* Eyes */}
      <ellipse cx="42" cy="50" rx="4" ry="5" fill={STICKER_STYLE.stroke} />
      <ellipse cx="58" cy="50" rx="4" ry="5" fill={STICKER_STYLE.stroke} />
      <circle cx="43" cy="49" r="1.5" fill="white" />
      <circle cx="59" cy="49" r="1.5" fill="white" />

      {/* Smile */}
      <path
        d="M42 65 Q50 72, 58 65"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

/**
 * Streak achievement - Eggy with flame
 */
function StreakBadge({
  color,
  unlocked,
}: {
  color: string;
  unlocked: boolean;
}) {
  return (
    <g opacity={unlocked ? 1 : 0.4}>
      {/* Flame background */}
      <path
        d="M50 5 Q65 25, 55 40 Q70 30, 60 50 Q75 45, 50 85 Q25 45, 40 50 Q30 30, 45 40 Q35 25, 50 5"
        fill={color}
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1.5}
      />
      <path
        d="M50 25 Q58 35, 52 50 Q62 45, 50 70 Q38 45, 48 50 Q42 35, 50 25"
        fill="#FCD34D"
      />

      {/* Eggy body (smaller, inside flame) */}
      <ellipse
        cx="50"
        cy="55"
        rx="18"
        ry="22"
        fill={STICKER_STYLE.fillEgg}
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />

      {/* Eyes */}
      <ellipse cx="44" cy="52" rx="3" ry="4" fill={STICKER_STYLE.stroke} />
      <ellipse cx="56" cy="52" rx="3" ry="4" fill={STICKER_STYLE.stroke} />
      <circle cx="45" cy="51" r="1" fill="white" />
      <circle cx="57" cy="51" r="1" fill="white" />

      {/* Excited smile */}
      <path
        d="M44 62 Q50 68, 56 62"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

/**
 * Explorer achievement - Eggy with compass
 */
function ExplorerBadge({
  color,
  unlocked,
}: {
  color: string;
  unlocked: boolean;
}) {
  return (
    <g opacity={unlocked ? 1 : 0.4}>
      {/* Eggy body */}
      <ellipse
        cx="50"
        cy="55"
        rx="25"
        ry="30"
        fill={STICKER_STYLE.fillEgg}
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
      />

      {/* Explorer hat */}
      <ellipse
        cx="50"
        cy="30"
        rx="28"
        ry="8"
        fill="#92400E"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1.5}
      />
      <ellipse
        cx="50"
        cy="25"
        rx="18"
        ry="10"
        fill="#B45309"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1.5}
      />

      {/* Compass badge */}
      <circle
        cx="72"
        cy="70"
        r="12"
        fill="white"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={1.5}
      />
      <path d="M72 60 L72 62" stroke={color} strokeWidth={2} />
      <path d="M72 78 L72 80" stroke={STICKER_STYLE.stroke} strokeWidth={1} />
      <path d="M62 70 L64 70" stroke={STICKER_STYLE.stroke} strokeWidth={1} />
      <path d="M80 70 L82 70" stroke={STICKER_STYLE.stroke} strokeWidth={1} />
      <path
        d="M72 70 L72 64"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M72 70 L76 70"
        stroke="#EF4444"
        strokeWidth={2}
        strokeLinecap="round"
      />

      {/* Eyes */}
      <ellipse cx="42" cy="50" rx="4" ry="5" fill={STICKER_STYLE.stroke} />
      <ellipse cx="58" cy="50" rx="4" ry="5" fill={STICKER_STYLE.stroke} />
      <circle cx="43" cy="49" r="1.5" fill="white" />
      <circle cx="59" cy="49" r="1.5" fill="white" />

      {/* Smile */}
      <path
        d="M42 65 Q50 72, 58 65"
        stroke={STICKER_STYLE.stroke}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
    </g>
  );
}

/**
 * Achievement badge component
 */
export function AchievementBadge({
  type,
  size = "md",
  animate = true,
  unlocked = true,
  className,
  ...props
}: AchievementBadgeProps) {
  const config = achievementConfig[type];

  const renderBadge = () => {
    switch (type) {
      case "first-egg":
        return <FirstEggBadge color={config.color} unlocked={unlocked} />;
      case "ten-eggs":
        return <TenEggsBadge color={config.color} unlocked={unlocked} />;
      case "anti-waste":
        return <AntiWasteBadge color={config.color} unlocked={unlocked} />;
      case "chef":
        return <ChefBadge color={config.color} unlocked={unlocked} />;
      case "streak":
        return <StreakBadge color={config.color} unlocked={unlocked} />;
      case "explorer":
        return <ExplorerBadge color={config.color} unlocked={unlocked} />;
    }
  };

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        sizeMap[size],
        animate &&
          unlocked &&
          "animate-[bounce-subtle_3s_ease-in-out_infinite]",
        className,
      )}
      {...props}
    >
      {renderBadge()}
    </svg>
  );
}

export default AchievementBadge;
