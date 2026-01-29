import {
  ZenHero,
  MinimalNavbar,
  ZenFooter,
  HaikuText,
  FallingPetals,
} from "@/features/landing-variants/tamago";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Landing5Page() {
  return (
    <div className="relative bg-[var(--zen-washi)]">
      {/* Falling Petals */}
      <FallingPetals count={12} />

      {/* Navigation */}
      <MinimalNavbar />

      {/* Hero */}
      <ZenHero />

      {/* Mottainai Section - Anti-waste philosophy */}
      <section id="mottainai" className="py-32">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <span className="font-serif text-sm tracking-[0.3em] text-[var(--zen-matcha)] uppercase">
            Mottainai
          </span>

          <h2 className="mt-6 font-serif text-3xl font-light text-[var(--zen-sumi)] sm:text-4xl">
            Le regret du gaspillage
          </h2>

          <div className="mx-auto mt-8 h-px w-16 bg-[var(--zen-matcha)]/50" />

          <p className="mt-8 font-serif text-lg leading-relaxed text-[var(--zen-ink-light)]">
            Dans la tradition japonaise, chaque ressource merite respect. Un
            oeuf jete est une opportunite perdue, un repas qui n&apos;a pas ete.
          </p>

          <div className="mt-16 grid gap-12 sm:grid-cols-3">
            <ZenPrinciple
              kanji="新"
              title="Shinsen"
              meaning="Fraicheur"
              description="Savoir quand l'oeuf est au meilleur de lui-meme"
            />
            <ZenPrinciple
              kanji="知"
              title="Chi"
              meaning="Connaissance"
              description="Comprendre le cycle naturel de conservation"
            />
            <ZenPrinciple
              kanji="和"
              title="Wa"
              meaning="Harmonie"
              description="Cuisiner en accord avec la fraicheur"
            />
          </div>
        </div>
      </section>

      {/* Shizen Section - Natural */}
      <section className="bg-[var(--zen-kinari)] py-32">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <span className="font-serif text-sm tracking-[0.3em] text-[var(--zen-matcha)] uppercase">
              Shizen
            </span>

            <h2 className="mt-6 font-serif text-3xl font-light text-[var(--zen-sumi)] sm:text-4xl">
              Naturellement simple
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            <ZenFeature
              title="Frigo Virtuel"
              description="Organisez vos oeufs avec serenite. Chaque boite a sa place, chaque oeuf son histoire."
            />
            <ZenFeature
              title="Couleurs de Vie"
              description="Vert, jaune, orange. Les couleurs parlent, vous ecoutez, vous cuisinez juste."
            />
            <ZenFeature
              title="Timer Mindful"
              description="La patience recompensee. Un timer qui respecte le temps de cuisson parfait."
            />
            <ZenFeature
              title="Partage Familial"
              description="L'harmonie du foyer. Tous connectes, tous informes, zero gaspillage."
            />
          </div>
        </div>
      </section>

      {/* Kanso Section - Simplicity */}
      <section className="py-32">
        <div className="mx-auto max-w-xl px-6 text-center">
          <span className="font-serif text-sm tracking-[0.3em] text-[var(--zen-matcha)] uppercase">
            Kanso
          </span>

          <h2 className="mt-6 font-serif text-3xl font-light text-[var(--zen-sumi)] sm:text-4xl">
            L&apos;essence de la simplicite
          </h2>

          <div className="mx-auto mt-8 h-px w-16 bg-[var(--zen-matcha)]/50" />

          <div className="mt-12">
            <HaikuText
              lines={[
                "Simple est le chemin",
                "qui mene a la perfection",
                "un oeuf, un moment",
              ]}
            />
          </div>

          {/* Stats - Minimal */}
          <div className="mt-20 flex items-center justify-center gap-16">
            <ZenStat value="2.4M" label="Oeufs preserves" />
            <div className="h-12 w-px bg-[var(--zen-sumi)]/10" />
            <ZenStat value="10K" label="Foyers zen" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-[var(--zen-sumi)]/10 py-32">
        <div className="mx-auto max-w-md px-6 text-center">
          <p className="font-serif text-xl text-[var(--zen-sumi)]">
            Pret a embrasser la simplicite?
          </p>

          <div className="mt-10">
            <Link
              href="/auth/signin"
              className={cn(
                "inline-block px-12 py-5",
                "bg-[var(--zen-sumi)] text-[var(--zen-washi)]",
                "font-serif tracking-widest",
                "transition-all duration-500",
                "hover:bg-[var(--zen-ink-light)]",
              )}
            >
              Commencer le voyage
            </Link>
          </div>

          <p className="mt-6 font-serif text-sm text-[var(--zen-ink-light)]">
            Gratuit. Simple. Zen.
          </p>
        </div>
      </section>

      {/* Footer */}
      <ZenFooter />
    </div>
  );
}

type ZenPrincipleProps = {
  kanji: string;
  title: string;
  meaning: string;
  description: string;
};

function ZenPrinciple({
  kanji,
  title,
  meaning,
  description,
}: ZenPrincipleProps) {
  return (
    <div className="text-center">
      <span className="font-serif text-4xl text-[var(--zen-matcha)]">
        {kanji}
      </span>
      <h3 className="mt-4 font-serif text-lg text-[var(--zen-sumi)]">
        {title}
      </h3>
      <p className="text-sm text-[var(--zen-ink-light)]">{meaning}</p>
      <p className="mt-3 font-serif text-sm leading-relaxed text-[var(--zen-ink-light)]">
        {description}
      </p>
    </div>
  );
}

type ZenFeatureProps = {
  title: string;
  description: string;
};

function ZenFeature({ title, description }: ZenFeatureProps) {
  return (
    <div className="border-l border-[var(--zen-matcha)]/30 pl-6">
      <h3 className="font-serif text-lg text-[var(--zen-sumi)]">{title}</h3>
      <p className="mt-2 font-serif text-sm leading-relaxed text-[var(--zen-ink-light)]">
        {description}
      </p>
    </div>
  );
}

type ZenStatProps = {
  value: string;
  label: string;
};

function ZenStat({ value, label }: ZenStatProps) {
  return (
    <div className="text-center">
      <div className="font-serif text-3xl text-[var(--zen-sumi)]">{value}</div>
      <p className="mt-1 text-xs tracking-widest text-[var(--zen-ink-light)] uppercase">
        {label}
      </p>
    </div>
  );
}
