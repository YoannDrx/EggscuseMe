"use client";

import { LanguageToggle } from "@/components/nowts/language-toggle";
import { ThemeSwitcher } from "@/components/nowts/theme-switcher";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={cn(
          "rounded-t-[var(--radius-sheet)] px-0 pb-8",
          "border-nav-border bg-card",
          "max-h-[85vh] overflow-y-auto",
        )}
      >
        <SheetHeader className="px-6 pb-2">
          {/* Handle bar */}
          <div className="bg-muted-foreground/30 mx-auto mb-2 h-1.5 w-12 rounded-full" />
          <SheetTitle className="sr-only">Menu</SheetTitle>
        </SheetHeader>

        {/* Menu Items */}
        <motion.nav
          className="space-y-1 px-4"
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
                    "flex items-center gap-4 rounded-xl px-4 py-3 transition-colors",
                    "min-h-[var(--touch-target-comfortable)]",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted",
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-5",
                      isActive ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  <span className="font-medium">{t(item.labelKey)}</span>
                </Link>
              </motion.div>
            );
          })}

          {/* Divider */}
          <div className="border-border my-3 border-t" />

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
                    "flex items-center gap-4 rounded-xl px-4 py-3 transition-colors",
                    "min-h-[var(--touch-target-comfortable)]",
                    isSignOut
                      ? "text-destructive hover:bg-destructive/10"
                      : isActive
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted",
                  )}
                >
                  <item.icon
                    className={cn(
                      "size-5",
                      isSignOut
                        ? "text-destructive"
                        : isActive
                          ? "text-primary"
                          : "text-muted-foreground",
                    )}
                  />
                  <span className="font-medium">{t(item.labelKey)}</span>
                </Link>
              </motion.div>
            );
          })}

          {/* Divider */}
          <div className="border-border my-3 border-t" />

          {/* Theme and Language Toggles */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-3 py-2"
          >
            <LanguageToggle />
            <ThemeSwitcher />
          </motion.div>
        </motion.nav>
      </SheetContent>
    </Sheet>
  );
}
