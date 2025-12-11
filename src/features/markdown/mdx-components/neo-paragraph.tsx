import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type ParagraphProps = ComponentPropsWithoutRef<"p">;

export function NeoParagraph({
  children,
  className,
  ...props
}: ParagraphProps) {
  return (
    <p
      className={cn(
        "text-neo-text my-4 leading-relaxed first:mt-0 last:mb-0",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}
