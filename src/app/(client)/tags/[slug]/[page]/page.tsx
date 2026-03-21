import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { PostPagination } from "@/components/post-pagination";
import { postLoader } from "@/server/post-loader";
import { get } from "lodash";
import dayjs from "dayjs";

const PAGE_SIZE = 12;

type Params = Promise<{ slug: string; page: string }>;

export function generateStaticParams() {
  const posts = postLoader();

  const tagCounts = new Map<string, number>();
  for (const post of posts) {
    if (!Array.isArray(post.metadata.tags)) continue;
    for (const tag of post.metadata.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const params: { slug: string; page: string }[] = [];
  for (const [slug, count] of tagCounts) {
    const totalPages = Math.ceil(count / PAGE_SIZE);
    for (let p = 1; p <= totalPages; p++) {
      params.push({ slug, page: String(p) });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug, page } = await params;
  return {
    title: `#${slug} · 第 ${page} 頁 — Handcraft`,
  };
}

export default async function Page({ params }: { params: Params }) {
  const { slug: slugParam, page: pageParam } = await params;
  const slug = decodeURIComponent(slugParam);
  const currentPage = Math.max(1, parseInt(pageParam, 10) || 1);

  const allPosts = postLoader()
    .filter((p) => {
      return Array.isArray(p.metadata.tags) && p.metadata.tags.includes(slug);
    })
    .sort(
      (a, b) =>
        dayjs(b.metadata.createdAt).valueOf() -
        dayjs(a.metadata.createdAt).valueOf(),
    );

  if (allPosts.length === 0) notFound();

  const totalPages = Math.ceil(allPosts.length / PAGE_SIZE);
  if (currentPage > totalPages) notFound();

  const posts = allPosts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-1">#{slug}</h1>
      <p className="text-sm text-muted-foreground mb-8">
        {allPosts.length} 篇文章
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const meta = post.metadata;
          const coverUrl = get(meta, "coverImage.url");
          const coverAlt = get(meta, "coverImage.alt", meta.title ?? "");
          return (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="group flex flex-col rounded-2xl overflow-hidden border border-border hover:border-foreground/20 transition-colors"
            >
              <div className="aspect-video w-full overflow-hidden bg-muted">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={coverAlt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
              <div className="flex flex-col gap-1.5 p-4">
                {meta.title && (
                  <p className="font-semibold leading-snug line-clamp-2">
                    {meta.title}
                  </p>
                )}
                {meta.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {meta.excerpt}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <PostPagination
        currentPage={currentPage}
        totalPages={totalPages}
        buildHref={(p) => `/tags/${slug}/${p}`}
      />
    </div>
  );
}
