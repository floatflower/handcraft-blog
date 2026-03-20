interface HeroBlockProps {
  label?: string;
  title: string;
  subtitle?: string;
  backgroundLetter?: string;
}

export function HeroBlock({
  label = "Welcome to",
  title,
  subtitle,
  backgroundLetter,
}: HeroBlockProps) {
  return (
    <section className="h-[calc(100vh-3.5rem)] snap-start shrink-0 flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {backgroundLetter && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03]">
          <span className="text-[40vw] font-black leading-none select-none">{backgroundLetter}</span>
        </div>
      )}
      {label && (
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-6">{label}</p>
      )}
      <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none mb-6">
        {title}
      </h1>
      {subtitle && (
        <p className="text-base sm:text-lg text-muted-foreground max-w-sm">{subtitle}</p>
      )}
      <div className="absolute bottom-10 flex flex-col items-center gap-2 text-muted-foreground animate-bounce">
        <span className="text-[10px] tracking-widest uppercase">scroll</span>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 2v10M2 7l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
