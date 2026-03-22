"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";

interface StoryCenteredBlockProps {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  body?: string;
  /** Optional full-bleed background image */
  image?: string;
  /** Overlay strength when image is set */
  overlay?: "light" | "dark";
}

function fadeUp(visible: boolean, delay: number): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
  };
}

export function StoryCenteredBlock({
  id,
  eyebrow,
  title,
  subtitle,
  body,
  image,
  overlay = "dark",
}: StoryCenteredBlockProps) {
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

  const isDark = overlay === "dark";
  const hasImage = Boolean(image);

  // Colour tokens depend on whether there's a background image
  const textPrimary = hasImage
    ? isDark
      ? "text-white"
      : "text-black"
    : "text-foreground";
  const textMuted = hasImage
    ? isDark
      ? "text-white/50"
      : "text-black/50"
    : "text-muted-foreground";
  const dividerColor = hasImage
    ? isDark
      ? "bg-white/20"
      : "bg-black/20"
    : "bg-border";

  return (
    <section
      ref={sectionRef}
      id={id}
      className={[
        "h-[calc(100vh-3.5rem)] snap-start shrink-0 relative overflow-hidden",
        "flex flex-col items-center justify-center text-center px-8 sm:px-16 py-12",
        !hasImage && "bg-background",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Background image + overlay */}
      {hasImage && (
        <>
          <img
            src={image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className={[
              "absolute inset-0",
              isDark ? "bg-black/55" : "bg-white/65",
            ].join(" ")}
          />
        </>
      )}

      <div className="relative z-10 flex flex-col items-center max-w-2xl w-full">
        {eyebrow && (
          <p
            className={`text-xs tracking-[0.35em] uppercase mb-8 ${textMuted}`}
            style={fadeUp(visible, 0)}
          >
            {eyebrow}
          </p>
        )}

        {/* Thin top rule */}
        <div
          className={`w-8 h-px mb-8 ${dividerColor}`}
          style={fadeUp(visible, 50)}
        />

        <h2
          className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-tight mb-6 ${textPrimary}`}
          style={fadeUp(visible, 100)}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            className={`text-xs tracking-[0.25em] uppercase mb-8 ${textMuted}`}
            style={fadeUp(visible, 200)}
          >
            {subtitle}
          </p>
        )}

        {/* Thin bottom rule */}
        <div
          className={`w-8 h-px mb-8 ${dividerColor}`}
          style={fadeUp(visible, 250)}
        />

        {body && (
          <p
            className={`text-sm sm:text-base leading-relaxed max-w-lg ${textMuted}`}
            style={fadeUp(visible, 300)}
          >
            {body}
          </p>
        )}
      </div>
    </section>
  );
}
