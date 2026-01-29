"use client";

import { cn } from "@/lib/utils";

type CheckeredPatternProps = {
  className?: string;
};

export function CheckeredPattern({ className }: CheckeredPatternProps) {
  return (
    <div
      className={cn("absolute inset-0 opacity-20", className)}
      style={{
        backgroundImage: `
          linear-gradient(45deg, var(--diner-checkered-dark) 25%, transparent 25%),
          linear-gradient(-45deg, var(--diner-checkered-dark) 25%, transparent 25%),
          linear-gradient(45deg, transparent 75%, var(--diner-checkered-dark) 75%),
          linear-gradient(-45deg, transparent 75%, var(--diner-checkered-dark) 75%)
        `,
        backgroundSize: "40px 40px",
        backgroundPosition: "0 0, 0 20px, 20px -20px, -20px 0px",
      }}
    />
  );
}
