"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Eggy, type EggyMood } from "@/features/mascot/components/eggy";
import { useThemeColors } from "../theme";

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  eggyMood?: EggyMood;
  showEggy?: boolean;
  action?: ReactNode;
  className?: string;
};

export function PageHeader({
  title,
  subtitle,
  eggyMood = "happy",
  showEggy = true,
  action,
  className,
}: PageHeaderProps) {
  const colors = useThemeColors();

  return (
    <header
      className={cn("flex items-center justify-between px-4 py-2", className)}
    >
      <div className="flex-1">
        <h2 className={cn("text-3xl font-bold", colors.text)}>{title}</h2>
        {subtitle && (
          <p className={cn("text-sm", colors.textMuted)}>{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {action}
        {showEggy && <Eggy mood={eggyMood} size="sm" />}
      </div>
    </header>
  );
}
