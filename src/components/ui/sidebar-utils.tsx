"use client";

import type { NavigationGroup } from "@/features/navigation/navigation.type";
import { useSidebarContext } from "@/components/neo/neo-sidebar";
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Neo-style menu item link
export const NeoMenuItemLink = ({
  href,
  icon: Icon,
  children,
  className,
}: {
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}) => {
  const pathname = usePathname();
  const { expanded, mobile } = useSidebarContext();
  const isActive = pathname === href;
  const showText = expanded || mobile;

  return (
    <Link href={href} prefetch={true}>
      <div
        className={cn(
          "group relative flex w-full items-center gap-3",
          "rounded-[var(--radius-neo-lg)] px-3 py-2.5",
          "text-sm font-medium",
          "outline-none",
          "transition-all duration-200",
          isActive
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
          className,
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              "size-5 shrink-0",
              isActive
                ? "text-neo-accent"
                : "text-neo-text-muted group-hover:text-neo-text",
            )}
          />
        )}
        {showText && <span className="flex-1 text-left">{children}</span>}
      </div>
    </Link>
  );
};

// Neo-style sub item link
export const NeoSubItemLink = ({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} prefetch={true}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-[var(--radius-neo-md)] px-3 py-2 text-sm",
          "transition-all duration-200",
          isActive
            ? "bg-neo-accent/10 text-neo-accent font-medium"
            : "text-neo-text-muted hover:bg-neo-bg hover:text-neo-text",
        )}
      >
        {Icon && <Icon className="size-4 shrink-0" />}
        <span>{children}</span>
      </div>
    </Link>
  );
};

export const SidebarNavigationMenu = (props: {
  link: NavigationGroup;
  translationKey?: string;
}) => {
  const { link, translationKey = "fridge.nav" } = props;
  const t = useTranslations(translationKey);

  return (
    <div className="space-y-1">
      {link.links.map((item) => {
        if (item.links) {
          return (
            <Collapsible
              defaultOpen
              key={item.labelKey}
              className="group/collapsible"
            >
              <div>
                <NeoMenuItemLink href={item.href} icon={item.Icon}>
                  {t(item.labelKey)}
                </NeoMenuItemLink>

                <CollapsibleContent>
                  <div className="border-neo-border/20 mt-1 ml-4 space-y-1 border-l-2 pl-2">
                    {item.links.map((subItem) => (
                      <NeoSubItemLink
                        key={subItem.labelKey}
                        href={subItem.href}
                        icon={subItem.Icon}
                      >
                        {t(subItem.labelKey)}
                      </NeoSubItemLink>
                    ))}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        }

        return (
          <NeoMenuItemLink
            key={item.labelKey}
            href={item.href}
            icon={item.Icon}
          >
            {t(item.labelKey)}
          </NeoMenuItemLink>
        );
      })}
    </div>
  );
};
