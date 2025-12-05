/**
 * EggscuseMe Multi-Theme System
 * 3 themes: Chef (Dark), Brunch (Light Pastel), Bio (Eco Green)
 */

export type ThemeId = "chef" | "brunch" | "bio";

export type ThemeColors = {
  // Base
  bg: string;
  bgSecondary: string;
  text: string;
  textMuted: string;

  // Cards & Surfaces
  card: string;
  cardBorder: string;
  cardHover: string;

  // Accent
  accent: string;
  accentBg: string;
  accentSoft: string;
  accentForeground: string;
  accentStroke: string;

  // Navigation
  nav: string;
  navBorder: string;
  navActive: string;

  // Inputs
  input: string;
  inputBorder: string;
  inputFocus: string;

  // Modal
  modalOverlay: string;
  modalBg: string;

  // Status (using CSS variables for freshness colors)
  statusSuccess: string;
  statusWarning: string;
  statusDanger: string;
};

export type Theme = {
  id: ThemeId;
  name: string;
  description: string;
  isDark: boolean;
  colors: ThemeColors;
};

export const themes: Record<ThemeId, Theme> = {
  chef: {
    id: "chef",
    name: "Chef",
    description: "Mode sombre professionnel",
    isDark: true,
    colors: {
      // Base - Warm dark tones
      bg: "bg-stone-950",
      bgSecondary: "bg-stone-900",
      text: "text-stone-100",
      textMuted: "text-stone-400",

      // Cards
      card: "bg-stone-900",
      cardBorder: "border-stone-800",
      cardHover: "hover:bg-stone-800/50",

      // Accent - Egg yolk yellow
      accent: "text-amber-400",
      accentBg: "bg-amber-400",
      accentSoft: "bg-amber-400/20",
      accentForeground: "text-stone-950",
      accentStroke: "stroke-amber-400",

      // Navigation
      nav: "bg-stone-900/95",
      navBorder: "border-stone-800",
      navActive: "text-amber-400",

      // Inputs
      input: "bg-stone-950",
      inputBorder: "border-stone-700",
      inputFocus: "focus:border-amber-400",

      // Modal
      modalOverlay: "bg-black/60",
      modalBg: "bg-stone-900",

      // Status
      statusSuccess: "text-emerald-400",
      statusWarning: "text-amber-400",
      statusDanger: "text-red-400",
    },
  },

  brunch: {
    id: "brunch",
    name: "Brunch",
    description: "Mode clair chaleureux",
    isDark: false,
    colors: {
      // Base - Warm cream tones
      bg: "bg-orange-50",
      bgSecondary: "bg-orange-100/50",
      text: "text-stone-800",
      textMuted: "text-stone-500",

      // Cards
      card: "bg-white",
      cardBorder: "border-orange-200",
      cardHover: "hover:bg-orange-50",

      // Accent - Warm orange
      accent: "text-orange-500",
      accentBg: "bg-orange-500",
      accentSoft: "bg-orange-100",
      accentForeground: "text-white",
      accentStroke: "stroke-orange-500",

      // Navigation
      nav: "bg-white/95",
      navBorder: "border-orange-200",
      navActive: "text-orange-500",

      // Inputs
      input: "bg-orange-50",
      inputBorder: "border-orange-200",
      inputFocus: "focus:border-orange-500",

      // Modal
      modalOverlay: "bg-stone-900/40",
      modalBg: "bg-white",

      // Status
      statusSuccess: "text-emerald-600",
      statusWarning: "text-amber-600",
      statusDanger: "text-red-600",
    },
  },

  bio: {
    id: "bio",
    name: "Bio",
    description: "Mode nature & eco",
    isDark: false,
    colors: {
      // Base - Fresh green tones
      bg: "bg-emerald-50",
      bgSecondary: "bg-emerald-100/50",
      text: "text-teal-900",
      textMuted: "text-teal-600",

      // Cards
      card: "bg-white",
      cardBorder: "border-emerald-200",
      cardHover: "hover:bg-emerald-50",

      // Accent - Natural green
      accent: "text-emerald-600",
      accentBg: "bg-emerald-600",
      accentSoft: "bg-emerald-100",
      accentForeground: "text-white",
      accentStroke: "stroke-emerald-600",

      // Navigation
      nav: "bg-white/95",
      navBorder: "border-emerald-200",
      navActive: "text-emerald-600",

      // Inputs
      input: "bg-emerald-50",
      inputBorder: "border-emerald-200",
      inputFocus: "focus:border-emerald-600",

      // Modal
      modalOverlay: "bg-teal-900/40",
      modalBg: "bg-white",

      // Status
      statusSuccess: "text-emerald-600",
      statusWarning: "text-amber-600",
      statusDanger: "text-red-600",
    },
  },
};

export const themeList = Object.values(themes);

export const defaultTheme: ThemeId = "chef";

/**
 * Get theme by ID with fallback to default
 */
export function getTheme(id: string): Theme {
  if (id in themes) {
    return themes[id as ThemeId];
  }
  return themes[defaultTheme];
}

/**
 * Get next theme in cycle order
 */
export function getNextTheme(currentId: ThemeId): ThemeId {
  const ids: ThemeId[] = ["chef", "brunch", "bio"];
  const currentIndex = ids.indexOf(currentId);
  const nextIndex = (currentIndex + 1) % ids.length;
  return ids[nextIndex];
}
