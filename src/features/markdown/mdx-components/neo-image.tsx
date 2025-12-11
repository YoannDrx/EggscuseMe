import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type ImageProps = ComponentPropsWithoutRef<"img"> & {
  caption?: string;
};

export function NeoImage({
  src,
  alt,
  caption,
  className,
  ...props
}: ImageProps) {
  return (
    <figure className="my-8">
      <div
        className={cn(
          "border-neo-border bg-neo-card overflow-hidden",
          "rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)]",
          "shadow-[var(--shadow-neo-lg)]",
        )}
      >
        { }
        <img
          src={src}
          alt={alt ?? ""}
          className={cn("h-auto w-full object-cover", className)}
          {...props}
        />
      </div>
      {(caption ?? alt) && (
        <figcaption
          className={cn("text-neo-text-muted mt-3 text-center text-sm italic")}
        >
          {caption ?? alt}
        </figcaption>
      )}
    </figure>
  );
}
