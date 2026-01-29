"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { Heart } from "lucide-react";

type HudNavbarProps = {
  className?: string;
};

export function HudNavbar({ className }: HudNavbarProps) {
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50",
        "bg-[var(--arcade-dark)]/95 backdrop-blur-sm",
        "border-b-2 border-[var(--arcade-neon-pink)]",
        className,
      )}
      style={{
        boxShadow: "0 2px 20px var(--arcade-neon-pink)",
      }}
    >
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Left - Score */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[var(--arcade-neon-cyan)] uppercase">
              Score
            </span>
            <motion.span
              className="font-heading text-xl font-bold text-white"
              style={{ textShadow: "0 0 10px white" }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              000000
            </motion.span>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-xs font-bold text-[var(--arcade-neon-green)] uppercase">
              Level
            </span>
            <span
              className="font-heading text-xl font-bold text-white"
              style={{ textShadow: "0 0 10px white" }}
            >
              01
            </span>
          </div>
        </div>

        {/* Center - Logo */}
        <Link href="/landing-4" className="absolute left-1/2 -translate-x-1/2">
          <motion.span
            className="font-heading text-xl font-bold text-[var(--arcade-neon-yellow)]"
            style={{
              textShadow:
                "0 0 10px var(--arcade-neon-yellow), 0 0 20px var(--arcade-neon-yellow)",
            }}
            animate={{
              textShadow: [
                "0 0 10px var(--arcade-neon-yellow), 0 0 20px var(--arcade-neon-yellow)",
                "0 0 15px var(--arcade-neon-yellow), 0 0 30px var(--arcade-neon-yellow)",
                "0 0 10px var(--arcade-neon-yellow), 0 0 20px var(--arcade-neon-yellow)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            EGGMANIA
          </motion.span>
        </Link>

        {/* Right - Lives & Start */}
        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-1 sm:flex">
            {[1, 2, 3].map((i) => (
              <Heart
                key={i}
                className="size-5 fill-[var(--arcade-neon-pink)] text-[var(--arcade-neon-pink)]"
                style={{
                  filter: "drop-shadow(0 0 5px var(--arcade-neon-pink))",
                }}
              />
            ))}
          </div>

          <Link
            href="/auth/signin"
            className={cn(
              "rounded border-2 border-[var(--arcade-neon-green)] px-4 py-1.5",
              "font-heading text-sm font-bold text-[var(--arcade-neon-green)]",
              "transition-all hover:bg-[var(--arcade-neon-green)] hover:text-[var(--arcade-dark)]",
            )}
            style={{
              boxShadow: "0 0 10px var(--arcade-neon-green)",
            }}
          >
            START
          </Link>
        </div>
      </nav>
    </header>
  );
}
