"use client";

import { LanguageToggle } from "@/components/nowts/language-toggle";
import { ThemeSwitcher } from "@/components/nowts/theme-switcher";
import { NeoButton } from "@/components/neo";
import { EggyChefMix } from "@/features/mascot/components/eggy-sticker-components";
import { SiteConfig } from "@/site-config";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthButtonClient } from "../auth/auth-button-client";
import { MobileMenu } from "./mobile-menu";
import { useTranslations } from "next-intl";

function useBoundedScroll(threshold: number) {
  const { scrollY } = useScroll();
  const scrollYBounded = useMotionValue(0);
  const scrollYBoundedProgress = useTransform(
    scrollYBounded,
    [0, threshold],
    [0, 1],
  );

  useEffect(() => {
    const onChange = (current: number) => {
      const previous = scrollY.getPrevious() ?? 0;
      const diff = current - previous;
      const newScrollYBounded = scrollYBounded.get() + diff;

      scrollYBounded.set(clamp(newScrollYBounded, 0, threshold));
    };

    const deleteEvent = scrollY.on("change", onChange);

    const listener = () => {
      const currentScroll = window.scrollY;
      onChange(currentScroll);
    };

    window.addEventListener("scroll", listener);

    return () => {
      deleteEvent();
      window.removeEventListener("scroll", listener);
    };
  }, [threshold, scrollY, scrollYBounded]);

  return { scrollYBounded, scrollYBoundedProgress };
}

export function LandingHeader() {
  const { scrollYBoundedProgress } = useBoundedScroll(400);
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations("landing.nav");
  const scrollYBoundedProgressDelayed = useTransform(
    scrollYBoundedProgress,
    [0, 0.75, 1],
    [0, 0, 1],
  );

  const navLinks = [
    { href: "#features", label: t("features") },
    { href: "#pricing", label: t("pricing") },
    { href: "/posts", label: t("blog") },
  ];

  return (
    <>
      <motion.header
        style={{
          height: useTransform(scrollYBoundedProgressDelayed, [0, 1], [80, 60]),
        }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 flex w-screen backdrop-blur-md transition-all",
          "border-neo-border/20 border-b-[length:var(--border-neo)]",
          "bg-neo-card/95",
          "shadow-[0_4px_0_var(--neo-shadow-color)]",
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={() => router.push("/")}
          >
            <EggyChefMix className="size-9" />
            <span className="font-heading text-neo-text text-lg font-bold tracking-tight max-sm:hidden">
              {SiteConfig.title}
            </span>
          </div>

          {/* Desktop Navigation */}
          <motion.nav
            style={{
              opacity: useTransform(
                scrollYBoundedProgressDelayed,
                [0, 1],
                [1, 0.9],
              ),
            }}
            className="hidden items-center gap-6 text-sm font-medium sm:flex"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <ThemeSwitcher />
              <AuthButtonClient />
              <NeoButton asChild>
                <Link href="/auth/signin?callbackUrl=/fridge">
                  {t("getStarted")}
                </Link>
              </NeoButton>
            </div>
          </motion.nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <NeoButton
              variant="ghost"
              size="icon"
              aria-label={t("openMenu")}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="size-5" />
            </NeoButton>
          </div>
        </div>
      </motion.header>

      {/* Fullscreen Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}

const clamp = (number: number, min: number, max: number) =>
  Math.min(Math.max(number, min), max);
