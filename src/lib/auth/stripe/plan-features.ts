/**
 * Source unique de vérité pour les features des plans
 * Utilisé par la landing page et la page billing
 */

export const PLAN_FEATURES = {
  solo: {
    fr: [
      "2 boîtes d'œufs maximum",
      "Minuteur intelligent",
      "Suivi de fraîcheur",
      "Suggestions de cuisson basiques",
      "Historique limité (30 jours)",
      "1 utilisateur",
    ],
    en: [
      "Up to 2 egg boxes",
      "Smart timer",
      "Freshness tracking",
      "Basic cooking suggestions",
      "Limited history (30 days)",
      "1 user",
    ],
  },
  brigade: {
    // Features ADDITIONNELLES au plan Solo
    fr: [
      "Boîtes d'œufs illimitées",
      "Notifications de fraîcheur",
      "Statistiques avancées",
      "Historique complet",
      "Recettes personnalisées",
      "Partage famille (jusqu'à 5 membres)",
    ],
    en: [
      "Unlimited egg boxes",
      "Freshness notifications",
      "Advanced statistics",
      "Full history",
      "Personalized recipes",
      "Family sharing (up to 5 members)",
    ],
  },
  chef: {
    // Features ADDITIONNELLES au plan Brigade
    fr: [
      "Multi-frigos (cave, garage...)",
      "Export PDF/CSV traçabilité",
      "Mode pro (lots, n° producteur)",
      "Recettes exclusives",
      "Membres illimités",
      "Support prioritaire",
      "Badge Chef visible",
    ],
    en: [
      "Multi-fridges (cellar, garage...)",
      "PDF/CSV traceability export",
      "Pro mode (batch, producer #)",
      "Exclusive recipes",
      "Unlimited members",
      "Priority support",
      "Visible Chef badge",
    ],
  },
  // Legacy aliases for backward compatibility
  free: {
    fr: [
      "2 boîtes d'œufs maximum",
      "Minuteur intelligent",
      "Suivi de fraîcheur",
      "Suggestions de cuisson basiques",
      "Historique limité (30 jours)",
      "1 utilisateur",
    ],
    en: [
      "Up to 2 egg boxes",
      "Smart timer",
      "Freshness tracking",
      "Basic cooking suggestions",
      "Limited history (30 days)",
      "1 user",
    ],
  },
  premium: {
    fr: [
      "Boîtes d'œufs illimitées",
      "Notifications de fraîcheur",
      "Statistiques avancées",
      "Historique complet",
      "Recettes personnalisées",
      "Partage famille (jusqu'à 5 membres)",
    ],
    en: [
      "Unlimited egg boxes",
      "Freshness notifications",
      "Advanced statistics",
      "Full history",
      "Personalized recipes",
      "Family sharing (up to 5 members)",
    ],
  },
} as const;

export const PRICING_COPY = {
  fr: {
    // Plan Solo
    soloTitle: "Solo",
    soloDescription: "Pour cuisiner tes œufs rien que pour toi",
    soloPrice: "0€",
    chooseSolo: "Commencer gratuitement",

    // Plan Brigade
    brigadeTitle: "Brigade",
    brigadeDescription: "Pour cuisiner à plusieurs, en équipe",
    brigadePrice: "4,99€",
    brigadePriceSuffix: "/mois",
    brigadeYearlyEquivalent: "2,50€",
    brigadeYearlyTotal: "29,99€",
    brigadeYearlySuffix: "/an",
    brigadeInheritance: "Tout ce qui est inclus dans Solo, plus :",
    chooseBrigade: "Choisir Brigade",

    // Plan Chef
    chefTitle: "Chef",
    chefDescription: "Toutes les fonctions premium, pour toujours",
    chefPrice: "29,99€",
    chefPriceSuffix: " une fois",
    chefYearlyEquivalent: "8,33€",
    chefYearlyTotal: "99,99€",
    chefYearlySuffix: "/an",
    chefInheritance: "Tout ce qui est inclus dans Solo, plus :",
    chooseChef: "Passer Chef",
    chefBadge: "À vie",

    // Common
    billedAs: "Facturé",
    recommended: "Recommandé",
    freeTrial: "7 jours d'essai gratuit",
    yearlyDiscount: "-50%",
    chefYearlyDiscount: "-44%",
    currentPlan: "Plan actuel",
    headerTitle: "Mon offre",
    headerSubtitleChef: "Chef est actif à vie sur votre compte.",
    headerSubtitleBrigade: "Vous êtes dans la Brigade !",
    headerSubtitleSolo: "Passez à un plan supérieur pour débloquer plus",
    manage: "Gérer mon abonnement historique",
    upgrading: "Redirection vers le paiement...",
    portalOpening: "Ouverture du portail de gestion...",
    upgradeCta: "Passer au niveau supérieur",
    badgeActive: "Actif",
    badgeFree: "Gratuit",
    badgePro: "Pro",
    billedYearly: "Facturé annuellement",

    // Legacy aliases
    freeTitle: "Solo",
    freeDescription: "Pour cuisiner tes œufs rien que pour toi",
    freePrice: "0€",
    premiumTitle: "Brigade",
    premiumDescription: "Pour cuisiner à plusieurs, en équipe",
    premiumPrice: "4,99€",
    premiumPriceSuffix: "/mois",
    premiumYearlyEquivalent: "2,50€",
    premiumYearlyTotal: "29,99€",
    premiumYearlySuffix: "/an",
    premiumInheritance: "Tout ce qui est inclus dans Solo, plus :",
    chooseFree: "Commencer gratuitement",
    choosePremium: "Choisir Brigade",
    headerSubtitlePremium: "Vous êtes dans la Brigade !",
    headerSubtitleFree: "Passez à un plan supérieur pour débloquer plus",
  },
  en: {
    // Plan Solo
    soloTitle: "Solo",
    soloDescription: "Cook your eggs just for yourself",
    soloPrice: "€0",
    chooseSolo: "Start for free",

    // Plan Brigade
    brigadeTitle: "Brigade",
    brigadeDescription: "Cook together, as a team",
    brigadePrice: "€4.99",
    brigadePriceSuffix: "/month",
    brigadeYearlyEquivalent: "€2.50",
    brigadeYearlyTotal: "€29.99",
    brigadeYearlySuffix: "/year",
    brigadeInheritance: "Everything in Solo, plus:",
    chooseBrigade: "Choose Brigade",

    // Plan Chef
    chefTitle: "Chef",
    chefDescription: "Every premium feature, forever",
    chefPrice: "€29.99",
    chefPriceSuffix: " one time",
    chefYearlyEquivalent: "€8.33",
    chefYearlyTotal: "€99.99",
    chefYearlySuffix: "/year",
    chefInheritance: "Everything in Solo, plus:",
    chooseChef: "Go Chef",
    chefBadge: "Lifetime",

    // Common
    billedAs: "Billed as",
    recommended: "Recommended",
    freeTrial: "7-day free trial",
    yearlyDiscount: "-50%",
    chefYearlyDiscount: "-44%",
    currentPlan: "Current plan",
    headerTitle: "My plan",
    headerSubtitleChef: "Chef is active on your account for life.",
    headerSubtitleBrigade: "You are in the Brigade!",
    headerSubtitleSolo: "Upgrade to unlock more features",
    manage: "Manage legacy subscription",
    upgrading: "Redirecting to checkout...",
    portalOpening: "Opening customer portal...",
    upgradeCta: "Upgrade now",
    badgeActive: "Active",
    badgeFree: "Free",
    badgePro: "Pro",
    billedYearly: "Billed annually",

    // Legacy aliases
    freeTitle: "Solo",
    freeDescription: "Cook your eggs just for yourself",
    freePrice: "€0",
    premiumTitle: "Brigade",
    premiumDescription: "Cook together, as a team",
    premiumPrice: "€4.99",
    premiumPriceSuffix: "/month",
    premiumYearlyEquivalent: "€2.50",
    premiumYearlyTotal: "€29.99",
    premiumYearlySuffix: "/year",
    premiumInheritance: "Everything in Solo, plus:",
    chooseFree: "Start for free",
    choosePremium: "Choose Brigade",
    headerSubtitlePremium: "You are in the Brigade!",
    headerSubtitleFree: "Upgrade to unlock more features",
  },
} as const;

export type PlanType = "solo" | "brigade" | "chef" | "free" | "premium";
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

// Helper to normalize plan type for display
export const normalizePlanTypeForDisplay = (
  plan: string | null | undefined,
): "solo" | "brigade" | "chef" => {
  if (!plan) return "solo";
  if (plan === "free" || plan === "gratuit") return "solo";
  if (plan === "premium") return "brigade";
  if (plan === "solo" || plan === "brigade" || plan === "chef") return plan;
  return "solo";
};
