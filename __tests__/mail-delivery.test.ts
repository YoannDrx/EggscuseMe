import { describe, expect, it, vi } from "vitest";

vi.unmock("@/lib/mail/resend");

import { sendEmail, sendEmailOrThrow } from "@/lib/mail/send-email";

const email = {
  to: "recipient@example.com",
  subject: "Delivery test",
  html: "<p>Test</p>",
};

describe("email delivery without Resend configuration", () => {
  it("returns an explicit delivery error instead of simulated data", async () => {
    await expect(sendEmail(email)).resolves.toMatchObject({
      data: null,
      error: expect.objectContaining({
        message: expect.stringContaining("Resend is not configured"),
      }),
    });
  });

  it("throws when the caller requires confirmed delivery", async () => {
    await expect(sendEmailOrThrow(email)).rejects.toThrow(
      "Resend is not configured",
    );
  });
});
