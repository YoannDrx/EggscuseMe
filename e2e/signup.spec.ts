import { expect, test } from "@playwright/test";
import { createTestAccount } from "./utils/auth-test";

test("sign up and verify account creation", async ({ page }) => {
  const userData = await createTestAccount({
    page,
    callbackURL: "/fridge",
  });

  // Verify we're on the fridge page (createTestAccount already waits for this)
  const currentUrl = page.url();
  expect(currentUrl).toMatch(/\/fridge.*/);

  // Verify user is logged in by checking the user button in sidebar
  const userButton = page.getByTestId("user-profile-button");
  await expect(userButton).toBeVisible({ timeout: 10000 });

  // Verify user info is displayed (name should be visible in the button)
  await expect(userButton).toContainText(userData.name);
});
