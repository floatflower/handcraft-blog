interface PullQuoteBlockProps {
  quote: string;
  author?: string;
  role?: string;
  /** Full-bleed background image */
  image?: string;
  /** "dark" = dark overlay (default), "light" = light overlay */
  overlay?: "dark" | "light";
  align?: "left" | "center";
}

export function PullQuoteBlock({
  quote,
  author,
  role,
  image,
  overlay = "dark",
  align = "center",
}: PullQuoteBlockProps) {
  const isDark = overlay === "dark";

  return (
    <section
      className={[
        "h-[calc(100vh-3.5rem)] snap-start shrink-0 relative overflow-hidden flex flex-col justify-center px-8 sm:px-16 lg:px-28",
        align === "center" && "items-center text-center",
        !image &&
          (isDark
            ? "bg-foreground text-background"
            : "bg-background text-foreground"),
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {image && (
        <>
          <img
            src={image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className={[
              "absolute inset-0",
              isDark ? "bg-black/60" : "bg-white/70",
            ].join(" ")}
          />
        </>
      )}

      <div className="relative z-10 max-w-4xl">
        {/* Decorative open-quote */}
        <span
          className={[
            "block font-black leading-none select-none mb-2",
            "text-[6rem] sm:text-[8rem]",
            image
              ? isDark
                ? "text-white/20"
                : "text-black/15"
              : isDark
                ? "text-background/15"
                : "text-foreground/10",
          ].join(" ")}
        >
          "
        </span>

        <blockquote
          className={[
            "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter leading-tight",
            image
              ? isDark
                ? "text-white"
                : "text-black"
              : isDark
                ? "text-background"
                : "text-foreground",
          ].join(" ")}
        >
          {quote}
        </blockquote>

        {(author || role) && (
          <div className="mt-10 flex flex-col gap-0.5">
            {author && (
              <p
                className={[
                  "text-xs tracking-[0.3em] uppercase font-semibold",
                  image
                    ? isDark
                      ? "text-white/70"
                      : "text-black/60"
                    : isDark
                      ? "text-background/60"
                      : "text-muted-foreground",
                ].join(" ")}
              >
                — {author}
              </p>
            )}
            {role && (
              <p
                className={[
                  "text-[10px] tracking-[0.2em] uppercase",
                  image
                    ? isDark
                      ? "text-white/40"
                      : "text-black/40"
                    : isDark
                      ? "text-background/40"
                      : "text-muted-foreground/60",
                ].join(" ")}
              >
                {role}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
