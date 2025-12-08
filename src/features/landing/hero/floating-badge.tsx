"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Shield, Leaf, Sparkles, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type BadgeVariant = "safe" | "eco" | "premium" | "rating";

type FloatingBadgeProps = {
  variant: BadgeVariant;
  className?: string;
  delay?: number;
};

const badgeConfig: Record<
  BadgeVariant,
  {
    icon: LucideIcon;
    text: string;
    subtext?: string;
    bgColor: string;
    iconColor: string;
  }
> = {
  safe: {
    icon: Shield,
    text: "100% Sur",
    bgColor: "bg-emerald-500/10 border-emerald-500/30",
    iconColor: "text-emerald-400",
  },
  eco: {
    icon: Leaf,
    text: "Anti-Gaspi",
    bgColor: "bg-green-500/10 border-green-500/30",
    iconColor: "text-green-400",
  },
  premium: {
    icon: Sparkles,
    text: "Premium",
    bgColor: "bg-amber-500/10 border-amber-500/30",
    iconColor: "text-amber-400",
  },
  rating: {
    icon: Star,
    text: "4.9/5",
    subtext: "App Store",
    bgColor: "bg-yellow-500/10 border-yellow-500/30",
    iconColor: "text-yellow-400",
  },
};

export function FloatingBadge({
  variant,
  className,
  delay = 0,
}: FloatingBadgeProps) {
  const config = badgeConfig[variant];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className={cn(
        "animate-badge-float rounded-2xl border px-4 py-2.5 backdrop-blur-sm",
        config.bgColor,
        className,
      )}
      style={{ animationDelay: `${delay * 1000}ms` }}
    >
      <div className="flex items-center gap-2">
        <Icon className={cn("size-4", config.iconColor)} />
        <div className="flex flex-col">
          <span className="text-foreground text-sm font-semibold">
            {config.text}
          </span>
          {config.subtext && (
            <span className="text-muted-foreground text-[10px]">
              {config.subtext}
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
