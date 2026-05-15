-- Add non-destructive indexes for history and statistics queries.
CREATE INDEX IF NOT EXISTS "egg_consumption_eggBoxId_createdAt_idx" ON "egg_consumption"("eggBoxId", "createdAt");
CREATE INDEX IF NOT EXISTS "egg_consumption_createdAt_idx" ON "egg_consumption"("createdAt");
