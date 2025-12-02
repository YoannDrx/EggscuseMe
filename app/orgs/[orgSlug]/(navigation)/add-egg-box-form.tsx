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
import { createOrgEggBoxAction } from "@/features/eggs";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export function AddEggBoxForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: "",
    layingDate: new Date().toISOString().split("T")[0],
    quantity: 6,
    size: "M" as EggSize,
    source: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await createOrgEggBoxAction({
        name: formData.name || undefined,
        layingDate: new Date(formData.layingDate),
        quantity: formData.quantity,
        size: formData.size,
        source: formData.source || undefined,
      });

      if (result.data?.eggBox) {
        toast.success("Egg box added successfully");
        dialogManager.closeAll();
        router.refresh();
      } else {
        toast.error("Failed to add egg box");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name (optional)</Label>
        <Input
          id="name"
          placeholder="e.g., Market box"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="layingDate">Laying date</Label>
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
          <Label htmlFor="quantity">Quantity</Label>
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
          <Label htmlFor="size">Egg size</Label>
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
              <SelectItem value="S">Small (S)</SelectItem>
              <SelectItem value="M">Medium (M)</SelectItem>
              <SelectItem value="L">Large (L)</SelectItem>
              <SelectItem value="XL">Extra Large (XL)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="source">Source (optional)</Label>
        <Input
          id="source"
          placeholder="e.g., Local farm, Supermarket"
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
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Adding..." : "Add box"}
        </Button>
      </div>
    </form>
  );
}
