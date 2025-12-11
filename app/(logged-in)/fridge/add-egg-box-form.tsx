"use client";

import { NeoButton } from "@/components/neo/neo-button";
import { NeoInput } from "@/components/neo/neo-input";
import { NeoSelect, NeoSelectItem } from "@/components/neo/neo-select";
import type { EggSize } from "@/generated/prisma";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { createEggBoxAction } from "@/features/fridge/fridge.action";
import {
  BarcodeScanner,
  DateVisionScanner,
  type ParsedEggInfo,
} from "@/features/scanner";
import { ChefHat, Scan, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useCurrentFridge } from "./use-current-fridge";

type ScanMode = "barcode" | "vision" | null;

export function AddEggBoxForm() {
  const t = useTranslations("fridge.addBoxForm");
  const tVision = useTranslations("scanner.vision");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [scanMode, setScanMode] = useState<ScanMode>(null);
  const fridgeStore = useCurrentFridge();
  const isChef = fridgeStore?.isChef ?? false;

  const [formData, setFormData] = useState({
    name: "",
    layingDate: new Date().toISOString().split("T")[0],
    quantity: 6,
    size: "M" as EggSize,
    source: "",
    // Pro mode fields (Chef only)
    lotNumber: "",
    producerCode: "",
  });

  const handleBarcodeScan = (info: ParsedEggInfo) => {
    // Auto-fill form with scanned data
    setFormData((prev) => ({
      ...prev,
      layingDate: info.layingDate
        ? info.layingDate.toISOString().split("T")[0]
        : prev.layingDate,
      quantity: info.quantity ?? prev.quantity,
      size: info.size ?? prev.size,
      source: info.farmCode ?? info.countryCode ?? prev.source,
    }));

    // Close scanner after successful scan
    setTimeout(() => {
      setScanMode(null);
      toast.success(t("scanSuccess"));
    }, 1000);
  };

  const handleVisionDateExtracted = (layingDate: Date, _ddm: Date | null) => {
    setFormData((prev) => ({
      ...prev,
      layingDate: layingDate.toISOString().split("T")[0],
    }));
    toast.success(tVision("success"));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await createEggBoxAction({
        name: formData.name || undefined,
        layingDate: new Date(formData.layingDate),
        quantity: formData.quantity,
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Scanner section */}
      {scanMode === "barcode" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-neo-text text-base font-bold">
              {t("scannerTitle")}
            </span>
            <NeoButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setScanMode(null)}
            >
              <X className="mr-1 size-4" />
              {t("closeScanner")}
            </NeoButton>
          </div>
          <BarcodeScanner onScan={handleBarcodeScan} />
        </div>
      )}

      {scanMode === "vision" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-neo-text text-base font-bold">
              {tVision("scanDate")}
            </span>
            <NeoButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setScanMode(null)}
            >
              <X className="mr-1 size-4" />
              {t("closeScanner")}
            </NeoButton>
          </div>
          <DateVisionScanner
            onDateExtracted={handleVisionDateExtracted}
            onClose={() => setScanMode(null)}
          />
        </div>
      )}

      {/* Scanner buttons - show when no scanner is active */}
      {scanMode === null && (
        <div className="flex gap-2">
          <NeoButton
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => setScanMode("barcode")}
          >
            <Scan className="mr-2 size-4" />
            {t("openScanner")}
          </NeoButton>
          <NeoButton
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => setScanMode("vision")}
          >
            <Sparkles className="mr-2 size-4" />
            {tVision("scanDate")}
          </NeoButton>
        </div>
      )}

      <NeoInput
        id="name"
        label={t("nameLabel")}
        placeholder={t("namePlaceholder")}
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            setFormData({ ...formData, quantity: parseInt(e.target.value) })
          }
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
      />

      {/* Pro mode fields - Chef plan only */}
      {isChef && (
        <div className="space-y-4 rounded-lg border-2 border-amber-500/30 bg-amber-500/5 p-4">
          <div className="flex items-center gap-2">
            <ChefHat className="size-5 text-amber-500" />
            <span className="text-sm font-semibold text-amber-500">
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
            />
            <NeoInput
              id="producerCode"
              label={t("proMode.producerCode")}
              placeholder={t("proMode.producerCodePlaceholder")}
              value={formData.producerCode}
              onChange={(e) =>
                setFormData({ ...formData, producerCode: e.target.value })
              }
            />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <NeoButton
          type="button"
          variant="outline"
          onClick={() => dialogManager.closeAll()}
        >
          {t("cancel")}
        </NeoButton>
        <NeoButton type="submit" variant="primary" disabled={isPending}>
          {isPending ? t("saving") : t("save")}
        </NeoButton>
      </div>
    </form>
  );
}
