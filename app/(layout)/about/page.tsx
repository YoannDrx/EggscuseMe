import GridBackground from "@/components/nowts/grid-background";
import { Typography } from "@/components/nowts/typography";
import { Card, CardContent } from "@/components/ui/card";
import { SectionLayout } from "@/features/landing/section-layout";
import { SiteConfig } from "@/site-config";
import { Egg, Heart, Leaf, Timer, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `À propos de ${SiteConfig.title}`,
  description:
    "Découvrez EggscuseMe, notre mission anti-gaspi et comment nous aidons les familles à mieux gérer leurs oeufs pour réduire le gaspillage alimentaire.",
  keywords: [
    "anti-gaspi",
    "oeufs",
    "fraîcheur",
    "gaspillage alimentaire",
    "cuisine",
  ],
  openGraph: {
    title: `À propos de ${SiteConfig.title}`,
    description:
      "Découvrez EggscuseMe, notre mission anti-gaspi et comment nous aidons les familles à mieux gérer leurs oeufs.",
    url: `${SiteConfig.prodUrl}/about`,
    type: "website",
  },
};

const stats = [
  { value: "30%", label: "des oeufs achetés sont jetés", icon: Egg },
  { value: "2M", label: "d'oeufs gaspillés/jour en France", icon: Leaf },
  { value: "28", label: "jours de durée de vie max", icon: Timer },
  { value: "100%", label: "gratuit pour commencer", icon: Heart },
];

const values = [
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
];

export default function AboutPage() {
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
            Notre mission
          </Typography>
          <Typography
            variant="h1"
            className="text-foreground mt-2 text-5xl font-semibold tracking-tight sm:text-7xl"
          >
            Zéro oeuf gaspillé
          </Typography>
          <Typography
            variant="p"
            className="text-muted-foreground mt-8 text-lg font-medium text-pretty sm:text-xl/8"
          >
            EggscuseMe est né d'un constat simple : trop d'oeufs finissent à la
            poubelle par manque de suivi. Notre application aide les familles à
            mieux gérer leurs oeufs et à cuisiner au bon moment.
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
            Le problème du gaspillage
          </Typography>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.label} variant="sunny">
                <CardContent className="flex flex-col items-center p-6 text-center">
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
                </CardContent>
              </Card>
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
            Notre solution
          </Typography>
          <Typography
            variant="p"
            className="text-muted-foreground mx-auto mb-12 max-w-2xl text-center text-lg"
          >
            Un frigo virtuel intelligent qui vous aide à suivre vos oeufs et
            vous recommande quoi cuisiner selon leur fraîcheur.
          </Typography>

          <div className="grid gap-6 md:grid-cols-3">
            <Card variant="sunny">
              <CardContent className="p-6">
                <div className="bg-primary/10 mb-4 inline-flex rounded-lg p-3">
                  <Timer className="text-primary size-6" />
                </div>
                <Typography
                  variant="h3"
                  className="text-foreground mb-2 text-xl font-semibold"
                >
                  Suivi intelligent
                </Typography>
                <Typography variant="p" className="text-muted-foreground">
                  Visualisez la fraîcheur de chaque boîte avec des indicateurs
                  couleur. Extra-frais, frais, à cuire ou périmé en un coup
                  d'oeil.
                </Typography>
              </CardContent>
            </Card>

            <Card variant="sunny">
              <CardContent className="p-6">
                <div className="bg-primary/10 mb-4 inline-flex rounded-lg p-3">
                  <Egg className="text-primary size-6" />
                </div>
                <Typography
                  variant="h3"
                  className="text-foreground mb-2 text-xl font-semibold"
                >
                  Recettes adaptées
                </Typography>
                <Typography variant="p" className="text-muted-foreground">
                  Des suggestions de recettes basées sur la fraîcheur. Oeufs
                  pochés quand c'est extra-frais, oeufs durs quand ça urge.
                </Typography>
              </CardContent>
            </Card>

            <Card variant="sunny">
              <CardContent className="p-6">
                <div className="bg-primary/10 mb-4 inline-flex rounded-lg p-3">
                  <Heart className="text-primary size-6" />
                </div>
                <Typography
                  variant="h3"
                  className="text-foreground mb-2 text-xl font-semibold"
                >
                  Notifications
                </Typography>
                <Typography variant="p" className="text-muted-foreground">
                  Recevez une alerte quand vos oeufs approchent de l'expiration.
                  Plus jamais de mauvaise surprise au petit-déjeuner.
                </Typography>
              </CardContent>
            </Card>
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
            Nos valeurs
          </Typography>

          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value) => (
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
            Prêt à réduire le gaspillage ?
          </Typography>
          <Typography variant="p" className="text-muted-foreground mb-6">
            Rejoignez des milliers de familles qui gèrent mieux leurs oeufs avec
            EggscuseMe. C'est gratuit pour commencer.
          </Typography>
          <Link
            href="/auth/signup"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-lg px-6 py-3 font-semibold transition-colors"
          >
            Créer mon frigo gratuit
          </Link>
        </div>
      </SectionLayout>
    </div>
  );
}
