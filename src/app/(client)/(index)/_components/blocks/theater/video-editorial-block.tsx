import Link from "next/link";

interface VideoEditorialBlockProps {
  id?: string;
  src: string;
  eyebrow?: string;
  title: string;
  body?: string;
  footnote?: string;
  ctaText?: string;
  ctaHref?: string;
  /** Which side the video appears on, default "right" */
  videoSide?: "left" | "right";
  variant?: "light" | "dark";
}

export function VideoEditorialBlock({
  id,
  src,
  eyebrow,
  title,
  body,
  footnote,
  ctaText = "了解更多",
  ctaHref,
  videoSide = "right",
  variant = "light",
}: VideoEditorialBlockProps) {
  const isDark = variant === "dark";
  const videoFirst = videoSide === "left";

  return (
    <section
      id={id}
      className={[
        "h-[calc(100vh-3.5rem)] snap-start shrink-0 grid grid-cols-1 sm:grid-cols-2 overflow-hidden",
        isDark
          ? "bg-foreground text-background"
          : "bg-background text-foreground",
      ].join(" ")}
    >
      {/* Text column */}
      <div
        className={[
          "flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12",
          videoFirst ? "sm:order-2" : "sm:order-1",
        ].join(" ")}
      >
        {eyebrow && (
          <p
            className={[
              "text-[10px] tracking-[0.35em] uppercase mb-6 font-medium",
              isDark ? "text-background/40" : "text-muted-foreground",
            ].join(" ")}
          >
            {eyebrow}
          </p>
        )}

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-6 max-w-sm">
          {title}
        </h2>

        {body && (
          <p
            className={[
              "text-sm leading-relaxed max-w-sm mb-4",
              isDark ? "text-background/60" : "text-muted-foreground",
            ].join(" ")}
          >
            {body}
          </p>
        )}

        {footnote && (
          <p
            className={[
              "text-xs leading-relaxed max-w-xs mb-8",
              isDark ? "text-background/30" : "text-muted-foreground/50",
            ].join(" ")}
          >
            {footnote}
          </p>
        )}

        {ctaHref && (
          <Link
            href={ctaHref}
            className={[
              "group inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase border-b pb-1 w-fit transition-colors duration-300",
              isDark
                ? "border-background/30 hover:border-background text-background"
                : "border-foreground/30 hover:border-foreground",
            ].join(" ")}
          >
            {ctaText}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        )}
      </div>

      {/* Video column */}
      <div
        className={[
          "relative overflow-hidden hidden sm:flex items-center justify-center",
          isDark ? "bg-black" : "bg-black/5",
          videoFirst ? "sm:order-1" : "sm:order-2",
        ].join(" ")}
      >
        {/* Subtle frame lines */}
        <div className="absolute inset-6 border border-white/5 rounded-xl pointer-events-none z-10" />

        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/20 pointer-events-none" />
      </div>
    </section>
  );
}
