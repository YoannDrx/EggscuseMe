"use client";

import { NeoButton } from "@/components/neo";
import {
  NeoCard,
  NeoCardContent,
  NeoCardDescription,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
import { NeoInput, NeoLabel } from "@/components/neo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import {
  createFridgeAction,
  deleteFridgeAction,
  getMyFridgesAction,
  setDefaultFridgeAction,
  updateFridgeAction,
} from "@/features/fridge/multi-fridge.action";
import { Eggy } from "@/features/mascot";
import type { FridgeType } from "@/generated/prisma";
import {
  ArrowLeft,
  Check,
  Crown,
  Edit2,
  Plus,
  Refrigerator,
  Star,
  Trash2,
  Warehouse,
} from "lucide-react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

type FridgeInfo = {
  id: string;
  name: string;
  fridgeType: FridgeType;
  location: string | null;
  isDefault: boolean;
  _count: {
    eggBoxes: number;
    members: number;
  };
};

const FRIDGE_TYPE_OPTIONS: { value: FridgeType; fr: string; en: string }[] = [
  { value: "MAIN", fr: "Cuisine principale", en: "Main kitchen" },
  { value: "CELLAR", fr: "Cave", en: "Cellar" },
  { value: "GARAGE", fr: "Garage", en: "Garage" },
  { value: "SECONDARY", fr: "Cuisine secondaire", en: "Secondary kitchen" },
  { value: "OTHER", fr: "Autre", en: "Other" },
];

const FRIDGE_TYPE_ICONS: Record<FridgeType, typeof Refrigerator> = {
  MAIN: Refrigerator,
  CELLAR: Warehouse,
  GARAGE: Warehouse,
  SECONDARY: Refrigerator,
  OTHER: Refrigerator,
};

export default function FridgesPage() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const showCreateOnLoad = searchParams.get("action") === "create";

  const [isPending, startTransition] = useTransition();
  const [fridges, setFridges] = useState<FridgeInfo[]>([]);
  const [canCreateMore, setCanCreateMore] = useState(false);
  const [maxFridges, setMaxFridges] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Create form state
  const [showCreateForm, setShowCreateForm] = useState(showCreateOnLoad);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<FridgeType>("SECONDARY");
  const [newLocation, setNewLocation] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState<FridgeType>("MAIN");
  const [editLocation, setEditLocation] = useState("");

  const copy =
    locale === "fr"
      ? {
          title: "Mes frigos",
          subtitle: "Gérez vos différents espaces de stockage",
          backToSettings: "Retour",
          createTitle: "Nouveau frigo",
          createDesc: "Ajoutez un nouvel espace de stockage",
          name: "Nom",
          namePlaceholder: "ex: Frigo du garage",
          type: "Type",
          location: "Emplacement (optionnel)",
          locationPlaceholder: "ex: Sous-sol",
          create: "Créer",
          creating: "Création...",
          cancel: "Annuler",
          save: "Enregistrer",
          saving: "Enregistrement...",
          edit: "Modifier",
          delete: "Supprimer",
          setDefault: "Définir par défaut",
          default: "Par défaut",
          eggBoxes: "boîtes",
          members: "membres",
          deleteTitle: "Supprimer ce frigo ?",
          deleteDesc:
            "Toutes les boîtes d'œufs de ce frigo seront supprimées. Cette action est irréversible.",
          deleteAction: "Supprimer",
          toastCreated: "Frigo créé !",
          toastUpdated: "Frigo mis à jour !",
          toastDeleted: "Frigo supprimé !",
          toastDefaultSet: "Frigo par défaut défini !",
          toastError: "Une erreur est survenue",
          limitReached: "Limite atteinte",
          limitDesc: (max: number) =>
            `Vous avez atteint la limite de ${max} frigos pour votre plan.`,
          chefBadge: "Chef",
          noFridges: "Aucun frigo",
        }
      : {
          title: "My fridges",
          subtitle: "Manage your different storage spaces",
          backToSettings: "Back",
          createTitle: "New fridge",
          createDesc: "Add a new storage space",
          name: "Name",
          namePlaceholder: "e.g. Garage fridge",
          type: "Type",
          location: "Location (optional)",
          locationPlaceholder: "e.g. Basement",
          create: "Create",
          creating: "Creating...",
          cancel: "Cancel",
          save: "Save",
          saving: "Saving...",
          edit: "Edit",
          delete: "Delete",
          setDefault: "Set as default",
          default: "Default",
          eggBoxes: "boxes",
          members: "members",
          deleteTitle: "Delete this fridge?",
          deleteDesc:
            "All egg boxes in this fridge will be deleted. This action cannot be undone.",
          deleteAction: "Delete",
          toastCreated: "Fridge created!",
          toastUpdated: "Fridge updated!",
          toastDeleted: "Fridge deleted!",
          toastDefaultSet: "Default fridge set!",
          toastError: "An error occurred",
          limitReached: "Limit reached",
          limitDesc: (max: number) =>
            `You have reached the limit of ${max} fridges for your plan.`,
          chefBadge: "Chef",
          noFridges: "No fridges",
        };

  useEffect(() => {
    async function loadFridges() {
      const result = await getMyFridgesAction();
      if (result.data) {
        setFridges(result.data.fridges);
        setCanCreateMore(result.data.canCreateMore);
        setMaxFridges(result.data.maxFridges);
      }
      setIsLoading(false);
    }
    void loadFridges();
  }, []);

  const handleCreate = () => {
    if (!newName.trim()) return;

    startTransition(async () => {
      const result = await createFridgeAction({
        name: newName.trim(),
        fridgeType: newType,
        location: newLocation.trim() || undefined,
      });

      const newFridge = result.data?.fridge;
      if (newFridge) {
        // Add the new fridge with default _count values
        const fridgeWithCount: FridgeInfo = {
          ...newFridge,
          _count: { eggBoxes: 0, members: 0 },
        };
        setFridges((prev) => [...prev, fridgeWithCount]);
        setNewName("");
        setNewType("SECONDARY");
        setNewLocation("");
        setShowCreateForm(false);
        toast.success(copy.toastCreated);
      } else {
        toast.error(result.serverError ?? copy.toastError);
      }
    });
  };

  const handleUpdate = (id: string) => {
    startTransition(async () => {
      const result = await updateFridgeAction({
        id,
        name: editName.trim() || undefined,
        fridgeType: editType,
        location: editLocation.trim() || null,
      });

      const updatedFridge = result.data?.fridge;
      if (updatedFridge) {
        setFridges((prev) =>
          prev.map((f) =>
            f.id === id
              ? {
                  ...f,
                  name: updatedFridge.name,
                  fridgeType: updatedFridge.fridgeType,
                  location: updatedFridge.location,
                }
              : f,
          ),
        );
        setEditingId(null);
        toast.success(copy.toastUpdated);
      } else {
        toast.error(result.serverError ?? copy.toastError);
      }
    });
  };

  const handleDelete = (fridge: FridgeInfo) => {
    dialogManager.confirm({
      title: copy.deleteTitle,
      description: copy.deleteDesc,
      action: {
        label: copy.deleteAction,
        variant: "destructive",
        onClick: async () => {
          const result = await deleteFridgeAction({ id: fridge.id });
          if (result.data?.success) {
            setFridges((prev) => prev.filter((f) => f.id !== fridge.id));
            toast.success(copy.toastDeleted);
          } else {
            toast.error(result.serverError ?? copy.toastError);
          }
        },
      },
    });
  };

  const handleSetDefault = (fridgeId: string) => {
    startTransition(async () => {
      const result = await setDefaultFridgeAction({ fridgeId });
      if (result.data?.success) {
        setFridges((prev) =>
          prev.map((f) => ({
            ...f,
            isDefault: f.id === fridgeId,
          })),
        );
        toast.success(copy.toastDefaultSet);
      } else {
        toast.error(result.serverError ?? copy.toastError);
      }
    });
  };

  const startEdit = (fridge: FridgeInfo) => {
    setEditingId(fridge.id);
    setEditName(fridge.name);
    setEditType(fridge.fridgeType);
    setEditLocation(fridge.location ?? "");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/fridge/settings">
          <NeoButton variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </NeoButton>
        </Link>
        <Eggy mood="happy" size="lg" />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-2xl font-bold">{copy.title}</h1>
            <Crown className="size-5 text-amber-500" />
          </div>
          <p className="text-muted-foreground">{copy.subtitle}</p>
        </div>
      </div>

      {/* Create Form */}
      {showCreateForm ? (
        <NeoCard variant="elevated">
          <NeoCardHeader>
            <NeoCardTitle className="font-heading flex items-center gap-2">
              <Plus className="size-5" />
              {copy.createTitle}
            </NeoCardTitle>
            <NeoCardDescription>{copy.createDesc}</NeoCardDescription>
          </NeoCardHeader>
          <NeoCardContent className="space-y-4">
            <div className="space-y-2">
              <NeoLabel htmlFor="newName">{copy.name}</NeoLabel>
              <NeoInput
                id="newName"
                value={newName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewName(e.target.value)
                }
                placeholder={copy.namePlaceholder}
              />
            </div>

            <div className="space-y-2">
              <NeoLabel>{copy.type}</NeoLabel>
              <Select
                value={newType}
                onValueChange={(v) => setNewType(v as FridgeType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FRIDGE_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {locale === "fr" ? opt.fr : opt.en}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <NeoLabel htmlFor="newLocation">{copy.location}</NeoLabel>
              <NeoInput
                id="newLocation"
                value={newLocation}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewLocation(e.target.value)
                }
                placeholder={copy.locationPlaceholder}
              />
            </div>

            <div className="flex gap-2">
              <NeoButton
                onClick={handleCreate}
                disabled={isPending || !newName.trim()}
              >
                {isPending ? copy.creating : copy.create}
              </NeoButton>
              <NeoButton
                variant="ghost"
                onClick={() => setShowCreateForm(false)}
              >
                {copy.cancel}
              </NeoButton>
            </div>
          </NeoCardContent>
        </NeoCard>
      ) : canCreateMore ? (
        <NeoButton onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 size-4" />
          {copy.createTitle}
        </NeoButton>
      ) : (
        <NeoCard variant="outline" className="border-amber-500/30">
          <NeoCardContent className="flex items-center gap-3 py-4">
            <Crown className="size-5 text-amber-500" />
            <div>
              <p className="font-medium">{copy.limitReached}</p>
              <p className="text-muted-foreground text-sm">
                {copy.limitDesc(maxFridges)}
              </p>
            </div>
          </NeoCardContent>
        </NeoCard>
      )}

      {/* Fridges List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="bg-muted h-24 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : fridges.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">
            {copy.noFridges}
          </p>
        ) : (
          fridges.map((fridge) => {
            const Icon = FRIDGE_TYPE_ICONS[fridge.fridgeType];
            const typeLabel =
              FRIDGE_TYPE_OPTIONS.find((o) => o.value === fridge.fridgeType)?.[
                locale === "fr" ? "fr" : "en"
              ] ?? fridge.fridgeType;
            const isEditing = editingId === fridge.id;

            return (
              <NeoCard
                key={fridge.id}
                variant="elevated"
                className={fridge.isDefault ? "border-primary/30" : ""}
              >
                <NeoCardContent className="py-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <NeoLabel>{copy.name}</NeoLabel>
                        <NeoInput
                          value={editName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEditName(e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <NeoLabel>{copy.type}</NeoLabel>
                        <Select
                          value={editType}
                          onValueChange={(v) => setEditType(v as FridgeType)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FRIDGE_TYPE_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {locale === "fr" ? opt.fr : opt.en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <NeoLabel>{copy.location}</NeoLabel>
                        <NeoInput
                          value={editLocation}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEditLocation(e.target.value)
                          }
                          placeholder={copy.locationPlaceholder}
                        />
                      </div>
                      <div className="flex gap-2">
                        <NeoButton
                          onClick={() => handleUpdate(fridge.id)}
                          disabled={isPending}
                          size="sm"
                        >
                          {isPending ? copy.saving : copy.save}
                        </NeoButton>
                        <NeoButton
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(null)}
                        >
                          {copy.cancel}
                        </NeoButton>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 flex size-12 items-center justify-center rounded-full">
                        <Icon className="text-primary size-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-semibold">
                            {fridge.name}
                          </span>
                          {fridge.isDefault && (
                            <span className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2 py-0.5 text-xs">
                              <Star className="size-3" />
                              {copy.default}
                            </span>
                          )}
                        </div>
                        <div className="text-muted-foreground flex flex-wrap gap-x-3 gap-y-1 text-sm">
                          <span>{typeLabel}</span>
                          {fridge.location && (
                            <>
                              <span>•</span>
                              <span>{fridge.location}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>
                            {fridge._count.eggBoxes} {copy.eggBoxes}
                          </span>
                          <span>•</span>
                          <span>
                            {fridge._count.members} {copy.members}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!fridge.isDefault && (
                          <NeoButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetDefault(fridge.id)}
                            disabled={isPending}
                          >
                            <Check className="mr-1 size-4" />
                            {copy.setDefault}
                          </NeoButton>
                        )}
                        <NeoButton
                          variant="ghost"
                          size="icon"
                          onClick={() => startEdit(fridge)}
                        >
                          <Edit2 className="size-4" />
                        </NeoButton>
                        {!fridge.isDefault && (
                          <NeoButton
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(fridge)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </NeoButton>
                        )}
                      </div>
                    </div>
                  )}
                </NeoCardContent>
              </NeoCard>
            );
          })
        )}
      </div>
    </div>
  );
}
