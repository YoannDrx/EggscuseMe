"use client";

import { NeoBadge } from "@/components/neo";
import { NeoButton } from "@/components/neo";
import {
  NeoCard,
  NeoCardContent,
  NeoCardDescription,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
import {
  createCheckoutAction,
  createPortalSessionAction,
  upgradeSubscriptionAction,
} from "@/features/fridge/billing.action";
import { Eggy } from "@/features/mascot";
import { PlanCard } from "@/features/plans/plan-card";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import {
  getPricingCopy,
  normalizePlanTypeForDisplay,
  type Locale,
} from "@/lib/auth/stripe/plan-features";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  Crown,
  Loader2,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";
import { useCurrentFridge } from "../../use-current-fridge";

/**
 * Calcule le nombre de jours restants jusqu'à une date
 */
function daysUntil(date: Date | null): number {
  if (!date) return 0;
  const now = new Date();
  const diff = new Date(date).getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

/**
 * Formate une date pour l'affichage
 */
function formatDate(date: Date | null, locale: string): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString(
    locale === "fr" ? "fr-FR" : "en-US",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );
}

export default function BillingPage() {
  const locale = useLocale() as Locale;
  const copy = getPricingCopy(locale);
  const fridgeState = useCurrentFridge();

  // Utiliser le plan exact du store (solo, brigade, ou chef)
  const currentPlan = normalizePlanTypeForDisplay(fridgeState?.plan);
  const isSolo = currentPlan === "solo";
  const isBrigade = currentPlan === "brigade";
  const isChef = currentPlan === "chef";
  const isPaid = isBrigade || isChef;

  const upgradeToBrigadeMutation = useMutation({
    mutationFn: async () => {
      return resolveActionResult(
        createCheckoutAction({
          plan: "brigade",
          annual: false,
          successUrl: "/fridge/settings/billing?success=true",
          cancelUrl: "/fridge/settings/billing?canceled=true",
        }),
      );
    },
    onSuccess: (data) => {
      toast.info(copy.upgrading);
      window.location.href = data.url;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const upgradeToChefMutation = useMutation({
    mutationFn: async () => {
      return resolveActionResult(
        createCheckoutAction({
          plan: "chef",
          annual: false,
          successUrl: "/fridge/settings/billing?success=true",
          cancelUrl: "/fridge/settings/billing?canceled=true",
        }),
      );
    },
    onSuccess: (data) => {
      toast.info(copy.upgrading);
      window.location.href = data.url;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const portalMutation = useMutation({
    mutationFn: async () => {
      return resolveActionResult(createPortalSessionAction());
    },
    onSuccess: (data) => {
      toast.info(copy.portalOpening);
      window.location.href = data.url;
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Upgrade Brigade → Chef via server action (not new checkout)
  const queryClient = useQueryClient();
  const upgradeToChefFromBrigadeMutation = useMutation({
    mutationFn: async () => {
      return resolveActionResult(
        upgradeSubscriptionAction({
          targetPlan: "chef",
          annual: false,
        }),
      );
    },
    onSuccess: () => {
      toast.success(
        locale === "fr"
          ? "Félicitations ! Vous êtes maintenant Chef !"
          : "Congratulations! You are now a Chef!",
      );
      // Refresh the page to get updated subscription data
      void queryClient.invalidateQueries();
      window.location.reload();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (!fridgeState) {
    return null;
  }

  const isLoading =
    upgradeToBrigadeMutation.isPending ||
    upgradeToChefMutation.isPending ||
    upgradeToChefFromBrigadeMutation.isPending ||
    portalMutation.isPending;

  // Get plan-specific display info
  const getPlanIcon = () => {
    if (isChef) return <Crown className="size-5 text-amber-500" />;
    if (isBrigade) return <Users className="text-primary size-5" />;
    return <Zap className="size-5" />;
  };

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

  const getHeaderSubtitle = () => {
    if (isChef) return copy.headerSubtitleChef;
    if (isBrigade) return copy.headerSubtitleBrigade;
    return copy.headerSubtitleSolo;
  };

  const getBadgeText = () => {
    if (isChef) return copy.badgePro;
    if (isBrigade) return copy.badgeActive;
    return copy.badgeFree;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/fridge/settings">
          <NeoButton variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </NeoButton>
        </Link>
        <Eggy mood={isPaid ? "happy" : "chef"} size="lg" />
        <div>
          <h1 className="font-heading text-2xl font-bold">
            {copy.headerTitle}
          </h1>
          <p className="text-muted-foreground">{getHeaderSubtitle()}</p>
        </div>
      </div>

      {/* Current Plan */}
      <NeoCard
        className={
          isChef ? "border-amber-500/30" : isBrigade ? "border-primary/30" : ""
        }
      >
        <NeoCardHeader>
          <div className="flex items-center justify-between">
            <div>
              <NeoCardTitle className="font-heading flex items-center gap-2">
                {getPlanIcon()}
                {getPlanTitle()}
              </NeoCardTitle>
              <NeoCardDescription>{getPlanDescription()}</NeoCardDescription>
            </div>
            <NeoBadge
              variant={isPaid ? "default" : "secondary"}
              className={isChef ? "bg-amber-500 text-white" : ""}
            >
              {getBadgeText()}
            </NeoBadge>
          </div>
        </NeoCardHeader>
        <NeoCardContent>
          {/* Trial status badge */}
          {fridgeState.isTrialing && (
            <div className="mb-4 flex items-center gap-2">
              <NeoBadge
                variant="outline"
                className="border-amber-500 text-amber-500"
              >
                <Clock className="mr-1 size-3" />
                {locale === "fr"
                  ? `Essai gratuit - ${daysUntil(fridgeState.periodEnd)} jours restants`
                  : `Free trial - ${daysUntil(fridgeState.periodEnd)} days left`}
              </NeoBadge>
            </div>
          )}

          {/* Cancel at period end warning */}
          {fridgeState.cancelAtPeriodEnd && (
            <div className="bg-destructive/10 text-destructive mb-4 rounded-lg p-4">
              <AlertTriangle className="mr-2 inline size-4" />
              {locale === "fr"
                ? `Votre abonnement sera annulé le ${formatDate(fridgeState.periodEnd, locale)}`
                : `Your subscription will be canceled on ${formatDate(fridgeState.periodEnd, locale)}`}
            </div>
          )}

          {isPaid ? (
            <NeoButton
              variant="outline"
              onClick={() => portalMutation.mutate()}
              disabled={isLoading}
            >
              {portalMutation.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              {copy.manage}
            </NeoButton>
          ) : (
            <div className="flex flex-wrap gap-3">
              <NeoButton
                variant="primary"
                onClick={() => upgradeToBrigadeMutation.mutate()}
                disabled={isLoading}
              >
                {upgradeToBrigadeMutation.isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Users className="mr-2 size-4" />
                )}
                {copy.chooseBrigade} - {copy.brigadePrice}
                {copy.brigadePriceSuffix}
              </NeoButton>
              <NeoButton
                variant="secondary"
                className="bg-amber-500 text-white hover:bg-amber-600"
                onClick={() => upgradeToChefMutation.mutate()}
                disabled={isLoading}
              >
                {upgradeToChefMutation.isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Crown className="mr-2 size-4" />
                )}
                {copy.chooseChef} - {copy.chefPrice}
                {copy.chefPriceSuffix}
              </NeoButton>
            </div>
          )}

          {/* Upgrade to Chef from Brigade (uses server action, no new checkout) */}
          {isBrigade && (
            <div className="border-border mt-4 border-t pt-4">
              <p className="text-muted-foreground mb-3 text-sm">
                {locale === "fr"
                  ? "Envie de plus ? Passez Chef pour débloquer toutes les fonctionnalités pro !"
                  : "Want more? Go Chef to unlock all pro features!"}
              </p>
              <NeoButton
                variant="secondary"
                className="bg-amber-500 text-white hover:bg-amber-600"
                onClick={() => upgradeToChefFromBrigadeMutation.mutate()}
                disabled={isLoading}
              >
                {upgradeToChefFromBrigadeMutation.isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 size-4" />
                )}
                {copy.chooseChef} - {copy.chefPrice}
                {copy.chefPriceSuffix}
              </NeoButton>
            </div>
          )}
        </NeoCardContent>
      </NeoCard>

      {/* Plan Comparison - 3 plans */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <PlanCard plan="solo" isCurrentPlan={isSolo} showButton={false} />
        <PlanCard
          plan="brigade"
          isCurrentPlan={isBrigade}
          onSelect={() => upgradeToBrigadeMutation.mutate()}
          isLoading={upgradeToBrigadeMutation.isPending}
          showButton={isSolo}
        />
        <PlanCard
          plan="chef"
          isCurrentPlan={isChef}
          onSelect={() => upgradeToChefMutation.mutate()}
          isLoading={upgradeToChefMutation.isPending}
          showButton={!isChef}
        />
      </div>
    </div>
  );
}
