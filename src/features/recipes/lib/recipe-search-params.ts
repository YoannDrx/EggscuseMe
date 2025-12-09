import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

export const timeRanges = ["all", "quick", "medium", "long"] as const;
export type TimeRange = (typeof timeRanges)[number];

export const eggRanges = ["all", "1-2", "3-4", "5+"] as const;
export type EggRange = (typeof eggRanges)[number];

export const difficultyOptions = ["all", "easy", "medium", "hard"] as const;
export type DifficultyOption = (typeof difficultyOptions)[number];

export const freshnessOptions = [
  "all",
  "extra-fresh",
  "fresh",
  "cook-thoroughly",
] as const;
export type FreshnessOption = (typeof freshnessOptions)[number];

export const recipeSearchParams = {
  tags: parseAsArrayOf(parseAsString).withDefault([]),
  time: parseAsStringLiteral(timeRanges).withDefault("all"),
  eggs: parseAsStringLiteral(eggRanges).withDefault("all"),
  difficulty: parseAsStringLiteral(difficultyOptions).withDefault("all"),
  freshness: parseAsStringLiteral(freshnessOptions).withDefault("all"),
  search: parseAsString.withDefault(""),
};

export const recipeSearchParamsCache =
  createSearchParamsCache(recipeSearchParams);

/**
 * Time range boundaries in minutes
 */
export const timeRangeBoundaries: Record<
  TimeRange,
  { min: number; max: number } | null
> = {
  all: null,
  quick: { min: 0, max: 15 },
  medium: { min: 16, max: 30 },
  long: { min: 31, max: Infinity },
};

/**
 * Egg range boundaries
 */
export const eggRangeBoundaries: Record<
  EggRange,
  { min: number; max: number } | null
> = {
  all: null,
  "1-2": { min: 1, max: 2 },
  "3-4": { min: 3, max: 4 },
  "5+": { min: 5, max: Infinity },
};
