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

export function AddEggBoxForm() {
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
      toast.success("Code scanné avec succès !");
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
        toast.success("Boîte ajoutée avec succès");
        dialogManager.closeAll();
        router.refresh();
      } else {
        toast.error(result.serverError ?? "Échec de l'ajout de la boîte");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Scanner toggle */}
      {showScanner ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Scanner</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowScanner(false)}
            >
              <X className="mr-1 size-4" />
              Fermer
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
          Scanner un code-barres
        </Button>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Nom (optionnel)</Label>
        <Input
          id="name"
          placeholder="ex: Boîte du marché"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="layingDate">Date de ponte</Label>
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
          <Label htmlFor="quantity">Quantité</Label>
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
          <Label htmlFor="size">Taille</Label>
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
              <SelectItem value="S">Petit (S)</SelectItem>
              <SelectItem value="M">Moyen (M)</SelectItem>
              <SelectItem value="L">Gros (L)</SelectItem>
              <SelectItem value="XL">Très gros (XL)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="source">Origine (optionnel)</Label>
        <Input
          id="source"
          placeholder="ex: Ferme locale, Supermarché"
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
          Annuler
        </Button>
        <Button type="submit" variant="neubrutalism" disabled={isPending}>
          {isPending ? "Ajout..." : "Ajouter"}
        </Button>
      </div>
    </form>
  );
}
