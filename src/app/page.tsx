import Link from "next/link";
import { get } from "lodash";
import dayjs from "dayjs";
import { postLoader } from "@/server/post-loader";
import { Navbar } from "@/components/navbar";

export default async function Home() {
  const allPosts = postLoader().sort(
    (a, b) => dayjs(b.metadata.createdAt).valueOf() - dayjs(a.metadata.createdAt).valueOf()
  );
  const recentPosts = allPosts.slice(0, 3);

  const tagSet = new Set<string>();
  for (const post of allPosts) {
    if (Array.isArray(post.metadata.tags)) {
      for (const tag of post.metadata.tags as string[]) tagSet.add(tag);
    }
  }
  const tags = Array.from(tagSet);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex-1 overflow-y-scroll snap-y snap-mandatory">

        {/* ── Hero ── */}
        <section className="h-[calc(100vh-3.5rem)] snap-start shrink-0 flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]">
            <span className="text-[40vw] font-black leading-none select-none">H</span>
          </div>

          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
            Welcome to
          </p>
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none mb-6">
            Handcraft
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-sm">
            文字是手工藝，每一篇都是用心雕琢的作品。
          </p>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
            <span className="text-[10px] tracking-widest uppercase">scroll</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </section>

        {/* ── Images ── */}
        <section className="h-[calc(100vh-3.5rem)] snap-start shrink-0 grid grid-cols-1 grid-rows-3 sm:grid-cols-3 sm:grid-rows-1">
          {["/images/home/image-1.jpg", "/images/home/image-2.jpg", "/images/home/image-3.jpg"].map((src, i) => (
            <div key={i} className="relative overflow-hidden group">
              <img
                src={src}
                alt=""
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          ))}
        </section>

        {/* ── Recent Posts ── */}
        {recentPosts.length > 0 && (
          <section className="h-[calc(100vh-3.5rem)] snap-start shrink-0 flex flex-col justify-center px-6 py-10">
            <div className="max-w-4xl mx-auto w-full">
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">Latest</p>
              <div className="flex items-end justify-between mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold">最新文章</h2>
                <Link href={allPosts[0] ? `/posts/${allPosts[0].slug}` : "/"} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  查看全部 →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {recentPosts.map((post) => {
                  const meta = post.metadata;
                  const coverUrl = get(meta, "coverImage.url");
                  return (
                    <Link
                      key={post.slug}
                      href={`/posts/${post.slug}`}
                      className="group flex flex-col rounded-2xl overflow-hidden border border-border hover:border-foreground/30 transition-all duration-300"
                    >
                      <div className="aspect-video overflow-hidden bg-muted">
                        {coverUrl && (
                          <img
                            src={coverUrl}
                            alt={get(meta, "coverImage.alt", "")}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <div className="p-4 flex flex-col gap-1.5">
                        {meta.title && (
                          <p className="font-semibold leading-snug line-clamp-1">{meta.title}</p>
                        )}
                        {meta.excerpt && (
                          <p className="text-xs text-muted-foreground line-clamp-2">{meta.excerpt}</p>
                        )}
                        {meta.createdAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {dayjs(meta.createdAt).format("MMM D, YYYY")}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Tags ── */}
        {tags.length > 0 && (
          <section className="h-[calc(100vh-3.5rem)] snap-start shrink-0 flex flex-col items-center justify-center px-6">
            <div className="max-w-4xl w-full">
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">Browse by</p>
              <h2 className="text-3xl sm:text-4xl font-bold mb-10">標籤</h2>
              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tag}/1`}
                    className="px-5 py-2 rounded-full border border-border text-sm hover:bg-foreground hover:text-background transition-colors duration-200"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
