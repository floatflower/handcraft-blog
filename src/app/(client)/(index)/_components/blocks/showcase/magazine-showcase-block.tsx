import Link from "next/link";
import { ShowcaseItem } from "./card-grid-showcase-block";

interface MagazineShowcaseBlockProps {
  id?: string;
  eyebrow?: string;
  /** First item becomes the large left feature; items[1] and items[2] stack on the right */
  items: [ShowcaseItem, ShowcaseItem, ShowcaseItem, ...ShowcaseItem[]];
  variant?: "light" | "dark";
}

export function MagazineShowcaseBlock({
  id,
  eyebrow,
  items,
  variant = "light",
}: MagazineShowcaseBlockProps) {
  const isDark = variant === "dark";
  const [main, ...rest] = items;
  const side = rest.slice(0, 2);

  return (
    <section
      id={id}
      className={[
        "h-[calc(100vh-3.5rem)] snap-start shrink-0 flex flex-col px-6 sm:px-10 py-10 overflow-hidden",
        isDark
          ? "bg-foreground text-background"
          : "bg-background text-foreground",
      ].join(" ")}
    >
      {eyebrow && (
        <p
          className={[
            "text-[10px] tracking-[0.35em] uppercase mb-5 shrink-0",
            isDark ? "text-background/40" : "text-muted-foreground",
          ].join(" ")}
        >
          {eyebrow}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4 flex-1 min-h-0">
        {/* Large feature — left */}
        <Link
          href={main.href}
          className="group relative overflow-hidden rounded-xl flex flex-col justify-end"
        >
          {main.image && (
            <img
              src={main.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="relative z-10 p-6 sm:p-8">
            {main.tags && main.tags.length > 0 && (
              <div className="flex gap-2 mb-3">
                {main.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] tracking-[0.15em] uppercase text-white/60 border border-white/20 px-2.5 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter text-white leading-tight mb-2">
              {main.title}
            </h2>
            {main.excerpt && (
              <p className="text-sm text-white/60 leading-relaxed line-clamp-2 mb-4 max-w-lg">
                {main.excerpt}
              </p>
            )}
            <div className="flex items-center gap-5">
              {main.date && (
                <span className="font-mono text-[10px] text-white/40">
                  {main.date}
                </span>
              )}
              <span className="text-[10px] tracking-[0.2em] uppercase text-white border-b border-white/40 pb-0.5 group-hover:border-white transition-colors">
                閱讀文章 →
              </span>
            </div>
          </div>
        </Link>

        {/* Side items — stacked right */}
        <div className="flex flex-col gap-4 min-h-0">
          {side.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative overflow-hidden rounded-xl flex-1 flex flex-col justify-end"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                />
              )}
              <div
                className={[
                  "absolute inset-0",
                  item.image
                    ? "bg-gradient-to-t from-black/70 via-black/20 to-transparent"
                    : isDark
                      ? "bg-white/5"
                      : "bg-foreground/5",
                ].join(" ")}
              />
              <div className="relative z-10 p-4 sm:p-5">
                {item.tags && item.tags[0] && (
                  <p
                    className={[
                      "text-[9px] tracking-[0.15em] uppercase mb-1.5",
                      item.image
                        ? "text-white/50"
                        : isDark
                          ? "text-background/40"
                          : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {item.tags[0]}
                  </p>
                )}
                <h3
                  className={[
                    "font-black tracking-tight leading-snug text-sm sm:text-base line-clamp-2 mb-1",
                    item.image ? "text-white" : "",
                  ].join(" ")}
                >
                  {item.title}
                </h3>
                {item.date && (
                  <span
                    className={[
                      "font-mono text-[10px]",
                      item.image
                        ? "text-white/40"
                        : isDark
                          ? "text-background/30"
                          : "text-muted-foreground/50",
                    ].join(" ")}
                  >
                    {item.date}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
