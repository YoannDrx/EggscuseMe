import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

export type NeoStatCardProps = {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: number; // Positive = green, negative = red
  trendLabel?: string;
  className?: string;
};

const NeoStatCard = ({
  title,
  value,
  icon,
  trend,
  trendLabel,
  className,
}: NeoStatCardProps) => {
  const hasTrend = trend !== undefined && trend !== 0;
  const isPositiveTrend = trend !== undefined && trend > 0;

  return (
    <div
      data-slot="neo-stat-card"
      className={cn(
        "bg-neo-card",
        "border-neo-border/20 border-[length:var(--border-neo)]",
        "rounded-[var(--radius-neo-2xl)]",
        "shadow-[var(--shadow-neo-md)]",
        "p-5",
        "flex flex-col gap-2",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <span className="text-neo-text-muted text-xs font-bold tracking-wider uppercase">
          {title}
        </span>
        {icon && <span className="text-neo-accent">{icon}</span>}
      </div>

      {/* Value */}
      <div className="flex items-end gap-2">
        <span className="text-neo-text text-3xl font-black">{value}</span>

        {/* Trend indicator */}
        {hasTrend && (
          <div
            className={cn(
              "mb-1 flex items-center gap-0.5 text-xs font-bold",
              isPositiveTrend ? "text-emerald-500" : "text-red-500",
            )}
          >
            {isPositiveTrend ? (
              <TrendingUp size={14} strokeWidth={3} />
            ) : (
              <TrendingDown size={14} strokeWidth={3} />
            )}
            <span>
              {isPositiveTrend ? "+" : ""}
              {trend}%
            </span>
          </div>
        )}
      </div>

      {/* Trend label */}
      {trendLabel && (
        <span className="text-neo-text-muted text-xs">{trendLabel}</span>
      )}
    </div>
  );
};

export { NeoStatCard };
