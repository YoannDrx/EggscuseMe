"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { STICKER_STYLE } from "../base/sticker-base";

type SavingsTagType = "money" | "co2" | "eggs" | "time";

type SavingsTagProps = ComponentProps<"div"> & {
  type: SavingsTagType;
  value: string | number;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
};

const tagConfig: Record<
  SavingsTagType,
  {
    prefix: string;
    suffix: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    iconColor: string;
  }
> = {
  money: {
    prefix: "",
    suffix: "€",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    borderColor: "border-emerald-400",
    textColor: "text-emerald-700 dark:text-emerald-300",
    iconColor: "#10B981",
  },
  co2: {
    prefix: "-",
    suffix: "kg CO₂",
    bgColor: "bg-sky-100 dark:bg-sky-900/30",
    borderColor: "border-sky-400",
    textColor: "text-sky-700 dark:text-sky-300",
    iconColor: "#0EA5E9",
  },
  eggs: {
    prefix: "",
    suffix: " sauvés",
    bgColor: "bg-amber-100 dark:bg-amber-900/30",
    borderColor: "border-amber-400",
    textColor: "text-amber-700 dark:text-amber-300",
    iconColor: "#F59E0B",
  },
  time: {
    prefix: "",
    suffix: " min",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    borderColor: "border-purple-400",
    textColor: "text-purple-700 dark:text-purple-300",
    iconColor: "#A855F7",
  },
};

const sizeClasses = {
  sm: "h-7 px-2.5 text-xs gap-1.5",
  md: "h-9 px-3.5 text-sm gap-2",
  lg: "h-11 px-4 text-base gap-2.5",
};

const iconSizes = {
  sm: 18,
  md: 22,
  lg: 26,
};

/**
 * Savings tag with themed icon
 */
export function SavingsTag({
  type,
  value,
  size = "md",
  animate = true,
  className,
  ...props
}: SavingsTagProps) {
  const config = tagConfig[type];
  const iconSize = iconSizes[size];

  // Render icon based on type
  const renderIcon = () => {
    switch (type) {
      case "money":
        // Eggy with money bag
        return (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
          >
            {/* Egg body */}
            <ellipse
              cx="12"
              cy="14"
              rx="7"
              ry="8"
              fill={STICKER_STYLE.fillEgg}
              stroke={STICKER_STYLE.stroke}
              strokeWidth={1.5}
            />
            {/* Happy eyes */}
            <ellipse
              cx="9"
              cy="12"
              rx="1.5"
              ry="2"
              fill={STICKER_STYLE.stroke}
            />
            <ellipse
              cx="15"
              cy="12"
              rx="1.5"
              ry="2"
              fill={STICKER_STYLE.stroke}
            />
            <circle cx="9.5" cy="11.5" r="0.5" fill="white" />
            <circle cx="15.5" cy="11.5" r="0.5" fill="white" />
            {/* Smile */}
            <path
              d="M9 17 Q12 20, 15 17"
              stroke={STICKER_STYLE.stroke}
              strokeWidth={1}
              strokeLinecap="round"
              fill="none"
            />
            {/* Money symbol */}
            <circle
              cx="18"
              cy="6"
              r="5"
              fill={config.iconColor}
              stroke={STICKER_STYLE.stroke}
              strokeWidth={0.5}
            />
            <text
              x="18"
              y="8"
              textAnchor="middle"
              fill="white"
              fontSize="6"
              fontWeight="bold"
            >
              €
            </text>
          </svg>
        );

      case "co2":
        // Eggy with leaf/earth
        return (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
          >
            {/* Egg body */}
            <ellipse
              cx="12"
              cy="14"
              rx="7"
              ry="8"
              fill={STICKER_STYLE.fillEgg}
              stroke={STICKER_STYLE.stroke}
              strokeWidth={1.5}
            />
            {/* Happy eyes */}
            <ellipse
              cx="9"
              cy="12"
              rx="1.5"
              ry="2"
              fill={STICKER_STYLE.stroke}
            />
            <ellipse
              cx="15"
              cy="12"
              rx="1.5"
              ry="2"
              fill={STICKER_STYLE.stroke}
            />
            <circle cx="9.5" cy="11.5" r="0.5" fill="white" />
            <circle cx="15.5" cy="11.5" r="0.5" fill="white" />
            {/* Smile */}
            <path
              d="M9 17 Q12 20, 15 17"
              stroke={STICKER_STYLE.stroke}
              strokeWidth={1}
              strokeLinecap="round"
              fill="none"
            />
            {/* Earth/leaf */}
            <circle
              cx="18"
              cy="6"
              r="5"
              fill={config.iconColor}
              stroke={STICKER_STYLE.stroke}
              strokeWidth={0.5}
            />
            <path d="M16 5 Q18 4, 20 6 Q18 8, 16 7 Z" fill="#22C55E" />
          </svg>
        );

      case "eggs":
        // Multiple mini eggs
        return (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
          >
            {/* Main egg */}
            <ellipse
              cx="12"
              cy="14"
              rx="6"
              ry="7"
              fill={STICKER_STYLE.fillEgg}
              stroke={STICKER_STYLE.stroke}
              strokeWidth={1.5}
            />
            {/* Eyes */}
            <ellipse
              cx="10"
              cy="12"
              rx="1.2"
              ry="1.5"
              fill={STICKER_STYLE.stroke}
            />
            <ellipse
              cx="14"
              cy="12"
              rx="1.2"
              ry="1.5"
              fill={STICKER_STYLE.stroke}
            />
            <circle cx="10.3" cy="11.5" r="0.4" fill="white" />
            <circle cx="14.3" cy="11.5" r="0.4" fill="white" />
            {/* Smile */}
            <path
              d="M10 16 Q12 18, 14 16"
              stroke={STICKER_STYLE.stroke}
              strokeWidth={1}
              strokeLinecap="round"
              fill="none"
            />
            {/* Mini eggs */}
            <ellipse
              cx="4"
              cy="16"
              rx="2.5"
              ry="3"
              fill={STICKER_STYLE.fillEgg}
              stroke={STICKER_STYLE.stroke}
              strokeWidth={0.8}
            />
            <ellipse
              cx="20"
              cy="16"
              rx="2.5"
              ry="3"
              fill={STICKER_STYLE.fillEgg}
              stroke={STICKER_STYLE.stroke}
              strokeWidth={0.8}
            />
            {/* Hearts */}
            <path
              d="M12 4 C10 2, 8 4, 12 8 C16 4, 14 2, 12 4"
              fill={config.iconColor}
              stroke={STICKER_STYLE.stroke}
              strokeWidth={0.3}
            />
          </svg>
        );

      case "time":
        // Eggy with clock
        return (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
          >
            {/* Egg body */}
            <ellipse
              cx="12"
              cy="14"
              rx="7"
              ry="8"
              fill={STICKER_STYLE.fillEgg}
              stroke={STICKER_STYLE.stroke}
              strokeWidth={1.5}
            />
            {/* Eyes */}
            <ellipse
              cx="9"
              cy="12"
              rx="1.5"
              ry="2"
              fill={STICKER_STYLE.stroke}
            />
            <ellipse
              cx="15"
              cy="12"
              rx="1.5"
              ry="2"
              fill={STICKER_STYLE.stroke}
            />
            <circle cx="9.5" cy="11.5" r="0.5" fill="white" />
            <circle cx="15.5" cy="11.5" r="0.5" fill="white" />
            {/* Smile */}
            <path
              d="M9 17 Q12 20, 15 17"
              stroke={STICKER_STYLE.stroke}
              strokeWidth={1}
              strokeLinecap="round"
              fill="none"
            />
            {/* Clock */}
            <circle
              cx="18"
              cy="6"
              r="5"
              fill="white"
              stroke={STICKER_STYLE.stroke}
              strokeWidth={0.8}
            />
            <circle cx="18" cy="6" r="0.8" fill={STICKER_STYLE.stroke} />
            <path
              d="M18 6 L18 3"
              stroke={STICKER_STYLE.stroke}
              strokeWidth={0.8}
              strokeLinecap="round"
            />
            <path
              d="M18 6 L20 7"
              stroke={STICKER_STYLE.stroke}
              strokeWidth={0.8}
              strokeLinecap="round"
            />
          </svg>
        );
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border-2 font-bold",
        config.bgColor,
        config.borderColor,
        config.textColor,
        sizeClasses[size],
        animate && "animate-[bounce-subtle_3s_ease-in-out_infinite]",
        className,
      )}
      {...props}
    >
      {renderIcon()}
      <span>
        {config.prefix}
        {value}
        {config.suffix}
      </span>
    </div>
  );
}

/**
 * Savings summary with multiple tags
 */
export function SavingsSummary({
  money,
  co2,
  eggs,
  size = "md",
  className,
}: {
  money?: number;
  co2?: number;
  eggs?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {money !== undefined && money > 0 && (
        <SavingsTag type="money" value={money.toFixed(2)} size={size} />
      )}
      {co2 !== undefined && co2 > 0 && (
        <SavingsTag type="co2" value={co2.toFixed(1)} size={size} />
      )}
      {eggs !== undefined && eggs > 0 && (
        <SavingsTag type="eggs" value={eggs} size={size} />
      )}
    </div>
  );
}

export default SavingsTag;
