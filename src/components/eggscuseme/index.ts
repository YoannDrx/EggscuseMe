// Theme System
export { EggThemeProvider, useEggTheme, useThemeColors } from "./theme";
export type { ThemeId, Theme, ThemeColors } from "./theme";

// Navigation
export { MobileShell, BottomNavBar, NavItem, type TabId } from "./navigation";

// Shared Components
export { BottomSheet, FloatingActionButton, PageHeader } from "./shared";

// Views
export {
  FridgeView,
  type EggBox,
  TimerView,
  ProgressRing,
  CookingSelector,
  getCookingTime,
  type CookingType,
  GuideView,
  StatsView,
  NumberCounter,
} from "./views";

// Motion Components
export {
  ConfettiBurst,
  useConfetti,
  SpringButton,
  SwipeAction,
  StaggerList,
  staggerItemVariants,
} from "./motion";

// Illustrations
export {
  HeroScene,
  FreshnessTimeline,
  CookingScene,
  SavingsScene,
} from "./illustrations";
