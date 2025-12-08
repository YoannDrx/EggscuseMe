"use client";

import { Egg } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsArrayOf, parseAsString, useQueryStates } from "nuqs";
import { useMemo } from "react";
import { RecipeCard } from "../recipe-card";
import { RECIPES } from "../recipes-data";
import type { Recipe } from "../types";
import {
  eggRangeBoundaries,
  recipeSearchParams,
  timeRangeBoundaries,
} from "../lib/recipe-search-params";
import { getRecipeName, getRecipeDescription } from "../lib/recipe-i18n";
import { useLocale } from "next-intl";
import { Eggy } from "@/features/mascot";

export function RecipeGrid() {
  const locale = useLocale();
  const t = useTranslations("recipes.filters");

  const [filters] = useQueryStates(
    {
      ...recipeSearchParams,
      tags: parseAsArrayOf(parseAsString).withDefault([]),
    },
    {
      shallow: false,
    },
  );

  const filteredRecipes = useMemo(() => {
    let recipes = [...RECIPES];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      recipes = recipes.filter((recipe) => {
        const name = getRecipeName(recipe, locale).toLowerCase();
        const description = getRecipeDescription(recipe, locale).toLowerCase();
        const tags = recipe.tags.join(" ").toLowerCase();
        return (
          name.includes(searchLower) ||
          description.includes(searchLower) ||
          tags.includes(searchLower)
        );
      });
    }

    // Time filter
    if (filters.time !== "all") {
      const bounds = timeRangeBoundaries[filters.time];
      if (bounds) {
        recipes = recipes.filter(
          (recipe) => recipe.time >= bounds.min && recipe.time <= bounds.max,
        );
      }
    }

    // Eggs filter
    if (filters.eggs !== "all") {
      const bounds = eggRangeBoundaries[filters.eggs];
      if (bounds) {
        recipes = recipes.filter(
          (recipe) =>
            recipe.eggsRequired >= bounds.min &&
            recipe.eggsRequired <= bounds.max,
        );
      }
    }

    // Difficulty filter
    if (filters.difficulty !== "all") {
      recipes = recipes.filter(
        (recipe) => recipe.difficulty === filters.difficulty,
      );
    }

    // Freshness filter
    if (filters.freshness !== "all") {
      recipes = recipes.filter((recipe) =>
        recipe.freshness.includes(
          filters.freshness as Recipe["freshness"][number],
        ),
      );
    }

    // Tags filter (AND logic - recipe must have all selected tags)
    if (filters.tags.length > 0) {
      recipes = recipes.filter((recipe) =>
        filters.tags.every((tag) => recipe.tags.includes(tag)),
      );
    }

    return recipes;
  }, [filters, locale]);

  const hasActiveFilters =
    filters.tags.length > 0 ||
    filters.time !== "all" ||
    filters.eggs !== "all" ||
    filters.difficulty !== "all" ||
    filters.freshness !== "all" ||
    filters.search !== "";

  if (filteredRecipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <Eggy mood="sad" size="lg" />
        <div className="text-center">
          <p className="text-muted-foreground font-medium">{t("noResults")}</p>
          <p className="text-muted-foreground text-sm">{t("noResultsHint")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results count */}
      {hasActiveFilters && (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Egg className="size-4" />
          <span>
            {filteredRecipes.length}{" "}
            {filteredRecipes.length === 1 ? t("result") : t("results")}
          </span>
        </div>
      )}

      {/* Recipe grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
