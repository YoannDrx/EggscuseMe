"use client";

import { RecipeTag } from "@/components/eggscuseme/illustrations";
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
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import {
  getRecipeDescription,
  getRecipeName,
  getRecipeTags,
} from "./lib/recipe-i18n";
import type { Recipe, RecipeSuggestion } from "./types";

// Map recipe tags to RecipeTag types
const tagToRecipeTagType: Record<
  string,
  | "quick"
  | "easy"
  | "gourmet"
  | "healthy"
  | "vegetarian"
  | "family"
  | "breakfast"
  | "dessert"
> = {
  rapide: "quick",
  quick: "quick",
  facile: "easy",
  easy: "easy",
  gourmand: "gourmet",
  gourmet: "gourmet",
  healthy: "healthy",
  sain: "healthy",
  végétarien: "vegetarian",
  vegetarian: "vegetarian",
  familial: "family",
  family: "family",
  "petit-déjeuner": "breakfast",
  breakfast: "breakfast",
  dessert: "dessert",
};

type RecipeCardProps = {
  recipe: Recipe | RecipeSuggestion;
  className?: string;
  compact?: boolean;
};

const difficultyIcons = {
  easy: Sparkles,
  medium: ChefHat,
  hard: Flame,
};

const difficultyStyles = {
  easy: "bg-fresh-extra/10 text-fresh-extra border-fresh-extra/20",
  medium: "bg-fresh/10 text-fresh border-fresh/20",
  hard: "bg-fresh-cook/10 text-fresh-cook border-fresh-cook/20",
};

export function RecipeCard({
  recipe,
  className,
  compact = false,
}: RecipeCardProps) {
  const locale = useLocale();
  const t = useTranslations("recipes.card");
  const isSuggestion = "urgency" in recipe;
  const DifficultyIcon = difficultyIcons[recipe.difficulty];
  const difficultyStyle = difficultyStyles[recipe.difficulty];

  // Get localized content
  const name = getRecipeName(recipe, locale);
  const description = getRecipeDescription(recipe, locale);
  const tags = getRecipeTags(recipe, locale);

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
              {name}
            </CardTitle>
            {isSuggestion && recipe.urgency === "high" && (
              <Badge variant="destructive" className="shrink-0">
                <AlertTriangle className="mr-1 size-3" />
                {t("urgent")}
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
              {description}
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
              {t("eggs", { count: recipe.eggsRequired })}
            </Badge>

            {/* Difficulty */}
            <Badge variant="outline" className={cn("gap-1", difficultyStyle)}>
              <DifficultyIcon className="size-3" />
              {t(`difficulty.${recipe.difficulty}`)}
            </Badge>
          </div>

          {/* Tags */}
          {!compact && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag) => {
                const tagLower = tag.toLowerCase();
                if (tagLower in tagToRecipeTagType) {
                  return (
                    <RecipeTag
                      key={tag}
                      type={tagToRecipeTagType[tagLower]}
                      size="sm"
                    />
                  );
                }
                return (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs capitalize"
                  >
                    {tag}
                  </Badge>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
