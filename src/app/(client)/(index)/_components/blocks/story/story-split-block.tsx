"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";

interface StorySplitBlockProps {
  id?: string;
  /** Small caps label above the section number */
  eyebrow?: string;
  /** Large decorative section number, e.g. "01" */
  sectionNumber?: string;
  title: string;
  subtitle?: string;
  body: string;
}

function fadeUp(visible: boolean, delay: number): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
  };
}

export function StorySplitBlock({
  id,
  eyebrow,
  sectionNumber,
  title,
  subtitle,
  body,
}: StorySplitBlockProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      className="h-[calc(100vh-3.5rem)] snap-start shrink-0 grid grid-cols-1 sm:grid-cols-[1fr_2fr] overflow-hidden"
    >
      {/* Left: decorative column */}
      <div
        className="hidden sm:flex flex-col justify-between px-10 py-12 border-r border-border"
        style={fadeUp(visible, 100)}
      >
        <div>
          {eyebrow && (
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
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
          <p
            className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4 sm:hidden"
            style={fadeUp(visible, 0)}
          >
            {eyebrow}
          </p>
        )}
        {subtitle && (
          <p
            className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4 hidden sm:block"
            style={fadeUp(visible, 0)}
          >
            {subtitle}
          </p>
        )}
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-8 max-w-xl"
          style={fadeUp(visible, 100)}
        >
          {title}
        </h2>
        <p
          className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg"
          style={fadeUp(visible, 200)}
        >
          {body}
        </p>
      </div>
    </section>
  );
}
