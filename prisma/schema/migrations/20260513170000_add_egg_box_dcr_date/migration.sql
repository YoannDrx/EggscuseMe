-- Add Date de Consommation Recommandee (DCR) as the source date for egg freshness.
-- Existing boxes are backfilled from the previous layingDate model using the legal
-- maximum DCR window of 28 days after laying.

ALTER TABLE "public"."egg_box"
ADD COLUMN "dcrDate" TIMESTAMP(3);

UPDATE "public"."egg_box"
SET "dcrDate" = "layingDate" + INTERVAL '28 days'
WHERE "dcrDate" IS NULL;

ALTER TABLE "public"."egg_box"
ALTER COLUMN "dcrDate" SET NOT NULL;

CREATE INDEX "egg_box_dcrDate_idx" ON "public"."egg_box"("dcrDate");
