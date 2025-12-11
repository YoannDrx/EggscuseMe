import { prisma } from "@/lib/prisma";
import { expect, test } from "@playwright/test";
import { createTestAccount } from "./utils/auth-test";

test("sign up and verify account creation", async ({ page }) => {
  // Enable console logging for debugging in CI
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      // eslint-disable-next-line no-console
      console.log(`Browser console error: ${msg.text()}`);
    }
  });

  // Capture page errors (uncaught exceptions)
  page.on("pageerror", (error) => {
    // eslint-disable-next-line no-console
    console.log(`Browser page error: ${error.message}`);
  });

  // Log all network requests to /api/auth for debugging
  page.on("request", (request) => {
    if (request.url().includes("/api/auth")) {
      // eslint-disable-next-line no-console
      console.log(`API Request: ${request.method()} ${request.url()}`);
    }
  });

  page.on("response", (response) => {
    if (response.url().includes("/api/auth")) {
      // eslint-disable-next-line no-console
      console.log(`API Response: ${response.status()} ${response.url()}`);
    }
  });

  page.on("requestfailed", (request) => {
    if (request.url().includes("/api/auth")) {
      // eslint-disable-next-line no-console
      console.log(
        `API Request Failed: ${request.url()} - ${request.failure()?.errorText}`,
      );
    }
  });

  const userData = await createTestAccount({
    page,
    callbackURL: "/fridge",
  });

  // Verify we're on the fridge page (createTestAccount already waits for this)
  const currentUrl = page.url();
  expect(currentUrl).toMatch(/\/fridge.*/);

  // Verify the user was created in the database
  const user = await prisma.user.findUnique({
    where: { email: userData.email },
    include: {
      ownedFridges: {
        where: { isDefault: true },
        take: 1,
      },
    },
  });

  // Verify user exists
  expect(user).not.toBeNull();
  expect(user?.name).toBe(userData.name);
  expect(user?.email).toBe(userData.email);
  expect(user?.emailVerified).toBe(false); // Email should not be verified yet

  // Verify user has a fridge
  expect(user?.ownedFridges.length).toBeGreaterThan(0);

  // Clean up - delete the test user
  // This is optional but helps keep the test database clean
  if (user) {
    // Delete the user (cascade should handle related records)
    await prisma.user.delete({
      where: { id: user.id },
    });
  }
});
