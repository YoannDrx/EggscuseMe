import { getPosts } from "@/features/posts/post-manager";
import { SiteConfig } from "@/site-config";
import type { MetadataRoute } from "next";

const baseUrl = SiteConfig.prodUrl;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: `${baseUrl}/home`,
      lastModified: new Date(),
      changeFrequency: "monthly",
    },
    {
      url: `${baseUrl}/fridge`,
      lastModified: new Date(),
      changeFrequency: "weekly",
    },
    ...posts.map(
      (post) =>
        ({
          url: `${baseUrl}/posts/${post.slug}`,
          lastModified: new Date(post.attributes.date),
          changeFrequency: "monthly",
        }) as const,
    ),
  ];
}
