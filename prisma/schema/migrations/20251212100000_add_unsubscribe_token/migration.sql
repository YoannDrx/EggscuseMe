-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN "unsubscribeToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_unsubscribeToken_key" ON "public"."user"("unsubscribeToken");
