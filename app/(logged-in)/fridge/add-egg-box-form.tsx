"use client";

import { NeoButton } from "@/components/neo/neo-button";
import { NeoInput } from "@/components/neo/neo-input";
import { NeoSelect, NeoSelectItem } from "@/components/neo/neo-select";
import type { EggBox, EggSize } from "@/generated/prisma";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import {
  createEggBoxAction,
  updateEggBoxAction,
} from "@/features/fridge/fridge.action";
import {
  calculateFreshnessFromDcrDate,
  parseDateInputValue,
} from "@/features/eggs/lib/freshness-calculator";
import {
  Calculator,
  Calendar,
  Camera,
  Check,
  ChefHat,
  Factory,
  FileText,
  MapPin,
  Tag,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useCurrentFridge } from "./use-current-fridge";

type AddEggBoxFormProps = {
  eggBox?: EggBox;
};

type PendingScan = {
  date: string;
  confidence?: number | null;
  provider?: string;
  remainingScans?: number;
  sourceLabel?: string | null;
};

function toDateInputValue(date: Date | string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

const freshnessLabelKeys = {
  "extra-fresh": "extraFresh",
  fresh: "fresh",
  "cook-thoroughly": "cookThoroughly",
  expired: "expired",
} as const;

export function AddEggBoxForm({ eggBox }: AddEggBoxFormProps) {
  const t = useTranslations("fridge.addBoxForm");
  const freshnessT = useTranslations("freshness");
  const scanT = useTranslations("scanner.vision");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const scanInputRef = useRef<HTMLInputElement>(null);
  const fridgeStore = useCurrentFridge();
  const isChef = fridgeStore?.isChef ?? false;
  const [isScanning, setIsScanning] = useState(false);
  const [pendingScan, setPendingScan] = useState<PendingScan | null>(null);
  const isEditing = Boolean(eggBox);

  const [formData, setFormData] = useState({
    name: eggBox?.name ?? "",
    dcrDate: toDateInputValue(eggBox?.dcrDate),
    quantity: eggBox ? String(eggBox.quantity) : "6",
    remaining: eggBox ? String(eggBox.remaining) : "",
    size: eggBox?.size ?? ("M" as EggSize),
    source: eggBox?.source ?? "",
    // Pro mode fields (Chef only)
    lotNumber: eggBox?.lotNumber ?? "",
    producerCode: eggBox?.producerCode ?? "",
  });

  const freshnessPreview = useMemo(() => {
    if (!formData.dcrDate) return null;

    const dcrDate = parseDateInputValue(formData.dcrDate);
    if (Number.isNaN(dcrDate.getTime())) return null;

    const freshness = calculateFreshnessFromDcrDate(dcrDate);
    return {
      status: freshness.status,
      label: freshnessT(freshnessLabelKeys[freshness.status]),
      days:
        freshness.daysRemaining >= 0
          ? freshnessT("daysRemaining", { count: freshness.daysRemaining })
          : freshnessT("expired"),
    };
  }, [formData.dcrDate, freshnessT]);

  const handleScanImage = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    try {
      const body = new FormData();
      body.append("image", file);

      const response = await fetch("/api/scan/date-vision", {
        method: "POST",
        body,
      });
      const payload = (await response.json()) as {
        date?: string;
        confidence?: number | null;
        errorCode?: string;
        error?: string;
        provider?: string;
        remainingScans?: number;
        sourceLabel?: string | null;
      };

      if (!response.ok || !payload.date) {
        const errorMessages: Partial<Record<string, string>> = {
          file_too_large: scanT("errorFileTooLarge"),
          invalid_date: scanT("errorInvalidFormat"),
          missing_file: scanT("errorUnknown"),
          no_date: scanT("errorNoDate"),
          not_configured: scanT("errorNotConfigured"),
          provider_failed: scanT("errorProviderFailed"),
          rate_limit: scanT("errorRateLimit"),
          timeout: scanT("errorTimeout"),
          unsupported_type: scanT("errorInvalidFileType"),
        };

        toast.error(
          errorMessages[payload.errorCode ?? ""] ??
            payload.error ??
            scanT("errorUnknown"),
        );
        return;
      }

      setPendingScan({
        date: payload.date,
        confidence: payload.confidence,
        provider: payload.provider,
        remainingScans: payload.remainingScans,
        sourceLabel: payload.sourceLabel,
      });
      toast.success(scanT("detected"));
    } catch {
      toast.error(scanT("errorNetwork"));
    } finally {
      setIsScanning(false);
      event.target.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const quantity = Number.parseInt(formData.quantity, 10);
      if (!Number.isFinite(quantity) || quantity <= 0) {
        toast.error(t("addError"));
        return;
      }

      const dcrDate = parseDateInputValue(formData.dcrDate);
      if (Number.isNaN(dcrDate.getTime())) {
        toast.error(t("dateError"));
        return;
      }

      if (eggBox) {
        const remaining = Number.parseInt(formData.remaining, 10);
        if (
          !Number.isFinite(remaining) ||
          remaining < 0 ||
          remaining > quantity
        ) {
          toast.error(t("remainingError"));
          return;
        }

        const result = await updateEggBoxAction({
          id: eggBox.id,
          name: formData.name || undefined,
          dcrDate,
          quantity,
          remaining,
          size: formData.size,
          source: formData.source || undefined,
          lotNumber:
            isChef && formData.lotNumber ? formData.lotNumber : undefined,
          producerCode:
            isChef && formData.producerCode ? formData.producerCode : undefined,
        });

        if (result.data?.eggBox) {
          toast.success(t("editSuccess"));
          dialogManager.closeAll();
          router.refresh();
        } else {
          toast.error(result.serverError ?? t("editError"));
        }
        return;
      }

      const result = await createEggBoxAction({
        name: formData.name || undefined,
        dcrDate,
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
          id="dcrDate"
          label={t("dcrDate")}
          type="date"
          required
          value={formData.dcrDate}
          onChange={(e) => {
            setPendingScan(null);
            setFormData({ ...formData, dcrDate: e.target.value });
          }}
          icon={<Calendar />}
        />
        {freshnessPreview && (
          <div className="border-neo-border/20 bg-neo-card/60 -mt-2 rounded-xl border p-3">
            <p className="text-neo-text text-sm font-semibold">
              {freshnessPreview.label}
            </p>
            <p className="text-neo-text-muted text-xs">
              {freshnessPreview.days}
            </p>
          </div>
        )}
        <div className="-mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-neo-text-muted text-xs">{t("dcrHint")}</p>
          <input
            ref={scanInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleScanImage}
          />
          <NeoButton
            type="button"
            variant="outline"
            size="sm"
            onClick={() => scanInputRef.current?.click()}
            disabled={isScanning}
            className="shrink-0"
          >
            <Camera className="mr-2 size-4" />
            {isScanning ? scanT("scanning") : scanT("scanDate")}
          </NeoButton>
        </div>
        {pendingScan && (
          <div className="border-neo-border bg-neo-card/70 flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-neo-text text-sm font-semibold">
                {scanT("detectedTitle")}
              </p>
              <p className="text-neo-text-muted text-xs">
                {scanT("detectedDescription", {
                  date: pendingScan.date,
                  provider:
                    pendingScan.provider === "google"
                      ? scanT("providerGoogle")
                      : scanT("providerOpenai"),
                })}
              </p>
              {pendingScan.sourceLabel && (
                <p className="text-neo-text-muted text-xs">
                  {scanT("sourceLabel", { label: pendingScan.sourceLabel })}
                </p>
              )}
              {pendingScan.confidence !== null &&
                pendingScan.confidence !== undefined && (
                  <p className="text-neo-text-muted text-xs">
                    {scanT("confidence", {
                      value: Math.round(pendingScan.confidence * 100),
                    })}
                  </p>
                )}
              {pendingScan.remainingScans !== undefined && (
                <p className="text-neo-text-muted text-xs">
                  {scanT("remaining", { count: pendingScan.remainingScans })}
                </p>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              <NeoButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPendingScan(null)}
              >
                <X className="mr-2 size-4" />
                {scanT("cancel")}
              </NeoButton>
              <NeoButton
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  setFormData((current) => ({
                    ...current,
                    dcrDate: pendingScan.date,
                  }));
                  setPendingScan(null);
                  toast.success(scanT("applied"));
                }}
              >
                <Check className="mr-2 size-4" />
                {scanT("useDate")}
              </NeoButton>
            </div>
          </div>
        )}

        <div className="space-y-2">
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
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-neo-text-muted text-xs">
              {t("quantityPresets")}
            </span>
            {[6, 10, 12, 30].map((quantity) => (
              <button
                key={quantity}
                type="button"
                onClick={() =>
                  setFormData({ ...formData, quantity: String(quantity) })
                }
                className="border-neo-border bg-neo-card hover:bg-neo-accent/10 rounded-full border px-3 py-1 text-xs font-medium transition-colors"
              >
                {quantity}
              </button>
            ))}
          </div>
        </div>

        {isEditing && (
          <NeoInput
            id="remaining"
            label={t("remaining")}
            type="number"
            min={0}
            max={Number.parseInt(formData.quantity, 10) || 100}
            required
            value={formData.remaining}
            onChange={(e) =>
              setFormData({ ...formData, remaining: e.target.value })
            }
            icon={<Calculator />}
          />
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          {isPending
            ? isEditing
              ? t("editSaving")
              : t("saving")
            : isEditing
              ? t("editSave")
              : t("save")}
        </NeoButton>
      </div>
    </form>
  );
}
