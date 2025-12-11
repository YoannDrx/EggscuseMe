import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type UlProps = ComponentPropsWithoutRef<"ul">;
type OlProps = ComponentPropsWithoutRef<"ol">;
type LiProps = ComponentPropsWithoutRef<"li">;

export function NeoUl({ children, className, ...props }: UlProps) {
  return (
    <ul
      className={cn(
        "my-4 ml-6 list-none space-y-2",
        "[&>li]:relative [&>li]:pl-6",
        "[&>li]:before:bg-neo-accent [&>li]:before:absolute [&>li]:before:top-2.5 [&>li]:before:left-0",
        "[&>li]:before:size-2 [&>li]:before:rounded-full",
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  );
}

export function NeoOl({ children, className, ...props }: OlProps) {
  return (
    <ol
      className={cn(
        "my-4 ml-6 list-none space-y-2",
        "[counter-reset:list-counter]",
        "[&>li]:relative [&>li]:pl-8",
        "[&>li]:before:text-neo-accent [&>li]:before:absolute [&>li]:before:left-0",
        "[&>li]:before:font-bold [&>li]:before:[counter-increment:list-counter]",
        "[&>li]:before:content-[counter(list-counter)'.']",
        className,
      )}
      {...props}
    >
      {children}
    </ol>
  );
}

export function NeoLi({ children, className, ...props }: LiProps) {
  return (
    <li className={cn("text-neo-text leading-relaxed", className)} {...props}>
      {children}
    </li>
  );
}
