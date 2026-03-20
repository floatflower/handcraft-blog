interface StatementBlockProps {
  label?: string;
  /** Main statement text. Use \n for line breaks. */
  statement: string;
  footnote?: string;
  align?: "left" | "center";
  /** "dark" renders an inverted (black bg, white text) section for contrast */
  variant?: "light" | "dark";
}

export function StatementBlock({
  label,
  statement,
  footnote,
  align = "left",
  variant = "light",
}: StatementBlockProps) {
  const isDark = variant === "dark";
  const lines = statement.split("\n");

  return (
    <section
      className={[
        "h-[calc(100vh-3.5rem)] snap-start shrink-0 flex flex-col justify-center px-8 sm:px-16 lg:px-24 relative overflow-hidden",
        align === "center" && "items-center text-center",
        isDark ? "bg-foreground text-background" : "bg-background text-foreground",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Decorative quotation mark */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-end opacity-[0.04] pr-8 pb-4 select-none">
        <span className={`text-[25vw] font-black leading-none ${isDark ? "text-background" : "text-foreground"}`}>
          "
        </span>
      </div>

      {label && (
        <p
          className={[
            "text-xs tracking-[0.3em] uppercase mb-8",
            isDark ? "text-background/40" : "text-muted-foreground",
          ].join(" ")}
        >
          {label}
        </p>
      )}

      <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.95] max-w-4xl">
        {lines.map((line, i, arr) => (
          <span key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </span>
        ))}
      </h2>

      {footnote && (
        <p
          className={[
            "mt-10 text-sm leading-relaxed max-w-sm",
            isDark ? "text-background/50" : "text-muted-foreground",
          ].join(" ")}
        >
          {footnote}
        </p>
      )}
    </section>
  );
}
