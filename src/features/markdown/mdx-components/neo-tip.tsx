import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";
import type { ReactNode } from "react";

type NeoTipProps = {
  children: ReactNode;
};

export function NeoTip({ children }: NeoTipProps) {
  return (
    <div
      className={cn(
        "border-neo-border bg-neo-accent/10 my-6",
        "rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)]",
        "p-4 shadow-[var(--shadow-neo-sm)]",
      )}
    >
      <div className="flex gap-3">
        <Lightbulb className="text-neo-accent mt-0.5 size-5 flex-none" />
        <div className="text-neo-text min-w-0 flex-1 text-sm [&>p]:m-0">
          {children}
        </div>
      </div>
    </div>
  );
}
