"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { STICKER_STYLE } from "../base/sticker-base";

type RecipeTagType =
  | "quick"
  | "easy"
  | "gourmet"
  | "healthy"
  | "vegetarian"
  | "family"
  | "breakfast"
  | "dessert";

type RecipeTagProps = ComponentProps<"div"> & {
  type: RecipeTagType;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
};

const tagConfig: Record<
  RecipeTagType,
  {
    label: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    iconColor: string;
  }
> = {
  quick: {
    label: "Rapide",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
    borderColor: "border-cyan-400",
    textColor: "text-cyan-700 dark:text-cyan-300",
    iconColor: "#06B6D4",
  },
  easy: {
    label: "Facile",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    borderColor: "border-green-400",
    textColor: "text-green-700 dark:text-green-300",
    iconColor: "#22C55E",
  },
  gourmet: {
    label: "Gourmand",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    borderColor: "border-orange-400",
    textColor: "text-orange-700 dark:text-orange-300",
    iconColor: "#F97316",
  },
  healthy: {
    label: "Healthy",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    borderColor: "border-emerald-400",
    textColor: "text-emerald-700 dark:text-emerald-300",
    iconColor: "#10B981",
  },
  vegetarian: {
    label: "Végétarien",
    bgColor: "bg-lime-100 dark:bg-lime-900/30",
    borderColor: "border-lime-400",
    textColor: "text-lime-700 dark:text-lime-300",
    iconColor: "#84CC16",
  },
  family: {
    label: "Familial",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
    borderColor: "border-pink-400",
    textColor: "text-pink-700 dark:text-pink-300",
    iconColor: "#EC4899",
  },
  breakfast: {
    label: "Petit-déj",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    borderColor: "border-amber-400",
    textColor: "text-amber-700 dark:text-amber-300",
    iconColor: "#F59E0B",
  },
  dessert: {
    label: "Dessert",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    borderColor: "border-purple-400",
    textColor: "text-purple-700 dark:text-purple-300",
    iconColor: "#A855F7",
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
 * Illustrated recipe tag with themed Eggy icon
 */
export function RecipeTag({
  type,
  size = "md",
  showLabel = true,
  className,
  ...props
}: RecipeTagProps) {
  const config = tagConfig[type];
  const iconSize = iconSizes[size];

  // Render accessory based on type
  const renderAccessory = () => {
    switch (type) {
      case "quick":
        // Lightning bolt
        return (
          <path
            d="M12 2 L8 10 L12 10 L10 18 L16 8 L12 8 L14 2 Z"
            fill={config.iconColor}
            stroke={STICKER_STYLE.stroke}
            strokeWidth={0.5}
          />
        );
      case "easy":
        // Baby bonnet
        return (
          <ellipse
            cx="12"
            cy="5"
            rx="5"
            ry="3"
            fill={config.iconColor}
            stroke={STICKER_STYLE.stroke}
            strokeWidth={0.5}
          />
        );
      case "gourmet":
        // Chef hat
        return (
          <g>
            <circle
              cx="10"
              cy="4"
              r="3"
              fill="white"
              stroke={STICKER_STYLE.stroke}
              strokeWidth={0.5}
            />
            <circle
              cx="14"
              cy="4"
              r="3"
              fill="white"
              stroke={STICKER_STYLE.stroke}
              strokeWidth={0.5}
            />
            <circle
              cx="12"
              cy="3"
              r="3"
              fill="white"
              stroke={STICKER_STYLE.stroke}
              strokeWidth={0.5}
            />
            <rect x="8" y="5" width="8" height="3" fill="white" />
          </g>
        );
      case "healthy":
        // Muscle/flexed arm
        return (
          <path
            d="M18 10 Q20 8, 19 6 Q18 4, 16 5 L17 8 L16 10"
            fill={config.iconColor}
            stroke={STICKER_STYLE.stroke}
            strokeWidth={0.5}
          />
        );
      case "vegetarian":
        // Leaf
        return (
          <path
            d="M16 4 Q12 6, 16 12 Q18 8, 20 6 Q18 4, 16 4"
            fill={config.iconColor}
            stroke={STICKER_STYLE.stroke}
            strokeWidth={0.5}
          />
        );
      case "family":
        // Mini eggs beside main egg
        return (
          <g>
            <ellipse
              cx="4"
              cy="14"
              rx="2"
              ry="3"
              fill={STICKER_STYLE.fillEgg}
              stroke={STICKER_STYLE.stroke}
              strokeWidth={0.5}
            />
            <ellipse
              cx="20"
              cy="14"
              rx="2"
              ry="3"
              fill={STICKER_STYLE.fillEgg}
              stroke={STICKER_STYLE.stroke}
              strokeWidth={0.5}
            />
          </g>
        );
      case "breakfast":
        // Sun rays
        return (
          <g stroke={config.iconColor} strokeWidth={1} strokeLinecap="round">
            <path d="M12 2 L12 4" />
            <path d="M6 4 L7 6" />
            <path d="M18 4 L17 6" />
          </g>
        );
      case "dessert":
        // Sprinkles
        return (
          <g>
            <rect
              x="6"
              y="3"
              width="2"
              height="4"
              rx="1"
              fill="#EC4899"
              transform="rotate(20 7 5)"
            />
            <rect
              x="16"
              y="4"
              width="2"
              height="4"
              rx="1"
              fill="#3B82F6"
              transform="rotate(-15 17 6)"
            />
            <rect x="11" y="2" width="2" height="4" rx="1" fill="#22C55E" />
          </g>
        );
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
      {/* Eggy icon with accessory */}
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none">
        {/* Egg body */}
        <ellipse
          cx="12"
          cy="13"
          rx="7"
          ry="8"
          fill={STICKER_STYLE.fillEgg}
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1.5}
        />

        {/* Happy eyes */}
        <ellipse cx="9" cy="12" rx="1.5" ry="2" fill={STICKER_STYLE.stroke} />
        <ellipse cx="15" cy="12" rx="1.5" ry="2" fill={STICKER_STYLE.stroke} />
        <circle cx="9.5" cy="11.5" r="0.5" fill="white" />
        <circle cx="15.5" cy="11.5" r="0.5" fill="white" />

        {/* Happy smile */}
        <path
          d="M9 16 Q12 19, 15 16"
          stroke={STICKER_STYLE.stroke}
          strokeWidth={1}
          strokeLinecap="round"
          fill="none"
        />

        {/* Type-specific accessory */}
        {renderAccessory()}
      </svg>

      {showLabel && <span>{config.label}</span>}
    </div>
  );
}

export default RecipeTag;
