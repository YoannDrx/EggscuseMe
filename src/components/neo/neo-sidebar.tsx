"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

// Context for sidebar state
type SidebarContextValue = {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  mobile: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebarContext() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "Sidebar components must be used within a NeoSidebarProvider",
    );
  }
  return context;
}

// Provider
export type NeoSidebarProviderProps = {
  children: React.ReactNode;
  defaultExpanded?: boolean;
  breakpoint?: number;
};

const NeoSidebarProvider = ({
  children,
  defaultExpanded = true,
  breakpoint = 768,
}: NeoSidebarProviderProps) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobile, setMobile] = React.useState(false);

  // Detect mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setMobile(window.innerWidth < breakpoint);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [breakpoint]);

  // Close mobile sidebar on escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileOpen]);

  return (
    <SidebarContext.Provider
      value={{ expanded, setExpanded, mobile, mobileOpen, setMobileOpen }}
    >
      <div className="flex min-h-svh w-full md:h-svh md:overflow-visible">
        {children}
      </div>
    </SidebarContext.Provider>
  );
};

// Sidebar variants
const neoSidebarVariants = cva(
  [
    "flex flex-col",
    "bg-neo-card",
    "border-r-[length:var(--border-neo)] border-neo-border/20",
    "transition-all duration-300 ease-out",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "",
        elevated: "shadow-[var(--shadow-neo-lg)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// Sidebar Root
export type NeoSidebarProps = React.ComponentProps<"aside"> &
  VariantProps<typeof neoSidebarVariants> & {
    collapsedWidth?: number;
    expandedWidth?: number;
  };

const NeoSidebar = React.forwardRef<HTMLElement, NeoSidebarProps>(
  (
    {
      className,
      variant,
      collapsedWidth = 72,
      expandedWidth = 260,
      children,
      ...props
    },
    ref,
  ) => {
    const { expanded, mobile, mobileOpen, setMobileOpen } = useSidebarContext();

    // Mobile version - slide-over drawer
    if (mobile) {
      return (
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              />
              {/* Sidebar */}
              <motion.aside
                data-slot="neo-sidebar"
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                className={cn(
                  neoSidebarVariants({ variant }),
                  "fixed inset-y-0 left-0 z-50",
                  "w-[280px]",
                  "shadow-[var(--shadow-neo-xl)]",
                  className,
                )}
              >
                {/* Close button */}
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "absolute top-3 right-3",
                    "rounded-full p-2",
                    "bg-neo-bg text-neo-text-muted",
                    "border-neo-border/20 border-[length:var(--border-neo)]",
                    "shadow-[var(--shadow-neo-sm)]",
                    "hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-md)]",
                    "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
                    "transition-all duration-200",
                  )}
                >
                  <X className="size-5" />
                </button>
                {children}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      );
    }

    // Desktop version - collapsible
    return (
      <aside
        ref={ref}
        data-slot="neo-sidebar"
        style={{ width: expanded ? expandedWidth : collapsedWidth }}
        className={cn(
          neoSidebarVariants({ variant, className }),
          "md:sticky md:top-0 md:self-start md:shadow-[var(--shadow-neo-xl)] md:mb-4 md:max-h-[calc(100vh-20px)] md:min-h-[calc(100vh-20px)] md:overflow-hidden md:border-r-transparent",
        )}
        {...props}
      >
        {children}
      </aside>
    );
  },
);
NeoSidebar.displayName = "NeoSidebar";

// Sidebar Header
const NeoSidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  const { expanded, mobile } = useSidebarContext();

  return (
    <div
      ref={ref}
      data-slot="neo-sidebar-header"
      className={cn(
        "border-neo-border/10 flex h-16 items-center gap-3 border-b px-4",
        !expanded && !mobile && "justify-center",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});
NeoSidebarHeader.displayName = "NeoSidebarHeader";

// Sidebar Content
const NeoSidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="neo-sidebar-content"
    className={cn("flex-1 overflow-y-auto p-3", className)}
    {...props}
  />
));
NeoSidebarContent.displayName = "NeoSidebarContent";

// Sidebar Footer
const NeoSidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="neo-sidebar-footer"
    className={cn("border-neo-border/10 border-t p-3", className)}
    {...props}
  />
));
NeoSidebarFooter.displayName = "NeoSidebarFooter";

// Sidebar Group
export type NeoSidebarGroupProps = React.ComponentProps<"div"> & {
  label?: string;
};

const NeoSidebarGroup = React.forwardRef<HTMLDivElement, NeoSidebarGroupProps>(
  ({ className, label, children, ...props }, ref) => {
    const { expanded, mobile } = useSidebarContext();
    const showLabel = label && (expanded || mobile);

    return (
      <div
        ref={ref}
        data-slot="neo-sidebar-group"
        className={cn("space-y-1", className)}
        {...props}
      >
        {showLabel && (
          <div className="text-neo-text-muted mb-2 px-3 text-xs font-bold tracking-wide uppercase">
            {label}
          </div>
        )}
        {children}
      </div>
    );
  },
);
NeoSidebarGroup.displayName = "NeoSidebarGroup";

// Sidebar Item
export type NeoSidebarItemProps = React.ComponentProps<"button"> & {
  icon?: LucideIcon;
  active?: boolean;
  badge?: React.ReactNode;
};

const NeoSidebarItem = React.forwardRef<HTMLButtonElement, NeoSidebarItemProps>(
  (
    { className, icon: Icon, active = false, badge, children, ...props },
    ref,
  ) => {
    const { expanded, mobile } = useSidebarContext();
    const showText = expanded || mobile;

    return (
      <button
        ref={ref}
        type="button"
        data-slot="neo-sidebar-item"
        className={cn(
          "group relative flex w-full items-center gap-3",
          "rounded-[var(--radius-neo-lg)] px-3 py-3",
          "text-sm font-medium",
          "outline-none",
          "transition-all duration-200",
          // Active state
          active
            ? [
                "bg-neo-accent/10 text-neo-accent",
                "border-neo-accent/30 border-[length:var(--border-neo)]",
                "shadow-[var(--shadow-neo-sm)]",
              ]
            : [
                "text-neo-text-muted",
                "border border-transparent",
                "hover:bg-neo-bg hover:text-neo-text",
              ],
          // Press effect on hover items
          !active && [
            "hover:border-neo-border/20",
            "hover:shadow-[var(--shadow-neo-sm)]",
            "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
          ],
          // Center icon when collapsed
          !showText && "justify-center",
          className,
        )}
        {...props}
      >
        {Icon && (
          <Icon
            className={cn(
              "size-5 shrink-0",
              active
                ? "text-neo-accent"
                : "text-neo-text-muted group-hover:text-neo-text",
            )}
          />
        )}
        {showText && <span className="flex-1 text-left">{children}</span>}
        {showText && badge && <span className="shrink-0">{badge}</span>}
      </button>
    );
  },
);
NeoSidebarItem.displayName = "NeoSidebarItem";

// Sidebar Toggle Button
const NeoSidebarToggle = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { expanded, setExpanded, mobile } = useSidebarContext();

  if (mobile) return null;

  return (
    <button
      ref={ref}
      type="button"
      data-slot="neo-sidebar-toggle"
      onClick={() => setExpanded(!expanded)}
      className={cn(
        "absolute top-20 -right-3",
        "flex size-6 items-center justify-center",
        "rounded-full",
        "bg-neo-card text-neo-text-muted",
        "border-neo-border/30 border-[length:var(--border-neo)]",
        "shadow-[var(--shadow-neo-sm)]",
        "hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-md)]",
        "active:translate-x-[1px] active:translate-y-[1px] active:shadow-none",
        "transition-all duration-200",
        className,
      )}
      {...props}
    >
      {expanded ? (
        <ChevronLeft className="size-4" />
      ) : (
        <ChevronRight className="size-4" />
      )}
    </button>
  );
});
NeoSidebarToggle.displayName = "NeoSidebarToggle";

// Mobile trigger button
export type NeoSidebarTriggerProps = React.ComponentProps<"button">;

const NeoSidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  NeoSidebarTriggerProps
>(({ className, children, ...props }, ref) => {
  const { setMobileOpen, mobile, expanded, setExpanded } = useSidebarContext();

  return (
    <button
      ref={ref}
      type="button"
      data-slot="neo-sidebar-trigger"
      onClick={() => {
        if (mobile) {
          setMobileOpen(true);
        } else {
          setExpanded(!expanded);
        }
      }}
      className={cn("outline-none", className)}
      {...props}
    >
      {children}
    </button>
  );
});
NeoSidebarTrigger.displayName = "NeoSidebarTrigger";

// Inset content area
const NeoSidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="neo-sidebar-inset"
    className={cn("flex-1 overflow-auto min-h-0", className)}
    {...props}
  />
));
NeoSidebarInset.displayName = "NeoSidebarInset";

export {
  NeoSidebarProvider,
  NeoSidebar,
  NeoSidebarHeader,
  NeoSidebarContent,
  NeoSidebarFooter,
  NeoSidebarGroup,
  NeoSidebarItem,
  NeoSidebarToggle,
  NeoSidebarTrigger,
  NeoSidebarInset,
  useSidebarContext,
};
