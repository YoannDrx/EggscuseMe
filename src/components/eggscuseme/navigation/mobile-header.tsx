"use client";

import { Button } from "@/components/ui/button";
import { Eggy, type EggyMood } from "@/features/mascot";
import { useBackNavigation } from "@/hooks/use-back-navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export type MobileHeaderProps = {
  /** Page title */
  title: string;
  /** Optional subtitle shown below title */
  subtitle?: string;
  /** Override back button visibility (defaults to automatic detection) */
  showBack?: boolean;
  /** Custom back href (defaults to intelligent parent route) */
  backHref?: string;
  /** Content to show on the right side (e.g., avatar, action button) */
  rightAction?: ReactNode;
  /** Show Eggy mascot on the left */
  mascot?: boolean;
  /** Eggy mood when mascot is shown */
  mascotMood?: EggyMood;
  /** Make header transparent (for hero sections) */
  transparent?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Center the title */
  centerTitle?: boolean;
};

/**
 * Standardized mobile header component
 * - Sticky with backdrop blur
 * - Smart back navigation
 * - Optional mascot
 * - Slot for right action
 */
export function MobileHeader({
  title,
  subtitle,
  showBack: showBackProp,
  backHref: backHrefProp,
  rightAction,
  mascot = false,
  mascotMood = "happy",
  transparent = false,
  className,
  centerTitle = false,
}: MobileHeaderProps) {
  const { showBack: autoShowBack, backHref: autoBackHref } =
    useBackNavigation();

  const showBack = showBackProp ?? autoShowBack;
  const backHref = backHrefProp ?? autoBackHref;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 md:hidden",
        "h-[var(--header-height-mobile)]",
        "flex items-center justify-between gap-3 px-4",
        "transition-colors duration-200",
        transparent
          ? "bg-transparent"
          : "border-nav-border bg-nav-bg border-b backdrop-blur-xl",
        className,
      )}
    >
      {/* Left section: Back button or Mascot */}
      <div className="flex min-w-[44px] items-center gap-2">
        {showBack && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="size-10 rounded-full"
              asChild
            >
              <Link href={backHref} aria-label="Retour">
                <ChevronLeft className="size-5" />
              </Link>
            </Button>
          </motion.div>
        )}
        {mascot && !showBack && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: "spring" }}
          >
            <Eggy mood={mascotMood} size="sm" />
          </motion.div>
        )}
      </div>

      {/* Center section: Title */}
      <div
        className={cn(
          "flex flex-1 flex-col overflow-hidden",
          centerTitle ? "items-center text-center" : "items-start",
        )}
      >
        <motion.h1
          className="text-foreground max-w-full truncate text-lg font-bold"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className="text-muted-foreground max-w-full truncate text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2, delay: 0.15 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Right section: Action slot */}
      <div className="flex min-w-[44px] items-center justify-end">
        {rightAction && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
          >
            {rightAction}
          </motion.div>
        )}
      </div>
    </header>
  );
}

/**
 * Simple header for settings pages (icon + title + description)
 */
export function MobilePageHeader({
  icon,
  title,
  description,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-4 md:hidden", className)}>
      {icon && (
        <div className="bg-primary/10 flex size-12 shrink-0 items-center justify-center rounded-2xl">
          {icon}
        </div>
      )}
      <div className="flex-1">
        <h1 className="font-heading text-xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        )}
      </div>
    </div>
  );
}
