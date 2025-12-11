/**
 * Types for the demo phone preview
 * These mirror the real app types but without Prisma dependencies
 */

export type DemoEggBox = {
  id: string;
  name: string;
  source: string | null;
  layingDate: Date;
  quantity: number;
  remaining: number;
  size: "S" | "M" | "L" | "XL";
  lotNumber?: string;
  producerCode?: string;
};

export type DemoRecipe = {
  id: string;
  name: string;
  description: string;
  time: number; // minutes
  eggsRequired: number;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  freshnessRequired: "extra-fresh" | "fresh" | "cook";
  isPremium?: boolean;
};

export type DemoStats = {
  totalEggs: number;
  consumed: number;
  saved: number;
  savings: number; // euros
  co2Saved: number; // kg
  streak: number; // days
  weeklyData: { day: string; value: number }[];
  cookingTypes: { type: string; percent: number; color: string }[];
};

export type DemoTab = "fridge" | "timer" | "recipes" | "stats";

export type CookingOption = {
  id: string;
  label: string;
  description: string;
  seconds: number;
};
