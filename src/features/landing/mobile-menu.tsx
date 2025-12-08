"use client";

import { LanguageToggle } from "@/components/nowts/language-toggle";
import { ThemeSwitcher } from "@/components/nowts/theme-switcher";
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
import { AnimatePresence, motion } from "framer-motion";
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
          className="bg-background fixed inset-0 z-[100] flex flex-col overflow-hidden"
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
              <span className="text-foreground text-xl font-bold">
                {SiteConfig.title}
              </span>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground flex size-10 items-center justify-center rounded-full transition-colors"
            >
              <X className="size-5" />
            </motion.button>
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
              className="text-muted-foreground mb-6 text-xs font-semibold tracking-widest uppercase"
            >
              {tMenu("navigation")}
            </motion.p>

            <div className="space-y-2">
              {navLinks.map((link) => (
                <motion.div key={link.href} variants={itemVariants}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="hover:bg-muted/80 group flex items-center gap-4 rounded-2xl p-4 transition-all duration-300"
                  >
                    <div className="from-primary/20 to-primary/10 text-primary flex size-12 items-center justify-center rounded-xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110">
                      <link.icon className="size-5" />
                    </div>
                    <div className="flex-1">
                      <span className="text-foreground group-hover:text-primary block text-lg font-semibold transition-colors">
                        {link.label}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {link.description}
                      </span>
                    </div>
                    <ArrowRight className="text-muted-foreground group-hover:text-primary size-5 transition-all duration-300 group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Auth Section */}
            <motion.div variants={itemVariants} className="mt-8">
              <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-widest uppercase">
                {tMenu("account")}
              </p>
              <Link
                href="/auth/signin"
                onClick={onClose}
                className="hover:bg-muted/80 group flex items-center gap-4 rounded-2xl p-4 transition-all duration-300"
              >
                <div className="bg-muted text-muted-foreground group-hover:bg-muted/80 group-hover:text-foreground flex size-12 items-center justify-center rounded-xl transition-all duration-300">
                  <User className="size-5" />
                </div>
                <div className="flex-1">
                  <span className="text-foreground block text-lg font-semibold">
                    {tMenu("signIn")}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {tMenu("accessYourFridge")}
                  </span>
                </div>
                <ArrowRight className="text-muted-foreground group-hover:text-foreground size-5 transition-all duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.nav>

          {/* CTA Button */}
          <motion.div variants={itemVariants} className="relative px-6 pb-4">
            <Link
              href="/auth/signin"
              onClick={onClose}
              className="from-primary to-primary/90 text-primary-foreground hover:shadow-primary/25 group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r px-6 py-4 font-semibold transition-all duration-300 hover:shadow-lg"
            >
              <motion.div className="from-primary/80 to-primary absolute inset-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <Zap className="relative size-5" />
              <span className="relative">{tMenu("startFree")}</span>
              <ArrowRight className="relative size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Footer */}
          <motion.footer
            variants={itemVariants}
            className="border-border relative border-t px-6 py-6"
          >
            {/* Theme and Language Toggles */}
            <div className="mb-4 flex items-center justify-center gap-3">
              <LanguageToggle />
              <ThemeSwitcher />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs">
                © {new Date().getFullYear()} {SiteConfig.company.name}
              </p>
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground flex size-9 items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
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
