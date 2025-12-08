"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { LoadingButton } from "@/features/form/submit-button";
import {
  clearFridgeDataAction,
  clearFridgeHistoryAction,
  exportFridgeDataAction,
} from "@/features/fridge/fridge-settings.action";
import { Eggy } from "@/features/mascot";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { authClient } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import {
  AlertTriangle,
  Building2,
  ChevronLeft,
  Download,
  Egg,
  History,
  Trash2,
  UserX2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useCurrentFridge } from "../../use-current-fridge";

export default function DangerZonePage() {
  const [isClearing, setIsClearing] = useState(false);
  const fridgeState = useCurrentFridge();
  const isOwner = fridgeState?.role === "OWNER";

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return unwrapSafePromise(
        authClient.deleteUser({
          callbackURL: "/goodbye",
        }),
      );
    },
  });

  const handleClearHistory = () => {
    dialogManager.confirm({
      title: "Effacer l'historique ?",
      description:
        "Cette action supprimera définitivement tout votre historique de consommation. Vos boîtes d'œufs actuelles seront conservées.",
      confirmText: "Effacer",
      action: {
        label: "Effacer l'historique",
        onClick: async () => {
          setIsClearing(true);
          try {
            const result = await resolveActionResult(
              clearFridgeHistoryAction(),
            );
            toast.success("Historique effacé avec succès", {
              description: `${result.deletedCount} entrée(s) supprimée(s)`,
            });
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Une erreur est survenue",
            );
          } finally {
            setIsClearing(false);
          }
        },
      },
    });
  };

  const handleClearAllData = () => {
    dialogManager.confirm({
      title: "Vider le frigo ?",
      description:
        "Cette action supprimera toutes vos boîtes d'œufs et votre historique de consommation. Cette action est irréversible.",
      confirmText: "Tout supprimer",
      action: {
        label: "Supprimer toutes les données",
        onClick: async () => {
          setIsClearing(true);
          try {
            const result = await resolveActionResult(clearFridgeDataAction());
            toast.success("Données supprimées avec succès", {
              description: `${result.deletedCount} boîte(s) supprimée(s)`,
            });
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Une erreur est survenue",
            );
          } finally {
            setIsClearing(false);
          }
        },
      },
    });
  };

  const handleExportData = async () => {
    try {
      const result = await resolveActionResult(exportFridgeDataAction());
      // Convert to JSON and download
      const blob = new Blob([JSON.stringify(result.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `eggscuseme-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Export réussi");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Une erreur est survenue",
      );
    }
  };

  const handleDeleteAccount = () => {
    dialogManager.confirm({
      title: "Supprimer votre compte ?",
      description:
        "Cette action est irréversible. Toutes vos données personnelles, vos frigos et votre historique seront définitivement supprimés.",
      confirmText: "Supprimer",
      action: {
        label: "Supprimer mon compte",
        variant: "destructive",
        onClick: async () => {
          await deleteAccountMutation.mutateAsync();
          toast.success("Demande de suppression envoyée", {
            description: "Vérifiez votre email pour confirmer la suppression.",
          });
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/fridge/settings"
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ChevronLeft className="size-4" />
        Retour aux paramètres
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Eggy mood="worried" size="lg" />
        <div>
          <h1 className="font-heading text-2xl font-bold">Zone de danger</h1>
          <p className="text-muted-foreground">
            Actions irréversibles sur votre frigo et votre compte
          </p>
        </div>
      </div>

      {/* Section: Données du frigo */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Egg className="text-muted-foreground size-5" />
          <h2 className="font-heading text-lg font-semibold">
            Données du frigo
          </h2>
        </div>

        {/* Export data */}
        <Card variant="sunny">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Download className="size-5" />
              Exporter vos données
            </CardTitle>
            <CardDescription>
              Téléchargez une copie de toutes vos données au format CSV
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              L&apos;export inclut toutes vos boîtes d&apos;œufs, votre
              historique de consommation et vos préférences.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 size-4" />
              Exporter mes données
            </Button>
          </CardFooter>
        </Card>

        {/* Clear history */}
        <Card className="border-fresh-cook">
          <CardHeader>
            <CardTitle className="text-fresh-cook flex items-center gap-2 text-lg">
              <History className="size-5" />
              Effacer l&apos;historique
            </CardTitle>
            <CardDescription>
              Supprime tout votre historique de consommation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-fresh-cook/10 flex items-start gap-3 rounded-lg border border-dashed p-4">
              <AlertTriangle className="text-fresh-cook mt-0.5 size-5 shrink-0" />
              <p className="text-sm">
                <strong>Attention :</strong> Cette action supprimera
                définitivement tout votre historique de consommation. Vos boîtes
                d&apos;œufs actuelles seront conservées.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <LoadingButton
              variant="outline"
              className="border-fresh-cook text-fresh-cook hover:bg-fresh-cook/10"
              onClick={handleClearHistory}
              loading={isClearing}
            >
              <Trash2 className="mr-2 size-4" />
              Effacer l&apos;historique
            </LoadingButton>
          </CardFooter>
        </Card>

        {/* Clear all data - OWNER only */}
        {isOwner && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2 text-lg">
                <Egg className="size-5" />
                Vider le frigo
              </CardTitle>
              <CardDescription>
                Supprime toutes les données de votre frigo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-destructive/10 flex items-start gap-3 rounded-lg border border-dashed p-4">
                <AlertTriangle className="text-destructive mt-0.5 size-5 shrink-0" />
                <p className="text-sm">
                  <strong>Action irréversible :</strong> Cette action supprimera
                  toutes vos boîtes d&apos;œufs, votre historique de
                  consommation et réinitialisera complètement votre frigo.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <LoadingButton
                variant="destructive"
                onClick={handleClearAllData}
                loading={isClearing}
              >
                <Trash2 className="mr-2 size-4" />
                Tout supprimer
              </LoadingButton>
            </CardFooter>
          </Card>
        )}
      </div>

      <Separator className="my-8" />

      {/* Section: Compte utilisateur */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <UserX2 className="text-muted-foreground size-5" />
          <h2 className="font-heading text-lg font-semibold">
            Compte utilisateur
          </h2>
        </div>

        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-destructive size-5" />
              <CardTitle className="text-xl font-semibold">
                Supprimer mon compte
              </CardTitle>
            </div>
            <CardDescription className="text-muted-foreground text-base">
              Cette action supprimera définitivement votre compte et toutes les
              données associées
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-stone-900/50 p-4">
              <div className="flex items-start gap-4">
                <UserX2 className="text-muted-foreground mt-0.5 size-5" />
                <div className="space-y-1">
                  <p className="leading-none font-medium">
                    Données personnelles
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Toutes vos informations personnelles et paramètres seront
                    définitivement effacés
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-stone-900/50 p-4">
              <div className="flex items-start gap-4">
                <Building2 className="text-muted-foreground mt-0.5 size-5" />
                <div className="space-y-1">
                  <p className="leading-none font-medium">Données du frigo</p>
                  <p className="text-muted-foreground text-sm">
                    Votre frigo et toutes ses données seront supprimés, ainsi
                    que vos abonnements
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-4">
            <LoadingButton
              variant="destructive"
              size="lg"
              loading={deleteAccountMutation.isPending}
              onClick={handleDeleteAccount}
            >
              Supprimer mon compte
            </LoadingButton>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
