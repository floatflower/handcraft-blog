"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import Link from "next/link";

interface TagLink {
  label: string;
  href: string;
}

interface CtaTagsBlockProps {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  tags: TagLink[];
  image: string;
  /** Overlay opacity 0–100, default 50 */
  overlayOpacity?: number;
}

function fadeUp(visible: boolean, delay: number): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
  };
}

export function CtaTagsBlock({
  id,
  eyebrow,
  title,
  subtitle,
  tags,
  image,
  overlayOpacity = 50,
}: CtaTagsBlockProps) {
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

  return (
    <section
      ref={sectionRef}
      id={id}
      className="h-[calc(100vh-3.5rem)] snap-start shrink-0 relative overflow-hidden flex flex-col items-center justify-center px-8 sm:px-16 text-center"
    >
      {/* Background image */}
      <img
        src={image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover scale-[1.04]"
      />

      {/* Frosted glass overlay — blurs the image behind content */}
      <div
        className="absolute inset-0 backdrop-blur-md"
        style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity / 100})` }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center max-w-2xl w-full">
        {eyebrow && (
          <p
            className="text-[10px] tracking-[0.4em] uppercase text-white/50 mb-6"
            style={fadeUp(visible, 0)}
          >
            {eyebrow}
          </p>
        )}

        <h2
          className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-tight text-white mb-5"
          style={fadeUp(visible, 100)}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            className="text-sm sm:text-base text-white/60 leading-relaxed mb-10 max-w-lg"
            style={fadeUp(visible, 200)}
          >
            {subtitle}
          </p>
        )}

        {/* Tags */}
        <div
          className="flex flex-wrap justify-center gap-2"
          style={fadeUp(visible, 300)}
        >
          {tags.map((tag) => (
            <Link
              key={tag.href}
              href={tag.href}
              className="group px-4 py-1.5 border border-white/30 text-white/70 text-xs tracking-[0.15em] uppercase hover:border-white hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              {tag.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
