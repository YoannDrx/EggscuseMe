"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EggBox } from "@/generated/prisma";
import { EggBoxCard } from "@/features/eggs/components/egg-box-card";
import { calculateFreshness } from "@/features/eggs/lib/freshness-calculator";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { Egg, Plus } from "lucide-react";
import { deleteEggBoxAction } from "@/features/eggs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AddEggBoxForm } from "./add-egg-box-form";
import { ConsumeEggsForm } from "./consume-eggs-form";

type EggBoxGridProps = {
  eggBoxes: EggBox[];
};

export function EggBoxGrid({ eggBoxes }: EggBoxGridProps) {
  const router = useRouter();

  // Sort by freshness priority (most urgent first)
  const sortedBoxes = [...eggBoxes]
    .filter((box) => box.remaining > 0)
    .sort((a, b) => {
      const freshnessA = calculateFreshness(a.layingDate);
      const freshnessB = calculateFreshness(b.layingDate);
      return freshnessA.daysRemaining - freshnessB.daysRemaining;
    });

  const handleAddBox = () => {
    dialogManager.custom({
      title: "Add Egg Box",
      description: "Track a new box of eggs",
      children: <AddEggBoxForm />,
    });
  };

  const handleConsume = (eggBox: EggBox) => {
    dialogManager.custom({
      title: "Consume Eggs",
      description: `Record eggs consumed from "${eggBox.name ?? "this box"}"`,
      children: <ConsumeEggsForm eggBox={eggBox} />,
    });
  };

  const handleDelete = (eggBox: EggBox) => {
    dialogManager.confirm({
      title: "Delete egg box?",
      description: `Are you sure you want to delete "${eggBox.name ?? "this box"}"? This action cannot be undone.`,
      action: {
        label: "Delete",
        variant: "destructive",
        onClick: async () => {
          const result = await deleteEggBoxAction({ id: eggBox.id });
          if (result.data?.success) {
            toast.success("Egg box deleted");
            router.refresh();
          } else {
            toast.error("Failed to delete egg box");
          }
        },
      },
    });
  };

  if (eggBoxes.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="text-center">
          <div className="bg-muted mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
            <Egg className="text-muted-foreground size-6" />
          </div>
          <CardTitle>No egg boxes yet</CardTitle>
          <CardDescription>
            Add your first egg box to start tracking freshness and reduce waste.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={handleAddBox}>
            <Plus className="mr-2 size-4" />
            Add your first box
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Egg Boxes</h3>
        <Button onClick={handleAddBox} size="sm">
          <Plus className="mr-2 size-4" />
          Add box
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedBoxes.map((eggBox) => (
          <EggBoxCard
            key={eggBox.id}
            eggBox={eggBox}
            onConsume={handleConsume}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
