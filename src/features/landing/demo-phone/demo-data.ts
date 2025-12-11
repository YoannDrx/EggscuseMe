import type {
  CookingOption,
  DemoEggBox,
  DemoRecipe,
  DemoStats,
} from "./demo-types";

// Create dates relative to today for realistic freshness display
const today = new Date();

/**
 * Demo egg boxes matching the screenshots
 * One box per freshness status for demonstration
 */
export const DEMO_EGG_BOXES: DemoEggBox[] = [
  {
    id: "1",
    name: `Boite du ${today.toLocaleDateString("fr-FR")}`,
    source: null,
    layingDate: today, // 0 days = extra-fresh
    quantity: 6,
    remaining: 6,
    size: "M",
  },
];

/**
 * Demo recipes matching the screenshots
 */
export const DEMO_RECIPES: DemoRecipe[] = [
  {
    id: "1",
    name: "Oeufs a la coque",
    description:
      "Le classique du petit-dejeuner, avec des mouillettes beurrees. Jaune coulant parfait !",
    time: 5,
    eggsRequired: 2,
    difficulty: "easy",
    tags: ["Petit-dej", "Rapide", "Classique"],
    freshnessRequired: "extra-fresh",
  },
  {
    id: "2",
    name: "Oeufs brouilles cremeux",
    description:
      "Cremeux a souhait, avec une pointe de ciboulette. Le secret : cuisson douce !",
    time: 8,
    eggsRequired: 3,
    difficulty: "easy",
    tags: ["Petit-dej", "Rapide", "Cremeux"],
    freshnessRequired: "extra-fresh",
  },
  {
    id: "3",
    name: "Omelette aux fines herbes",
    description:
      "Baveuse au centre, doree a l'exterieur. Un classique indemodable.",
    time: 10,
    eggsRequired: 3,
    difficulty: "easy",
    tags: ["Rapide", "Classique"],
    freshnessRequired: "fresh",
  },
  {
    id: "4",
    name: "Oeuf au plat parfait",
    description: "Blanc bien cuit, jaune coulant. Simple mais technique !",
    time: 5,
    eggsRequired: 1,
    difficulty: "easy",
    tags: ["Rapide", "Express"],
    freshnessRequired: "fresh",
  },
  {
    id: "5",
    name: "Oeuf dur mayo",
    description:
      "L'incontournable du pique-nique. Parfait pour les oeufs moins frais.",
    time: 12,
    eggsRequired: 2,
    difficulty: "easy",
    tags: ["Classique", "Pique-nique"],
    freshnessRequired: "cook",
  },
  {
    id: "6",
    name: "Mousse au chocolat",
    description:
      "Aerienne et intense. Les blancs en neige font toute la difference.",
    time: 30,
    eggsRequired: 4,
    difficulty: "medium",
    tags: ["Dessert", "Gourmand"],
    freshnessRequired: "extra-fresh",
    isPremium: true,
  },
];

/**
 * Demo statistics matching the screenshots
 */
export const DEMO_STATS: DemoStats = {
  totalEggs: 6,
  consumed: 0,
  saved: 0,
  savings: 0,
  co2Saved: 0,
  streak: 0,
  weeklyData: [
    { day: "L", value: 0 },
    { day: "M", value: 0 },
    { day: "M", value: 0 },
    { day: "J", value: 0 },
    { day: "V", value: 0 },
    { day: "S", value: 0 },
    { day: "D", value: 0 },
  ],
  cookingTypes: [
    { type: "Dur", percent: 0, color: "bg-amber-400" },
    { type: "Mollet", percent: 0, color: "bg-orange-400" },
    { type: "Plat", percent: 0, color: "bg-emerald-400" },
    { type: "Autre", percent: 0, color: "bg-neutral-400" },
  ],
};

/**
 * Cooking options for the timer
 * Matching the real app's CookingSelector
 */
export const COOKING_OPTIONS: CookingOption[] = [
  {
    id: "runny",
    label: "Coulant (tres mollet)",
    description: "Jaune tres coulant, parfait pour les mouillettes",
    seconds: 180, // 3:00
  },
  {
    id: "soft",
    label: "Mollet",
    description: "Jaune mollet, onctueux",
    seconds: 210, // 3:30
  },
  {
    id: "medium",
    label: "Mi-cuit",
    description: "Jaune cremeux au centre",
    seconds: 300, // 5:00
  },
  {
    id: "hard",
    label: "Dur",
    description: "Jaune completement cuit",
    seconds: 600, // 10:00
  },
];

/**
 * Tab configuration for headers
 */
export const TAB_CONFIG = {
  fridge: {
    title: "Vos boites d'oeufs",
    subtitle: "1 boite active",
  },
  timer: {
    title: "Minuteur de cuisson",
    subtitle: "Choisissez votre cuisson",
  },
  recipes: {
    title: "Recettes",
    subtitle: "28 recettes",
  },
  stats: {
    title: "Statistiques",
    subtitle: "Sur les 90 derniers jours",
  },
} as const;
