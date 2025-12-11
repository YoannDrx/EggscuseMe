import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type AnchorProps = ComponentPropsWithoutRef<"a">;

export function NeoLink({ href, children, className, ...props }: AnchorProps) {
  const isExternal = href?.startsWith("http");

  const linkClasses = cn(
    "text-neo-accent font-medium",
    "relative inline-flex items-center gap-1",
    "underline decoration-neo-accent/30 decoration-2 underline-offset-2",
    "hover:decoration-neo-accent transition-colors",
    className,
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClasses}
        {...props}
      >
        {children}
        <ExternalLink className="inline-block size-3.5" />
      </a>
    );
  }

  return (
    <Link href={href ?? "#"} className={linkClasses} {...props}>
      {children}
    </Link>
  );
}
