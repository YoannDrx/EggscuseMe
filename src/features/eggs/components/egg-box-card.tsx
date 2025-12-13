"use client";

import { FreshnessTag } from "@/components/eggscuseme/illustrations";
import {
  NeoDropdown,
  NeoDropdownContent,
  NeoDropdownItem,
  NeoDropdownTrigger,
} from "@/components/neo/neo-dropdown";
import type { EggBox } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { ChefHat, MoreHorizontal, Trash2, Utensils } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import {
  calculateExpirationProgress,
  calculateFreshness,
  formatDaysRemainingFr,
  getFreshnessDescriptionFr,
} from "../lib/freshness-calculator";

type EggBoxCardProps = {
  eggBox: EggBox;
  onConsume?: (eggBox: EggBox) => void;
  onDelete?: (eggBox: EggBox) => void;
  className?: string;
  index?: number;
  referenceDate?: Date;
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

const LAYING_DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "UTC",
});

export function EggBoxCard({
  eggBox,
  onConsume,
  onDelete,
  className,
  index = 0,
  referenceDate,
}: EggBoxCardProps) {
  const layingDate = useMemo(
    () => new Date(eggBox.layingDate),
    [eggBox.layingDate],
  );
  const freshness = calculateFreshness(layingDate, referenceDate);
  const progress = calculateExpirationProgress(layingDate, referenceDate);
  const formattedLayingDate = useMemo(
    () => LAYING_DATE_FORMATTER.format(layingDate),
    [layingDate],
  );
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
        "border-neo-border bg-neo-card relative overflow-hidden rounded-[var(--radius-neo-2xl)] border-[length:var(--border-neo)] p-4",
        "shadow-[var(--shadow-neo-md)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-lg)]",
        "transition-all duration-200",
        className,
      )}
    >
      {eggBox.scanImageUrl && (
        <div className="border-neo-border/20 mb-3 overflow-hidden rounded-[var(--radius-neo-xl)] border">
          <img
            src={eggBox.scanImageUrl}
            alt=""
            className="h-24 w-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Header Row */}
      <div className="mb-3 flex items-center justify-between">
        <FreshnessTag status={config.tagStatus} size="sm" />
        <div className="flex items-center gap-2">
          <span className="text-neo-text-muted text-xs">
            {formatDaysRemainingFr(freshness.daysRemaining)}
          </span>
          <NeoDropdown>
            <NeoDropdownTrigger asChild>
              <button
                type="button"
                className="text-neo-text-muted hover:text-neo-text rounded p-1 transition-colors"
              >
                <MoreHorizontal className="size-4" />
              </button>
            </NeoDropdownTrigger>
            <NeoDropdownContent align="end">
              {onConsume && (
                <NeoDropdownItem onClick={() => onConsume(eggBox)}>
                  <Utensils className="mr-2 size-4" />
                  Consommer
                </NeoDropdownItem>
              )}
              {onDelete && (
                <NeoDropdownItem
                  variant="destructive"
                  onClick={() => onDelete(eggBox)}
                >
                  <Trash2 className="mr-2 size-4" />
                  Supprimer
                </NeoDropdownItem>
              )}
            </NeoDropdownContent>
          </NeoDropdown>
        </div>
      </div>

      {/* Name Row */}
      <div className="mb-2">
        <h3 className="text-neo-text truncate font-semibold">
          {eggBox.name ?? `Boite du ${formattedLayingDate}`}
        </h3>
        {eggBox.source && (
          <p className="text-neo-text-muted text-xs">{eggBox.source}</p>
        )}
      </div>

      {/* Content Row */}
      <div className="mb-4 flex items-end justify-between">
        <div className="flex-1">
          <span className="text-neo-text-muted text-xs">
            Pour: {getSuggestedUse()}
          </span>
          <p className="text-neo-text-muted text-xs">
            {getFreshnessDescriptionFr(freshness.status)}
          </p>
        </div>
        <div className="text-right">
          <span className="text-neo-text text-2xl font-bold">
            {eggBox.remaining}
          </span>
          <span className="text-neo-text-muted ml-1 text-xs">
            / {eggBox.quantity} oeufs
          </span>
        </div>
      </div>

      {/* Size Badge */}
      <div className="mb-4 flex items-center gap-2">
        <span className="bg-neo-card text-neo-text-muted rounded-full px-2 py-0.5 text-xs">
          {sizeLabels[eggBox.size] ?? eggBox.size}
        </span>
        <span className="text-neo-text-muted text-xs">
          {freshness.daysOld} jour{freshness.daysOld > 1 ? "s" : ""} depuis
          ponte
        </span>
      </div>

      {/* Pro Mode Info (if available) */}
      {(eggBox.lotNumber ?? eggBox.producerCode) && (
        <div className="mb-4 flex items-center gap-2 rounded border border-amber-500/30 bg-amber-500/5 px-2 py-1">
          <ChefHat className="size-3 text-amber-500" />
          <span className="text-neo-text-muted text-xs">
            {eggBox.lotNumber && `Lot: ${eggBox.lotNumber}`}
            {eggBox.lotNumber && eggBox.producerCode && " • "}
            {eggBox.producerCode && `Prod: ${eggBox.producerCode}`}
          </span>
        </div>
      )}

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
