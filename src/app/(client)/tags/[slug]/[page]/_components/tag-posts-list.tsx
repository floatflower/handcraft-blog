import Link from "next/link";
import { get } from "lodash";
import { PostPagination } from "@/components/post-pagination";

interface PostItem {
  slug: string;
  metadata: Record<string, unknown>;
}

interface TagPostsListProps {
  tag: string;
  posts: PostItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export function TagPostsList({
  tag,
  posts,
  totalCount,
  currentPage,
  totalPages,
}: TagPostsListProps) {
  return (
    <div className="py-12">
      <h1 className="text-2xl font-bold mb-1">#{tag}</h1>
      <p className="text-sm text-muted-foreground mb-8">{totalCount} 篇文章</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const meta = post.metadata as any;
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
                    src={coverUrl as string}
                    alt={coverAlt as string}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>
              <div className="flex flex-col gap-1.5 p-4">
                {meta.title && (
                  <p className="font-semibold leading-snug line-clamp-2">
                    {meta.title as string}
                  </p>
                )}
                {meta.excerpt && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
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
