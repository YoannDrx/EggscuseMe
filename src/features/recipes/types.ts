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
  image: string; // Unsplash URL
  tags: string[];
  tagsEn: string[];
  servings?: number;
  instructions: RecipeInstruction[];
};

export type RecipeSuggestion = Recipe & {
  urgency: "high" | "medium" | "low";
  reason: string;
};
