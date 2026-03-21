import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { postLoader } from "@/server/post-loader";
import { PostPagination } from "@/components/post-pagination";
import { get } from "lodash";
import dayjs from "dayjs";

const PAGE_SIZE = 12;

type Params = Promise<{ page: string }>;

export function generateStaticParams() {
  const total = postLoader().length;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  return Array.from({ length: totalPages }, (_, i) => ({
    page: String(i + 1),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { page } = await params;
  return {
    title: `所有文章 · 第 ${page} 頁 — Handcraft`,
  };
}

export default async function Page({ params }: { params: Params }) {
  const { page: pageParam } = await params;
  const currentPage = Math.max(1, parseInt(pageParam, 10) || 1);

  const allPosts = postLoader().sort(
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
      <h1 className="text-2xl font-bold mb-1">所有文章</h1>
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
        buildHref={(p) => `/all-posts/${p}`}
      />
    </div>
  );
}
