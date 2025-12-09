"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
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
    <Breadcrumb>
      <BreadcrumbList className="border-border bg-background rounded-lg border px-3 py-2 shadow-sm shadow-black/5">
        <BreadcrumbItem>
          <BreadcrumbLink href={basePath}>
            <Home size={16} strokeWidth={2} aria-hidden="true" />
            <span className="sr-only">{t("myFridge")}</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {paths.length > 1 && <BreadcrumbSeparator />}
        {paths.slice(1).map((path, index) => {
          const isLast = index === paths.slice(1).length - 1;
          const currentPath = `/${paths.slice(0, index + 2).join("/")}`;
          const displayName = ROUTE_LABEL_KEYS[path as keyof typeof ROUTE_LABEL_KEYS]
            ? t(ROUTE_LABEL_KEYS[path as keyof typeof ROUTE_LABEL_KEYS])
            : path;

          return (
            <Fragment key={path + index}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="flex items-center gap-2">
                    {displayName}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={currentPath}
                    className="flex items-center gap-2"
                  >
                    {displayName}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
