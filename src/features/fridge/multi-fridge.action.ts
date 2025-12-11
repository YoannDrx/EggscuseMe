"use server";

import { authAction } from "@/lib/actions/safe-actions";
import { hasChefAccess } from "@/lib/auth/stripe/auth-plans";
import { ActionError } from "@/lib/errors/action-error";
import { getOrCreateFridge } from "@/lib/fridge/get-fridge-access";
import { prisma } from "@/lib/prisma";
import { SiteConfig } from "@/site-config";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { z } from "zod";

// Schema for creating a new fridge
const CreateFridgeSchema = z.object({
  name: z.string().min(1).max(50),
  fridgeType: z.enum(["MAIN", "CELLAR", "GARAGE", "SECONDARY", "OTHER"]),
  location: z.string().max(100).optional(),
});

// Schema for updating a fridge
const UpdateFridgeSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(50).optional(),
  fridgeType: z
    .enum(["MAIN", "CELLAR", "GARAGE", "SECONDARY", "OTHER"])
    .optional(),
  location: z.string().max(100).nullable().optional(),
});

// Schema for deleting a fridge
const DeleteFridgeSchema = z.object({
  id: z.string(),
});

// Schema for switching active fridge
const SwitchFridgeSchema = z.object({
  fridgeId: z.string(),
});

/**
 * Get all fridges for the current user
 */
export const getMyFridgesAction = authAction.action(
  async ({ ctx: { user } }) => {
    const { subscription } = await getOrCreateFridge(user);
    const isChef = hasChefAccess(subscription?.plan);

    const fridges = await prisma.fridge.findMany({
      where: { ownerId: user.id },
      include: {
        _count: {
          select: { eggBoxes: true, members: true },
        },
      },
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    });

    return {
      fridges,
      canCreateMore: isChef,
      maxFridges: isChef
        ? SiteConfig.plans.chef.maxFridges
        : SiteConfig.plans.brigade.maxFridges,
    };
  },
);

/**
 * Create a new fridge (Chef plan only)
 */
export const createFridgeAction = authAction
  .inputSchema(CreateFridgeSchema)
  .action(async ({ parsedInput: data, ctx: { user } }) => {
    const t = await getTranslations("errors");
    const { subscription } = await getOrCreateFridge(user);

    // Check if user has Chef plan
    if (!hasChefAccess(subscription?.plan)) {
      throw new ActionError(
        `${t("limitReached") 
          } Multi-frigos est une fonctionnalité Chef uniquement.`,
      );
    }

    // Check current fridge count
    const currentCount = await prisma.fridge.count({
      where: { ownerId: user.id },
    });

    const maxFridges = SiteConfig.plans.chef.maxFridges;
    if (currentCount >= maxFridges) {
      throw new ActionError(t("limitReached"));
    }

    // Create the new fridge (not default)
    const fridge = await prisma.fridge.create({
      data: {
        name: data.name,
        fridgeType: data.fridgeType,
        location: data.location,
        ownerId: user.id,
        isDefault: false, // Only the original fridge is default
      },
    });

    revalidatePath("/fridge");
    return { fridge };
  });

/**
 * Update a fridge
 */
export const updateFridgeAction = authAction
  .inputSchema(UpdateFridgeSchema)
  .action(async ({ parsedInput: data, ctx: { user } }) => {
    const t = await getTranslations("errors.fridge");

    // Verify ownership
    const existingFridge = await prisma.fridge.findFirst({
      where: {
        id: data.id,
        ownerId: user.id,
      },
    });

    if (!existingFridge) {
      throw new ActionError(t("notFound"));
    }

    const fridge = await prisma.fridge.update({
      where: { id: data.id },
      data: {
        name: data.name,
        fridgeType: data.fridgeType,
        location: data.location,
      },
    });

    revalidatePath("/fridge");
    return { fridge };
  });

/**
 * Delete a fridge (cannot delete default fridge)
 */
export const deleteFridgeAction = authAction
  .inputSchema(DeleteFridgeSchema)
  .action(async ({ parsedInput: { id }, ctx: { user } }) => {
    const t = await getTranslations("errors.fridge");

    // Verify ownership
    const existingFridge = await prisma.fridge.findFirst({
      where: {
        id,
        ownerId: user.id,
      },
    });

    if (!existingFridge) {
      throw new ActionError(t("notFound"));
    }

    // Cannot delete the default fridge
    if (existingFridge.isDefault) {
      throw new ActionError(
        "Impossible de supprimer le frigo principal. Vous pouvez le renommer.",
      );
    }

    // Delete fridge (will cascade delete egg boxes)
    await prisma.fridge.delete({
      where: { id },
    });

    revalidatePath("/fridge");
    return { success: true };
  });

/**
 * Set a fridge as the default (active) fridge
 */
export const setDefaultFridgeAction = authAction
  .inputSchema(SwitchFridgeSchema)
  .action(async ({ parsedInput: { fridgeId }, ctx: { user } }) => {
    const t = await getTranslations("errors.fridge");

    // Verify ownership
    const targetFridge = await prisma.fridge.findFirst({
      where: {
        id: fridgeId,
        ownerId: user.id,
      },
    });

    if (!targetFridge) {
      throw new ActionError(t("notFound"));
    }

    // Update all user's fridges: set all to non-default, then set target to default
    await prisma.$transaction([
      prisma.fridge.updateMany({
        where: { ownerId: user.id },
        data: { isDefault: false },
      }),
      prisma.fridge.update({
        where: { id: fridgeId },
        data: { isDefault: true },
      }),
    ]);

    revalidatePath("/fridge");
    return { success: true };
  });
