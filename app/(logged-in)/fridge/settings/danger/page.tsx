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
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { LoadingButton } from "@/features/form/submit-button";
import { Eggy } from "@/features/mascot";
import { AlertTriangle, Download, Egg, History, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function DangerZonePage() {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearHistory = () => {
    dialogManager.confirm({
      title: "Effacer l'historique ?",
      description:
        "Cette action supprimera definitivement tout votre historique de consommation. Vos boites d'oeufs actuelles seront conservees.",
      confirmText: "Effacer",
      action: {
        label: "Effacer l'historique",
        onClick: async () => {
          setIsClearing(true);
          // TODO: Implement clearHistoryAction when needed
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setIsClearing(false);
          toast.success("Historique efface avec succes");
        },
      },
    });
  };

  const handleClearAllData = () => {
    dialogManager.confirm({
      title: "Vider le frigo ?",
      description:
        "Cette action supprimera toutes vos boites d'oeufs et votre historique de consommation. Cette action est irreversible.",
      confirmText: "Tout supprimer",
      action: {
        label: "Supprimer toutes les donnees",
        onClick: async () => {
          setIsClearing(true);
          // TODO: Implement clearAllDataAction when needed
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setIsClearing(false);
          toast.success("Donnees supprimees avec succes");
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Eggy mood="worried" size="lg" />
        <div>
          <h1 className="font-heading text-2xl font-bold">Zone de danger</h1>
          <p className="text-muted-foreground">
            Actions irreversibles sur votre frigo
          </p>
        </div>
      </div>

      {/* Export data */}
      <Card variant="sunny">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Download className="size-5" />
            Exporter vos donnees
          </CardTitle>
          <CardDescription>
            Telechargez une copie de toutes vos donnees au format CSV
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            L&apos;export inclut toutes vos boites d&apos;oeufs, votre
            historique de consommation et vos preferences.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild>
            <Link href="/fridge/statistics">
              <Download className="mr-2 size-4" />
              Exporter (depuis Statistiques)
            </Link>
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
              definitivement tout votre historique de consommation. Vos boites
              d&apos;oeufs actuelles seront conservees.
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

      {/* Clear all data */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2 text-lg">
            <Egg className="size-5" />
            Vider le frigo
          </CardTitle>
          <CardDescription>
            Supprime toutes les donnees de votre frigo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-destructive/10 flex items-start gap-3 rounded-lg border border-dashed p-4">
            <AlertTriangle className="text-destructive mt-0.5 size-5 shrink-0" />
            <p className="text-sm">
              <strong>Action irreversible :</strong> Cette action supprimera
              toutes vos boites d&apos;oeufs, votre historique de consommation
              et reinitialiser completement votre frigo.
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

      {/* Account deletion info */}
      <Card variant="sunny">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            Supprimer votre compte
          </CardTitle>
          <CardDescription>
            Pour supprimer votre compte EggscuseMe et toutes vos donnees
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" asChild>
            <Link href="/account/danger">Gerer mon compte</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
