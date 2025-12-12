import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";
import { expect, test } from "@playwright/test";
import {
  createTestAccount,
  signInAccount,
  signOutAccount,
} from "./utils/auth-test";

test.describe("account", () => {
  test("delete account request flow", async ({ page }) => {
    const userData = await createTestAccount({
      page,
      callbackURL: "/fridge/settings/profile",
    });

    await page.goto("/fridge/settings/danger");
    await page.waitForURL(/\/fridge\/settings\/danger/, { timeout: 15000 });

    // Button text is "Supprimer mon compte" in French UI
    const deleteAccountButton = page.getByRole("button", {
      name: /supprimer mon compte|delete my account/i,
    });
    await expect(deleteAccountButton).toBeVisible();
    await deleteAccountButton.click();

    // Dialog opens with dialogManager.confirm
    const deleteDialog = page.getByRole("alertdialog");
    await expect(deleteDialog).toBeVisible();

    // Confirm text is required ("Supprimer" FR / "Delete" EN)
    const confirmInput = deleteDialog.getByRole("textbox");
    // The action button has the full label "Supprimer mon compte" / "Delete my account"
    const deleteButton = deleteDialog.getByRole("button", {
      name: /supprimer mon compte|delete my account/i,
    });

    // Try French first, then English
    await confirmInput.fill("Supprimer");
    if (!(await deleteButton.isEnabled().catch(() => false))) {
      await confirmInput.fill("Delete");
    }

    await expect(deleteButton).toBeEnabled();
    await deleteButton.click();

    // Toast message in French: "Demande de suppression envoyée" / English: "Deletion request sent"
    await expect(
      page.getByText(/demande de suppression|deletion request sent/i),
    ).toBeVisible();

    // In dev mode, user might be deleted immediately or need email confirmation
    // Wait a moment for potential async deletion
    await page.waitForTimeout(1000);

    // Clean up - delete user if still exists
    const user = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (user) {
      await prisma.user.delete({ where: { id: user.id } });
    }
  });

  test("update name flow", async ({ page }) => {
    await createTestAccount({ page, callbackURL: "/fridge/settings/profile" });

    const newName = faker.person.fullName();
    // Label is "Nom" in French UI
    const input = page.getByRole("textbox", { name: /nom|name/i });
    await input.fill(newName);
    // Button is "Enregistrer" in French UI
    await page.getByRole("button", { name: /enregistrer|save/i }).click();

    // Toast message is "Profil mis à jour" in French
    await expect(
      page.getByText(/profil mis à jour|profile updated/i),
    ).toBeVisible();
    await page.reload();
    await expect(input).toHaveValue(newName);
  });

  test("change password flow", async ({ page }) => {
    const userData = await createTestAccount({
      page,
      callbackURL: "/fridge/settings/security",
    });

    await page.waitForURL(/\/fridge\/settings\/security/, { timeout: 10000 });

    const newPassword = faker.internet.password({
      length: 12,
      memorable: true,
    });
    await page.locator('input[name="currentPassword"]').fill(userData.password);
    await page.locator('input[name="newPassword"]').fill(newPassword);
    await page.locator('input[name="confirmPassword"]').fill(newPassword);
    // Button is "Changer le mot de passe" in French UI
    await page
      .getByRole("button", { name: /changer le mot de passe|change password/i })
      .click();

    await signOutAccount({ page });

    await signInAccount({
      page,
      userData: {
        email: userData.email,
        password: newPassword,
      },
      callbackURL: "/fridge",
    });

    await page.waitForURL(/\/fridge.*/, { timeout: 10000 });

    const user = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (user) {
      await prisma.user.delete({
        where: { id: user.id },
      });
    }
  });
});
