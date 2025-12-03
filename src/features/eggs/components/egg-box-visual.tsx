"use client";

import { cn } from "@/lib/utils";
import type { FreshnessStatus } from "../lib/freshness-calculator";
import { EggSlot } from "./egg-slot";

type EggBoxVisualProps = {
  quantity: number;
  remaining: number;
  status: FreshnessStatus;
  onEggClick?: () => void;
  className?: string;
};

/**
 * Visual representation of an egg box with individual egg slots
 * Shows remaining eggs and empty slots for consumed ones
 */
export function EggBoxVisual({
  quantity,
  remaining,
  status,
  onEggClick,
  className,
}: EggBoxVisualProps) {
  // Determine grid layout based on quantity
  const getGridCols = () => {
    if (quantity <= 4) return "grid-cols-2";
    if (quantity <= 6) return "grid-cols-3";
    if (quantity <= 10) return "grid-cols-5";
    return "grid-cols-6";
  };

  // Create array of slots
  const slots = Array.from({ length: quantity }, (_, i) => {
    const isEgg = i < remaining;
    return { id: i, isEgg };
  });

  return (
    <div
      className={cn(
        "rounded-xl bg-gradient-to-b from-amber-50 to-amber-100/50 p-3",
        "border border-amber-200/50 shadow-inner",
        className,
      )}
    >
      <div className={cn("grid justify-items-center gap-1", getGridCols())}>
        {slots.map((slot) => (
          <EggSlot
            key={slot.id}
            status={status}
            isEmpty={!slot.isEgg}
            onClick={slot.isEgg ? onEggClick : undefined}
            size="sm"
          />
        ))}
      </div>
    </div>
  );
}
