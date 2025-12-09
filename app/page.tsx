import { LandingHeader } from "@/features/landing/landing-header";
import { HeroSection } from "@/features/landing/hero";
import { FeatureCards } from "@/features/landing/features";
import { BentoGrid } from "@/features/landing/how-it-works";
import { GradientCTA } from "@/features/landing/cta/gradient-cta";
import { FAQSection } from "@/features/landing/faq-section";
import { Pricing } from "@/features/plans/pricing-section";
import { Footer } from "@/features/layout/footer";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("landing.faq");
  return (
    <div className="bg-background relative flex min-h-screen flex-col">
      {/* Navigation */}
      <LandingHeader />

      {/* Hero Section with Phone Mockup */}
      <HeroSection />

      {/* Features Grid */}
      <FeatureCards />

      {/* How it Works - Bento Grid */}
      <BentoGrid />

      {/* Pricing Section */}
      <div id="pricing">
        <Pricing />
      </div>

      {/* FAQ Section */}
      <FAQSection
        faq={[
          { question: t("q1.question"), answer: t("q1.answer") },
          { question: t("q2.question"), answer: t("q2.answer") },
          { question: t("q3.question"), answer: t("q3.answer") },
          { question: t("q4.question"), answer: t("q4.answer") },
          { question: t("q5.question"), answer: t("q5.answer") },
          { question: t("q6.question"), answer: t("q6.answer") },
        ]}
      />

      {/* Final CTA */}
      <GradientCTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}
