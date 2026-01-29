import {
  DinerHero,
  DinerNavbar,
  DinerFooter,
  MenuBoard,
  NeonSign,
  CheckeredPattern,
} from "@/features/landing-variants/diner";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Landing2Page() {
  return (
    <div className="relative bg-[#1a1a2e]">
      {/* Navigation */}
      <DinerNavbar />

      {/* Hero */}
      <DinerHero />

      {/* Menu Section */}
      <section id="menu" className="relative py-24">
        <CheckeredPattern className="opacity-5" />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          {/* Section Title */}
          <div className="mb-16 text-center">
            <NeonSign text="Le Menu du Jour" color="yellow" size="md" />
          </div>

          {/* Menu Boards */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <MenuBoard
              title="Extra-Frais"
              items={[
                {
                  name: "Oeuf a la coque",
                  description: "Parfait pour vos oeufs de 0-9 jours",
                  price: "Jour 1-9",
                },
                {
                  name: "Oeuf poche",
                  description: "Onctueux et delicat",
                  price: "Jour 1-9",
                },
                {
                  name: "Mayonnaise maison",
                  description: "Fraicheur garantie",
                  price: "Jour 1-9",
                },
              ]}
            />

            <MenuBoard
              title="Frais"
              items={[
                {
                  name: "Omelette",
                  description: "Baveuse ou bien cuite",
                  price: "Jour 10-21",
                },
                {
                  name: "Oeuf au plat",
                  description: "Sunny side up!",
                  price: "Jour 10-21",
                },
                {
                  name: "Oeufs brouilles",
                  description: "Cremeux a souhait",
                  price: "Jour 10-21",
                },
              ]}
            />

            <MenuBoard
              title="A Cuire"
              items={[
                {
                  name: "Oeuf dur",
                  description: "Ideal pour les salades",
                  price: "Jour 22-28",
                },
                {
                  name: "Oeuf mimosa",
                  description: "Classique indémodable",
                  price: "Jour 22-28",
                },
                {
                  name: "Quiche",
                  description: "Bien cuit, bien bon",
                  price: "Jour 22-28",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Specials Section */}
      <section id="specials" className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-[#16213e] to-[#1a1a2e]" />

        <div className="relative z-10 mx-auto max-w-5xl px-6">
          {/* Section Title */}
          <div className="mb-16 text-center">
            <NeonSign text="Nos Specialites" color="pink" size="md" />
          </div>

          {/* Feature Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <SpecialCard
              icon="🥚"
              title="Frigo Virtuel"
              description="Gerez toutes vos boites d'oeufs"
            />
            <SpecialCard
              icon="⏰"
              title="Timer Intelligent"
              description="Cuisson parfaite a chaque fois"
            />
            <SpecialCard
              icon="📊"
              title="Statistiques"
              description="Suivez votre anti-gaspi"
            />
            <SpecialCard
              icon="👨‍👩‍👧‍👦"
              title="Partage Famille"
              description="Gerez en equipe"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-24">
        <CheckeredPattern className="opacity-5" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <div className="mb-8">
            <NeonSign text="Notre Histoire" color="turquoise" size="md" />
          </div>

          <p className="font-heading text-lg leading-relaxed text-[var(--diner-cream)]/80">
            Comme dans les bons vieux diners americains, on prend soin de chaque
            ingredient. EggscuseMe vous aide a ne jamais gaspiller un seul oeuf,
            en vous indiquant toujours la recette parfaite selon la fraicheur.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
            <StatCard value="10K+" label="Clients satisfaits" />
            <StatCard value="2.4M" label="Oeufs sauves" />
            <StatCard value="24/7" label="Toujours ouvert" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e] via-[var(--diner-red)]/20 to-[#1a1a2e]" />

        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <NeonSign text="Pret a commander?" color="yellow" size="md" />

          <p className="font-heading mt-6 text-lg text-[var(--diner-cream)]/70">
            Rejoignez des milliers de foyers qui ont dit adieu au gaspillage.
          </p>

          <div className="mt-10">
            <Link
              href="/auth/signin"
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-10 py-5",
                "bg-[var(--diner-red)] text-white",
                "font-heading text-xl font-bold tracking-wider uppercase",
                "border-4 border-[var(--diner-chrome)]",
                "shadow-[6px_6px_0_var(--diner-chrome)]",
                "transition-all hover:translate-x-[3px] hover:translate-y-[3px]",
                "hover:shadow-[3px_3px_0_var(--diner-chrome)]",
              )}
            >
              Prendre une table gratuite
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <DinerFooter />
    </div>
  );
}

type SpecialCardProps = {
  icon: string;
  title: string;
  description: string;
};

function SpecialCard({ icon, title, description }: SpecialCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border-2 border-[var(--diner-chrome)] bg-[#1a1a2e] p-6 text-center",
        "transition-transform hover:-translate-y-1",
      )}
    >
      <div className="mb-3 text-4xl">{icon}</div>
      <h3 className="font-heading text-lg font-bold text-[var(--diner-cream)]">
        {title}
      </h3>
      <p className="mt-2 text-sm text-[var(--diner-cream)]/60">{description}</p>
    </div>
  );
}

type StatCardProps = {
  value: string;
  label: string;
};

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="text-center">
      <div
        className="font-heading text-4xl font-bold text-[var(--diner-neon-yellow)]"
        style={{ textShadow: "0 0 10px var(--diner-neon-yellow)" }}
      >
        {value}
      </div>
      <div className="font-heading mt-1 text-sm tracking-wider text-[var(--diner-cream)]/60 uppercase">
        {label}
      </div>
    </div>
  );
}
