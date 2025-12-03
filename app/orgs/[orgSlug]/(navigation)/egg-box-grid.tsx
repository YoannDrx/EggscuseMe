"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EggBox } from "@/generated/prisma";
import { EggBoxCard } from "@/features/eggs/components/egg-box-card";
import { calculateFreshness } from "@/features/eggs/lib/freshness-calculator";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { Eggy } from "@/features/mascot";
import { AlertTriangle, Plus, Scan } from "lucide-react";
import { deleteEggBoxAction } from "@/features/eggs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AddEggBoxForm } from "./add-egg-box-form";
import { ConsumeEggsForm } from "./consume-eggs-form";

type EggBoxGridProps = {
  eggBoxes: EggBox[];
};

export function EggBoxGrid({ eggBoxes }: EggBoxGridProps) {
  const router = useRouter();

  // Sort by freshness priority (most urgent first)
  const sortedBoxes = [...eggBoxes]
    .filter((box) => box.remaining > 0)
    .sort((a, b) => {
      const freshnessA = calculateFreshness(a.layingDate);
      const freshnessB = calculateFreshness(b.layingDate);
      return freshnessA.daysRemaining - freshnessB.daysRemaining;
    });

  // Check for urgent boxes (need attention soon)
  const urgentBoxes = sortedBoxes.filter((box) => {
    const freshness = calculateFreshness(box.layingDate);
    return (
      freshness.status === "cook-thoroughly" || freshness.daysRemaining <= 5
    );
  });

  const handleAddBox = () => {
    dialogManager.custom({
      title: "Ajouter une boîte",
      description: "Ajoutez une nouvelle boîte d'œufs à suivre",
      children: <AddEggBoxForm />,
    });
  };

  const handleConsume = (eggBox: EggBox) => {
    dialogManager.custom({
      title: "Consommer des œufs",
      description: `Enregistrer les œufs consommés de "${eggBox.name ?? "cette boîte"}"`,
      children: <ConsumeEggsForm eggBox={eggBox} />,
    });
  };

  const handleDelete = (eggBox: EggBox) => {
    dialogManager.confirm({
      title: "Supprimer cette boîte ?",
      description: `Êtes-vous sûr de vouloir supprimer "${eggBox.name ?? "cette boîte"}" ? Cette action est irréversible.`,
      action: {
        label: "Supprimer",
        variant: "destructive",
        onClick: async () => {
          const result = await deleteEggBoxAction({ id: eggBox.id });
          if (result.data?.success) {
            toast.success("Boîte supprimée");
            router.refresh();
          } else {
            toast.error("Échec de la suppression");
          }
        },
      },
    });
  };

  // Empty state with Eggy mascot
  if (eggBoxes.length === 0) {
    return (
      <Card variant="sunny" className="border-2 border-dashed">
        <CardHeader className="pb-2 text-center">
          <div className="mx-auto mb-2">
            <Eggy mood="sad" size="lg" />
          </div>
          <CardTitle className="font-heading text-xl">
            Votre frigo est vide !
          </CardTitle>
          <CardDescription className="text-base">
            Ajoutez votre première boîte d'œufs pour commencer à suivre leur
            fraîcheur et réduire le gaspillage.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-center">
          <Button variant="neubrutalism" size="lg" onClick={handleAddBox}>
            <Plus className="mr-2 size-5" />
            Ajouter ma première boîte
          </Button>
          <p className="text-muted-foreground text-sm">
            ou utilisez le{" "}
            <button
              type="button"
              className="hover:text-foreground inline-flex items-center gap-1 underline transition-colors"
              onClick={() => toast.info("Scanner à venir bientôt !")}
            >
              <Scan className="size-3" />
              scanner
            </button>{" "}
            pour un ajout rapide
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Urgent alert banner */}
      {urgentBoxes.length > 0 && (
        <div className="bg-fresh-cook/10 border-fresh-cook/30 flex items-center gap-3 rounded-xl border p-4">
          <div className="bg-fresh-cook/20 flex size-10 shrink-0 items-center justify-center rounded-full">
            <AlertTriangle className="text-fresh-cook size-5" />
          </div>
          <div className="flex-1">
            <p className="text-fresh-cook font-medium">
              {urgentBoxes.length} boîte{urgentBoxes.length > 1 ? "s" : ""} à
              consommer rapidement
            </p>
            <p className="text-muted-foreground text-sm">
              Ces œufs arrivent bientôt à expiration. Parfait pour des œufs durs
              !
            </p>
          </div>
          <Eggy mood="worried" size="md" className="hidden sm:block" />
        </div>
      )}

      {/* Header with add button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-xl font-semibold">
            Vos boîtes d'œufs
          </h3>
          <p className="text-muted-foreground text-sm">
            {sortedBoxes.length} boîte{sortedBoxes.length > 1 ? "s" : ""} active
            {sortedBoxes.length > 1 ? "s" : ""}
          </p>
        </div>
        <Button variant="neubrutalism-outline" onClick={handleAddBox}>
          <Plus className="mr-2 size-4" />
          Ajouter
        </Button>
      </div>

      {/* Grid of egg boxes */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sortedBoxes.map((eggBox) => (
          <EggBoxCard
            key={eggBox.id}
            eggBox={eggBox}
            onConsume={handleConsume}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
