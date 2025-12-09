import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import type { PrismaConfig } from "prisma";

// Check if DATABASE_URL was explicitly set by a production script
const isProdScript = process.env.PRISMA_PROD_MODE === "true";

if (!isProdScript) {
  // Development: Load .env.local (dev branch) with priority
  if (fs.existsSync(".env.local")) {
    dotenv.config({ path: ".env.local", override: true });
  } else {
    dotenv.config({ path: ".env" });
  }
}

export default {
  schema: path.join("prisma"),
} satisfies PrismaConfig;
