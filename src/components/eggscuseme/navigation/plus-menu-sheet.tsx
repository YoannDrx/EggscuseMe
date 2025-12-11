"use client";

import { LanguageToggle } from "@/components/nowts/language-toggle";
import { ThemeSwitcher } from "@/components/nowts/theme-switcher";
import { NeoSheet } from "@/components/neo/neo-sheet";
import { cn } from "@/lib/utils";
import { motion } from 'motion/react';
import {
  Bell,
  CreditCard,
  History,
  KeyRound,
  LogOut,
  Palette,
  Settings,
  User,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

type PlusMenuSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isOwner?: boolean;
};

const menuItems = [
  { icon: History, labelKey: "history", href: "/fridge/history" },
  { icon: Settings, labelKey: "settings", href: "/fridge/settings" },
  {
    icon: Users,
    labelKey: "sharing",
    href: "/fridge/settings/sharing",
    ownerOnly: true,
  },
  {
    icon: Bell,
    labelKey: "notifications",
    href: "/fridge/settings/notifications",
    ownerOnly: true,
  },
  {
    icon: CreditCard,
    labelKey: "billing",
    href: "/fridge/settings/billing",
    ownerOnly: true,
  },
];

const accountItems = [
  { icon: User, labelKey: "profile", href: "/fridge/settings/profile" },
  { icon: KeyRound, labelKey: "security", href: "/fridge/settings/security" },
  {
    icon: Palette,
    labelKey: "appearance",
    href: "/fridge/settings/appearance",
  },
  { icon: LogOut, labelKey: "signOut", href: "/auth/signout" },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export function PlusMenuSheet({
  open,
  onOpenChange,
  isOwner = false,
}: PlusMenuSheetProps) {
  const t = useTranslations("fridge.nav");
  const pathname = usePathname();

  const filteredMenuItems = menuItems.filter(
    (item) => !item.ownerOnly || isOwner,
  );

  return (
    <NeoSheet
      open={open}
      onOpenChange={onOpenChange}
      side="bottom"
      showHandle={true}
      showCloseButton={true}
    >
      {/* Menu Items */}
      <motion.nav
        className="space-y-1"
        variants={containerVariants}
        initial="hidden"
        animate={open ? "visible" : "hidden"}
      >
        {filteredMenuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <motion.div key={item.href} variants={itemVariants}>
              <Link
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center gap-4 rounded-[var(--radius-neo-lg)] px-4 py-3 transition-all",
                  "min-h-[var(--touch-target-comfortable)]",
                  isActive
                    ? "bg-neo-accent/10 text-neo-accent border-neo-accent/30 border shadow-[var(--shadow-neo-sm)]"
                    : "text-neo-text hover:bg-neo-bg hover:border-neo-border/20 border border-transparent hover:shadow-[var(--shadow-neo-sm)]",
                  "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                )}
              >
                <item.icon
                  className={cn(
                    "size-5 shrink-0",
                    isActive ? "text-neo-accent" : "text-neo-text-muted",
                  )}
                />
                <span className="font-medium">{t(item.labelKey)}</span>
              </Link>
            </motion.div>
          );
        })}

        {/* Divider */}
        <div className="border-neo-border/20 my-3 border-t" />

        {/* Account Items */}
        {accountItems.map((item) => {
          const isActive = pathname === item.href;
          const isSignOut = item.labelKey === "signOut";
          return (
            <motion.div key={item.href} variants={itemVariants}>
              <Link
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center gap-4 rounded-[var(--radius-neo-lg)] px-4 py-3 transition-all",
                  "min-h-[var(--touch-target-comfortable)]",
                  isSignOut
                    ? "text-neo-destructive hover:bg-neo-destructive/10 hover:border-neo-destructive/30 border border-transparent hover:shadow-[var(--shadow-neo-sm)]"
                    : isActive
                      ? "bg-neo-accent/10 text-neo-accent border-neo-accent/30 border shadow-[var(--shadow-neo-sm)]"
                      : "text-neo-text hover:bg-neo-bg hover:border-neo-border/20 border border-transparent hover:shadow-[var(--shadow-neo-sm)]",
                  "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                )}
              >
                <item.icon
                  className={cn(
                    "size-5 shrink-0",
                    isSignOut
                      ? "text-neo-destructive"
                      : isActive
                        ? "text-neo-accent"
                        : "text-neo-text-muted",
                  )}
                />
                <span className="font-medium">{t(item.labelKey)}</span>
              </Link>
            </motion.div>
          );
        })}

        {/* Divider */}
        <div className="border-neo-border/20 my-3 border-t" />

        {/* Theme and Language Toggles */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-center gap-3 py-2"
        >
          <LanguageToggle />
          <ThemeSwitcher />
        </motion.div>
      </motion.nav>
    </NeoSheet>
  );
}
