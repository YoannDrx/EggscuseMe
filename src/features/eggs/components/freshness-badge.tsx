"use client";

import { NeoBadge } from "@/components/neo/neo-badge";
import { cn } from "@/lib/utils";
import { Egg } from "lucide-react";
import { useTranslations } from "next-intl";
import { type FreshnessStatus } from "../lib/freshness-calculator";

type FreshnessBadgeProps = {
  status: FreshnessStatus;
  showLabel?: boolean;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const statusToKey: Record<FreshnessStatus, string> = {
  "extra-fresh": "extraFresh",
  fresh: "fresh",
  "cook-thoroughly": "cookThoroughly",
  expired: "expired",
};

const statusToBadgeVariant: Record<
  FreshnessStatus,
  "fresh-extra" | "fresh" | "fresh-cook" | "expired"
> = {
  "extra-fresh": "fresh-extra",
  fresh: "fresh",
  "cook-thoroughly": "fresh-cook",
  expired: "expired",
};

export function FreshnessBadge({
  status,
  showLabel = true,
  showIcon = true,
  size = "md",
  className,
}: FreshnessBadgeProps) {
  const t = useTranslations("freshness");
  return (
    <NeoBadge
      variant={statusToBadgeVariant[status]}
      size={size}
      icon={
        showIcon ? (
          <Egg className={cn(status === "expired" && "opacity-60")} />
        ) : undefined
      }
      className={className}
    >
      {showLabel && t(statusToKey[status])}
    </NeoBadge>
  );
}
