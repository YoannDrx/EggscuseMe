// Main exports
export { DemoPhoneContent } from "./demo-phone-content";
export { DemoPhoneContainer } from "./demo-phone-container";

// Types
export type {
  DemoEggBox,
  DemoRecipe,
  DemoStats,
  DemoTab,
  CookingOption,
} from "./demo-types";

// Data (for testing/customization)
export {
  DEMO_EGG_BOXES,
  DEMO_RECIPES,
  DEMO_STATS,
  COOKING_OPTIONS,
  TAB_CONFIG,
} from "./demo-data";

// Hooks
export { useDemoState, type DemoState } from "./hooks/use-demo-state";

// Components (for individual use if needed)
export { DemoStatusBar } from "./components/demo-status-bar";
export { DemoHeader } from "./components/demo-header";
export { DemoBottomNav } from "./components/demo-bottom-nav";
export { DemoQuickActions } from "./components/demo-quick-actions";
export { DemoEggBoxCard } from "./components/demo-egg-box-card";
export { DemoFridgeView } from "./components/demo-fridge-view";
export { DemoTimerView } from "./components/demo-timer-view";
export { DemoRecipeCard } from "./components/demo-recipe-card";
export { DemoRecipesView } from "./components/demo-recipes-view";
export { DemoStatsView } from "./components/demo-stats-view";
