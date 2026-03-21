import Link from "next/link";

interface BlockNav {
  logo?: string;
  logoHref?: string;
  links?: { label: string; href: string }[];
}

interface CtaBlockProps {
  id?: string;
  label?: string;
  count?: number;
  countLabel?: string;
  href: string;
  buttonText: string;
  backgroundImage: string;
  nav?: BlockNav;
}

export function CtaBlock({
  id,
  label = "Start Reading",
  count,
  countLabel,
  href,
  buttonText,
  backgroundImage,
  nav,
}: CtaBlockProps) {
  return (
    <section
      id={id}
      className="h-[calc(100vh-3.5rem)] snap-start shrink-0 relative overflow-hidden flex flex-col items-center justify-center px-6 text-center"
    >
      <img
        src={backgroundImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/70" />

      {/* Navbar */}
      {nav && (
        <nav className="absolute top-0 left-0 right-0 z-20 h-14 flex items-center px-6 sm:px-10 border-b border-white/10">
          <Link
            href={nav.logoHref ?? "/"}
            className="font-semibold text-sm text-white hover:opacity-70 transition-opacity"
          >
            {nav.logo ?? "Handcraft"}
          </Link>
          {nav.links && nav.links.length > 0 && (
            <div className="ml-auto flex items-center gap-8">
              {nav.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[10px] tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </nav>
      )}

      <div className="relative z-10">
        {label && (
          <p className="text-[10px] tracking-[0.35em] uppercase text-white/50 mb-7">
            {label}
          </p>
        )}
        {count !== undefined && (
          <p className="text-8xl sm:text-9xl font-black tracking-tighter text-white leading-none mb-3">
            {count}
          </p>
        )}
        {countLabel && (
          <p className="text-base sm:text-lg text-white/60 mb-14 tracking-wide">
            {countLabel}
          </p>
        )}
        <Link
          href={href}
          className="group inline-flex items-center gap-4 border border-white/50 text-white px-10 py-4 text-xs tracking-[0.25em] uppercase hover:bg-white hover:text-black transition-all duration-300"
        >
          <span>{buttonText}</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1.5">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
