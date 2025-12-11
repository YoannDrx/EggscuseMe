import type { UserSubscription } from "@/generated/prisma";
import { defaultLocale, type Locale } from "@/i18n/config";
import { SiteConfig } from "@/site-config";
import { getActiveUserSubscription } from "../fridge/get-user-subscription";
import { prisma } from "../prisma";
import { normalizePlanName, type PlanName } from "../auth/stripe/auth-plans";

/**
 * Premium status result
 */
export type PremiumStatus = {
  isPremium: boolean;
  isChef: boolean;
  plan: PlanName;
  status: string | null;
  canCreateEggBox: boolean;
  canCreateFridge: boolean;
  currentBoxCount: number;
  currentFridgeCount: number;
  maxBoxes: number;
  maxFridges: number;
  subscription: UserSubscription | null;
};

const VALID_STATUSES = ["active", "trialing", "past_due"];

/**
 * Check if a subscription is paid (Brigade or Chef, not Solo)
 */
export function isPaidSubscription(
  subscription: UserSubscription | null,
): boolean {
  if (!subscription) return false;

  const plan = normalizePlanName(subscription.plan);
  if (plan === "solo") return false;

  return (
    subscription.status !== null && VALID_STATUSES.includes(subscription.status)
  );
}

// Alias for backward compatibility
export const isPremiumSubscription = isPaidSubscription;

/**
 * Check if a subscription is Chef plan
 */
export function isChefSubscription(
  subscription: UserSubscription | null,
): boolean {
  if (!subscription) return false;

  const plan = normalizePlanName(subscription.plan);
  if (plan !== "chef") return false;

  return (
    subscription.status !== null && VALID_STATUSES.includes(subscription.status)
  );
}

/**
 * Get full premium status for a user
 * Includes all info needed for UI and business logic decisions
 */
export async function getUserPremiumStatus(
  userId: string,
  fridgeId?: string,
): Promise<PremiumStatus> {
  const subscription = await getActiveUserSubscription(userId);
  const plan = normalizePlanName(subscription?.plan);
  const isPremium = isPaidSubscription(subscription);
  const isChef = isChefSubscription(subscription);

  // Get plan limits from config
  const planConfig = SiteConfig.plans[plan];

  // Get current box count if fridgeId provided, otherwise get from user's fridge
  let currentBoxCount = 0;
  let currentFridgeCount = 1; // Default to 1 (user always has at least one fridge)

  if (fridgeId) {
    currentBoxCount = await prisma.eggBox.count({
      where: { fridgeId },
    });
  } else {
    // Get default fridge for user
    const fridge = await prisma.fridge.findFirst({
      where: { ownerId: userId, isDefault: true },
      select: { _count: { select: { eggBoxes: true } } },
    });
    currentBoxCount = fridge?._count.eggBoxes ?? 0;
  }

  // Count user's fridges (for multi-fridge feature)
  currentFridgeCount = await prisma.fridge.count({
    where: { ownerId: userId },
  });

  const maxBoxes = planConfig.maxEggBoxes;
  const maxFridges = planConfig.maxFridges;
  const canCreateEggBox = currentBoxCount < maxBoxes;
  const canCreateFridge = currentFridgeCount < maxFridges;

  return {
    isPremium,
    isChef,
    plan,
    status: subscription?.status ?? null,
    canCreateEggBox,
    canCreateFridge,
    currentBoxCount,
    currentFridgeCount,
    maxBoxes,
    maxFridges,
    subscription,
  };
}

/**
 * Simple premium check - returns true/false
 * Use getUserPremiumStatus for more detailed info
 */
export async function checkIsPremium(userId: string): Promise<boolean> {
  const subscription = await getActiveUserSubscription(userId);
  return isPaidSubscription(subscription);
}

/**
 * Simple Chef check - returns true/false
 */
export async function checkIsChef(userId: string): Promise<boolean> {
  const subscription = await getActiveUserSubscription(userId);
  return isChefSubscription(subscription);
}

const upgradeMessages: Record<
  Locale,
  {
    brigadeRequired: (feature: string) => string;
    chefRequired: (feature: string) => string;
    eggLimit: (limit: number) => string;
    fridgeLimit: (limit: number) => string;
  }
> = {
  fr: {
    brigadeRequired: (feature) =>
      `Cette fonctionnalité (${feature}) nécessite le plan Brigade. Passez à Brigade pour en profiter !`,
    chefRequired: (feature) =>
      `Cette fonctionnalité (${feature}) nécessite le plan Chef. Passez Chef pour en profiter !`,
    eggLimit: (limit) =>
      `Le plan Solo est limité à ${limit} boîtes d'œufs. Passez Brigade pour des boîtes illimitées !`,
    fridgeLimit: (limit) =>
      `Votre plan est limité à ${limit} frigo(s). Passez Chef pour des frigos illimités !`,
  },
  en: {
    brigadeRequired: (feature) =>
      `This feature (${feature}) requires the Brigade plan. Upgrade to Brigade to use it!`,
    chefRequired: (feature) =>
      `This feature (${feature}) requires the Chef plan. Go Chef to use it!`,
    eggLimit: (limit) =>
      `The Solo plan is limited to ${limit} egg boxes. Upgrade to Brigade for unlimited boxes!`,
    fridgeLimit: (limit) =>
      `Your plan is limited to ${limit} fridge(s). Go Chef for unlimited fridges!`,
  },
};

// Legacy alias (kept for reference)
const _premiumMessages = upgradeMessages;

/**
 * Get error message for Brigade feature access
 */
export function getBrigadeRequiredMessage(
  feature: string,
  locale: Locale = defaultLocale,
): string {
  const copy =
    locale in upgradeMessages ? upgradeMessages[locale] : upgradeMessages.en;
  return copy.brigadeRequired(feature);
}

// Legacy alias
export const getPremiumRequiredMessage = getBrigadeRequiredMessage;

/**
 * Get error message for Chef feature access
 */
export function getChefRequiredMessage(
  feature: string,
  locale: Locale = defaultLocale,
): string {
  const copy =
    locale in upgradeMessages ? upgradeMessages[locale] : upgradeMessages.en;
  return copy.chefRequired(feature);
}

/**
 * Get error message for egg box limit reached
 */
export function getEggBoxLimitMessage(locale: Locale = defaultLocale): string {
  const copy =
    locale in upgradeMessages ? upgradeMessages[locale] : upgradeMessages.en;
  return copy.eggLimit(SiteConfig.plans.solo.maxEggBoxes);
}

/**
 * Get error message for fridge limit reached
 */
export function getFridgeLimitMessage(locale: Locale = defaultLocale): string {
  const copy =
    locale in upgradeMessages ? upgradeMessages[locale] : upgradeMessages.en;
  return copy.fridgeLimit(SiteConfig.plans.brigade.maxFridges);
}
