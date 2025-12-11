import GridBackground from "@/components/nowts/grid-background";
import { Typography } from "@/components/nowts/typography";
import { NeoCard, NeoCardContent } from "@/components/neo";
import { SectionLayout } from "@/features/landing/section-layout";
import { SiteConfig } from "@/site-config";
import { Egg, Heart, Leaf, Timer, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import Link from "next/link";

type AboutSectionCopy = {
  metaTitle: string;
  metaDescription: string;
  metaOgDescription: string;
  metaKeywords: string[];
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  stats: { value: string; label: string; icon: LucideIcon }[];
  problemTitle: string;
  solutionTitle: string;
  solutionDescription: string;
  featureTrackingTitle: string;
  featureTrackingDescription: string;
  featureRecipesTitle: string;
  featureRecipesDescription: string;
  featureNotificationsTitle: string;
  featureNotificationsDescription: string;
  valuesTitle: string;
  values: { title: string; description: string; icon: LucideIcon }[];
  ctaTitle: string;
  ctaDescription: string;
  ctaButton: string;
};

const COPY: Record<"fr" | "en", AboutSectionCopy> = {
  fr: {
    metaTitle: `À propos de ${SiteConfig.title}`,
    metaDescription:
      "Découvrez EggscuseMe, notre mission anti-gaspi et comment nous aidons les familles à mieux gérer leurs oeufs pour réduire le gaspillage alimentaire.",
    metaOgDescription:
      "Découvrez EggscuseMe, notre mission anti-gaspi et comment nous aidons les familles à mieux gérer leurs oeufs.",
    metaKeywords: [
      "anti-gaspi",
      "oeufs",
      "fraîcheur",
      "gaspillage alimentaire",
      "cuisine",
    ],
    heroEyebrow: "Notre mission",
    heroTitle: "Zéro oeuf gaspillé",
    heroDescription:
      "EggscuseMe est né d'un constat simple : trop d'oeufs finissent à la poubelle par manque de suivi. Notre application aide les familles à mieux gérer leurs oeufs et à cuisiner au bon moment.",
    stats: [
      { value: "30%", label: "des oeufs achetés sont jetés", icon: Egg },
      { value: "2M", label: "d'oeufs gaspillés/jour en France", icon: Leaf },
      { value: "28", label: "jours de durée de vie max", icon: Timer },
      { value: "100%", label: "gratuit pour commencer", icon: Heart },
    ],
    problemTitle: "Le problème du gaspillage",
    solutionTitle: "Notre solution",
    solutionDescription:
      "Un frigo virtuel intelligent qui vous aide à suivre vos oeufs et vous recommande quoi cuisiner selon leur fraîcheur.",
    featureTrackingTitle: "Suivi intelligent",
    featureTrackingDescription:
      "Visualisez la fraîcheur de chaque boîte avec des indicateurs couleur. Extra-frais, frais, à cuire ou périmé en un coup d'oeil.",
    featureRecipesTitle: "Recettes adaptées",
    featureRecipesDescription:
      "Des suggestions de recettes basées sur la fraîcheur. Oeufs pochés quand c'est extra-frais, oeufs durs quand ça urge.",
    featureNotificationsTitle: "Notifications",
    featureNotificationsDescription:
      "Recevez une alerte quand vos oeufs approchent de l'expiration. Plus jamais de mauvaise surprise au petit-déjeuner.",
    valuesTitle: "Nos valeurs",
    values: [
      {
        title: "Anti-gaspi",
        description:
          "Chaque oeuf sauvé compte. Notre mission est de réduire le gaspillage alimentaire en aidant chacun à mieux gérer ses oeufs.",
        icon: Leaf,
      },
      {
        title: "Simplicité",
        description:
          "Une interface intuitive pour toute la famille. Ajouter, suivre et consommer ses oeufs en quelques secondes.",
        icon: Egg,
      },
      {
        title: "Famille",
        description:
          "Partagez votre frigo avec vos proches. Chacun peut contribuer et voir ce qui doit être consommé en priorité.",
        icon: Users,
      },
    ],
    ctaTitle: "Prêt à réduire le gaspillage ?",
    ctaDescription:
      "Rejoignez des milliers de familles qui gèrent mieux leurs oeufs avec EggscuseMe. C'est gratuit pour commencer.",
    ctaButton: "Créer mon frigo gratuit",
  },
  en: {
    metaTitle: `About ${SiteConfig.title}`,
    metaDescription:
      "Discover EggscuseMe, our anti-waste mission, and how we help families track their eggs to cut food waste.",
    metaOgDescription:
      "Learn how EggscuseMe helps families keep eggs fresh, reduce waste, and cook at the right time.",
    metaKeywords: ["food waste", "eggs", "freshness", "kitchen", "anti-waste"],
    heroEyebrow: "Our mission",
    heroTitle: "Zero wasted eggs",
    heroDescription:
      "EggscuseMe was born from a simple fact: too many eggs end up in the trash because nobody tracks them. We help families manage eggs better and cook at the right moment.",
    stats: [
      {
        value: "30%",
        label: "of purchased eggs end up in the trash",
        icon: Egg,
      },
      { value: "2M", label: "eggs wasted per day in France", icon: Leaf },
      { value: "28", label: "days of maximum shelf life", icon: Timer },
      { value: "100%", label: "free to get started", icon: Heart },
    ],
    problemTitle: "The food waste problem",
    solutionTitle: "Our solution",
    solutionDescription:
      "A smart virtual fridge that helps you track your eggs and recommends what to cook based on freshness.",
    featureTrackingTitle: "Smart tracking",
    featureTrackingDescription:
      "See freshness for every box with color indicators. Extra-fresh, fresh, cook soon, or expired at a glance.",
    featureRecipesTitle: "Tailored recipes",
    featureRecipesDescription:
      "Recipe ideas based on freshness. Poached when eggs are extra-fresh, hard-boiled when time is short.",
    featureNotificationsTitle: "Notifications",
    featureNotificationsDescription:
      "Get alerts when eggs approach expiration. No more bad surprises at breakfast.",
    valuesTitle: "Our values",
    values: [
      {
        title: "Anti-waste",
        description:
          "Every saved egg counts. Our mission is to reduce food waste by helping everyone manage eggs better.",
        icon: Leaf,
      },
      {
        title: "Simplicity",
        description:
          "An intuitive interface for the whole family. Add, track, and consume eggs in seconds.",
        icon: Egg,
      },
      {
        title: "Family",
        description:
          "Share your fridge with loved ones. Everyone can contribute and see what needs to be eaten first.",
        icon: Users,
      },
    ],
    ctaTitle: "Ready to cut waste?",
    ctaDescription:
      "Join thousands of families managing eggs better with EggscuseMe. It's free to start.",
    ctaButton: "Create my free fridge",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const copy = locale in COPY ? COPY[locale as "fr" | "en"] : COPY.en;

  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    keywords: copy.metaKeywords,
    openGraph: {
      title: copy.metaTitle,
      description: copy.metaOgDescription,
      url: `${SiteConfig.prodUrl}/about`,
      type: "website",
    },
  };
}

export default async function AboutPage() {
  const locale = await getLocale();
  const copy = locale in COPY ? COPY[locale as "fr" | "en"] : COPY.en;

  return (
    <div className="relative">
      <GridBackground
        color="color-mix(in srgb, var(--muted) 50%, transparent)"
        size={20}
      />

      {/* Hero Section */}
      <SectionLayout variant="transparent">
        <div className="mx-auto max-w-2xl text-center">
          <Typography
            variant="p"
            className="text-primary text-base/7 font-semibold"
          >
            {copy.heroEyebrow}
          </Typography>
          <Typography
            variant="h1"
            className="text-foreground mt-2 text-5xl font-semibold tracking-tight sm:text-7xl"
          >
            {copy.heroTitle}
          </Typography>
          <Typography
            variant="p"
            className="text-muted-foreground mt-8 text-lg font-medium text-pretty sm:text-xl/8"
          >
            {copy.heroDescription}
          </Typography>
        </div>
      </SectionLayout>

      {/* Problem Section */}
      <SectionLayout size="lg" variant="transparent">
        <div className="mx-auto max-w-4xl">
          <Typography
            variant="h2"
            className="text-foreground mb-8 text-center text-3xl font-bold"
          >
            {copy.problemTitle}
          </Typography>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {copy.stats.map((stat) => (
              <NeoCard key={stat.label} variant="elevated">
                <NeoCardContent className="flex flex-col items-center p-6 text-center">
                  <stat.icon className="text-primary mb-2 size-8" />
                  <Typography
                    variant="h3"
                    className="text-foreground text-3xl font-bold"
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="p"
                    className="text-muted-foreground mt-1 text-sm"
                  >
                    {stat.label}
                  </Typography>
                </NeoCardContent>
              </NeoCard>
            ))}
          </div>
        </div>
      </SectionLayout>

      {/* Solution Section */}
      <SectionLayout size="lg" variant="transparent">
        <div className="mx-auto max-w-4xl">
          <Typography
            variant="h2"
            className="text-foreground mb-4 text-center text-3xl font-bold"
          >
            {copy.solutionTitle}
          </Typography>
          <Typography
            variant="p"
            className="text-muted-foreground mx-auto mb-12 max-w-2xl text-center text-lg"
          >
            {copy.solutionDescription}
          </Typography>

          <div className="grid gap-6 md:grid-cols-3">
            <NeoCard variant="elevated">
              <NeoCardContent className="p-6">
                <div className="bg-primary/10 mb-4 inline-flex rounded-lg p-3">
                  <Timer className="text-primary size-6" />
                </div>
                <Typography
                  variant="h3"
                  className="text-foreground mb-2 text-xl font-semibold"
                >
                  {copy.featureTrackingTitle}
                </Typography>
                <Typography variant="p" className="text-muted-foreground">
                  {copy.featureTrackingDescription}
                </Typography>
              </NeoCardContent>
            </NeoCard>

            <NeoCard variant="elevated">
              <NeoCardContent className="p-6">
                <div className="bg-primary/10 mb-4 inline-flex rounded-lg p-3">
                  <Egg className="text-primary size-6" />
                </div>
                <Typography
                  variant="h3"
                  className="text-foreground mb-2 text-xl font-semibold"
                >
                  {copy.featureRecipesTitle}
                </Typography>
                <Typography variant="p" className="text-muted-foreground">
                  {copy.featureRecipesDescription}
                </Typography>
              </NeoCardContent>
            </NeoCard>

            <NeoCard variant="elevated">
              <NeoCardContent className="p-6">
                <div className="bg-primary/10 mb-4 inline-flex rounded-lg p-3">
                  <Heart className="text-primary size-6" />
                </div>
                <Typography
                  variant="h3"
                  className="text-foreground mb-2 text-xl font-semibold"
                >
                  {copy.featureNotificationsTitle}
                </Typography>
                <Typography variant="p" className="text-muted-foreground">
                  {copy.featureNotificationsDescription}
                </Typography>
              </NeoCardContent>
            </NeoCard>
          </div>
        </div>
      </SectionLayout>

      {/* Values Section */}
      <SectionLayout size="lg" variant="transparent">
        <div className="mx-auto max-w-4xl">
          <Typography
            variant="h2"
            className="text-foreground mb-12 text-center text-3xl font-bold"
          >
            {copy.valuesTitle}
          </Typography>

          <div className="grid gap-8 md:grid-cols-3">
            {copy.values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="bg-primary/10 mx-auto mb-4 inline-flex rounded-full p-4">
                  <value.icon className="text-primary size-8" />
                </div>
                <Typography
                  variant="h3"
                  className="text-foreground mb-2 text-xl font-semibold"
                >
                  {value.title}
                </Typography>
                <Typography variant="p" className="text-muted-foreground">
                  {value.description}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </SectionLayout>

      {/* CTA Section */}
      <SectionLayout size="lg" variant="transparent">
        <div className="bg-primary/5 mx-auto max-w-2xl rounded-2xl p-8 text-center">
          <Typography
            variant="h2"
            className="text-foreground mb-4 text-2xl font-bold"
          >
            {copy.ctaTitle}
          </Typography>
          <Typography variant="p" className="text-muted-foreground mb-6">
            {copy.ctaDescription}
          </Typography>
          <Link
            href="/auth/signup"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-lg px-6 py-3 font-semibold transition-colors"
          >
            {copy.ctaButton}
          </Link>
        </div>
      </SectionLayout>
    </div>
  );
}
