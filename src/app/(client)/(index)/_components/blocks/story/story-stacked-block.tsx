"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";

interface StoryStackedBlockProps {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  body: string;
  /** Optional thumbnail shown beside the body text */
  image?: string;
  imageAlt?: string;
  variant?: "light" | "dark";
}

function fadeUp(visible: boolean, delay: number): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
  };
}

function fadeIn(visible: boolean, delay: number): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transition: `opacity 1s ease ${delay}ms`,
  };
}

export function StoryStackedBlock({
  id,
  eyebrow,
  title,
  subtitle,
  body,
  image,
  imageAlt = "",
  variant = "light",
}: StoryStackedBlockProps) {
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
        "h-[calc(100vh-3.5rem)] snap-start shrink-0 flex flex-col overflow-hidden",
        "px-8 sm:px-14 lg:px-20 py-12",
        isDark
          ? "bg-foreground text-background"
          : "bg-background text-foreground",
      ].join(" ")}
    >
      {/* Top area: eyebrow + full-width title */}
      <div className="flex-1 flex flex-col justify-center">
        {eyebrow && (
          <p
            className={`text-xs tracking-[0.35em] uppercase mb-6 ${isDark ? "text-background/40" : "text-muted-foreground"}`}
            style={fadeUp(visible, 0)}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] max-w-5xl"
          style={fadeUp(visible, 100)}
        >
          {title}
        </h2>
      </div>

      {/* Divider */}
      <div
        className={`w-full h-px my-8 ${isDark ? "bg-white/10" : "bg-border"}`}
        style={fadeUp(visible, 200)}
      />

      {/* Bottom area: subtitle + body, optionally beside a thumbnail */}
      <div
        className="flex flex-col sm:flex-row sm:items-start gap-8 sm:gap-14"
        style={fadeUp(visible, 300)}
      >
        {/* Text block — offset to the right half */}
        <div className="sm:ml-auto sm:w-1/2 flex flex-col gap-3">
          {subtitle && (
            <p
              className={`text-xs tracking-[0.25em] uppercase ${isDark ? "text-background/40" : "text-muted-foreground"}`}
            >
              {subtitle}
            </p>
          )}
          <p
            className={`text-sm sm:text-base leading-relaxed ${isDark ? "text-background/70" : "text-muted-foreground"}`}
          >
            {body}
          </p>
        </div>

        {/* Optional thumbnail */}
        {image && (
          <div
            className="sm:w-[22%] aspect-[3/4] overflow-hidden shrink-0 sm:order-first"
            style={fadeIn(visible, 400)}
          >
            <img
              src={image}
              alt={imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
