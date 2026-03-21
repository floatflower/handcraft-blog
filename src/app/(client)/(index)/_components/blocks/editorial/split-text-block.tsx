import Link from "next/link";

interface SplitTextBlockProps {
  /** Small caps label above the section number */
  eyebrow?: string;
  /** Large decorative section number, e.g. "01" */
  sectionNumber?: string;
  title: string;
  body: string;
  footnote?: string;
  linkHref?: string;
  linkText?: string;
}

export function SplitTextBlock({
  eyebrow,
  sectionNumber,
  title,
  body,
  footnote,
  linkHref,
  linkText = "了解更多",
}: SplitTextBlockProps) {
  return (
    <section className="h-[calc(100vh-3.5rem)] snap-start shrink-0 grid grid-cols-1 sm:grid-cols-[1fr_2fr] overflow-hidden">
      {/* Left: decorative number column */}
      <div className="hidden sm:flex flex-col justify-between px-10 py-12 border-r border-border">
        <div>
          {eyebrow && (
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">
              {eyebrow}
            </p>
          )}
        </div>
        {sectionNumber && (
          <div className="flex-1 flex items-center">
            <span className="text-[12vw] font-black text-foreground/[0.06] leading-none select-none">
              {sectionNumber}
            </span>
          </div>
        )}
        <div className="h-px w-8 bg-border" />
      </div>

      {/* Right: content column */}
      <div className="flex flex-col justify-center px-8 sm:px-14 py-12">
        {eyebrow && (
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4 sm:hidden">
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-8 max-w-xl">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
          {body}
        </p>
        {footnote && (
          <p className="mt-4 text-xs text-muted-foreground/60 max-w-md leading-relaxed">
            {footnote}
          </p>
        )}
        {linkHref && (
          <Link
            href={linkHref}
            className="group inline-flex items-center gap-3 mt-10 text-xs tracking-[0.2em] uppercase border-b border-foreground/30 pb-1 w-fit hover:border-foreground transition-colors duration-300"
          >
            <span>{linkText}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}
