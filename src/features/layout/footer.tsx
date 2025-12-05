"use client";

import { LogoSvg } from "@/components/svg/logo-svg";
import { SiteConfig } from "@/site-config";
import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";

const footerLinks = {
  produit: [
    { label: "Fonctionnalites", href: "#features" },
    { label: "Tarifs", href: "#pricing" },
    { label: "Mon Frigo", href: "/fridge" },
    { label: "Blog", href: "/posts" },
  ],
  entreprise: [
    { label: "A propos", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Carrières", href: "/careers" },
  ],
  legal: [
    { label: "CGU", href: "/legal/terms" },
    { label: "Confidentialite", href: "/legal/privacy" },
    { label: "Cookies", href: "/legal/cookies" },
  ],
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

export function Footer() {
  return (
    <footer className="border-t border-stone-900 bg-stone-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_2fr]">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <LogoSvg size={28} />
              <span className="text-lg font-bold text-white">
                {SiteConfig.title}
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-stone-500">
              L&apos;application #1 pour suivre la fraicheur de vos oeufs et
              reduire le gaspillage alimentaire. Simple, efficace, gratuit.
            </p>
            {/* Social Links */}
            <div className="mt-4 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex size-10 items-center justify-center rounded-full border border-stone-800 text-stone-500 transition-colors hover:border-stone-700 hover:text-white"
                  aria-label={social.label}
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {/* Produit */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold tracking-wider text-stone-400 uppercase">
                Produit
              </h4>
              <nav className="flex flex-col gap-3">
                {footerLinks.produit.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-stone-500 transition-colors hover:text-amber-400"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Entreprise */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold tracking-wider text-stone-400 uppercase">
                Entreprise
              </h4>
              <nav className="flex flex-col gap-3">
                {footerLinks.entreprise.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-stone-500 transition-colors hover:text-amber-400"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold tracking-wider text-stone-400 uppercase">
                Legal
              </h4>
              <nav className="flex flex-col gap-3">
                {footerLinks.legal.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm text-stone-500 transition-colors hover:text-amber-400"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-stone-900 pt-8 sm:flex-row">
          <p className="text-xs text-stone-600">
            © {new Date().getFullYear()} {SiteConfig.company.name}. Tous droits
            reserves.
          </p>
          <p className="text-xs text-stone-600">
            Fait avec amour a {SiteConfig.company.address.split(",")[0]}
          </p>
        </div>
      </div>
    </footer>
  );
}
