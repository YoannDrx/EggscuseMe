"use client";

import { NeoButton } from "@/components/neo/neo-button";
import { NeoInput } from "@/components/neo/neo-input";
import { NeoSelect, NeoSelectItem } from "@/components/neo/neo-select";
import type { EggSize } from "@/generated/prisma";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { createEggBoxAction } from "@/features/fridge/fridge.action";
import { uploadImageAction } from "@/features/images/upload-image.action";
import { DateVisionScanner, type VisionScanData } from "@/features/scanner";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import {
  Calculator,
  Calendar,
  ChefHat,
  Factory,
  FileText,
  MapPin,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useCurrentFridge } from "./use-current-fridge";

async function compressImageForUpload(file: File): Promise<File> {
  if (typeof window === "undefined") return file;
  if (!file.type.startsWith("image/")) return file;

  const bitmap = await createImageBitmap(file);
  const maxDim = 1600;
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), "image/jpeg", 0.82);
  });

  if (!blob) return file;

  return new File([blob], file.name.replace(/\.[^.]+$/u, ".jpg"), {
    type: "image/jpeg",
  });
}

export function AddEggBoxForm() {
  const t = useTranslations("fridge.addBoxForm");
  const tVision = useTranslations("scanner.vision");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isVisionScannerOpen, setIsVisionScannerOpen] = useState(false);
  const fridgeStore = useCurrentFridge();
  const isChef = fridgeStore?.isChef ?? false;

  const [formData, setFormData] = useState({
    name: "",
    layingDate: "",
    quantity: "",
    size: "M" as EggSize,
    source: "",
    scanImageFile: null as File | null,
    // Pro mode fields (Chef only)
    lotNumber: "",
    producerCode: "",
  });

  const handleVisionDateExtracted = (data: VisionScanData) => {
    setFormData((prev) => ({
      ...prev,
      layingDate: data.layingDate.toISOString().split("T")[0],
      quantity:
        typeof data.quantity === "number" ? String(data.quantity) : prev.quantity,
      size: data.size ?? prev.size,
      scanImageFile: data.imageFile ?? prev.scanImageFile,
    }));
    toast.success(tVision("success"));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const quantity = Number.parseInt(formData.quantity, 10);
      if (!Number.isFinite(quantity) || quantity <= 0) {
        toast.error(t("addError"));
        return;
      }

      let scanImageUrl: string | undefined;
      if (formData.scanImageFile) {
        try {
          const file = await compressImageForUpload(formData.scanImageFile);
          const uploadFormData = new FormData();
          uploadFormData.set("files", file);
          scanImageUrl = await resolveActionResult(
            uploadImageAction({ formData: uploadFormData }),
          );
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : t("addError"),
          );
          return;
        }
      }

      const result = await createEggBoxAction({
        name: formData.name || undefined,
        layingDate: new Date(formData.layingDate),
        quantity,
        size: formData.size,
        source: formData.source || undefined,
        scanImageUrl,
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
      {/* Scanner section */}
      {isVisionScannerOpen ? (
        <div className="border-neo-border bg-neo-card animate-in fade-in zoom-in-95 rounded-2xl border-2 p-4 shadow-sm duration-200">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-neo-text flex items-center gap-2 font-bold">
              <Sparkles className="text-primary size-5" />
              {tVision("scanDate")}
            </span>
            <NeoButton
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsVisionScannerOpen(false)}
              className="hover:bg-neo-bg h-8 w-8 rounded-full p-0"
            >
              <X className="size-4" />
            </NeoButton>
          </div>
          <DateVisionScanner
            onDateExtracted={handleVisionDateExtracted}
            onClose={() => setIsVisionScannerOpen(false)}
            autoOpen={true}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          <NeoButton
            type="button"
            variant="outline"
            className="group bg-neo-bg/50 hover:border-primary hover:bg-primary/5 relative h-auto flex-col gap-3 overflow-hidden border-2 py-6 transition-all"
            onClick={() => setIsVisionScannerOpen(true)}
          >
            <div className="from-primary/10 group-hover:from-primary/20 absolute -top-4 -right-4 size-16 rotate-12 rounded-full bg-gradient-to-br to-transparent blur-xl transition-all" />
            <div className="bg-neo-card flex size-12 items-center justify-center rounded-full shadow-sm transition-transform group-hover:scale-110">
              <Sparkles className="text-neo-text group-hover:text-primary size-6" />
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-neo-text group-hover:text-primary text-sm font-bold">
                {tVision("scanDate")}
              </span>
              <span className="text-neo-text-muted text-[10px]">IA Vision</span>
            </div>
          </NeoButton>
        </div>
      )}

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
