"use client";

import { EggyChefMix } from "@/features/mascot/components/eggy-sticker-components";
import { SiteConfig } from "@/site-config";
import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";
import { useTranslations } from "next-intl";

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export function Footer() {
  const t = useTranslations("footer");

  const footerLinks = {
    produit: [
      { label: t("features"), href: "#features" },
      { label: t("pricing"), href: "#pricing" },
      { label: t("myFridge"), href: "/fridge" },
      { label: t("blog"), href: "/posts" },
    ],
    entreprise: [
      { label: t("about"), href: "/about" },
      { label: t("contact"), href: "/contact" },
      { label: t("careers"), href: "/careers" },
    ],
    legal: [
      { label: t("terms"), href: "/legal/terms" },
      { label: t("privacy"), href: "/legal/privacy" },
      { label: t("cookies"), href: "/legal/cookies" },
    ],
  };
  return (
    <footer className="border-neo-border bg-neo-bg border-t-[length:var(--border-neo-lg)]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_2fr]">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <div className="border-neo-border bg-neo-card inline-flex w-fit items-center gap-3 rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)] px-4 py-2 shadow-[var(--shadow-neo-md)]">
              <EggyChefMix className="size-12" />
              <span className="font-heading text-neo-text text-xl font-bold tracking-tight">
                {SiteConfig.title}
              </span>
            </div>
            <p className="text-neo-text-muted max-w-xs text-sm leading-relaxed">
              {t("description")}
            </p>
            {/* Social Links */}
            <div className="mt-4 flex gap-3">
              {socialLinks.map((social) => (
                <button
                  key={social.label}
                  type="button"
                  className="border-neo-border bg-neo-card text-neo-text-muted hover:text-neo-accent flex size-10 cursor-not-allowed items-center justify-center rounded-full border-[length:var(--border-neo)] opacity-60 shadow-[var(--shadow-neo-sm)] transition-all duration-200"
                  aria-label={social.label}
                  disabled
                >
                  <social.icon className="size-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {/* Produit */}
            <div className="flex flex-col gap-4">
              <h4 className="text-neo-text-muted text-sm font-black tracking-wider uppercase">
                {t("product")}
              </h4>
              <nav className="flex flex-col gap-3">
                {footerLinks.produit.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-neo-text-muted hover:text-neo-accent text-sm font-medium transition-all duration-200 hover:translate-x-1"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Entreprise */}
            <div className="flex flex-col gap-4">
              <h4 className="text-neo-text-muted text-sm font-black tracking-wider uppercase">
                {t("company")}
              </h4>
              <nav className="flex flex-col gap-3">
                {footerLinks.entreprise.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-neo-text-muted hover:text-neo-accent text-sm font-medium transition-all duration-200 hover:translate-x-1"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-4">
              <h4 className="text-neo-text-muted text-sm font-black tracking-wider uppercase">
                {t("legal")}
              </h4>
              <nav className="flex flex-col gap-3">
                {footerLinks.legal.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-neo-text-muted hover:text-neo-accent text-sm font-medium transition-all duration-200 hover:translate-x-1"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-neo-border mt-12 flex flex-col items-center justify-between gap-4 border-t-[length:var(--border-neo)] pt-8 sm:flex-row">
          <p className="text-neo-text-muted text-xs">
            © {new Date().getFullYear()} {SiteConfig.company.name}.{" "}
            {t("allRightsReserved")}
          </p>
          <p className="border-neo-border bg-neo-accent/10 text-neo-accent rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)] px-4 py-2 text-sm font-bold shadow-[var(--shadow-neo-sm)]">
            {t("tagline")}
          </p>
        </div>
      </div>
    </footer>
  );
}
