"use client";

import { LanguageSwitcher } from "@/components/nowts/language-switcher";
import { LogoSvg } from "@/components/svg/logo-svg";
import { Button } from "@/components/ui/button";
import { SiteConfig } from "@/site-config";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { motion, useMotionValue, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthButtonClient } from "../auth/auth-button-client";
import { MobileMenu } from "./mobile-menu";

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
  const scrollYBoundedProgressDelayed = useTransform(
    scrollYBoundedProgress,
    [0, 0.75, 1],
    [0, 0, 1],
  );

  const navLinks = [
    { href: "#features", label: "Fonctionnalites" },
    { href: "#pricing", label: "Tarifs" },
    { href: "/posts", label: "Blog" },
  ];

  return (
    <>
      <motion.header
        style={{
          height: useTransform(scrollYBoundedProgressDelayed, [0, 1], [80, 60]),
          backgroundColor: useTransform(
            scrollYBoundedProgressDelayed,
            [0, 1],
            ["rgba(12, 10, 9, 0)", "rgba(12, 10, 9, 0.95)"],
          ),
        }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 flex w-screen border-b border-transparent backdrop-blur-md transition-colors",
          "border-stone-800/50",
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <LogoSvg
              size={28}
              onClick={() => {
                router.push("/");
              }}
              className="cursor-pointer"
            />
            <motion.p
              style={{
                scale: useTransform(
                  scrollYBoundedProgressDelayed,
                  [0, 1],
                  [1, 0.9],
                ),
              }}
              className="flex origin-left items-center text-lg font-bold text-white max-sm:hidden"
            >
              {SiteConfig.title}
            </motion.p>
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
                className="text-stone-400 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <AuthButtonClient />
              <Link
                href="/auth/signin"
                className="glow-button rounded-full bg-amber-400 px-5 py-2 text-sm font-semibold text-stone-900 transition-all hover:bg-amber-300"
              >
                Commencer
              </Link>
            </div>
          </motion.nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Ouvrir le menu"
              onClick={() => setMobileMenuOpen(true)}
              className="text-stone-300 hover:bg-stone-800 hover:text-white"
            >
              <Menu className="size-5" />
            </Button>
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
