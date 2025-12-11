"use client";

import { ChevronRight, Home } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

// Breadcrumb Root
export type NeoBreadcrumbProps = React.ComponentProps<"nav">;

const NeoBreadcrumb = React.forwardRef<HTMLElement, NeoBreadcrumbProps>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      data-slot="neo-breadcrumb"
      className={cn("flex items-center", className)}
      {...props}
    />
  ),
);
NeoBreadcrumb.displayName = "NeoBreadcrumb";

// Breadcrumb List
const NeoBreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentProps<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    data-slot="neo-breadcrumb-list"
    className={cn("flex flex-wrap items-center gap-1.5", className)}
    {...props}
  />
));
NeoBreadcrumbList.displayName = "NeoBreadcrumbList";

// Breadcrumb Item
const NeoBreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-slot="neo-breadcrumb-item"
    className={cn("flex items-center gap-1.5", className)}
    {...props}
  />
));
NeoBreadcrumbItem.displayName = "NeoBreadcrumbItem";

// Breadcrumb Link
export type NeoBreadcrumbLinkProps = React.ComponentProps<"a"> & {
  asChild?: boolean;
};

const NeoBreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  NeoBreadcrumbLinkProps
>(({ className, asChild, ...props }, ref) => (
  <a
    ref={ref}
    data-slot="neo-breadcrumb-link"
    className={cn(
      "text-neo-text-muted text-sm font-medium",
      "transition-colors duration-200",
      "hover:text-neo-text",
      "focus-visible:text-neo-text outline-none",
      className,
    )}
    {...props}
  />
));
NeoBreadcrumbLink.displayName = "NeoBreadcrumbLink";

// Breadcrumb Page (current page, not a link)
const NeoBreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-current="page"
    aria-disabled="true"
    data-slot="neo-breadcrumb-page"
    className={cn("text-neo-text text-sm font-medium", className)}
    {...props}
  />
));
NeoBreadcrumbPage.displayName = "NeoBreadcrumbPage";

// Breadcrumb Separator
const NeoBreadcrumbSeparator = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <span
    role="presentation"
    aria-hidden="true"
    data-slot="neo-breadcrumb-separator"
    className={cn("text-neo-text-muted", className)}
  >
    {children ?? <ChevronRight className="size-4" />}
  </span>
);

// Breadcrumb Home (shortcut for home icon link)
const NeoBreadcrumbHome = React.forwardRef<
  HTMLAnchorElement,
  Omit<NeoBreadcrumbLinkProps, "children">
>(({ className, ...props }, ref) => (
  <NeoBreadcrumbLink ref={ref} className={className} {...props}>
    <Home className="size-4" />
    <span className="sr-only">Home</span>
  </NeoBreadcrumbLink>
));
NeoBreadcrumbHome.displayName = "NeoBreadcrumbHome";

export {
  NeoBreadcrumb,
  NeoBreadcrumbList,
  NeoBreadcrumbItem,
  NeoBreadcrumbLink,
  NeoBreadcrumbPage,
  NeoBreadcrumbSeparator,
  NeoBreadcrumbHome,
};
