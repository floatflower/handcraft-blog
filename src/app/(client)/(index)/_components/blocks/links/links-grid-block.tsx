"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";

// ─── Minimal inline SVG icons for common platforms ───────────────────────────

const ICONS: Record<string, React.ReactNode> = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  ),
  instagram: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="w-5 h-5"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  line: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  ),
  email: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="w-5 h-5"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 7 10-7" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon fill="white" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  ),
};

function getIcon(platform: string): React.ReactNode {
  return (
    ICONS[platform.toLowerCase()] ?? (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="w-5 h-5"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4m0 4h.01" />
      </svg>
    )
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LinksGridItem {
  platform: string;
  handle?: string;
  description?: string;
  href: string;
  /** Override the auto-detected icon */
  icon?: React.ReactNode;
}

interface LinksGridBlockProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  links: LinksGridItem[];
  variant?: "light" | "dark";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fadeUp(visible: boolean, delay: number): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function LinksGridBlock({
  id,
  eyebrow,
  title,
  subtitle,
  links,
  variant = "light",
}: LinksGridBlockProps) {
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
      {/* Header */}
      <div className="mb-10" style={fadeUp(visible, 0)}>
        {eyebrow && (
          <p
            className={`text-xs tracking-[0.35em] uppercase mb-3 ${isDark ? "text-background/40" : "text-muted-foreground"}`}
          >
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="text-3xl sm:text-4xl font-black tracking-tighter leading-tight">
            {title}
          </h2>
        )}
        {subtitle && (
          <p
            className={`mt-2 text-sm ${isDark ? "text-background/50" : "text-muted-foreground"}`}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {links.map((item, i) => (
          <a
            key={item.href}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={[
              "group flex flex-col gap-3 p-5 border transition-all duration-300",
              isDark
                ? "border-white/10 hover:border-white/30 hover:bg-white/5"
                : "border-border hover:border-foreground/30 hover:bg-foreground/[0.03]",
            ].join(" ")}
            style={fadeUp(visible, 80 + i * 60)}
          >
            {/* Icon */}
            <span
              className={
                isDark
                  ? "text-background/60 group-hover:text-background"
                  : "text-muted-foreground group-hover:text-foreground"
              }
              style={{ transition: "color 0.3s" }}
            >
              {item.icon ?? getIcon(item.platform)}
            </span>

            {/* Platform name */}
            <span className="text-sm font-semibold tracking-tight">
              {item.platform}
            </span>

            {/* Handle */}
            {item.handle && (
              <span
                className={`text-xs truncate ${isDark ? "text-background/40" : "text-muted-foreground"}`}
              >
                {item.handle}
              </span>
            )}

            {/* Description */}
            {item.description && (
              <span
                className={`text-xs leading-relaxed ${isDark ? "text-background/30" : "text-muted-foreground/70"}`}
              >
                {item.description}
              </span>
            )}

            {/* Arrow */}
            <span
              className={`mt-auto text-xs transition-transform duration-300 group-hover:translate-x-1 ${isDark ? "text-background/30" : "text-muted-foreground/50"}`}
            >
              →
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
