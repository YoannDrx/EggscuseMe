"use client";

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
import type { NavigationGroup } from "@/features/navigation/navigation.type";
import { SidebarUserButton } from "@/features/sidebar/sidebar-user-button";
import { SiteConfig } from "@/site-config";
import { ChevronDown, Egg } from "lucide-react";
import Link from "next/link";
import { getAccountNavigation } from "./account.links";

export function AccountSidebar() {
  const links: NavigationGroup[] = getAccountNavigation();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <Link
          href="/fridge"
          className="hover:bg-accent flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors"
        >
          <Egg className="size-5" />
          <span className="font-semibold">{SiteConfig.title}</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {links.map((link) => (
          <SidebarGroup key={link.title}>
            <SidebarGroupLabel>
              {link.title}
              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarNavigationMenu link={link} />
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-2">
        <SidebarUserButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
