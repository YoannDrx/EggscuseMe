import type { UserSubscription } from "@/generated/prisma";
import { logger } from "@/lib/logger";
import { SiteConfig } from "@/site-config";
import {
  Bell,
  ChartLine,
  Egg,
  History,
  Infinity as InfinityIcon,
  Share2,
  Sparkles,
  Users,
} from "lucide-react";

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
    price: 2.99,
    yearlyPrice: 29.99, // ~2 mois gratuits
    currency: "EUR",
  },
];

// Limits transformation object
export const LIMITS_CONFIG: Record<
  keyof PlanLimit,
  {
    icon: React.ElementType;
    getLabel: (value: number) => string;
    description: string;
  }
> = {
  eggBoxes: {
    icon: Egg,
    getLabel: (value: number) =>
      value >= 999
        ? "Boîtes d'oeufs illimitées"
        : `${value} boîte${value > 1 ? "s" : ""} d'oeufs`,
    description: "Nombre de boîtes à suivre",
  },
  notifications: {
    icon: Bell,
    getLabel: (value: number) =>
      value > 0 ? "Alertes d'expiration" : "Alertes d'expiration",
    description: "Notifications avant péremption",
  },
  advancedStats: {
    icon: ChartLine,
    getLabel: (value: number) =>
      value > 0 ? "Statistiques avancées" : "Statistiques de base",
    description: "Graphiques et analyses détaillées",
  },
  unlimitedHistory: {
    icon: History,
    getLabel: (value: number) =>
      value > 0 ? "Historique complet" : "Historique limité (30 jours)",
    description: "Historique de consommation",
  },
};

// Additional features by plan
export const ADDITIONAL_FEATURES = {
  gratuit: [
    {
      icon: Egg,
      label: "Suivi de fraîcheur",
      description: "Indicateurs couleur pour chaque boîte",
    },
    {
      icon: Share2,
      label: "Partage limité",
      description: "Invitez 1 personne à votre frigo",
    },
  ],
  premium: [
    {
      icon: InfinityIcon,
      label: "Boîtes illimitées",
      description: "Suivez autant de boîtes que vous voulez",
    },
    {
      icon: Bell,
      label: "Alertes intelligentes",
      description: "Notifications avant expiration",
    },
    {
      icon: ChartLine,
      label: "Dashboard avancé",
      description: "Graphiques et export de données",
    },
    {
      icon: Users,
      label: "Partage famille",
      description: "Invitez toute la famille",
    },
    {
      icon: Sparkles,
      label: "Recettes personnalisées",
      description: "Suggestions basées sur vos oeufs",
    },
  ],
};

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

export const getPlanFeatures = (plan: AppAuthPlan): string[] => {
  const features: string[] = [
    ...Object.entries(plan.limits)
      .filter(([key]) => key in LIMITS_CONFIG)
      .map(([key, value]) => {
        const limitConfig = LIMITS_CONFIG[key as keyof typeof LIMITS_CONFIG];
        return limitConfig.getLabel(value as number);
      }),
    ...ADDITIONAL_FEATURES[plan.name as keyof typeof ADDITIONAL_FEATURES].map(
      (f) => f.label,
    ),
  ];
  return features;
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
