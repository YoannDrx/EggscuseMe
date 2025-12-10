"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarNavigationMenu } from "@/components/ui/sidebar-utils";
import { ContactFeedbackPopover } from "@/features/contact/feedback/contact-feedback-popover";
import { Eggy } from "@/features/mascot";
import type { NavigationGroup } from "@/features/navigation/navigation.type";
import { SidebarUserButton } from "@/features/sidebar/sidebar-user-button";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { getFridgeNavigation } from "./fridge-navigation.links";

type FridgeSidebarProps = {
  role: "OWNER" | "GUEST";
};

export function FridgeSidebar({ role }: FridgeSidebarProps) {
  const t = useTranslations("fridge.nav");
  const links: NavigationGroup[] = getFridgeNavigation(role);

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="flex flex-col gap-2">
        <Link
          href="/fridge"
          className="hover:bg-accent flex items-center gap-2 rounded-lg p-2 transition-colors"
        >
          <Eggy mood="happy" size="sm" />
          <span className="font-heading text-lg font-semibold">EggscuseMe</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {links.map((link) => (
          <ItemCollapsing
            defaultOpenStartPath={link.defaultOpenStartPath}
            key={link.titleKey}
          >
            <SidebarGroup key={link.titleKey}>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger>
                  {t(link.titleKey)}
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarNavigationMenu link={link} />
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </ItemCollapsing>
        ))}
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-3">
        {role === "GUEST" && (
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <p className="text-muted-foreground">{t("guestNotice")}</p>
          </div>
        )}
        <ContactFeedbackPopover />
        <SidebarUserButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
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
