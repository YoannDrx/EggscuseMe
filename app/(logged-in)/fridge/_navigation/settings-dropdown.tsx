"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebarContext } from "@/components/neo/neo-sidebar";
import type { NavigationLink } from "@/features/navigation/navigation.type";
import { cn } from "@/lib/utils";
import { ChevronDown, Settings } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type SettingsDropdownProps = {
  settingsLinks: NavigationLink[];
};

export function SettingsDropdown({ settingsLinks }: SettingsDropdownProps) {
  const t = useTranslations("fridge.nav");
  const pathname = usePathname();
  const { expanded, mobile } = useSidebarContext();
  const isSettingsActive = pathname.startsWith("/fridge/settings");
  const showText = expanded || mobile;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "group relative flex w-full items-center gap-3",
            "rounded-[var(--radius-neo-lg)] px-3 py-3",
            "text-sm font-medium",
            "outline-none",
            "transition-all duration-200",
            isSettingsActive
              ? [
                  "bg-neo-accent/10 text-neo-accent",
                  "border-neo-accent/30 border-[length:var(--border-neo)]",
                  "shadow-[var(--shadow-neo-sm)]",
                ]
              : [
                  "text-neo-text-muted",
                  "border border-transparent",
                  "hover:bg-neo-bg hover:text-neo-text",
                  "hover:border-neo-border/20",
                  "hover:shadow-[var(--shadow-neo-sm)]",
                  "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                ],
            !showText && "justify-center",
          )}
        >
          <Settings
            className={cn(
              "size-5 shrink-0",
              isSettingsActive
                ? "text-neo-accent"
                : "text-neo-text-muted group-hover:text-neo-text",
            )}
          />
          {showText && (
            <>
              <span className="flex-1 text-left">{t("settings")}</span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 transition-transform duration-200",
                  isSettingsActive
                    ? "text-neo-accent"
                    : "text-neo-text-muted group-hover:text-neo-text",
                  isOpen && "rotate-180",
                )}
              />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="start"
        sideOffset={4}
        className="bg-neo-card border-neo-border/20 w-[var(--radix-dropdown-menu-trigger-width)] border-[length:var(--border-neo)] p-1 shadow-[var(--shadow-neo-lg)]"
      >
        {settingsLinks.map((link) => {
          const Icon = link.Icon;
          const isActive = pathname === link.href;

          return (
            <DropdownMenuItem key={link.labelKey} asChild className="p-0">
              <Link
                href={link.href}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-3 rounded-[var(--radius-neo-md)] px-3 py-2.5",
                  "text-sm font-medium",
                  "transition-all duration-150",
                  isActive
                    ? "bg-neo-accent/10 text-neo-accent"
                    : "text-neo-text-muted hover:bg-neo-bg hover:text-neo-text",
                )}
              >
                <Icon
                  className={cn(
                    "size-4 shrink-0",
                    isActive
                      ? "text-neo-accent"
                      : "text-neo-text-muted group-hover:text-neo-text",
                  )}
                />
                <span>{t(link.labelKey)}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
