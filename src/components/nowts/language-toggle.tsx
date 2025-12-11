"use client";

import type { Locale } from "@/i18n/config";
import { setLocale } from "@/i18n/locale.action";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type LanguageToggleProps = {
  className?: string;
};

export function LanguageToggle({ className }: LanguageToggleProps) {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const nextLocale = currentLocale === "fr" ? "en" : "fr";
    startTransition(async () => {
      await setLocale(nextLocale);
      router.refresh();
    });
  };

  const isFrench = currentLocale === "fr";

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "relative flex h-9 w-[76px] items-center p-1 transition-all duration-200",
        "border-neo-border rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)]",
        "bg-neo-card shadow-[var(--shadow-neo-sm)]",
        "hover:shadow-[var(--shadow-neo-md)]",
        "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        isPending && "cursor-wait opacity-50",
        className,
      )}
      aria-label={isFrench ? "Switch to English" : "Passer en français"}
    >
      {/* Language labels */}
      <div className="relative z-10 grid w-full grid-cols-2 place-items-center px-2">
        <span
          className={cn(
            "text-xs font-bold transition-colors",
            isFrench ? "text-neo-accent" : "text-neo-text-muted",
          )}
        >
          FR
        </span>
        <span
          className={cn(
            "text-xs font-bold transition-colors",
            !isFrench ? "text-neo-accent" : "text-neo-text-muted",
          )}
        >
          EN
        </span>
      </div>

      {/* Sliding pill - Neo style */}
      <div
        className={cn(
          "absolute top-1/2 size-7 -translate-y-1/2 transition-all duration-200",
          "border-neo-border rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)]",
          "bg-neo-bg shadow-[2px_2px_0_var(--neo-shadow-color)]",
          isFrench ? "left-[10px]" : "left-[calc(100%-38px)]",
        )}
      />
    </button>
  );
}
