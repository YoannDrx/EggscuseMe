import {
  EditorialHero,
  EditorialNavbar,
  EditorialFooter,
  ArticleSection,
  PullQuote,
} from "@/features/landing-variants/egglab";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Landing3Page() {
  return (
    <div className="relative bg-[var(--lab-paper)]">
      {/* Navigation */}
      <EditorialNavbar />

      {/* Hero */}
      <EditorialHero />

      {/* Science Section */}
      <ArticleSection
        id="science"
        title="La Science de la Fraicheur"
        subtitle="Chapitre Premier"
      >
        <div className="prose prose-lg max-w-none">
          <p className="font-serif text-lg leading-relaxed text-[var(--lab-ink)]/80">
            L&apos;oeuf est un miracle de la nature. Des sa ponte, il commence
            un voyage invisible a l&apos;oeil nu mais crucial pour votre
            cuisine. Comprendre ce processus, c&apos;est maitriser l&apos;art
            culinaire.
          </p>

          {/* Timeline infographic */}
          <div className="my-12 grid gap-8 sm:grid-cols-3">
            <TimelineCard
              days="0-9"
              title="Extra-Frais"
              description="Ideal pour les preparations crues : mayonnaise, mousse au chocolat, oeuf a la coque"
              color="sage"
            />
            <TimelineCard
              days="10-21"
              title="Frais"
              description="Parfait pour les cuissons douces : omelette, oeuf au plat, oeufs brouilles"
              color="gold"
            />
            <TimelineCard
              days="22-28"
              title="A Cuire"
              description="Reservation pour les cuissons completes : oeuf dur, quiche, patisserie"
              color="ink"
            />
          </div>

          <PullQuote
            quote="Un oeuf bien gere est un oeuf savoure, jamais gaspille."
            author="La Redaction"
            className="my-12"
          />
        </div>
      </ArticleSection>

      {/* Guide Section */}
      <section id="guide" className="bg-[var(--lab-cream)] py-24">
        <ArticleSection
          title="Le Guide du Chef"
          subtitle="Chapitre Deuxieme"
          variant="feature"
        >
          <div className="grid gap-8 md:grid-cols-2">
            <GuideCard
              number="01"
              title="Organisez Votre Frigo"
              description="Creez des boites virtuelles pour chaque achat. Indiquez la date de ponte et laissez l'application suivre la fraicheur."
            />
            <GuideCard
              number="02"
              title="Suivez les Couleurs"
              description="Vert pour extra-frais, jaune pour frais, orange pour a cuire. Un systeme visuel intuitif."
            />
            <GuideCard
              number="03"
              title="Cuisinez Intelligemment"
              description="Recevez des suggestions de recettes adaptees a la fraicheur de vos oeufs disponibles."
            />
            <GuideCard
              number="04"
              title="Partagez en Famille"
              description="Gerez un frigo commun avec votre foyer. Tout le monde sait quels oeufs utiliser."
            />
          </div>
        </ArticleSection>
      </section>

      {/* Stats Section */}
      <ArticleSection title="En Chiffres" subtitle="Notre Impact">
        <div className="grid gap-12 text-center sm:grid-cols-3">
          <StatItem value="2.4M" label="Oeufs sauves du gaspillage" />
          <StatItem value="10K+" label="Foyers utilisateurs" />
          <StatItem value="4.9/5" label="Note moyenne" />
        </div>
      </ArticleSection>

      {/* Subscribe Section */}
      <section id="subscribe" className="bg-[var(--lab-ink)] py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <span className="mb-4 inline-block text-sm font-medium tracking-widest text-[var(--lab-gold)] uppercase">
            Rejoignez-nous
          </span>

          <h2 className="font-serif text-4xl font-bold text-[var(--lab-paper)] sm:text-5xl">
            Pret a transformer votre cuisine?
          </h2>

          <p className="mt-6 font-serif text-lg text-[var(--lab-paper)]/70">
            Rejoignez des milliers de foyers qui ont adopte une cuisine
            responsable et delicieuse.
          </p>

          <div className="mt-10">
            <Link
              href="/auth/signin"
              className={cn(
                "inline-flex items-center gap-3 bg-[var(--lab-paper)] px-10 py-5",
                "text-sm font-medium tracking-widest text-[var(--lab-ink)] uppercase",
                "transition-all hover:bg-[var(--lab-cream)]",
              )}
            >
              Commencer gratuitement
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <EditorialFooter />
    </div>
  );
}

type TimelineCardProps = {
  days: string;
  title: string;
  description: string;
  color: "sage" | "gold" | "ink";
};

function TimelineCard({ days, title, description, color }: TimelineCardProps) {
  const colors = {
    sage: "border-[var(--lab-sage)] bg-[var(--lab-sage)]/5",
    gold: "border-[var(--lab-gold)] bg-[var(--lab-gold)]/5",
    ink: "border-[var(--lab-ink)] bg-[var(--lab-ink)]/5",
  };

  return (
    <div className={cn("border-l-4 p-6", colors[color])}>
      <span className="font-serif text-3xl font-bold text-[var(--lab-ink)]">
        {days}
      </span>
      <span className="ml-2 text-sm text-[var(--lab-ink)]/60">jours</span>
      <h3 className="mt-2 font-serif text-xl font-bold text-[var(--lab-ink)]">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--lab-ink)]/70">
        {description}
      </p>
    </div>
  );
}

type GuideCardProps = {
  number: string;
  title: string;
  description: string;
};

function GuideCard({ number, title, description }: GuideCardProps) {
  return (
    <div className="group">
      <span className="font-serif text-5xl font-bold text-[var(--lab-gold)]/30 transition-colors group-hover:text-[var(--lab-gold)]/50">
        {number}
      </span>
      <h3 className="mt-2 font-serif text-xl font-bold text-[var(--lab-ink)]">
        {title}
      </h3>
      <p className="mt-2 text-[var(--lab-ink)]/70">{description}</p>
    </div>
  );
}

type StatItemProps = {
  value: string;
  label: string;
};

function StatItem({ value, label }: StatItemProps) {
  return (
    <div>
      <div className="font-serif text-5xl font-bold text-[var(--lab-ink)]">
        {value}
      </div>
      <div className="mt-2 text-sm tracking-widest text-[var(--lab-ink)]/60 uppercase">
        {label}
      </div>
    </div>
  );
}
