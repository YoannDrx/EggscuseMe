ALTER TABLE "user_subscription"
ADD COLUMN "subscriptionPlan" TEXT,
ADD COLUMN "subscriptionStatus" TEXT,
ADD COLUMN "oneTimePlan" TEXT,
ADD COLUMN "oneTimeGrantedAt" TIMESTAMP(3);

UPDATE "user_subscription"
SET
  "subscriptionPlan" = "plan",
  "subscriptionStatus" = "status"
WHERE "stripeSubscriptionId" IS NOT NULL
  AND "plan" <> 'free';

CREATE TABLE "billing_purchase" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "plan" TEXT NOT NULL,
  "checkoutSessionId" TEXT NOT NULL,
  "paymentIntentId" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "currency" TEXT NOT NULL,
  "paidAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "billing_purchase_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "billing_purchase_checkoutSessionId_key"
ON "billing_purchase"("checkoutSessionId");

CREATE UNIQUE INDEX "billing_purchase_paymentIntentId_key"
ON "billing_purchase"("paymentIntentId");

CREATE INDEX "billing_purchase_userId_paidAt_idx"
ON "billing_purchase"("userId", "paidAt");

ALTER TABLE "billing_purchase"
ADD CONSTRAINT "billing_purchase_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "user"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
