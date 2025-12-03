import type { FreshnessStatus } from "@/features/eggs/lib/freshness-calculator";
import { RECIPES } from "./recipes-data";
import type { Recipe, RecipeSuggestion } from "./types";

type EggBoxInfo = {
  id: string;
  name: string | null;
  remaining: number;
  daysRemaining: number;
  freshness: FreshnessStatus;
};

/**
 * Get recipe suggestions based on available eggs and their freshness
 */
export function getRecipeSuggestions(
  eggBoxes: EggBoxInfo[],
  limit = 5,
): RecipeSuggestion[] {
  if (eggBoxes.length === 0) {
    return [];
  }

  // Sort by days remaining (most urgent first)
  const sortedBoxes = [...eggBoxes].sort(
    (a, b) => a.daysRemaining - b.daysRemaining,
  );

  // Calculate total eggs and most urgent freshness
  const totalEggs = sortedBoxes.reduce((sum, box) => sum + box.remaining, 0);
  const mostUrgentBox = sortedBoxes[0];
  const urgentFreshness = mostUrgentBox.freshness;

  // Find matching recipes
  const suggestions: RecipeSuggestion[] = [];

  for (const recipe of RECIPES) {
    // Check if we have enough eggs
    if (recipe.eggsRequired > totalEggs) {
      continue;
    }

    // Check if freshness is compatible
    if (!recipe.freshness.includes(urgentFreshness)) {
      continue;
    }

    // Determine urgency based on days remaining
    let urgency: RecipeSuggestion["urgency"];
    let reason: string;

    if (mostUrgentBox.daysRemaining <= 2) {
      urgency = "high";
      reason = `Parfait pour utiliser vos oeufs qui expirent dans ${mostUrgentBox.daysRemaining} jour${mostUrgentBox.daysRemaining > 1 ? "s" : ""} !`;
    } else if (mostUrgentBox.daysRemaining <= 5) {
      urgency = "medium";
      reason = `Idéal pour vos oeufs ${getFreshnessLabel(urgentFreshness)}`;
    } else {
      urgency = "low";
      reason = `Recommandé pour des oeufs ${getFreshnessLabel(urgentFreshness)}`;
    }

    suggestions.push({
      ...recipe,
      urgency,
      reason,
    });
  }

  // Sort by urgency and difficulty
  suggestions.sort((a, b) => {
    const urgencyOrder = { high: 0, medium: 1, low: 2 };
    const diffOrder = { easy: 0, medium: 1, hard: 2 };

    // First by urgency
    if (urgencyOrder[a.urgency] !== urgencyOrder[b.urgency]) {
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    }

    // Then by difficulty (prefer easier)
    return diffOrder[a.difficulty] - diffOrder[b.difficulty];
  });

  return suggestions.slice(0, limit);
}

/**
 * Get urgent recipe suggestions for eggs expiring soon
 */
export function getUrgentRecipeSuggestions(
  eggBoxes: EggBoxInfo[],
  daysThreshold = 3,
): RecipeSuggestion[] {
  const urgentBoxes = eggBoxes.filter(
    (box) => box.daysRemaining <= daysThreshold && box.daysRemaining >= 0,
  );

  if (urgentBoxes.length === 0) {
    return [];
  }

  return getRecipeSuggestions(urgentBoxes, 3);
}

/**
 * Get recipe suggestions for a specific tag
 */
export function getRecipesByTag(tag: string): Recipe[] {
  return RECIPES.filter((r) => r.tags.includes(tag));
}

/**
 * Get all unique tags from recipes
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const recipe of RECIPES) {
    for (const tag of recipe.tags) {
      tags.add(tag);
    }
  }
  return Array.from(tags).sort();
}

function getFreshnessLabel(freshness: FreshnessStatus): string {
  const labels: Record<FreshnessStatus, string> = {
    "extra-fresh": "extra-frais",
    fresh: "frais",
    "cook-thoroughly": "à bien cuire",
    expired: "expirés",
  };
  return labels[freshness];
}
