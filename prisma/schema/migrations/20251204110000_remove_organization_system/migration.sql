-- Migration: Remove Organization System
-- The Organization system is being replaced by a simpler Fridge system

-- Step 1: Drop indexes on dependent tables
DROP INDEX IF EXISTS "public"."member_userId_organizationId_idx";
DROP INDEX IF EXISTS "public"."subscription_referenceId_key";
DROP INDEX IF EXISTS "public"."organization_slug_key";

-- Step 2: Remove foreign keys from dependent tables
ALTER TABLE "public"."invitation" DROP CONSTRAINT IF EXISTS "invitation_organizationId_fkey";
ALTER TABLE "public"."invitation" DROP CONSTRAINT IF EXISTS "invitation_inviterId_fkey";
ALTER TABLE "public"."member" DROP CONSTRAINT IF EXISTS "member_organizationId_fkey";
ALTER TABLE "public"."member" DROP CONSTRAINT IF EXISTS "member_userId_fkey";
ALTER TABLE "public"."subscription" DROP CONSTRAINT IF EXISTS "subscription_referenceId_fkey";

-- Step 3: Remove activeOrganizationId column from session
ALTER TABLE "public"."session" DROP COLUMN IF EXISTS "activeOrganizationId";

-- Step 4: Drop dependent tables first (order matters due to FK constraints)
DROP TABLE IF EXISTS "public"."invitation";
DROP TABLE IF EXISTS "public"."member";
DROP TABLE IF EXISTS "public"."subscription";

-- Step 5: Drop the organization table last
DROP TABLE IF EXISTS "public"."organization";

-- Step 6: Re-add stripeCustomerId to user (was moved to organization in migration 20250813011134)
-- Check if column doesn't exist before adding
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'user'
        AND column_name = 'stripeCustomerId'
    ) THEN
        ALTER TABLE "public"."user" ADD COLUMN "stripeCustomerId" TEXT;
    END IF;
END $$;
