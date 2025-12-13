"use client";

import { NeoButton } from "@/components/neo/neo-button";
import { NeoInput } from "@/components/neo/neo-input";
import { NeoSelect, NeoSelectItem } from "@/components/neo/neo-select";
import type { EggSize } from "@/generated/prisma";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { createEggBoxAction } from "@/features/fridge/fridge.action";
import {
  Calculator,
  Calendar,
  ChefHat,
  Factory,
  FileText,
  MapPin,
  Tag,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useCurrentFridge } from "./use-current-fridge";

export function AddEggBoxForm() {
  const t = useTranslations("fridge.addBoxForm");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const fridgeStore = useCurrentFridge();
  const isChef = fridgeStore?.isChef ?? false;

  const [formData, setFormData] = useState({
    name: "",
    layingDate: "",
    quantity: "",
    size: "M" as EggSize,
    source: "",
    // Pro mode fields (Chef only)
    lotNumber: "",
    producerCode: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const quantity = Number.parseInt(formData.quantity, 10);
      if (!Number.isFinite(quantity) || quantity <= 0) {
        toast.error(t("addError"));
        return;
      }

      const result = await createEggBoxAction({
        name: formData.name || undefined,
        layingDate: new Date(formData.layingDate),
        quantity,
        size: formData.size,
        source: formData.source || undefined,
        // Pro mode fields (Chef only)
        lotNumber:
          isChef && formData.lotNumber ? formData.lotNumber : undefined,
        producerCode:
          isChef && formData.producerCode ? formData.producerCode : undefined,
      });

      if (result.data?.eggBox) {
        toast.success(t("addSuccess"));
        dialogManager.closeAll();
        router.refresh();
      } else {
        toast.error(result.serverError ?? t("addError"));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="space-y-4">
        <NeoInput
          id="name"
          label={t("nameLabel")}
          placeholder={t("namePlaceholder")}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          icon={<Tag />}
        />

        <NeoInput
          id="layingDate"
          label={t("layingDate")}
          type="date"
          required
          value={formData.layingDate}
          onChange={(e) =>
            setFormData({ ...formData, layingDate: e.target.value })
          }
          icon={<Calendar />}
        />

        <div className="grid grid-cols-2 gap-4">
          <NeoInput
            id="quantity"
            label={t("quantity")}
            type="number"
            min={1}
            max={100}
            required
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: e.target.value })
            }
            icon={<Calculator />}
          />

          <NeoSelect
            label={t("size")}
            value={formData.size}
            onValueChange={(value: string) =>
              setFormData({ ...formData, size: value as EggSize })
            }
          >
            <NeoSelectItem value="S">{t("sizeOptions.S")}</NeoSelectItem>
            <NeoSelectItem value="M">{t("sizeOptions.M")}</NeoSelectItem>
            <NeoSelectItem value="L">{t("sizeOptions.L")}</NeoSelectItem>
            <NeoSelectItem value="XL">{t("sizeOptions.XL")}</NeoSelectItem>
          </NeoSelect>
        </div>

        <NeoInput
          id="source"
          label={t("source")}
          placeholder={t("sourcePlaceholder")}
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
          icon={<MapPin />}
        />
      </div>

      {/* Pro mode fields - Chef plan only */}
      {isChef && (
        <div className="space-y-4 rounded-xl border-2 border-dashed border-amber-500/20 bg-amber-500/5 p-4 transition-all hover:border-amber-500/30">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-amber-500/10">
              <ChefHat className="size-4 text-amber-500" />
            </div>
            <span className="text-sm font-bold tracking-wide text-amber-600 uppercase dark:text-amber-500">
              {t("proMode.title")}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NeoInput
              id="lotNumber"
              label={t("proMode.lotNumber")}
              placeholder={t("proMode.lotNumberPlaceholder")}
              value={formData.lotNumber}
              onChange={(e) =>
                setFormData({ ...formData, lotNumber: e.target.value })
              }
              icon={<FileText />}
            />
            <NeoInput
              id="producerCode"
              label={t("proMode.producerCode")}
              placeholder={t("proMode.producerCodePlaceholder")}
              value={formData.producerCode}
              onChange={(e) =>
                setFormData({ ...formData, producerCode: e.target.value })
              }
              icon={<Factory />}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <NeoButton
          type="button"
          variant="outline"
          onClick={() => dialogManager.closeAll()}
          className="w-full sm:w-auto"
        >
          {t("cancel")}
        </NeoButton>
        <NeoButton
          type="submit"
          variant="primary"
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          {isPending ? t("saving") : t("save")}
        </NeoButton>
      </div>
    </form>
  );
}
