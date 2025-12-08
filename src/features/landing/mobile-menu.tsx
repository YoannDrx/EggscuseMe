"use client";

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

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const navLinks = [
  {
    href: "#features",
    label: "Fonctionnalites",
    icon: Sparkles,
    description: "Decouvrez nos outils",
  },
  {
    href: "#pricing",
    label: "Tarifs",
    icon: CreditCard,
    description: "Plans et abonnements",
  },
  {
    href: "/posts",
    label: "Blog",
    icon: BookOpen,
    description: "Conseils et astuces",
  },
];

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
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={menuVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-stone-950"
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
              <span className="text-xl font-bold text-white">
                {SiteConfig.title}
              </span>
            </div>
            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="flex size-10 items-center justify-center rounded-full bg-stone-900 text-stone-400 transition-colors hover:bg-stone-800 hover:text-white"
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
              className="mb-6 text-xs font-semibold tracking-widest text-stone-500 uppercase"
            >
              Navigation
            </motion.p>

            <div className="space-y-2">
              {navLinks.map((link) => (
                <motion.div key={link.href} variants={itemVariants}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="group flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 hover:bg-stone-900/80"
                  >
                    <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 text-amber-400 transition-transform duration-300 group-hover:scale-110">
                      <link.icon className="size-5" />
                    </div>
                    <div className="flex-1">
                      <span className="block text-lg font-semibold text-white transition-colors group-hover:text-amber-400">
                        {link.label}
                      </span>
                      <span className="text-sm text-stone-500">
                        {link.description}
                      </span>
                    </div>
                    <ArrowRight className="size-5 text-stone-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-amber-400" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Auth Section */}
            <motion.div variants={itemVariants} className="mt-8">
              <p className="mb-4 text-xs font-semibold tracking-widest text-stone-500 uppercase">
                Compte
              </p>
              <Link
                href="/auth/signin"
                onClick={onClose}
                className="group flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 hover:bg-stone-900/80"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-stone-800 text-stone-400 transition-all duration-300 group-hover:bg-stone-700 group-hover:text-white">
                  <User className="size-5" />
                </div>
                <div className="flex-1">
                  <span className="block text-lg font-semibold text-white">
                    Se connecter
                  </span>
                  <span className="text-sm text-stone-500">
                    Accedez a votre frigo
                  </span>
                </div>
                <ArrowRight className="size-5 text-stone-600 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
              </Link>
            </motion.div>
          </motion.nav>

          {/* CTA Button */}
          <motion.div variants={itemVariants} className="relative px-6 pb-4">
            <Link
              href="/auth/signin"
              onClick={onClose}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-4 font-semibold text-stone-900 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25"
            >
              <motion.div className="absolute inset-0 bg-gradient-to-r from-amber-300 to-amber-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <Zap className="relative size-5" />
              <span className="relative">Commencer gratuitement</span>
              <ArrowRight className="relative size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Footer */}
          <motion.footer
            variants={itemVariants}
            className="relative border-t border-stone-900 px-6 py-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-stone-600">
                © {new Date().getFullYear()} {SiteConfig.company.name}
              </p>
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-9 items-center justify-center rounded-full bg-stone-900 text-stone-500 transition-all duration-300 hover:scale-110 hover:bg-stone-800 hover:text-white"
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
