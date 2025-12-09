/**
 * Production Migration Script
 *
 * Applies pending migrations to the production database (Neon).
 * This script explicitly loads .env (not .env.local) for safety.
 *
 * Usage: pnpm db:migrate:prod
 * Usage with auto-confirm: pnpm db:migrate:prod --yes
 */

import { execSync } from "child_process";
import readline from "readline";
import { loadEnv, validateEnv, isNeonUrl, maskDbUrl, logger } from "./utils";

// Force production environment
loadEnv("production");

// Signal to prisma.config.ts that we're in prod mode
process.env.PRISMA_PROD_MODE = "true";

// Validate
if (!validateEnv(["DATABASE_URL"])) {
  process.exit(1);
}

// Safety check: ensure we're targeting Neon
if (!isNeonUrl()) {
  logger.error("DATABASE_URL does not point to Neon (production)");
  logger.error(
    "This script is for production only. Use 'pnpm prisma:migrate' for development.",
  );
  process.exit(1);
}

async function confirmAction(): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      "\nYou are about to apply migrations to PRODUCTION.\n" +
        "   This action cannot be undone.\n" +
        "   Type 'yes' to confirm: ",
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === "yes");
      },
    );
  });
}

async function main() {
  const dbUrl = process.env.DATABASE_URL ?? "";
  logger.info(`Target: ${maskDbUrl(dbUrl)}`);

  // Skip confirmation if --yes flag is passed
  if (!process.argv.includes("--yes")) {
    const confirmed = await confirmAction();
    if (!confirmed) {
      logger.warn("Operation cancelled.");
      process.exit(0);
    }
  }

  logger.step("Applying migrations to production...");

  try {
    execSync("pnpm exec prisma migrate deploy", {
      stdio: "inherit",
      env: process.env,
    });
    logger.success("Production migrations applied successfully!");
  } catch {
    logger.error("Migration failed");
    process.exit(1);
  }
}

main().catch((err) => {
  logger.error(String(err));
  process.exit(1);
});
