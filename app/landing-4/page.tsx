import {
  ArcadeHero,
  HudNavbar,
  ArcadeFooter,
  PowerUpCard,
  ScanlineOverlay,
} from "@/features/landing-variants/arcade";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Refrigerator, Timer, BarChart3, Users } from "lucide-react";

export default function Landing4Page() {
  return (
    <div className="relative bg-[var(--arcade-dark)]">
      {/* Scanline effect */}
      <ScanlineOverlay />

      {/* Navigation HUD */}
      <HudNavbar />

      {/* Hero */}
      <ArcadeHero />

      {/* Power-Ups Section */}
      <section id="powerups" className="relative py-24">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(var(--arcade-neon-cyan) 1px, transparent 1px),
              linear-gradient(90deg, var(--arcade-neon-cyan) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          {/* Section Title */}
          <div className="mb-16 text-center">
            <span
              className="font-heading text-3xl font-bold text-[var(--arcade-neon-pink)] uppercase sm:text-4xl"
              style={{
                textShadow:
                  "0 0 10px var(--arcade-neon-pink), 0 0 20px var(--arcade-neon-pink)",
              }}
            >
              Power-Ups
            </span>
            <p className="mt-4 text-white/60">
              Collectez tous les power-ups pour maximiser votre score!
            </p>
          </div>

          {/* Power-up Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <PowerUpCard
              icon={<Refrigerator className="size-8" />}
              title="Frigo+"
              description="Gerez toutes vos boites d'oeufs dans un frigo virtuel illimite"
              color="cyan"
            />
            <PowerUpCard
              icon={<Timer className="size-8" />}
              title="Timer Pro"
              description="Cuisson parfaite a chaque fois avec notre timer intelligent"
              color="green"
            />
            <PowerUpCard
              icon={<BarChart3 className="size-8" />}
              title="Stats XP"
              description="Suivez vos stats anti-gaspi et montez en niveau"
              color="yellow"
            />
            <PowerUpCard
              icon={<Users className="size-8" />}
              title="Multiplayer"
              description="Jouez en equipe avec votre famille et vos colocataires"
              color="pink"
            />
          </div>
        </div>
      </section>

      {/* Boss Fights / Problems Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--arcade-purple)]/20 to-transparent" />

        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <div className="mb-16 text-center">
            <span
              className="font-heading text-3xl font-bold text-[var(--arcade-neon-yellow)] uppercase sm:text-4xl"
              style={{
                textShadow:
                  "0 0 10px var(--arcade-neon-yellow), 0 0 20px var(--arcade-neon-yellow)",
              }}
            >
              Boss Fights
            </span>
            <p className="mt-4 text-white/60">
              Les ennemis du quotidien que vous allez vaincre!
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <BossCard
              name="Le Gaspillage"
              description="Fini les oeufs jetes par erreur"
              defeated
            />
            <BossCard
              name="La Confusion"
              description="Plus jamais de doute sur la fraicheur"
              defeated
            />
            <BossCard
              name="L'Oubli"
              description="Notifications pour ne rien rater"
              defeated
            />
          </div>
        </div>
      </section>

      {/* High Scores Section */}
      <section className="relative py-24">
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <span
            className="font-heading text-3xl font-bold text-[var(--arcade-neon-cyan)] uppercase sm:text-4xl"
            style={{
              textShadow:
                "0 0 10px var(--arcade-neon-cyan), 0 0 20px var(--arcade-neon-cyan)",
            }}
          >
            High Scores
          </span>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-12">
            <ScoreItem rank="1ST" value="2.4M" label="Oeufs sauves" />
            <ScoreItem rank="2ND" value="10K+" label="Joueurs actifs" />
            <ScoreItem rank="3RD" value="4.9" label="Score moyen" />
          </div>
        </div>
      </section>

      {/* Shop / CTA Section */}
      <section className="relative py-24">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, var(--arcade-dark), var(--arcade-purple)/30, var(--arcade-dark))",
          }}
        />

        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <span
            className="font-heading text-3xl font-bold text-[var(--arcade-neon-green)] uppercase sm:text-4xl"
            style={{
              textShadow:
                "0 0 10px var(--arcade-neon-green), 0 0 20px var(--arcade-neon-green)",
            }}
          >
            Ready Player One?
          </span>

          <p className="mt-6 text-lg text-white/70">
            Rejoins des milliers de joueurs qui ont deja battu le boss du
            gaspillage!
          </p>

          <div className="mt-10">
            <Link
              href="/auth/signin"
              className={cn(
                "inline-flex items-center gap-3 rounded-lg px-12 py-5",
                "bg-[var(--arcade-neon-yellow)] text-[var(--arcade-dark)]",
                "font-heading text-2xl font-bold uppercase",
                "transition-transform hover:scale-105",
              )}
              style={{
                boxShadow:
                  "0 0 30px var(--arcade-neon-yellow), 0 0 60px var(--arcade-neon-yellow)",
              }}
            >
              Insert Coin
            </Link>
            <p className="mt-4 text-sm text-white/40">Gratuit pour commencer</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <ArcadeFooter />
    </div>
  );
}

type BossCardProps = {
  name: string;
  description: string;
  defeated?: boolean;
};

function BossCard({ name, description, defeated }: BossCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border-2 border-[var(--arcade-neon-pink)] bg-[var(--arcade-dark)] p-6 text-center",
        defeated && "opacity-80",
      )}
      style={{
        boxShadow: "0 0 15px var(--arcade-neon-pink)",
      }}
    >
      {defeated && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="font-heading -rotate-12 text-4xl font-bold text-[var(--arcade-neon-green)]"
            style={{
              textShadow: "0 0 10px var(--arcade-neon-green)",
            }}
          >
            DEFEATED
          </span>
        </div>
      )}

      <h3
        className={cn(
          "font-heading text-xl font-bold text-[var(--arcade-neon-pink)]",
          defeated && "line-through opacity-50",
        )}
      >
        {name}
      </h3>
      <p className="mt-2 text-sm text-white/60">{description}</p>
    </div>
  );
}

type ScoreItemProps = {
  rank: string;
  value: string;
  label: string;
};

function ScoreItem({ rank, value, label }: ScoreItemProps) {
  return (
    <div className="text-center">
      <span className="text-sm font-bold text-[var(--arcade-neon-pink)]">
        {rank}
      </span>
      <div
        className="font-heading text-4xl font-bold text-white"
        style={{ textShadow: "0 0 10px white" }}
      >
        {value}
      </div>
      <p className="mt-1 text-xs tracking-wider text-white/50 uppercase">
        {label}
      </p>
    </div>
  );
}
