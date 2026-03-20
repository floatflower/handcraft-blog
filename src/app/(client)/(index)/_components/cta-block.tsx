import Link from "next/link";

interface CtaBlockProps {
  label?: string;
  count?: number;
  countLabel?: string;
  href: string;
  buttonText: string;
  backgroundImage: string;
}

export function CtaBlock({
  label = "Start Reading",
  count,
  countLabel,
  href,
  buttonText,
  backgroundImage,
}: CtaBlockProps) {
  return (
    <section className="h-[calc(100vh-3.5rem)] snap-start shrink-0 relative overflow-hidden flex flex-col items-center justify-center px-6 text-center">
      <img
        src={backgroundImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70" />

      <div className="relative z-10">
        {label && (
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/50 mb-7">{label}</p>
        )}
        {count !== undefined && (
          <p className="text-8xl sm:text-9xl font-black tracking-tighter text-white leading-none mb-3">
            {count}
          </p>
        )}
        {countLabel && (
          <p className="text-base sm:text-lg text-white/60 mb-14 tracking-wide">{countLabel}</p>
        )}
        <Link
          href={href}
          className="group inline-flex items-center gap-4 border border-white/50 text-white px-10 py-4 text-xs tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-all duration-300"
        >
          <span>{buttonText}</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
        </Link>
      </div>
    </section>
  );
}
