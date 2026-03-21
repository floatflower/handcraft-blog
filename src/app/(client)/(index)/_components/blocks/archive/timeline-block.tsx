import Link from "next/link";

export interface TimelineItem {
  date: string;
  title: string;
  href: string;
  tag?: string;
}

interface TimelineBlockProps {
  id?: string;
  label?: string;
  title: string;
  items: TimelineItem[];
  viewAllHref?: string;
  viewAllText?: string;
}

export function TimelineBlock({
  id,
  label,
  title,
  items,
  viewAllHref,
  viewAllText = "查看全部",
}: TimelineBlockProps) {
  return (
    <section
      id={id}
      className="h-[calc(100vh-3.5rem)] snap-start shrink-0 flex flex-col justify-center px-8 sm:px-16 py-12 relative overflow-hidden"
    >
      <div className="max-w-3xl w-full mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            {label && (
              <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">
                {label}
              </p>
            )}
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              {title}
            </h2>
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-6"
            >
              {viewAllText} →
            </Link>
          )}
        </div>

        <div className="flex flex-col">
          {items.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className="group flex items-baseline gap-6 py-4 border-t border-border last:border-b hover:pl-3 transition-all duration-300"
            >
              <span className="font-mono text-xs text-muted-foreground shrink-0 w-24 group-hover:text-foreground transition-colors">
                {item.date}
              </span>
              <span className="flex-1 font-semibold leading-snug group-hover:translate-x-1 transition-transform duration-300">
                {item.title}
              </span>
              {item.tag && (
                <span className="text-[10px] tracking-widest uppercase text-muted-foreground shrink-0 hidden sm:block">
                  {item.tag}
                </span>
              )}
              <span className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
