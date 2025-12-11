import { NeoBadge, NeoButton } from "@/components/neo";
import { cn } from "@/lib/utils";
import { getPosts, getPostsTags } from "@/features/posts/post-manager";
import { formatDate } from "@/lib/format/date";
import { SiteConfig } from "@/site-config";
import { ArrowLeft, ArrowRight, Calendar, Tag } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type TagPageProps = {
  params: Promise<{ tag: string }>;
};

export async function generateMetadata(props: TagPageProps): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations("pages.posts.meta");

  return {
    title: `${params.tag} - ${t("title")}`,
    description: t("description"),
    openGraph: {
      title: `${params.tag} - ${t("title")}`,
      description: t("description"),
      url: `${SiteConfig.prodUrl}/posts/tags/${params.tag}`,
      type: "website",
    },
  };
}

export async function generateStaticParams() {
  const tags = await getPostsTags();

  if (tags.length === 0) {
    return [{ tag: "_placeholder" }];
  }

  return tags.map((tag) => ({ tag }));
}

export default async function TagPage(props: TagPageProps) {
  const t = await getTranslations("pages.posts");
  const params = await props.params;
  const posts = await getPosts([params.tag]);

  return (
    <div className="bg-neo-bg min-h-screen">
      {/* Hero Header */}
      <div
        className={cn(
          "border-neo-border bg-neo-card",
          "border-b-[length:var(--border-neo-lg)]",
          "shadow-[var(--shadow-neo-md)]",
        )}
      >
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-16 text-center">
          <div
            className={cn(
              "border-neo-border bg-neo-accent/10",
              "flex size-16 items-center justify-center",
              "rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)]",
              "shadow-[var(--shadow-neo-md)]",
            )}
          >
            <Tag className="text-neo-accent size-8" />
          </div>
          <h1 className="font-heading text-neo-text text-4xl font-bold tracking-tight md:text-5xl">
            {params.tag}
          </h1>
          <p className="text-neo-text-muted max-w-2xl text-lg">
            {t("tagDescription", { tag: params.tag })}
          </p>
          <NeoButton asChild variant="outline" size="sm">
            <Link href="/posts" className="gap-2">
              <ArrowLeft className="size-4" />
              {t("viewAll")}
            </Link>
          </NeoButton>
        </div>
      </div>

      {/* Posts */}
      <div className="mx-auto max-w-5xl px-4 py-12">
        {posts.length === 0 ? (
          <div
            className={cn(
              "border-neo-border bg-neo-card",
              "rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)]",
              "p-12 text-center shadow-[var(--shadow-neo-md)]",
            )}
          >
            <Tag className="text-neo-text-muted mx-auto mb-4 size-12" />
            <p className="text-neo-text-muted text-lg">{t("noPosts")}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.slug}
                className={cn(
                  "border-neo-border bg-neo-card group overflow-hidden",
                  "rounded-[var(--radius-neo-xl)] border-[length:var(--border-neo)]",
                  "shadow-[var(--shadow-neo-md)]",
                  "transition-shadow hover:shadow-[var(--shadow-neo-lg)]",
                )}
              >
                {post.attributes.coverUrl && (
                  <div
                    className={cn(
                      "border-neo-border h-48 bg-cover bg-center",
                      "border-b-[length:var(--border-neo)]",
                    )}
                    style={{
                      backgroundImage: `url(${post.attributes.coverUrl})`,
                    }}
                  />
                )}

                <div className="p-6">
                  {post.attributes.tags && post.attributes.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {post.attributes.tags.map((tag) => (
                        <NeoBadge key={tag} variant="secondary" size="sm">
                          {tag}
                        </NeoBadge>
                      ))}
                    </div>
                  )}

                  <h2 className="font-heading text-neo-text mb-2 text-xl font-bold">
                    {post.attributes.title}
                  </h2>

                  <p className="text-neo-text-muted mb-4 line-clamp-2 text-sm">
                    {post.attributes.description}
                  </p>

                  <div className="text-neo-text-muted mb-4 flex items-center gap-2 text-sm">
                    <Calendar className="size-4" />
                    <span>{formatDate(new Date(post.attributes.date))}</span>
                  </div>

                  <NeoButton asChild variant="outline" size="sm">
                    <Link href={`/posts/${post.slug}`} className="gap-2">
                      {t("readMore")}
                      <ArrowRight className="size-4" />
                    </Link>
                  </NeoButton>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
