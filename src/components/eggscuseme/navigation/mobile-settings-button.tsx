"use client";

import { NeoButton } from "@/components/neo/neo-button";
import { Settings } from "lucide-react";
import { useState } from "react";
import { PlusMenuSheet } from "./plus-menu-sheet";

type MobileSettingsButtonProps = {
  isOwner?: boolean;
};

/**
 * Settings button for mobile header that opens the settings menu
 */
export function MobileSettingsButton({
  isOwner = false,
}: MobileSettingsButtonProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <NeoButton
        variant="ghost"
        size="icon"
        className="size-10 rounded-full"
        onClick={() => setMenuOpen(true)}
      >
        <Settings className="size-5" />
        <span className="sr-only">Paramètres</span>
      </NeoButton>

      <PlusMenuSheet
        open={menuOpen}
        onOpenChange={setMenuOpen}
        isOwner={isOwner}
      />
    </>
  );
}
