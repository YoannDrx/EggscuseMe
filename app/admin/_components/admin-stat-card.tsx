import {
  NeoCard,
  NeoCardContent,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type AdminStatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
};

const variantStyles = {
  default: {
    icon: "text-muted-foreground",
    value: "text-foreground",
  },
  success: {
    icon: "text-fresh-extra",
    value: "text-fresh-extra",
  },
  warning: {
    icon: "text-fresh-cook",
    value: "text-fresh-cook",
  },
  danger: {
    icon: "text-destructive",
    value: "text-destructive",
  },
};

export function AdminStatCard({
  title,
  value,
  description,
  icon: Icon,
  variant = "default",
  className,
}: AdminStatCardProps) {
  const styles = variantStyles[variant];

  return (
    <NeoCard className={className}>
      <NeoCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <NeoCardTitle className="text-muted-foreground text-xs font-medium">
          {title}
        </NeoCardTitle>
        <Icon className={cn("size-4", styles.icon)} />
      </NeoCardHeader>
      <NeoCardContent>
        <div className={cn("text-2xl font-bold", styles.value)}>{value}</div>
        {description && (
          <p className="text-muted-foreground text-xs">{description}</p>
        )}
      </NeoCardContent>
    </NeoCard>
  );
}

export type AdminStatsGridProps = {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 6;
  className?: string;
};

const gridColumns = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
};

export function AdminStatsGrid({
  children,
  columns = 4,
  className,
}: AdminStatsGridProps) {
  return (
    <div className={cn("grid gap-4", gridColumns[columns], className)}>
      {children}
    </div>
  );
}
