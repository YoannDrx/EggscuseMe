import type { EggSize } from "@/generated/prisma";

export type YolkPreference = "runny" | "soft" | "medium" | "hard";
export type EggTemperature = "fridge" | "room";

export type CookingMethod = "soft-boiled" | "medium-boiled" | "hard-boiled";

type CookingTimeConfig = {
  baseTime: number; // in seconds
  sizeAdjustment: Record<EggSize, number>; // seconds to add/subtract
  temperatureAdjustment: Record<EggTemperature, number>; // seconds to add/subtract
};

// Base cooking times for medium-sized eggs at room temperature
const cookingTimes: Record<CookingMethod, CookingTimeConfig> = {
  "soft-boiled": {
    baseTime: 180, // 3 minutes
    sizeAdjustment: { S: -15, M: 0, L: 15, XL: 30 },
    temperatureAdjustment: { room: 0, fridge: 30 },
  },
  "medium-boiled": {
    baseTime: 360, // 6 minutes
    sizeAdjustment: { S: -30, M: 0, L: 30, XL: 45 },
    temperatureAdjustment: { room: 0, fridge: 45 },
  },
  "hard-boiled": {
    baseTime: 600, // 10 minutes
    sizeAdjustment: { S: -45, M: 0, L: 45, XL: 60 },
    temperatureAdjustment: { room: 0, fridge: 60 },
  },
};

// Yolk preference to cooking method mapping
const yolkPreferenceMap: Record<YolkPreference, CookingMethod> = {
  runny: "soft-boiled",
  soft: "soft-boiled",
  medium: "medium-boiled",
  hard: "hard-boiled",
};

// Fine-tuning for yolk preference within a cooking method
const yolkAdjustment: Record<YolkPreference, number> = {
  runny: -30, // 30 seconds less for very runny
  soft: 0,
  medium: 0,
  hard: 30, // 30 seconds more for very firm
};

/**
 * Calculate the cooking time in seconds
 */
export function calculateCookingTime(
  size: EggSize,
  temperature: EggTemperature,
  yolkPreference: YolkPreference,
): number {
  const method = yolkPreferenceMap[yolkPreference];
  const config = cookingTimes[method];

  const baseTime = config.baseTime;
  const sizeAdj = config.sizeAdjustment[size];
  const tempAdj = config.temperatureAdjustment[temperature];
  const yolkAdj = yolkAdjustment[yolkPreference];

  return Math.max(60, baseTime + sizeAdj + tempAdj + yolkAdj); // Minimum 1 minute
}

/**
 * Format seconds to MM:SS display
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Get cooking method description
 */
export function getCookingDescription(yolkPreference: YolkPreference): string {
  const descriptions: Record<YolkPreference, string> = {
    runny: "Very runny yolk, perfect for dipping",
    soft: "Soft, jammy yolk",
    medium: "Creamy yolk, slightly firm center",
    hard: "Fully cooked yolk, great for salads",
  };
  return descriptions[yolkPreference];
}

/**
 * Get cooking method description (French)
 */
export function getCookingDescriptionFr(
  yolkPreference: YolkPreference,
): string {
  const descriptions: Record<YolkPreference, string> = {
    runny: "Jaune très coulant, parfait pour les mouillettes",
    soft: "Jaune mollet, onctueux",
    medium: "Jaune crémeux, légèrement ferme",
    hard: "Jaune bien cuit, idéal pour les salades",
  };
  return descriptions[yolkPreference];
}

/**
 * Get cooking tips
 */
export function getCookingTips(): string[] {
  return [
    "Use a timer for precise results",
    "Start with boiling water for consistent timing",
    "Gently lower eggs with a spoon to prevent cracking",
    "Immediately transfer to ice bath after cooking to stop the process",
    "For easier peeling, use eggs that are at least a week old",
  ];
}

/**
 * Get cooking tips (French)
 */
export function getCookingTipsFr(): string[] {
  return [
    "Utilisez un minuteur pour des résultats précis",
    "Commencez avec de l'eau bouillante pour un timing constant",
    "Plongez délicatement les œufs avec une cuillère pour éviter les fissures",
    "Transférez immédiatement dans un bain de glace pour stopper la cuisson",
    "Pour un épluchage facile, utilisez des œufs d'au moins une semaine",
  ];
}

/**
 * Labels for UI (French)
 */
export const timerLabelsFr = {
  sizes: {
    S: "Petit (S)",
    M: "Moyen (M)",
    L: "Gros (L)",
    XL: "Très gros (XL)",
  } as Record<string, string>,
  temperatures: {
    fridge: "Du frigo",
    room: "Température ambiante",
  } as Record<EggTemperature, string>,
  yolkPreferences: {
    runny: "Coulant (très mollet)",
    soft: "Mollet (onctueux)",
    medium: "Mi-cuit (crémeux)",
    hard: "Dur (bien cuit)",
  } as Record<YolkPreference, string>,
};
