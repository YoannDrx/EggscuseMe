"use client";

import { NeoButton } from "@/components/neo/neo-button";
import { NeoInput } from "@/components/neo/neo-input";
import { NeoSelect, NeoSelectItem } from "@/components/neo/neo-select";
import { NeoTextarea } from "@/components/neo/neo-textarea";
import type { CookingType, EggBox } from "@/generated/prisma";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { calculateEggBoxFreshness } from "@/features/eggs/lib/freshness-calculator";
import {
  consumeEggsAction,
  undoConsumptionAction,
} from "@/features/fridge/fridge.action";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";

type ConsumeEggsFormProps = {
  eggBox: EggBox;
};

const cookingTypes: CookingType[] = [
  "SOFT_BOILED",
  "POACHED",
  "RAW",
  "FRIED",
  "SCRAMBLED",
  "OMELETTE",
  "HARD_BOILED",
  "BAKING",
  "OTHER",
];

function getSuggestedCookingType(eggBox: EggBox): CookingType {
  const freshness = calculateEggBoxFreshness(eggBox);

  switch (freshness.status) {
    case "extra-fresh":
      return "SOFT_BOILED";
    case "fresh":
      return "OMELETTE";
    case "cook-thoroughly":
    case "expired":
      return "HARD_BOILED";
    default:
      return "FRIED";
  }
}

export function ConsumeEggsForm({ eggBox }: ConsumeEggsFormProps) {
  const locale = useLocale();
  const tCooking = useTranslations("cooking");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    quantity: 1,
    cookingType: getSuggestedCookingType(eggBox),
    notes: "",
  });
  const quickQuantities = Array.from(new Set([1, 2, eggBox.remaining])).filter(
    (quantity) => quantity > 0 && quantity <= eggBox.remaining,
  );

  const copy =
    locale === "fr"
      ? {
          success: (quantity: number) =>
            `${quantity} œuf${quantity > 1 ? "s" : ""} consommé${quantity > 1 ? "s" : ""}`,
          error: "Échec de l'enregistrement de la consommation",
          quantityLabel: "Combien d'œufs ?",
          remaining: (count: number) =>
            `${count} œuf${count > 1 ? "s" : ""} restant${count > 1 ? "s" : ""} dans cette boîte`,
          cookingLabel: "Type de cuisson",
          notesLabel: "Notes (optionnel)",
          notesPlaceholder: "Comment c'était ?",
          cancel: "Annuler",
          save: "Enregistrer",
          saving: "Enregistrement...",
          undo: "Annuler",
          undoSuccess: "Consommation annulée",
          undoError: "Impossible d'annuler la consommation",
          quickQuantity: "Quantité rapide",
          all: "Tout",
        }
      : {
          success: (quantity: number) =>
            `${quantity} egg${quantity > 1 ? "s" : ""} logged`,
          error: "Failed to save consumption",
          quantityLabel: "How many eggs?",
          remaining: (count: number) =>
            `${count} egg${count > 1 ? "s" : ""} left in this box`,
          cookingLabel: "Cooking type",
          notesLabel: "Notes (optional)",
          notesPlaceholder: "How was it?",
          cancel: "Cancel",
          save: "Save",
          saving: "Saving...",
          undo: "Undo",
          undoSuccess: "Consumption undone",
          undoError: "Unable to undo consumption",
          quickQuantity: "Quick quantity",
          all: "All",
        };

  const cookingTypeLabels: Record<CookingType, string> = {
    SOFT_BOILED: tCooking("softBoiled"),
    POACHED: tCooking("poached"),
    RAW: tCooking("raw"),
    FRIED: tCooking("fried"),
    SCRAMBLED: tCooking("scrambled"),
    OMELETTE: tCooking("omelette"),
    HARD_BOILED: tCooking("hardBoiled"),
    BAKING: tCooking("baking"),
    OTHER: tCooking("other"),
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await consumeEggsAction({
        eggBoxId: eggBox.id,
        quantity: formData.quantity,
        cookingType: formData.cookingType,
        notes: formData.notes || undefined,
      });

      if (result.data?.consumption) {
        const consumptionId = result.data.consumption.id;
        toast.success(copy.success(formData.quantity), {
          action: {
            label: copy.undo,
            onClick: async () => {
              const undoResult = await undoConsumptionAction({
                consumptionId,
              });
              if (undoResult.data?.success) {
                toast.success(copy.undoSuccess);
                router.refresh();
              } else {
                toast.error(undoResult.serverError ?? copy.undoError);
              }
            },
          },
        });
        dialogManager.closeAll();
        router.refresh();
      } else {
        toast.error(result.serverError ?? copy.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <NeoInput
          id="quantity"
          label={copy.quantityLabel}
          type="number"
          inputSize="md"
          min={1}
          max={eggBox.remaining}
          required
          value={formData.quantity}
          onChange={(e) =>
            setFormData({
              ...formData,
              quantity: Number.parseInt(e.target.value, 10),
            })
          }
        />
        <p className="text-neo-text-muted text-sm">
          {copy.remaining(eggBox.remaining)}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-neo-text-muted text-xs">
            {copy.quickQuantity}
          </span>
          {quickQuantities.map((quantity) => (
            <button
              key={quantity}
              type="button"
              onClick={() => setFormData({ ...formData, quantity })}
              className="border-neo-border bg-neo-card hover:bg-neo-accent/10 rounded-full border px-3 py-1 text-xs font-medium transition-colors"
            >
              {quantity === eggBox.remaining ? copy.all : quantity}
            </button>
          ))}
        </div>
      </div>

      <NeoSelect
        label={copy.cookingLabel}
        value={formData.cookingType}
        onValueChange={(value: string) =>
          setFormData({ ...formData, cookingType: value as CookingType })
        }
      >
        {cookingTypes.map((type) => (
          <NeoSelectItem key={type} value={type}>
            {cookingTypeLabels[type]}
          </NeoSelectItem>
        ))}
      </NeoSelect>

      <NeoTextarea
        id="notes"
        label={copy.notesLabel}
        placeholder={copy.notesPlaceholder}
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
      />

      <div className="flex justify-end gap-2 pt-4">
        <NeoButton
          type="button"
          variant="outline"
          onClick={() => dialogManager.closeAll()}
        >
          {copy.cancel}
        </NeoButton>
        <NeoButton type="submit" variant="primary" disabled={isPending}>
          {isPending ? copy.saving : copy.save}
        </NeoButton>
      </div>
    </form>
  );
}
