"use client";

import { cn } from "@/lib/utils";
import { BarChart3, BookOpen, Plus, Refrigerator, Timer } from "lucide-react";
import { motion } from "motion/react";
import type { DemoTab } from "../demo-types";

type DemoBottomNavProps = {
  activeTab: DemoTab;
  onTabChange: (tab: DemoTab) => void;
  onFabClick: () => void;
};

type NavItem = {
  id: DemoTab | "fab";
  icon: typeof Refrigerator;
  label: string;
  isFab?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { id: "fridge", icon: Refrigerator, label: "Frigo" },
  { id: "timer", icon: Timer, label: "Minuteur" },
  { id: "fab", icon: Plus, label: "", isFab: true },
  { id: "recipes", icon: BookOpen, label: "Recettes" },
  { id: "stats", icon: BarChart3, label: "Stats" },
];

export function DemoBottomNav({
  activeTab,
  onTabChange,
  onFabClick,
}: DemoBottomNavProps) {
  const activeIndex = NAV_ITEMS.findIndex((item) => item.id === activeTab);

  return (
    <div
      className={cn(
        "border-neo-border/30 bg-neo-card/95",
        "rounded-t-[var(--radius-neo-2xl)]",
        "border-t-[length:var(--border-neo)] backdrop-blur-xl",
        "px-2 pt-2 pb-4",
      )}
    >
      <div className="relative grid grid-cols-5 items-center">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeTab;
          const Icon = item.icon;

          // FAB (Floating Action Button)
          if (item.isFab) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={onFabClick}
                className="relative -top-5 flex justify-center"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    "bg-neo-accent text-neo-accent-foreground",
                    "flex size-12 items-center justify-center rounded-full",
                    "border-neo-border/30 border-[length:var(--border-neo)]",
                    "shadow-[var(--shadow-neo-md)]",
                    "transition-all",
                    "hover:-translate-y-1 hover:shadow-[var(--shadow-neo-lg)]",
                    "active:translate-y-0 active:shadow-[var(--shadow-neo-sm)]",
                  )}
                >
                  <Icon className="size-6" strokeWidth={3} />
                </motion.div>
              </button>
            );
          }

          // Regular nav item
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id as DemoTab)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 py-2",
                "transition-colors outline-none active:scale-95",
              )}
            >
              <motion.div
                animate={{ scale: isActive ? 1.15 : 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                <Icon
                  className={cn(
                    "size-5 transition-colors duration-200",
                    isActive ? "text-neo-accent" : "text-neo-text-muted",
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </motion.div>
              <span
                className={cn(
                  "text-[9px] font-medium transition-colors duration-200",
                  isActive ? "text-neo-accent" : "text-neo-text-muted",
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Animated pill indicator */}
        {activeIndex >= 0 && (
          <motion.div
            layoutId="demo-nav-pill"
            className="bg-neo-accent absolute bottom-0 h-1 w-8 rounded-full"
            style={{
              left: `calc(${activeIndex * 20}% + 10% - 16px)`,
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
          />
        )}
      </div>
    </div>
  );
}
