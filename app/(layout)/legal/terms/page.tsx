import { EggyChefMix } from "@/features/mascot/components/eggy-sticker-components";
import { Layout, LayoutContent } from "@/features/page/layout";
import { SiteConfig } from "@/site-config";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  FileText,
  Globe,
  UserCog,
  Scale,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export const metadata: Metadata = {
  title: `${SiteConfig.title} - Terms of Service`,
  description: "Terms of Service - Rules for using EggscuseMe",
};

const sections = [
  { key: "purpose", icon: FileText },
  { key: "access", icon: Globe },
  { key: "personalData", icon: UserCog },
  { key: "intellectualProperty", icon: Scale },
  { key: "liability", icon: AlertTriangle },
  { key: "modifications", icon: RefreshCw },
] as const;

export default async function TermsPage() {
  const t = await getTranslations("legal.terms");
  const tLegal = await getTranslations("legal");

  return (
    <div className="bg-neo-bg min-h-screen">
      {/* Header Section */}
      <div
        className={cn(
          "border-neo-border bg-neo-card",
          "border-b-[length:var(--border-neo-lg)]",
          "shadow-[var(--shadow-neo-md)]",
        )}
      >
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-4 py-12 text-center">
          <EggyChefMix className="size-20" />
          <h1 className="font-heading text-neo-text text-4xl font-bold tracking-tight">
            {t("title")}
          </h1>
          <p className="text-neo-text-muted text-lg">{t("intro")}</p>
          <div
            className={cn(
              "border-neo-border bg-neo-accent/10 text-neo-accent",
              "mt-2 inline-flex items-center gap-2",
              "rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)]",
              "px-4 py-2 text-sm font-bold",
              "shadow-[var(--shadow-neo-sm)]",
            )}
          >
            {tLegal("lastUpdated")}: 11 December 2025
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <Layout>
        <LayoutContent className="m-auto mb-12 max-w-4xl py-8">
          <div className="flex flex-col gap-6">
            {sections.map(({ key, icon: Icon }, index) => (
              <section
                key={key}
                className={cn(
                  "border-neo-border bg-neo-card",
                  "rounded-[var(--radius-neo-2xl)] border-[length:var(--border-neo)]",
                  "p-6 shadow-[var(--shadow-neo-md)]",
                  "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-neo-lg)]",
                )}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className={cn(
                      "border-neo-border bg-neo-accent/10",
                      "flex size-10 items-center justify-center",
                      "rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)]",
                      "shadow-[var(--shadow-neo-sm)]",
                    )}
                  >
                    <Icon className="text-neo-accent size-5" />
                  </div>
                  <h2 className="font-heading text-neo-text text-xl font-bold">
                    {index + 1}. {t(`${key}.title`)}
                  </h2>
                </div>
                <p className="text-neo-text-muted leading-relaxed whitespace-pre-line">
                  {t(`${key}.content`)}
                </p>
              </section>
            ))}
          </div>
        </LayoutContent>
      </Layout>
    </div>
  );
}
