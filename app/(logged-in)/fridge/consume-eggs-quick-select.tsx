"use client";

import { NeoButton } from "@/components/neo/neo-button";
import type { EggBox } from "@/generated/prisma";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { cn } from "@/lib/utils";
import { getMyFridgeAction } from "@/features/fridge/fridge.action";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { ConsumeEggsForm } from "./consume-eggs-form";

export function ConsumeEggsQuickSelect() {
  const locale = useLocale();
  const tCommon = useTranslations("common");
  const tQuick = useTranslations("fridge.quickActions.consume");

  const [eggBoxes, setEggBoxes] = useState<EggBox[] | null>(null);
  const [selectedBox, setSelectedBox] = useState<EggBox | null>(null);

  const layingDateFormatter = useMemo(
    () => new Intl.DateTimeFormat(locale, { timeZone: "UTC" }),
    [locale],
  );

  useEffect(() => {
    let cancelled = false;

    resolveActionResult(getMyFridgeAction())
      .then((data) => {
        if (cancelled) return;
        setEggBoxes(data.fridge.eggBoxes);
      })
      .catch((error) => {
        if (cancelled) return;
        toast.error(error instanceof Error ? error.message : tCommon("error"));
        setEggBoxes([]);
      });

    return () => {
      cancelled = true;
    };
  }, [tCommon]);

  const activeBoxes = useMemo(() => {
    const boxes = eggBoxes ?? [];
    return [...boxes]
      .filter((b) => b.remaining > 0)
      .sort((a, b) => b.remaining - a.remaining);
  }, [eggBoxes]);

  const getBoxLabel = (box: EggBox) => {
    if (box.name) return box.name;
    const date = layingDateFormatter.format(new Date(box.layingDate));
    return locale === "fr" ? `Boîte du ${date}` : `Box from ${date}`;
  };

  if (selectedBox) {
    return (
      <div className="flex flex-col gap-4">
        <NeoButton
          type="button"
          variant="outline"
          onClick={() => setSelectedBox(null)}
          className="self-start"
        >
          {tCommon("back")}
        </NeoButton>
        <ConsumeEggsForm eggBox={selectedBox} />
      </div>
    );
  }

  if (eggBoxes === null) {
    return (
      <div className="text-neo-text-muted py-4 text-center text-sm">
        {tCommon("loading")}
      </div>
    );
  }

  if (activeBoxes.length === 0) {
    return (
      <div className="text-neo-text-muted py-4 text-center text-sm">
        {tQuick("selectFromFridge")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 py-2">
      {activeBoxes.map((box) => (
        <button
          key={box.id}
          type="button"
          onClick={() => setSelectedBox(box)}
          className={cn(
            "border-neo-border/20 bg-neo-card w-full rounded-[var(--radius-neo-xl)] border p-4 text-left",
            "shadow-[var(--shadow-neo-sm)] transition-all duration-150",
            "active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-neo-text truncate font-semibold">
                {getBoxLabel(box)}
              </p>
              <p className="text-neo-text-muted text-sm">
                {box.remaining} / {box.quantity}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

