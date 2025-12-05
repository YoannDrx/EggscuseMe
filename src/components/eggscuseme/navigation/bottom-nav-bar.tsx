"use client";

import { motion } from "framer-motion";
import { BarChart3, ChefHat, Refrigerator, Timer } from "lucide-react";
import { useThemeColors } from "../theme";
import { NavItem } from "./nav-item";

export type TabId = "fridge" | "timer" | "guide" | "stats";

type BottomNavBarProps = {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
};

const navItems: { id: TabId; icon: typeof Refrigerator; label: string }[] = [
  { id: "fridge", icon: Refrigerator, label: "Frigo" },
  { id: "timer", icon: Timer, label: "Timer" },
  { id: "guide", icon: ChefHat, label: "Guide" },
  { id: "stats", icon: BarChart3, label: "Infos" },
];

export function BottomNavBar({ activeTab, onTabChange }: BottomNavBarProps) {
  const colors = useThemeColors();

  return (
    <nav
      className={`fixed right-0 bottom-0 left-0 z-[var(--z-nav)] h-20 pb-[var(--space-safe-bottom)] ${colors.nav} ${colors.navBorder} grid grid-cols-4 items-center border-t px-4 backdrop-blur-xl transition-colors duration-300`}
    >
      {navItems.map((item) => {
        const isActive = activeTab === item.id;

        return (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={isActive}
            onClick={() => onTabChange(item.id)}
          />
        );
      })}

      {/* Animated pill indicator */}
      <motion.div
        layoutId="nav-pill"
        className={`absolute -top-0.5 h-1 w-12 rounded-full ${colors.accentBg} `}
        style={{
          left: `calc(${navItems.findIndex((item) => item.id === activeTab) * 25}% + 12.5% - 24px)`,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />
    </nav>
  );
}
