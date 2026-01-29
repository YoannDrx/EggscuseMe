"use client";

import { cn } from "@/lib/utils";

type ScanlineOverlayProps = {
  className?: string;
};

export function ScanlineOverlay({ className }: ScanlineOverlayProps) {
  return (
    <div
      className={cn("pointer-events-none fixed inset-0 z-50", className)}
      style={{
        background: `repeating-linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.15) 0px,
          rgba(0, 0, 0, 0.15) 1px,
          transparent 1px,
          transparent 3px
        )`,
      }}
    />
  );
}
