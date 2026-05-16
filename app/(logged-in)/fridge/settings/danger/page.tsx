"use client";

import { NeoButton } from "@/components/neo";
import {
  NeoCard,
  NeoCardContent,
  NeoCardDescription,
  NeoCardFooter,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
import { NeoDivider } from "@/components/neo";
import { dialogManager } from "@/features/dialog-manager/dialog-manager";
import { LoadingButton } from "@/features/form/submit-button";
import {
  clearFridgeDataAction,
  clearFridgeHistoryAction,
  exportFridgeDataAction,
} from "@/features/fridge/fridge-settings.action";
import { Eggy } from "@/features/mascot";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { authClient } from "@/lib/auth-client";
import { unwrapSafePromise } from "@/lib/promises";
import { useMutation } from "@tanstack/react-query";
import {
  AlertTriangle,
  Building2,
  ChevronLeft,
  Download,
  Egg,
  History,
  Trash2,
  UserX2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useCurrentFridge } from "../../use-current-fridge";
import { useLocale } from "next-intl";

export default function DangerZonePage() {
  const locale = useLocale();
  const copy =
    locale === "fr"
      ? {
          back: "Retour aux paramètres",
          title: "Zone de danger",
          subtitle: "Actions irréversibles sur votre frigo et votre compte",
          fridgeData: "Données du frigo",
          exportTitle: "Exporter vos données",
          exportDesc:
            "Téléchargez une copie de toutes vos données au format JSON",
          exportContent:
            "L'export inclut toutes vos boîtes d'œufs, votre historique de consommation et vos préférences.",
          exportCta: "Exporter mes données",
          exportToast: "Export réussi",
          errorGeneric: "Une erreur est survenue",
          clearHistoryTitle: "Effacer l'historique",
          clearHistoryDesc: "Supprime tout votre historique de consommation",
          clearHistoryWarning:
            "Cette action supprimera définitivement tout votre historique de consommation. Vos boîtes d'œufs actuelles seront conservées.",
          clearHistoryCta: "Effacer l'historique",
          clearHistoryDialogTitle: "Effacer l'historique ?",
          clearHistoryDialogDesc:
            "Cette action supprimera définitivement tout votre historique de consommation. Vos boîtes d'œufs actuelles seront conservées.",
          clearHistoryDialogConfirm: "Effacer",
          clearHistoryToast: (count: number) =>
            `Historique effacé avec succès (${count} entrées supprimées)`,
          clearAllTitle: "Vider le frigo",
          clearAllDesc: "Supprime toutes les données de votre frigo",
          clearAllWarning:
            "Cette action supprimera toutes vos boîtes d'œufs, votre historique de consommation et réinitialisera complètement votre frigo.",
          clearAllCta: "Tout supprimer",
          clearAllDialogTitle: "Vider le frigo ?",
          clearAllDialogDesc:
            "Cette action supprimera toutes vos boîtes d'œufs et votre historique de consommation. Cette action est irréversible.",
          clearAllDialogConfirm: "Supprimer toutes les données",
          clearAllToast: (count: number) =>
            `Données supprimées avec succès (${count} boîtes supprimées)`,
          accountSection: "Compte utilisateur",
          deleteAccountTitle: "Supprimer mon compte",
          deleteAccountDesc:
            "Cette action supprimera définitivement votre compte et toutes les données associées",
          personalData: "Données personnelles",
          personalDataDesc:
            "Toutes vos informations personnelles et paramètres seront définitivement effacés",
          fridgeDataDesc:
            "Votre frigo et toutes ses données seront supprimés, ainsi que vos abonnements",
          deleteAccountCta: "Supprimer mon compte",
          deleteAccountDialogTitle: "Supprimer votre compte ?",
          deleteAccountDialogDesc:
            "Cette action est irréversible. Toutes vos données personnelles, vos frigos et votre historique seront définitivement supprimés.",
          deleteAccountDialogConfirm: "Supprimer",
          deleteAccountToast: "Demande de suppression envoyée",
          deleteAccountToastDesc:
            "Vérifiez votre email pour confirmer la suppression.",
        }
      : {
          back: "Back to settings",
          title: "Danger zone",
          subtitle: "Irreversible actions on your fridge and account",
          fridgeData: "Fridge data",
          exportTitle: "Export your data",
          exportDesc: "Download a copy of all your data in JSON format",
          exportContent:
            "Export includes your egg boxes, consumption history, and preferences.",
          exportCta: "Export my data",
          exportToast: "Export successful",
          errorGeneric: "An error occurred",
          clearHistoryTitle: "Clear history",
          clearHistoryDesc: "Delete your consumption history",
          clearHistoryWarning:
            "This will permanently delete your consumption history. Current egg boxes are kept.",
          clearHistoryCta: "Clear history",
          clearHistoryDialogTitle: "Clear history?",
          clearHistoryDialogDesc:
            "This will permanently delete all your consumption history. Current boxes remain.",
          clearHistoryDialogConfirm: "Clear",
          clearHistoryToast: (count: number) =>
            `History cleared (${count} entries removed)`,
          clearAllTitle: "Empty the fridge",
          clearAllDesc: "Delete all data from your fridge",
          clearAllWarning:
            "This will delete all your egg boxes and history and reset your fridge.",
          clearAllCta: "Delete all",
          clearAllDialogTitle: "Empty the fridge?",
          clearAllDialogDesc:
            "This action will delete all egg boxes and your consumption history. This cannot be undone.",
          clearAllDialogConfirm: "Delete all data",
          clearAllToast: (count: number) =>
            `Data deleted successfully (${count} boxes removed)`,
          accountSection: "User account",
          deleteAccountTitle: "Delete my account",
          deleteAccountDesc:
            "This will permanently delete your account and all associated data",
          personalData: "Personal data",
          personalDataDesc:
            "All your personal information and settings will be permanently erased",
          fridgeDataDesc:
            "Your fridge and all its data will be deleted, along with subscriptions",
          deleteAccountCta: "Delete my account",
          deleteAccountDialogTitle: "Delete your account?",
          deleteAccountDialogDesc:
            "This action is irreversible. All personal data, fridges, and history will be permanently deleted.",
          deleteAccountDialogConfirm: "Delete",
          deleteAccountToast: "Deletion request sent",
          deleteAccountToastDesc: "Check your email to confirm deletion.",
        };
  const [isClearing, setIsClearing] = useState(false);
  const fridgeState = useCurrentFridge();
  const isOwner = fridgeState?.role === "OWNER";

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return unwrapSafePromise(
        authClient.deleteUser({
          callbackURL: "/auth/goodbye",
        }),
      );
    },
  });

  const handleClearHistory = () => {
    dialogManager.confirm({
      title: copy.clearHistoryDialogTitle,
      description: copy.clearHistoryDialogDesc,
      confirmText: copy.clearHistoryDialogConfirm,
      action: {
        label: copy.clearHistoryCta,
        onClick: async () => {
          setIsClearing(true);
          try {
            const result = await resolveActionResult(
              clearFridgeHistoryAction(),
            );
            toast.success(copy.clearHistoryToast(result.deletedCount));
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : copy.errorGeneric,
            );
          } finally {
            setIsClearing(false);
          }
        },
      },
    });
  };

  const handleClearAllData = () => {
    dialogManager.confirm({
      title: copy.clearAllDialogTitle,
      description: copy.clearAllDialogDesc,
      confirmText: copy.clearAllDialogConfirm,
      action: {
        label: copy.clearAllCta,
        onClick: async () => {
          setIsClearing(true);
          try {
            const result = await resolveActionResult(clearFridgeDataAction());
            toast.success(copy.clearAllToast(result.deletedCount));
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : copy.errorGeneric,
            );
          } finally {
            setIsClearing(false);
          }
        },
      },
    });
  };

  const handleExportData = async () => {
    try {
      const result = await resolveActionResult(exportFridgeDataAction());
      // Convert to JSON and download
      const blob = new Blob([JSON.stringify(result.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `eggscuseme-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(copy.exportToast);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : copy.errorGeneric);
    }
  };

  const handleDeleteAccount = () => {
    dialogManager.confirm({
      title: copy.deleteAccountDialogTitle,
      description: copy.deleteAccountDialogDesc,
      confirmText: copy.deleteAccountDialogConfirm,
      action: {
        label: copy.deleteAccountCta,
        variant: "destructive",
        onClick: async () => {
          await deleteAccountMutation.mutateAsync();
          toast.success(copy.deleteAccountToast, {
            description: copy.deleteAccountToastDesc,
          });
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/fridge/settings"
        className="text-neo-text-muted hover:text-neo-text inline-flex items-center gap-1 text-sm transition-colors"
      >
        <ChevronLeft className="size-4" />
        {copy.back}
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Eggy mood="worried" size="lg" />
        <div>
          <h1 className="font-heading text-2xl font-bold">{copy.title}</h1>
          <p className="text-neo-text-muted">{copy.subtitle}</p>
        </div>
      </div>

      {/* Section: Données du frigo */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Egg className="text-neo-text-muted size-5" />
          <h2 className="font-heading text-lg font-semibold">
            {copy.fridgeData}
          </h2>
        </div>

        {/* Export data */}
        <NeoCard>
          <NeoCardHeader>
            <NeoCardTitle className="flex items-center gap-2 text-lg">
              <Download className="size-5" />
              {copy.exportTitle}
            </NeoCardTitle>
            <NeoCardDescription>{copy.exportDesc}</NeoCardDescription>
          </NeoCardHeader>
          <NeoCardContent>
            <p className="text-neo-text-muted text-sm">{copy.exportContent}</p>
          </NeoCardContent>
          <NeoCardFooter>
            <NeoButton variant="outline" onClick={handleExportData}>
              <Download className="mr-2 size-4" />
              {copy.exportCta}
            </NeoButton>
          </NeoCardFooter>
        </NeoCard>

        {/* Clear history */}
        <NeoCard className="border-fresh-cook">
          <NeoCardHeader>
            <NeoCardTitle className="text-fresh-cook flex items-center gap-2 text-lg">
              <History className="size-5" />
              {copy.clearHistoryTitle}
            </NeoCardTitle>
            <NeoCardDescription>{copy.clearHistoryDesc}</NeoCardDescription>
          </NeoCardHeader>
          <NeoCardContent>
            <div className="bg-fresh-cook/10 flex items-start gap-3 rounded-lg border border-dashed p-4">
              <AlertTriangle className="text-fresh-cook mt-0.5 size-5 shrink-0" />
              <p className="text-sm">{copy.clearHistoryWarning}</p>
            </div>
          </NeoCardContent>
          <NeoCardFooter>
            <LoadingButton
              variant="outline"
              className="border-fresh-cook text-fresh-cook hover:bg-fresh-cook/10"
              onClick={handleClearHistory}
              loading={isClearing}
            >
              <Trash2 className="mr-2 size-4" />
              {copy.clearHistoryCta}
            </LoadingButton>
          </NeoCardFooter>
        </NeoCard>

        {/* Clear all data - OWNER only */}
        {isOwner && (
          <NeoCard className="border-destructive">
            <NeoCardHeader>
              <NeoCardTitle className="text-destructive flex items-center gap-2 text-lg">
                <Egg className="size-5" />
                {copy.clearAllTitle}
              </NeoCardTitle>
              <NeoCardDescription>{copy.clearAllDesc}</NeoCardDescription>
            </NeoCardHeader>
            <NeoCardContent>
              <div className="bg-destructive/10 flex items-start gap-3 rounded-lg border border-dashed p-4">
                <AlertTriangle className="text-destructive mt-0.5 size-5 shrink-0" />
                <p className="text-sm">{copy.clearAllWarning}</p>
              </div>
            </NeoCardContent>
            <NeoCardFooter>
              <LoadingButton
                variant="destructive"
                onClick={handleClearAllData}
                loading={isClearing}
              >
                <Trash2 className="mr-2 size-4" />
                {copy.clearAllCta}
              </LoadingButton>
            </NeoCardFooter>
          </NeoCard>
        )}
      </div>

      <NeoDivider className="my-8" />

      {/* Section: Compte utilisateur */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <UserX2 className="text-neo-text-muted size-5" />
          <h2 className="font-heading text-lg font-semibold">
            {copy.accountSection}
          </h2>
        </div>

        <NeoCard className="border-destructive">
          <NeoCardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-destructive size-5" />
              <NeoCardTitle className="text-xl font-semibold">
                {copy.deleteAccountTitle}
              </NeoCardTitle>
            </div>
            <NeoCardDescription className="text-neo-text-muted text-base">
              {copy.deleteAccountDesc}
            </NeoCardDescription>
          </NeoCardHeader>
          <NeoCardContent className="space-y-4">
            <div className="rounded-lg border bg-stone-900/50 p-4">
              <div className="flex items-start gap-4">
                <UserX2 className="text-neo-text-muted mt-0.5 size-5" />
                <div className="space-y-1">
                  <p className="leading-none font-medium">
                    {copy.personalData}
                  </p>
                  <p className="text-neo-text-muted text-sm">
                    {copy.personalDataDesc}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-stone-900/50 p-4">
              <div className="flex items-start gap-4">
                <Building2 className="text-neo-text-muted mt-0.5 size-5" />
                <div className="space-y-1">
                  <p className="leading-none font-medium">{copy.fridgeData}</p>
                  <p className="text-neo-text-muted text-sm">
                    {copy.fridgeDataDesc}
                  </p>
                </div>
              </div>
            </div>
          </NeoCardContent>
          <NeoCardFooter className="flex justify-end border-t pt-4">
            <LoadingButton
              variant="destructive"
              size="lg"
              loading={deleteAccountMutation.isPending}
              onClick={handleDeleteAccount}
            >
              {copy.deleteAccountCta}
            </LoadingButton>
          </NeoCardFooter>
        </NeoCard>
      </div>
    </div>
  );
}
