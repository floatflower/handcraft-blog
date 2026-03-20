interface ImageReelBlockProps {
  images: string[];
  label?: string;
  /** Supports \n for line breaks */
  title: string;
  subtitle?: string;
  tickerWordsTop?: string[];
  tickerWordsBottom?: string[];
  /** Duration of the image reel scroll in seconds */
  reelDuration?: number;
}

export function ImageReelBlock({
  images,
  label = "Manifesto",
  title,
  subtitle,
  tickerWordsTop = [],
  tickerWordsBottom = [],
  reelDuration = 48,
}: ImageReelBlockProps) {
  const titleLines = title.split("\n");

  return (
    <section className="h-[calc(100vh-3.5rem)] snap-start shrink-0 flex flex-col overflow-hidden select-none">
      {tickerWordsTop.length > 0 && (
        <div className="shrink-0 overflow-hidden border-b border-border py-3.5">
          <div className="flex gap-10 animate-marquee whitespace-nowrap">
            {[...tickerWordsTop, ...tickerWordsTop].map((w, i) => (
              <span key={i} className="text-2xl sm:text-3xl font-black tracking-tight text-foreground/[0.08]">{w}</span>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 z-10 bg-black/40" />

        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-6 text-center">
          {label && (
            <p className="text-[10px] tracking-[0.35em] uppercase text-white/50 mb-4">{label}</p>
          )}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white leading-none">
            {titleLines.map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </h2>
          {subtitle && (
            <p className="mt-5 text-sm text-white/60 max-w-xs leading-relaxed">{subtitle}</p>
          )}
        </div>

        <div className="h-full overflow-hidden flex items-stretch">
          <div
            className="flex gap-2 h-full"
            style={{ width: "max-content", animation: `marquee-reverse ${reelDuration}s linear infinite` }}
          >
            {[...images, ...images].map((src, i) => (
              <div key={i} className="h-full w-[60vw] sm:w-[30vw] shrink-0">
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {tickerWordsBottom.length > 0 && (
        <div className="shrink-0 overflow-hidden border-t border-border py-3.5">
          <div className="flex gap-10 animate-marquee whitespace-nowrap">
            {[...tickerWordsBottom, ...tickerWordsBottom].map((w, i) => (
              <span key={i} className="text-2xl sm:text-3xl font-black tracking-tight text-foreground/[0.08]">{w}</span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
