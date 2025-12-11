import type { FreshnessStatus } from "@/features/eggs/lib/freshness-calculator";

export type RecipeDifficulty = "easy" | "medium" | "hard";

/**
 * Single instruction step for a recipe
 */
export type RecipeInstruction = {
  step: number;
  text: string; // French
  textEn: string; // English
};

export type Recipe = {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  eggsRequired: number;
  freshness: FreshnessStatus[]; // Compatible freshness levels
  difficulty: RecipeDifficulty;
  time: number; // in minutes
  image: string;
  tags: string[];
  tagsEn: string[];
  servings?: number;
  instructions: RecipeInstruction[];
  chefTip?: string; // Chef's professional tip (FR)
  chefTipEn?: string; // Chef's professional tip (EN)
  safetyNote?: string; // Food safety warning (FR)
  safetyNoteEn?: string; // Food safety warning (EN)
  isChefExclusive?: boolean; // Available only to Chef plan users
};

export type RecipeSuggestion = Recipe & {
  urgency: "high" | "medium" | "low";
  reason: string;
};
