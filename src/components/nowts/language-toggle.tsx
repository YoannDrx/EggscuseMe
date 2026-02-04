"use client";

import type { Locale } from "@/i18n/config";
import { setLocale } from "@/i18n/locale.action";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { NeoToggle } from "./neo-toggle";

type LanguageToggleProps = {
  className?: string;
};

export function LanguageToggle({ className }: LanguageToggleProps) {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (locale: Locale) => {
    startTransition(async () => {
      await setLocale(locale);
      router.refresh();
    });
  };

  return (
    <NeoToggle
      value={currentLocale}
      options={["fr", "en"]}
      onChange={handleChange}
      disabled={isPending}
      className={className}
      renderOption={(option, isActive) => (
        <span
          className={cn(
            "text-sm font-bold uppercase transition-colors duration-200",
            isActive ? "text-neo-accent-foreground" : "text-neo-text-muted",
          )}
        >
          {option}
        </span>
      )}
    />
  );
}
