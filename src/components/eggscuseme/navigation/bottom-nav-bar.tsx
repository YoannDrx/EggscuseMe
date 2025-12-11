"use client";

import {
  NeoBottomNav,
  NeoBottomNavSpacer,
} from "@/components/neo/neo-bottom-nav";
import type { NeoBottomNavItem } from "@/components/neo/neo-bottom-nav";
import { BarChart3, BookOpen, Plus, Refrigerator, Timer } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { QuickActionsSheet } from "./quick-actions-sheet";

type BottomNavBarProps = {
  isOwner?: boolean;
};

export function BottomNavBar({ isOwner = false }: BottomNavBarProps) {
  const t = useTranslations("fridge.nav");
  const pathname = usePathname();
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  // Get active item ID based on pathname
  const getActiveId = () => {
    if (
      pathname === "/fridge" ||
      (pathname.startsWith("/fridge") &&
        !pathname.startsWith("/fridge/timer") &&
        !pathname.startsWith("/fridge/recipes") &&
        !pathname.startsWith("/fridge/statistics"))
    ) {
      return "fridge";
    }
    if (pathname.startsWith("/fridge/timer")) return "timer";
    if (pathname.startsWith("/fridge/recipes")) return "recipes";
    if (pathname.startsWith("/fridge/statistics")) return "stats";
    return "fridge";
  };

  // Nav items with FAB in the center position
  const navItems: NeoBottomNavItem[] = [
    { id: "fridge", icon: Refrigerator, label: t("myFridge"), href: "/fridge" },
    { id: "timer", icon: Timer, label: t("timer"), href: "/fridge/timer" },
    {
      id: "fab",
      icon: Plus,
      label: "",
      isFab: true,
      onClick: () => setQuickActionsOpen(true),
    },
    {
      id: "recipes",
      icon: BookOpen,
      label: t("recipes"),
      href: "/fridge/recipes",
    },
    {
      id: "stats",
      icon: BarChart3,
      label: t("statistics"),
      href: "/fridge/statistics",
    },
  ];

  const activeId = getActiveId();

  return (
    <>
      <NeoBottomNav
        items={navItems}
        activeId={activeId}
        className="md:hidden"
        pillColor="bg-neo-accent"
      />

      {/* Quick Actions Sheet */}
      <QuickActionsSheet
        open={quickActionsOpen}
        onOpenChange={setQuickActionsOpen}
        isOwner={isOwner}
      />

      {/* Bottom padding spacer for content - Mobile Only */}
      <NeoBottomNavSpacer />
    </>
  );
}
