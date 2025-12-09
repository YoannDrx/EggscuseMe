"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BarChart3, BookOpen, Plus, Refrigerator, Timer } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PlusMenuSheet } from "./plus-menu-sheet";

export type NavTabId = "fridge" | "timer" | "recipes" | "stats";

type NavItem = {
  id: NavTabId;
  icon: typeof Refrigerator;
  labelKey: string;
  href: string;
};

const navItems: NavItem[] = [
  { id: "fridge", icon: Refrigerator, labelKey: "myFridge", href: "/fridge" },
  { id: "timer", icon: Timer, labelKey: "timer", href: "/fridge/timer" },
  {
    id: "recipes",
    icon: BookOpen,
    labelKey: "recipes",
    href: "/fridge/recipes",
  },
  {
    id: "stats",
    icon: BarChart3,
    labelKey: "statistics",
    href: "/fridge/statistics",
  },
];

type MobileBottomNavProps = {
  /** Whether user is owner (for plus menu options) */
  isOwner?: boolean;
  /** Callback when FAB is clicked */
  onFabClick?: () => void;
  /** Custom FAB content */
  fabContent?: React.ReactNode;
  /** Hide the FAB */
  hideFab?: boolean;
};

/**
 * Mobile-first bottom navigation with central FAB
 * - Uses design tokens (no hardcoded colors)
 * - 4 nav items + central FAB
 * - Glass morphism effect
 * - Animated active indicator
 */
export function MobileBottomNav({
  isOwner = false,
  onFabClick,
  fabContent,
  hideFab = false,
}: MobileBottomNavProps) {
  const t = useTranslations("fridge.nav");
  const pathname = usePathname();
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);

  // Find active tab
  const getActiveIndex = (): number => {
    for (let i = 0; i < navItems.length; i++) {
      const item = navItems[i];
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        // Adjust index for FAB position (items after index 1 are shifted)
        return i >= 2 ? i + 1 : i;
      }
    }
    return 0;
  };

  const activeIndex = getActiveIndex();

  const handleFabClick = () => {
    if (onFabClick) {
      onFabClick();
    } else {
      setPlusMenuOpen(true);
    }
  };

  return (
    <>
      {/* Bottom Navigation */}
      <nav
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 md:hidden",
          "h-[var(--nav-height-mobile)]",
          "rounded-t-3xl border-t",
          "border-nav-border bg-nav-bg backdrop-blur-xl",
          "pb-[env(safe-area-inset-bottom)]",
          "grid grid-cols-5 items-center px-2",
        )}
      >
        {/* First two nav items */}
        {navItems.slice(0, 2).map((item, index) => (
          <NavItemButton
            key={item.id}
            item={item}
            isActive={activeIndex === index}
            t={t}
          />
        ))}

        {/* Central FAB */}
        {!hideFab && (
          <div className="flex items-center justify-center">
            <motion.button
              type="button"
              onClick={handleFabClick}
              className={cn(
                "relative -mt-6 flex items-center justify-center",
                "size-14 rounded-full",
                "bg-primary text-primary-foreground",
                "shadow-lg",
                "transition-transform active:scale-95",
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {fabContent ?? (
                <motion.div
                  animate={{ rotate: plusMenuOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Plus className="size-6" strokeWidth={2.5} />
                </motion.div>
              )}
              {/* Glow effect */}
              <div className="bg-primary/30 absolute inset-0 -z-10 rounded-full blur-lg" />
            </motion.button>
          </div>
        )}

        {/* Spacer when FAB is hidden */}
        {hideFab && <div />}

        {/* Last two nav items */}
        {navItems.slice(2).map((item, index) => (
          <NavItemButton
            key={item.id}
            item={item}
            isActive={activeIndex === index + 3}
            t={t}
          />
        ))}

        {/* Animated pill indicator */}
        <motion.div
          layoutId="mobile-nav-pill"
          className="bg-nav-active absolute -top-0.5 h-1 w-10 rounded-full"
          style={{
            left: `calc(${activeIndex * 20}% + 10% - 20px)`,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      </nav>

      {/* Plus Menu Sheet */}
      <PlusMenuSheet
        open={plusMenuOpen}
        onOpenChange={setPlusMenuOpen}
        isOwner={isOwner}
      />

      {/* Bottom padding spacer for content */}
      <div className="h-[var(--nav-height-mobile)] md:hidden" />
    </>
  );
}

/** Individual nav item button */
function NavItemButton({
  item,
  isActive,
  t,
}: {
  item: NavItem;
  isActive: boolean;
  t: (key: string) => string;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="relative flex flex-col items-center justify-center gap-1 py-2"
    >
      <motion.div
        animate={{ scale: isActive ? 1.1 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <Icon
          className={cn(
            "size-6 transition-colors duration-200",
            isActive ? "text-nav-active" : "text-nav-inactive",
          )}
          strokeWidth={isActive ? 2.5 : 2}
        />
      </motion.div>
      <span
        className={cn(
          "text-[10px] font-semibold transition-colors duration-200",
          isActive ? "text-foreground" : "text-nav-inactive",
        )}
      >
        {t(item.labelKey)}
      </span>
    </Link>
  );
}
