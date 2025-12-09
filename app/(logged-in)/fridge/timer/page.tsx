import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileHeader } from "@/components/eggscuseme/navigation/mobile-header";
import { EggTimer } from "@/features/timer";
import { getCookingTipsFr } from "@/features/timer/cooking-times";
import { Eggy } from "@/features/mascot";
import { ChefHat, Lightbulb } from "lucide-react";

export default function TimerPage() {
  const tips = getCookingTipsFr();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile Header */}
      <MobileHeader
        title="Minuteur"
        subtitle="Cuisson parfaite"
        mascot
        mascotMood="chef"
      />

      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="flex items-center gap-3">
          <Eggy mood="chef" size="md" />
          <div>
            <h1 className="font-heading text-2xl font-bold">
              Minuteur de cuisson
            </h1>
            <p className="text-muted-foreground">
              Des oeufs parfaits a chaque fois grace a notre minuteur
              intelligent
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-[var(--space-page-x)] py-[var(--space-page-y)] md:px-0">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Timer - Centered on mobile, left on desktop */}
          <div className="flex justify-center lg:justify-start">
            <EggTimer />
          </div>

          {/* Info Cards */}
          <div className="flex-1 space-y-4 md:space-y-6">
            {/* Tips Card */}
            <Card variant="sunny">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="font-heading flex items-center gap-2 text-base md:text-lg">
                  <div className="bg-primary/10 flex size-7 items-center justify-center rounded-full md:size-8">
                    <Lightbulb className="text-primary size-3.5 md:size-4" />
                  </div>
                  Conseils de cuisson
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 md:space-y-3">
                  {tips.map((tip, index) => (
                    <li
                      key={index}
                      className="text-muted-foreground flex gap-2 text-sm md:gap-3"
                    >
                      <span className="bg-primary/10 text-primary flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-medium md:size-6">
                        {index + 1}
                      </span>
                      <span className="pt-0.5">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Cooking Guide - Condensed on mobile */}
            <Card variant="sunny">
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="font-heading flex items-center gap-2 text-base md:text-lg">
                  <div className="bg-primary/10 flex size-7 items-center justify-center rounded-full md:size-8">
                    <ChefHat className="text-primary size-3.5 md:size-4" />
                  </div>
                  Guide de cuisson
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0 md:space-y-4">
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                  <div className="bg-fresh-extra/10 rounded-xl p-3 md:p-4">
                    <h4 className="font-heading text-fresh-extra text-sm font-semibold md:text-base">
                      Coulant (3 min)
                    </h4>
                    <p className="text-muted-foreground mt-0.5 text-xs md:mt-1 md:text-sm">
                      Jaune liquide, parfait pour les mouillettes
                    </p>
                  </div>
                  <div className="bg-fresh/10 rounded-xl p-3 md:p-4">
                    <h4 className="font-heading text-fresh text-sm font-semibold md:text-base">
                      Mollet (5-6 min)
                    </h4>
                    <p className="text-muted-foreground mt-0.5 text-xs md:mt-1 md:text-sm">
                      Jaune onctueux, ideal pour les ramen ou salades
                    </p>
                  </div>
                  <div className="bg-fresh-cook/10 rounded-xl p-3 md:p-4">
                    <h4 className="font-heading text-fresh-cook text-sm font-semibold md:text-base">
                      Mi-cuit (7-8 min)
                    </h4>
                    <p className="text-muted-foreground mt-0.5 text-xs md:mt-1 md:text-sm">
                      Centre cremeux, legerement ferme
                    </p>
                  </div>
                  <div className="bg-muted rounded-xl p-3 md:p-4">
                    <h4 className="font-heading text-sm font-semibold md:text-base">
                      Dur (10+ min)
                    </h4>
                    <p className="text-muted-foreground mt-0.5 text-xs md:mt-1 md:text-sm">
                      Jaune bien cuit, parfait pour les sandwichs
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
