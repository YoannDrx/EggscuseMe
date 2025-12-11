import { cn } from "@/lib/utils";
import { Footer } from "@/features/layout/footer";
import { LandingHeader } from "@/features/landing/landing-header";
import type { ReactNode } from "react";
import { DocSidebar } from "./_components/doc-sidebar";
import { getDocs } from "./doc-manager";

export default async function RouteLayout(props: { children: ReactNode }) {
  const docs = await getDocs();

  return (
    <div className="bg-neo-bg relative flex min-h-screen flex-col">
      <LandingHeader />
      <div className="flex flex-1 pt-20">
        <div className="mx-auto flex w-full max-w-7xl gap-8 px-4 py-8">
          {/* Sidebar */}
          <aside
            className={cn(
              "border-neo-border bg-neo-card",
              "sticky top-24 h-fit w-[260px] shrink-0 self-start",
              "rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)]",
              "p-4 shadow-[var(--shadow-neo-md)]",
              "hidden lg:block",
            )}
          >
            <DocSidebar docs={docs} currentSlug="" />
          </aside>
          {/* Main content */}
          <main className="min-w-0 flex-1">{props.children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
