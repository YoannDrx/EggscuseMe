import { cn } from "@/lib/utils";
import { Link as LinkIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

type HeadingProps = ComponentPropsWithoutRef<"h1">;

function createHeadingId(children: React.ReactNode): string {
  if (typeof children === "string") {
    return children
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();
  }
  return "";
}

export function NeoH1({ children, className, ...props }: HeadingProps) {
  const id = createHeadingId(children);
  return (
    <h1
      id={id}
      className={cn(
        "font-heading text-neo-text scroll-mt-24",
        "text-3xl font-bold tracking-tight md:text-4xl",
        "mt-10 mb-6 first:mt-0",
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function NeoH2({ children, className, ...props }: HeadingProps) {
  const id = createHeadingId(children);
  return (
    <h2
      id={id}
      className={cn(
        "font-heading text-neo-text group scroll-mt-24",
        "text-2xl font-bold tracking-tight md:text-3xl",
        "mt-10 mb-4 first:mt-0",
        "relative",
        className,
      )}
      {...props}
    >
      <span className="relative">
        {children}
        <span
          className={cn(
            "bg-neo-accent/30 absolute -bottom-1 left-0 h-1 w-full",
            "rounded-full",
          )}
        />
      </span>
      {id && (
        <a
          href={`#${id}`}
          className={cn(
            "text-neo-text-muted hover:text-neo-accent",
            "ml-2 opacity-0 transition-opacity group-hover:opacity-100",
            "inline-flex items-center",
          )}
          aria-label="Link to this section"
        >
          <LinkIcon className="size-4" />
        </a>
      )}
    </h2>
  );
}

export function NeoH3({ children, className, ...props }: HeadingProps) {
  const id = createHeadingId(children);
  return (
    <h3
      id={id}
      className={cn(
        "font-heading text-neo-text scroll-mt-24",
        "text-xl font-bold tracking-tight md:text-2xl",
        "mt-8 mb-3 first:mt-0",
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function NeoH4({ children, className, ...props }: HeadingProps) {
  const id = createHeadingId(children);
  return (
    <h4
      id={id}
      className={cn(
        "font-heading text-neo-text scroll-mt-24",
        "text-lg font-bold tracking-tight md:text-xl",
        "mt-6 mb-2 first:mt-0",
        className,
      )}
      {...props}
    >
      {children}
    </h4>
  );
}

export function NeoH5({ children, className, ...props }: HeadingProps) {
  return (
    <h5
      className={cn(
        "font-heading text-neo-text",
        "text-base font-bold tracking-tight md:text-lg",
        "mt-4 mb-2 first:mt-0",
        className,
      )}
      {...props}
    >
      {children}
    </h5>
  );
}

export function NeoH6({ children, className, ...props }: HeadingProps) {
  return (
    <h6
      className={cn(
        "font-heading text-neo-text",
        "text-sm font-bold tracking-widest uppercase",
        "mt-4 mb-2 first:mt-0",
        className,
      )}
      {...props}
    >
      {children}
    </h6>
  );
}
