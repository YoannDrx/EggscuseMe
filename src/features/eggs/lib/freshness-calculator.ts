import { SiteConfig } from "@/site-config";
import type { CookingType } from "@/generated/prisma";
import {
  addDays,
  differenceInCalendarDays,
  startOfDay,
  subDays,
} from "date-fns";

export type FreshnessStatus =
  | "extra-fresh"
  | "fresh"
  | "cook-thoroughly"
  | "expired";

export type FreshnessInfo = {
  status: FreshnessStatus;
  daysOld: number;
  daysRemaining: number;
  recommendations: CookingType[];
  description: string;
};

type EggBoxFreshnessSource = {
  layingDate: Date;
  dcrDate?: Date | null;
};

function normalizeCalendarDate(date: Date): Date {
  return startOfDay(date);
}

export function getDcrDateFromLayingDate(layingDate: Date): Date {
  return addDays(
    normalizeCalendarDate(layingDate),
    SiteConfig.freshness.cookThoroughlyDays,
  );
}

export function getLayingDateFromDcrDate(dcrDate: Date): Date {
  return subDays(
    normalizeCalendarDate(dcrDate),
    SiteConfig.freshness.cookThoroughlyDays,
  );
}

export function resolveEggBoxDcrDate(eggBox: EggBoxFreshnessSource): Date {
  if (eggBox.dcrDate) {
    return normalizeCalendarDate(new Date(eggBox.dcrDate));
  }

  return getDcrDateFromLayingDate(new Date(eggBox.layingDate));
}

/**
 * Calculate the freshness status of an egg based on its DCR
 * (Date de Consommation Recommandée).
 *
 * Freshness rules:
 * - Day 0-9: Extra-fresh (soft-boiled, poached, raw)
 * - Day 10-21: Fresh (fried, scrambled, omelette, baking)
 * - Day 22-28: Cook thoroughly (hard-boiled only)
 * - Day 29+: Expired (discard)
 */
export function calculateFreshnessFromDcrDate(
  dcrDate: Date,
  referenceDate: Date = new Date(),
): FreshnessInfo {
  const { extraFreshDays, freshDays, cookThoroughlyDays } =
    SiteConfig.freshness;
  const rawDaysRemaining = differenceInCalendarDays(
    normalizeCalendarDate(dcrDate),
    normalizeCalendarDate(referenceDate),
  );
  const daysOld = cookThoroughlyDays - rawDaysRemaining;
  const daysRemaining = Math.max(0, rawDaysRemaining);

  if (daysOld <= extraFreshDays) {
    return {
      status: "extra-fresh",
      daysOld,
      daysRemaining,
      recommendations: ["SOFT_BOILED", "POACHED", "RAW"],
      description: "Perfect for soft-boiled, poached, or raw preparations",
    };
  }

  if (daysOld <= freshDays) {
    return {
      status: "fresh",
      daysOld,
      daysRemaining,
      recommendations: ["FRIED", "SCRAMBLED", "OMELETTE", "BAKING"],
      description: "Ideal for fried eggs, omelettes, or baking",
    };
  }

  if (daysOld <= cookThoroughlyDays) {
    return {
      status: "cook-thoroughly",
      daysOld,
      daysRemaining,
      recommendations: ["HARD_BOILED"],
      description: "Only consume well-cooked (hard-boiled)",
    };
  }

  return {
    status: "expired",
    daysOld,
    daysRemaining: 0,
    recommendations: [],
    description: "Expired - do not consume",
  };
}

/**
 * Legacy compatibility wrapper. Prefer calculateFreshnessFromDcrDate for new code.
 */
export function calculateFreshness(
  layingDate: Date,
  referenceDate: Date = new Date(),
): FreshnessInfo {
  return calculateFreshnessFromDcrDate(
    getDcrDateFromLayingDate(layingDate),
    referenceDate,
  );
}

export function calculateEggBoxFreshness(
  eggBox: EggBoxFreshnessSource,
  referenceDate: Date = new Date(),
): FreshnessInfo {
  return calculateFreshnessFromDcrDate(
    resolveEggBoxDcrDate(eggBox),
    referenceDate,
  );
}

/**
 * Get CSS class names for freshness status
 */
export function getFreshnessColorClass(status: FreshnessStatus): string {
  const colorMap: Record<FreshnessStatus, string> = {
    "extra-fresh": "bg-fresh-extra text-fresh-extra-foreground",
    fresh: "bg-fresh text-fresh-foreground",
    "cook-thoroughly": "bg-fresh-cook text-fresh-cook-foreground",
    expired: "bg-expired text-expired-foreground",
  };

  return colorMap[status];
}

/**
 * Get background color for freshness status (for indicators)
 */
export function getFreshnessBgClass(status: FreshnessStatus): string {
  const colorMap: Record<FreshnessStatus, string> = {
    "extra-fresh": "bg-fresh-extra",
    fresh: "bg-fresh",
    "cook-thoroughly": "bg-fresh-cook",
    expired: "bg-expired",
  };

  return colorMap[status];
}

/**
 * Calculate progress percentage for expiration
 * 0% = just laid, 100% = expired
 */
export function calculateExpirationProgress(
  layingDate: Date,
  referenceDate: Date = new Date(),
): number {
  return calculateExpirationProgressFromDcrDate(
    getDcrDateFromLayingDate(layingDate),
    referenceDate,
  );
}

export function calculateExpirationProgressFromDcrDate(
  dcrDate: Date,
  referenceDate: Date = new Date(),
): number {
  const { cookThoroughlyDays } = SiteConfig.freshness;
  const daysRemaining = differenceInCalendarDays(
    normalizeCalendarDate(dcrDate),
    normalizeCalendarDate(referenceDate),
  );
  const daysOld = cookThoroughlyDays - daysRemaining;

  const progress = (daysOld / cookThoroughlyDays) * 100;
  return Math.min(100, Math.max(0, progress));
}

/**
 * Format days remaining for display
 */
export function formatDaysRemaining(daysRemaining: number): string {
  if (daysRemaining <= 0) return "Expired";
  if (daysRemaining === 1) return "1 day left";
  return `${daysRemaining} days left`;
}

/**
 * Format days remaining for display (French)
 */
export function formatDaysRemainingFr(daysRemaining: number): string {
  if (daysRemaining <= 0) return "Expiré";
  if (daysRemaining === 1) return "1 jour restant";
  return `${daysRemaining} jours restants`;
}

/**
 * Get freshness description in French
 */
export function getFreshnessDescriptionFr(status: FreshnessStatus): string {
  const descriptions: Record<FreshnessStatus, string> = {
    "extra-fresh": "Parfait pour œufs à la coque, pochés ou crus",
    fresh: "Idéal pour œufs au plat, brouillés ou pâtisserie",
    "cook-thoroughly": "Uniquement bien cuits (œufs durs)",
    expired: "Expiré - ne pas consommer",
  };
  return descriptions[status];
}

/**
 * Get cooking type display name
 */
export function getCookingTypeLabel(type: CookingType): string {
  const labels: Record<CookingType, string> = {
    SOFT_BOILED: "Soft-boiled",
    POACHED: "Poached",
    RAW: "Raw",
    FRIED: "Fried",
    SCRAMBLED: "Scrambled",
    OMELETTE: "Omelette",
    HARD_BOILED: "Hard-boiled",
    BAKING: "Baking",
    OTHER: "Other",
  };

  return labels[type];
}
