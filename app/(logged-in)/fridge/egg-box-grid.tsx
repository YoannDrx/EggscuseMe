"use client";

import { Button } from "@/components/ui/button";
import type { EggBox } from "@/generated/prisma";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { EggBoxCard } from "@/features/eggs/components/egg-box-card";
import { calculateFreshness } from "@/features/eggs/lib/freshness-calculator";
import { deleteEggBoxAction } from "@/features/fridge/fridge.action";
import { Eggy } from "@/features/mascot";
import { AlertTriangle, Plus, Scan } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AddEggBoxForm } from "./add-egg-box-form";
import { ConsumeEggsForm } from "./consume-eggs-form";

type EggBoxGridProps = {
  eggBoxes: EggBox[];
  canModify: boolean;
};

export function EggBoxGrid({ eggBoxes, canModify }: EggBoxGridProps) {
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
      title: "Ajouter une boite",
      description: "Ajoutez une nouvelle boite d'oeufs a suivre",
      children: <AddEggBoxForm />,
    });
  };

  const handleConsume = (eggBox: EggBox) => {
    dialogManager.custom({
      title: "Consommer des oeufs",
      description: `Enregistrer les oeufs consommes de "${eggBox.name ?? "cette boite"}"`,
      children: <ConsumeEggsForm eggBox={eggBox} />,
    });
  };

  const handleDelete = (eggBox: EggBox) => {
    if (!canModify) {
      toast.error("Seul le proprietaire peut supprimer les boites");
      return;
    }

    dialogManager.confirm({
      title: "Supprimer cette boite ?",
      description: `Etes-vous sur de vouloir supprimer "${eggBox.name ?? "cette boite"}" ? Cette action est irreversible.`,
      action: {
        label: "Supprimer",
        variant: "destructive",
        onClick: async () => {
          const result = await deleteEggBoxAction({ id: eggBox.id });
          if (result.data?.success) {
            toast.success("Boite supprimee");
            router.refresh();
          } else {
            toast.error("Echec de la suppression");
          }
        },
      },
    });
  };

  // Empty state with Eggy mascot
  if (eggBoxes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center rounded-2xl border-2 border-dashed border-stone-800 bg-stone-900/50 p-8 text-center"
      >
        <Eggy mood="sad" size="lg" />
        <h3 className="mt-4 text-xl font-bold text-white">
          Votre frigo est vide !
        </h3>
        <p className="mt-2 max-w-sm text-sm text-stone-400">
          {canModify
            ? "Ajoutez votre premiere boite d'oeufs pour commencer a suivre leur fraicheur."
            : "Le proprietaire n'a pas encore ajoute de boites d'oeufs."}
        </p>
        {canModify && (
          <div className="mt-6 space-y-3">
            <Button
              onClick={handleAddBox}
              className="glow-button rounded-full bg-amber-400 px-6 text-stone-900 hover:bg-amber-300"
            >
              <Plus className="mr-2 size-4" />
              Ajouter ma premiere boite
            </Button>
            <p className="text-xs text-stone-500">
              ou utilisez le{" "}
              <button
                type="button"
                className="inline-flex items-center gap-1 text-amber-400 underline transition-colors hover:text-amber-300"
                onClick={() => toast.info("Scanner a venir bientot !")}
              >
                <Scan className="size-3" />
                scanner
              </button>{" "}
              pour un ajout rapide
            </p>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Urgent alert banner */}
      {urgentBoxes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 rounded-2xl border border-orange-500/30 bg-orange-500/10 p-4"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-orange-500/20">
            <AlertTriangle className="size-5 text-orange-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-orange-400">
              {urgentBoxes.length} boite{urgentBoxes.length > 1 ? "s" : ""} a
              consommer rapidement
            </p>
            <p className="text-sm text-stone-400">
              Ces oeufs arrivent bientot a expiration. Parfait pour des oeufs
              durs !
            </p>
          </div>
          <div className="hidden sm:block">
            <Eggy mood="worried" size="sm" />
          </div>
        </motion.div>
      )}

      {/* Header with add button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Vos boites d'oeufs</h3>
          <p className="text-sm text-stone-500">
            {sortedBoxes.length} boite{sortedBoxes.length > 1 ? "s" : ""} active
            {sortedBoxes.length > 1 ? "s" : ""}
          </p>
        </div>
        {canModify && (
          <Button
            onClick={handleAddBox}
            variant="outline"
            className="rounded-full border-stone-700 bg-stone-900 text-white hover:border-stone-600 hover:bg-stone-800"
          >
            <Plus className="mr-2 size-4" />
            Ajouter
          </Button>
        )}
      </div>

      {/* Grid of egg boxes */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {sortedBoxes.map((eggBox, index) => (
          <EggBoxCard
            key={eggBox.id}
            eggBox={eggBox}
            index={index}
            onConsume={handleConsume}
            onDelete={canModify ? handleDelete : undefined}
          />
        ))}
      </div>

      {/* FAB - Add button mobile */}
      {canModify && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          onClick={handleAddBox}
          className="fixed right-4 bottom-24 z-40 flex size-14 items-center justify-center rounded-full bg-amber-400 shadow-lg shadow-amber-400/30 transition-transform hover:scale-105 active:scale-95 sm:hidden"
        >
          <Plus className="size-6 text-stone-900" />
        </motion.button>
      )}
    </div>
  );
}
