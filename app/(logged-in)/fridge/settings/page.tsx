"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { renameFridgeAction } from "@/features/fridge/fridge-settings.action";
import { Eggy } from "@/features/mascot";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import {
  AlertTriangle,
  Bell,
  CreditCard,
  KeyRound,
  Palette,
  Settings,
  Share2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useCurrentFridge } from "../use-current-fridge";

type SettingsCardProps = {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
  variant?: "default" | "danger";
};

function SettingsCard({
  href,
  icon: Icon,
  title,
  description,
  variant = "default",
}: SettingsCardProps) {
  const isDanger = variant === "danger";

  return (
    <Link href={href}>
      <Card
        variant="sunny"
        className={`hover:border-primary/30 h-full cursor-pointer transition-colors ${
          isDanger ? "border-destructive/30 hover:border-destructive/50" : ""
        }`}
      >
        <CardHeader className="flex flex-row items-center gap-4">
          <div
            className={`flex size-12 items-center justify-center rounded-full ${
              isDanger ? "bg-destructive/10" : "bg-primary/10"
            }`}
          >
            <Icon
              className={`size-6 ${isDanger ? "text-destructive" : "text-primary"}`}
            />
          </div>
          <div>
            <CardTitle
              className={`font-heading text-lg ${isDanger ? "text-destructive" : ""}`}
            >
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}

export default function SettingsPage() {
  const fridgeState = useCurrentFridge();
  const [fridgeName, setFridgeName] = useState(
    fridgeState?.name ?? "Mon Frigo",
  );
  const [isSaving, setIsSaving] = useState(false);
  const isOwner = fridgeState?.role === "OWNER";

  const handleSaveName = async () => {
    if (!fridgeState) return;
    setIsSaving(true);
    try {
      await resolveActionResult(renameFridgeAction({ name: fridgeName }));
      toast.success("Nom du frigo mis à jour");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Une erreur est survenue",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!fridgeState) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Eggy mood="happy" size="lg" />
        <div>
          <h1 className="font-heading text-2xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez votre frigo et votre compte
          </p>
        </div>
      </div>

      {/* Section: Compte */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg font-semibold text-stone-400">
          Compte
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SettingsCard
            href="/fridge/settings/profile"
            icon={User}
            title="Mon profil"
            description="Nom, email et avatar"
          />
          <SettingsCard
            href="/fridge/settings/security"
            icon={KeyRound}
            title="Sécurité"
            description="Mot de passe et email"
          />
          <SettingsCard
            href="/fridge/settings/appearance"
            icon={Palette}
            title="Apparence"
            description="Thème de l'application"
          />
        </div>
      </div>

      {/* Section: Frigo */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg font-semibold text-stone-400">
          Frigo
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isOwner && (
            <SettingsCard
              href="/fridge/settings/sharing"
              icon={Share2}
              title="Partage"
              description="Invitez famille et amis"
            />
          )}
          {isOwner && (
            <SettingsCard
              href="/fridge/settings/notifications"
              icon={Bell}
              title="Notifications"
              description="Alertes d'expiration"
            />
          )}
          {isOwner && (
            <SettingsCard
              href="/fridge/settings/billing"
              icon={CreditCard}
              title="Abonnement"
              description="Plan et paiements"
            />
          )}
        </div>

        {/* Fridge Name - OWNER only */}
        {isOwner && (
          <Card variant="sunny">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Settings className="size-5" />
                Paramètres du frigo
              </CardTitle>
              <CardDescription>
                Personnalisez les informations de votre frigo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fridgeName">Nom du frigo</Label>
                <div className="flex gap-2">
                  <Input
                    id="fridgeName"
                    value={fridgeName}
                    onChange={(e) => setFridgeName(e.target.value)}
                    placeholder="Mon Frigo"
                  />
                  <Button
                    onClick={handleSaveName}
                    disabled={isSaving || fridgeName === fridgeState.name}
                  >
                    {isSaving ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Separator />

      {/* Section: Zone de danger */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg font-semibold text-stone-400">
          Zone de danger
        </h2>
        <SettingsCard
          href="/fridge/settings/danger"
          icon={AlertTriangle}
          title="Zone de danger"
          description="Supprimer données, frigo ou compte"
          variant="danger"
        />
      </div>
    </div>
  );
}
