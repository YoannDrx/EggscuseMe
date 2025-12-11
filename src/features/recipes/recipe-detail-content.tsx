"use client";

import { Badge } from "@/components/ui/badge";
import {
  NeoCard,
  NeoCardContent,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo/neo-card";
import { cn } from "@/lib/utils";
import { AlertTriangle, ChefHat, Lightbulb, Tag } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Recipe } from "./types";
import { RecipeHero } from "./recipe-hero";
import { RecipeSteps } from "./recipe-steps";
import {
  getRecipeTags,
  getRecipeChefTip,
  getRecipeSafetyNote,
} from "./lib/recipe-i18n";

type RecipeDetailContentProps = {
  recipe: Recipe;
  className?: string;
};

function getFreshnessLabel(freshness: string, locale: string): string {
  const labels: Record<string, { fr: string; en: string } | undefined> = {
    "extra-fresh": { fr: "extra-frais", en: "extra-fresh" },
    fresh: { fr: "frais", en: "fresh" },
    "cook-thoroughly": { fr: "à bien cuire", en: "cook thoroughly" },
    expired: { fr: "expiré", en: "expired" },
  };
  const label = labels[freshness];
  if (!label) return freshness;
  return locale === "en" ? label.en : label.fr;
}

export function RecipeDetailContent({
  recipe,
  className,
}: RecipeDetailContentProps) {
  const locale = useLocale();
  const t = useTranslations("recipes.detail");
  const tags = getRecipeTags(recipe, locale);
  const chefTip = getRecipeChefTip(recipe, locale);
  const safetyNote = getRecipeSafetyNote(recipe, locale);

  return (
    <div className={cn("mx-auto max-w-2xl space-y-6 pb-20", className)}>
      {/* Hero section */}
      <RecipeHero recipe={recipe} />

      {/* Safety note - shown first if present */}
      {safetyNote && (
        <NeoCard variant="accent" padding="md" className="border-fresh-cook/30">
          <NeoCardHeader className="pb-2">
            <NeoCardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="text-fresh-cook size-4" />
              {t("safetyNote")}
            </NeoCardTitle>
          </NeoCardHeader>
          <NeoCardContent>
            <p className="text-neo-text-muted text-sm">{safetyNote}</p>
          </NeoCardContent>
        </NeoCard>
      )}

      {/* Chef tip */}
      {chefTip && (
        <NeoCard variant="accent" padding="md" className="border-neo-accent/30">
          <NeoCardHeader className="pb-2">
            <NeoCardTitle className="flex items-center gap-2 text-base">
              <ChefHat className="text-neo-accent size-4" />
              {t("chefTip")}
            </NeoCardTitle>
          </NeoCardHeader>
          <NeoCardContent>
            <p className="text-neo-text-muted text-sm">{chefTip}</p>
          </NeoCardContent>
        </NeoCard>
      )}

      {/* Freshness tip */}
      <NeoCard variant="elevated" padding="md">
        <NeoCardHeader className="pb-2">
          <NeoCardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="text-fresh size-4" />
            {t("freshnessTip")}
          </NeoCardTitle>
        </NeoCardHeader>
        <NeoCardContent>
          <p className="text-neo-text-muted text-sm">
            {t("idealFor")}{" "}
            <span className="text-neo-text font-medium">
              {recipe.freshness
                .map((f) => getFreshnessLabel(f, locale))
                .join(", ")}
            </span>
          </p>
        </NeoCardContent>
      </NeoCard>

      {/* Instructions */}
      <RecipeSteps instructions={recipe.instructions} />

      {/* Tags */}
      {tags.length > 0 && (
        <NeoCard variant="elevated" padding="md">
          <NeoCardHeader className="pb-2">
            <NeoCardTitle className="flex items-center gap-2 text-base">
              <Tag className="size-4" />
              Tags
            </NeoCardTitle>
          </NeoCardHeader>
          <NeoCardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="capitalize">
                  {tag}
                </Badge>
              ))}
            </div>
          </NeoCardContent>
        </NeoCard>
      )}
    </div>
  );
}
