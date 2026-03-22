import Link from "next/link";
import { get } from "lodash";
import { PostPagination } from "@/components/post-pagination";

interface PostItem {
  slug: string;
  metadata: Record<string, unknown>;
}

interface PostListRowProps {
  tag: string;
  posts: PostItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export function PostListRow({
  tag,
  posts,
  totalCount,
  currentPage,
  totalPages,
}: PostListRowProps) {
  return (
    <div className="py-12">
      <h1 className="text-2xl font-bold mb-1">#{tag}</h1>
      <p className="text-sm text-muted-foreground mb-8">{totalCount} 篇文章</p>

      <div className="flex flex-col divide-y divide-border">
        {posts.map((post) => {
          const meta = post.metadata as any;
          const coverUrl = get(meta, "coverImage.url") as string | undefined;
          const coverAlt = get(
            meta,
            "coverImage.alt",
            meta.title ?? "",
          ) as string;
          const tags = Array.isArray(meta.tags) ? (meta.tags as string[]) : [];
          const date = meta.createdAt
            ? new Date(meta.createdAt as string).toLocaleDateString("zh-TW", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : null;

          return (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="group flex gap-5 py-5 hover:bg-muted/40 transition-colors px-2 -mx-2"
            >
              {/* Thumbnail */}
              <div className="shrink-0 w-28 sm:w-36 aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={coverAlt}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center gap-1.5 min-w-0">
                {/* Tags + date row */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] tracking-[0.15em] uppercase text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                  {date && (
                    <span className="text-[10px] text-muted-foreground/60">
                      {date}
                    </span>
                  )}
                </div>

                {/* Title */}
                {meta.title && (
                  <p className="font-semibold leading-snug line-clamp-2 group-hover:underline underline-offset-2">
                    {meta.title as string}
                  </p>
                )}

                {/* Excerpt */}
                {meta.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2 hidden sm:block">
                    {meta.excerpt as string}
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
        buildHref={(p) => `/tags/${tag}/${p}`}
      />
    </div>
  );
}
