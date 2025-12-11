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
  normalizePlanTypeForDisplay,
  type Locale,
  type PlanType,
} from "@/lib/auth/stripe/plan-features";
import { cn } from "@/lib/utils";
import { Check, Clock, Crown, Loader2, Sparkles, Users } from "lucide-react";
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

  // Normalize plan for display (handle legacy names)
  const normalizedPlan = normalizePlanTypeForDisplay(plan);
  const features = getPlanFeatures(normalizedPlan, locale);

  const _isSolo = normalizedPlan === "solo";
  const isBrigade = normalizedPlan === "brigade";
  const isChef = normalizedPlan === "chef";

  // Get plan-specific copy
  const getPlanTitle = () => {
    if (isChef) return copy.chefTitle;
    if (isBrigade) return copy.brigadeTitle;
    return copy.soloTitle;
  };

  const getPlanDescription = () => {
    if (isChef) return copy.chefDescription;
    if (isBrigade) return copy.brigadeDescription;
    return copy.soloDescription;
  };

  const getPlanPrice = () => {
    if (isChef) return copy.chefPrice;
    if (isBrigade) return copy.brigadePrice;
    return copy.soloPrice;
  };

  const getPlanPriceSuffix = () => {
    if (isChef) return copy.chefPriceSuffix;
    if (isBrigade) return copy.brigadePriceSuffix;
    return "";
  };

  const getYearlyEquivalent = () => {
    if (isChef) return copy.chefYearlyEquivalent;
    if (isBrigade) return copy.brigadeYearlyEquivalent;
    return "";
  };

  const getYearlyTotal = () => {
    if (isChef) return copy.chefYearlyTotal;
    if (isBrigade) return copy.brigadeYearlyTotal;
    return "";
  };

  const getYearlySuffix = () => {
    if (isChef) return copy.chefYearlySuffix;
    if (isBrigade) return copy.brigadeYearlySuffix;
    return "";
  };

  const getYearlyDiscount = () => {
    if (isChef) return copy.chefYearlyDiscount;
    return copy.yearlyDiscount;
  };

  const getInheritanceMessage = () => {
    if (isChef) return copy.chefInheritance;
    if (isBrigade) return copy.brigadeInheritance;
    return null;
  };

  const getChooseButtonText = () => {
    if (isChef) return copy.chooseChef;
    if (isBrigade) return copy.chooseBrigade;
    return copy.chooseSolo;
  };

  const getButtonIcon = () => {
    if (isChef) return <Crown className="mr-2 size-4" />;
    if (isBrigade) return <Users className="mr-2 size-4" />;
    return null;
  };

  const isPaid = isBrigade || isChef;

  return (
    <NeoCard
      variant={isPaid ? "elevated" : "default"}
      className={cn(
        "flex h-full flex-col",
        isBrigade && "border-neo-accent/50",
        isChef && "border-amber-500/50",
        isCurrentPlan && "ring-neo-accent ring-2",
        className,
      )}
    >
      <NeoCardHeader>
        <div className="flex items-center gap-2">
          <NeoCardTitle className="font-heading">{getPlanTitle()}</NeoCardTitle>
          {isBrigade && <NeoBadge>{copy.recommended}</NeoBadge>}
          {isChef && (
            <NeoBadge className="bg-amber-500 text-white">
              {copy.badgePro}
            </NeoBadge>
          )}
          {isCurrentPlan && (
            <NeoBadge variant="secondary">{copy.currentPlan}</NeoBadge>
          )}
        </div>
        <NeoCardDescription>{getPlanDescription()}</NeoCardDescription>

        {/* Prix */}
        <div className="pt-2">
          {isPaid ? (
            showYearly ? (
              // Prix annuel : montrer l'équivalent mensuel avec l'ancien prix barré
              <>
                <div className="flex items-baseline gap-2">
                  <span className="font-heading text-3xl font-bold">
                    {getYearlyEquivalent()}
                  </span>
                  <span className="text-neo-text-muted text-base font-normal">
                    {getPlanPriceSuffix()}
                  </span>
                  <span className="text-neo-text-muted text-sm line-through">
                    {getPlanPrice()}
                  </span>
                  <NeoBadge variant="outline">{getYearlyDiscount()}</NeoBadge>
                </div>
                <p className="text-neo-text-muted mt-1 text-sm">
                  {copy.billedAs} {getYearlyTotal()}
                  {getYearlySuffix()}
                </p>
              </>
            ) : (
              // Prix mensuel standard
              <div className="font-heading text-3xl font-bold">
                {getPlanPrice()}
                <span className="text-neo-text-muted text-base font-normal">
                  {getPlanPriceSuffix()}
                </span>
              </div>
            )
          ) : (
            // Prix gratuit (Solo)
            <div className="font-heading text-3xl font-bold">
              {getPlanPrice()}
            </div>
          )}

          {/* Free trial pour les plans payants */}
          {isPaid && (
            <div className="bg-neo-accent/10 text-neo-accent mt-3 inline-flex items-center rounded-full px-3 py-1 text-sm font-bold">
              <Clock className="mr-1.5 size-3.5" />
              {copy.freeTrial}
            </div>
          )}
        </div>
      </NeoCardHeader>

      <NeoCardContent className="flex flex-1 flex-col">
        {/* Message d'héritage pour les plans payants */}
        {getInheritanceMessage() && (
          <p className="text-neo-text-muted mb-3 text-sm font-medium">
            {getInheritanceMessage()}
          </p>
        )}

        {/* Liste des features */}
        <ul className="flex-1 space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <Check
                className={cn(
                  "size-4 shrink-0",
                  isChef
                    ? "text-amber-500"
                    : isPaid
                      ? "text-neo-accent"
                      : "text-neo-text-muted",
                )}
              />
              {feature}
            </li>
          ))}
        </ul>

        {/* Bouton */}
        {showButton && !isCurrentPlan && onSelect && (
          <NeoButton
            variant={isPaid ? "primary" : "secondary"}
            className={cn(
              "mt-6 w-full",
              isChef && "bg-amber-500 hover:bg-amber-600",
            )}
            onClick={onSelect}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : isPaid ? (
              (getButtonIcon() ?? <Sparkles className="mr-2 size-4" />)
            ) : null}
            {getChooseButtonText()}
          </NeoButton>
        )}
      </NeoCardContent>
    </NeoCard>
  );
}
