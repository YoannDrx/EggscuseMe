"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Eggy } from "@/features/mascot";
import { setLocale } from "@/i18n/locale.action";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import { ChevronLeft, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

const themes = [
  {
    value: "light",
    label: {
      fr: "Clair",
      en: "Light",
    },
    description: {
      fr: "Interface lumineuse",
      en: "Light interface",
    },
    icon: Sun,
  },
  {
    value: "dark",
    label: {
      fr: "Sombre",
      en: "Dark",
    },
    description: {
      fr: "Interface sombre",
      en: "Dark interface",
    },
    icon: Moon,
  },
  {
    value: "system",
    label: {
      fr: "Système",
      en: "System",
    },
    description: {
      fr: "Suit les préférences système",
      en: "Follows system preference",
    },
    icon: Monitor,
  },
] as const;

const languages = [
  {
    value: "fr" as Locale,
    label: "Français",
    description: {
      fr: "Interface en français",
      en: "French interface",
    },
    flag: "🇫🇷",
  },
  {
    value: "en" as Locale,
    label: "English",
    description: {
      fr: "Interface en anglais",
      en: "English interface",
    },
    flag: "🇬🇧",
  },
] as const;

export default function AppearancePage() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Éviter le flash de contenu non hydraté
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (newLocale: Locale) => {
    startTransition(async () => {
      await setLocale(newLocale);
      router.refresh();
    });
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-stone-800" />
        <div className="h-64 animate-pulse rounded-xl border border-stone-800 bg-stone-900" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/fridge/settings"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ChevronLeft className="size-4" />
        Retour aux paramètres
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Eggy mood="happy" size="lg" />
        <div>
          <h1 className="font-heading text-2xl font-bold">
            {locale === "fr" ? "Apparence" : "Appearance"}
          </h1>
          <p className="text-muted-foreground">
            {locale === "fr"
              ? "Personnalisez l'apparence de l'application"
              : "Customize the app appearance"}
          </p>
        </div>
      </div>

      {/* Theme Selection */}
      <Card variant="sunny">
        <CardHeader>
          <CardTitle className="font-heading">
            {locale === "fr" ? "Thème" : "Theme"}
          </CardTitle>
          <CardDescription>
            {locale === "fr"
              ? "Choisissez le thème qui vous convient le mieux"
              : "Choose the theme that suits you"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={theme}
            onValueChange={setTheme}
            className="grid gap-4 sm:grid-cols-3"
          >
            {themes.map((themeOption) => {
              const Icon = themeOption.icon;
              const isSelected = theme === themeOption.value;
              const label = themeOption.label[locale === "fr" ? "fr" : "en"];
              const description =
                themeOption.description[locale === "fr" ? "fr" : "en"];

              return (
                <Label
                  key={themeOption.value}
                  htmlFor={themeOption.value}
                  className={cn(
                    "flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-stone-900/50 hover:border-stone-700",
                  )}
                >
                  <RadioGroupItem
                    value={themeOption.value}
                    id={themeOption.value}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full transition-colors",
                      isSelected
                        ? "bg-primary/20 text-primary"
                        : "bg-stone-800 text-stone-400",
                    )}
                  >
                    <Icon className="size-6" />
                  </div>
                  <div className="text-center">
                    <p
                      className={cn(
                        "font-medium",
                        isSelected ? "text-primary" : "text-foreground",
                      )}
                    >
                      {label}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {description}
                    </p>
                  </div>
                </Label>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Language Selection */}
      <Card variant="sunny">
        <CardHeader>
          <CardTitle className="font-heading">
            {locale === "fr" ? "Langue" : "Language"}
          </CardTitle>
          <CardDescription>
            {locale === "fr"
              ? "Choisissez la langue de l'interface"
              : "Choose the interface language"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={locale}
            onValueChange={(value) => handleLanguageChange(value as Locale)}
            className="grid gap-4 sm:grid-cols-2"
            disabled={isPending}
          >
            {languages.map((lang) => {
              const isSelected = locale === lang.value;
              const description =
                lang.description[locale === "fr" ? "fr" : "en"];

              return (
                <Label
                  key={lang.value}
                  htmlFor={`lang-${lang.value}`}
                  className={cn(
                    "flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-transparent bg-stone-900/50 hover:border-stone-700",
                    isPending && "pointer-events-none opacity-50",
                  )}
                >
                  <RadioGroupItem
                    value={lang.value}
                    id={`lang-${lang.value}`}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full text-2xl transition-colors",
                      isSelected ? "bg-primary/20" : "bg-stone-800",
                    )}
                  >
                    {lang.flag}
                  </div>
                  <div className="text-center">
                    <p
                      className={cn(
                        "font-medium",
                        isSelected ? "text-primary" : "text-foreground",
                      )}
                    >
                      {lang.label}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {description}
                    </p>
                  </div>
                </Label>
              );
            })}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card variant="sunny">
        <CardHeader>
          <CardTitle className="font-heading">
            {locale === "fr" ? "Aperçu" : "Preview"}
          </CardTitle>
          <CardDescription>
            {locale === "fr"
              ? "Voici à quoi ressemble votre interface"
              : "Here is how your interface looks"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 rounded-xl border border-stone-800 bg-stone-900/50 p-4">
            <Eggy mood="happy" size="md" />
            <div className="flex-1">
              <p className="font-medium">
                {locale === "fr" ? "Mon Frigo" : "My Fridge"}
              </p>
              <p className="text-muted-foreground text-sm">
                {locale === "fr"
                  ? "3 boîtes d'œufs en cours"
                  : "3 egg boxes in progress"}
              </p>
            </div>
            <div className="flex gap-2">
              <div className="bg-fresh-extra size-3 rounded-full" />
              <div className="bg-fresh size-3 rounded-full" />
              <div className="bg-fresh-cook size-3 rounded-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
