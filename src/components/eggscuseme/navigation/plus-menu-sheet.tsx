"use client";

import { LanguageToggle } from "@/components/nowts/language-toggle";
import { ThemeSwitcher } from "@/components/nowts/theme-switcher";
import { NeoSheet } from "@/components/neo/neo-sheet";
import { SettingsMenuItem } from "./settings-menu-item";
import { UserProfileCard } from "./user-profile-card";
import { useSession } from "@/lib/auth-client";
import { useCurrentFridge } from "@app/(logged-in)/fridge/use-current-fridge";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import {
  Bell,
  CreditCard,
  Globe,
  History,
  KeyRound,
  LogOut,
  Palette,
  Settings,
  User,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

type PlusMenuSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isOwner?: boolean;
};

// Section header component
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <motion.h4
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      className="text-neo-text-muted mt-6 mb-2 px-1 text-xs font-bold tracking-wider uppercase"
    >
      {children}
    </motion.h4>
  );
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
};

export function PlusMenuSheet({
  open,
  onOpenChange,
  isOwner = false,
}: PlusMenuSheetProps) {
  const t = useTranslations("fridge.nav");
  const pathname = usePathname();
  const { data: session } = useSession();
  const fridge = useCurrentFridge();

  const user = session?.user;
  const isPremium = fridge?.isPremium ?? false;
  const isActualOwner = fridge?.role === "OWNER" || isOwner;

  const handleClose = () => onOpenChange(false);

  return (
    <NeoSheet
      open={open}
      onOpenChange={onOpenChange}
      side="bottom"
      showHandle={true}
      showCloseButton={false}
      draggable={true}
      className="max-h-[95dvh] min-h-[200px]"
    >
      <motion.div
        className="space-y-1"
        variants={containerVariants}
        initial="hidden"
        animate={open ? "visible" : "hidden"}
      >
        {/* User Profile Section */}
        {user && (
          <UserProfileCard
            name={user.name}
            email={user.email}
            image={user.image}
            isOwner={isActualOwner}
            isPremium={isPremium}
          />
        )}

        {/* Mon Frigo Section */}
        <SectionHeader>{t("fridgeSection")}</SectionHeader>
        <div className="space-y-1">
          <SettingsMenuItem
            icon={History}
            label={t("history")}
            href="/fridge/history"
            isActive={pathname === "/fridge/history"}
            onClick={handleClose}
          />
          <SettingsMenuItem
            icon={Settings}
            label={t("settings")}
            href="/fridge/settings"
            isActive={pathname === "/fridge/settings"}
            onClick={handleClose}
          />
          {isActualOwner && (
            <>
              <SettingsMenuItem
                icon={Users}
                label={t("sharing")}
                href="/fridge/settings/sharing"
                isActive={pathname === "/fridge/settings/sharing"}
                onClick={handleClose}
              />
              <SettingsMenuItem
                icon={Bell}
                label={t("notifications")}
                href="/fridge/settings/notifications"
                isActive={pathname === "/fridge/settings/notifications"}
                onClick={handleClose}
              />
              <SettingsMenuItem
                icon={CreditCard}
                label={t("billing")}
                href="/fridge/settings/billing"
                isActive={pathname === "/fridge/settings/billing"}
                onClick={handleClose}
              />
            </>
          )}
        </div>

        {/* Mon Compte Section */}
        <SectionHeader>{t("accountSection")}</SectionHeader>
        <div className="space-y-1">
          <SettingsMenuItem
            icon={User}
            label={t("profile")}
            href="/fridge/settings/profile"
            isActive={pathname === "/fridge/settings/profile"}
            onClick={handleClose}
          />
          <SettingsMenuItem
            icon={KeyRound}
            label={t("security")}
            href="/fridge/settings/security"
            isActive={pathname === "/fridge/settings/security"}
            onClick={handleClose}
          />
        </div>

        {/* Préférences Section */}
        <SectionHeader>{t("preferencesSection")}</SectionHeader>
        <div
          className={cn(
            "flex items-center justify-between gap-4 px-4 py-3",
            "rounded-[var(--radius-neo-xl)]",
            "bg-neo-bg",
            "border-neo-border/20 border-[length:var(--border-neo)]",
          )}
        >
          <div className="flex items-center gap-4">
            <Globe className="text-neo-text-muted size-5 shrink-0" />
            <span className="text-neo-text font-medium">{t("language")}</span>
          </div>
          <LanguageToggle />
        </div>
        <div
          className={cn(
            "flex items-center justify-between gap-4 px-4 py-3",
            "rounded-[var(--radius-neo-xl)]",
            "bg-neo-bg",
            "border-neo-border/20 border-[length:var(--border-neo)]",
          )}
        >
          <div className="flex items-center gap-4">
            <Palette className="text-neo-text-muted size-5 shrink-0" />
            <span className="text-neo-text font-medium">{t("theme")}</span>
          </div>
          <ThemeSwitcher />
        </div>

        {/* Divider */}
        <div className="border-neo-border/20 my-4 border-t" />

        {/* Sign Out */}
        <SettingsMenuItem
          icon={LogOut}
          label={t("signOut")}
          href="/auth/signout"
          variant="destructive"
          onClick={handleClose}
        />
      </motion.div>
    </NeoSheet>
  );
}
