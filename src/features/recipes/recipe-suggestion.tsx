"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eggy } from "@/features/mascot";
import { AlertTriangle, ChefHat, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { RecipeCard } from "./recipe-card";
import type { RecipeSuggestion as RecipeSuggestionType } from "./types";

type RecipeSuggestionProps = {
  suggestions: RecipeSuggestionType[];
  organizationSlug: string;
  showUrgentOnly?: boolean;
};

export function RecipeSuggestion({
  suggestions,
  organizationSlug,
  showUrgentOnly = false,
}: RecipeSuggestionProps) {
  const t = useTranslations("recipes");
  const displayedSuggestions = showUrgentOnly
    ? suggestions.filter((s) => s.urgency === "high")
    : suggestions;

  if (displayedSuggestions.length === 0) {
    return null;
  }

  const hasUrgent = displayedSuggestions.some((s) => s.urgency === "high");

  return (
    <Card
      variant="sunny"
      className={
        hasUrgent ? "border-fresh-cook ring-fresh-cook/20 ring-2" : undefined
      }
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {hasUrgent ? (
            <>
              <AlertTriangle className="text-fresh-cook size-5" />
              <span>{t("urgentTitle")}</span>
            </>
          ) : (
            <>
              <ChefHat className="text-primary size-5" />
              <span>{t("ideasTitle")}</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Eggy chef intro */}
        <div className="flex items-start gap-3">
          <Eggy mood="chef" size="sm" />
          <p className="text-muted-foreground text-sm">
            {hasUrgent ? t("urgentDescription") : t("normalDescription")}
          </p>
        </div>

        {/* Recipe cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {displayedSuggestions.slice(0, 3).map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} compact />
          ))}
        </div>

        {/* Link to full recipes page */}
        <div className="flex justify-center pt-2">
          <Link
            href={`/orgs/${organizationSlug}/recipes`}
            className={buttonVariants({
              variant: "neubrutalism-outline",
              size: "sm",
            })}
          >
            <ChefHat className="mr-2 size-4" />
            {t("viewAll")}
            <ExternalLink className="ml-2 size-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
