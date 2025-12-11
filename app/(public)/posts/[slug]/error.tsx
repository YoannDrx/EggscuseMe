"use client";

import { NeoButton } from "@/components/neo";
import { cn } from "@/lib/utils";
import { logger } from "@/lib/logger";
import type { ErrorParams } from "@/types/next";
import { AlertCircle, RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function RouteError({ error, reset }: ErrorParams) {
  useEffect(() => {
    logger.error(error);
  }, [error]);

  return (
    <div className="bg-neo-bg flex min-h-[60vh] items-center justify-center px-4">
      <div
        className={cn(
          "border-neo-border bg-neo-card",
          "rounded-[var(--radius-neo-2xl)] border-[length:var(--border-neo)]",
          "max-w-md p-8 text-center shadow-[var(--shadow-neo-lg)]",
        )}
      >
        <div
          className={cn(
            "border-neo-border bg-red-500/10",
            "mx-auto mb-6 flex size-16 items-center justify-center",
            "rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)]",
          )}
        >
          <AlertCircle className="size-8 text-red-500" />
        </div>
        <h1 className="font-heading text-neo-text mb-2 text-2xl font-bold">
          Erreur de chargement
        </h1>
        <p className="text-neo-text-muted mb-6">
          Une erreur est survenue lors du chargement de cet article. Veuillez
          réessayer.
        </p>
        <NeoButton onClick={reset} className="gap-2">
          <RotateCcw className="size-4" />
          Réessayer
        </NeoButton>
      </div>
    </div>
  );
}
