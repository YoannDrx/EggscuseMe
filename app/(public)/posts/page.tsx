import { Typography } from "@/components/nowts/typography";
import { NeoBadge, NeoButton } from "@/components/neo";
import { PostCard } from "@/features/posts/post-card";
import { getPosts, getPostsTags } from "@/features/posts/post-manager";
import { SiteConfig } from "@/site-config";
import { cn } from "@/lib/utils";
import { FileQuestion, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("pages.posts.meta");
  return {
    title: t("title"),
    description: t("description"),
    keywords: ["blog", "eggs", "freshness", "recipes"],
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${SiteConfig.prodUrl}/posts`,
      type: "website",
    },
  };
}

export default async function PostsPage() {
  const t = await getTranslations("pages.posts");
  const tags = await getPostsTags();
  const posts = await getPosts();

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
            <BookOpen className="text-neo-accent size-8" />
          </div>
          <h1 className="font-heading text-neo-text text-4xl font-bold tracking-tight md:text-5xl">
            {t("title")}
          </h1>
          <p className="text-neo-text-muted max-w-2xl text-lg">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Categories */}
      {tags.length > 0 && (
        <div className="mx-auto max-w-5xl px-4 py-8">
          <h2 className="text-neo-text-muted mb-4 text-sm font-bold tracking-wider uppercase">
            {t("categories")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={{
                  pathname: `/posts/categories/${tag}`,
                }}
              >
                <NeoBadge
                  variant="outline"
                  className="hover:bg-neo-accent/10 transition-colors"
                >
                  {tag}
                </NeoBadge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Posts Grid */}
      <div className="mx-auto max-w-5xl px-4 pb-16">
        {posts.length === 0 ? (
          <div
            className={cn(
              "border-neo-border bg-neo-card",
              "flex flex-col items-center justify-center gap-4",
              "rounded-[var(--radius-neo-2xl)] border-[length:var(--border-neo)]",
              "p-12 shadow-[var(--shadow-neo-md)]",
            )}
          >
            <div
              className={cn(
                "border-neo-border bg-neo-bg",
                "flex size-16 items-center justify-center",
                "rounded-full border-[length:var(--border-neo)]",
              )}
            >
              <FileQuestion className="text-neo-text-muted size-8" />
            </div>
            <Typography variant="h2" className="text-neo-text">
              {t("noPosts")}
            </Typography>
            <Typography variant="muted" className="text-center">
              {t("noPostsDescription")}
            </Typography>
            <NeoButton asChild variant="outline">
              <Link href="/">{t("viewAll")}</Link>
            </NeoButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
