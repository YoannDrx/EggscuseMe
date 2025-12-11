import { Typography } from "@/components/nowts/typography";
import { NeoBadge, NeoButton } from "@/components/neo";
import { ServerMdx } from "@/features/markdown/server-mdx";
import { calculateReadingTime } from "@/features/posts/calculate-reading-time";
import type { PostParams } from "@/features/posts/post-manager";
import { getCurrentPost, getPosts } from "@/features/posts/post-manager";
import { formatDate } from "@/lib/format/date";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
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
  const params = await props.params;
  const post = await getCurrentPost(params.slug);
  const t = await getTranslations("pages.posts");

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
      {/* Hero with Cover Image */}
      <div
        className={cn(
          "relative overflow-hidden",
          "border-neo-border border-b-[length:var(--border-neo-lg)]",
        )}
      >
        {/* Background Image */}
        {post.attributes.coverUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${post.attributes.coverUrl})` }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          </div>
        )}

        {/* Content */}
        <div className="relative mx-auto max-w-4xl px-4 py-16">
          {/* Back Button */}
          <NeoButton asChild variant="outline" className="mb-8 bg-white/10">
            <Link href="/posts">
              <ArrowLeft size={16} /> {t("backToList")}
            </Link>
          </NeoButton>

          {/* Post Header */}
          <div className="flex flex-col gap-4">
            {post.attributes.status === "draft" && (
              <NeoBadge className="w-fit" variant="secondary">
                Draft
              </NeoBadge>
            )}

            {/* Tags */}
            {post.attributes.tags && post.attributes.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.attributes.tags.map((tag) => (
                  <Link key={tag} href={`/posts/categories/${tag}`}>
                    <NeoBadge
                      variant="outline"
                      className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                    >
                      {tag}
                    </NeoBadge>
                  </Link>
                ))}
              </div>
            )}

            <h1
              className={cn(
                "font-heading text-4xl font-bold tracking-tight text-white drop-shadow-lg",
                "md:text-5xl lg:text-6xl",
              )}
            >
              {post.attributes.title}
            </h1>

            {post.attributes.description && (
              <p className="max-w-2xl text-lg text-white/80">
                {post.attributes.description}
              </p>
            )}

            {/* Meta Info */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span>{formatDate(new Date(post.attributes.date))}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-4" />
                <span>{readingTime} min de lecture</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="size-4" />
                <Typography
                  variant="link"
                  as={Link}
                  href={SiteConfig.team.website}
                  className="text-white/90 hover:text-white"
                >
                  {SiteConfig.team.name}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="mx-auto max-w-4xl px-4 py-12">
        <article
          className={cn(
            "border-neo-border bg-neo-card",
            "rounded-[var(--radius-neo-2xl)] border-[length:var(--border-neo)]",
            "p-8 shadow-[var(--shadow-neo-md)]",
            "md:p-12",
          )}
        >
          <ServerMdx
            className="typography lg:prose-lg xl:prose-xl"
            source={post.content}
          />
        </article>

        {/* Back to Blog */}
        <div className="mt-8 flex justify-center">
          <NeoButton asChild variant="outline">
            <Link href="/posts">
              <ArrowLeft size={16} /> {t("backToList")}
            </Link>
          </NeoButton>
        </div>
      </div>
    </div>
  );
}
