import { BottomNavBar } from "@/components/eggscuseme/navigation/bottom-nav-bar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Layout } from "@/features/page/layout";
import type { PropsWithChildren } from "react";
import { FridgeBreadcrumb } from "./fridge-breadcrumb";
import { FridgeSidebar } from "./fridge-sidebar";

type FridgeNavigationProps = PropsWithChildren<{
  role: "OWNER" | "GUEST";
}>;

export function FridgeNavigation({ children, role }: FridgeNavigationProps) {
  const isOwner = role === "OWNER";

  return (
    <SidebarProvider>
      <FridgeSidebar role={role} />
      <SidebarInset className="border-accent border">
        {/* Desktop Header - Hidden on mobile */}
        <header className="hidden h-16 shrink-0 items-center gap-2 md:flex">
          <Layout size="lg" className="flex items-center gap-2">
            <SidebarTrigger
              size="lg"
              variant="outline"
              className="size-9 cursor-pointer"
            />
            <FridgeBreadcrumb />
          </Layout>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>

        {/* Mobile Bottom Navigation */}
        <BottomNavBar isOwner={isOwner} />
      </SidebarInset>
    </SidebarProvider>
  );
}
