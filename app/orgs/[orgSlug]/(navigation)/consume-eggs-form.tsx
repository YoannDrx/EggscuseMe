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
import { Textarea } from "@/components/ui/textarea";
import type { CookingType, EggBox } from "@/generated/prisma";
import { consumeEggsAction } from "@/features/eggs";
import { getCookingTypeLabel } from "@/features/eggs/lib/freshness-calculator";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    quantity: 1,
    cookingType: "FRIED" as CookingType,
    notes: "",
  });

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
        toast.success(`${formData.quantity} egg(s) consumed`);
        dialogManager.closeAll();
        router.refresh();
      } else {
        toast.error("Failed to record consumption");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="quantity">How many eggs?</Label>
        <Input
          id="quantity"
          type="number"
          min={1}
          max={eggBox.remaining}
          required
          value={formData.quantity}
          onChange={(e) =>
            setFormData({ ...formData, quantity: parseInt(e.target.value) })
          }
        />
        <p className="text-muted-foreground text-sm">
          {eggBox.remaining} eggs remaining in this box
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cookingType">Cooking type</Label>
        <Select
          value={formData.cookingType}
          onValueChange={(value: CookingType) =>
            setFormData({ ...formData, cookingType: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cookingTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {getCookingTypeLabel(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          placeholder="How was it?"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => dialogManager.closeAll()}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Recording..." : "Record consumption"}
        </Button>
      </div>
    </form>
  );
}
