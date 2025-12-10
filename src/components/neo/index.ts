/**
 * Neo-Soft-Brutalisme Design System
 *
 * A playful, tactile UI component library featuring:
 * - Hard shadows with press effects
 * - Thick borders (2-3px)
 * - Super rounded corners
 * - Amber/Stone color palette
 * - Full dark/light mode support via CSS custom properties
 */

// Base Components
export { NeoButton, type NeoButtonProps } from "./neo-button";
export {
  NeoCard,
  NeoCardHeader,
  NeoCardTitle,
  NeoCardDescription,
  NeoCardContent,
  NeoCardFooter,
  type NeoCardProps,
} from "./neo-card";
export { NeoInput, type NeoInputProps } from "./neo-input";
export { NeoToggle, type NeoToggleProps } from "./neo-toggle";
export { NeoBadge, type NeoBadgeProps } from "./neo-badge";
export { NeoModal, type NeoModalProps } from "./neo-modal";
export { NeoTitle, type NeoTitleProps } from "./neo-title";

// Form Components
export { NeoCheckbox, type NeoCheckboxProps } from "./neo-checkbox";
export {
  NeoRadio,
  NeoRadioGroup,
  type NeoRadioProps,
  type NeoRadioGroupProps,
} from "./neo-radio";
export { NeoSelect, NeoSelectItem, type NeoSelectProps } from "./neo-select";
export { NeoSlider, type NeoSliderProps } from "./neo-slider";

// Feedback Components
export { NeoAlert, type NeoAlertProps } from "./neo-alert";
export { NeoToast, NeoToastContainer, type NeoToastProps } from "./neo-toast";
export { NeoProgress, type NeoProgressProps } from "./neo-progress";
export { NeoTooltip, type NeoTooltipProps } from "./neo-tooltip";

// Layout Components
export {
  NeoTabs,
  NeoTabsList,
  NeoTabsTrigger,
  NeoTabsContent,
  type NeoTabsProps,
} from "./neo-tabs";
export {
  NeoAccordion,
  NeoAccordionItem,
  NeoAccordionTrigger,
  NeoAccordionContent,
  type NeoAccordionProps,
} from "./neo-accordion";
export { NeoDivider, type NeoDividerProps } from "./neo-divider";
export { NeoAvatar, type NeoAvatarProps } from "./neo-avatar";
export { NeoSkeleton, type NeoSkeletonProps } from "./neo-skeleton";
