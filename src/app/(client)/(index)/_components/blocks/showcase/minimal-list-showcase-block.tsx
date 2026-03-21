import Link from "next/link";
import { ShowcaseItem } from "./card-grid-showcase-block";

interface MinimalListShowcaseBlockProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  items: ShowcaseItem[];
  viewAllHref?: string;
  viewAllText?: string;
  variant?: "light" | "dark";
}

export function MinimalListShowcaseBlock({
  id,
  eyebrow,
  title,
  items,
  viewAllHref,
  viewAllText = "查看全部",
  variant = "light",
}: MinimalListShowcaseBlockProps) {
  const isDark = variant === "dark";

  return (
    <section
      id={id}
      className={[
        "h-[calc(100vh-3.5rem)] snap-start shrink-0 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 overflow-hidden",
        isDark
          ? "bg-foreground text-background"
          : "bg-background text-foreground",
      ].join(" ")}
    >
      {/* Header */}
      {(eyebrow || title) && (
        <div className="mb-10">
          {eyebrow && (
            <p
              className={[
                "text-[10px] tracking-[0.35em] uppercase mb-3",
                isDark ? "text-background/40" : "text-muted-foreground",
              ].join(" ")}
            >
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter">
              {title}
            </h2>
          )}
        </div>
      )}

      {/* List */}
      <div
        className={[
          "flex flex-col divide-y",
          isDark ? "divide-white/10" : "divide-border",
        ].join(" ")}
      >
        {items.map((item, i) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-center gap-6 py-5 sm:py-6 hover:translate-x-2 transition-transform duration-300"
          >
            {/* Index */}
            <span
              className={[
                "font-mono text-xs shrink-0 w-6 text-right",
                isDark ? "text-background/25" : "text-muted-foreground/40",
              ].join(" ")}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-black tracking-tight text-lg sm:text-xl leading-snug truncate">
                {item.title}
              </h3>
              {item.excerpt && (
                <p
                  className={[
                    "text-xs leading-relaxed line-clamp-1 mt-0.5",
                    isDark ? "text-background/40" : "text-muted-foreground",
                  ].join(" ")}
                >
                  {item.excerpt}
                </p>
              )}
            </div>

            {/* Meta */}
            <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
              {item.tags && item.tags[0] && (
                <span
                  className={[
                    "text-[9px] tracking-[0.15em] uppercase",
                    isDark ? "text-background/35" : "text-muted-foreground/70",
                  ].join(" ")}
                >
                  {item.tags[0]}
                </span>
              )}
              {item.date && (
                <span
                  className={[
                    "font-mono text-[10px]",
                    isDark ? "text-background/25" : "text-muted-foreground/50",
                  ].join(" ")}
                >
                  {item.date}
                </span>
              )}
            </div>

            {/* Arrow */}
            <span className="shrink-0 transition-transform duration-300 group-hover:translate-x-1 text-sm">
              →
            </span>
          </Link>
        ))}
      </div>

      {/* View all */}
      {viewAllHref && (
        <div className="mt-8">
          <Link
            href={viewAllHref}
            className={[
              "group inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase border-b pb-0.5 transition-colors",
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
        </div>
      )}
    </section>
  );
}
