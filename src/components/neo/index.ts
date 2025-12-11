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
export {
  NeoButton,
  neoButtonVariants,
  type NeoButtonProps,
} from "./neo-button";
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

// Table Components
export {
  NeoTable,
  NeoTableHeader,
  NeoTableBody,
  NeoTableFooter,
  NeoTableRow,
  NeoTableHead,
  NeoTableCell,
  NeoTableCaption,
  type NeoTableProps,
} from "./neo-table";

// Dropdown Components
export {
  NeoDropdown,
  NeoDropdownTrigger,
  NeoDropdownContent,
  NeoDropdownItem,
  NeoDropdownCheckboxItem,
  NeoDropdownSeparator,
  NeoDropdownLabel,
  NeoDropdownSub,
  type NeoDropdownProps,
  type NeoDropdownContentProps,
  type NeoDropdownItemProps,
} from "./neo-dropdown";

// Sheet Components
export {
  NeoSheet,
  NeoSheetTrigger,
  NeoSheetContent,
  NeoSheetFooter,
  type NeoSheetProps,
} from "./neo-sheet";

// Navigation Components
export {
  NeoBottomNav,
  NeoBottomNavSpacer,
  type NeoBottomNavProps,
  type NeoBottomNavItem,
} from "./neo-bottom-nav";

// Sidebar Components
export {
  NeoSidebarProvider,
  NeoSidebar,
  NeoSidebarHeader,
  NeoSidebarContent,
  NeoSidebarFooter,
  NeoSidebarGroup,
  NeoSidebarItem,
  NeoSidebarToggle,
  NeoSidebarTrigger,
  NeoSidebarInset,
  useSidebarContext,
  type NeoSidebarProps,
  type NeoSidebarProviderProps,
  type NeoSidebarGroupProps,
  type NeoSidebarItemProps,
} from "./neo-sidebar";

// Additional Form Components
export { NeoTextarea, type NeoTextareaProps } from "./neo-textarea";
export { NeoSwitch, type NeoSwitchProps } from "./neo-switch";
export { NeoLabel, type NeoLabelProps } from "./neo-label";
export { NeoOTPInput, type NeoOTPInputProps } from "./neo-otp-input";

// Pagination
export {
  NeoPagination,
  NeoPaginationButton,
  NeoPaginationEllipsis,
  NeoPaginationInfo,
  type NeoPaginationProps,
} from "./neo-pagination";

// Breadcrumb
export {
  NeoBreadcrumb,
  NeoBreadcrumbList,
  NeoBreadcrumbItem,
  NeoBreadcrumbLink,
  NeoBreadcrumbPage,
  NeoBreadcrumbSeparator,
  NeoBreadcrumbHome,
  type NeoBreadcrumbProps,
} from "./neo-breadcrumb";

// Alert Dialog
export { NeoAlertDialog, type NeoAlertDialogProps } from "./neo-alert-dialog";

// Popover
export {
  NeoPopover,
  NeoPopoverTrigger,
  NeoPopoverContent,
  NeoPopoverClose,
  type NeoPopoverProps,
  type NeoPopoverContentProps,
} from "./neo-popover";

// Typography
export { NeoText, type NeoTextProps } from "./neo-text";

// Surface & Layout
export { NeoSurface, type NeoSurfaceProps } from "./neo-surface";
export {
  NeoAppShell,
  NeoAppShellSidebarHeader,
  NeoAppShellSidebarContent,
  NeoAppShellSidebarFooter,
  type NeoAppShellProps,
  type NeoAppShellSidebarHeaderProps,
  type NeoAppShellSidebarContentProps,
  type NeoAppShellSidebarFooterProps,
} from "./neo-app-shell";

// Data Display
export { NeoStatCard, type NeoStatCardProps } from "./neo-stat-card";
export {
  NeoTimeline,
  type NeoTimelineProps,
  type NeoTimelineItem,
} from "./neo-timeline";
export { NeoCalendar, type NeoCalendarProps } from "./neo-calendar";

// Form - Additional
export { NeoStepper, type NeoStepperProps } from "./neo-stepper";
export { NeoTag, type NeoTagProps } from "./neo-tag";
export { NeoFileUpload, type NeoFileUploadProps } from "./neo-file-upload";

// Overlay - Additional
export { NeoDrawer, type NeoDrawerProps } from "./neo-drawer";

// Widgets
export {
  NeoLoadingOverlay,
  type NeoLoadingOverlayProps,
} from "./neo-loading-overlay";
export { NeoEmptyState, type NeoEmptyStateProps } from "./neo-empty-state";
