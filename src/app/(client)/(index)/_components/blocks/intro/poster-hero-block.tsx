"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface BlockNav {
  logo?: string;
  logoHref?: string;
  links?: { label: string; href: string }[];
}

interface PosterHeroBlockProps {
  nav?: BlockNav;
  eyebrow?: string;
  title: string;
  /** Central subject image (works best with a transparent PNG or a photo on solid bg) */
  image: string;
  imageAlt?: string;
  ctaText?: string;
  ctaHref?: string;
  socialProof?: { count: string; text: string };
  tags?: string[];
  /** CSS color for the background fill, e.g. "#C8F135" */
  accentColor?: string;
  /** CSS color for all text and UI elements, e.g. "#000000" */
  inkColor?: string;
}

function fadeUp(visible: boolean, delay: number): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
  };
}

export function PosterHeroBlock({
  nav,
  eyebrow,
  title,
  image,
  imageAlt,
  ctaText = "開始閱讀",
  ctaHref = "/posts",
  socialProof,
  tags,
  accentColor = "#EDE8E0",
  inkColor = "#1C1208",
}: PosterHeroBlockProps) {
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

  const titleStyle: React.CSSProperties = {
    fontSize: "clamp(4.5rem, 17vw, 20rem)",
    color: "#ffffff",
  };
  const titleClass =
    "font-black tracking-tighter leading-[0.82] whitespace-nowrap";
  return (
    <section
      ref={sectionRef}
      className="h-[90vh] md:h-[80vh] lg:h-[calc(100vh-3.5rem)] snap-start shrink-0 relative overflow-hidden"
      style={{ backgroundColor: accentColor }}
    >
      {/* Nav */}
      {nav && (
        <nav className="absolute top-0 left-0 right-0 z-30 h-14 flex items-center px-6 sm:px-10 gap-6">
          <Link
            href={nav.logoHref ?? "/"}
            className="font-black text-sm shrink-0"
            style={{ color: inkColor }}
          >
            {nav.logo ?? "Handcraft"}
          </Link>

          {nav.links && nav.links.length > 0 && (
            <div className="hidden sm:flex items-center gap-6 ml-2">
              {nav.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-[10px] tracking-[0.2em] uppercase font-medium transition-opacity hover:opacity-60"
                  style={{ color: inkColor }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}

          {ctaHref && (
            <Link
              href={ctaHref}
              className="ml-auto shrink-0 text-[10px] tracking-[0.15em] uppercase px-5 py-2 rounded-full font-bold transition-opacity hover:opacity-80"
              style={{ backgroundColor: inkColor, color: accentColor }}
            >
              {ctaText}
            </Link>
          )}
        </nav>
      )}

      {/* Eyebrow — top left */}
      {eyebrow && (
        <p
          className="absolute top-20 left-6 sm:left-10 z-20 text-xs tracking-[0.2em] uppercase font-semibold max-w-[180px] leading-loose"
          style={{
            color: inkColor,
            ...fadeUp(visible, 250),
            opacity: visible ? 0.6 : 0,
          }}
        >
          {eyebrow}
        </p>
      )}

      {/* Social proof — top right */}
      {socialProof && (
        <div
          className="absolute top-20 right-6 sm:right-10 z-20 flex flex-col items-end gap-0.5"
          style={fadeUp(visible, 450)}
        >
          <p
            className="text-sm tracking-[0.1em] uppercase font-black"
            style={{ color: inkColor }}
          >
            {socialProof.count}
          </p>
          <p
            className="text-[10px] tracking-[0.1em] uppercase"
            style={{ color: inkColor, opacity: 0.45 }}
          >
            {socialProof.text}
          </p>
        </div>
      )}

      {/* Title — centered, in front of image */}
      <div className="absolute inset-0 z-20 flex items-center justify-center leading-none select-none px-4">
        <h1
          className={titleClass}
          style={{ ...titleStyle, ...fadeUp(visible, 0) }}
        >
          {title}
        </h1>
      </div>

      {/* Central subject image — person cutout, 80% block height */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center items-end pointer-events-none">
        <img
          src={image}
          alt={imageAlt ?? ""}
          className="h-[90vh] md:h-[90vh] lg:h-[80%] lg:max-h-screen w-auto object-contain object-bottom scale-[1.4] sm:scale-[1] origin-bottom md:scale-100"
        />
      </div>

      {/* Tags — bottom right */}
      {tags && tags.length > 0 && (
        <div
          className="absolute bottom-6 right-6 sm:right-10 z-20 flex flex-wrap justify-end gap-1.5 max-w-[38%]"
          style={fadeUp(visible, 450)}
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] tracking-[0.15em] uppercase px-3 py-1 rounded-full border font-semibold"
              style={{ borderColor: `${inkColor}50`, color: inkColor }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Arrow decoration — bottom left */}
      <div
        className="absolute bottom-6 left-6 sm:left-10 z-20"
        style={{
          color: inkColor,
          opacity: visible ? 0.4 : 0,
          ...fadeUp(visible, 450),
        }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path
            d="M5 5h18v18M5 23L23 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
