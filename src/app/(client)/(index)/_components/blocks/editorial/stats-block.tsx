interface StatItem {
  value: string;
  label: string;
  /** Optional supporting note below the label */
  note?: string;
}

interface StatsBlockProps {
  eyebrow?: string;
  title?: string;
  stats: StatItem[];
  variant?: "light" | "dark";
}

export function StatsBlock({
  eyebrow,
  title,
  stats,
  variant = "light",
}: StatsBlockProps) {
  const isDark = variant === "dark";

  return (
    <section
      className={[
        "h-[calc(100vh-3.5rem)] snap-start shrink-0 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 overflow-hidden relative",
        isDark
          ? "bg-foreground text-background"
          : "bg-background text-foreground",
      ].join(" ")}
    >
      {/* Decorative grid lines */}
      <div className="pointer-events-none absolute inset-0 grid grid-cols-4 select-none">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={[
              "border-r",
              isDark ? "border-white/[0.04]" : "border-black/[0.04]",
            ].join(" ")}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col gap-12">
        {(eyebrow || title) && (
          <div>
            {eyebrow && (
              <p
                className={[
                  "text-xs tracking-[0.3em] uppercase mb-3",
                  isDark ? "text-background/40" : "text-muted-foreground",
                ].join(" ")}
              >
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-3xl sm:text-4xl font-black tracking-tighter max-w-lg">
                {title}
              </h2>
            )}
          </div>
        )}

        <dl
          className={[
            "grid gap-0 divide-y sm:divide-y-0 sm:grid-cols-2 lg:grid-cols-4",
            isDark ? "divide-white/10" : "divide-border",
          ].join(" ")}
        >
          {stats.map(({ value, label, note }) => (
            <div
              key={label}
              className={[
                "py-8 sm:py-0 sm:px-10 odd:sm:pl-0 lg:pl-10 first:lg:pl-0 flex flex-col gap-3 sm:border-r last:border-r-0",
                isDark ? "border-white/10" : "border-border",
              ].join(" ")}
            >
              <dt
                className={[
                  "text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-none",
                  isDark ? "text-background" : "text-foreground",
                ].join(" ")}
              >
                {value}
              </dt>
              <div>
                <dd
                  className={[
                    "text-xs tracking-[0.2em] uppercase font-semibold",
                    isDark ? "text-background/60" : "text-muted-foreground",
                  ].join(" ")}
                >
                  {label}
                </dd>
                {note && (
                  <p
                    className={[
                      "mt-1 text-[10px] leading-relaxed",
                      isDark
                        ? "text-background/30"
                        : "text-muted-foreground/50",
                    ].join(" ")}
                  >
                    {note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
