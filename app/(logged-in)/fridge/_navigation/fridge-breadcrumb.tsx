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

const ROUTE_LABELS: Record<string, string> = {
  fridge: "Mon Frigo",
  timer: "Minuteur",
  recipes: "Recettes",
  settings: "Paramètres",
  sharing: "Partage",
  billing: "Abonnement",
};

export function FridgeBreadcrumb() {
  const pathname = usePathname();

  const paths = pathname.split("/").filter(Boolean);
  const basePath = "/fridge";

  return (
    <Breadcrumb>
      <BreadcrumbList className="border-border bg-background rounded-lg border px-3 py-2 shadow-sm shadow-black/5">
        <BreadcrumbItem>
          <BreadcrumbLink href={basePath}>
            <Home size={16} strokeWidth={2} aria-hidden="true" />
            <span className="sr-only">Mon Frigo</span>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {paths.length > 1 && <BreadcrumbSeparator />}
        {paths.slice(1).map((path, index) => {
          const isLast = index === paths.slice(1).length - 1;
          const currentPath = `/${paths.slice(0, index + 2).join("/")}`;
          const displayName = ROUTE_LABELS[path] ?? path;

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
