-- CreateTable
CREATE TABLE "public"."VisionScanUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisionScanUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VisionScanUsage_userId_idx" ON "public"."VisionScanUsage"("userId");

-- CreateIndex
CREATE INDEX "VisionScanUsage_date_idx" ON "public"."VisionScanUsage"("date");

-- CreateIndex
CREATE UNIQUE INDEX "VisionScanUsage_userId_date_key" ON "public"."VisionScanUsage"("userId", "date");

-- AddForeignKey
ALTER TABLE "public"."VisionScanUsage" ADD CONSTRAINT "VisionScanUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
