"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Locale, localeNames, locales } from "@/i18n/config";
import { setLocale } from "@/i18n/locale.action";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type LanguageSwitcherProps = {
  variant?: "dropdown" | "inline";
  className?: string;
};

export function LanguageSwitcher({
  variant = "dropdown",
  className,
}: LanguageSwitcherProps) {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (locale: Locale) => {
    startTransition(async () => {
      await setLocale(locale);
      router.refresh();
    });
  };

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {locales.map((locale) => (
          <Button
            key={locale}
            variant={currentLocale === locale ? "default" : "ghost"}
            size="sm"
            onClick={() => handleLocaleChange(locale)}
            disabled={isPending}
            className="px-2"
          >
            {locale.toUpperCase()}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={className}
          disabled={isPending}
        >
          <Globe className="size-4" />
          <span className="sr-only">
            {localeNames[currentLocale]} - Change language
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={cn(
              "cursor-pointer",
              currentLocale === locale && "bg-accent",
            )}
          >
            <span className="font-medium">{localeNames[locale]}</span>
            <span className="text-muted-foreground ml-auto text-xs">
              {locale.toUpperCase()}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
