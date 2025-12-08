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
        "relative flex h-9 w-[72px] items-center rounded-full p-1 transition-colors",
        "bg-muted",
        isPending && "opacity-50",
        className,
      )}
      aria-label={isFrench ? "Switch to English" : "Passer en français"}
    >
      {/* Language labels */}
      <div className="flex w-full items-center justify-between px-2">
        <span
          className={cn(
            "text-xs font-semibold transition-colors",
            isFrench ? "text-primary" : "text-muted-foreground",
          )}
        >
          FR
        </span>
        <span
          className={cn(
            "text-xs font-semibold transition-colors",
            !isFrench ? "text-primary" : "text-muted-foreground",
          )}
        >
          EN
        </span>
      </div>

      {/* Sliding pill */}
      <div
        className={cn(
          "bg-background absolute top-1 size-7 rounded-full shadow-sm transition-all duration-200",
          isFrench ? "left-1" : "left-[calc(100%-32px)]",
        )}
      />
    </button>
  );
}
