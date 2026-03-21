import Link from "next/link";

interface BlockNav {
  logo?: string;
  logoHref?: string;
  links?: { label: string; href: string }[];
}

interface HeroBlockProps {
  label?: string;
  title: string;
  subtitle?: string;
  backgroundLetter?: string;
  nav?: BlockNav;
}

export function HeroBlock({
  label = "Welcome to",
  title,
  subtitle,
  backgroundLetter,
  nav,
}: HeroBlockProps) {
  return (
    <section className="h-[calc(100vh-3.5rem)] snap-start shrink-0 flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Navbar */}
      {nav && (
        <nav className="absolute top-0 left-0 right-0 z-20 h-14 flex items-center px-6 sm:px-10 bg-white/30 backdrop-blur-sm border-b border-black/5">
          <Link
            href={nav.logoHref ?? "/"}
            className="font-semibold text-sm text-foreground hover:opacity-70 transition-opacity"
          >
            {nav.logo ?? "Handcraft"}
          </Link>
          {nav.links && nav.links.length > 0 && (
            <div className="ml-auto flex items-center gap-8">
              {nav.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </nav>
      )}

      {/* Background decoration */}
      {backgroundLetter && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]">
          <span className="text-[40vw] font-black leading-none select-none">
            {backgroundLetter}
          </span>
        </div>
      )}

      {label && (
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
          {label}
        </p>
      )}
      <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none mb-6">
        {title}
      </h1>
      {subtitle && (
        <p className="text-base sm:text-lg text-muted-foreground max-w-sm">
          {subtitle}
        </p>
      )}

      <div className="absolute bottom-10 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
        <span className="text-[10px] tracking-widest uppercase">scroll</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 2v10M2 7l5 5 5-5"
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
