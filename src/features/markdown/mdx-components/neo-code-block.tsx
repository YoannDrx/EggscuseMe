import { cn } from "@/lib/utils";
import { Terminal } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

type PreProps = ComponentPropsWithoutRef<"pre">;
type CodeProps = ComponentPropsWithoutRef<"code">;

export function NeoCodeBlock({ children, className, ...props }: PreProps) {
  return (
    <div
      className={cn(
        "border-neo-border bg-neo-bg my-6 overflow-hidden",
        "rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)]",
        "shadow-[var(--shadow-neo-md)]",
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "border-neo-border bg-neo-card flex items-center gap-2",
          "border-b-[length:var(--border-neo)] px-4 py-2",
        )}
      >
        <Terminal className="text-neo-accent size-4" />
        <span className="text-neo-text-muted text-xs font-medium">Code</span>
      </div>
      {/* Code content */}
      <pre
        className={cn(
          "overflow-x-auto p-4",
          "text-sm leading-relaxed",
          "[&>code]:bg-transparent [&>code]:p-0",
          className,
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}

export function NeoInlineCode({ children, className, ...props }: CodeProps) {
  // Check if this is inside a pre (code block) - if so, don't style it
  return (
    <code
      className={cn(
        "bg-neo-accent/10 text-neo-accent",
        "rounded-[var(--radius-neo-sm)] px-1.5 py-0.5",
        "border-neo-border border-[length:var(--border-neo)]",
        "font-mono text-sm",
        className,
      )}
      {...props}
    >
      {children}
    </code>
  );
}
