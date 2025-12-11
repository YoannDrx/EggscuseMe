"use client";

import type * as React from "react";

import { cn } from "@/lib/utils";

// App Shell - Main layout wrapper
export type NeoAppShellProps = {
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  bottomNav?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  sidebarWidth?: "sm" | "md" | "lg";
};

const NeoAppShell = ({
  header,
  sidebar,
  bottomNav,
  children,
  className,
  sidebarWidth = "md",
}: NeoAppShellProps) => {
  const sidebarWidths = {
    sm: "w-56",
    md: "w-64",
    lg: "w-72",
  };

  return (
    <div className={cn("bg-neo-bg flex min-h-screen", className)}>
      {/* Sidebar - Desktop only */}
      {sidebar && (
        <aside
          data-slot="neo-app-shell-sidebar"
          className={cn(
            "hidden flex-col md:flex",
            sidebarWidths[sidebarWidth],
            "border-neo-border/20 border-r-[length:var(--border-neo)]",
            "bg-neo-card",
            "shrink-0",
          )}
        >
          {sidebar}
        </aside>
      )}

      {/* Main content area */}
      <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
        {/* Header */}
        {header && (
          <header
            data-slot="neo-app-shell-header"
            className={cn(
              "h-16 shrink-0",
              "flex items-center px-4 lg:px-6",
              "border-neo-border/20 border-b-[length:var(--border-neo)]",
              "bg-neo-card",
              "sticky top-0 z-20",
            )}
          >
            {header}
          </header>
        )}

        {/* Main content */}
        <main
          data-slot="neo-app-shell-main"
          className={cn(
            "flex-1 overflow-y-auto",
            "p-4 md:p-6 lg:p-8",
            bottomNav && "pb-24 md:pb-6 lg:pb-8", // Extra padding for bottom nav
          )}
        >
          {children}
        </main>

        {/* Bottom Nav - Mobile only */}
        {bottomNav && (
          <div
            data-slot="neo-app-shell-bottom-nav"
            className="fixed inset-x-0 bottom-0 z-30 md:hidden"
          >
            {bottomNav}
          </div>
        )}
      </div>
    </div>
  );
};

// Sidebar components for NeoAppShell
export type NeoAppShellSidebarHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

const NeoAppShellSidebarHeader = ({
  children,
  className,
}: NeoAppShellSidebarHeaderProps) => (
  <div
    data-slot="neo-app-shell-sidebar-header"
    className={cn(
      "h-16 shrink-0",
      "flex items-center px-4",
      "border-neo-border/20 border-b-[length:var(--border-neo)]",
      className,
    )}
  >
    {children}
  </div>
);

export type NeoAppShellSidebarContentProps = {
  children: React.ReactNode;
  className?: string;
};

const NeoAppShellSidebarContent = ({
  children,
  className,
}: NeoAppShellSidebarContentProps) => (
  <div
    data-slot="neo-app-shell-sidebar-content"
    className={cn("flex-1 overflow-y-auto p-4", className)}
  >
    {children}
  </div>
);

export type NeoAppShellSidebarFooterProps = {
  children: React.ReactNode;
  className?: string;
};

const NeoAppShellSidebarFooter = ({
  children,
  className,
}: NeoAppShellSidebarFooterProps) => (
  <div
    data-slot="neo-app-shell-sidebar-footer"
    className={cn(
      "shrink-0 p-4",
      "border-neo-border/20 border-t-[length:var(--border-neo)]",
      className,
    )}
  >
    {children}
  </div>
);

export {
  NeoAppShell,
  NeoAppShellSidebarHeader,
  NeoAppShellSidebarContent,
  NeoAppShellSidebarFooter,
};
