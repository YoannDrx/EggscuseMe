"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Shield, Leaf, Sparkles, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

type BadgeVariant = "safe" | "eco" | "premium" | "rating";

type FloatingBadgeProps = {
  variant: BadgeVariant;
  className?: string;
  delay?: number;
};

const badgeStyles: Record<
  BadgeVariant,
  {
    icon: LucideIcon;
    bgColor: string;
    iconColor: string;
    hasSubtext: boolean;
  }
> = {
  safe: {
    icon: Shield,
    bgColor: "bg-emerald-500/10 border-emerald-500/30",
    iconColor: "text-emerald-400",
    hasSubtext: false,
  },
  eco: {
    icon: Leaf,
    bgColor: "bg-green-500/10 border-green-500/30",
    iconColor: "text-green-400",
    hasSubtext: false,
  },
  premium: {
    icon: Sparkles,
    bgColor: "bg-amber-500/10 border-amber-500/30",
    iconColor: "text-amber-400",
    hasSubtext: false,
  },
  rating: {
    icon: Star,
    bgColor: "bg-yellow-500/10 border-yellow-500/30",
    iconColor: "text-yellow-400",
    hasSubtext: true,
  },
};

export function FloatingBadge({
  variant,
  className,
  delay = 0,
}: FloatingBadgeProps) {
  const t = useTranslations("landing.floatingBadge");
  const style = badgeStyles[variant];
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className={cn(
        "animate-badge-float rounded-2xl border px-4 py-2.5 backdrop-blur-sm",
        style.bgColor,
        className,
      )}
      style={{ animationDelay: `${delay * 1000}ms` }}
    >
      <div className="flex items-center gap-2">
        <Icon className={cn("size-4", style.iconColor)} />
        <div className="flex flex-col">
          <span className="text-foreground text-sm font-semibold">
            {t(variant)}
          </span>
          {style.hasSubtext && (
            <span className="text-muted-foreground text-[10px]">
              {t("ratingSubtext")}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function FloatingBadgeGroup({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0", className)}>
      {/* Top Left */}
      <FloatingBadge
        variant="safe"
        className="absolute top-1/4 left-0"
        delay={0.5}
      />

      {/* Top Right */}
      <FloatingBadge
        variant="rating"
        className="absolute top-1/3 right-0"
        delay={0.7}
      />

      {/* Bottom Left */}
      <FloatingBadge
        variant="eco"
        className="absolute bottom-1/4 left-4"
        delay={0.9}
      />

      {/* Bottom Right */}
      <FloatingBadge
        variant="premium"
        className="absolute right-4 bottom-1/3"
        delay={1.1}
      />
    </div>
  );
}
