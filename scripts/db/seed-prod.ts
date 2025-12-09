/**
 * Production Seed Script
 *
 * Seeds the production database (Neon) in additive mode.
 * This script explicitly loads .env (not .env.local) for safety.
 *
 * Usage: pnpm db:seed:prod
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
    "This script is for production only. Use 'pnpm prisma:seed' for development.",
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
      "\nYou are about to seed the PRODUCTION database.\n" +
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

  logger.step("Running seed on production...");

  try {
    execSync("pnpm tsx prisma/seed.ts", {
      stdio: "inherit",
      env: process.env,
    });
    logger.success("Production seed completed!");
  } catch {
    logger.error("Production seed failed");
    process.exit(1);
  }
}

main().catch((err) => {
  logger.error(String(err));
  process.exit(1);
});
