import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";
import type { ReactNode } from "react";

type CalloutVariant = "info" | "warning" | "error" | "success";

type NeoCalloutProps = {
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
};

const VARIANT_STYLES: Record<
  CalloutVariant,
  { bg: string; border: string; icon: string; Icon: typeof Info }
> = {
  info: {
    bg: "bg-blue-500/10",
    border: "border-l-blue-500",
    icon: "text-blue-500",
    Icon: Info,
  },
  warning: {
    bg: "bg-yellow-500/10",
    border: "border-l-yellow-500",
    icon: "text-yellow-500",
    Icon: AlertTriangle,
  },
  error: {
    bg: "bg-red-500/10",
    border: "border-l-red-500",
    icon: "text-red-500",
    Icon: AlertCircle,
  },
  success: {
    bg: "bg-green-500/10",
    border: "border-l-green-500",
    icon: "text-green-500",
    Icon: CheckCircle,
  },
};

export function NeoCallout({
  variant = "info",
  title,
  children,
}: NeoCalloutProps) {
  const styles = VARIANT_STYLES[variant];
  const IconComponent = styles.Icon;

  return (
    <div
      className={cn(
        "border-neo-border my-6",
        "rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)]",
        "border-l-4",
        styles.bg,
        styles.border,
        "p-4 shadow-[var(--shadow-neo-sm)]",
      )}
    >
      <div className="flex gap-3">
        <IconComponent className={cn("mt-0.5 size-5 flex-none", styles.icon)} />
        <div className="min-w-0 flex-1">
          {title && <p className="text-neo-text mb-1 font-bold">{title}</p>}
          <div className="text-neo-text-muted text-sm [&>p]:m-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
