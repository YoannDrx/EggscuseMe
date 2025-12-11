"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type DemoPhoneContainerProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Container that applies the inverted theme for the demo phone.
 * When the site is in dark mode, this container shows light mode, and vice versa.
 */
export function DemoPhoneContainer({
  children,
  className,
}: DemoPhoneContainerProps) {
  return (
    <div
      className={cn(
        "demo-phone-container",
        "bg-neo-bg text-neo-text",
        "flex h-full w-full flex-col font-sans",
        className,
      )}
    >
      {children}
    </div>
  );
}
