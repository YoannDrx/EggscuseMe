import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

type BlockquoteProps = ComponentPropsWithoutRef<"blockquote">;

export function NeoBlockquote({
  children,
  className,
  ...props
}: BlockquoteProps) {
  return (
    <blockquote
      className={cn(
        "border-neo-border bg-neo-card relative my-6",
        "rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)]",
        "border-l-neo-accent border-l-4",
        "p-5 pl-6 shadow-[var(--shadow-neo-sm)]",
        "rotate-[-0.3deg]",
        className,
      )}
      {...props}
    >
      <Quote
        className={cn(
          "text-neo-accent/20 absolute -top-2 -left-2 size-8",
          "rotate-[-10deg]",
        )}
      />
      <div className="text-neo-text-muted italic [&>p]:m-0">{children}</div>
    </blockquote>
  );
}
