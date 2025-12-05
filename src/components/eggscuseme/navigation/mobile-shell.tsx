"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Palette } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { EggThemeProvider, useEggTheme, useThemeColors } from "../theme";
import { BottomNavBar, type TabId } from "./bottom-nav-bar";

type MobileShellProps = {
  children: ReactNode;
  defaultTab?: TabId;
  onTabChange?: (tab: TabId) => void;
};

function MobileShellContent({
  children,
  defaultTab = "fridge",
  onTabChange,
}: MobileShellProps) {
  const { toggleTheme, theme } = useEggTheme();
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab);

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <div
      className={`min-h-screen w-full font-sans ${colors.bg} transition-colors duration-300`}
    >
      <main
        className={`relative mx-auto flex h-screen w-full max-w-md flex-col overflow-hidden shadow-2xl ${colors.bg} transition-colors duration-300`}
      >
        {/* Theme Switcher */}
        <div className="absolute top-4 right-4 z-[var(--z-sticky)]">
          <motion.button
            onClick={toggleTheme}
            className={`rounded-full p-2 shadow-md ${colors.card} ${colors.cardBorder} ${colors.textMuted} border transition-all hover:scale-105`}
            whileTap={{ scale: 0.95 }}
            title={`Thème actuel: ${theme.name}`}
          >
            <Palette size={20} />
          </motion.button>
        </div>

        {/* Content Area with padding for nav */}
        <div className="flex-1 overflow-hidden pt-2 pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation */}
        <BottomNavBar activeTab={activeTab} onTabChange={handleTabChange} />
      </main>
    </div>
  );
}

export function MobileShell(props: MobileShellProps) {
  return (
    <EggThemeProvider>
      <MobileShellContent {...props} />
    </EggThemeProvider>
  );
}

/**
 * Hook to detect if we're on mobile viewport
 * Use this to conditionally render MobileShell vs desktop layout
 */
export function useMobileViewport() {
  // This could be enhanced with actual viewport detection
  // For now, we use CSS-based detection via Tailwind breakpoints
  return {
    isMobile: true, // Always mobile for this shell
  };
}
