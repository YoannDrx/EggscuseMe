"use client";

import {
  NeoBadge,
  NeoButton,
  NeoCard,
  NeoCardContent,
  NeoCardDescription,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
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
    <NeoCard
      variant={isPremium ? "elevated" : "default"}
      className={cn(
        "flex h-full flex-col",
        isPremium && "border-neo-accent/50",
        isCurrentPlan && "ring-neo-accent ring-2",
        className,
      )}
    >
      <NeoCardHeader>
        <div className="flex items-center gap-2">
          <NeoCardTitle className="font-heading">
            {isPremium ? copy.premiumTitle : copy.freeTitle}
          </NeoCardTitle>
          {isPremium && <NeoBadge>{copy.recommended}</NeoBadge>}
          {isCurrentPlan && (
            <NeoBadge variant="secondary">{copy.currentPlan}</NeoBadge>
          )}
        </div>
        <NeoCardDescription>
          {isPremium ? copy.premiumDescription : copy.freeDescription}
        </NeoCardDescription>

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
                  <span className="text-neo-text-muted text-base font-normal">
                    {copy.premiumPriceSuffix}
                  </span>
                  <span className="text-neo-text-muted text-sm line-through">
                    {copy.premiumPrice}
                  </span>
                  <NeoBadge variant="outline">{copy.yearlyDiscount}</NeoBadge>
                </div>
                <p className="text-neo-text-muted mt-1 text-sm">
                  {copy.billedAs} {copy.premiumYearlyTotal}
                  {copy.premiumYearlySuffix}
                </p>
              </>
            ) : (
              // Prix mensuel standard
              <div className="font-heading text-3xl font-bold">
                {copy.premiumPrice}
                <span className="text-neo-text-muted text-base font-normal">
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
            <div className="bg-neo-accent/10 text-neo-accent mt-3 inline-flex items-center rounded-full px-3 py-1 text-sm font-bold">
              <Clock className="mr-1.5 size-3.5" />
              {copy.freeTrial}
            </div>
          )}
        </div>
      </NeoCardHeader>

      <NeoCardContent className="flex flex-1 flex-col">
        {/* Message d'héritage pour Premium */}
        {isPremium && (
          <p className="text-neo-text-muted mb-3 text-sm font-medium">
            {copy.premiumInheritance}
          </p>
        )}

        {/* Liste des features */}
        <ul className="flex-1 space-y-3">
          {isPremium
            ? // Pour Premium : afficher les features additionnelles
              features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="text-neo-accent size-4 shrink-0" />
                  {feature}
                </li>
              ))
            : // Pour Free : afficher toutes les features
              freeFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="text-neo-text-muted size-4 shrink-0" />
                  {feature}
                </li>
              ))}
        </ul>

        {/* Bouton */}
        {showButton && !isCurrentPlan && onSelect && (
          <NeoButton
            variant={isPremium ? "primary" : "secondary"}
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
          </NeoButton>
        )}
      </NeoCardContent>
    </NeoCard>
  );
}
