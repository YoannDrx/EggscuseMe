import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FAQSection } from "@/features/landing/faq-section";
import { LandingHeader } from "@/features/landing/landing-header";
import { SectionDivider } from "@/features/landing/section-divider";
import { Footer } from "@/features/layout/footer";
import { Eggy } from "@/features/mascot";
import { Pricing } from "@/features/plans/pricing-section";
import { Typography } from "@/components/nowts/typography";
import { Egg, Sparkles, Timer, Users, ScanLine, ChefHat } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-background text-foreground relative flex h-fit flex-col">
      <div className="mt-16" />

      <LandingHeader />

      {/* Hero Section - Sunny Side UI */}
      <section className="relative isolate flex flex-col overflow-hidden">
        {/* Decorative gradient blob */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="from-primary relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr to-amber-400 opacity-25 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        <main className="relative py-20 sm:py-28 lg:pb-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
              {/* Mascot */}
              <div className="mb-8">
                <Eggy mood="happy" size="xl" />
              </div>

              {/* Title with Fredoka font */}
              <h1 className="font-heading text-5xl font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                Ne cassez plus que des{" "}
                <span className="relative inline-block">
                  <span className="text-primary">œufs</span>
                  <svg
                    className="absolute -bottom-2 left-0 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                  >
                    <path
                      d="M2 8 Q50 2, 100 8 T198 8"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="text-primary"
                    />
                  </svg>
                </span>
              </h1>

              <Typography
                variant="large"
                className="text-muted-foreground mt-8 max-w-2xl text-lg font-medium text-pretty sm:text-xl"
              >
                Suivez la fraîcheur, recevez des recommandations de cuisine, et
                réduisez le gaspillage alimentaire. Sachez exactement quoi
                cuisiner selon l&apos;âge de vos œufs.
              </Typography>

              {/* CTA Buttons - Neubrutalism style */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/auth/signin"
                  className={buttonVariants({
                    size: "xl",
                    variant: "neubrutalism",
                  })}
                >
                  <Egg className="mr-2 size-5" />
                  Créer mon frigo gratuit
                </Link>
                <Link
                  href="#features"
                  className={buttonVariants({
                    size: "xl",
                    variant: "neubrutalism-outline",
                  })}
                >
                  En savoir plus
                </Link>
              </div>
            </div>

            {/* Freshness preview cards - Sunny style */}
            <div className="mx-auto mt-20 grid max-w-4xl gap-4 sm:grid-cols-4">
              <Card
                variant="sunny"
                className="border-fresh-extra/30 bg-fresh-extra/10"
              >
                <CardContent className="p-5 text-center">
                  <div className="text-fresh-extra text-2xl font-bold">
                    0-9 jours
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Extra-frais
                  </p>
                  <p className="text-fresh-extra mt-2 text-xs">
                    Coque, poché, cru
                  </p>
                </CardContent>
              </Card>
              <Card variant="sunny" className="border-fresh/30 bg-fresh/10">
                <CardContent className="p-5 text-center">
                  <div className="text-fresh text-2xl font-bold">
                    10-21 jours
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">Frais</p>
                  <p className="text-fresh mt-2 text-xs">Omelette, brouillés</p>
                </CardContent>
              </Card>
              <Card
                variant="sunny"
                className="border-fresh-cook/30 bg-fresh-cook/10"
              >
                <CardContent className="p-5 text-center">
                  <div className="text-fresh-cook text-2xl font-bold">
                    22-28 jours
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">À cuire</p>
                  <p className="text-fresh-cook mt-2 text-xs">Durs seulement</p>
                </CardContent>
              </Card>
              <Card variant="sunny" className="border-expired/30 bg-expired/10">
                <CardContent className="p-5 text-center">
                  <div className="text-expired text-2xl font-bold">
                    29+ jours
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">Expiré</p>
                  <p className="text-expired mt-2 text-xs">À jeter</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </section>

      {/* Stats Section */}
      <section className="border-foreground/10 border-y py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Typography
              variant="h2"
              className="font-heading text-3xl font-bold"
            >
              Le problème du gaspillage
            </Typography>
            <Typography className="text-muted-foreground mt-4">
              Chaque année, des millions d&apos;œufs sont jetés par confusion
              sur les dates de péremption
            </Typography>
          </div>
          <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
            <Card variant="sunny-solid" className="text-center">
              <CardContent className="p-6">
                <div className="text-primary text-4xl font-bold">10B+</div>
                <p className="text-muted-foreground mt-2">
                  Œufs jetés chaque année en Europe
                </p>
              </CardContent>
            </Card>
            <Card variant="sunny-solid" className="text-center">
              <CardContent className="p-6">
                <div className="text-primary text-4xl font-bold">30%</div>
                <p className="text-muted-foreground mt-2">
                  Des œufs achetés finissent à la poubelle
                </p>
              </CardContent>
            </Card>
            <Card variant="sunny-solid" className="text-center">
              <CardContent className="p-6">
                <div className="text-primary text-4xl font-bold">
                  2 semaines
                </div>
                <p className="text-muted-foreground mt-2">
                  De fraîcheur perdues par manque d&apos;info
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Typography
              variant="h2"
              className="font-heading text-3xl font-bold"
            >
              Tout pour sauver vos œufs
            </Typography>
            <Typography className="text-muted-foreground mt-4">
              Des outils simples pour suivre la fraîcheur et réduire le
              gaspillage
            </Typography>
          </div>

          <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card variant="sunny-interactive">
              <CardHeader>
                <div className="bg-primary/10 flex size-12 items-center justify-center rounded-xl">
                  <Egg className="text-primary size-6" />
                </div>
                <CardTitle className="font-heading mt-4">
                  Frigo Virtuel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Suivez toutes vos boîtes d&apos;œufs avec des indicateurs de
                  fraîcheur colorés. Ne perdez plus le fil.
                </p>
              </CardContent>
            </Card>

            <Card variant="sunny-interactive">
              <CardHeader>
                <div className="bg-primary/10 flex size-12 items-center justify-center rounded-xl">
                  <Sparkles className="text-primary size-6" />
                </div>
                <CardTitle className="font-heading mt-4">
                  Recommandations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Suggestions de cuisson selon l&apos;âge. Coque, frits ou
                  durs&nbsp;? On vous dit tout.
                </p>
              </CardContent>
            </Card>

            <Card variant="sunny-interactive">
              <CardHeader>
                <div className="bg-primary/10 flex size-12 items-center justify-center rounded-xl">
                  <Timer className="text-primary size-6" />
                </div>
                <CardTitle className="font-heading mt-4">
                  Timer Intelligent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Temps de cuisson ajustés à la taille et température. Résultats
                  parfaits garantis.
                </p>
              </CardContent>
            </Card>

            <Card variant="sunny-interactive">
              <CardHeader>
                <div className="bg-primary/10 flex size-12 items-center justify-center rounded-xl">
                  <ScanLine className="text-primary size-6" />
                </div>
                <CardTitle className="font-heading mt-4">Scanner</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Scannez le code-barres pour ajouter une boîte en un instant.
                  Date de ponte automatique.
                </p>
              </CardContent>
            </Card>

            <Card variant="sunny-interactive">
              <CardHeader>
                <div className="bg-primary/10 flex size-12 items-center justify-center rounded-xl">
                  <ChefHat className="text-primary size-6" />
                </div>
                <CardTitle className="font-heading mt-4">Recettes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Suggestions de recettes basées sur vos œufs qui expirent
                  bientôt. Anti-gaspi.
                </p>
              </CardContent>
            </Card>

            <Card variant="sunny-interactive">
              <CardHeader>
                <div className="bg-primary/10 flex size-12 items-center justify-center rounded-xl">
                  <Users className="text-primary size-6" />
                </div>
                <CardTitle className="font-heading mt-4">
                  Partage Famille
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Partagez votre frigo avec famille ou colocs. Tout le monde
                  synchronisé.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* How it works - with mascot variations */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Typography
              variant="h2"
              className="font-heading text-3xl font-bold"
            >
              3 étapes simples
            </Typography>
            <Typography className="text-muted-foreground mt-4">
              Commencez à réduire le gaspillage en quelques minutes
            </Typography>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl gap-12 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="border-foreground/20 bg-card shadow-[3px_3px_0px_var(--foreground,theme(colors.foreground))/0.08] flex size-20 items-center justify-center rounded-2xl border-[1.5px]">
                  <span className="font-heading text-primary text-3xl font-bold">
                    1
                  </span>
                </div>
              </div>
              <h3 className="font-heading mt-6 text-lg font-semibold">
                Ajoutez vos œufs
              </h3>
              <p className="text-muted-foreground mt-2">
                Entrez la date de ponte à l&apos;achat d&apos;une nouvelle boîte
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="border-foreground/20 bg-card shadow-[3px_3px_0px_var(--foreground,theme(colors.foreground))/0.08] flex size-20 items-center justify-center rounded-2xl border-[1.5px]">
                  <span className="font-heading text-primary text-3xl font-bold">
                    2
                  </span>
                </div>
              </div>
              <h3 className="font-heading mt-6 text-lg font-semibold">
                Suivez la fraîcheur
              </h3>
              <p className="text-muted-foreground mt-2">
                Les codes couleur montrent la fraîcheur de chaque boîte
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="border-foreground/20 bg-card shadow-[3px_3px_0px_var(--foreground,theme(colors.foreground))/0.08] flex size-20 items-center justify-center rounded-2xl border-[1.5px]">
                  <span className="font-heading text-primary text-3xl font-bold">
                    3
                  </span>
                </div>
              </div>
              <h3 className="font-heading mt-6 text-lg font-semibold">
                Cuisinez parfaitement
              </h3>
              <p className="text-muted-foreground mt-2">
                Recommandations et timer pour des résultats parfaits
              </p>
            </div>
          </div>
        </div>
      </section>

      <Pricing />

      <FAQSection
        faq={[
          {
            question: "Comment savoir si un œuf est encore bon ?",
            answer:
              "Un œuf peut être consommé en toute sécurité jusqu'à 28 jours après la ponte. EggscuseMe fait le suivi pour vous et vous dit exactement quelle méthode de cuisson est la meilleure à chaque étape de fraîcheur.",
          },
          {
            question:
              "Quelle est la différence entre 'à consommer jusqu'au' et 'à consommer de préférence avant' ?",
            answer:
              "La DCR (Date de Consommation Recommandée) est généralement 28 jours après la ponte. La date sur les boîtes est souvent plus courte par précaution des distributeurs. EggscuseMe utilise la date de ponte réelle pour un suivi précis.",
          },
          {
            question: "Puis-je manger des œufs crus ?",
            answer:
              "Oui, mais uniquement dans les 9 premiers jours après la ponte (extra-frais). Après, préférez des cuissons qui chauffent bien le jaune, comme au plat ou dur.",
          },
          {
            question: "Comment fonctionne le code couleur de fraîcheur ?",
            answer:
              "Vert (0-9 jours) : Extra-frais, parfait pour coque ou cru. Jaune (10-21 jours) : Frais, idéal pour omelette ou au plat. Orange (22-28 jours) : À bien cuire, meilleur dur. Gris (29+ jours) : Expiré, à jeter.",
          },
          {
            question: "Puis-je partager mon frigo avec ma famille ?",
            answer:
              "Oui ! EggscuseMe supporte les organisations. Partagez votre frigo virtuel avec famille ou colocs. Tout le monde peut ajouter, consommer et suivre les œufs ensemble.",
          },
          {
            question: "Y a-t-il un plan gratuit ?",
            answer:
              "Oui ! Le plan gratuit permet de suivre jusqu'à 2 boîtes d'œufs avec les fonctionnalités de base. Premium débloque les boîtes illimitées, statistiques détaillées et notifications.",
          },
        ]}
      />

      <SectionDivider />

      {/* Final CTA with mascot */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Card
            variant="sunny-solid"
            className="bg-primary/5 mx-auto max-w-2xl overflow-hidden p-8 text-center sm:p-12"
          >
            <div className="mx-auto w-fit">
              <Eggy mood="chef" size="lg" />
            </div>
            <Typography
              variant="h2"
              className="font-heading mt-6 text-3xl font-bold"
            >
              Prêt à sauver vos œufs ?
            </Typography>
            <Typography className="text-muted-foreground mt-4">
              Rejoignez des milliers d&apos;utilisateurs qui réduisent leur
              gaspillage alimentaire. C&apos;est gratuit pour commencer.
            </Typography>
            <div className="mt-8">
              <Link
                href="/auth/signin"
                className={buttonVariants({
                  size: "xl",
                  variant: "neubrutalism",
                })}
              >
                <Egg className="mr-2 size-5" />
                Créer mon frigo gratuit
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
