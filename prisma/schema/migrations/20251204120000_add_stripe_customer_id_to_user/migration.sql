-- AlterTable: Add stripeCustomerId to user table
-- This column was previously removed in migration 20250813011134 but is now needed again
ALTER TABLE "public"."user" ADD COLUMN "stripeCustomerId" TEXT;
