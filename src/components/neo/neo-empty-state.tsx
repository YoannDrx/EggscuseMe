"use client";

import type { LucideIcon } from "lucide-react";
import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

export type NeoEmptyStateProps = {
  icon?: LucideIcon;
  title?: string;
  message?: string;
  action?: React.ReactNode;
  className?: string;
};

const NeoEmptyState = ({
  icon: Icon = Info,
  title,
  message = "Nothing to see here",
  action,
  className,
}: NeoEmptyStateProps) => {
  return (
    <div
      data-slot="neo-empty-state"
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        className,
      )}
    >
      {/* Icon container */}
      <div
        className={cn(
          "mb-4 flex size-16 items-center justify-center rounded-full",
          "border-neo-border/20 border-[length:var(--border-neo)]",
          "bg-neo-bg",
        )}
      >
        <Icon size={32} className="text-neo-text-muted" />
      </div>

      {/* Title */}
      {title && (
        <h3 className="text-neo-text mb-1 text-lg font-bold">{title}</h3>
      )}

      {/* Message */}
      <p className="text-neo-text-muted max-w-sm font-medium">{message}</p>

      {/* Action */}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export { NeoEmptyState };
