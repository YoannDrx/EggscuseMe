"use client";

import { FreshnessTag } from "@/components/eggscuseme/illustrations";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { EggBox } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Trash2, Utensils } from "lucide-react";
import { motion } from "motion/react";
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

export function EggBoxCard({
  eggBox,
  onConsume,
  onDelete,
  className,
  index = 0,
}: EggBoxCardProps) {
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
        "border-border bg-card relative overflow-hidden rounded-2xl border p-4",
        "hover:border-muted-foreground/30 transition-all duration-200",
        className,
      )}
    >
      {/* Header Row */}
      <div className="mb-3 flex items-center justify-between">
        <FreshnessTag status={config.tagStatus} size="sm" />
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">
            {formatDaysRemainingFr(freshness.daysRemaining)}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:bg-muted hover:text-foreground size-7"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onConsume && (
                <DropdownMenuItem onClick={() => onConsume(eggBox)}>
                  <Utensils className="mr-2 size-4" />
                  Consommer
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(eggBox)}
                >
                  <Trash2 className="mr-2 size-4" />
                  Supprimer
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Name Row */}
      <div className="mb-2">
        <h3 className="text-foreground truncate font-semibold">
          {eggBox.name ??
            `Boite du ${eggBox.layingDate.toLocaleDateString("fr-FR")}`}
        </h3>
        {eggBox.source && (
          <p className="text-muted-foreground text-xs">{eggBox.source}</p>
        )}
      </div>

      {/* Content Row */}
      <div className="mb-4 flex items-end justify-between">
        <div className="flex-1">
          <span className="text-muted-foreground text-xs">
            Pour: {getSuggestedUse()}
          </span>
          <p className="text-muted-foreground text-xs">
            {getFreshnessDescriptionFr(freshness.status)}
          </p>
        </div>
        <div className="text-right">
          <span className="text-foreground text-2xl font-bold">
            {eggBox.remaining}
          </span>
          <span className="text-muted-foreground ml-1 text-xs">
            / {eggBox.quantity} oeufs
          </span>
        </div>
      </div>

      {/* Size Badge */}
      <div className="mb-4 flex items-center gap-2">
        <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
          {sizeLabels[eggBox.size] ?? eggBox.size}
        </span>
        <span className="text-muted-foreground text-xs">
          {freshness.daysOld} jour{freshness.daysOld > 1 ? "s" : ""} depuis
          ponte
        </span>
      </div>

      {/* Progress Bar */}
      <div className="bg-muted absolute bottom-0 left-0 h-1 w-full">
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
