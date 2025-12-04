"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { EggBox } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Trash2, Utensils } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  calculateExpirationProgress,
  calculateFreshness,
  formatDaysRemainingFr,
  getFreshnessBgClass,
  getFreshnessDescriptionFr,
} from "../lib/freshness-calculator";
import { FreshnessBadge } from "./freshness-badge";
import { EggBoxVisual } from "./egg-box-visual";

type EggBoxCardProps = {
  eggBox: EggBox;
  onConsume?: (eggBox: EggBox) => void;
  onDelete?: (eggBox: EggBox) => void;
  className?: string;
};

const sizeLabels: Record<string, string> = {
  S: "Petits",
  M: "Moyens",
  L: "Gros",
  XL: "Très gros",
};

export function EggBoxCard({
  eggBox,
  onConsume,
  onDelete,
  className,
}: EggBoxCardProps) {
  const freshness = calculateFreshness(eggBox.layingDate);
  const progress = calculateExpirationProgress(eggBox.layingDate);
  const isUrgent =
    freshness.status === "cook-thoroughly" || freshness.status === "expired";

  return (
    <Card
      variant="sunny-interactive"
      className={cn(
        "relative overflow-hidden transition-all",
        isUrgent && "ring-fresh-cook/50 ring-2",
        className,
      )}
    >
      {/* Freshness indicator bar */}
      <div
        className={cn(
          "absolute top-0 left-0 h-1.5 w-full",
          getFreshnessBgClass(freshness.status),
        )}
      />

      <CardHeader className="pt-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-1">
            <CardTitle className="font-heading truncate text-lg">
              {eggBox.name ??
                `Boîte du ${eggBox.layingDate.toLocaleDateString("fr-FR")}`}
            </CardTitle>
            <CardDescription className="flex items-center gap-1.5 text-sm">
              {eggBox.source && <span>{eggBox.source}</span>}
              {eggBox.source && (
                <span className="text-muted-foreground">·</span>
              )}
              <span>{sizeLabels[eggBox.size] ?? eggBox.size}</span>
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <FreshnessBadge
              status={freshness.status}
              size="sm"
              variant="sunny"
              showIcon={false}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8 shrink-0">
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
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Visual egg box */}
        <EggBoxVisual
          quantity={eggBox.quantity}
          remaining={eggBox.remaining}
          status={freshness.status}
          onEggClick={onConsume ? () => onConsume(eggBox) : undefined}
        />

        {/* Stats row */}
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">
            {eggBox.remaining}{" "}
            <span className="text-muted-foreground font-normal">
              / {eggBox.quantity} œufs
            </span>
          </span>
          <span className="text-muted-foreground">
            {freshness.daysOld} jour{freshness.daysOld > 1 ? "s" : ""}
          </span>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <Progress
            value={progress}
            className="h-2"
            indicatorClassName={getFreshnessBgClass(freshness.status)}
          />
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>{getFreshnessDescriptionFr(freshness.status)}</span>
            <span className="shrink-0 font-medium">
              {formatDaysRemainingFr(freshness.daysRemaining)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
