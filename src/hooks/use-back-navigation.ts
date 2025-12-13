"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";

type BackNavigationResult = {
  /** The URL to navigate back to */
  backHref: string;
  /** Whether the back button should be shown */
  showBack: boolean;
  /** Function to navigate back */
  goBack: () => void;
  /** The parent route (one level up) */
  parentRoute: string;
  /** Whether we're at a root route */
  isRootRoute: boolean;
};

/** Routes where back button should not be shown */
const ROOT_ROUTES = ["/fridge", "/", "/auth/signin", "/auth/signup"];

/** Route hierarchy mapping for intelligent back navigation */
const ROUTE_PARENTS: Record<string, string> = {
  "/fridge/timer": "/fridge",
  "/fridge/recipes": "/fridge",
  "/fridge/statistics": "/fridge",
  "/fridge/history": "/fridge",
  "/fridge/settings": "/fridge",
  "/fridge/settings/profile": "/fridge/settings",
  "/fridge/settings/security": "/fridge/settings",
  "/fridge/settings/appearance": "/fridge/settings",
  "/fridge/settings/sharing": "/fridge/settings",
  "/fridge/settings/notifications": "/fridge/settings",
  "/fridge/settings/billing": "/fridge/settings",
  "/fridge/settings/danger": "/fridge/settings",
};

/**
 * Hook to handle intelligent back navigation
 * Determines the appropriate back destination based on current route
 */
export function useBackNavigation(): BackNavigationResult {
  const pathname = usePathname();
  const router = useRouter();

  const { backHref, parentRoute, isRootRoute, showBack } = useMemo(() => {
    // Check if current route is a root route
    const isRoot = ROOT_ROUTES.includes(pathname);

    // Check for explicit parent mapping
    const explicitParent = ROUTE_PARENTS[pathname];

    // Calculate parent by removing last segment
    const segments = pathname.split("/").filter(Boolean);
    const calculatedParent =
      segments.length > 1 ? `/${segments.slice(0, -1).join("/")}` : "/fridge";

    // Handle dynamic routes (e.g., /fridge/recipes/[id])
    const isDynamicChild =
      segments.length > 2 &&
      !ROUTE_PARENTS[pathname] &&
      segments[0] === "fridge";

    let parent: string;
    if (explicitParent) {
      parent = explicitParent;
    } else if (isDynamicChild) {
      // For dynamic routes like /fridge/recipes/123, go back to /fridge/recipes
      parent = `/${segments.slice(0, 2).join("/")}`;
    } else {
      parent = calculatedParent;
    }

    return {
      backHref: parent,
      parentRoute: parent,
      isRootRoute: isRoot,
      showBack: !isRoot,
    };
  }, [pathname]);

  const goBack = useCallback(() => {
    router.push(backHref);
  }, [router, backHref]);

  return {
    backHref,
    showBack,
    goBack,
    parentRoute,
    isRootRoute,
  };
}

/**
 * Get the back href for a given pathname (utility function for server components)
 */
export function getBackHref(pathname: string): string {
  // Check for explicit parent mapping
  const explicitParent = ROUTE_PARENTS[pathname];
  if (explicitParent) {
    return explicitParent;
  }

  // Calculate parent by removing last segment
  const segments = pathname.split("/").filter(Boolean);

  // Handle dynamic routes
  if (segments.length > 2 && segments[0] === "fridge") {
    return `/${segments.slice(0, 2).join("/")}`;
  }

  return segments.length > 1
    ? `/${segments.slice(0, -1).join("/")}`
    : "/fridge";
}
