"use server";

import { authAction, orgAction } from "@/lib/actions/safe-actions";
import { ActionError } from "@/lib/errors/action-error";
import { prisma } from "@/lib/prisma";
import { SiteConfig } from "@/site-config";
import { revalidatePath } from "next/cache";
import {
  ConsumeEggsSchema,
  CreateEggBoxSchema,
  DeleteEggBoxSchema,
  UpdateEggBoxSchema,
} from "./egg-box.schema";

/**
 * Create a new egg box
 * Can be personal (user only) or shared (within organization)
 */
export const createEggBoxAction = authAction
  .inputSchema(CreateEggBoxSchema)
  .action(async ({ parsedInput: data, ctx: { user } }) => {
    // Check free plan limits if no organization
    if (!data.organizationId) {
      const existingBoxes = await prisma.eggBox.count({
        where: {
          userId: user.id,
          organizationId: null,
        },
      });

      if (existingBoxes >= SiteConfig.freePlan.maxEggBoxes) {
        throw new ActionError(
          `Free plan is limited to ${SiteConfig.freePlan.maxEggBoxes} egg boxes. Upgrade to Premium for unlimited boxes.`,
        );
      }
    }

    const eggBox = await prisma.eggBox.create({
      data: {
        name: data.name,
        layingDate: data.layingDate,
        quantity: data.quantity,
        remaining: data.quantity,
        size: data.size,
        source: data.source,
        barcode: data.barcode,
        userId: user.id,
        organizationId: data.organizationId,
      },
    });

    revalidatePath("/orgs");
    return { eggBox };
  });

/**
 * Create egg box within an organization (with org context)
 */
export const createOrgEggBoxAction = orgAction
  .metadata({})
  .inputSchema(CreateEggBoxSchema.omit({ organizationId: true }))
  .action(async ({ parsedInput: data, ctx: { org } }) => {
    const eggBox = await prisma.eggBox.create({
      data: {
        name: data.name,
        layingDate: data.layingDate,
        quantity: data.quantity,
        remaining: data.quantity,
        size: data.size,
        source: data.source,
        barcode: data.barcode,
        userId: org.user.id,
        organizationId: org.id,
      },
    });

    revalidatePath(`/orgs/${org.slug}`);
    return { eggBox };
  });

/**
 * Update an egg box
 */
export const updateEggBoxAction = authAction
  .inputSchema(UpdateEggBoxSchema)
  .action(async ({ parsedInput: data, ctx: { user } }) => {
    const existingBox = await prisma.eggBox.findFirst({
      where: {
        id: data.id,
        userId: user.id,
      },
    });

    if (!existingBox) {
      throw new ActionError("Egg box not found or access denied.");
    }

    const eggBox = await prisma.eggBox.update({
      where: { id: data.id },
      data: {
        name: data.name,
        quantity: data.quantity,
        remaining: data.remaining,
        size: data.size,
        source: data.source,
      },
    });

    revalidatePath("/orgs");
    return { eggBox };
  });

/**
 * Delete an egg box
 */
export const deleteEggBoxAction = authAction
  .inputSchema(DeleteEggBoxSchema)
  .action(async ({ parsedInput: { id }, ctx: { user } }) => {
    const existingBox = await prisma.eggBox.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existingBox) {
      throw new ActionError("Egg box not found or access denied.");
    }

    await prisma.eggBox.delete({
      where: { id },
    });

    revalidatePath("/orgs");
    return { success: true };
  });

/**
 * Consume eggs from a box
 */
export const consumeEggsAction = authAction
  .inputSchema(ConsumeEggsSchema)
  .action(async ({ parsedInput: data, ctx: { user } }) => {
    const eggBox = await prisma.eggBox.findFirst({
      where: {
        id: data.eggBoxId,
        userId: user.id,
      },
    });

    if (!eggBox) {
      throw new ActionError("Egg box not found or access denied.");
    }

    if (eggBox.remaining < data.quantity) {
      throw new ActionError(
        `Not enough eggs. Only ${eggBox.remaining} eggs remaining.`,
      );
    }

    // Create consumption record and update remaining count
    const [consumption] = await prisma.$transaction([
      prisma.eggConsumption.create({
        data: {
          eggBoxId: data.eggBoxId,
          quantity: data.quantity,
          cookingType: data.cookingType,
          rating: data.rating,
          notes: data.notes,
          userId: user.id,
        },
      }),
      prisma.eggBox.update({
        where: { id: data.eggBoxId },
        data: {
          remaining: eggBox.remaining - data.quantity,
        },
      }),
    ]);

    revalidatePath("/orgs");
    return { consumption };
  });

/**
 * Get all egg boxes for the current user
 */
export const getEggBoxesAction = authAction.action(
  async ({ ctx: { user } }) => {
    const eggBoxes = await prisma.eggBox.findMany({
      where: {
        userId: user.id,
      },
      include: {
        consumptions: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { layingDate: "asc" },
    });

    return { eggBoxes };
  },
);

/**
 * Get egg boxes for an organization
 */
export const getOrgEggBoxesAction = orgAction
  .metadata({})
  .action(async ({ ctx: { org } }) => {
    const eggBoxes = await prisma.eggBox.findMany({
      where: {
        organizationId: org.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        consumptions: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { layingDate: "asc" },
    });

    return { eggBoxes };
  });

/**
 * Get statistics for the current user
 */
export const getEggStatsAction = authAction.action(
  async ({ ctx: { user } }) => {
    const [totalBoxes, totalConsumed, activeBoxes] = await Promise.all([
      prisma.eggBox.count({
        where: { userId: user.id },
      }),
      prisma.eggConsumption.aggregate({
        where: { userId: user.id },
        _sum: { quantity: true },
      }),
      prisma.eggBox.count({
        where: {
          userId: user.id,
          remaining: { gt: 0 },
        },
      }),
    ]);

    // Calculate eggs saved (eggs consumed before expiration)
    const eggsSaved = totalConsumed._sum.quantity ?? 0;

    // Estimate money saved (average egg price ~0.25€)
    const moneySaved = eggsSaved * 0.25;

    return {
      stats: {
        totalBoxes,
        activeBoxes,
        eggsSaved,
        moneySaved: moneySaved.toFixed(2),
      },
    };
  },
);
