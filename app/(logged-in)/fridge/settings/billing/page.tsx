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
import { Eggy } from "@/features/mascot";
import { ArrowLeft, Check, Crown, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useCurrentFridge } from "../../use-current-fridge";

const PREMIUM_FEATURES = [
  "Boîtes d'œufs illimitées",
  "Historique complet de consommation",
  "Notifications de fraîcheur",
  "Statistiques avancées",
  "Recettes personnalisées",
  "Support prioritaire",
];

const FREE_FEATURES = [
  "2 boîtes d'œufs maximum",
  "Minuteur intelligent",
  "Suggestions de cuisson basiques",
  "Partage avec invités",
];

export default function BillingPage() {
  const fridgeState = useCurrentFridge();

  if (!fridgeState) {
    return null;
  }

  const isPremium = fridgeState.isPremium;

  const handleUpgrade = () => {
    // TODO: Implement Stripe checkout
    toast.info("Redirection vers le paiement...");
  };

  const handleManageSubscription = () => {
    // TODO: Implement Stripe customer portal
    toast.info("Ouverture du portail de gestion...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/fridge/settings">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <Eggy mood={isPremium ? "happy" : "chef"} size="lg" />
        <div>
          <h1 className="font-heading text-2xl font-bold">Abonnement</h1>
          <p className="text-muted-foreground">
            {isPremium
              ? "Vous êtes un membre Premium !"
              : "Passez Premium pour débloquer toutes les fonctionnalités"}
          </p>
        </div>
      </div>

      {/* Current Plan */}
      <Card variant="sunny" className={isPremium ? "border-primary/30" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-heading flex items-center gap-2">
                {isPremium ? (
                  <>
                    <Crown className="text-primary size-5" />
                    Plan Premium
                  </>
                ) : (
                  <>
                    <Zap className="size-5" />
                    Plan Gratuit
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {isPremium
                  ? "Profitez de toutes les fonctionnalités"
                  : "Fonctionnalités de base"}
              </CardDescription>
            </div>
            <Badge variant={isPremium ? "default" : "secondary"}>
              {isPremium ? "Actif" : "Gratuit"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {isPremium ? (
            <Button variant="outline" onClick={handleManageSubscription}>
              Gérer mon abonnement
            </Button>
          ) : (
            <Button variant="neubrutalism" onClick={handleUpgrade}>
              <Sparkles className="mr-2 size-4" />
              Passer Premium - 2,99€/mois
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Free Plan */}
        <Card
          variant="sunny"
          className={!isPremium ? "ring-primary/20 ring-2" : ""}
        >
          <CardHeader>
            <CardTitle className="font-heading">Gratuit</CardTitle>
            <CardDescription>Pour découvrir l'application</CardDescription>
            <div className="font-heading text-3xl font-bold">0€</div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="text-muted-foreground size-4" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card
          variant="sunny"
          className={isPremium ? "ring-primary ring-2" : "border-primary/30"}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="font-heading">Premium</CardTitle>
              <Badge className="bg-primary">Recommandé</Badge>
            </div>
            <CardDescription>Pour les familles organisées</CardDescription>
            <div className="font-heading text-3xl font-bold">
              2,99€<span className="text-base font-normal">/mois</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {PREMIUM_FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="text-primary size-4" />
                  {feature}
                </li>
              ))}
            </ul>
            {!isPremium && (
              <Button
                variant="neubrutalism"
                className="mt-6 w-full"
                onClick={handleUpgrade}
              >
                <Sparkles className="mr-2 size-4" />
                Choisir Premium
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
