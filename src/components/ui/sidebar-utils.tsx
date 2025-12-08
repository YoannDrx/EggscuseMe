"use client";

import type { NavigationGroup } from "@/features/navigation/navigation.type";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import type { SidebarMenuButtonProps } from "./sidebar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./sidebar";

export const SidebarMenuButtonLink = ({
  href,
  children,
  ...props
}: SidebarMenuButtonProps & { href: string }) => {
  const pathname = usePathname();

  return (
    <SidebarMenuButton {...props} asChild isActive={pathname === href}>
      <Link prefetch={true} href={href}>
        {children}
      </Link>
    </SidebarMenuButton>
  );
};

export const SidebarSubButtonLink = ({
  href,
  children,
  ...props
}: ComponentProps<typeof SidebarMenuSubButton> & { href: string }) => {
  const pathname = usePathname();

  return (
    <SidebarMenuSubButton {...props} asChild isActive={pathname === href}>
      <Link prefetch={true} href={href}>
        {children}
      </Link>
    </SidebarMenuSubButton>
  );
};

export const SidebarNavigationMenu = (props: { link: NavigationGroup }) => {
  const { link } = props;
  const t = useTranslations("fridge.nav");

  return (
    <SidebarMenu>
      {link.links.map((item) => {
        if (item.links) {
          return (
            <Collapsible
              defaultOpen
              key={item.labelKey}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <SidebarMenuButtonLink href={item.href}>
                  <item.Icon />
                  <span>{t(item.labelKey)}</span>
                  <CollapsibleTrigger className="ml-auto">
                    <ChevronRight className="text-muted-foreground ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarMenuButtonLink>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.links.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.labelKey}>
                        <SidebarSubButtonLink href={subItem.href}>
                          <subItem.Icon />
                          <span>{t(subItem.labelKey)}</span>
                        </SidebarSubButtonLink>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        }

        return (
          <SidebarMenuItem key={item.labelKey}>
            <SidebarMenuButtonLink href={item.href}>
              <item.Icon />
              <span>{t(item.labelKey)}</span>
            </SidebarMenuButtonLink>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};
