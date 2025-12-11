"use client";

import { Collapsible } from "@/components/ui/collapsible";
import {
  NeoSidebar,
  NeoSidebarContent,
  NeoSidebarFooter,
  NeoSidebarGroup,
  NeoSidebarHeader,
  useSidebarContext,
} from "@/components/neo/neo-sidebar";
import { SidebarNavigationMenu } from "@/components/ui/sidebar-utils";
import { ContactFeedbackPopover } from "@/features/contact/feedback/contact-feedback-popover";
import { Eggy } from "@/features/mascot";
import type { NavigationGroup } from "@/features/navigation/navigation.type";
import { SidebarUserButton } from "@/features/sidebar/sidebar-user-button";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import {
  getFridgeNavigation,
  getSettingsLinks,
} from "./fridge-navigation.links";
import { SettingsDropdown } from "./settings-dropdown";

type FridgeSidebarProps = {
  role: "OWNER" | "GUEST";
};

export function FridgeSidebar({ role }: FridgeSidebarProps) {
  const t = useTranslations("fridge.nav");
  const links: NavigationGroup[] = getFridgeNavigation(role);
  const settingsLinks = getSettingsLinks(role);
  const { expanded, mobile } = useSidebarContext();

  return (
    <NeoSidebar variant="elevated">
      <NeoSidebarHeader className="flex flex-col gap-2">
        <Link
          href="/fridge"
          className="hover:bg-neo-bg flex items-center gap-2 rounded-[var(--radius-neo-lg)] p-2 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-md)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        >
          <Eggy mood="happy" size="sm" />
          {(expanded || mobile) && (
            <span className="font-heading text-lg font-semibold">
              EggscuseMe
            </span>
          )}
        </Link>
      </NeoSidebarHeader>
      <NeoSidebarContent className="space-y-2">
        {links.map((link) => (
          <ItemCollapsing
            defaultOpenStartPath={link.defaultOpenStartPath}
            key={link.titleKey}
          >
            <NeoSidebarGroup
              key={link.titleKey}
              label={expanded || mobile ? t(link.titleKey) : undefined}
              className="space-y-2"
            >
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarNavigationMenu link={link} />
              </Collapsible>
            </NeoSidebarGroup>
          </ItemCollapsing>
        ))}

        {/* Settings dropdown */}
        <SettingsDropdown settingsLinks={settingsLinks} />
      </NeoSidebarContent>
      <NeoSidebarFooter className="flex flex-col gap-3">
        {role === "GUEST" && (
          <div className="bg-neo-bg/50 border-neo-border/10 rounded-[var(--radius-neo-lg)] border p-3 text-sm">
            <p className="text-neo-text-muted">{t("guestNotice")}</p>
          </div>
        )}
        <ContactFeedbackPopover />
        <SidebarUserButton />
      </NeoSidebarFooter>
    </NeoSidebar>
  );
}

function ItemCollapsing(
  props: PropsWithChildren<{ defaultOpenStartPath?: string }>,
) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isOpen = props.defaultOpenStartPath
    ? pathname.startsWith(props.defaultOpenStartPath)
    : true;

  useEffect(() => {
    if (isOpen) {
      setOpen(isOpen);
    }
  }, [isOpen]);

  return (
    <Collapsible
      defaultOpen={isOpen}
      onOpenChange={setOpen}
      open={open}
      className="group/collapsible"
    >
      {props.children}
    </Collapsible>
  );
}
