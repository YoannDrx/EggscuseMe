"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getPlanFeatures,
  getPricingCopy,
  type Locale,
  type PlanType,
} from "@/lib/auth/stripe/plan-features";
import { cn } from "@/lib/utils";
import { Check, Clock, Loader2, Sparkles } from "lucide-react";
import { useLocale } from "next-intl";

type PlanCardProps = {
  plan: PlanType;
  isCurrentPlan?: boolean;
  onSelect?: () => void;
  isLoading?: boolean;
  showYearly?: boolean;
  showButton?: boolean;
  className?: string;
};

export function PlanCard({
  plan,
  isCurrentPlan = false,
  onSelect,
  isLoading = false,
  showYearly = false,
  showButton = true,
  className,
}: PlanCardProps) {
  const locale = useLocale() as Locale;
  const copy = getPricingCopy(locale);
  const features = getPlanFeatures(plan, locale);

  const isPremium = plan === "premium";
  const freeFeatures = getPlanFeatures("free", locale);

  return (
    <Card
      variant="sunny"
      className={cn(
        "flex h-full flex-col",
        isPremium && "border-primary/30",
        isCurrentPlan && "ring-primary ring-2",
        className,
      )}
    >
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="font-heading">
            {isPremium ? copy.premiumTitle : copy.freeTitle}
          </CardTitle>
          {isPremium && (
            <Badge className="bg-primary">{copy.recommended}</Badge>
          )}
          {isCurrentPlan && (
            <Badge variant="secondary">{copy.currentPlan}</Badge>
          )}
        </div>
        <CardDescription>
          {isPremium ? copy.premiumDescription : copy.freeDescription}
        </CardDescription>

        {/* Prix */}
        <div className="pt-2">
          {isPremium ? (
            showYearly ? (
              // Prix annuel : montrer l'équivalent mensuel avec l'ancien prix barré
              <>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-bold">
                    {copy.premiumYearlyEquivalent}
                  </span>
                  <span className="text-muted-foreground text-base font-normal">
                    {copy.premiumPriceSuffix}
                  </span>
                  <span className="text-muted-foreground text-sm line-through">
                    {copy.premiumPrice}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-primary/20 bg-primary/10 text-primary"
                  >
                    {copy.yearlyDiscount}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {copy.billedAs} {copy.premiumYearlyTotal}
                  {copy.premiumYearlySuffix}
                </p>
              </>
            ) : (
              // Prix mensuel standard
              <div className="font-heading text-3xl font-bold">
                {copy.premiumPrice}
                <span className="text-muted-foreground text-base font-normal">
                  {copy.premiumPriceSuffix}
                </span>
              </div>
            )
          ) : (
            // Prix gratuit
            <div className="font-heading text-3xl font-bold">
              {copy.freePrice}
            </div>
          )}

          {/* Free trial pour Premium */}
          {isPremium && (
            <div className="bg-primary/10 text-primary mt-3 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium">
              <Clock className="mr-1.5 size-3.5" />
              {copy.freeTrial}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col">
        {/* Message d'héritage pour Premium */}
        {isPremium && (
          <p className="text-muted-foreground mb-3 text-sm font-medium">
            {copy.premiumInheritance}
          </p>
        )}

        {/* Liste des features */}
        <ul className="flex-1 space-y-3">
          {isPremium
            ? // Pour Premium : afficher les features additionnelles
              features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="text-primary size-4 shrink-0" />
                  {feature}
                </li>
              ))
            : // Pour Free : afficher toutes les features
              freeFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="text-muted-foreground size-4 shrink-0" />
                  {feature}
                </li>
              ))}
        </ul>

        {/* Bouton */}
        {showButton && !isCurrentPlan && onSelect && (
          <Button
            variant={isPremium ? "neubrutalism" : "outline"}
            className="mt-6 w-full"
            onClick={onSelect}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : isPremium ? (
              <Sparkles className="mr-2 size-4" />
            ) : null}
            {isPremium ? copy.choosePremium : copy.chooseFree}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
