export const THEMES = {
  dark: {
    id: "dark",
    label: "Chef",
    colors: {
      bg: "bg-stone-950",
      text: "text-stone-200",
      textMuted: "text-stone-400",
      card: "bg-stone-900",
      cardBorder: "border-stone-800",
      accent: "text-amber-400",
      accentBg: "bg-amber-400",
      accentSoft: "bg-amber-400/20",
      nav: "bg-stone-900",
      navBorder: "border-stone-800",
      input: "bg-stone-950",
      modalOverlay: "bg-black/60",
    },
  },
  light: {
    id: "light",
    label: "Brunch",
    colors: {
      bg: "bg-orange-50",
      text: "text-stone-800",
      textMuted: "text-stone-500",
      card: "bg-white",
      cardBorder: "border-orange-100",
      accent: "text-orange-500",
      accentBg: "bg-orange-500",
      accentSoft: "bg-orange-100",
      nav: "bg-white",
      navBorder: "border-orange-100",
      input: "bg-orange-50",
      modalOverlay: "bg-stone-900/40",
    },
  },
  eco: {
    id: "eco",
    label: "Bio",
    colors: {
      bg: "bg-emerald-50",
      text: "text-teal-900",
      textMuted: "text-teal-600",
      card: "bg-white",
      cardBorder: "border-emerald-100",
      accent: "text-emerald-600",
      accentBg: "bg-emerald-600",
      accentSoft: "bg-emerald-100",
      nav: "bg-white",
      navBorder: "border-emerald-100",
      input: "bg-emerald-50",
      modalOverlay: "bg-teal-900/40",
    },
  },
} as const;

export type ThemeId = keyof typeof THEMES;
export type Theme = (typeof THEMES)[ThemeId];

export const FRESHNESS_LEVELS = {
  EXTRA_FRESH: {
    limit: 9,
    label: "Extra Frais",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    usage: "Cru, Mollet, Poché",
    progress: "bg-emerald-500",
  },
  FRESH: {
    limit: 21,
    label: "Frais",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    usage: "Omelette, Gâteau",
    progress: "bg-amber-500",
  },
  COOK_HARD: {
    limit: 28,
    label: "Cuire à cœur",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    usage: "Oeuf Dur uniquement",
    progress: "bg-orange-500",
  },
  EXPIRED: {
    limit: 999,
    label: "Périmé",
    color: "text-stone-500",
    bg: "bg-stone-200",
    border: "border-stone-300",
    usage: "Ne pas consommer",
    progress: "bg-stone-500",
  },
};

export const getFreshness = (laidDate: string) => {
  const today = new Date();
  const laid = new Date(laidDate);
  const diffTime = Math.abs(today.getTime() - laid.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= FRESHNESS_LEVELS.EXTRA_FRESH.limit)
    return { ...FRESHNESS_LEVELS.EXTRA_FRESH, days: diffDays };
  if (diffDays <= FRESHNESS_LEVELS.FRESH.limit)
    return { ...FRESHNESS_LEVELS.FRESH, days: diffDays };
  if (diffDays <= FRESHNESS_LEVELS.COOK_HARD.limit)
    return { ...FRESHNESS_LEVELS.COOK_HARD, days: diffDays };
  return { ...FRESHNESS_LEVELS.EXPIRED, days: diffDays };
};
