import { NeoButton } from "@/components/neo";
import { SiteConfig } from "@/site-config";
import { cn } from "@/lib/utils";
import {
  Egg,
  Heart,
  Leaf,
  Timer,
  Users,
  Sparkles,
  Target,
  Bell,
  ChefHat,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.about.meta");
  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "anti-gaspi",
      "oeufs",
      "fraîcheur",
      "gaspillage alimentaire",
      "eggs",
      "freshness",
    ],
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${SiteConfig.prodUrl}/about`,
      type: "website",
    },
  };
}

const STATS_ICONS = [Egg, Leaf, Timer, Heart];
const SOLUTION_ICONS = [Timer, ChefHat, Bell];
const VALUES_ICONS = [Leaf, Sparkles, Users];

export default async function AboutPage() {
  const t = await getTranslations("pages.about");

  const stats = [
    {
      value: t("stats.wasted.value"),
      label: t("stats.wasted.label"),
      Icon: STATS_ICONS[0],
    },
    {
      value: t("stats.daily.value"),
      label: t("stats.daily.label"),
      Icon: STATS_ICONS[1],
    },
    {
      value: t("stats.shelfLife.value"),
      label: t("stats.shelfLife.label"),
      Icon: STATS_ICONS[2],
    },
    {
      value: t("stats.free.value"),
      label: t("stats.free.label"),
      Icon: STATS_ICONS[3],
    },
  ];

  const solutions = [
    {
      title: t("solution.tracking.title"),
      description: t("solution.tracking.description"),
      Icon: SOLUTION_ICONS[0],
    },
    {
      title: t("solution.recipes.title"),
      description: t("solution.recipes.description"),
      Icon: SOLUTION_ICONS[1],
    },
    {
      title: t("solution.notifications.title"),
      description: t("solution.notifications.description"),
      Icon: SOLUTION_ICONS[2],
    },
  ];

  const values = [
    {
      title: t("values.antiWaste.title"),
      description: t("values.antiWaste.description"),
      Icon: VALUES_ICONS[0],
    },
    {
      title: t("values.simplicity.title"),
      description: t("values.simplicity.description"),
      Icon: VALUES_ICONS[1],
    },
    {
      title: t("values.family.title"),
      description: t("values.family.description"),
      Icon: VALUES_ICONS[2],
    },
  ];

  return (
    <div className="bg-neo-bg min-h-screen">
      {/* Hero Header */}
      <div
        className={cn(
          "border-neo-border bg-neo-card",
          "border-b-[length:var(--border-neo-lg)]",
          "shadow-[var(--shadow-neo-md)]",
        )}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-20 text-center">
          <div
            className={cn(
              "border-neo-border bg-neo-accent/10",
              "flex size-20 items-center justify-center",
              "rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)]",
              "shadow-[var(--shadow-neo-md)]",
            )}
          >
            <Target className="text-neo-accent size-10" />
          </div>
          <span className="text-neo-accent font-heading text-sm font-bold tracking-widest uppercase">
            {t("eyebrow")}
          </span>
          <h1 className="font-heading text-neo-text text-4xl font-bold tracking-tight md:text-6xl">
            {t("title")}
          </h1>
          <p className="text-neo-text-muted max-w-2xl text-lg md:text-xl">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="font-heading text-neo-text mb-8 text-center text-2xl font-bold md:text-3xl">
          {t("problem")}
        </h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "border-neo-border bg-neo-card",
                "rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)]",
                "p-6 shadow-[var(--shadow-neo-md)]",
                "text-center",
              )}
            >
              <div
                className={cn(
                  "border-neo-border bg-neo-accent/10",
                  "mx-auto mb-3 flex size-12 items-center justify-center",
                  "rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)]",
                )}
              >
                <stat.Icon className="text-neo-accent size-6" />
              </div>
              <p className="font-heading text-neo-accent text-3xl font-bold md:text-4xl">
                {stat.value}
              </p>
              <p className="text-neo-text-muted mt-1 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Solution Section */}
      <div
        className={cn(
          "border-neo-border bg-neo-card",
          "border-y-[length:var(--border-neo)]",
        )}
      >
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="mb-12 text-center">
            <h2 className="font-heading text-neo-text mb-4 text-2xl font-bold md:text-3xl">
              {t("solutionTitle")}
            </h2>
            <p className="text-neo-text-muted mx-auto max-w-2xl text-lg">
              {t("solutionSubtitle")}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {solutions.map((solution) => (
              <div
                key={solution.title}
                className={cn(
                  "border-neo-border bg-neo-bg",
                  "rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)]",
                  "p-6 shadow-[var(--shadow-neo-sm)]",
                  "transition-shadow hover:shadow-[var(--shadow-neo-md)]",
                )}
              >
                <div
                  className={cn(
                    "border-neo-border bg-neo-accent/10",
                    "mb-4 flex size-14 items-center justify-center",
                    "rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)]",
                  )}
                >
                  <solution.Icon className="text-neo-accent size-7" />
                </div>
                <h3 className="font-heading text-neo-text mb-2 text-xl font-bold">
                  {solution.title}
                </h3>
                <p className="text-neo-text-muted">{solution.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="font-heading text-neo-text mb-12 text-center text-2xl font-bold md:text-3xl">
          {t("valuesTitle")}
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="text-center">
              <div
                className={cn(
                  "border-neo-border bg-neo-accent/10",
                  "mx-auto mb-4 flex size-16 items-center justify-center",
                  "rounded-full border-[length:var(--border-neo)]",
                  "shadow-[var(--shadow-neo-sm)]",
                )}
              >
                <value.Icon className="text-neo-accent size-8" />
              </div>
              <h3 className="font-heading text-neo-text mb-2 text-xl font-bold">
                {value.title}
              </h3>
              <p className="text-neo-text-muted">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto max-w-5xl px-4 pb-20">
        <div
          className={cn(
            "border-neo-border bg-neo-accent/5",
            "rounded-[var(--radius-neo-2xl)] border-[length:var(--border-neo)]",
            "p-8 text-center shadow-[var(--shadow-neo-lg)]",
            "md:p-12",
          )}
        >
          <h2 className="font-heading text-neo-text mb-4 text-2xl font-bold md:text-3xl">
            {t("cta.title")}
          </h2>
          <p className="text-neo-text-muted mx-auto mb-8 max-w-xl text-lg">
            {t("cta.subtitle")}
          </p>
          <NeoButton asChild size="lg">
            <Link href="/auth/signup" className="gap-2">
              {t("cta.button")}
              <ArrowRight className="size-5" />
            </Link>
          </NeoButton>
        </div>
      </div>
    </div>
  );
}
