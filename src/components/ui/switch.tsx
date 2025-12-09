"use client";

import type * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <div className="relative inline-flex">
      {/* Neubrutalist white offset */}
      <div className="absolute top-0.5 left-0.5 h-6 w-11 rounded-full bg-white/90 dark:bg-white/30" />
      <SwitchPrimitive.Root
        data-slot="switch"
        className={cn(
          "peer border-foreground/20 relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors",
          "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "data-[state=checked]:bg-fresh-extra data-[state=unchecked]:bg-muted",
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className={cn(
            "bg-background border-foreground/10 pointer-events-none block size-5 rounded-full border-2 shadow-sm transition-transform",
            "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
          )}
        />
      </SwitchPrimitive.Root>
    </div>
  );
}

export { Switch };
