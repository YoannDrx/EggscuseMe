import {
  EggventureHero,
  EggventureNavbar,
  EggventureFooter,
  StoryScene,
  ScrollProgress,
  EggyCompanion,
} from "@/features/landing-variants/eggventure";
import { Refrigerator, Clock, Trophy } from "lucide-react";
import Link from "next/link";

const sections = [
  { id: "prologue", label: "Prologue" },
  { id: "frigo", label: "Le Frigo" },
  { id: "temps", label: "Le Temps" },
  { id: "cuisine", label: "La Cuisine" },
  { id: "victoire", label: "Victoire" },
];

export default function Landing1Page() {
  return (
    <div className="relative">
      {/* Navigation */}
      <EggventureNavbar />

      {/* Scroll Progress Dots */}
      <ScrollProgress sections={sections} />

      {/* Eggy Companion */}
      <EggyCompanion />

      {/* Hero - Prologue */}
      <EggventureHero />

      {/* Chapter 1: Le Frigo */}
      <StoryScene
        id="frigo"
        chapter="Chapitre 1"
        title="Le Frigo Magique"
        description="Chaque oeuf a une histoire. Dans votre frigo virtuel, suivez leur parcours et sachez toujours lesquels utiliser en premier."
        variant="morning"
      >
        <div className="grid gap-6 sm:grid-cols-3">
          <FeatureCard
            icon={<Refrigerator className="size-8" />}
            title="Organisation"
            description="Rangez vos boites par date de ponte"
            variant="light"
          />
          <FeatureCard
            icon={<div className="text-2xl">🥚</div>}
            title="Fraicheur"
            description="Codes couleur pour la fraicheur"
            variant="light"
          />
          <FeatureCard
            icon={<div className="text-2xl">👨‍👩‍👧‍👦</div>}
            title="Partage"
            description="Gerez en famille"
            variant="light"
          />
        </div>
      </StoryScene>

      {/* Chapter 2: Le Temps */}
      <StoryScene
        id="temps"
        chapter="Chapitre 2"
        title="Le Temps Qui Passe"
        description="Les oeufs evoluent jour apres jour. Apprenez a lire leur age et decouvrez le moment parfait pour chaque recette."
        variant="noon"
      >
        <div className="mx-auto max-w-2xl">
          <FreshnessTimeline />
        </div>
      </StoryScene>

      {/* Chapter 3: La Cuisine */}
      <StoryScene
        id="cuisine"
        chapter="Chapitre 3"
        title="L'Art de Cuisiner"
        description="Extra-frais ou bien mur ? Chaque oeuf a sa recette ideale. Decouvrez les secrets de la cuisine parfaite."
        variant="sunset"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <RecipeCard
            title="Oeuf a la coque"
            freshness="Extra-frais"
            time="0-9 jours"
          />
          <RecipeCard title="Omelette" freshness="Frais" time="10-21 jours" />
          <RecipeCard title="Oeuf dur" freshness="A cuire" time="22-28 jours" />
          <RecipeCard
            title="Patisserie"
            freshness="Tous"
            time="Selon recette"
          />
        </div>
      </StoryScene>

      {/* Chapter 4: Victoire */}
      <StoryScene
        id="victoire"
        chapter="Chapitre Final"
        title="La Victoire Anti-Gaspi"
        description="Zero oeuf gaspille, zero culpabilite. Rejoignez des milliers de foyers qui ont change leur facon de consommer."
        variant="night"
      >
        <div className="flex flex-wrap items-center justify-center gap-8">
          <StatBadge value="2.4M" label="Oeufs sauves" />
          <StatBadge value="10K+" label="Familles" />
          <StatBadge value="4.9" label="Etoiles" />
        </div>
        <div className="mt-10">
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--egv-noon)] px-8 py-4 text-lg font-bold text-[var(--egv-night)] shadow-[4px_4px_0_var(--egv-star)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--egv-star)]"
          >
            <Trophy className="size-5" />
            Rejoindre l&apos;aventure
          </Link>
        </div>
      </StoryScene>

      {/* Footer */}
      <EggventureFooter />
    </div>
  );
}

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant: "light" | "dark";
};

function FeatureCard({ icon, title, description, variant }: FeatureCardProps) {
  const styles = {
    light: "bg-white/20 border-white/30 text-white",
    dark: "bg-[var(--egv-night)]/10 border-[var(--egv-night)]/20 text-[var(--egv-night)]",
  };

  return (
    <div
      className={`rounded-2xl border-2 p-6 text-center backdrop-blur-sm ${styles[variant]}`}
    >
      <div className="mb-3 flex justify-center">{icon}</div>
      <h3 className="font-heading text-lg font-bold">{title}</h3>
      <p className="mt-1 text-sm opacity-80">{description}</p>
    </div>
  );
}

function FreshnessTimeline() {
  const stages = [
    { days: "0-9", label: "Extra-frais", color: "bg-[var(--egv-morning)]" },
    { days: "10-21", label: "Frais", color: "bg-[var(--egv-noon)]" },
    { days: "22-28", label: "A cuire", color: "bg-[var(--egv-sunset)]" },
  ];

  return (
    <div className="flex items-center justify-between gap-2">
      {stages.map((stage, i) => (
        <div key={stage.days} className="flex flex-1 flex-col items-center">
          <div
            className={`h-3 w-full ${stage.color} ${i === 0 ? "rounded-l-full" : ""} ${i === stages.length - 1 ? "rounded-r-full" : ""}`}
          />
          <span className="mt-3 text-sm font-bold text-[var(--egv-night)]">
            {stage.days} jours
          </span>
          <span className="text-xs text-[var(--egv-night)]/70">
            {stage.label}
          </span>
        </div>
      ))}
    </div>
  );
}

type RecipeCardProps = {
  title: string;
  freshness: string;
  time: string;
};

function RecipeCard({ title, freshness, time }: RecipeCardProps) {
  return (
    <div className="rounded-2xl border-2 border-white/30 bg-white/10 p-6 text-left backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-heading text-lg font-bold text-white">{title}</h3>
          <p className="mt-1 text-sm text-white/70">{freshness}</p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-xs text-white">
          <Clock className="size-3" />
          {time}
        </div>
      </div>
    </div>
  );
}

type StatBadgeProps = {
  value: string;
  label: string;
};

function StatBadge({ value, label }: StatBadgeProps) {
  return (
    <div className="text-center">
      <div className="font-heading text-4xl font-bold text-[var(--egv-star)]">
        {value}
      </div>
      <div className="mt-1 text-sm text-[var(--egv-dawn)]/70">{label}</div>
    </div>
  );
}
