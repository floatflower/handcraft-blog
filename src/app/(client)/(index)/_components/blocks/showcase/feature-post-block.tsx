import Link from "next/link";

interface BlockNav {
  logo?: string;
  logoHref?: string;
  links?: { label: string; href: string }[];
}

interface FeaturePostBlockProps {
  id?: string;
  /** Shown in the navbar's right side when nav is present, otherwise top-right of section */
  label?: string;
  title: string;
  excerpt?: string;
  date?: string;
  href: string;
  backgroundImage: string;
  tags?: string[];
  nav?: BlockNav;
}

export function FeaturePostBlock({
  id,
  label = "Featured",
  title,
  excerpt,
  date,
  href,
  backgroundImage,
  tags = [],
  nav,
}: FeaturePostBlockProps) {
  return (
    <section
      id={id}
      className="h-[calc(100vh-3.5rem)] snap-start shrink-0 relative overflow-hidden group"
    >
      {/* Background image */}
      <img
        src={backgroundImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
      />

      {/* Gradient overlay — stronger at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

      {/* Navbar (when present, label moves here) */}
      {nav ? (
        <nav className="absolute top-0 left-0 right-0 z-20 h-14 flex items-center px-6 sm:px-10 border-b border-white/10">
          <Link
            href={nav.logoHref ?? "/"}
            className="font-semibold text-sm text-white hover:opacity-70 transition-opacity"
          >
            {nav.logo ?? "Handcraft"}
          </Link>
          <div className="ml-auto flex items-center gap-8">
            {nav.links?.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[10px] tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
            {label && (
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/30 border-l border-white/20 pl-8">
                {label}
              </span>
            )}
          </div>
        </nav>
      ) : (
        /* Fallback: label at top-right when no nav */
        <div className="absolute top-8 right-8 z-10">
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/50">
            {label}
          </span>
        </div>
      )}

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-8 sm:p-12">
        {tags.length > 0 && (
          <div className="flex gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] tracking-widest uppercase text-white/50 border border-white/20 px-2.5 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white leading-tight max-w-2xl mb-3">
          {title}
        </h2>

        {excerpt && (
          <p className="text-sm text-white/60 max-w-xl leading-relaxed mb-5 line-clamp-2">
            {excerpt}
          </p>
        )}

        <div className="flex items-center gap-6">
          {date && (
            <span className="font-mono text-xs text-white/40">{date}</span>
          )}
          <Link
            href={href}
            className="inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-white border-b border-white/40 pb-0.5 hover:border-white transition-colors duration-300 group/link"
          >
            <span>閱讀文章</span>
            <span className="transition-transform duration-300 group-hover/link:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
