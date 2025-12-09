/**
 * Database Script Utilities
 *
 * Utilities for loading environment variables and running database commands
 * with proper dev/prod separation.
 */

import fs from "fs";
import path from "path";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

/* eslint-disable no-console */
export const logger = {
  info: (msg: string) => console.log(`${colors.blue}i${colors.reset} ${msg}`),
  success: (msg: string) =>
    console.log(`${colors.green}OK${colors.reset} ${msg}`),
  warn: (msg: string) =>
    console.log(`${colors.yellow}WARN${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}ERR${colors.reset} ${msg}`),
  step: (msg: string) => console.log(`${colors.cyan}->${colors.reset} ${msg}`),
};
/* eslint-enable no-console */

export type Environment = "development" | "production";

/**
 * Parse an env file and return its variables
 */
function parseEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {};

  const content = fs.readFileSync(filePath, "utf-8");
  const vars: Record<string, string> = {};

  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    // Remove quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    vars[key] = value;
  }

  return vars;
}

/**
 * Load environment variables based on the target environment.
 *
 * - development: Uses .env.local first, then .env (like Next.js)
 * - production: Uses ONLY .env (ignores .env.local for safety)
 */
export function loadEnv(env: Environment): void {
  const cwd = process.cwd();

  if (env === "production") {
    // Production: ONLY load .env
    const envPath = path.join(cwd, ".env");
    const vars = parseEnvFile(envPath);

    for (const [key, value] of Object.entries(vars)) {
      process.env[key] ??= value;
    }

    logger.info(`Loaded production environment from .env`);
  } else {
    // Development: .env.local first, then .env
    const envLocalPath = path.join(cwd, ".env.local");
    const envPath = path.join(cwd, ".env");

    const envLocalVars = parseEnvFile(envLocalPath);
    const envVars = parseEnvFile(envPath);

    // .env.local takes priority
    const merged = { ...envVars, ...envLocalVars };

    for (const [key, value] of Object.entries(merged)) {
      process.env[key] ??= value;
    }

    logger.info(`Loaded development environment from .env.local + .env`);
  }
}

/**
 * Validate that required environment variables are set
 */
export function validateEnv(requiredVars: string[]): boolean {
  const missing = requiredVars.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    logger.error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
    return false;
  }

  return true;
}

/**
 * Check if the current DATABASE_URL points to Neon (production)
 */
export function isNeonUrl(): boolean {
  const url = process.env.DATABASE_URL ?? "";
  return url.includes("neon.tech");
}

/**
 * Mask sensitive parts of a database URL for logging
 */
export function maskDbUrl(url: string): string {
  if (!url) return "[not set]";
  return url.replace(/\/\/[^:]+:[^@]+@/, "//***:***@");
}
