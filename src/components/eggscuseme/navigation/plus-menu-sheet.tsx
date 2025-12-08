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
        className="rounded-t-3xl border-stone-800 bg-stone-900 px-0 pb-8"
      >
        <SheetHeader className="px-6 pb-2">
          {/* Handle bar */}
          <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-stone-700" />
          <SheetTitle className="sr-only">Menu</SheetTitle>
        </SheetHeader>

        {/* Menu Items */}
        <nav className="space-y-1 px-4">
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center gap-4 rounded-xl px-4 py-3 transition-colors",
                  isActive
                    ? "bg-amber-400/10 text-amber-400"
                    : "text-stone-300 hover:bg-stone-800",
                )}
              >
                <item.icon
                  className={cn(
                    "size-5",
                    isActive ? "text-amber-400" : "text-stone-400",
                  )}
                />
                <span className="font-medium">{t(item.labelKey)}</span>
              </Link>
            );
          })}

          {/* Divider */}
          <div className="my-3 border-t border-stone-800" />

          {/* Account Items */}
          {accountItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center gap-4 rounded-xl px-4 py-3 transition-colors",
                  isActive
                    ? "bg-amber-400/10 text-amber-400"
                    : "text-stone-300 hover:bg-stone-800",
                )}
              >
                <item.icon
                  className={cn(
                    "size-5",
                    isActive ? "text-amber-400" : "text-stone-400",
                  )}
                />
                <span className="font-medium">{t(item.labelKey)}</span>
              </Link>
            );
          })}

          {/* Divider */}
          <div className="my-3 border-t border-stone-800" />

          {/* Theme and Language Toggles */}
          <div className="flex items-center justify-center gap-3 py-2">
            <LanguageToggle />
            <ThemeSwitcher />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
