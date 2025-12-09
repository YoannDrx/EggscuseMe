-- CreateEnum
CREATE TYPE "public"."AdminLogAction" AS ENUM ('IMPERSONATE', 'BAN_USER', 'UNBAN_USER', 'SET_ROLE', 'SEND_TEST_EMAIL', 'CANCEL_INVITATION', 'EXPORT_DATA');

-- CreateTable
CREATE TABLE "public"."admin_log" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" "public"."AdminLogAction" NOT NULL,
    "targetUserId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admin_log_adminId_idx" ON "public"."admin_log"("adminId");

-- CreateIndex
CREATE INDEX "admin_log_targetUserId_idx" ON "public"."admin_log"("targetUserId");

-- CreateIndex
CREATE INDEX "admin_log_action_idx" ON "public"."admin_log"("action");

-- CreateIndex
CREATE INDEX "admin_log_createdAt_idx" ON "public"."admin_log"("createdAt");

-- AddForeignKey
ALTER TABLE "public"."admin_log" ADD CONSTRAINT "admin_log_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."admin_log" ADD CONSTRAINT "admin_log_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
