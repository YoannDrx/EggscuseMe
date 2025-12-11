import { LandingHeader } from "@/features/landing/landing-header";
import { Footer } from "@/features/layout/footer";
import type { PropsWithChildren } from "react";

export default function PublicLayout({ children }: PropsWithChildren) {
  return (
    <div className="bg-background relative flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
    </div>
  );
}
