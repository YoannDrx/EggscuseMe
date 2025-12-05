"use client";

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

// Freshness color mappings for dark theme
const freshnessConfig = {
  "extra-fresh": {
    dotColor: "bg-emerald-500",
    textColor: "text-emerald-400",
    barColor: "bg-emerald-500",
    label: "Extra Frais",
  },
  fresh: {
    dotColor: "bg-amber-500",
    textColor: "text-amber-400",
    barColor: "bg-amber-500",
    label: "Frais",
  },
  "cook-thoroughly": {
    dotColor: "bg-orange-500",
    textColor: "text-orange-400",
    barColor: "bg-orange-500",
    label: "A cuire",
  },
  expired: {
    dotColor: "bg-red-500",
    textColor: "text-red-400",
    barColor: "bg-red-500",
    label: "Expire",
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
        "relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-900 p-4",
        "transition-all duration-200 hover:border-stone-700",
        className,
      )}
    >
      {/* Header Row */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("size-2.5 rounded-full", config.dotColor)} />
          <span className={cn("text-sm font-bold", config.textColor)}>
            {config.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500">
            {formatDaysRemainingFr(freshness.daysRemaining)}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-stone-500 hover:bg-stone-800 hover:text-stone-300"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="border-stone-800 bg-stone-900"
            >
              {onConsume && (
                <DropdownMenuItem
                  onClick={() => onConsume(eggBox)}
                  className="text-stone-300 focus:bg-stone-800 focus:text-white"
                >
                  <Utensils className="mr-2 size-4" />
                  Consommer
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(eggBox)}
                  className="text-red-400 focus:bg-red-500/20 focus:text-red-400"
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
        <h3 className="truncate font-semibold text-white">
          {eggBox.name ??
            `Boite du ${eggBox.layingDate.toLocaleDateString("fr-FR")}`}
        </h3>
        {eggBox.source && (
          <p className="text-xs text-stone-500">{eggBox.source}</p>
        )}
      </div>

      {/* Content Row */}
      <div className="mb-4 flex items-end justify-between">
        <div className="flex-1">
          <span className="text-xs text-stone-400">
            Pour: {getSuggestedUse()}
          </span>
          <p className="text-xs text-stone-500">
            {getFreshnessDescriptionFr(freshness.status)}
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-white">
            {eggBox.remaining}
          </span>
          <span className="ml-1 text-xs text-stone-500">
            / {eggBox.quantity} oeufs
          </span>
        </div>
      </div>

      {/* Size Badge */}
      <div className="mb-4 flex items-center gap-2">
        <span className="rounded-full bg-stone-800 px-2 py-0.5 text-xs text-stone-400">
          {sizeLabels[eggBox.size] ?? eggBox.size}
        </span>
        <span className="text-xs text-stone-500">
          {freshness.daysOld} jour{freshness.daysOld > 1 ? "s" : ""} depuis
          ponte
        </span>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-stone-800">
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
