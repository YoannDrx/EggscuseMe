"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const neoAlertVariants = cva(
  // Base styles - Sticker-like alert
  [
    "relative flex gap-3",
    "rounded-[var(--radius-neo-xl)]",
    "border-[length:var(--border-neo)]",
    "p-4",
    "transition-all duration-200",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-neo-card text-neo-text",
          "border-neo-border/30",
          "shadow-[var(--shadow-neo-md)]",
        ].join(" "),
        info: [
          "bg-info/10 text-info",
          "border-info/50",
          "shadow-[3px_3px_0px_var(--info)]",
        ].join(" "),
        success: [
          "bg-success/10 text-success",
          "border-success/50",
          "shadow-[3px_3px_0px_var(--success)]",
        ].join(" "),
        warning: [
          "bg-warning/10 text-warning-foreground",
          "border-warning/50",
          "shadow-[3px_3px_0px_var(--warning)]",
        ].join(" "),
        destructive: [
          "bg-destructive/10 text-destructive",
          "border-destructive/50",
          "shadow-[3px_3px_0px_var(--destructive)]",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const iconMap = {
  default: Info,
  info: Info,
  success: CheckCircle,
  warning: AlertCircle,
  destructive: XCircle,
};

export type NeoAlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof neoAlertVariants> & {
    title?: string;
    icon?: React.ReactNode;
    dismissible?: boolean;
    onDismiss?: () => void;
  };

const NeoAlert = React.forwardRef<HTMLDivElement, NeoAlertProps>(
  (
    {
      className,
      variant = "default",
      title,
      icon,
      dismissible,
      onDismiss,
      children,
      ...props
    },
    ref,
  ) => {
    const IconComponent = iconMap[variant ?? "default"];
    const displayIcon = icon ?? <IconComponent size={20} strokeWidth={2.5} />;

    return (
      <div
        ref={ref}
        role="alert"
        data-slot="neo-alert"
        className={cn(neoAlertVariants({ variant, className }))}
        {...props}
      >
        <div className="mt-0.5 shrink-0">{displayIcon}</div>

        <div className="min-w-0 flex-1">
          {title && <h5 className="mb-1 text-sm font-bold">{title}</h5>}
          <div className="text-sm opacity-90">{children}</div>
        </div>

        {dismissible && (
          <button
            onClick={onDismiss}
            className={cn(
              "shrink-0 rounded-lg p-1",
              "hover:bg-black/10 dark:hover:bg-white/10",
              "transition-colors duration-150",
            )}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        )}
      </div>
    );
  },
);

NeoAlert.displayName = "NeoAlert";

export { NeoAlert, neoAlertVariants };
