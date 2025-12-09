"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EggSize } from "@/generated/prisma";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { createEggBoxAction } from "@/features/fridge/fridge.action";
import { BarcodeScanner, type ParsedEggInfo } from "@/features/scanner";
import { Scan, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function AddEggBoxForm() {
  const t = useTranslations("fridge.addBoxForm");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showScanner, setShowScanner] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    layingDate: new Date().toISOString().split("T")[0],
    quantity: 6,
    size: "M" as EggSize,
    source: "",
  });

  const handleScan = (info: ParsedEggInfo) => {
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
      setShowScanner(false);
      toast.success(t("scanSuccess"));
    }, 1000);
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
      {/* Scanner toggle */}
      {showScanner ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">{t("scannerTitle")}</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowScanner(false)}
            >
              <X className="mr-1 size-4" />
              {t("closeScanner")}
            </Button>
          </div>
          <BarcodeScanner onScan={handleScan} />
        </div>
      ) : (
        <Button
          type="button"
          variant="neubrutalism-outline"
          className="w-full"
          onClick={() => setShowScanner(true)}
        >
          <Scan className="mr-2 size-4" />
          {t("openScanner")}
        </Button>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">{t("nameLabel")}</Label>
        <Input
          id="name"
          placeholder={t("namePlaceholder")}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="layingDate">{t("layingDate")}</Label>
        <Input
          id="layingDate"
          type="date"
          required
          value={formData.layingDate}
          onChange={(e) =>
            setFormData({ ...formData, layingDate: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">{t("quantity")}</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            max={100}
            required
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: parseInt(e.target.value) })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="size">{t("size")}</Label>
          <Select
            value={formData.size}
            onValueChange={(value: string) =>
              setFormData({ ...formData, size: value as EggSize })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="S">{t("sizeOptions.S")}</SelectItem>
              <SelectItem value="M">{t("sizeOptions.M")}</SelectItem>
              <SelectItem value="L">{t("sizeOptions.L")}</SelectItem>
              <SelectItem value="XL">{t("sizeOptions.XL")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="source">{t("source")}</Label>
        <Input
          id="source"
          placeholder={t("sourcePlaceholder")}
          value={formData.source}
          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => dialogManager.closeAll()}
        >
          {t("cancel")}
        </Button>
        <Button type="submit" variant="neubrutalism" disabled={isPending}>
          {isPending ? t("saving") : t("save")}
        </Button>
      </div>
    </form>
  );
}
