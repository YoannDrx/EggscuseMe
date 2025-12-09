import type { UserSubscription } from "@/generated/prisma";
import { logger } from "@/lib/logger";
import { SiteConfig } from "@/site-config";

const DEFAULT_LIMIT = {
  eggBoxes: SiteConfig.freePlan.maxEggBoxes, // 2 boîtes max en gratuit
  notifications: 0, // Pas de notifications en gratuit
  advancedStats: 0, // Pas de stats avancées en gratuit
  unlimitedHistory: 0, // Historique limité en gratuit
};

export type PlanLimit = typeof DEFAULT_LIMIT;

export type OverrideLimits = Partial<PlanLimit>;

type HookCtx = {
  req: Request;
  userId: string;
  stripeCustomerId: string;
  subscriptionId: string;
};

export type AppAuthPlan = {
  priceId?: string | undefined;
  lookupKey?: string | undefined;
  annualDiscountPriceId?: string | undefined;
  annualDiscountLookupKey?: string | undefined;
  name: string;
  limits?: Record<string, number> | undefined;
  group?: string;
  freeTrial?: {
    days: number;
    onTrialStart?: (
      subscription: UserSubscription,
      ctx: HookCtx,
    ) => Promise<void>;
    onTrialEnd?: (
      data: {
        subscription: UserSubscription;
      },
      ctx: HookCtx,
    ) => Promise<void>;
    onTrialExpired?: (
      subscription: UserSubscription,
      ctx: HookCtx,
    ) => Promise<void>;
  };
  onUserSubscriptionCanceled?: (
    subscription: UserSubscription,
    ctx: HookCtx,
  ) => Promise<void>;
} & {
  description: string;
  isPopular?: boolean;
  price: number;
  yearlyPrice?: number;
  currency: string;
  isHidden?: boolean;
  limits: PlanLimit;
};

export const AUTH_PLANS: AppAuthPlan[] = [
  {
    name: "gratuit",
    description: "Parfait pour commencer à suivre vos oeufs",
    limits: DEFAULT_LIMIT,
    price: 0,
    currency: "EUR",
    yearlyPrice: 0,
  },
  {
    name: "premium",
    isPopular: true,
    description: "Pour les familles qui veulent zéro gaspillage",
    priceId: process.env.STRIPE_PREMIUM_PLAN_ID ?? "",
    annualDiscountPriceId: process.env.STRIPE_PREMIUM_YEARLY_PLAN_ID ?? "",
    limits: {
      eggBoxes: 999, // Illimité
      notifications: 1, // Notifications activées
      advancedStats: 1, // Stats avancées activées
      unlimitedHistory: 1, // Historique illimité
    },
    freeTrial: {
      days: 7,
      onTrialStart: async (subscription) => {
        logger.debug(`Essai Premium démarré pour ${subscription.userId}`);
      },
      onTrialExpired: async (subscription) => {
        logger.debug(`Essai Premium expiré pour ${subscription.userId}`);
      },
      onTrialEnd: async ({ subscription }) => {
        logger.debug(`Essai Premium terminé pour ${subscription.userId}`);
      },
    },
    price: 4.99,
    yearlyPrice: 29.99, // ~50% de réduction (6 mois gratuits)
    currency: "EUR",
  },
];

export const getPlanLimits = (
  plan = "gratuit",
  overrideLimits?: OverrideLimits | null,
): PlanLimit => {
  const planLimits = AUTH_PLANS.find((p) => p.name === plan)?.limits;

  const baseLimits = planLimits ?? DEFAULT_LIMIT;

  if (!overrideLimits) {
    return baseLimits;
  }

  return {
    ...baseLimits,
    ...overrideLimits,
  };
};

// Helper pour vérifier si un utilisateur a accès à une feature premium
export const hasPremiumAccess = (
  planName: string | null | undefined,
): boolean => {
  return planName === "premium";
};

// Helper pour vérifier la limite de boîtes
export const canAddEggBox = (
  currentCount: number,
  planName: string | null | undefined,
): boolean => {
  if (hasPremiumAccess(planName)) return true;
  return currentCount < DEFAULT_LIMIT.eggBoxes;
};
