"use client";

import { Button } from "@/components/ui/button";
import {
  IlluFridgeEmpty,
  IconPlusSticker,
  IconWarningSticker,
} from "@/components/eggscuseme/illustrations";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { EggBoxCard } from "@/features/eggs/components/egg-box-card";
import { calculateFreshness } from "@/features/eggs/lib/freshness-calculator";
import { deleteEggBoxAction } from "@/features/fridge/fridge.action";
import { Eggy } from "@/features/mascot";
import type { EggBox } from "@/generated/prisma";
import { Plus, Scan } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AddEggBoxForm } from "./add-egg-box-form";
import { ConsumeEggsForm } from "./consume-eggs-form";

type EggBoxGridProps = {
  eggBoxes: EggBox[];
  canModify: boolean;
};

export function EggBoxGrid({ eggBoxes, canModify }: EggBoxGridProps) {
  const t = useTranslations("fridge.grid");
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
      title: t("addBox.title"),
      description: t("addBox.description"),
      children: <AddEggBoxForm />,
    });
  };

  const handleConsume = (eggBox: EggBox) => {
    dialogManager.custom({
      title: t("consume.title"),
      description: t("consume.description", {
        name: eggBox.name ?? t("thisBox"),
      }),
      children: <ConsumeEggsForm eggBox={eggBox} />,
    });
  };

  const handleDelete = (eggBox: EggBox) => {
    if (!canModify) {
      toast.error(t("delete.ownerOnly"));
      return;
    }

    dialogManager.confirm({
      title: t("delete.title"),
      description: t("delete.description", {
        name: eggBox.name ?? t("thisBox"),
      }),
      action: {
        label: t("delete.confirm"),
        variant: "destructive",
        onClick: async () => {
          const result = await deleteEggBoxAction({ id: eggBox.id });
          if (result.data?.success) {
            toast.success(t("delete.success"));
            router.refresh();
          } else {
            toast.error(t("delete.error"));
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
        className="border-border bg-card/50 flex flex-col items-center rounded-2xl border-2 border-dashed p-8 text-center"
      >
        <IlluFridgeEmpty className="size-48" />
        <h3 className="text-foreground mt-4 text-xl font-bold">
          {t("empty.title")}
        </h3>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm">
          {canModify
            ? t("empty.ownerDescription")
            : t("empty.guestDescription")}
        </p>
        {canModify && (
          <div className="mt-6 space-y-3">
            <Button
              onClick={handleAddBox}
              className="glow-button bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6"
            >
              <IconPlusSticker className="mr-2 size-5" />
              {t("empty.addFirstBox")}
            </Button>
            <p className="text-muted-foreground text-xs">
              {t("empty.orUse")}{" "}
              <button
                type="button"
                className="text-primary hover:text-primary/80 inline-flex items-center gap-1 underline transition-colors"
                onClick={handleAddBox}
              >
                <Scan className="size-3" />
                {t("empty.scanner")}
              </button>{" "}
              {t("empty.forQuickAdd")}
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
          <IconWarningSticker className="size-10 shrink-0" />
          <div className="flex-1">
            <p className="text-fresh-cook font-medium">
              {t("urgent.title", { count: urgentBoxes.length })}
            </p>
            <p className="text-muted-foreground text-sm">
              {t("urgent.description")}
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
          <h3 className="text-foreground text-lg font-bold">
            {t("header.title")}
          </h3>
          <p className="text-muted-foreground text-sm">
            {t("header.activeBoxes", { count: sortedBoxes.length })}
          </p>
        </div>
        {canModify && (
          <Button
            onClick={handleAddBox}
            variant="outline"
            className="border-border bg-card text-foreground hover:border-muted-foreground hover:bg-muted rounded-full"
          >
            <Plus className="mr-2 size-4" />
            {t("header.add")}
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
          className="bg-primary shadow-primary/30 fixed right-4 bottom-24 z-40 flex size-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 sm:hidden"
        >
          <Plus className="text-primary-foreground size-6" />
        </motion.button>
      )}
    </div>
  );
}
