"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import Link from "next/link";

interface BlockNav {
  logo?: string;
  logoHref?: string;
  links?: { label: string; href: string }[];
}

interface FullbleedHeroBlockProps {
  id?: string;
  nav?: BlockNav;
  eyebrow?: string;
  title: string;
  /** Shown as a small floating card in the top-right corner */
  metaLabel?: string;
  metaValue?: string;
  ctaText?: string;
  ctaHref?: string;
  image: string;
  imageAlt?: string;
  /** Overlay darkness: 0–100, default 50 */
  overlayOpacity?: number;
}

function fadeUp(visible: boolean, delay: number): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
  };
}

export function FullbleedHeroBlock({
  id,
  nav,
  eyebrow,
  title,
  metaLabel,
  metaValue,
  ctaText = "開始閱讀",
  ctaHref,
  image,
  imageAlt,
  overlayOpacity = 50,
}: FullbleedHeroBlockProps) {
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
      className="h-[calc(100vh-3.5rem)] snap-start shrink-0 relative overflow-hidden text-white"
    >
      {/* Background image */}
      <img
        src={image}
        alt={imageAlt ?? ""}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity / 100 }}
      />

      {/* Nav */}
      {nav && (
        <nav className="absolute top-0 left-0 right-0 z-20 h-14 flex items-center px-6 sm:px-10 border-b border-white/10">
          <Link
            href={nav.logoHref ?? "/"}
            className="font-black text-sm text-white hover:opacity-70 transition-opacity"
          >
            {nav.logo ?? "Handcraft"}
          </Link>
          {nav.links && nav.links.length > 0 && (
            <div className="ml-auto flex items-center gap-8">
              {nav.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[10px] tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </nav>
      )}

      {/* Meta card — top right */}
      {(metaLabel || metaValue) && (
        <div
          className="absolute top-20 right-6 sm:right-10 z-20 border border-white/20 rounded-xl px-4 py-3 backdrop-blur-sm bg-white/5 flex flex-col gap-0.5"
          style={fadeUp(visible, 400)}
        >
          {metaValue && (
            <p className="text-xl font-black tracking-tighter leading-none text-white">
              {metaValue}
            </p>
          )}
          {metaLabel && (
            <p className="text-[9px] tracking-[0.2em] uppercase text-white/50">
              {metaLabel}
            </p>
          )}
        </div>
      )}

      {/* Eyebrow + title + CTA — grouped bottom-left */}
      <div className="absolute bottom-6 left-6 sm:left-10 right-6 sm:right-10 z-20 flex flex-col gap-4">
        {eyebrow && (
          <p
            className="text-[10px] tracking-[0.35em] uppercase text-white/50 font-medium"
            style={fadeUp(visible, 200)}
          >
            {eyebrow}
          </p>
        )}

        <h1
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[1.05] text-white whitespace-pre-line"
          style={fadeUp(visible, 0)}
        >
          {title}
        </h1>

        <div
          className="flex items-center justify-between"
          style={fadeUp(visible, 400)}
        >
          {ctaHref ? (
            <Link
              href={ctaHref}
              className="group inline-flex items-center gap-3 text-xs tracking-[0.2em] uppercase text-white border-b border-white/30 pb-1 hover:border-white transition-colors"
            >
              {ctaText}
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          ) : (
            <div />
          )}

          <div className="flex flex-col items-center gap-1 text-white/40 animate-bounce">
            <span className="text-[9px] tracking-widest uppercase">scroll</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 2v8M2 6l4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
