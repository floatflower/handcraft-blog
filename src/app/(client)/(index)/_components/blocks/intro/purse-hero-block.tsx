"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";
import Link from "next/link";

interface BlockNav {
  logo?: string;
  logoHref?: string;
  links?: { label: string; href: string }[];
}

interface PurseHeroBlockProps {
  id?: string;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  ctaText?: string;
  ctaHref?: string;
  tags?: string[];
  nav?: BlockNav;
}

function fadeUp(visible: boolean, delay: number): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`,
  };
}

export function PurseHeroBlock({
  id,
  title,
  subtitle,
  eyebrow,
  ctaText,
  ctaHref,
  tags,
  nav,
}: PurseHeroBlockProps) {
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
      className="snap-start shrink-0 relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        height: "100dvh",
        background:
          "linear-gradient(160deg, #f5ede4 0%, #edddd0 40%, #e8cfc0 100%)",
      }}
    >
      {nav && (
        <nav className="absolute top-0 left-0 right-0 z-20 h-14 flex items-center px-6 sm:px-10">
          <Link
            href={nav.logoHref ?? "/"}
            className="font-bold text-lg hover:opacity-70 transition-opacity"
            style={{
              color: "white",
              textShadow: "0 1px 8px rgba(80,40,10,0.25)",
            }}
          >
            {nav.logo ?? "Handcraft"}
          </Link>
          {nav.links && nav.links.length > 0 && (
            <div className="ml-auto flex items-center gap-8">
              {nav.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm font-semibold tracking-[0.15em] uppercase hover:opacity-100 transition-opacity"
                  style={{
                    color: "white",
                    textShadow: "0 1px 8px rgba(80,40,10,0.25)",
                  }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </nav>
      )}

      <style>{`
        @keyframes purse-swing {
          0%   { transform: rotate(0deg); }
          8%   { transform: rotate(-6deg); }
          24%  { transform: rotate(5deg); }
          42%  { transform: rotate(-3.5deg); }
          58%  { transform: rotate(2.5deg); }
          72%  { transform: rotate(-1.5deg); }
          84%  { transform: rotate(0.8deg); }
          93%  { transform: rotate(-0.3deg); }
          100% { transform: rotate(0deg); }
        }
        .purse-swing {
          animation: purse-swing 4s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards;
          transform-origin: top center;
        }
      `}</style>

      {/* Purse image anchored at top */}
      <div
        className="absolute top-0 left-1/2 pointer-events-none"
        style={{
          transform: "translateX(-50%)",
          width: "clamp(320px, 70vw, 600px)",
          height: "85dvh",
        }}
      >
        <div
          className={visible ? "purse-swing" : ""}
          style={{
            transformOrigin: "top center",
            width: "100%",
            height: "100%",
          }}
        >
          <img
            src="/images/home/purse.png"
            alt="Purse"
            className="w-full h-full object-contain object-top"
          />
        </div>
      </div>

      {/* Text and content */}
      <div className="relative z-10 text-center px-6 flex flex-col items-center gap-3 w-full max-w-xl">
        {eyebrow && (
          <p
            className="text-[10px] tracking-[0.35em] uppercase"
            style={{ ...fadeUp(visible, 800), color: "#f5ede4cc" }}
          >
            {eyebrow}
          </p>
        )}

        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-none"
          style={{
            ...fadeUp(visible, 0),
            color: "white",
            textShadow:
              "0 2px 24px rgba(80,40,10,0.18), 0 1px 4px rgba(80,40,10,0.12)",
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className="text-xl font-semibold max-w-lg leading-relaxed"
            style={{
              ...fadeUp(visible, 450),
              color: "white",
              textShadow: "0 1px 12px rgba(80,40,10,0.15)",
            }}
          >
            {subtitle}
          </p>
        )}

        {tags && tags.length > 0 && (
          <div
            className="flex flex-wrap justify-center gap-2 mt-1"
            style={fadeUp(visible, 850)}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] tracking-[0.2em] uppercase font-semibold px-3 py-1"
                style={{ background: "#fff", color: "#12121255" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {ctaText && ctaHref && (
          <div style={fadeUp(visible, 1050)} className="mt-6">
            <a
              href={ctaHref}
              className="inline-block text-[10px] tracking-[0.25em] uppercase font-semibold px-8 py-3 transition-colors duration-300"
              style={{ background: "#fff", color: "#12121255" }}
            >
              {ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
