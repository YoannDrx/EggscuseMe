"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Lightbulb, Tag } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Recipe } from "./types";
import { RecipeHero } from "./recipe-hero";
import { RecipeSteps } from "./recipe-steps";
import { getRecipeTags } from "./lib/recipe-i18n";

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

  return (
    <div className={cn("mx-auto max-w-2xl space-y-6 pb-20", className)}>
      {/* Hero section */}
      <RecipeHero recipe={recipe} />

      {/* Freshness tip */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Lightbulb className="text-fresh size-4" />
            {t("freshnessTip")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            {t("idealFor")}{" "}
            <span className="text-foreground font-medium">
              {recipe.freshness
                .map((f) => getFreshnessLabel(f, locale))
                .join(", ")}
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Instructions */}
      <RecipeSteps instructions={recipe.instructions} />

      {/* Tags */}
      {tags.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Tag className="size-4" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="capitalize">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
