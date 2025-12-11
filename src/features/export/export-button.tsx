"use client";

import { NeoButton } from "@/components/neo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet, FileText, Package } from "lucide-react";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  exportConsumptionsCSVAction,
  exportEggBoxesCSVAction,
  exportTraceabilityCSVAction,
} from "./export.action";

type ExportButtonProps = {
  fridgeId?: string;
  variant?: "outline" | "ghost" | "primary" | "secondary";
  size?: "sm" | "md" | "lg" | "icon";
};

export function ExportButton({
  fridgeId,
  variant = "outline",
  size = "md",
}: ExportButtonProps) {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const copy =
    locale === "fr"
      ? {
          export: "Exporter",
          exporting: "Export...",
          eggBoxes: "Boites d'oeufs (CSV)",
          eggBoxesDesc: "Liste de toutes vos boites",
          consumptions: "Consommations (CSV)",
          consumptionsDesc: "Historique des consommations",
          traceability: "Tracabilite (CSV)",
          traceabilityDesc: "Rapport avec lots et producteurs",
          success: (count: number) => `Export reussi ! ${count} elements`,
          error: "Erreur lors de l'export",
        }
      : {
          export: "Export",
          exporting: "Exporting...",
          eggBoxes: "Egg boxes (CSV)",
          eggBoxesDesc: "List of all your boxes",
          consumptions: "Consumptions (CSV)",
          consumptionsDesc: "Consumption history",
          traceability: "Traceability (CSV)",
          traceabilityDesc: "Report with lots and producers",
          success: (count: number) => `Export successful! ${count} items`,
          error: "Export error",
        };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportEggBoxes = () => {
    startTransition(async () => {
      const result = await exportEggBoxesCSVAction({ fridgeId });
      if (result.data) {
        downloadCSV(result.data.csv, result.data.filename);
        toast.success(copy.success(result.data.count));
      } else {
        toast.error(result.serverError ?? copy.error);
      }
    });
  };

  const handleExportConsumptions = () => {
    startTransition(async () => {
      const result = await exportConsumptionsCSVAction({ fridgeId });
      if (result.data) {
        downloadCSV(result.data.csv, result.data.filename);
        toast.success(copy.success(result.data.count));
      } else {
        toast.error(result.serverError ?? copy.error);
      }
    });
  };

  const handleExportTraceability = () => {
    startTransition(async () => {
      const result = await exportTraceabilityCSVAction({ fridgeId });
      if (result.data) {
        downloadCSV(result.data.csv, result.data.filename);
        toast.success(copy.success(result.data.count));
      } else {
        toast.error(result.serverError ?? copy.error);
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <NeoButton variant={variant} size={size} disabled={isPending}>
          <Download className="mr-2 size-4" />
          {isPending ? copy.exporting : copy.export}
        </NeoButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuItem
          onClick={handleExportEggBoxes}
          disabled={isPending}
          className="flex cursor-pointer items-start gap-3 py-3"
        >
          <Package className="text-muted-foreground mt-0.5 size-5" />
          <div>
            <div className="font-medium">{copy.eggBoxes}</div>
            <div className="text-muted-foreground text-xs">
              {copy.eggBoxesDesc}
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleExportConsumptions}
          disabled={isPending}
          className="flex cursor-pointer items-start gap-3 py-3"
        >
          <FileText className="text-muted-foreground mt-0.5 size-5" />
          <div>
            <div className="font-medium">{copy.consumptions}</div>
            <div className="text-muted-foreground text-xs">
              {copy.consumptionsDesc}
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleExportTraceability}
          disabled={isPending}
          className="flex cursor-pointer items-start gap-3 py-3"
        >
          <FileSpreadsheet className="mt-0.5 size-5 text-amber-500" />
          <div>
            <div className="flex items-center gap-2 font-medium">
              {copy.traceability}
              <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-xs text-amber-500">
                Pro
              </span>
            </div>
            <div className="text-muted-foreground text-xs">
              {copy.traceabilityDesc}
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
