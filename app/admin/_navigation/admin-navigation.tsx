import {
  NeoSidebarInset,
  NeoSidebarProvider,
  NeoSidebarTrigger,
} from "@/components/neo";
import { Layout } from "@/features/page/layout";
import type { PropsWithChildren } from "react";
import { AdminSidebar } from "./admin-sidebar";

export async function AdminNavigation({ children }: PropsWithChildren) {
  return (
    <NeoSidebarProvider>
      <AdminSidebar />
      <NeoSidebarInset>
        <header className="border-neo-border/20 bg-neo-bg flex h-16 shrink-0 items-center gap-2 border-b-[length:var(--border-neo)]">
          <Layout size="lg" className="flex items-center gap-2">
            <NeoSidebarTrigger className="border-neo-border/20 hover:bg-neo-card size-9 cursor-pointer rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)]">
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </NeoSidebarTrigger>
            <div className="flex items-center gap-2">
              <span className="text-neo-text font-semibold">Admin Panel</span>
            </div>
          </Layout>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </NeoSidebarInset>
    </NeoSidebarProvider>
  );
}
