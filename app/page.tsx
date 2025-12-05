import { LandingHeader } from "@/features/landing/landing-header";
import { HeroSection } from "@/features/landing/hero";
import { FeatureCards } from "@/features/landing/features";
import { BentoGrid } from "@/features/landing/how-it-works";
import { GradientCTA } from "@/features/landing/cta/gradient-cta";
import { FAQSection } from "@/features/landing/faq-section";
import { Pricing } from "@/features/plans/pricing-section";
import { Footer } from "@/features/layout/footer";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-stone-950">
      {/* Navigation */}
      <LandingHeader />

      {/* Hero Section with Phone Mockup */}
      <HeroSection />

      {/* Features Grid */}
      <FeatureCards />

      {/* How it Works - Bento Grid */}
      <BentoGrid />

      {/* Pricing Section */}
      <div id="pricing" className="bg-stone-950">
        <Pricing />
      </div>

      {/* FAQ Section */}
      <div className="bg-stone-950">
        <FAQSection
          faq={[
            {
              question: "Comment savoir si un oeuf est encore bon ?",
              answer:
                "Un oeuf peut etre consomme en toute securite jusqu'a 28 jours apres la ponte. EggscuseMe fait le suivi pour vous et vous dit exactement quelle methode de cuisson est la meilleure a chaque etape de fraicheur.",
            },
            {
              question:
                "Quelle est la difference entre 'a consommer jusqu'au' et 'a consommer de preference avant' ?",
              answer:
                "La DCR (Date de Consommation Recommandee) est generalement 28 jours apres la ponte. La date sur les boites est souvent plus courte par precaution des distributeurs. EggscuseMe utilise la date de ponte reelle pour un suivi precis.",
            },
            {
              question: "Puis-je manger des oeufs crus ?",
              answer:
                "Oui, mais uniquement dans les 9 premiers jours apres la ponte (extra-frais). Apres, preferez des cuissons qui chauffent bien le jaune, comme au plat ou dur.",
            },
            {
              question: "Comment fonctionne le code couleur de fraicheur ?",
              answer:
                "Vert (0-9 jours) : Extra-frais, parfait pour coque ou cru. Jaune (10-21 jours) : Frais, ideal pour omelette ou au plat. Orange (22-28 jours) : A bien cuire, meilleur dur. Gris (29+ jours) : Expire, a jeter.",
            },
            {
              question: "Puis-je partager mon frigo avec ma famille ?",
              answer:
                "Oui ! EggscuseMe supporte les organisations. Partagez votre frigo virtuel avec famille ou colocs. Tout le monde peut ajouter, consommer et suivre les oeufs ensemble.",
            },
            {
              question: "Y a-t-il un plan gratuit ?",
              answer:
                "Oui ! Le plan gratuit permet de suivre jusqu'a 2 boites d'oeufs avec les fonctionnalites de base. Premium debloque les boites illimitees, statistiques detaillees et notifications.",
            },
          ]}
        />
      </div>

      {/* Final CTA */}
      <GradientCTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}
