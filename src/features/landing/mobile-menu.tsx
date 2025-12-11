"use client";

import { LanguageToggle } from "@/components/nowts/language-toggle";
import { ThemeSwitcher } from "@/components/nowts/theme-switcher";
import { NeoButton } from "@/components/neo";
import { LogoSvg } from "@/components/svg/logo-svg";
import { SiteConfig } from "@/site-config";
import {
  ArrowRight,
  BookOpen,
  CreditCard,
  Github,
  Linkedin,
  Sparkles,
  Twitter,
  User,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useTranslations } from "next-intl";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/eggscuseme", label: "Twitter" },
  { icon: Github, href: "https://github.com/eggscuseme", label: "GitHub" },
  {
    icon: Linkedin,
    href: "https://linkedin.com/company/eggscuseme",
    label: "LinkedIn",
  },
];

// Animation variants
const menuVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

const containerVariants = {
  closed: {},
  open: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  closed: { opacity: 0, y: 20 },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 25,
    },
  },
};

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const t = useTranslations("landing.nav");
  const tMenu = useTranslations("mobileMenu");

  const navLinks = [
    {
      href: "#features",
      label: t("features"),
      icon: Sparkles,
      description: tMenu("discoverTools"),
    },
    {
      href: "#pricing",
      label: t("pricing"),
      icon: CreditCard,
      description: tMenu("plansAndSubscriptions"),
    },
    {
      href: "/posts",
      label: t("blog"),
      icon: BookOpen,
      description: tMenu("tipsAndTricks"),
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={menuVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="bg-neo-bg fixed inset-0 z-[100] flex flex-col overflow-hidden"
        >
          {/* Animated background gradient */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0.3 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="absolute -top-1/2 -right-1/2 size-full rounded-full bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent blur-3xl"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 0.2 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="absolute -bottom-1/4 -left-1/4 size-3/4 rounded-full bg-gradient-to-tr from-amber-600/10 via-transparent to-transparent blur-3xl"
            />
          </div>

          {/* Header */}
          <motion.header
            variants={itemVariants}
            className="relative flex items-center justify-between px-6 py-5"
          >
            <div className="flex items-center gap-3">
              <LogoSvg size={32} />
              <span className="text-neo-text text-xl font-bold">
                {SiteConfig.title}
              </span>
            </div>
            <NeoButton variant="icon" onClick={onClose} aria-label="Close menu">
              <X className="size-5" />
            </NeoButton>
          </motion.header>

          {/* Main Navigation */}
          <motion.nav
            variants={containerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="relative flex-1 px-6 py-8"
          >
            <motion.p
              variants={itemVariants}
              className="text-neo-text-muted mb-6 text-xs font-black tracking-widest uppercase"
            >
              {tMenu("navigation")}
            </motion.p>

            <div className="space-y-3">
              {navLinks.map((link) => (
                <motion.div key={link.href} variants={itemVariants}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="group border-neo-border/20 bg-neo-card flex items-center gap-4 rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)] p-4 shadow-[var(--shadow-neo-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-md)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  >
                    <div className="border-neo-border/30 bg-neo-accent/10 text-neo-accent flex size-12 items-center justify-center rounded-xl border-[length:var(--border-neo)] transition-transform duration-200 group-hover:scale-105">
                      <link.icon className="size-5" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <span className="text-neo-text group-hover:text-neo-accent block text-lg font-bold transition-colors">
                        {link.label}
                      </span>
                      <span className="text-neo-text-muted text-sm">
                        {link.description}
                      </span>
                    </div>
                    <ArrowRight className="text-neo-text-muted group-hover:text-neo-accent size-5 transition-all duration-200 group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Auth Section */}
            <motion.div variants={itemVariants} className="mt-8">
              <p className="text-neo-text-muted mb-4 text-xs font-black tracking-widest uppercase">
                {tMenu("account")}
              </p>
              <Link
                href="/auth/signin"
                onClick={onClose}
                className="group border-neo-border/20 bg-neo-card flex items-center gap-4 rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)] p-4 shadow-[var(--shadow-neo-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-md)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                <div className="border-neo-border/30 bg-neo-bg text-neo-text-muted group-hover:text-neo-text flex size-12 items-center justify-center rounded-xl border-[length:var(--border-neo)] transition-all duration-200">
                  <User className="size-5" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <span className="text-neo-text block text-lg font-bold">
                    {tMenu("signIn")}
                  </span>
                  <span className="text-neo-text-muted text-sm">
                    {tMenu("accessYourFridge")}
                  </span>
                </div>
                <ArrowRight className="text-neo-text-muted group-hover:text-neo-text size-5 transition-all duration-200 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.nav>

          {/* CTA Button */}
          <motion.div variants={itemVariants} className="relative px-6 pb-4">
            <NeoButton asChild className="w-full" size="lg">
              <Link href="/auth/signin" onClick={onClose} className="gap-2">
                <Zap className="size-5" />
                <span>{tMenu("startFree")}</span>
                <ArrowRight className="size-5" />
              </Link>
            </NeoButton>
          </motion.div>

          {/* Footer */}
          <motion.footer
            variants={itemVariants}
            className="border-neo-border/20 relative border-t-[length:var(--border-neo)] px-6 py-6"
          >
            {/* Theme and Language Toggles */}
            <div className="mb-4 flex items-center justify-center gap-3">
              <LanguageToggle />
              <ThemeSwitcher />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-neo-text-muted text-xs">
                © {new Date().getFullYear()} {SiteConfig.company.name}
              </p>
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-neo-border/30 bg-neo-card text-neo-text-muted hover:text-neo-text flex size-9 items-center justify-center rounded-full border-[length:var(--border-neo)] shadow-[var(--shadow-neo-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-md)] active:translate-y-[2px] active:shadow-none"
                    aria-label={social.label}
                  >
                    <social.icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          </motion.footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
