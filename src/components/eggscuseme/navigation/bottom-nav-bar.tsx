"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { BarChart3, BookOpen, Menu, Refrigerator, Timer } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PlusMenuSheet } from "./plus-menu-sheet";

export type TabId = "fridge" | "timer" | "recipes" | "stats" | "plus";

type NavItemConfig = {
  id: TabId;
  icon: typeof Refrigerator;
  labelKey: string;
  href: string | null;
};

const navItems: NavItemConfig[] = [
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
  { id: "plus", icon: Menu, labelKey: "plus", href: null },
];

type BottomNavBarProps = {
  isOwner?: boolean;
};

export function BottomNavBar({ isOwner = false }: BottomNavBarProps) {
  const t = useTranslations("fridge.nav");
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);

  // Detect scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Find active tab index for pill animation
  const getActiveIndex = () => {
    const index = navItems.findIndex(
      (item) => item.href && pathname.startsWith(item.href),
    );
    return index >= 0 ? index : 0;
  };

  const activeIndex = getActiveIndex();

  return (
    <>
      {/* Bottom Nav - Mobile Only */}
      <nav
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 md:hidden",
          "rounded-t-3xl border-t border-stone-800",
          "bg-stone-900/95 backdrop-blur-xl",
          "pb-[env(safe-area-inset-bottom)]",
          "grid h-20 grid-cols-5 items-center px-2",
          "transition-shadow duration-300",
          isScrolled && "shadow-[0_-4px_20px_rgba(0,0,0,0.4)]",
        )}
      >
        {navItems.map((item) => {
          const isActive = item.href
            ? pathname === item.href || pathname.startsWith(`${item.href}/`)
            : false;
          const Icon = item.icon;

          if (item.href) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className="relative flex flex-col items-center justify-center gap-1"
              >
                <motion.div
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Icon
                    className={cn(
                      "size-6 transition-colors duration-200",
                      isActive ? "text-amber-400" : "text-stone-500",
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </motion.div>
                <span
                  className={cn(
                    "text-[10px] font-semibold transition-colors duration-200",
                    isActive ? "text-white" : "text-stone-500",
                  )}
                >
                  {t(item.labelKey)}
                </span>
              </Link>
            );
          }

          // Plus button (opens sheet)
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setPlusMenuOpen(true)}
              className="relative flex flex-col items-center justify-center gap-1"
            >
              <Icon
                className="size-6 text-stone-500 transition-colors duration-200 hover:text-stone-300"
                strokeWidth={2}
              />
              <span className="text-[10px] font-semibold text-stone-500">
                {t(item.labelKey)}
              </span>
            </button>
          );
        })}

        {/* Animated pill indicator */}
        <motion.div
          layoutId="nav-pill"
          className="absolute -top-0.5 h-1 w-10 rounded-full bg-amber-400"
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

      {/* Bottom padding spacer for content - Mobile Only */}
      <div className="h-20 md:hidden" />
    </>
  );
}
