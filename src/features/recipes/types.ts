import type { FreshnessStatus } from "@/features/eggs/lib/freshness-calculator";

export type RecipeDifficulty = "easy" | "medium" | "hard";

export type Recipe = {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  eggsRequired: number;
  freshness: FreshnessStatus[]; // Compatible freshness levels
  difficulty: RecipeDifficulty;
  time: number; // in minutes
  image?: string;
  tags: string[];
};

export type RecipeSuggestion = Recipe & {
  urgency: "high" | "medium" | "low";
  reason: string;
};
