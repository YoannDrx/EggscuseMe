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
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { Eggy } from "@/features/mascot";
import { CreditCard, Settings, Share2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useCurrentFridge } from "../use-current-fridge";

export default function SettingsPage() {
  const router = useRouter();
  const fridgeState = useCurrentFridge();
  const [fridgeName, setFridgeName] = useState(
    fridgeState?.name ?? "Mon Frigo",
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveName = async () => {
    if (!fridgeState) return;
    setIsSaving(true);
    // TODO: Implement update fridge name action
    toast.success("Nom du frigo mis à jour");
    setIsSaving(false);
  };

  const handleDeleteFridge = () => {
    if (fridgeState?.role !== "OWNER") {
      toast.error("Seul le propriétaire peut supprimer le frigo");
      return;
    }

    dialogManager.confirm({
      title: "Supprimer votre frigo ?",
      description:
        "Cette action est irréversible. Toutes vos boîtes d'œufs et votre historique seront supprimés.",
      action: {
        label: "Supprimer",
        variant: "destructive",
        onClick: async () => {
          // TODO: Implement delete fridge action
          toast.success("Frigo supprimé");
          router.push("/");
        },
      },
    });
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
            Gérez les paramètres de votre frigo
          </p>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/fridge/settings/sharing">
          <Card
            variant="sunny"
            className="hover:border-primary/30 cursor-pointer transition-colors"
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 flex size-12 items-center justify-center rounded-full">
                <Share2 className="text-primary size-6" />
              </div>
              <div>
                <CardTitle className="font-heading text-lg">Partage</CardTitle>
                <CardDescription>
                  Invitez des personnes à voir votre frigo
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </Link>

        {fridgeState.role === "OWNER" && (
          <Link href="/fridge/settings/billing">
            <Card
              variant="sunny"
              className="hover:border-primary/30 cursor-pointer transition-colors"
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/10">
                  <CreditCard className="size-6 text-amber-600" />
                </div>
                <div>
                  <CardTitle className="font-heading text-lg">
                    Abonnement
                  </CardTitle>
                  <CardDescription>
                    Gérez votre plan et vos paiements
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        )}
      </div>

      {/* Fridge Settings */}
      {fridgeState.role === "OWNER" && (
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

      {/* Danger Zone */}
      {fridgeState.role === "OWNER" && (
        <Card variant="sunny" className="border-destructive/30">
          <CardHeader>
            <CardTitle className="font-heading text-destructive flex items-center gap-2">
              <Trash2 className="size-5" />
              Zone de danger
            </CardTitle>
            <CardDescription>
              Actions irréversibles concernant votre frigo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleDeleteFridge}>
              <Trash2 className="mr-2 size-4" />
              Supprimer mon frigo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
