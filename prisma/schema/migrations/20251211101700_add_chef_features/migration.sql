-- CreateEnum
CREATE TYPE "public"."FridgeType" AS ENUM ('MAIN', 'CELLAR', 'GARAGE', 'SECONDARY', 'OTHER');

-- DropIndex
DROP INDEX "public"."fridge_ownerId_key";

-- AlterTable
ALTER TABLE "public"."egg_box" ADD COLUMN     "lotNumber" TEXT,
ADD COLUMN     "producerCode" TEXT;

-- AlterTable
ALTER TABLE "public"."fridge" ADD COLUMN     "fridgeType" "public"."FridgeType" NOT NULL DEFAULT 'MAIN',
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "location" TEXT;

-- CreateIndex
CREATE INDEX "fridge_ownerId_idx" ON "public"."fridge"("ownerId");
