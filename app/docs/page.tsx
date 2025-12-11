import {
  NeoButton,
  NeoCard,
  NeoCardDescription,
  NeoCardFooter,
  NeoCardHeader,
  NeoCardTitle,
} from "@/components/neo";
import { cn } from "@/lib/utils";
import { SiteConfig } from "@/site-config";
import { ArrowRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Suspense } from "react";
import { getDocs } from "./doc-manager";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.docs.meta");
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${SiteConfig.prodUrl}/docs`,
      type: "website",
    },
  };
}

export default function Page(props: PageProps<"/docs">) {
  return (
    <Suspense fallback={null}>
      <DocsPage {...props} />
    </Suspense>
  );
}

async function DocsPage(_props: PageProps<"/docs">) {
  const t = await getTranslations("pages.docs");
  const docs = await getDocs();

  const sortedDocs = [...docs].sort((a, b) => {
    // Sort by order if available
    if (a.attributes.order !== undefined && b.attributes.order !== undefined) {
      return a.attributes.order - b.attributes.order;
    }

    // Otherwise sort by title
    return a.attributes.title.localeCompare(b.attributes.title);
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div
        className={cn(
          "border-neo-border bg-neo-card",
          "rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)]",
          "p-6 shadow-[var(--shadow-neo-md)]",
        )}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "border-neo-border bg-neo-accent/10",
              "flex size-14 items-center justify-center",
              "rounded-[var(--radius-neo-lg)] border-[length:var(--border-neo)]",
            )}
          >
            <BookOpen className="text-neo-accent size-7" />
          </div>
          <div>
            <h1 className="font-heading text-neo-text text-2xl font-bold md:text-3xl">
              {t("title")}
            </h1>
            <p className="text-neo-text-muted mt-1">{t("subtitle")}</p>
          </div>
        </div>
      </div>

      {/* Docs Grid */}
      <div className="grid flex-1 gap-6 sm:grid-cols-2">
        {sortedDocs.map((doc) => (
          <NeoCard key={doc.slug} className="h-fit overflow-hidden">
            {doc.attributes.coverUrl && (
              <div
                className={cn(
                  "border-neo-border h-36 bg-cover bg-center",
                  "border-b-[length:var(--border-neo)]",
                )}
                style={{ backgroundImage: `url(${doc.attributes.coverUrl})` }}
              />
            )}
            <NeoCardHeader>
              <NeoCardTitle>{doc.attributes.title}</NeoCardTitle>
              <NeoCardDescription>
                {doc.attributes.description}
              </NeoCardDescription>
            </NeoCardHeader>
            <NeoCardFooter>
              <NeoButton asChild variant="outline">
                <Link href={`/docs/${doc.slug}`} className="gap-2">
                  {t("readMore")} <ArrowRight className="size-4" />
                </Link>
              </NeoButton>
            </NeoCardFooter>
          </NeoCard>
        ))}
      </div>
    </div>
  );
}
