"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, CheckCircle, Info, X, XCircle } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const neoToastVariants = cva(
  [
    "flex items-start gap-3 p-4 w-full max-w-sm",
    "rounded-[var(--radius-neo-xl)]",
    "border-[length:var(--border-neo)]",
    "shadow-[var(--shadow-neo-lg)]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-neo-card text-neo-text border-neo-border/30",
        success: "bg-success/10 text-success border-success/50",
        warning: "bg-warning/10 text-warning-foreground border-warning/50",
        error: "bg-destructive/10 text-destructive border-destructive/50",
        info: "bg-info/10 text-info border-info/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const iconMap = {
  default: Info,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
  info: Info,
};

export type NeoToastProps = VariantProps<typeof neoToastVariants> & {
  id?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
  onClose?: () => void;
  className?: string;
};

const NeoToast = React.forwardRef<HTMLDivElement, NeoToastProps>(
  (
    {
      variant = "default",
      title,
      description,
      icon,
      action,
      duration = 5000,
      onClose,
      className,
    },
    ref,
  ) => {
    const IconComponent = iconMap[variant ?? "default"];
    const displayIcon = icon ?? <IconComponent size={20} strokeWidth={2.5} />;

    // Auto dismiss
    React.useEffect(() => {
      if (duration && onClose) {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
      }
    }, [duration, onClose]);

    return (
      <motion.div
        ref={ref}
        layout
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        data-slot="neo-toast"
        className={cn(neoToastVariants({ variant, className }))}
      >
        <div className="mt-0.5 shrink-0">{displayIcon}</div>

        <div className="min-w-0 flex-1">
          {title && <p className="text-sm font-bold">{title}</p>}
          {description && (
            <p className="mt-0.5 text-sm opacity-80">{description}</p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                "mt-2 text-sm font-bold underline underline-offset-2",
                "transition-opacity hover:opacity-80",
              )}
            >
              {action.label}
            </button>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className={cn(
              "shrink-0 rounded-lg p-1",
              "hover:bg-black/10 dark:hover:bg-white/10",
              "transition-colors duration-150",
            )}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        )}
      </motion.div>
    );
  },
);

NeoToast.displayName = "NeoToast";

// Toast Container Component
type ToastContainerProps = {
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
  children: React.ReactNode;
};

const positionClasses = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
  "top-center": "top-4 left-1/2 -translate-x-1/2",
  "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
};

const NeoToastContainer: React.FC<ToastContainerProps> = ({
  position = "bottom-right",
  children,
}) => {
  return (
    <div
      className={cn(
        "fixed z-[var(--z-toast)] flex flex-col gap-3",
        positionClasses[position],
      )}
    >
      <AnimatePresence mode="popLayout">{children}</AnimatePresence>
    </div>
  );
};

export { NeoToast, NeoToastContainer, neoToastVariants };
