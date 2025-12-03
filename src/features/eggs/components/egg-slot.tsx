"use client";

import { cn } from "@/lib/utils";
import type { FreshnessStatus } from "../lib/freshness-calculator";

type EggSlotProps = {
  status: FreshnessStatus;
  isEmpty?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  sm: "w-8 h-10",
  md: "w-10 h-12",
  lg: "w-12 h-14",
};

const statusColorMap: Record<FreshnessStatus, string> = {
  "extra-fresh": "fill-fresh-extra stroke-fresh-extra",
  fresh: "fill-fresh stroke-fresh",
  "cook-thoroughly": "fill-fresh-cook stroke-fresh-cook",
  expired: "fill-expired/50 stroke-expired",
};

export function EggSlot({
  status,
  isEmpty = false,
  onClick,
  size = "md",
  className,
}: EggSlotProps) {
  if (isEmpty) {
    return (
      <div
        className={cn(
          sizeMap[size],
          "border-muted-foreground/30 rounded-full border-2 border-dashed",
          "flex items-center justify-center",
          className,
        )}
      >
        <span className="text-muted-foreground/40 text-xs">-</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        sizeMap[size],
        "transition-transform duration-150 hover:scale-110 active:scale-95",
        "focus-visible:ring-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        onClick ? "cursor-pointer" : "cursor-default",
        className,
      )}
    >
      <svg
        viewBox="0 0 40 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full drop-shadow-sm"
      >
        {/* Egg shape */}
        <ellipse
          cx="20"
          cy="28"
          rx="16"
          ry="20"
          className={cn(statusColorMap[status], "stroke-[1.5]")}
        />
        {/* Highlight */}
        <ellipse cx="14" cy="20" rx="4" ry="5" className="fill-white/40" />
      </svg>
    </button>
  );
}
