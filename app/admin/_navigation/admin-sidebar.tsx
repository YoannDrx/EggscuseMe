"use client";

import {
  NeoSidebar,
  NeoSidebarContent,
  NeoSidebarFooter,
  NeoSidebarGroup,
  NeoSidebarHeader,
  NeoSidebarItem,
} from "@/components/neo";
import type { NavigationGroup } from "@/features/navigation/navigation.type";
import { SidebarUserButton } from "@/features/sidebar/sidebar-user-button";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { getAdminNavigation } from "./admin-navigation.links";

export function AdminSidebar() {
  const t = useTranslations("admin.nav");
  const links: NavigationGroup[] = getAdminNavigation();
  const pathname = usePathname();

  const renderIcon = (
    icon: NavigationGroup["links"][0]["Icon"],
  ): LucideIcon => {
    return icon as LucideIcon;
  };

  return (
    <NeoSidebar>
      <NeoSidebarHeader>
        <div className="flex items-center gap-2">
          <div className="bg-neo-accent text-neo-accent-foreground flex size-8 items-center justify-center rounded-lg">
            <span className="text-sm font-semibold">A</span>
          </div>
          <span className="font-semibold">Admin Panel</span>
        </div>
      </NeoSidebarHeader>
      <NeoSidebarContent>
        {links.map((group) => (
          <NeoSidebarGroup key={group.titleKey} label={t(group.titleKey)}>
            {group.links.map((link) => (
              <Link key={link.href} href={link.href}>
                <NeoSidebarItem
                  active={pathname === link.href}
                  icon={renderIcon(link.Icon)}
                >
                  {t(link.labelKey)}
                </NeoSidebarItem>
              </Link>
            ))}
          </NeoSidebarGroup>
        ))}
      </NeoSidebarContent>
      <NeoSidebarFooter>
        <SidebarUserButton />
      </NeoSidebarFooter>
    </NeoSidebar>
  );
}
