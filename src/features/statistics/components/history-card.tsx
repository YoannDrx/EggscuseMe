"use client";

import { ErrorIllustration } from "@/components/eggscuseme/illustrations";
import { SwipeableRow } from "@/components/eggscuseme/lists/swipeable-row";
import { Badge } from "@/components/ui/badge";
import { NeoCard } from "@/components/neo/neo-card";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import {
  Calendar,
  Egg,
  RotateCcw,
  Star,
  UtensilsCrossed,
  User,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export type HistoryItem = {
  id: string;
  date: Date;
  eggBoxName: string;
  quantity: number;
  cookingType: string;
  rating?: number | null;
  notes?: string | null;
  userName?: string | null;
  canUndo?: boolean;
};

const COOKING_TYPE_OPTIONS = {
  SOFT_BOILED: "softBoiled",
  POACHED: "poached",
  RAW: "raw",
  FRIED: "fried",
  SCRAMBLED: "scrambled",
  OMELETTE: "omelette",
  HARD_BOILED: "hardBoiled",
  BAKING: "baking",
  OTHER: "other",
} as const;

const COOKING_TYPE_COLORS: Record<string, string> = {
  SOFT_BOILED: "bg-fresh-extra/20 text-fresh-extra-foreground",
  POACHED: "bg-fresh-extra/20 text-fresh-extra-foreground",
  RAW: "bg-fresh-extra/20 text-fresh-extra-foreground",
  FRIED: "bg-fresh/20 text-fresh-foreground",
  SCRAMBLED: "bg-fresh/20 text-fresh-foreground",
  OMELETTE: "bg-fresh/20 text-fresh-foreground",
  HARD_BOILED: "bg-fresh-cook/20 text-fresh-cook-foreground",
  BAKING: "bg-fresh/20 text-fresh-foreground",
  OTHER: "bg-muted text-neo-text-muted",
};

export type HistoryCardProps = {
  item: HistoryItem;
  /** Callback when undo action is triggered */
  onUndo?: () => void;
  /** Animation delay for staggered entry */
  delay?: number;
  /** Additional CSS classes */
  className?: string;
};

/**
 * Card for displaying consumption history on mobile
 * - Swipe to delete
 * - Visual cooking type badge
 * - Star rating
 */
export function HistoryCard({
  item,
  onUndo,
  delay = 0,
  className,
}: HistoryCardProps) {
  const locale = useLocale();
  const tHistory = useTranslations("fridge.history");
  const tCooking = useTranslations("cooking");

  const formattedDate = new Date(item.date).toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const cookingKey =
    item.cookingType in COOKING_TYPE_OPTIONS
      ? COOKING_TYPE_OPTIONS[
          item.cookingType as keyof typeof COOKING_TYPE_OPTIONS
        ]
      : COOKING_TYPE_OPTIONS.OTHER;
  const cookingLabel = tCooking(cookingKey);
  const cookingColor =
    COOKING_TYPE_COLORS[item.cookingType] ?? COOKING_TYPE_COLORS.OTHER;
  const quantityLabel = tHistory("eggCount", { count: item.quantity });

  return (
    <SwipeableRow
      rightAction={
        item.canUndo && onUndo
          ? {
              icon: <RotateCcw className="size-5" />,
              label: tHistory("undo"),
              bgColor: "bg-neo-accent",
              onAction: onUndo,
            }
          : undefined
      }
      className={className}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay }}
      >
        <NeoCard
          variant="interactive"
          padding="md"
          className="flex flex-col gap-3"
        >
          {/* Header: Date + Quantity */}
          <div className="flex items-center justify-between">
            <div className="text-neo-text-muted flex items-center gap-2 text-sm">
              <Calendar className="size-4" />
              <span>{formattedDate}</span>
            </div>
            <Badge variant="outline" className="gap-1">
              <Egg className="size-3" />
              {quantityLabel}
            </Badge>
          </div>

          {/* Box name */}
          <p className="text-neo-text font-medium">{item.eggBoxName}</p>

          {item.userName && (
            <div className="text-neo-text-muted flex items-center gap-2 text-xs">
              <User className="size-3.5" />
              <span>{item.userName}</span>
            </div>
          )}

          {/* Footer: Cooking type + Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="text-neo-text-muted size-4" />
              <Badge className={cn("font-normal", cookingColor)}>
                {cookingLabel}
              </Badge>
            </div>

            {/* Rating */}
            {item.rating != null && (
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-4",
                      i < (item.rating ?? 0)
                        ? "fill-neo-accent text-neo-accent"
                        : "text-neo-text-muted/30",
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          {item.notes && (
            <p className="text-neo-text-muted line-clamp-2 text-sm italic">
              "{item.notes}"
            </p>
          )}
        </NeoCard>
      </motion.div>
    </SwipeableRow>
  );
}

/**
 * Group header for date grouping in history list
 */
export function HistoryDateGroup({
  date,
  children,
  className,
}: {
  date: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-neo-text-muted bg-neo-bg sticky top-0 py-2 text-sm font-semibold">
        {date}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/**
 * Empty state for history
 */
export function HistoryEmpty({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) {
  const t = useTranslations("fridge.history");

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-4 py-8 text-center",
        className,
      )}
    >
      <ErrorIllustration type="empty" size="lg" />
      <p className="text-neo-text-muted text-lg">
        {message ?? t("noConsumption")}
      </p>
    </div>
  );
}
