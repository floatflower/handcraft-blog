"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import Link from "next/link";

interface BlockNav {
  logo?: string;
  logoHref?: string;
  links?: { label: string; href: string }[];
}

interface SplitHeroBlockProps {
  id?: string;
  nav?: BlockNav;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  tags?: string[];
  /** Which side the image appears on (default: right) */
  imageSide?: "left" | "right";
  variant?: "light" | "dark";
}

function fadeUp(visible: boolean, delay: number): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
  };
}

export function SplitHeroBlock({
  id,
  nav,
  eyebrow,
  title,
  subtitle,
  image,
  imageAlt,
  ctaText = "開始閱讀",
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  tags,
  imageSide = "right",
  variant = "light",
}: SplitHeroBlockProps) {
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
  const imageFirst = imageSide === "left";

  return (
    <section
      ref={sectionRef}
      id={id}
      className={[
        "h-[calc(100vh-3.5rem)] snap-start shrink-0 grid grid-cols-1 sm:grid-cols-2 overflow-hidden relative",
        isDark
          ? "bg-foreground text-background"
          : "bg-background text-foreground",
      ].join(" ")}
    >
      {/* Nav */}
      {nav && (
        <nav
          className={[
            "absolute top-0 left-0 right-0 z-30 h-14 flex items-center px-6 sm:px-10 border-b",
            isDark ? "border-white/10" : "border-black/5",
          ].join(" ")}
        >
          <Link
            href={nav.logoHref ?? "/"}
            className={[
              "font-black text-sm transition-opacity hover:opacity-70",
              isDark ? "text-background" : "text-foreground",
            ].join(" ")}
          >
            {nav.logo ?? "Handcraft"}
          </Link>
          {nav.links && nav.links.length > 0 && (
            <div className="ml-auto flex items-center gap-8">
              {nav.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={[
                    "text-[10px] tracking-[0.2em] uppercase transition-colors",
                    isDark
                      ? "text-background/50 hover:text-background"
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </nav>
      )}

      {/* Text column */}
      <div
        className={[
          "flex flex-col justify-center px-8 sm:px-12 lg:px-16 pt-14 pb-8",
          imageFirst ? "sm:order-2" : "sm:order-1",
        ].join(" ")}
      >
        {eyebrow && (
          <p
            className={[
              "text-[10px] tracking-[0.35em] uppercase mb-6 font-medium",
              isDark ? "text-background/40" : "text-muted-foreground",
            ].join(" ")}
            style={fadeUp(visible, 400)}
          >
            {eyebrow}
          </p>
        )}

        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-6"
          style={fadeUp(visible, 0)}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className={[
              "text-sm leading-relaxed max-w-sm mb-8",
              isDark ? "text-background/60" : "text-muted-foreground",
            ].join(" ")}
            style={fadeUp(visible, 200)}
          >
            {subtitle}
          </p>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div
            className="flex flex-wrap gap-2 mb-8"
            style={fadeUp(visible, 400)}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className={[
                  "text-[9px] tracking-[0.15em] uppercase px-3 py-1 rounded-full border font-medium",
                  isDark
                    ? "border-background/20 text-background/60"
                    : "border-border text-muted-foreground",
                ].join(" ")}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div
          className="flex items-center gap-4 flex-wrap"
          style={fadeUp(visible, 400)}
        >
          {ctaHref && (
            <Link
              href={ctaHref}
              className={[
                "inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase font-bold px-6 py-3 rounded-full transition-opacity hover:opacity-80",
                isDark
                  ? "bg-background text-foreground"
                  : "bg-foreground text-background",
              ].join(" ")}
            >
              {ctaText}
              <span>→</span>
            </Link>
          )}
          {secondaryCtaHref && (
            <Link
              href={secondaryCtaHref}
              className={[
                "group inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase border-b pb-0.5 transition-colors",
                isDark
                  ? "border-background/30 hover:border-background text-background"
                  : "border-foreground/30 hover:border-foreground",
              ].join(" ")}
            >
              {secondaryCtaText}
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          )}
        </div>
      </div>

      {/* Image column */}
      <div
        className={[
          "relative overflow-hidden hidden sm:block group",
          imageFirst ? "sm:order-1" : "sm:order-2",
        ].join(" ")}
        style={fadeUp(visible, 100)}
      >
        <img
          src={image}
          alt={imageAlt ?? ""}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
        />
        <div
          className={[
            "absolute inset-0",
            isDark ? "bg-black/10" : "bg-black/5",
          ].join(" ")}
        />
      </div>
    </section>
  );
}
