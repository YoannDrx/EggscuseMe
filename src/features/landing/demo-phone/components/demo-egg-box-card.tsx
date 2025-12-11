"use client";

import { FreshnessTag } from "@/components/eggscuseme/illustrations";
import { cn } from "@/lib/utils";
import { ChevronDown, Egg } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  calculateExpirationProgress,
  calculateFreshness,
  formatDaysRemainingFr,
  getFreshnessDescriptionFr,
} from "@/features/eggs/lib/freshness-calculator";
import type { DemoEggBox } from "../demo-types";

type DemoEggBoxCardProps = {
  eggBox: DemoEggBox;
  className?: string;
  index?: number;
};

const sizeLabels: Record<string, string> = {
  S: "Petits",
  M: "Moyens",
  L: "Gros",
  XL: "Tres gros",
};

// Freshness color mappings using design system tokens
const freshnessConfig = {
  "extra-fresh": {
    barColor: "bg-fresh-extra",
    tagStatus: "extra-fresh" as const,
  },
  fresh: {
    barColor: "bg-fresh",
    tagStatus: "fresh" as const,
  },
  "cook-thoroughly": {
    barColor: "bg-fresh-cook",
    tagStatus: "cook" as const,
  },
  expired: {
    barColor: "bg-expired",
    tagStatus: "expired" as const,
  },
};

export function DemoEggBoxCard({
  eggBox,
  className,
  index = 0,
}: DemoEggBoxCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const freshness = calculateFreshness(eggBox.layingDate);
  const progress = calculateExpirationProgress(eggBox.layingDate);
  const config = freshnessConfig[freshness.status];

  // Get suggested cooking method based on freshness
  const getSuggestedUse = () => {
    switch (freshness.status) {
      case "extra-fresh":
        return "Mousse, mayonnaise, coque";
      case "fresh":
        return "Omelette, au plat";
      case "cook-thoroughly":
        return "Oeuf dur uniquement";
      case "expired":
        return "A jeter";
      default:
        return "Cuisson recommandee";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className={cn(
        "border-neo-border bg-neo-card relative overflow-hidden rounded-[var(--radius-neo-2xl)] border-[length:var(--border-neo)]",
        "shadow-[var(--shadow-neo-md)]",
        "transition-all duration-200",
        className,
      )}
    >
      {/* Main Content - Clickable */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left"
      >
        {/* Header Row */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <FreshnessTag
            status={config.tagStatus}
            size="sm"
            className="flex-shrink-0"
          />
          <span className="text-neo-text-muted text-xs">
            {formatDaysRemainingFr(freshness.daysRemaining)}
          </span>
        </div>

        {/* Name + Count Row */}
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-neo-text flex-1 truncate font-semibold">
            {eggBox.name ||
              `Boite du ${eggBox.layingDate.toLocaleDateString("fr-FR")}`}
          </h3>
          <div className="flex items-center gap-1">
            <Egg className="text-neo-text-muted size-4" />
            <span className="text-neo-text text-lg font-bold">
              {eggBox.remaining}
            </span>
            <span className="text-neo-text-muted text-xs">
              /{eggBox.quantity}
            </span>
          </div>
        </div>

        {/* Expand indicator */}
        <div className="mt-2 flex items-center justify-center">
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="text-neo-text-muted size-4" />
          </motion.div>
        </div>
      </button>

      {/* Expandable Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-neo-border/30 border-t px-4 pt-3 pb-4">
              {/* Cooking recommendation */}
              <div className="mb-3">
                <p className="text-neo-text mb-1 text-xs font-medium">
                  Ideal pour :
                </p>
                <p className="text-neo-accent text-sm font-semibold">
                  {getSuggestedUse()}
                </p>
                <p className="text-neo-text-muted mt-1 text-xs">
                  {getFreshnessDescriptionFr(freshness.status)}
                </p>
              </div>

              {/* Meta info */}
              <div className="flex items-center gap-3">
                <span className="bg-neo-bg text-neo-text-muted rounded-full px-2 py-0.5 text-xs">
                  {sizeLabels[eggBox.size] ?? eggBox.size}
                </span>
                <span className="text-neo-text-muted text-xs">
                  {freshness.daysOld} jour{freshness.daysOld > 1 ? "s" : ""}{" "}
                  depuis ponte
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="bg-neo-card/30 absolute bottom-0 left-0 h-1 w-full">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${100 - progress}%` }}
          transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
          className={cn("h-full", config.barColor)}
        />
      </div>
    </motion.div>
  );
}
