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
import { Egg, MoreHorizontal, Trash2, Utensils } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  calculateExpirationProgress,
  calculateFreshness,
  formatDaysRemaining,
  getFreshnessBgClass,
} from "../lib/freshness-calculator";
import { FreshnessBadge } from "./freshness-badge";

type EggBoxCardProps = {
  eggBox: EggBox;
  onConsume?: (eggBox: EggBox) => void;
  onDelete?: (eggBox: EggBox) => void;
  className?: string;
};

export function EggBoxCard({
  eggBox,
  onConsume,
  onDelete,
  className,
}: EggBoxCardProps) {
  const freshness = calculateFreshness(eggBox.layingDate);
  const progress = calculateExpirationProgress(eggBox.layingDate);

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      {/* Freshness indicator bar */}
      <div
        className={cn(
          "absolute top-0 left-0 h-1 w-full",
          getFreshnessBgClass(freshness.status),
        )}
      />

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">
              {eggBox.name ??
                `Box from ${eggBox.layingDate.toLocaleDateString()}`}
            </CardTitle>
            <CardDescription>
              {eggBox.source && <span>{eggBox.source} · </span>}
              Size {eggBox.size}
            </CardDescription>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onConsume && (
                <DropdownMenuItem onClick={() => onConsume(eggBox)}>
                  <Utensils className="mr-2 size-4" />
                  Consume eggs
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onDelete(eggBox)}
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete box
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Eggs remaining */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Egg className="text-muted-foreground size-5" />
            <span className="text-2xl font-bold">{eggBox.remaining}</span>
            <span className="text-muted-foreground text-sm">
              / {eggBox.quantity} eggs
            </span>
          </div>
          <FreshnessBadge status={freshness.status} size="sm" />
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <Progress
            value={progress}
            className="h-2"
            indicatorClassName={getFreshnessBgClass(freshness.status)}
          />
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>{freshness.daysOld} days old</span>
            <span>{formatDaysRemaining(freshness.daysRemaining)}</span>
          </div>
        </div>

        {/* Recommendations */}
        {freshness.recommendations.length > 0 && (
          <p className="text-muted-foreground text-sm">
            {freshness.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
