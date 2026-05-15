"use client";

import { NeoButton } from "@/components/neo";
import {
  NeoDropdown,
  NeoDropdownContent,
  NeoDropdownItem,
  NeoDropdownTrigger,
} from "@/components/neo/neo-dropdown";
import {
  getMyFridgesAction,
  setDefaultFridgeAction,
} from "@/features/fridge/multi-fridge.action";
import type { FridgeType } from "@/generated/prisma";
import { Check, ChevronsUpDown, Plus, Refrigerator } from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { useCurrentFridge } from "../use-current-fridge";

type FridgeOption = {
  id: string;
  name: string;
  fridgeType: FridgeType;
  isDefault: boolean;
  _count: {
    eggBoxes: number;
    members: number;
  };
};

export function FridgeSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const fridgeState = useCurrentFridge();
  const [fridges, setFridges] = useState<FridgeOption[]>([]);
  const [canCreateMore, setCanCreateMore] = useState(false);
  const [isPending, startTransition] = useTransition();

  const copy =
    locale === "fr"
      ? {
          label: "Changer de frigo",
          defaultBadge: "Actif",
          boxes: "boîtes",
          create: "Créer un frigo",
          changed: "Frigo actif mis à jour",
          error: "Impossible de changer de frigo",
        }
      : {
          label: "Switch fridge",
          defaultBadge: "Active",
          boxes: "boxes",
          create: "Create fridge",
          changed: "Active fridge updated",
          error: "Unable to switch fridge",
        };

  useEffect(() => {
    if (!fridgeState?.isChef || fridgeState.role !== "OWNER") return;

    async function loadFridges() {
      const result = await getMyFridgesAction();
      if (result.data) {
        setFridges(result.data.fridges);
        setCanCreateMore(result.data.canCreateMore);
      }
    }

    void loadFridges();
  }, [fridgeState?.isChef, fridgeState?.role]);

  if (
    !fridgeState ||
    fridgeState.role !== "OWNER" ||
    !fridgeState.isChef ||
    fridges.length <= 1
  ) {
    return null;
  }

  const activeFridge =
    fridges.find((fridge) => fridge.isDefault) ??
    fridges.find((fridge) => fridge.id === fridgeState.id);

  const handleSwitch = (fridgeId: string) => {
    if (fridgeId === activeFridge?.id) return;

    startTransition(async () => {
      const result = await setDefaultFridgeAction({ fridgeId });
      if (result.data?.success) {
        setFridges((current) =>
          current.map((fridge) => ({
            ...fridge,
            isDefault: fridge.id === fridgeId,
          })),
        );
        toast.success(copy.changed);
        router.refresh();
      } else {
        toast.error(result.serverError ?? copy.error);
      }
    });
  };

  return (
    <NeoDropdown>
      <NeoDropdownTrigger asChild>
        <NeoButton
          type="button"
          variant="outline"
          size="sm"
          disabled={isPending}
          aria-label={copy.label}
          className="hidden max-w-[240px] md:inline-flex"
        >
          <Refrigerator className="size-4" />
          <span className="truncate">{activeFridge?.name}</span>
          <ChevronsUpDown className="size-4" />
        </NeoButton>
      </NeoDropdownTrigger>
      <NeoDropdownContent align="end" className="min-w-[260px]">
        {fridges.map((fridge) => (
          <NeoDropdownItem
            key={fridge.id}
            onClick={() => handleSwitch(fridge.id)}
            disabled={isPending}
          >
            <Refrigerator className="size-4" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium">{fridge.name}</span>
              <span className="text-neo-text-muted block text-xs">
                {fridge._count.eggBoxes} {copy.boxes}
              </span>
            </span>
            {fridge.isDefault && (
              <span className="text-neo-accent ml-2 inline-flex items-center gap-1 text-xs font-semibold">
                <Check className="size-3" />
                {copy.defaultBadge}
              </span>
            )}
          </NeoDropdownItem>
        ))}
        {canCreateMore && (
          <NeoDropdownItem
            onClick={() => router.push("/fridge/settings/fridges?action=create")}
          >
            <Plus className="size-4" />
            {copy.create}
          </NeoDropdownItem>
        )}
      </NeoDropdownContent>
    </NeoDropdown>
  );
}
