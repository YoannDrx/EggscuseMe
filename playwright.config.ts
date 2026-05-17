import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

const EXTERNAL_SERVER_URL = process.env.PLAYWRIGHT_TEST_BASE_URL;
const LOCAL_SERVER_PORT = process.env.PLAYWRIGHT_TEST_PORT ?? "3100";
const SERVER_URL =
  EXTERNAL_SERVER_URL ?? `http://localhost:${LOCAL_SERVER_PORT}`;

const HEADLESS = process.env.HEADLESS
  ? process.env.HEADLESS.toLowerCase() === "true"
  : true;

const config: PlaywrightTestConfig = {
  // 50 seconds
  timeout: 70 * 1000,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Add retry options
  retries: 1,
  // Add delay between retries
  workers: 3,
  globalSetup: require.resolve("./e2e/global-setup.ts"),
  globalTeardown: require.resolve("./e2e/global-teardown.ts"),
  // Enable console logs in CI
  reporter: process.env.CI ? [["list"], ["html"]] : "list",
  use: {
    launchOptions: {
      slowMo: 200,
    },
    headless: HEADLESS,
    contextOptions: {
      extraHTTPHeaders: {
        "x-vercel-protection-bypass":
          process.env.VERCEL_AUTOMATION_BYPASS_SECRET ?? "",
      },
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    },
    ignoreHTTPSErrors: true,
    video: "on-first-retry",
    baseURL: SERVER_URL,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 720 },
    geolocation: { longitude: 2.3488, latitude: 48.8534 },
    permissions: ["geolocation"],
    actionTimeout: 15000,
    navigationTimeout: 15000,
  },
  testDir: "e2e",
  // Only start the web server if PLAYWRIGHT_TEST_BASE_URL is not set.
  ...(EXTERNAL_SERVER_URL
    ? {}
    : {
        webServer: {
          command: `PLAYWRIGHT_TEST_BASE_URL=${SERVER_URL} pnpm run build && PLAYWRIGHT_TEST_BASE_URL=${SERVER_URL} PORT=${LOCAL_SERVER_PORT} pnpm run start`,
          url: SERVER_URL,
          timeout: 120 * 1000,
          reuseExistingServer: process.env.PLAYWRIGHT_REUSE_SERVER === "true",
        },
      }),
};

export default config;
