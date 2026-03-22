import Link from "next/link";
import { PostPagination } from "@/components/post-pagination";

interface PostItem {
  slug: string;
  metadata: Record<string, unknown>;
}

interface PostListEditorialProps {
  tag: string;
  posts: PostItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export function PostListEditorial({
  tag,
  posts,
  totalCount,
  currentPage,
  totalPages,
}: PostListEditorialProps) {
  const offset = (currentPage - 1) * posts.length;

  return (
    <div className="py-12">
      <h1 className="text-2xl font-bold mb-1">#{tag}</h1>
      <p className="text-sm text-muted-foreground mb-8">{totalCount} 篇文章</p>

      <div className="flex flex-col divide-y divide-border">
        {posts.map((post, i) => {
          const meta = post.metadata as any;
          const tags = Array.isArray(meta.tags) ? (meta.tags as string[]) : [];
          const date = meta.createdAt
            ? new Date(meta.createdAt as string).toLocaleDateString("zh-TW", {
                year: "numeric",
                month: "short",
              })
            : null;
          const index = String(offset + i + 1).padStart(2, "0");

          return (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="group grid grid-cols-[3rem_1fr_auto] sm:grid-cols-[4rem_1fr_auto] items-start gap-4 sm:gap-8 py-6 hover:bg-muted/30 transition-colors px-2 -mx-2"
            >
              {/* Index number */}
              <span className="text-2xl sm:text-3xl font-black tracking-tighter text-foreground/10 leading-none pt-0.5 select-none group-hover:text-foreground/20 transition-colors">
                {index}
              </span>

              {/* Title + excerpt */}
              <div className="flex flex-col gap-1.5 min-w-0">
                {meta.title && (
                  <p className="text-base sm:text-lg font-bold leading-snug line-clamp-2 group-hover:underline underline-offset-2">
                    {meta.title as string}
                  </p>
                )}
                {meta.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {meta.excerpt as string}
                  </p>
                )}
              </div>

              {/* Meta: date + tags */}
              <div className="flex flex-col items-end gap-1.5 shrink-0 pt-0.5">
                {date && (
                  <span className="text-xs text-muted-foreground/60 whitespace-nowrap">
                    {date}
                  </span>
                )}
                {tags.slice(0, 1).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] tracking-[0.12em] uppercase text-muted-foreground border border-border px-1.5 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
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
