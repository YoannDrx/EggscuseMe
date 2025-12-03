/* eslint-disable no-await-in-loop */
/**
 * Migration Script: Organization System → Fridge System
 *
 * This script migrates data from the old Organization-based system
 * to the new simplified Fridge system.
 *
 * Note: await-in-loop is intentionally disabled for this one-time migration script
 * to ensure sequential processing and data integrity.
 *
 * What it does:
 * 1. For each User who owns an Organization:
 *    - Create a Fridge with ownerId = user.id
 *    - Migrate Organization.stripeCustomerId → User.stripeCustomerId
 *    - Migrate Subscription → UserSubscription
 *    - Migrate EggBox.organizationId → EggBox.fridgeId
 *    - Migrate Member (non-owner) → FridgeMember with role GUEST
 *    - Migrate FridgeInvite → FridgeShareLink
 *
 * 2. For EggBoxes without organizationId (personal):
 *    - Create Fridge if user doesn't have one
 *    - Link EggBox to user's Fridge
 *
 * Run with: pnpm tsx prisma/scripts/migrate-to-fridge.ts
 */

import { logger } from "@/lib/logger";
import { FridgeRole } from "@/generated/prisma";
import { nanoid } from "nanoid";
import { prisma } from "../../src/lib/prisma";

async function migrateToFridge() {
  logger.info("🚀 Starting migration: Organization → Fridge system");

  // Stats
  let fridgesCreated = 0;
  let subscriptionsMigrated = 0;
  let eggBoxesMigrated = 0;
  let membersMigrated = 0;
  let shareLinksMigrated = 0;

  // Step 1: Get all users who are owners of an organization
  const ownersWithOrgs = await prisma.member.findMany({
    where: { role: "owner" },
    include: {
      user: true,
      organization: {
        include: {
          subscription: true,
          eggBoxes: true,
          fridgeInvites: true,
        },
      },
    },
  });

  logger.info(
    `📊 Found ${ownersWithOrgs.length} organization owners to migrate`,
  );

  for (const ownerMembership of ownersWithOrgs) {
    const user = ownerMembership.user;
    const org = ownerMembership.organization;

    logger.info(`\n👤 Migrating user: ${user.name} (${user.email})`);
    logger.info(`   Organization: ${org.name}`);

    // Check if user already has a Fridge
    const existingFridge = await prisma.fridge.findUnique({
      where: { ownerId: user.id },
    });

    if (existingFridge) {
      logger.info(`   ⚠️ User already has a Fridge, skipping fridge creation`);
      continue;
    }

    // Start transaction for this user
    await prisma.$transaction(async (tx) => {
      // 1. Create Fridge for the user
      const fridge = await tx.fridge.create({
        data: {
          id: nanoid(11),
          name: org.name || "Mon Frigo",
          ownerId: user.id,
        },
      });
      fridgesCreated++;
      logger.info(`   ✅ Created Fridge: ${fridge.name}`);

      // 2. Migrate stripeCustomerId to User
      if (org.stripeCustomerId) {
        await tx.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: org.stripeCustomerId },
        });
        logger.info(`   ✅ Migrated stripeCustomerId to User`);
      }

      // 3. Migrate Subscription → UserSubscription
      if (org.subscription) {
        const existingUserSub = await tx.userSubscription.findUnique({
          where: { userId: user.id },
        });

        if (!existingUserSub) {
          await tx.userSubscription.create({
            data: {
              id: nanoid(11),
              userId: user.id,
              plan: org.subscription.plan,
              stripeCustomerId:
                org.subscription.stripeCustomerId ?? org.stripeCustomerId,
              stripeSubscriptionId: org.subscription.stripeSubscriptionId,
              status: org.subscription.status,
              periodStart: org.subscription.periodStart,
              periodEnd: org.subscription.periodEnd,
              cancelAtPeriodEnd: org.subscription.cancelAtPeriodEnd ?? false,
            },
          });
          subscriptionsMigrated++;
          logger.info(`   ✅ Migrated Subscription: ${org.subscription.plan}`);
        }
      }

      // 4. Migrate EggBoxes (organizationId → fridgeId)
      if (org.eggBoxes.length > 0) {
        const result = await tx.eggBox.updateMany({
          where: { organizationId: org.id },
          data: { fridgeId: fridge.id },
        });
        eggBoxesMigrated += result.count;
        logger.info(`   ✅ Migrated ${result.count} EggBox(es) to Fridge`);
      }

      // 5. Migrate Members (non-owner) → FridgeMember
      const otherMembers = await tx.member.findMany({
        where: {
          organizationId: org.id,
          role: { not: "owner" },
        },
      });

      for (const member of otherMembers) {
        // Check if already a FridgeMember
        const existing = await tx.fridgeMember.findUnique({
          where: {
            fridgeId_userId: {
              fridgeId: fridge.id,
              userId: member.userId,
            },
          },
        });

        if (!existing) {
          await tx.fridgeMember.create({
            data: {
              id: nanoid(11),
              fridgeId: fridge.id,
              userId: member.userId,
              role: FridgeRole.GUEST,
            },
          });
          membersMigrated++;
        }
      }
      if (otherMembers.length > 0) {
        logger.info(`   ✅ Migrated ${otherMembers.length} member(s) as GUEST`);
      }

      // 6. Migrate FridgeInvite → FridgeShareLink
      for (const invite of org.fridgeInvites) {
        const existingLink = await tx.fridgeShareLink.findUnique({
          where: { code: invite.code },
        });

        if (!existingLink) {
          await tx.fridgeShareLink.create({
            data: {
              id: nanoid(11),
              code: invite.code,
              fridgeId: fridge.id,
              createdById: invite.createdById,
              expiresAt: invite.expiresAt,
              maxUses: invite.maxUses,
              usedCount: invite.usedCount,
              isActive: invite.isActive,
            },
          });
          shareLinksMigrated++;
        }
      }
      if (org.fridgeInvites.length > 0) {
        logger.info(`   ✅ Migrated ${org.fridgeInvites.length} share link(s)`);
      }
    });
  }

  // Step 2: Handle personal EggBoxes (no organizationId)
  logger.info("\n📦 Processing personal EggBoxes (no organization)...");

  const personalEggBoxes = await prisma.eggBox.findMany({
    where: {
      organizationId: null,
      fridgeId: null,
    },
    include: { user: true },
  });

  logger.info(`   Found ${personalEggBoxes.length} personal EggBox(es)`);

  for (const eggBox of personalEggBoxes) {
    // Get or create fridge for this user
    let fridge = await prisma.fridge.findUnique({
      where: { ownerId: eggBox.userId },
    });

    if (!fridge) {
      fridge = await prisma.fridge.create({
        data: {
          id: nanoid(11),
          name: "Mon Frigo",
          ownerId: eggBox.userId,
        },
      });
      fridgesCreated++;
      logger.info(`   ✅ Created Fridge for user: ${eggBox.user.name}`);
    }

    // Link EggBox to Fridge
    await prisma.eggBox.update({
      where: { id: eggBox.id },
      data: { fridgeId: fridge.id },
    });
    eggBoxesMigrated++;
  }

  // Summary
  logger.info(`\n${"=".repeat(50)}`);
  logger.info("📊 MIGRATION SUMMARY");
  logger.info("=".repeat(50));
  logger.info(`   Fridges created:       ${fridgesCreated}`);
  logger.info(`   Subscriptions migrated: ${subscriptionsMigrated}`);
  logger.info(`   EggBoxes migrated:     ${eggBoxesMigrated}`);
  logger.info(`   Members migrated:      ${membersMigrated}`);
  logger.info(`   Share links migrated:  ${shareLinksMigrated}`);
  logger.info("=".repeat(50));
  logger.info("✅ Migration completed successfully!");
}

// Run migration
migrateToFridge()
  .catch((e) => {
    logger.error("❌ Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
