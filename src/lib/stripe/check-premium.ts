import type { UserSubscription } from "@/generated/prisma";
import { defaultLocale, type Locale } from "@/i18n/config";
import { SiteConfig } from "@/site-config";
import { getActiveUserSubscription } from "../fridge/get-user-subscription";
import { prisma } from "../prisma";

/**
 * Premium status result
 */
export type PremiumStatus = {
  isPremium: boolean;
  plan: string;
  status: string | null;
  canCreateEggBox: boolean;
  currentBoxCount: number;
  maxBoxes: number;
  subscription: UserSubscription | null;
};

/**
 * Check if a subscription is premium (not free and active)
 */
export function isPremiumSubscription(
  subscription: UserSubscription | null,
): boolean {
  if (!subscription) return false;
  if (subscription.plan === "free") return false;

  // Check for valid status
  const validStatuses = ["active", "trialing", "past_due"];
  return (
    subscription.status !== null && validStatuses.includes(subscription.status)
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
  const isPremium = isPremiumSubscription(subscription);

  // Get current box count if fridgeId provided, otherwise get from user's fridge
  let currentBoxCount = 0;
  if (fridgeId) {
    currentBoxCount = await prisma.eggBox.count({
      where: { fridgeId },
    });
  } else {
    const fridge = await prisma.fridge.findUnique({
      where: { ownerId: userId },
      select: { _count: { select: { eggBoxes: true } } },
    });
    currentBoxCount = fridge?._count.eggBoxes ?? 0;
  }

  const maxBoxes = isPremium ? Infinity : SiteConfig.freePlan.maxEggBoxes;
  const canCreateEggBox = currentBoxCount < maxBoxes;

  return {
    isPremium,
    plan: subscription?.plan ?? "free",
    status: subscription?.status ?? null,
    canCreateEggBox,
    currentBoxCount,
    maxBoxes,
    subscription,
  };
}

/**
 * Simple premium check - returns true/false
 * Use getUserPremiumStatus for more detailed info
 */
export async function checkIsPremium(userId: string): Promise<boolean> {
  const subscription = await getActiveUserSubscription(userId);
  return isPremiumSubscription(subscription);
}

const premiumMessages: Record<
  Locale,
  {
    premiumRequired: (feature: string) => string;
    eggLimit: (limit: number) => string;
  }
> = {
  fr: {
    premiumRequired: (feature) =>
      `Cette fonctionnalité (${feature}) nécessite un abonnement Premium. Passez à Premium pour en profiter !`,
    eggLimit: (limit) =>
      `Le plan gratuit est limité à ${limit} boîtes d'oeufs. Passez Premium pour des boîtes illimitées !`,
  },
  en: {
    premiumRequired: (feature) =>
      `This feature (${feature}) requires a Premium subscription. Upgrade to Premium to use it!`,
    eggLimit: (limit) =>
      `The free plan is limited to ${limit} egg boxes. Upgrade to Premium for unlimited boxes!`,
  },
};

/**
 * Get error message for premium feature access
 */
export function getPremiumRequiredMessage(
  feature: string,
  locale: Locale = defaultLocale,
): string {
  const copy =
    locale in premiumMessages ? premiumMessages[locale] : premiumMessages.en;
  return copy.premiumRequired(feature);
}

/**
 * Get error message for egg box limit reached
 */
export function getEggBoxLimitMessage(locale: Locale = defaultLocale): string {
  const copy =
    locale in premiumMessages ? premiumMessages[locale] : premiumMessages.en;
  return copy.eggLimit(SiteConfig.freePlan.maxEggBoxes);
}
