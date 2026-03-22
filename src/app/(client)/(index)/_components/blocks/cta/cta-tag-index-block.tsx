"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import Link from "next/link";

interface TagItem {
  label: string;
  href: string;
  count?: number;
}

interface CtaTagIndexBlockProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  tags: TagItem[];
  variant?: "light" | "dark";
}

function fadeUp(visible: boolean, delay: number): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  };
}

export function CtaTagIndexBlock({
  id,
  eyebrow,
  title,
  subtitle,
  tags,
  variant = "light",
}: CtaTagIndexBlockProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isDark = variant === "dark";

  return (
    <section
      ref={sectionRef}
      id={id}
      className={[
        "h-[calc(100vh-3.5rem)] snap-start shrink-0 overflow-hidden",
        "grid grid-cols-1 sm:grid-cols-[1fr_2fr]",
        isDark
          ? "bg-foreground text-background"
          : "bg-background text-foreground",
      ].join(" ")}
    >
      {/* Left: header column */}
      <div
        className={[
          "flex flex-col justify-end px-8 sm:px-10 py-12",
          isDark ? "border-r border-white/10" : "border-r border-border",
        ].join(" ")}
        style={fadeUp(visible, 0)}
      >
        {eyebrow && (
          <p
            className={`text-xs tracking-[0.35em] uppercase mb-4 ${isDark ? "text-background/40" : "text-muted-foreground"}`}
          >
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="text-2xl sm:text-3xl font-black tracking-tighter leading-tight mb-4">
            {title}
          </h2>
        )}
        {subtitle && (
          <p
            className={`text-sm leading-relaxed ${isDark ? "text-background/50" : "text-muted-foreground"}`}
          >
            {subtitle}
          </p>
        )}
        <div
          className={`mt-8 h-px w-8 ${isDark ? "bg-white/20" : "bg-border"}`}
        />
      </div>

      {/* Right: tag list */}
      <div className="flex flex-col justify-center overflow-y-auto px-8 sm:px-12 py-12">
        <div
          className={`flex flex-col divide-y ${isDark ? "divide-white/10" : "divide-border"}`}
        >
          {tags.map((tag, i) => (
            <Link
              key={tag.href}
              href={tag.href}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="group flex items-center justify-between py-4 sm:py-5 cursor-pointer"
              style={fadeUp(visible, 80 + i * 50)}
            >
              {/* Tag name */}
              <span
                className={[
                  "text-xl sm:text-2xl md:text-3xl font-black tracking-tighter leading-none transition-all duration-300",
                  hovered !== null && hovered !== i
                    ? isDark
                      ? "opacity-15"
                      : "opacity-10"
                    : "opacity-100",
                ].join(" ")}
              >
                #{tag.label}
              </span>

              {/* Count + arrow */}
              <span className="flex items-center gap-4 shrink-0 ml-6">
                {tag.count !== undefined && (
                  <span
                    className={[
                      "text-xs tabular-nums transition-all duration-300",
                      isDark
                        ? "text-background/30"
                        : "text-muted-foreground/50",
                      hovered === i &&
                        (isDark
                          ? "!text-background/60"
                          : "!text-foreground/50"),
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {tag.count} 篇
                  </span>
                )}
                <span
                  className={[
                    "text-sm transition-transform duration-300 group-hover:translate-x-1.5",
                    isDark ? "text-background/20" : "text-muted-foreground/40",
                  ].join(" ")}
                >
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
