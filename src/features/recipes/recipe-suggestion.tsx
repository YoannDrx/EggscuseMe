"use client";

import { NeoButton } from "@/components/neo";
import {
  NeoCard,
  NeoCardContent,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
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
    <NeoCard
      variant="elevated"
      className={
        hasUrgent ? "border-fresh-cook ring-fresh-cook/20 ring-2" : undefined
      }
    >
      <NeoCardHeader>
        <NeoCardTitle className="flex items-center gap-2">
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
        </NeoCardTitle>
      </NeoCardHeader>
      <NeoCardContent className="space-y-4">
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
          <Link href={`/orgs/${organizationSlug}/recipes`}>
            <NeoButton variant="outline" size="sm">
              <ChefHat className="mr-2 size-4" />
              {t("viewAll")}
              <ExternalLink className="ml-2 size-3" />
            </NeoButton>
          </Link>
        </div>
      </NeoCardContent>
    </NeoCard>
  );
}
