import { cn } from "@/lib/utils";
import {
  type FreshnessStatus,
  getFreshnessColorClass,
} from "../lib/freshness-calculator";

type FreshnessBadgeProps = {
  status: FreshnessStatus;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const statusLabels: Record<FreshnessStatus, string> = {
  "extra-fresh": "Extra-fresh",
  fresh: "Fresh",
  "cook-thoroughly": "Cook thoroughly",
  expired: "Expired",
};

export function FreshnessBadge({
  status,
  showLabel = true,
  size = "md",
  className,
}: FreshnessBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        getFreshnessColorClass(status),
        sizeClasses[size],
        className,
      )}
    >
      <span
        className={cn(
          "rounded-full",
          size === "sm" && "size-1.5",
          size === "md" && "size-2",
          size === "lg" && "size-2.5",
          "bg-current opacity-80",
        )}
      />
      {showLabel && statusLabels[status]}
    </span>
  );
}
