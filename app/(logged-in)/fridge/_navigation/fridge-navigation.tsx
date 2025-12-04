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
  return (
    <SidebarProvider>
      <FridgeSidebar role={role} />
      <SidebarInset className="border-accent border">
        <header className="flex h-16 shrink-0 items-center gap-2">
          <Layout size="lg" className="flex items-center gap-2">
            <SidebarTrigger
              size="lg"
              variant="outline"
              className="size-9 cursor-pointer"
            />
            <FridgeBreadcrumb />
          </Layout>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
