import Link from "next/link";

interface VideoHeroBlockProps {
  src: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref: string;
  /** 0–100, default 55 */
  overlayOpacity?: number;
}

export function VideoHeroBlock({
  src,
  eyebrow,
  title,
  subtitle,
  ctaText = "了解更多",
  ctaHref,
  overlayOpacity = 55,
}: VideoHeroBlockProps) {
  return (
    <section className="h-[calc(100vh-3.5rem)] snap-start shrink-0 relative overflow-hidden flex flex-col items-center justify-center text-center px-6">
      {/* Background video */}
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity / 100 }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl">
        {eyebrow && (
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/50 font-medium">
            {eyebrow}
          </p>
        )}

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[1.05] text-white whitespace-pre-line">
          {title}
        </h1>

        {subtitle && (
          <p className="text-sm sm:text-base text-white/60 leading-relaxed max-w-md">
            {subtitle}
          </p>
        )}

        <Link
          href={ctaHref}
          className="mt-2 inline-flex items-center gap-3 px-8 py-3.5 bg-white text-black text-xs tracking-[0.2em] uppercase font-bold rounded-full hover:bg-white/90 transition-colors duration-300"
        >
          {ctaText}
          <span>→</span>
        </Link>
      </div>

      {/* Corner scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30 animate-bounce">
        <span className="text-[9px] tracking-widest uppercase">scroll</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M6 2v8M2 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
