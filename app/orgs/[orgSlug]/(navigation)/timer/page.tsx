import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { EggTimer } from "@/features/timer";
import { getCookingTips } from "@/features/timer/cooking-times";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export default function TimerPage() {
  const tips = getCookingTips();

  return (
    <Layout size="lg">
      <LayoutHeader>
        <LayoutTitle>Cooking Timer</LayoutTitle>
        <LayoutDescription>
          Get perfect eggs every time with our smart timer
        </LayoutDescription>
      </LayoutHeader>
      <LayoutContent className="flex flex-col gap-8 lg:flex-row">
        <div className="flex justify-center lg:justify-start">
          <EggTimer />
        </div>

        <div className="flex-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="size-5" />
                Cooking Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tips.map((tip, index) => (
                  <li
                    key={index}
                    className="text-muted-foreground flex gap-2 text-sm"
                  >
                    <span className="text-primary font-medium">
                      {index + 1}.
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cooking Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <h4 className="text-fresh-extra font-medium">
                    Runny (3 min)
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Liquid yolk, perfect for dipping soldiers
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-fresh font-medium">Soft (5-6 min)</h4>
                  <p className="text-muted-foreground text-sm">
                    Jammy yolk, great for ramen or salads
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-fresh-cook font-medium">
                    Medium (7-8 min)
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Creamy center, slightly firm
                  </p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-medium">Hard (10+ min)</h4>
                  <p className="text-muted-foreground text-sm">
                    Fully set yolk, ideal for sandwiches
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
