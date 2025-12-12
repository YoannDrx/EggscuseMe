-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EXPIRATION_WARNING', 'WELCOME', 'PASSWORD_RESET', 'FRIDGE_INVITE', 'OTHER');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('SENT', 'FAILED', 'BOUNCED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'PUSH', 'IN_APP');

-- AlterTable
ALTER TABLE "public"."user_preferences" ADD COLUMN "emailEnabled" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "public"."user_preferences" ADD COLUMN "pushEnabled" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "public"."notification_log" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "status" "NotificationStatus" NOT NULL,
    "subject" TEXT,
    "channel" "NotificationChannel" NOT NULL,
    "errorMessage" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notification_log_userId_idx" ON "public"."notification_log"("userId");

-- CreateIndex
CREATE INDEX "notification_log_type_idx" ON "public"."notification_log"("type");

-- CreateIndex
CREATE INDEX "notification_log_createdAt_idx" ON "public"."notification_log"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."notification_log" ADD CONSTRAINT "notification_log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
