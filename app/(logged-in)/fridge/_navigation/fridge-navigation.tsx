import { BottomNavBar } from "@/components/eggscuseme/navigation/bottom-nav-bar";
import {
  NeoSidebarProvider,
  NeoSidebarInset,
  NeoSidebarTrigger,
} from "@/components/neo/neo-sidebar";

import type { PropsWithChildren } from "react";
import { FridgeBreadcrumb } from "./fridge-breadcrumb";
import { FridgeSidebar } from "./fridge-sidebar";

type FridgeNavigationProps = PropsWithChildren<{
  role: "OWNER" | "GUEST";
}>;

export function FridgeNavigation({ children, role }: FridgeNavigationProps) {
  const isOwner = role === "OWNER";

  return (
    <NeoSidebarProvider>
      <FridgeSidebar role={role} />
      <NeoSidebarInset className="border-neo-border">
        {/* Desktop Header - Hidden on mobile */}
        <header className="hidden h-16 shrink-0 items-center gap-2 md:flex">
          <div className="flex w-full items-center gap-2 px-[var(--space-page-x)] md:px-8 lg:px-12 xl:px-16">
            <NeoSidebarTrigger className="bg-neo-bg text-neo-text border-neo-border/20 size-9 cursor-pointer rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)] p-2 shadow-[var(--shadow-neo-sm)] transition-all duration-200 outline-none hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-md)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
              <svg
                className="size-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M9 3v18" />
              </svg>
            </NeoSidebarTrigger>
            <FridgeBreadcrumb />
          </div>
        </header>

        {/* Main Content - No padding on mobile */}
        <div className="flex flex-1 flex-col gap-4 p-0 pb-24 md:px-8 md:pb-8 lg:px-12 xl:px-16">
          {children}
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNavBar isOwner={isOwner} />
      </NeoSidebarInset>
    </NeoSidebarProvider>
  );
}
