import type { UserSubscription } from "@/generated/prisma";
import { logger } from "@/lib/logger";
import { SiteConfig } from "@/site-config";

// Plan names and aliases for backward compatibility
export const PLAN_ALIASES: Record<string, string> = {
  gratuit: "solo",
  free: "solo",
  premium: "brigade",
};

export type PlanName = "solo" | "brigade" | "chef";

// Normalize plan name (handle legacy names)
export function normalizePlanName(plan: string | null | undefined): PlanName {
  if (!plan) return "solo";
  const normalized = PLAN_ALIASES[plan] ?? plan;
  if (
    normalized === "solo" ||
    normalized === "brigade" ||
    normalized === "chef"
  ) {
    return normalized;
  }
  return "solo";
}

const DEFAULT_LIMIT = {
  eggBoxes: SiteConfig.plans.solo.maxEggBoxes,
  notifications: 0,
  advancedStats: 0,
  unlimitedHistory: 0,
  maxFridges: SiteConfig.plans.solo.maxFridges,
  maxMembers: SiteConfig.plans.solo.maxMembers,
  exportPdf: 0,
  proMode: 0,
  exclusiveRecipes: 0,
  prioritySupport: 0,
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
  billingKind?: "free" | "subscription" | "one_time";
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
  // Plan Solo (gratuit)
  {
    name: "solo",
    billingKind: "free",
    description: "Pour cuisiner tes œufs rien que pour toi",
    limits: DEFAULT_LIMIT,
    price: 0,
    currency: "EUR",
    yearlyPrice: 0,
  },
  // Plan Brigade (ex-Premium)
  {
    name: "brigade",
    billingKind: "subscription",
    isHidden: true,
    isPopular: true,
    description: "Pour cuisiner à plusieurs, en équipe",
    priceId:
      process.env.STRIPE_BRIGADE_PLAN_ID ??
      process.env.STRIPE_PREMIUM_PLAN_ID ??
      "",
    annualDiscountPriceId:
      process.env.STRIPE_BRIGADE_YEARLY_PLAN_ID ??
      process.env.STRIPE_PREMIUM_YEARLY_PLAN_ID ??
      "",
    limits: {
      eggBoxes: SiteConfig.plans.brigade.maxEggBoxes,
      notifications: 1,
      advancedStats: 1,
      unlimitedHistory: 1,
      maxFridges: SiteConfig.plans.brigade.maxFridges,
      maxMembers: SiteConfig.plans.brigade.maxMembers,
      exportPdf: 0,
      proMode: 0,
      exclusiveRecipes: 0,
      prioritySupport: 0,
    },
    freeTrial: {
      days: 7,
      onTrialStart: async (subscription) => {
        logger.debug(`Essai Brigade démarré pour ${subscription.userId}`);
      },
      onTrialExpired: async (subscription) => {
        logger.debug(`Essai Brigade expiré pour ${subscription.userId}`);
      },
      onTrialEnd: async ({ subscription }) => {
        logger.debug(`Essai Brigade terminé pour ${subscription.userId}`);
      },
    },
    price: 4.99,
    yearlyPrice: 29.99,
    currency: "EUR",
  },
  // Plan Chef (Pro)
  {
    name: "chef",
    billingKind: "one_time",
    description: "Toutes les fonctions premium, pour toujours",
    priceId: process.env.STRIPE_CHEF_PLAN_ID ?? "",
    limits: {
      eggBoxes: SiteConfig.plans.chef.maxEggBoxes,
      notifications: 1,
      advancedStats: 1,
      unlimitedHistory: 1,
      maxFridges: SiteConfig.plans.chef.maxFridges,
      maxMembers: SiteConfig.plans.chef.maxMembers,
      exportPdf: 1,
      proMode: 1,
      exclusiveRecipes: 1,
      prioritySupport: 1,
    },
    price: 29.99,
    currency: "EUR",
  },
];

export const getPlanLimits = (
  plan: string | null | undefined = "solo",
  overrideLimits?: OverrideLimits | null,
): PlanLimit => {
  const normalizedPlan = normalizePlanName(plan);
  const planLimits = AUTH_PLANS.find((p) => p.name === normalizedPlan)?.limits;

  const baseLimits = planLimits ?? DEFAULT_LIMIT;

  if (!overrideLimits) {
    return baseLimits;
  }

  return {
    ...baseLimits,
    ...overrideLimits,
  };
};

// Helper pour vérifier si un utilisateur a un plan payant (Brigade ou Chef)
export const hasPaidAccess = (planName: string | null | undefined): boolean => {
  const normalized = normalizePlanName(planName);
  return normalized === "brigade" || normalized === "chef";
};

// Helper pour vérifier si un utilisateur a le plan Chef
export const hasChefAccess = (planName: string | null | undefined): boolean => {
  const normalized = normalizePlanName(planName);
  return normalized === "chef";
};

// Helper pour vérifier la limite de boîtes
export const canAddEggBox = (
  currentCount: number,
  planName: string | null | undefined,
): boolean => {
  if (hasPaidAccess(planName)) return true;
  return currentCount < DEFAULT_LIMIT.eggBoxes;
};

// Helper pour vérifier la limite de frigos
export const canAddFridge = (
  currentCount: number,
  planName: string | null | undefined,
): boolean => {
  const limits = getPlanLimits(planName);
  return currentCount < limits.maxFridges;
};

// Helper pour vérifier accès à une feature
export const hasFeatureAccess = (
  planName: string | null | undefined,
  feature: keyof PlanLimit,
): boolean => {
  const limits = getPlanLimits(planName);
  return limits[feature] > 0;
};
