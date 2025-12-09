"use client";

import { LogoSvg } from "@/components/svg/logo-svg";
import { SiteConfig } from "@/site-config";
import Link from "next/link";
import { Twitter, Github, Linkedin } from "lucide-react";
import { useTranslations } from "next-intl";

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
    <footer className="border-border bg-background border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_2fr]">
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <LogoSvg size={28} />
              <span className="text-foreground text-lg font-bold">
                {SiteConfig.title}
              </span>
            </div>
            <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
              {t("description")}
            </p>
            {/* Social Links */}
            <div className="mt-4 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground flex size-10 items-center justify-center rounded-full border transition-colors"
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
              <h4 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
                {t("product")}
              </h4>
              <nav className="flex flex-col gap-3">
                {footerLinks.produit.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Entreprise */}
            <div className="flex flex-col gap-4">
              <h4 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
                {t("company")}
              </h4>
              <nav className="flex flex-col gap-3">
                {footerLinks.entreprise.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-4">
              <h4 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
                {t("legal")}
              </h4>
              <nav className="flex flex-col gap-3">
                {footerLinks.legal.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-border mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} {SiteConfig.company.name}.{" "}
            {t("allRightsReserved")}
          </p>
          <p className="text-muted-foreground text-xs">
            {t("madeWithLove")} {SiteConfig.company.address.split(",")[0]}
          </p>
        </div>
      </div>
    </footer>
  );
}
