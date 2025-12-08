import {
  isPremiumSubscription,
  getPremiumRequiredMessage,
  getEggBoxLimitMessage,
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
  describe("isPremiumSubscription", () => {
    describe("returns false for non-premium users", () => {
      it("should return false for null subscription", () => {
        expect(isPremiumSubscription(null)).toBe(false);
      });

      it("should return false for free plan", () => {
        const subscription = createMockSubscription({ plan: "free" });
        expect(isPremiumSubscription(subscription)).toBe(false);
      });

      it("should return false for free plan even with active status", () => {
        const subscription = createMockSubscription({
          plan: "free",
          status: "active",
        });
        expect(isPremiumSubscription(subscription)).toBe(false);
      });
    });

    describe("returns true for active premium subscriptions", () => {
      it("should return true for active premium subscription", () => {
        const subscription = createMockSubscription({
          plan: "premium",
          status: "active",
        });
        expect(isPremiumSubscription(subscription)).toBe(true);
      });

      it("should return true for trialing subscription", () => {
        const subscription = createMockSubscription({
          plan: "premium",
          status: "trialing",
        });
        expect(isPremiumSubscription(subscription)).toBe(true);
      });

      it("should return true for past_due subscription (grace period)", () => {
        const subscription = createMockSubscription({
          plan: "premium",
          status: "past_due",
        });
        expect(isPremiumSubscription(subscription)).toBe(true);
      });
    });

    describe("returns false for inactive premium subscriptions", () => {
      it("should return false for canceled subscription", () => {
        const subscription = createMockSubscription({
          plan: "premium",
          status: "canceled",
        });
        expect(isPremiumSubscription(subscription)).toBe(false);
      });

      it("should return false for unpaid subscription", () => {
        const subscription = createMockSubscription({
          plan: "premium",
          status: "unpaid",
        });
        expect(isPremiumSubscription(subscription)).toBe(false);
      });

      it("should return false for null status", () => {
        const subscription = createMockSubscription({
          plan: "premium",
          status: null,
        });
        expect(isPremiumSubscription(subscription)).toBe(false);
      });

      it("should return false for incomplete subscription", () => {
        const subscription = createMockSubscription({
          plan: "premium",
          status: "incomplete",
        });
        expect(isPremiumSubscription(subscription)).toBe(false);
      });

      it("should return false for incomplete_expired subscription", () => {
        const subscription = createMockSubscription({
          plan: "premium",
          status: "incomplete_expired",
        });
        expect(isPremiumSubscription(subscription)).toBe(false);
      });
    });
  });

  describe("getPremiumRequiredMessage", () => {
    it("should return message with feature name", () => {
      const message = getPremiumRequiredMessage("historique complet");
      expect(message).toContain("historique complet");
      expect(message).toContain("Premium");
    });

    it("should return French message", () => {
      const message = getPremiumRequiredMessage("notifications");
      expect(message).toContain("nécessite un abonnement Premium");
    });
  });

  describe("getEggBoxLimitMessage", () => {
    it("should return message with correct limit", () => {
      const message = getEggBoxLimitMessage();
      expect(message).toContain(String(SiteConfig.freePlan.maxEggBoxes));
    });

    it("should mention Premium upgrade", () => {
      const message = getEggBoxLimitMessage();
      expect(message).toContain("Premium");
      expect(message).toContain("illimitées");
    });
  });

  describe("SiteConfig.freePlan limits", () => {
    it("should have maxEggBoxes set to 2", () => {
      expect(SiteConfig.freePlan.maxEggBoxes).toBe(2);
    });

    it("should have freshness thresholds correctly configured", () => {
      expect(SiteConfig.freshness.extraFreshDays).toBe(9);
      expect(SiteConfig.freshness.freshDays).toBe(21);
      expect(SiteConfig.freshness.cookThoroughlyDays).toBe(28);
    });
  });
});
