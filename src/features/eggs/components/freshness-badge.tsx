"use client";

import { cn } from "@/lib/utils";
import { Egg } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  type FreshnessStatus,
  getFreshnessBgClass,
  getFreshnessColorClass,
} from "../lib/freshness-calculator";

type FreshnessBadgeProps = {
  status: FreshnessStatus;
  showLabel?: boolean;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "sunny" | "outline";
  className?: string;
};

const statusToKey: Record<FreshnessStatus, string> = {
  "extra-fresh": "extraFresh",
  fresh: "fresh",
  "cook-thoroughly": "cookThoroughly",
  expired: "expired",
};

export function FreshnessBadge({
  status,
  showLabel = true,
  showIcon = true,
  size = "md",
  variant = "default",
  className,
}: FreshnessBadgeProps) {
  const t = useTranslations("freshness");
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2",
  };

  const iconSizes = {
    sm: "size-3",
    md: "size-4",
    lg: "size-5",
  };

  const variantClasses = {
    default: cn("rounded-full font-medium", getFreshnessColorClass(status)),
    sunny: cn(
      "rounded-xl font-semibold border-[1.5px] border-current/20",
      getFreshnessBgClass(status),
      "shadow-[2px_2px_0px_currentColor/0.1]",
    ),
    outline: cn(
      "rounded-xl font-medium border-[1.5px] bg-transparent",
      getFreshnessColorClass(status),
      "border-current",
    ),
  };

  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap transition-all duration-200",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {showIcon && (
        <Egg
          className={cn(
            iconSizes[size],
            "shrink-0",
            status === "expired" && "opacity-60",
          )}
        />
      )}
      {showLabel && t(statusToKey[status])}
    </span>
  );
}
