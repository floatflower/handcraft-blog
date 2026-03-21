"use client";

import { useEffect, useState } from "react";

export interface Heading {
  level: number;
  text: string;
  id: string;
}

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0% 0% -80% 0%", threshold: 0 },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="text-xs">
      <p className="font-semibold mb-3 text-foreground">大綱</p>
      <ul className="space-y-1.5">
        {headings.map(({ level, text, id }) => (
          <li key={id} style={{ paddingLeft: `${(level - 1) * 12}px` }}>
            <a
              href={`#${id}`}
              className={`block leading-snug transition-colors ${
                activeId === id
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(id)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
