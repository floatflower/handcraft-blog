"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import Link from "next/link";

interface ActionLink {
  label: string;
  href: string;
}

interface CtaFullTextBlockProps {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions: ActionLink[];
  variant?: "light" | "dark";
}

function fadeUp(visible: boolean, delay: number): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
  };
}

export function CtaFullTextBlock({
  id,
  eyebrow,
  title,
  subtitle,
  actions,
  variant = "dark",
}: CtaFullTextBlockProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
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
        "h-[calc(100vh-3.5rem)] snap-start shrink-0 flex flex-col justify-center",
        "px-8 sm:px-14 lg:px-20 py-12 overflow-hidden",
        isDark
          ? "bg-foreground text-background"
          : "bg-background text-foreground",
      ].join(" ")}
    >
      {eyebrow && (
        <p
          className={`text-xs tracking-[0.35em] uppercase mb-8 ${isDark ? "text-background/40" : "text-muted-foreground"}`}
          style={fadeUp(visible, 0)}
        >
          {eyebrow}
        </p>
      )}

      {/* Full-width large title */}
      <h2
        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-10"
        style={fadeUp(visible, 100)}
      >
        {title}
      </h2>

      {/* Divider */}
      <div
        className={`w-full h-px mb-10 ${isDark ? "bg-white/15" : "bg-border"}`}
        style={fadeUp(visible, 200)}
      />

      {/* Bottom row: subtitle left, actions right */}
      <div
        className="flex flex-col sm:flex-row sm:items-end gap-8"
        style={fadeUp(visible, 300)}
      >
        {subtitle && (
          <p
            className={`text-sm sm:text-base leading-relaxed max-w-sm ${isDark ? "text-background/50" : "text-muted-foreground"}`}
          >
            {subtitle}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 sm:ml-auto">
          {actions.map((action, i) => (
            <Link
              key={action.href}
              href={action.href}
              className={[
                "group inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase transition-all duration-300",
                i === 0
                  ? isDark
                    ? "border border-background/50 text-background px-8 py-3.5 hover:bg-background hover:text-foreground"
                    : "border border-foreground/50 text-foreground px-8 py-3.5 hover:bg-foreground hover:text-background"
                  : isDark
                    ? "text-background/50 hover:text-background border-b border-transparent hover:border-background/50 pb-0.5"
                    : "text-muted-foreground hover:text-foreground border-b border-transparent hover:border-foreground/30 pb-0.5",
              ].join(" ")}
            >
              <span>{action.label}</span>
              {i === 0 && (
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
