"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import Link from "next/link";

interface ManifestoLine {
  text: string;
  /** "normal" = upright, "italic" = slanted emphasis */
  style?: "normal" | "italic";
  /** Indent this line to create rhythmic staggering */
  indent?: boolean;
}

interface ManifestoBlockProps {
  id?: string;
  eyebrow?: string;
  lines: ManifestoLine[];
  linkHref?: string;
  linkText?: string;
  variant?: "light" | "dark";
}

function fadeUp(visible: boolean, delay: number): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
  };
}

export function ManifestoBlock({
  id,
  eyebrow,
  lines,
  linkHref,
  linkText = "了解更多",
  variant = "light",
}: ManifestoBlockProps) {
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

  const isDark = variant === "dark";

  return (
    <section
      ref={sectionRef}
      id={id}
      className={[
        "h-[calc(100vh-3.5rem)] snap-start shrink-0 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 overflow-hidden",
        isDark
          ? "bg-foreground text-background"
          : "bg-background text-foreground",
      ].join(" ")}
    >
      {eyebrow && (
        <p
          className={[
            "text-xs tracking-[0.3em] uppercase mb-10",
            isDark ? "text-background/40" : "text-muted-foreground",
          ].join(" ")}
          style={fadeUp(visible, 400)}
        >
          {eyebrow}
        </p>
      )}

      <div
        className={[
          "flex flex-col divide-y",
          isDark ? "divide-white/10" : "divide-border",
        ].join(" ")}
      >
        {lines.map(({ text, style = "normal", indent = false }, i) => (
          <p
            key={i}
            className={[
              "py-4 sm:py-5 text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter leading-tight transition-opacity duration-300 hover:opacity-60 cursor-default",
              style === "italic" && "italic",
              indent && "sm:pl-24",
            ]
              .filter(Boolean)
              .join(" ")}
            style={fadeUp(visible, i * 100)}
          >
            {text}
          </p>
        ))}
      </div>

      {linkHref && (
        <Link
          href={linkHref}
          className={[
            "group inline-flex items-center gap-3 mt-12 text-xs tracking-[0.2em] uppercase border-b pb-1 w-fit transition-colors duration-300",
            isDark
              ? "border-background/30 hover:border-background text-background"
              : "border-foreground/30 hover:border-foreground text-foreground",
          ].join(" ")}
          style={fadeUp(visible, Math.min(lines.length * 100 + 100, 600))}
        >
          <span>{linkText}</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      )}
    </section>
  );
}
