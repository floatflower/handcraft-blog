interface VideoSpotlightBlockProps {
  src: string;
  poster?: string;
  /** Full-bleed background image behind the video card */
  backgroundImage: string;
  label?: string;
  caption?: string;
  /** 0–100, default 40 */
  overlayOpacity?: number;
}

export function VideoSpotlightBlock({
  src,
  poster,
  backgroundImage,
  label,
  caption,
  overlayOpacity = 40,
}: VideoSpotlightBlockProps) {
  return (
    <section className="h-[calc(100vh-3.5rem)] snap-start shrink-0 relative overflow-hidden flex flex-col items-center justify-center px-6 sm:px-10">
      {/* Background image */}
      <img
        src={backgroundImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity / 100 }}
      />

      {/* Label */}
      {label && (
        <p className="relative z-10 text-[10px] tracking-[0.35em] uppercase text-white/50 mb-6 font-medium">
          {label}
        </p>
      )}

      {/* Video card */}
      <div className="relative z-10 w-full max-w-3xl">
        <div className="relative overflow-hidden rounded-2xl shadow-[0_32px_80px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
          <video
            src={src}
            poster={poster}
            controls
            playsInline
            className="w-full block"
            style={{ aspectRatio: "16/9" }}
          />
        </div>

        {caption && (
          <p className="mt-4 text-center text-xs text-white/40 tracking-[0.1em]">
            {caption}
          </p>
        )}
      </div>
    </section>
  );
}
