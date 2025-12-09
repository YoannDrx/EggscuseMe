-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "fridge_email_invitation" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "fridgeId" TEXT NOT NULL,
    "invitedById" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "acceptedById" TEXT,
    "acceptedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "lastSentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fridge_email_invitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fridge_email_invitation_token_key" ON "fridge_email_invitation"("token");

-- CreateIndex
CREATE INDEX "fridge_email_invitation_email_idx" ON "fridge_email_invitation"("email");

-- CreateIndex
CREATE INDEX "fridge_email_invitation_token_idx" ON "fridge_email_invitation"("token");

-- CreateIndex
CREATE INDEX "fridge_email_invitation_fridgeId_idx" ON "fridge_email_invitation"("fridgeId");

-- CreateIndex
CREATE UNIQUE INDEX "fridge_email_invitation_fridgeId_email_key" ON "fridge_email_invitation"("fridgeId", "email");

-- AddForeignKey
ALTER TABLE "fridge_email_invitation" ADD CONSTRAINT "fridge_email_invitation_fridgeId_fkey" FOREIGN KEY ("fridgeId") REFERENCES "fridge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fridge_email_invitation" ADD CONSTRAINT "fridge_email_invitation_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fridge_email_invitation" ADD CONSTRAINT "fridge_email_invitation_acceptedById_fkey" FOREIGN KEY ("acceptedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
