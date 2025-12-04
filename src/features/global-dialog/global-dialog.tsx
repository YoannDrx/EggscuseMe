"use client";

import type { DialogType } from "./global-dialog.store";
import { useGlobalDialogStore } from "./global-dialog.store";

// Placeholder for future dialogs - add new dialog components here
const DialogTypeMap: Partial<Record<DialogType, React.ComponentType>> = {
  // "fridge-plan": FridgePlanDialog, // Uncomment when implemented
};

/**
 * This component is used to display the global dialog.
 *
 * Example :
 *
 * Pricing table
 * User settings
 * ...
 *
 * If you want a Dialog that is displayable from anywhere without routing, you can use this component.
 *
 * @returns The dialog component to display
 */
export const GlobalDialog = () => {
  const dialogType = useGlobalDialogStore((state) => state.openDialog);

  if (!dialogType) {
    return null;
  }

  const DialogComponent = DialogTypeMap[dialogType];

  if (!DialogComponent) {
    return null;
  }

  return <DialogComponent />;
};
