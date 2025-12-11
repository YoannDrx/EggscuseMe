import {
  getBrigadeRequiredMessage,
  getEggBoxLimitMessage,
  isPaidSubscription,
} from "@/lib/stripe/check-premium";
import { SiteConfig } from "@/site-config";
import type { UserSubscription } from "@/generated/prisma";
import { describe, expect, it } from "vitest";

// Helper to create a mock subscription
function createMockSubscription(
  overrides: Partial<UserSubscription> = {},
): UserSubscription {
  return {
    id: "sub-123",
    userId: "user-123",
    plan: "premium",
    status: "active",
    stripeSubscriptionId: "stripe-sub-123",
    stripeCustomerId: "stripe-cus-123",
    periodStart: new Date(),
    periodEnd: new Date(),
    cancelAtPeriodEnd: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe("plan-limits", () => {
  describe("isPaidSubscription", () => {
    describe("returns false for non-premium users", () => {
      it("should return false for null subscription", () => {
        expect(isPaidSubscription(null)).toBe(false);
      });

      it("should return false for free plan", () => {
        const subscription = createMockSubscription({ plan: "free" });
        expect(isPaidSubscription(subscription)).toBe(false);
      });

      it("should return false for free plan even with active status", () => {
        const subscription = createMockSubscription({
          plan: "free",
          status: "active",
        });
        expect(isPaidSubscription(subscription)).toBe(false);
      });
    });

    describe("returns true for active premium subscriptions", () => {
      it("should return true for active premium subscription", () => {
        const subscription = createMockSubscription({
          plan: "premium",
          status: "active",
        });
        expect(isPaidSubscription(subscription)).toBe(true);
      });

      it("should return true for trialing subscription", () => {
        const subscription = createMockSubscription({
          plan: "premium",
          status: "trialing",
        });
        expect(isPaidSubscription(subscription)).toBe(true);
      });

      it("should return true for past_due subscription (grace period)", () => {
        const subscription = createMockSubscription({
          plan: "premium",
          status: "past_due",
        });
        expect(isPaidSubscription(subscription)).toBe(true);
      });
    });

    describe("returns false for inactive premium subscriptions", () => {
      it("should return false for canceled subscription", () => {
        const subscription = createMockSubscription({
          plan: "premium",
          status: "canceled",
        });
        expect(isPaidSubscription(subscription)).toBe(false);
      });

      it("should return false for unpaid subscription", () => {
        const subscription = createMockSubscription({
          plan: "premium",
          status: "unpaid",
        });
        expect(isPaidSubscription(subscription)).toBe(false);
      });

      it("should return false for null status", () => {
        const subscription = createMockSubscription({
          plan: "premium",
          status: null,
        });
        expect(isPaidSubscription(subscription)).toBe(false);
      });

      it("should return false for incomplete subscription", () => {
        const subscription = createMockSubscription({
          plan: "premium",
          status: "incomplete",
        });
        expect(isPaidSubscription(subscription)).toBe(false);
      });

      it("should return false for incomplete_expired subscription", () => {
        const subscription = createMockSubscription({
          plan: "premium",
          status: "incomplete_expired",
        });
        expect(isPaidSubscription(subscription)).toBe(false);
      });
    });
  });

  describe("getBrigadeRequiredMessage", () => {
    it("should return message with feature name", () => {
      const message = getBrigadeRequiredMessage("historique complet");
      expect(message).toContain("historique complet");
      expect(message).toContain("Brigade");
    });

    it("should return French message", () => {
      const message = getBrigadeRequiredMessage("notifications");
      expect(message).toContain("plan Brigade");
    });
  });

  describe("getEggBoxLimitMessage", () => {
    it("should return message with correct limit", () => {
      const message = getEggBoxLimitMessage();
      expect(message).toContain(String(SiteConfig.plans.solo.maxEggBoxes));
    });

    it("should mention Brigade upgrade", () => {
      const message = getEggBoxLimitMessage();
      expect(message).toContain("Solo");
      expect(message).toContain("Brigade");
    });
  });

  describe("SiteConfig plan limits", () => {
    it("should have maxEggBoxes set to 2", () => {
      expect(SiteConfig.plans.solo.maxEggBoxes).toBe(2);
    });

    it("should have freshness thresholds correctly configured", () => {
      expect(SiteConfig.freshness.extraFreshDays).toBe(9);
      expect(SiteConfig.freshness.freshDays).toBe(21);
      expect(SiteConfig.freshness.cookThoroughlyDays).toBe(28);
    });
  });
});
