"use client";

import { NeoButton } from "@/components/neo/neo-button";
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
import { useCallback, useMemo } from "react";
import { AddEggBoxForm } from "./add-egg-box-form";
import { ConsumeEggsForm } from "./consume-eggs-form";

type EggBoxGridProps = {
  eggBoxes: EggBox[];
  canModify: boolean;
  now?: number;
};

export function EggBoxGrid({ eggBoxes, canModify, now }: EggBoxGridProps) {
  const t = useTranslations("fridge.grid");
  const router = useRouter();
  const referenceDate = useMemo(
    () => new Date(now ?? Date.now()),
    [now],
  );
  const getFreshness = useCallback(
    (box: EggBox) => calculateFreshness(new Date(box.layingDate), referenceDate),
    [referenceDate],
  );

  // Sort by freshness priority (most urgent first)
  const sortedBoxes = useMemo(
    () =>
      [...eggBoxes]
        .filter((box) => box.remaining > 0)
        .sort((a, b) => {
          const freshnessA = getFreshness(a);
          const freshnessB = getFreshness(b);
          return freshnessA.daysRemaining - freshnessB.daysRemaining;
        }),
    [eggBoxes, getFreshness],
  );

  // Check for urgent boxes (need attention soon)
  const urgentBoxes = useMemo(
    () =>
      sortedBoxes.filter((box) => {
        const freshness = getFreshness(box);
        return (
          freshness.status === "cook-thoroughly" || freshness.daysRemaining <= 5
        );
      }),
    [sortedBoxes, getFreshness],
  );

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
        className="border-neo-border bg-neo-card/50 flex flex-col items-center rounded-[var(--radius-neo-2xl)] border-2 border-dashed p-8 text-center"
      >
        <IlluFridgeEmpty className="size-48" />
        <h3 className="text-neo-text mt-4 text-xl font-bold">
          {t("empty.title")}
        </h3>
        <p className="text-neo-text-muted mt-2 max-w-sm text-sm">
          {canModify
            ? t("empty.ownerDescription")
            : t("empty.guestDescription")}
        </p>
        {canModify && (
          <div className="mt-6 space-y-3">
            <NeoButton
              type="button"
              onClick={handleAddBox}
              variant="primary"
              rounded="full"
              className="px-6"
            >
              <IconPlusSticker className="mr-2 size-5" />
              {t("empty.addFirstBox")}
            </NeoButton>
            <p className="text-neo-text-muted text-xs">
              {t("empty.orUse")}{" "}
              <button
                type="button"
                className="text-neo-accent hover:text-neo-accent/80 inline-flex items-center gap-1 underline transition-colors"
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
          className="border-fresh-cook/30 bg-fresh-cook/10 flex items-center gap-3 rounded-[var(--radius-neo-2xl)] border p-4"
        >
          <IconWarningSticker className="size-10 shrink-0" />
          <div className="flex-1">
            <p className="text-fresh-cook font-medium">
              {t("urgent.title", { count: urgentBoxes.length })}
            </p>
            <p className="text-neo-text-muted text-sm">
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
          <h3 className="text-neo-text text-lg font-bold">
            {t("header.title")}
          </h3>
          <p className="text-neo-text-muted text-sm">
            {t("header.activeBoxes", { count: sortedBoxes.length })}
          </p>
        </div>
        {canModify && (
          <NeoButton
            type="button"
            onClick={handleAddBox}
            variant="outline"
            rounded="full"
          >
            <Plus className="mr-2 size-4" />
            {t("header.add")}
          </NeoButton>
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
            referenceDate={referenceDate}
          />
        ))}
      </div>
    </div>
  );
}
