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
} from "@/features/fridge/billing.action";
import { Eggy } from "@/features/mascot";
import { PlanCard } from "@/features/plans/plan-card";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { getPricingCopy, type Locale } from "@/lib/auth/stripe/plan-features";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Crown, Loader2, Sparkles, Zap } from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { toast } from "sonner";
import { useCurrentFridge } from "../../use-current-fridge";

export default function BillingPage() {
  const locale = useLocale() as Locale;
  const copy = getPricingCopy(locale);
  const fridgeState = useCurrentFridge();

  const upgradeMutation = useMutation({
    mutationFn: async () => {
      return resolveActionResult(
        createCheckoutAction({
          plan: "premium",
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

  if (!fridgeState) {
    return null;
  }

  const isPremium = fridgeState.isPremium;
  const isLoading = upgradeMutation.isPending || portalMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/fridge/settings">
          <NeoButton variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </NeoButton>
        </Link>
        <Eggy mood={isPremium ? "happy" : "chef"} size="lg" />
        <div>
          <h1 className="font-heading text-2xl font-bold">
            {copy.headerTitle}
          </h1>
          <p className="text-muted-foreground">
            {isPremium ? copy.headerSubtitlePremium : copy.headerSubtitleFree}
          </p>
        </div>
      </div>

      {/* Current Plan */}
      <NeoCard className={isPremium ? "border-primary/30" : ""}>
        <NeoCardHeader>
          <div className="flex items-center justify-between">
            <div>
              <NeoCardTitle className="font-heading flex items-center gap-2">
                {isPremium ? (
                  <>
                    <Crown className="text-primary size-5" />
                    {copy.premiumTitle}
                  </>
                ) : (
                  <>
                    <Zap className="size-5" />
                    {copy.freeTitle}
                  </>
                )}
              </NeoCardTitle>
              <NeoCardDescription>
                {isPremium ? copy.premiumDescription : copy.freeDescription}
              </NeoCardDescription>
            </div>
            <NeoBadge variant={isPremium ? "default" : "secondary"}>
              {isPremium ? copy.badgeActive : copy.badgeFree}
            </NeoBadge>
          </div>
        </NeoCardHeader>
        <NeoCardContent>
          {isPremium ? (
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
            <NeoButton
              variant="primary"
              onClick={() => upgradeMutation.mutate()}
              disabled={isLoading}
            >
              {upgradeMutation.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 size-4" />
              )}
              {copy.upgradeCta} - {copy.premiumPrice}
              {copy.premiumPriceSuffix}
            </NeoButton>
          )}
        </NeoCardContent>
      </NeoCard>

      {/* Plan Comparison */}
      <div className="grid gap-4 md:grid-cols-2">
        <PlanCard plan="free" isCurrentPlan={!isPremium} showButton={false} />
        <PlanCard
          plan="premium"
          isCurrentPlan={isPremium}
          onSelect={() => upgradeMutation.mutate()}
          isLoading={upgradeMutation.isPending}
          showButton={!isPremium}
        />
      </div>
    </div>
  );
}
