"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ChefHat,
  Clock,
  Egg,
  Flame,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import type { Recipe, RecipeSuggestion } from "./types";

type RecipeCardProps = {
  recipe: Recipe | RecipeSuggestion;
  className?: string;
  compact?: boolean;
};

const difficultyConfig = {
  easy: {
    label: "Facile",
    icon: Sparkles,
    className: "bg-fresh-extra/10 text-fresh-extra border-fresh-extra/20",
  },
  medium: {
    label: "Moyen",
    icon: ChefHat,
    className: "bg-fresh/10 text-fresh border-fresh/20",
  },
  hard: {
    label: "Difficile",
    icon: Flame,
    className: "bg-fresh-cook/10 text-fresh-cook border-fresh-cook/20",
  },
};

export function RecipeCard({
  recipe,
  className,
  compact = false,
}: RecipeCardProps) {
  const isSuggestion = "urgency" in recipe;
  const difficulty = difficultyConfig[recipe.difficulty];
  const DifficultyIcon = difficulty.icon;

  return (
    <Link href={`/fridge/recipes/${recipe.id}`} className="block">
      <Card
        variant="sunny-interactive"
        className={cn(
          "group h-full transition-all",
          isSuggestion &&
            recipe.urgency === "high" &&
            "border-fresh-cook ring-fresh-cook/20 ring-2",
          className,
        )}
      >
        <CardHeader className={cn("pb-2", compact && "py-3")}>
          <div className="flex items-start justify-between gap-2">
            <CardTitle
              className={cn(
                "font-heading",
                compact ? "text-base" : "text-lg",
                "leading-tight",
              )}
            >
              {recipe.name}
            </CardTitle>
            {isSuggestion && recipe.urgency === "high" && (
              <Badge variant="destructive" className="shrink-0">
                <AlertTriangle className="mr-1 size-3" />
                Urgent
              </Badge>
            )}
          </div>

          {/* Suggestion reason */}
          {isSuggestion && (
            <p className="text-primary text-xs font-medium">{recipe.reason}</p>
          )}
        </CardHeader>

        <CardContent className={cn("space-y-3", compact && "py-2")}>
          {/* Description */}
          {!compact && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {recipe.description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Time */}
            <Badge variant="outline" className="gap-1">
              <Clock className="size-3" />
              {recipe.time} min
            </Badge>

            {/* Eggs required */}
            <Badge variant="outline" className="gap-1">
              <Egg className="size-3" />
              {recipe.eggsRequired} oeuf{recipe.eggsRequired > 1 ? "s" : ""}
            </Badge>

            {/* Difficulty */}
            <Badge
              variant="outline"
              className={cn("gap-1", difficulty.className)}
            >
              <DifficultyIcon className="size-3" />
              {difficulty.label}
            </Badge>
          </div>

          {/* Tags */}
          {!compact && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {recipe.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs capitalize"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
