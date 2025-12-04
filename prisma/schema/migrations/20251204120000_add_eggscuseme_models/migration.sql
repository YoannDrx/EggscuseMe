-- EggscuseMe: Add all missing models for fridge and egg management
-- This migration adds the new simplified architecture (Fridge replaces Organization)

-- CreateEnum
CREATE TYPE "EggSize" AS ENUM ('S', 'M', 'L', 'XL');

-- CreateEnum
CREATE TYPE "CookingType" AS ENUM ('SOFT_BOILED', 'POACHED', 'RAW', 'FRIED', 'SCRAMBLED', 'OMELETTE', 'HARD_BOILED', 'BAKING', 'OTHER');

-- CreateEnum
CREATE TYPE "FridgeRole" AS ENUM ('OWNER', 'GUEST');

-- CreateEnum
CREATE TYPE "YolkPreference" AS ENUM ('RUNNY', 'SOFT', 'MEDIUM', 'HARD');

ALTER TABLE "public"."user" ADD COLUMN "stripeCustomerId" TEXT;

-- CreateTable: fridge
CREATE TABLE "public"."fridge" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Mon Frigo',
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fridge_pkey" PRIMARY KEY ("id")
);

-- CreateTable: fridge_member
CREATE TABLE "public"."fridge_member" (
    "id" TEXT NOT NULL,
    "fridgeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "FridgeRole" NOT NULL DEFAULT 'GUEST',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fridge_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable: fridge_share_link
CREATE TABLE "public"."fridge_share_link" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "fridgeId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "maxUses" INTEGER NOT NULL DEFAULT 5,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fridge_share_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable: user_subscription
CREATE TABLE "public"."user_subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "status" TEXT,
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable: egg_box
CREATE TABLE "public"."egg_box" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "layingDate" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 6,
    "remaining" INTEGER NOT NULL DEFAULT 6,
    "size" "EggSize" NOT NULL DEFAULT 'M',
    "source" TEXT,
    "barcode" TEXT,
    "userId" TEXT NOT NULL,
    "fridgeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "egg_box_pkey" PRIMARY KEY ("id")
);

-- CreateTable: egg_consumption
CREATE TABLE "public"."egg_consumption" (
    "id" TEXT NOT NULL,
    "eggBoxId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "cookingType" "CookingType" NOT NULL,
    "rating" INTEGER,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "egg_consumption_pkey" PRIMARY KEY ("id")
);

-- CreateTable: user_preferences
CREATE TABLE "public"."user_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "defaultEggSize" "EggSize" NOT NULL DEFAULT 'M',
    "preferredYolk" "YolkPreference" NOT NULL DEFAULT 'RUNNY',
    "notifyDaysBefore" INTEGER NOT NULL DEFAULT 2,
    "notifyEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fridge_ownerId_key" ON "public"."fridge"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "fridge_member_fridgeId_userId_key" ON "public"."fridge_member"("fridgeId", "userId");

-- CreateIndex
CREATE INDEX "fridge_member_userId_idx" ON "public"."fridge_member"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "fridge_share_link_code_key" ON "public"."fridge_share_link"("code");

-- CreateIndex
CREATE INDEX "fridge_share_link_code_idx" ON "public"."fridge_share_link"("code");

-- CreateIndex
CREATE INDEX "fridge_share_link_fridgeId_idx" ON "public"."fridge_share_link"("fridgeId");

-- CreateIndex
CREATE UNIQUE INDEX "user_subscription_userId_key" ON "public"."user_subscription"("userId");

-- CreateIndex
CREATE INDEX "egg_box_userId_idx" ON "public"."egg_box"("userId");

-- CreateIndex
CREATE INDEX "egg_box_fridgeId_idx" ON "public"."egg_box"("fridgeId");

-- CreateIndex
CREATE INDEX "egg_consumption_eggBoxId_idx" ON "public"."egg_consumption"("eggBoxId");

-- CreateIndex
CREATE INDEX "egg_consumption_userId_idx" ON "public"."egg_consumption"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "public"."user_preferences"("userId");

-- AddForeignKey
ALTER TABLE "public"."fridge" ADD CONSTRAINT "fridge_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fridge_member" ADD CONSTRAINT "fridge_member_fridgeId_fkey" FOREIGN KEY ("fridgeId") REFERENCES "public"."fridge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fridge_member" ADD CONSTRAINT "fridge_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fridge_share_link" ADD CONSTRAINT "fridge_share_link_fridgeId_fkey" FOREIGN KEY ("fridgeId") REFERENCES "public"."fridge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_subscription" ADD CONSTRAINT "user_subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."egg_box" ADD CONSTRAINT "egg_box_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."egg_box" ADD CONSTRAINT "egg_box_fridgeId_fkey" FOREIGN KEY ("fridgeId") REFERENCES "public"."fridge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."egg_consumption" ADD CONSTRAINT "egg_consumption_eggBoxId_fkey" FOREIGN KEY ("eggBoxId") REFERENCES "public"."egg_box"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."egg_consumption" ADD CONSTRAINT "egg_consumption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
