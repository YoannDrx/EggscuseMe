"use client";

import {
  NeoBreadcrumb,
  NeoBreadcrumbList,
  NeoBreadcrumbItem,
  NeoBreadcrumbLink,
  NeoBreadcrumbPage,
  NeoBreadcrumbSeparator,
  NeoBreadcrumbHome,
} from "@/components/neo/neo-breadcrumb";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { useTranslations } from "next-intl";

const ROUTE_LABEL_KEYS = {
  fridge: "myFridge",
  timer: "timer",
  recipes: "recipes",
  settings: "settings",
  sharing: "sharing",
  billing: "billing",
} as const;

export function FridgeBreadcrumb() {
  const t = useTranslations("fridge.nav");
  const pathname = usePathname();

  const paths = pathname.split("/").filter(Boolean);
  const basePath = "/fridge";

  return (
    <NeoBreadcrumb>
      <NeoBreadcrumbList className="bg-neo-card border-neo-border/30 rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)] px-3 py-2 shadow-[var(--shadow-neo-sm)]">
        <NeoBreadcrumbItem>
          <NeoBreadcrumbHome href={basePath} aria-label={t("myFridge")} />
        </NeoBreadcrumbItem>
        {paths.length > 1 && <NeoBreadcrumbSeparator />}
        {paths.slice(1).map((path, index) => {
          const isLast = index === paths.slice(1).length - 1;
          const currentPath = `/${paths.slice(0, index + 2).join("/")}`;
          const labelKey =
            path in ROUTE_LABEL_KEYS
              ? ROUTE_LABEL_KEYS[path as keyof typeof ROUTE_LABEL_KEYS]
              : null;
          const displayName = labelKey ? t(labelKey) : path;

          return (
            <Fragment key={path + index}>
              <NeoBreadcrumbItem>
                {isLast ? (
                  <NeoBreadcrumbPage className="flex items-center gap-2">
                    {displayName}
                  </NeoBreadcrumbPage>
                ) : (
                  <NeoBreadcrumbLink
                    href={currentPath}
                    className="flex items-center gap-2"
                  >
                    {displayName}
                  </NeoBreadcrumbLink>
                )}
              </NeoBreadcrumbItem>
              {!isLast && <NeoBreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </NeoBreadcrumbList>
    </NeoBreadcrumb>
  );
}
