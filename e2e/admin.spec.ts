import { expect, test } from "@playwright/test";
import {
  createTestAccount,
  signInAccount,
  signOutAccount,
} from "./utils/auth-test";

test.describe("admin", () => {
  test("verify admin dashboard work", async ({ page }) => {
    const user = await createTestAccount({
      page,
      callbackURL: "/fridge",
      admin: true,
    });
    await signOutAccount({ page });
    await signInAccount({
      page,
      userData: {
        email: user.email,
        password: user.password,
      },
      callbackURL: "/admin",
    });

    await page.goto("/admin");

    const usersLink = page.getByRole("link", { name: /users|utilisateurs/i });
    const toolsLink = page.getByRole("link", {
      name: /tools|outils/i,
    });

    await expect(usersLink).toBeVisible();
    await expect(toolsLink).toBeVisible();

    await usersLink.click();
    await expect(page).toHaveURL("/admin/users");

    await toolsLink.click();
    await expect(page).toHaveURL("/admin/tools");
  });
});
