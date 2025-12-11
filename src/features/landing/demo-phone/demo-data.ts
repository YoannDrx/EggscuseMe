import type {
  CookingOption,
  DemoEggBox,
  DemoRecipe,
  DemoStats,
} from "./demo-types";

// Create dates relative to today for realistic freshness display
const today = new Date();
const daysAgo = (days: number) => {
  const date = new Date(today);
  date.setDate(date.getDate() - days);
  return date;
};

/**
 * Demo egg boxes matching the screenshots
 * Multiple boxes with different freshness levels for demonstration
 */
export const DEMO_EGG_BOXES: DemoEggBox[] = [
  {
    id: "1",
    name: "Ferme des Music'Oeufs",
    source: "Marche local",
    layingDate: daysAgo(2), // 2 days = extra-fresh
    quantity: 6,
    remaining: 4,
    size: "L",
  },
  {
    id: "2",
    name: "Oeufs bio Carrefour",
    source: "Supermarche",
    layingDate: daysAgo(12), // 12 days = fresh
    quantity: 10,
    remaining: 7,
    size: "M",
  },
  {
    id: "3",
    name: "Poules de Mamie",
    source: "Famille",
    layingDate: daysAgo(24), // 24 days = cook thoroughly
    quantity: 6,
    remaining: 2,
    size: "S",
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
  totalEggs: 13, // 4 + 7 + 2 from egg boxes
  consumed: 47,
  saved: 12,
  savings: 8.4,
  co2Saved: 2.3,
  streak: 14,
  weeklyData: [
    { day: "L", value: 2 },
    { day: "M", value: 3 },
    { day: "M", value: 1 },
    { day: "J", value: 4 },
    { day: "V", value: 2 },
    { day: "S", value: 5 },
    { day: "D", value: 3 },
  ],
  cookingTypes: [
    { type: "Dur", percent: 35, color: "bg-amber-400" },
    { type: "Mollet", percent: 28, color: "bg-orange-400" },
    { type: "Plat", percent: 22, color: "bg-emerald-400" },
    { type: "Autre", percent: 15, color: "bg-neutral-400" },
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
    title: "Mon frigo",
    subtitle: "3 boites actives",
  },
  timer: {
    title: "Minuteur de cuisson",
    subtitle: "Oeuf a la coque parfait",
  },
  recipes: {
    title: "Recettes",
    subtitle: "28 recettes disponibles",
  },
  stats: {
    title: "Statistiques",
    subtitle: "90 derniers jours",
  },
} as const;
