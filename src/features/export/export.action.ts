"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { hasChefAccess } from "@/lib/auth/stripe/auth-plans";
import { ActionError } from "@/lib/errors/action-error";
import { getOrCreateFridge } from "@/lib/fridge/get-fridge-access";
import { prisma } from "@/lib/prisma";
import { calculateFreshness } from "@/features/eggs/lib/freshness-calculator";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

const ExportSchema = z.object({
  fridgeId: z.string().optional(),
  format: z.enum(["csv"]).default("csv"),
});

const FRESHNESS_LABELS = {
  "extra-fresh": { fr: "Extra-frais", en: "Extra-fresh" },
  fresh: { fr: "Frais", en: "Fresh" },
  "cook-thoroughly": { fr: "A cuire", en: "Cook thoroughly" },
  expired: { fr: "Expire", en: "Expired" },
};

const EGG_SIZE_LABELS = {
  S: "S (< 53g)",
  M: "M (53-63g)",
  L: "L (63-73g)",
  XL: "XL (> 73g)",
};

/**
 * Export egg boxes data as CSV (Chef plan only)
 */
export const exportEggBoxesCSVAction = authAction
  .inputSchema(ExportSchema)
  .action(async ({ parsedInput: { fridgeId }, ctx: { user } }) => {
    const t = await getTranslations("errors");
    const { subscription } = await getOrCreateFridge(user);

    // Check if user has Chef plan
    if (!hasChefAccess(subscription?.plan)) {
      throw new ActionError(t("chefRequired"));
    }

    // Get all fridges for the user or specific fridge
    const fridges = await prisma.fridge.findMany({
      where: fridgeId
        ? { id: fridgeId, ownerId: user.id }
        : { ownerId: user.id },
      include: {
        eggBoxes: {
          orderBy: { layingDate: "desc" },
        },
      },
    });

    if (fridges.length === 0) {
      throw new ActionError(t("fridge.notFound"));
    }

    // Flatten all egg boxes with fridge info
    const allBoxes = fridges.flatMap((fridge) =>
      fridge.eggBoxes.map((box) => ({ ...box, fridgeName: fridge.name })),
    );

    const headers = [
      "ID",
      "Frigo",
      "Nom",
      "Date de ponte",
      "Quantite initiale",
      "Restant",
      "Taille",
      "Source",
      "Fraicheur",
      "Jours restants",
      "N° Lot",
      "Code producteur",
      "Code-barres",
      "Cree le",
    ];

    const rows = allBoxes.map((box) => {
      const freshness = calculateFreshness(box.layingDate);
      const freshnessLabel = FRESHNESS_LABELS[freshness.status].fr;

      return [
        box.id,
        `"${box.fridgeName.replace(/"/g, '""')}"`,
        box.name ? `"${box.name.replace(/"/g, '""')}"` : "-",
        box.layingDate.toISOString().split("T")[0],
        box.quantity,
        box.remaining,
        EGG_SIZE_LABELS[box.size],
        box.source ? `"${box.source.replace(/"/g, '""')}"` : "-",
        freshnessLabel,
        freshness.daysRemaining,
        box.lotNumber ?? "-",
        box.producerCode ?? "-",
        box.barcode ?? "-",
        box.createdAt.toISOString().split("T")[0],
      ];
    });

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
      "\n",
    );

    return {
      csv,
      filename: `eggscuseme-boites-${new Date().toISOString().split("T")[0]}.csv`,
      count: allBoxes.length,
    };
  });

/**
 * Export consumption history as CSV (Chef plan only)
 */
export const exportConsumptionsCSVAction = authAction
  .inputSchema(ExportSchema)
  .action(async ({ parsedInput: { fridgeId }, ctx: { user } }) => {
    const t = await getTranslations("errors");
    const { subscription } = await getOrCreateFridge(user);

    // Check if user has Chef plan
    if (!hasChefAccess(subscription?.plan)) {
      throw new ActionError(t("chefRequired"));
    }

    // Get consumptions
    const consumptions = await prisma.eggConsumption.findMany({
      where: fridgeId
        ? { eggBox: { fridgeId } }
        : { eggBox: { fridge: { ownerId: user.id } } },
      include: {
        eggBox: {
          select: {
            name: true,
            layingDate: true,
            fridge: { select: { name: true } },
          },
        },
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const COOKING_LABELS: Record<string, string> = {
      SOFT_BOILED: "A la coque",
      POACHED: "Poche",
      RAW: "Cru",
      FRIED: "Au plat",
      SCRAMBLED: "Brouilles",
      OMELETTE: "Omelette",
      HARD_BOILED: "Dur",
      BAKING: "Patisserie",
      OTHER: "Autre",
    };

    const headers = [
      "ID",
      "Date",
      "Frigo",
      "Boite",
      "Quantite",
      "Cuisson",
      "Note",
      "Consomme par",
    ];

    const rows = consumptions.map((c) => [
      c.id,
      c.createdAt.toISOString().split("T")[0],
      c.eggBox.fridge?.name
        ? `"${c.eggBox.fridge.name.replace(/"/g, '""')}"`
        : "-",
      c.eggBox.name ? `"${c.eggBox.name.replace(/"/g, '""')}"` : "-",
      c.quantity,
      COOKING_LABELS[c.cookingType] ?? c.cookingType,
      c.rating ? `${c.rating}/5` : "-",
      `"${c.user.name.replace(/"/g, '""')}"`,
    ]);

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
      "\n",
    );

    return {
      csv,
      filename: `eggscuseme-consommations-${new Date().toISOString().split("T")[0]}.csv`,
      count: consumptions.length,
    };
  });

/**
 * Export traceability report as CSV (Chef plan only)
 * Includes lot numbers and producer codes for professional use
 */
export const exportTraceabilityCSVAction = authAction
  .inputSchema(ExportSchema)
  .action(async ({ parsedInput: { fridgeId }, ctx: { user } }) => {
    const t = await getTranslations("errors");
    const { subscription } = await getOrCreateFridge(user);

    // Check if user has Chef plan
    if (!hasChefAccess(subscription?.plan)) {
      throw new ActionError(t("chefRequired"));
    }

    // Get egg boxes with pro fields
    const eggBoxes = await prisma.eggBox.findMany({
      where: fridgeId
        ? { fridgeId, fridge: { ownerId: user.id } }
        : { fridge: { ownerId: user.id } },
      include: {
        fridge: { select: { name: true } },
        consumptions: {
          select: { quantity: true, createdAt: true },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { layingDate: "desc" },
    });

    const headers = [
      "N° Lot",
      "Code producteur",
      "Frigo",
      "Date de ponte",
      "Date limite",
      "Quantite initiale",
      "Consomme",
      "Restant",
      "Statut",
      "Derniere consommation",
    ];

    const rows = eggBoxes.map((box) => {
      const freshness = calculateFreshness(box.layingDate);
      const totalConsumed = box.consumptions.reduce(
        (sum, c) => sum + c.quantity,
        0,
      );
      const lastConsumption = box.consumptions[0] as
        | (typeof box.consumptions)[0]
        | undefined;
      const expirationDate = new Date(box.layingDate);
      expirationDate.setDate(expirationDate.getDate() + 28);

      return [
        box.lotNumber ?? "-",
        box.producerCode ?? "-",
        box.fridge?.name ? `"${box.fridge.name.replace(/"/g, '""')}"` : "-",
        box.layingDate.toISOString().split("T")[0],
        expirationDate.toISOString().split("T")[0],
        box.quantity,
        totalConsumed,
        box.remaining,
        FRESHNESS_LABELS[freshness.status].fr,
        lastConsumption
          ? lastConsumption.createdAt.toISOString().split("T")[0]
          : "-",
      ];
    });

    const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
      "\n",
    );

    return {
      csv,
      filename: `eggscuseme-tracabilite-${new Date().toISOString().split("T")[0]}.csv`,
      count: eggBoxes.length,
    };
  });
