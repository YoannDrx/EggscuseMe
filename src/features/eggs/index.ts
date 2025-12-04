// Actions - re-export from fridge
export {
  createEggBoxAction,
  updateEggBoxAction,
  deleteEggBoxAction,
  consumeEggsAction,
  getFridgeStatsAction as getEggStatsAction,
} from "@/features/fridge/fridge.action";

// Schemas - re-export from fridge
export {
  CreateEggBoxSchema,
  UpdateEggBoxSchema,
  DeleteEggBoxSchema,
  ConsumeEggsSchema,
  EggSizeSchema,
  CookingTypeSchema,
  type CreateEggBoxInput,
  type UpdateEggBoxInput,
  type ConsumeEggsInput,
} from "@/features/fridge/fridge.schema";

// Lib
export {
  calculateFreshness,
  calculateExpirationProgress,
  formatDaysRemaining,
  formatDaysRemainingFr,
  getFreshnessColorClass,
  getFreshnessBgClass,
  getFreshnessDescriptionFr,
  getCookingTypeLabel,
  type FreshnessStatus,
  type FreshnessInfo,
} from "./lib/freshness-calculator";

// Components
export { FreshnessBadge } from "./components/freshness-badge";
export { EggBoxCard } from "./components/egg-box-card";
export { EggSlot } from "./components/egg-slot";
export { EggBoxVisual } from "./components/egg-box-visual";
