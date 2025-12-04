import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { EggTimer } from "@/features/timer";
import { getCookingTipsFr } from "@/features/timer/cooking-times";
import { Eggy } from "@/features/mascot";
import { ChefHat, Lightbulb } from "lucide-react";

export default function TimerPage() {
  const tips = getCookingTipsFr();

  return (
    <Layout size="lg">
      <LayoutHeader>
        <div className="flex items-center gap-3">
          <Eggy mood="chef" size="md" className="hidden sm:block" />
          <div>
            <LayoutTitle className="font-heading">
              Minuteur de cuisson
            </LayoutTitle>
            <LayoutDescription>
              Des œufs parfaits à chaque fois grâce à notre minuteur intelligent
            </LayoutDescription>
          </div>
        </div>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-8 lg:flex-row">
        <div className="flex justify-center lg:justify-start">
          <EggTimer />
        </div>

        <div className="flex-1 space-y-6">
          {/* Tips Card */}
          <Card variant="sunny">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2 text-lg">
                <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
                  <Lightbulb className="text-primary size-4" />
                </div>
                Conseils de cuisson
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {tips.map((tip, index) => (
                  <li
                    key={index}
                    className="text-muted-foreground flex gap-3 text-sm"
                  >
                    <span className="bg-primary/10 text-primary flex size-6 shrink-0 items-center justify-center rounded-full font-medium">
                      {index + 1}
                    </span>
                    <span className="pt-0.5">{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Cooking Guide */}
          <Card variant="sunny">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2 text-lg">
                <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
                  <ChefHat className="text-primary size-4" />
                </div>
                Guide de cuisson
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-fresh-extra/10 rounded-xl p-4">
                  <h4 className="font-heading text-fresh-extra font-semibold">
                    Coulant (3 min)
                  </h4>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Jaune liquide, parfait pour les mouillettes
                  </p>
                </div>
                <div className="bg-fresh/10 rounded-xl p-4">
                  <h4 className="font-heading text-fresh font-semibold">
                    Mollet (5-6 min)
                  </h4>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Jaune onctueux, idéal pour les ramen ou salades
                  </p>
                </div>
                <div className="bg-fresh-cook/10 rounded-xl p-4">
                  <h4 className="font-heading text-fresh-cook font-semibold">
                    Mi-cuit (7-8 min)
                  </h4>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Centre crémeux, légèrement ferme
                  </p>
                </div>
                <div className="bg-muted rounded-xl p-4">
                  <h4 className="font-heading font-semibold">Dur (10+ min)</h4>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Jaune bien cuit, parfait pour les sandwichs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </LayoutContent>
    </Layout>
  );
}
