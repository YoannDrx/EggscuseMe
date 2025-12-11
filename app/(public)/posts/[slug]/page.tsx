import { NeoBadge, NeoButton } from "@/components/neo";
import { cn } from "@/lib/utils";
import { ServerMdx } from "@/features/markdown/server-mdx";
import { calculateReadingTime } from "@/features/posts/calculate-reading-time";
import type { PostParams } from "@/features/posts/post-manager";
import { getCurrentPost, getPosts } from "@/features/posts/post-manager";
import { formatDate } from "@/lib/format/date";
import { logger } from "@/lib/logger";
import { SiteConfig } from "@/site-config";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata(props: PostParams): Promise<Metadata> {
  const params = await props.params;
  const post = await getCurrentPost(params.slug);

  if (!post) {
    notFound();
  }

  return {
    title: post.attributes.title,
    description: post.attributes.description,
    keywords: post.attributes.keywords,
    authors: {
      name: SiteConfig.team.name,
      url: SiteConfig.team.website,
    },
    openGraph: {
      title: post.attributes.title,
      description: post.attributes.description,
      url: `${SiteConfig.prodUrl}/posts/${params.slug}`,
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return [{ slug: "_placeholder" }];
  }

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage(props: PostParams) {
  const t = await getTranslations("pages.posts");
  const params = await props.params;
  const post = await getCurrentPost(params.slug);

  if (!post) {
    notFound();
  }

  if (
    post.attributes.status === "draft" &&
    process.env.VERCEL_ENV === "production"
  ) {
    logger.warn(`Post "${post.attributes.title}" is a draft`);
    notFound();
  }

  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="bg-neo-bg min-h-screen">
      {/* Hero with cover image */}
      <div
        className={cn(
          "border-neo-border relative overflow-hidden",
          "border-b-[length:var(--border-neo-lg)]",
        )}
      >
        {/* Background image */}
        {post.attributes.coverUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${post.attributes.coverUrl})` }}
          />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Content */}
        <div className="relative mx-auto max-w-4xl px-4 py-16">
          {/* Back button */}
          <NeoButton
            asChild
            variant="ghost"
            size="sm"
            className="mb-8 text-white/80 hover:text-white"
          >
            <Link href="/posts" className="gap-2">
              <ArrowLeft className="size-4" />
              {t("backToList")}
            </Link>
          </NeoButton>

          {/* Draft badge */}
          {post.attributes.status === "draft" && (
            <NeoBadge variant="secondary" className="mb-4">
              Draft
            </NeoBadge>
          )}

          {/* Tags */}
          {post.attributes.tags && post.attributes.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.attributes.tags.map((tag) => (
                <NeoBadge
                  key={tag}
                  variant="outline"
                  className="border-white/30 text-white"
                >
                  {tag}
                </NeoBadge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-heading mb-6 text-3xl font-bold text-white md:text-5xl">
            {post.attributes.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <span>{formatDate(new Date(post.attributes.date))}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-4" />
              <span>{readingTime} min</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="size-4" />
              <Link
                href={SiteConfig.team.website}
                className="hover:text-white hover:underline"
              >
                {SiteConfig.team.name}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Article content */}
      <div className="mx-auto max-w-4xl px-4 py-12">
        <article
          className={cn(
            "border-neo-border bg-neo-card",
            "rounded-[var(--radius-neo-2xl)] border-[length:var(--border-neo)]",
            "p-6 shadow-[var(--shadow-neo-lg)] md:p-10",
          )}
        >
          <ServerMdx source={post.content} useNeoStyle />
        </article>

        {/* Back to blog */}
        <div className="mt-8 text-center">
          <NeoButton asChild variant="outline">
            <Link href="/posts" className="gap-2">
              <ArrowLeft className="size-4" />
              {t("viewAll")}
            </Link>
          </NeoButton>
        </div>
      </div>
    </div>
  );
}
