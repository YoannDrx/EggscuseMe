import {
  getLayingDateFromDcrDate,
  parseDateInputValue,
} from "@/features/eggs/lib/freshness-calculator";
import { prisma } from "@/lib/prisma";
import { expect, test } from "@playwright/test";
import { createTestAccount } from "./utils/auth-test";

test.describe("fridge", () => {
  test("creates a new egg box from the DCR date", async ({ page }) => {
    const userData = await createTestAccount({
      page,
      callbackURL: "/fridge",
    });
    const boxName = `DCR E2E ${Date.now()}`;
    const dcrDateValue = "2026-06-12";
    const dcrDate = parseDateInputValue(dcrDateValue);

    await page.waitForURL(/\/fridge.*/, { timeout: 15000 });
    await page
      .getByRole("button", {
        name: /ajouter ma première boîte|add my first box|ajouter|add/i,
      })
      .first()
      .click();

    const dialog = page.getByRole("alertdialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText(/date de ponte|laying date/i)).toHaveCount(0);

    await dialog.locator("#name").fill(boxName);
    await dialog.locator("#dcrDate").fill(dcrDateValue);
    await dialog.locator("#quantity").fill("12");
    await dialog.getByRole("button", { name: /ajouter|add/i }).click();

    await expect(page.getByText(boxName)).toBeVisible({ timeout: 15000 });

    const findStoredBox = async () => {
      const user = await prisma.user.findUnique({
        where: { email: userData.email },
        select: { id: true },
      });
      if (!user) return null;

      return prisma.eggBox.findFirst({
        where: { userId: user.id, name: boxName },
        select: {
          dcrDate: true,
          layingDate: true,
          quantity: true,
          remaining: true,
        },
      });
    };

    await expect
      .poll(
        async () =>
          (await findStoredBox())?.dcrDate.toISOString().slice(0, 10) ?? null,
        { timeout: 15000 },
      )
      .toBe(dcrDateValue);

    const storedBox = await findStoredBox();
    expect(storedBox?.quantity).toBe(12);
    expect(storedBox?.remaining).toBe(12);
    expect(storedBox?.dcrDate.toISOString().slice(0, 10)).toBe(dcrDateValue);
    expect(storedBox?.layingDate.toISOString().slice(0, 10)).toBe(
      getLayingDateFromDcrDate(dcrDate).toISOString().slice(0, 10),
    );
  });
});
