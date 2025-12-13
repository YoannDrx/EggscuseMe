"use client";

import { NeoButton } from "@/components/neo/neo-button";
import { NeoInput } from "@/components/neo/neo-input";
import { NeoSelect, NeoSelectItem } from "@/components/neo/neo-select";
import { NeoTextarea } from "@/components/neo/neo-textarea";
import type { CookingType, EggBox } from "@/generated/prisma";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { consumeEggsAction } from "@/features/fridge/fridge.action";
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

export function ConsumeEggsForm({ eggBox }: ConsumeEggsFormProps) {
  const locale = useLocale();
  const tCooking = useTranslations("cooking");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    quantity: 1,
    cookingType: "FRIED" as CookingType,
    notes: "",
  });

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
        toast.success(copy.success(formData.quantity));
        dialogManager.closeAll();
        router.refresh();
      } else {
        toast.error(result.serverError ?? copy.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {eggBox.scanImageUrl && (
        <div className="border-neo-border/20 overflow-hidden rounded-[var(--radius-neo-2xl)] border">
          <img
            src={eggBox.scanImageUrl}
            alt=""
            className="h-40 w-full object-cover"
            loading="lazy"
          />
        </div>
      )}

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
            setFormData({ ...formData, quantity: parseInt(e.target.value) })
          }
        />
        <p className="text-neo-text-muted text-sm">
          {copy.remaining(eggBox.remaining)}
        </p>
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
