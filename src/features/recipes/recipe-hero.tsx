"use client";

import { NeoBadge } from "@/components/neo";
import { NeoButton } from "@/components/neo";
import { cn } from "@/lib/utils";
import {
  ChefHat,
  Clock,
  Egg,
  Flame,
  Sparkles,
  Users,
  ArrowLeft,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import type { Recipe } from "./types";
import { getRecipeName, getRecipeDescription } from "./lib/recipe-i18n";

type RecipeHeroProps = {
  recipe: Recipe;
  className?: string;
};

const difficultyConfig = {
  easy: {
    labelKey: "easy",
    icon: Sparkles,
    className: "bg-fresh-extra/10 text-fresh-extra border-fresh-extra/20",
  },
  medium: {
    labelKey: "medium",
    icon: ChefHat,
    className: "bg-fresh/10 text-fresh border-fresh/20",
  },
  hard: {
    labelKey: "hard",
    icon: Flame,
    className: "bg-fresh-cook/10 text-fresh-cook border-fresh-cook/20",
  },
};

export function RecipeHero({ recipe, className }: RecipeHeroProps) {
  const locale = useLocale();
  const t = useTranslations("recipes.detail");
  const tDifficulty = useTranslations("recipes.difficulty");

  const difficulty = difficultyConfig[recipe.difficulty];
  const DifficultyIcon = difficulty.icon;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Back button */}
      <Link href="/fridge/recipes">
        <NeoButton variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="size-4" />
          {t("backToList")}
        </NeoButton>
      </Link>

      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
        <Image
          src={recipe.image}
          alt={getRecipeName(recipe, locale)}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>

      {/* Title and description */}
      <div className="space-y-3">
        <h1 className="font-heading text-3xl font-bold">
          {getRecipeName(recipe, locale)}
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {getRecipeDescription(recipe, locale)}
        </p>
      </div>

      {/* Meta badges */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Time */}
        <NeoBadge variant="outline" className="gap-1 px-3 py-1.5">
          <Clock className="size-4" />
          {recipe.time} min
        </NeoBadge>

        {/* Eggs required */}
        <NeoBadge variant="outline" className="gap-1 px-3 py-1.5">
          <Egg className="size-4" />
          {recipe.eggsRequired} {recipe.eggsRequired > 1 ? t("eggs") : t("egg")}
        </NeoBadge>

        {/* Servings */}
        {recipe.servings && (
          <NeoBadge variant="outline" className="gap-1 px-3 py-1.5">
            <Users className="size-4" />
            {recipe.servings} {t("servings")}
          </NeoBadge>
        )}

        {/* Difficulty */}
        <NeoBadge
          variant="outline"
          className={cn("gap-1 px-3 py-1.5", difficulty.className)}
        >
          <DifficultyIcon className="size-4" />
          {tDifficulty(difficulty.labelKey)}
        </NeoBadge>
      </div>
    </div>
  );
}
