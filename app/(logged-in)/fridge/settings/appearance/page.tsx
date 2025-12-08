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
import { cn } from "@/lib/utils";
import { ChevronLeft, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

const themes = [
  {
    value: "light",
    label: "Clair",
    description: "Interface lumineuse",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Sombre",
    description: "Interface sombre",
    icon: Moon,
  },
  {
    value: "system",
    label: "Système",
    description: "Suit les préférences système",
    icon: Monitor,
  },
] as const;

export default function AppearancePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Éviter le flash de contenu non hydraté
  useEffect(() => {
    setMounted(true);
  }, []);

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
          <h1 className="font-heading text-2xl font-bold">Apparence</h1>
          <p className="text-muted-foreground">
            Personnalisez l&apos;apparence de l&apos;application
          </p>
        </div>
      </div>

      {/* Theme Selection */}
      <Card variant="sunny">
        <CardHeader>
          <CardTitle className="font-heading">Thème</CardTitle>
          <CardDescription>
            Choisissez le thème qui vous convient le mieux
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
                      {themeOption.label}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {themeOption.description}
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
          <CardTitle className="font-heading">Aperçu</CardTitle>
          <CardDescription>
            Voici à quoi ressemble votre interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 rounded-xl border border-stone-800 bg-stone-900/50 p-4">
            <Eggy mood="happy" size="md" />
            <div className="flex-1">
              <p className="font-medium">Mon Frigo</p>
              <p className="text-muted-foreground text-sm">
                3 boîtes d&apos;œufs en cours
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
