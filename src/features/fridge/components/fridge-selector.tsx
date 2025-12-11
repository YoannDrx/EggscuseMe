"use client";

import { NeoBadge, NeoButton } from "@/components/neo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { hasChefAccess } from "@/lib/auth/stripe/auth-plans";
import type { FridgeType } from "@/generated/prisma";
import {
  Check,
  ChevronDown,
  Plus,
  Refrigerator,
  Settings,
  Warehouse,
} from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  getMyFridgesAction,
  setDefaultFridgeAction,
} from "../multi-fridge.action";

type FridgeInfo = {
  id: string;
  name: string;
  fridgeType: FridgeType;
  isDefault: boolean;
  _count: {
    eggBoxes: number;
    members: number;
  };
};

type FridgeSelectorProps = {
  currentFridgeId: string;
  currentFridgeName: string;
  plan: string | null;
};

const FRIDGE_TYPE_ICONS: Record<FridgeType, typeof Refrigerator> = {
  MAIN: Refrigerator,
  CELLAR: Warehouse,
  GARAGE: Warehouse,
  SECONDARY: Refrigerator,
  OTHER: Refrigerator,
};

const FRIDGE_TYPE_LABELS: Record<FridgeType, { fr: string; en: string }> = {
  MAIN: { fr: "Principal", en: "Main" },
  CELLAR: { fr: "Cave", en: "Cellar" },
  GARAGE: { fr: "Garage", en: "Garage" },
  SECONDARY: { fr: "Secondaire", en: "Secondary" },
  OTHER: { fr: "Autre", en: "Other" },
};

export function FridgeSelector({
  currentFridgeId,
  currentFridgeName,
  plan,
}: FridgeSelectorProps) {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fridges, setFridges] = useState<FridgeInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const isChef = hasChefAccess(plan);

  const copy =
    locale === "fr"
      ? {
          switchFridge: "Changer de frigo",
          manageFridges: "Gerer mes frigos",
          addFridge: "Ajouter un frigo",
          eggBoxes: "boites",
          members: "membres",
          current: "Actuel",
          switching: "Changement...",
          switchSuccess: "Frigo change !",
          switchError: "Erreur lors du changement",
          chefOnly: "Plan Chef requis",
        }
      : {
          switchFridge: "Switch fridge",
          manageFridges: "Manage fridges",
          addFridge: "Add a fridge",
          eggBoxes: "boxes",
          members: "members",
          current: "Current",
          switching: "Switching...",
          switchSuccess: "Fridge switched!",
          switchError: "Error switching fridge",
          chefOnly: "Chef plan required",
        };

  const loadFridges = async () => {
    if (isLoaded) return;

    const result = await getMyFridgesAction();
    if (result.data?.fridges) {
      setFridges(result.data.fridges);
      setIsLoaded(true);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && !isLoaded) {
      void loadFridges();
    }
  };

  const handleSwitchFridge = (fridgeId: string) => {
    if (fridgeId === currentFridgeId) return;

    startTransition(async () => {
      const result = await setDefaultFridgeAction({ fridgeId });
      if (result.data?.success) {
        toast.success(copy.switchSuccess);
        router.refresh();
        setIsOpen(false);
      } else {
        toast.error(copy.switchError);
      }
    });
  };

  // If user is not Chef, don't show the selector (they only have 1 fridge)
  if (!isChef) {
    return null;
  }

  const Icon = FRIDGE_TYPE_ICONS.MAIN;

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <NeoButton variant="ghost" size="sm" className="gap-2">
          <Icon className="size-4" />
          <span className="max-w-[120px] truncate">{currentFridgeName}</span>
          <ChevronDown className="size-4" />
        </NeoButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {fridges.length === 0 ? (
          <div className="text-muted-foreground px-2 py-4 text-center text-sm">
            {isPending ? copy.switching : "..."}
          </div>
        ) : (
          <>
            {fridges.map((fridge) => {
              const FridgeIcon = FRIDGE_TYPE_ICONS[fridge.fridgeType];
              const typeLabel =
                locale === "fr"
                  ? FRIDGE_TYPE_LABELS[fridge.fridgeType].fr
                  : FRIDGE_TYPE_LABELS[fridge.fridgeType].en;
              const isCurrent = fridge.id === currentFridgeId;

              return (
                <DropdownMenuItem
                  key={fridge.id}
                  onClick={() => handleSwitchFridge(fridge.id)}
                  disabled={isPending || isCurrent}
                  className="flex cursor-pointer items-center gap-3 py-3"
                >
                  <FridgeIcon className="text-muted-foreground size-5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{fridge.name}</span>
                      {isCurrent && <Check className="text-primary size-4" />}
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <span>{typeLabel}</span>
                      <span>•</span>
                      <span>
                        {fridge._count.eggBoxes} {copy.eggBoxes}
                      </span>
                    </div>
                  </div>
                  {isCurrent && (
                    <NeoBadge variant="secondary" className="text-xs">
                      {copy.current}
                    </NeoBadge>
                  )}
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link
                href="/fridge/settings/fridges"
                className="flex cursor-pointer items-center gap-2"
              >
                <Settings className="size-4" />
                {copy.manageFridges}
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href="/fridge/settings/fridges?action=create"
                className="flex cursor-pointer items-center gap-2"
              >
                <Plus className="size-4" />
                {copy.addFridge}
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
