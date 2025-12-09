/**
 * Source unique de vérité pour les features des plans
 * Utilisé par la landing page et la page billing
 */

export const PLAN_FEATURES = {
  free: {
    fr: [
      "2 boîtes d'œufs maximum",
      "Minuteur intelligent",
      "Suivi de fraîcheur",
      "Suggestions de cuisson basiques",
      "Historique limité (30 jours)",
    ],
    en: [
      "Up to 2 egg boxes",
      "Smart timer",
      "Freshness tracking",
      "Basic cooking suggestions",
      "Limited history (30 days)",
    ],
  },
  premium: {
    // Features ADDITIONNELLES au plan gratuit
    fr: [
      "Boîtes d'œufs illimitées",
      "Notifications de fraîcheur",
      "Statistiques avancées",
      "Historique complet",
      "Recettes personnalisées",
      "Partage famille illimité",
    ],
    en: [
      "Unlimited egg boxes",
      "Freshness notifications",
      "Advanced statistics",
      "Full history",
      "Personalized recipes",
      "Unlimited family sharing",
    ],
  },
} as const;

export const PRICING_COPY = {
  fr: {
    freeTitle: "Gratuit",
    freeDescription: "Pour découvrir l'application",
    freePrice: "0€",
    premiumTitle: "Premium",
    premiumDescription: "Pour les familles organisées",
    // Prix mensuel
    premiumPrice: "4,99€",
    premiumPriceSuffix: "/mois",
    // Prix annuel (équivalent mensuel = 29.99/12 = 2.50€)
    premiumYearlyEquivalent: "2,50€",
    premiumYearlyTotal: "29,99€",
    premiumYearlySuffix: "/an",
    billedAs: "Facturé",
    premiumInheritance: "Tout ce qui est inclus dans Gratuit, plus :",
    recommended: "Recommandé",
    freeTrial: "7 jours d'essai gratuit",
    yearlyDiscount: "-50%",
    chooseFree: "Commencer gratuitement",
    choosePremium: "Choisir Premium",
    currentPlan: "Plan actuel",
    headerTitle: "Abonnement",
    headerSubtitlePremium: "Vous êtes un membre Premium !",
    headerSubtitleFree:
      "Passez Premium pour débloquer toutes les fonctionnalités",
    manage: "Gérer mon abonnement",
    upgrading: "Redirection vers le paiement...",
    portalOpening: "Ouverture du portail de gestion...",
    upgradeCta: "Passer Premium",
    badgeActive: "Actif",
    badgeFree: "Gratuit",
    billedYearly: "Facturé annuellement",
  },
  en: {
    freeTitle: "Free",
    freeDescription: "To discover the app",
    freePrice: "€0",
    premiumTitle: "Premium",
    premiumDescription: "For organized families",
    // Monthly price
    premiumPrice: "€4.99",
    premiumPriceSuffix: "/month",
    // Yearly price (monthly equivalent = 29.99/12 = 2.50€)
    premiumYearlyEquivalent: "€2.50",
    premiumYearlyTotal: "€29.99",
    premiumYearlySuffix: "/year",
    billedAs: "Billed as",
    premiumInheritance: "Everything in Free, plus:",
    recommended: "Recommended",
    freeTrial: "7-day free trial",
    yearlyDiscount: "-50%",
    chooseFree: "Start for free",
    choosePremium: "Choose Premium",
    currentPlan: "Current plan",
    headerTitle: "Subscription",
    headerSubtitlePremium: "You are a Premium member!",
    headerSubtitleFree: "Upgrade to unlock all features",
    manage: "Manage subscription",
    upgrading: "Redirecting to checkout...",
    portalOpening: "Opening customer portal...",
    upgradeCta: "Go Premium",
    badgeActive: "Active",
    badgeFree: "Free",
    billedYearly: "Billed annually",
  },
} as const;

export type PlanType = "free" | "premium";
export type Locale = "fr" | "en";

export const getPlanFeatures = (
  plan: PlanType,
  locale: Locale,
): readonly string[] => {
  return PLAN_FEATURES[plan][locale];
};

export const getPricingCopy = (locale: Locale) => {
  return PRICING_COPY[locale];
};
