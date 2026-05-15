"use client";

import { RecipeTag } from "@/components/eggscuseme/illustrations";
import { NeoBadge } from "@/components/neo";
import {
  NeoCard,
  NeoCardContent,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
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
import Image from "next/image";
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
      <NeoCard
        variant="interactive"
        className={cn(
          "group h-full transition-all",
          isSuggestion &&
            recipe.urgency === "high" &&
            "border-fresh-cook ring-fresh-cook/20 ring-2",
          className,
        )}
      >
        {!compact && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-[calc(var(--radius-neo-2xl)-2px)]">
            <Image
              src={recipe.image}
              alt={name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <NeoCardHeader className={cn("pb-2", compact && "py-3")}>
          <div className="flex items-start justify-between gap-2">
            <NeoCardTitle
              className={cn(
                "font-heading",
                compact ? "text-base" : "text-lg",
                "leading-tight",
              )}
            >
              {name}
            </NeoCardTitle>
            <div className="flex shrink-0 gap-1">
              {recipe.isChefExclusive && (
                <NeoBadge
                  variant="secondary"
                  className="border-amber-500/30 bg-amber-500/10 text-amber-500"
                >
                  <ChefHat className="mr-1 size-3" />
                  Chef
                </NeoBadge>
              )}
              {isSuggestion && recipe.urgency === "high" && (
                <NeoBadge variant="destructive">
                  <AlertTriangle className="mr-1 size-3" />
                  {t("urgent")}
                </NeoBadge>
              )}
            </div>
          </div>

          {/* Suggestion reason */}
          {isSuggestion && (
            <p className="text-primary text-xs font-medium">{recipe.reason}</p>
          )}
        </NeoCardHeader>

        <NeoCardContent className={cn("space-y-3", compact && "py-2")}>
          {/* Description */}
          {!compact && (
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Time */}
            <NeoBadge variant="outline" className="gap-1">
              <Clock className="size-3" />
              {recipe.time} min
            </NeoBadge>

            {/* Eggs required */}
            <NeoBadge variant="outline" className="gap-1">
              <Egg className="size-3" />
              {t("eggs", { count: recipe.eggsRequired })}
            </NeoBadge>

            {/* Difficulty */}
            <NeoBadge
              variant="outline"
              className={cn("gap-1", difficultyStyle)}
            >
              <DifficultyIcon className="size-3" />
              {t(`difficulty.${recipe.difficulty}`)}
            </NeoBadge>
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
                  <NeoBadge
                    key={tag}
                    variant="secondary"
                    className="text-xs capitalize"
                  >
                    {tag}
                  </NeoBadge>
                );
              })}
            </div>
          )}
        </NeoCardContent>
      </NeoCard>
    </Link>
  );
}
