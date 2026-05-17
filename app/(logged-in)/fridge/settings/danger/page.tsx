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
import { useTranslations } from "next-intl";

export default function DangerZonePage() {
  const t = useTranslations("fridge.settings.dangerPage");
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
      title: t("clearHistoryDialogTitle"),
      description: t("clearHistoryDialogDesc"),
      confirmText: t("clearHistoryDialogConfirm"),
      action: {
        label: t("clearHistoryCta"),
        onClick: async () => {
          setIsClearing(true);
          try {
            const result = await resolveActionResult(
              clearFridgeHistoryAction(),
            );
            toast.success(
              t("clearHistoryToast", { count: result.deletedCount }),
            );
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : t("errorGeneric"),
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
      title: t("clearAllDialogTitle"),
      description: t("clearAllDialogDesc"),
      confirmText: t("clearAllDialogConfirm"),
      action: {
        label: t("clearAllCta"),
        onClick: async () => {
          setIsClearing(true);
          try {
            const result = await resolveActionResult(clearFridgeDataAction());
            toast.success(t("clearAllToast", { count: result.deletedCount }));
          } catch (error) {
            toast.error(
              error instanceof Error ? error.message : t("errorGeneric"),
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
      toast.success(t("exportToast"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("errorGeneric"));
    }
  };

  const handleDeleteAccount = () => {
    dialogManager.confirm({
      title: t("deleteAccountDialogTitle"),
      description: t("deleteAccountDialogDesc"),
      confirmText: t("deleteAccountDialogConfirm"),
      action: {
        label: t("deleteAccountCta"),
        variant: "destructive",
        onClick: async () => {
          await deleteAccountMutation.mutateAsync();
          toast.success(t("deleteAccountToast"), {
            description: t("deleteAccountToastDesc"),
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
        {t("back")}
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Eggy mood="worried" size="lg" />
        <div>
          <h1 className="font-heading text-2xl font-bold">{t("title")}</h1>
          <p className="text-neo-text-muted">{t("subtitle")}</p>
        </div>
      </div>

      {/* Section: Données du frigo */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Egg className="text-neo-text-muted size-5" />
          <h2 className="font-heading text-lg font-semibold">
            {t("fridgeData")}
          </h2>
        </div>

        {/* Export data */}
        <NeoCard>
          <NeoCardHeader>
            <NeoCardTitle className="flex items-center gap-2 text-lg">
              <Download className="size-5" />
              {t("exportTitle")}
            </NeoCardTitle>
            <NeoCardDescription>{t("exportDesc")}</NeoCardDescription>
          </NeoCardHeader>
          <NeoCardContent>
            <p className="text-neo-text-muted text-sm">{t("exportContent")}</p>
          </NeoCardContent>
          <NeoCardFooter>
            <NeoButton variant="outline" onClick={handleExportData}>
              <Download className="mr-2 size-4" />
              {t("exportCta")}
            </NeoButton>
          </NeoCardFooter>
        </NeoCard>

        {/* Clear history */}
        <NeoCard className="border-fresh-cook">
          <NeoCardHeader>
            <NeoCardTitle className="text-fresh-cook flex items-center gap-2 text-lg">
              <History className="size-5" />
              {t("clearHistoryTitle")}
            </NeoCardTitle>
            <NeoCardDescription>{t("clearHistoryDesc")}</NeoCardDescription>
          </NeoCardHeader>
          <NeoCardContent>
            <div className="bg-fresh-cook/10 flex items-start gap-3 rounded-lg border border-dashed p-4">
              <AlertTriangle className="text-fresh-cook mt-0.5 size-5 shrink-0" />
              <p className="text-sm">{t("clearHistoryWarning")}</p>
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
              {t("clearHistoryCta")}
            </LoadingButton>
          </NeoCardFooter>
        </NeoCard>

        {/* Clear all data - OWNER only */}
        {isOwner && (
          <NeoCard className="border-destructive">
            <NeoCardHeader>
              <NeoCardTitle className="text-destructive flex items-center gap-2 text-lg">
                <Egg className="size-5" />
                {t("clearAllTitle")}
              </NeoCardTitle>
              <NeoCardDescription>{t("clearAllDesc")}</NeoCardDescription>
            </NeoCardHeader>
            <NeoCardContent>
              <div className="bg-destructive/10 flex items-start gap-3 rounded-lg border border-dashed p-4">
                <AlertTriangle className="text-destructive mt-0.5 size-5 shrink-0" />
                <p className="text-sm">{t("clearAllWarning")}</p>
              </div>
            </NeoCardContent>
            <NeoCardFooter>
              <LoadingButton
                variant="destructive"
                onClick={handleClearAllData}
                loading={isClearing}
              >
                <Trash2 className="mr-2 size-4" />
                {t("clearAllCta")}
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
            {t("accountSection")}
          </h2>
        </div>

        <NeoCard className="border-destructive">
          <NeoCardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-destructive size-5" />
              <NeoCardTitle className="text-xl font-semibold">
                {t("deleteAccountTitle")}
              </NeoCardTitle>
            </div>
            <NeoCardDescription className="text-neo-text-muted text-base">
              {t("deleteAccountDesc")}
            </NeoCardDescription>
          </NeoCardHeader>
          <NeoCardContent className="space-y-4">
            <div className="rounded-lg border bg-stone-900/50 p-4">
              <div className="flex items-start gap-4">
                <UserX2 className="text-neo-text-muted mt-0.5 size-5" />
                <div className="space-y-1">
                  <p className="leading-none font-medium">
                    {t("personalData")}
                  </p>
                  <p className="text-neo-text-muted text-sm">
                    {t("personalDataDesc")}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border bg-stone-900/50 p-4">
              <div className="flex items-start gap-4">
                <Building2 className="text-neo-text-muted mt-0.5 size-5" />
                <div className="space-y-1">
                  <p className="leading-none font-medium">{t("fridgeData")}</p>
                  <p className="text-neo-text-muted text-sm">
                    {t("fridgeDataDesc")}
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
              {t("deleteAccountCta")}
            </LoadingButton>
          </NeoCardFooter>
        </NeoCard>
      </div>
    </div>
  );
}
