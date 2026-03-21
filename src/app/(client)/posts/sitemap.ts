import type { MetadataRoute } from "next";
import { postLoader } from "@/server/post-loader";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const posts = postLoader();

  return posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));
}

export const dynamic = "force-static";
