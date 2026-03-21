import Link from "next/link";

export interface ShowcaseItem {
  title: string;
  excerpt?: string;
  date?: string;
  href: string;
  image?: string;
  tags?: string[];
}

interface CardGridShowcaseBlockProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  items: ShowcaseItem[];
  viewAllHref?: string;
  viewAllText?: string;
  variant?: "light" | "dark";
}

export function CardGridShowcaseBlock({
  id,
  eyebrow,
  title,
  items,
  viewAllHref,
  viewAllText = "查看全部",
  variant = "light",
}: CardGridShowcaseBlockProps) {
  const isDark = variant === "dark";

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
      {/* Header */}
      <div className="flex items-end justify-between mb-6 shrink-0">
        <div>
          {eyebrow && (
            <p
              className={[
                "text-[10px] tracking-[0.35em] uppercase mb-2",
                isDark ? "text-background/40" : "text-muted-foreground",
              ].join(" ")}
            >
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-2xl sm:text-3xl font-black tracking-tighter">
              {title}
            </h2>
          )}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className={[
              "group hidden sm:inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase border-b pb-0.5 transition-colors",
              isDark
                ? "border-background/30 hover:border-background text-background"
                : "border-foreground/30 hover:border-foreground",
            ].join(" ")}
          >
            {viewAllText}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        {items.slice(0, 3).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "group relative flex flex-col overflow-hidden rounded-xl border transition-shadow duration-300 hover:shadow-lg",
              isDark
                ? "border-white/10 bg-white/5"
                : "border-border bg-muted/30",
            ].join(" ")}
          >
            {item.image && (
              <div className="relative overflow-hidden aspect-[16/9] shrink-0">
                <img
                  src={item.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex flex-col flex-1 p-5">
              {item.tags && item.tags.length > 0 && (
                <div className="flex gap-1.5 mb-3 flex-wrap">
                  {item.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className={[
                        "text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-full",
                        isDark
                          ? "bg-white/10 text-background/60"
                          : "bg-foreground/5 text-muted-foreground",
                      ].join(" ")}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <h3 className="font-black tracking-tight leading-snug text-base sm:text-lg line-clamp-2 mb-2 flex-1">
                {item.title}
              </h3>
              {item.excerpt && (
                <p
                  className={[
                    "text-xs leading-relaxed line-clamp-2 mb-3",
                    isDark ? "text-background/50" : "text-muted-foreground",
                  ].join(" ")}
                >
                  {item.excerpt}
                </p>
              )}
              <div className="flex items-center justify-between mt-auto">
                {item.date && (
                  <span
                    className={[
                      "font-mono text-[10px]",
                      isDark
                        ? "text-background/30"
                        : "text-muted-foreground/60",
                    ].join(" ")}
                  >
                    {item.date}
                  </span>
                )}
                <span className="text-[10px] tracking-[0.1em] uppercase ml-auto transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
