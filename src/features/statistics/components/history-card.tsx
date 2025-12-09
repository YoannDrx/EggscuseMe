"use client";

import { Badge } from "@/components/ui/badge";
import { SwipeableRow } from "@/components/eggscuseme/lists/swipeable-row";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Calendar, Egg, Star, UtensilsCrossed } from "lucide-react";

export type HistoryItem = {
  id: string;
  date: Date;
  eggBoxName: string;
  quantity: number;
  cookingType: string;
  rating?: number | null;
  notes?: string | null;
};

const COOKING_TYPE_LABELS: Record<string, string> = {
  SOFT_BOILED: "A la coque",
  POACHED: "Poché",
  RAW: "Cru",
  FRIED: "Au plat",
  SCRAMBLED: "Brouillés",
  OMELETTE: "Omelette",
  HARD_BOILED: "Dur",
  BAKING: "Pâtisserie",
  OTHER: "Autre",
};

const COOKING_TYPE_COLORS: Record<string, string> = {
  SOFT_BOILED: "bg-fresh-extra/20 text-fresh-extra-foreground",
  POACHED: "bg-fresh-extra/20 text-fresh-extra-foreground",
  RAW: "bg-fresh-extra/20 text-fresh-extra-foreground",
  FRIED: "bg-fresh/20 text-fresh-foreground",
  SCRAMBLED: "bg-fresh/20 text-fresh-foreground",
  OMELETTE: "bg-fresh/20 text-fresh-foreground",
  HARD_BOILED: "bg-fresh-cook/20 text-fresh-cook-foreground",
  BAKING: "bg-fresh/20 text-fresh-foreground",
  OTHER: "bg-muted text-muted-foreground",
};

export type HistoryCardProps = {
  item: HistoryItem;
  /** Callback when delete action is triggered */
  onDelete?: () => void;
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
  onDelete,
  delay = 0,
  className,
}: HistoryCardProps) {
  const formattedDate = new Date(item.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const cookingLabel =
    COOKING_TYPE_LABELS[item.cookingType] ?? item.cookingType;
  const cookingColor =
    COOKING_TYPE_COLORS[item.cookingType] ?? COOKING_TYPE_COLORS.OTHER;

  return (
    <SwipeableRow onDelete={onDelete} className={className}>
      <motion.div
        className={cn(
          "bg-card border-border rounded-2xl border p-[var(--space-card-padding)]",
          "flex flex-col gap-3",
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay }}
      >
        {/* Header: Date + Quantity */}
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Calendar className="size-4" />
            <span>{formattedDate}</span>
          </div>
          <Badge variant="outline" className="gap-1">
            <Egg className="size-3" />
            {item.quantity} oeuf{item.quantity > 1 ? "s" : ""}
          </Badge>
        </div>

        {/* Box name */}
        <p className="text-foreground font-medium">{item.eggBoxName}</p>

        {/* Footer: Cooking type + Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="text-muted-foreground size-4" />
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
                      ? "fill-primary text-primary"
                      : "text-muted-foreground/30",
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        {item.notes && (
          <p className="text-muted-foreground line-clamp-2 text-sm italic">
            "{item.notes}"
          </p>
        )}
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
      <h3 className="text-muted-foreground bg-background sticky top-0 py-2 text-sm font-semibold">
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
  message = "Aucune consommation trouvée",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="bg-muted rounded-full p-4">
        <Egg className="text-muted-foreground size-8" />
      </div>
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
