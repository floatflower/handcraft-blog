"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type React from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type CharacterColorScheme =
  | "red-black"
  | "yellow-black"
  | "teal-black"
  | "red-gray"
  | "yellow-gray"
  | "teal-gray";

export interface AbilityStat {
  label: string;
  /** 0–100 */
  value: number;
}

interface CharacterShowcaseBlockProps {
  id?: string;
  colorScheme?: CharacterColorScheme;
  characterName: string;
  codeName?: string;
  subtitle?: string;
  characterImage: string;
  characterImageAlt?: string;
  statLines?: string[];
  /** Hexagonal radar-chart abilities — 6 items recommended */
  abilities?: AbilityStat[];
  /** Up to 4 images for the bottom-right gallery thumbnails */
  galleryImages?: string[];
}

// ── Theme definitions ─────────────────────────────────────────────────────────

interface Theme {
  accent: string;
  bg: string;
  text: string;
  muted: string;
  gridLine: string;
  crossColor: string;
  isDark: boolean;
}

const THEMES: Record<CharacterColorScheme, Theme> = {
  "red-black": {
    accent: "#E8212A",
    bg: "#0d0d0d",
    text: "#e8e8e8",
    muted: "rgba(232,232,232,0.5)",
    gridLine: "rgba(255,255,255,0.028)",
    crossColor: "rgba(255,255,255,0.35)",
    isDark: true,
  },
  "yellow-black": {
    accent: "#F0C030",
    bg: "#0d0d0d",
    text: "#e8e8e8",
    muted: "rgba(232,232,232,0.5)",
    gridLine: "rgba(255,255,255,0.028)",
    crossColor: "rgba(255,255,255,0.35)",
    isDark: true,
  },
  "teal-black": {
    accent: "#00B4A0",
    bg: "#0d0d0d",
    text: "#e8e8e8",
    muted: "rgba(232,232,232,0.5)",
    gridLine: "rgba(255,255,255,0.028)",
    crossColor: "rgba(255,255,255,0.35)",
    isDark: true,
  },
  "red-gray": {
    accent: "#E8212A",
    bg: "#EFECE8",
    text: "#1a1a1a",
    muted: "rgba(26,26,26,0.5)",
    gridLine: "rgba(0,0,0,0.055)",
    crossColor: "rgba(0,0,0,0.22)",
    isDark: false,
  },
  "yellow-gray": {
    accent: "#C49A00",
    bg: "#EFECE8",
    text: "#1a1a1a",
    muted: "rgba(26,26,26,0.5)",
    gridLine: "rgba(0,0,0,0.055)",
    crossColor: "rgba(0,0,0,0.22)",
    isDark: false,
  },
  "teal-gray": {
    accent: "#007A6A",
    bg: "#EFECE8",
    text: "#1a1a1a",
    muted: "rgba(26,26,26,0.5)",
    gridLine: "rgba(0,0,0,0.055)",
    crossColor: "rgba(0,0,0,0.22)",
    isDark: false,
  },
};

// ── Animation helpers ─────────────────────────────────────────────────────────

function fadeIn(visible: boolean, delay: number): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transition: `opacity 0.7s ease ${delay}ms`,
  };
}

function slideUp(visible: boolean, delay: number): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  };
}

function slideLeft(visible: boolean, delay: number): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateX(0)" : "translateX(-20px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  };
}

// ── Hexagonal radar chart ─────────────────────────────────────────────────────

function RadarChart({
  abilities,
  accent,
  muted,
  isDark,
  visible,
}: {
  abilities: AbilityStat[];
  accent: string;
  muted: string;
  isDark: boolean;
  visible: boolean;
}) {
  const cx = 100;
  const cy = 100;
  const maxR = 68;
  const levels = 4;
  const n = abilities.length;

  function polar(angleDeg: number, r: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function hexPath(r: number) {
    const pts = Array.from({ length: n }, (_, i) => polar((360 / n) * i, r));
    return (
      pts
        .map(
          (p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`,
        )
        .join(" ") + " Z"
    );
  }

  const dataPoints = abilities.map((a, i) =>
    polar((360 / n) * i, (Math.min(a.value, 100) / 100) * maxR),
  );
  const dataPath =
    dataPoints
      .map(
        (p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`,
      )
      .join(" ") + " Z";

  const gridStroke = "rgba(160,160,160,0.3)";
  const axisStroke = "rgba(160,160,160,0.2)";

  return (
    <div style={slideLeft(visible, 400)}>
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        style={{ overflow: "visible", display: "block" }}
      >
        {/* Hexagon background fill */}
        <path d={hexPath(maxR)} fill="rgba(160,160,160,0.18)" />

        {/* Grid hexagons */}
        {Array.from({ length: levels }, (_, l) => (
          <path
            key={l}
            d={hexPath(maxR * ((l + 1) / levels))}
            fill="none"
            stroke={gridStroke}
            strokeWidth={0.8}
          />
        ))}

        {/* Axis spokes */}
        {abilities.map((_, i) => {
          const pt = polar((360 / n) * i, maxR);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={pt.x}
              y2={pt.y}
              stroke={axisStroke}
              strokeWidth={0.8}
            />
          );
        })}

        {/* Data fill */}
        <path
          d={dataPath}
          fill={accent}
          fillOpacity={0.6}
          stroke={accent}
          strokeWidth={1.5}
          strokeLinejoin="round"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease 600ms",
          }}
        />

        {/* Data dots */}
        {dataPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3}
            fill={accent}
            style={{
              opacity: visible ? 1 : 0,
              transition: `opacity 0.5s ease ${700 + i * 60}ms`,
            }}
          />
        ))}

        {/* Axis labels */}
        {abilities.map((a, i) => {
          const labelR = maxR + 18;
          const pt = polar((360 / n) * i, labelR);
          return (
            <text
              key={i}
              x={pt.x}
              y={pt.y + 4}
              textAnchor="middle"
              fontSize="7.5"
              fill={muted}
              fontFamily="system-ui, sans-serif"
              letterSpacing="0.06em"
              style={{
                opacity: visible ? 1 : 0,
                transition: `opacity 0.6s ease ${500 + i * 50}ms`,
              }}
            >
              {a.label}
            </text>
          );
        })}

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={2.5} fill={accent} opacity={0.5} />
      </svg>
    </div>
  );
}

// ── Lightbox ──────────────────────────────────────────────────────────────────

function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "ArrowRight") onNext();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.93)", backdropFilter: "blur(10px)" }}
      onClick={onClose}
    >
      <img
        src={images[index]}
        alt=""
        className="max-h-[85vh] max-w-[90vw] object-contain"
        style={{ boxShadow: "0 0 80px rgba(0,0,0,0.9)" }}
        onClick={(e) => e.stopPropagation()}
      />

      {/* Counter */}
      <p
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] uppercase"
        style={{ color: "rgba(255,255,255,0.4)" }}
      >
        {index + 1} / {images.length}
      </p>

      {images.length > 1 && (
        <button
          type="button"
          className="absolute left-6 sm:left-10 text-white/50 hover:text-white transition-colors text-4xl leading-none px-3 py-2"
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          aria-label="Previous"
        >
          ←
        </button>
      )}
      {images.length > 1 && (
        <button
          type="button"
          className="absolute right-6 sm:right-10 text-white/50 hover:text-white transition-colors text-4xl leading-none px-3 py-2"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Next"
        >
          →
        </button>
      )}

      <button
        type="button"
        className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors text-xl leading-none w-9 h-9 flex items-center justify-center border border-white/20 hover:border-white/50"
        onClick={onClose}
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function CharacterShowcaseBlock({
  id,
  colorScheme = "red-black",
  characterName,
  codeName,
  subtitle,
  characterImage,
  characterImageAlt,
  statLines = [],
  abilities = [],
  galleryImages = [],
}: CharacterShowcaseBlockProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  // -0.5 (full left) … 0 (center) … 0.5 (full right)
  const [mouseX, setMouseX] = useState(0);

  const theme = THEMES[colorScheme];
  const gallery = galleryImages.slice(0, 4);
  const border = theme.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

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

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMouseX((e.clientX - rect.left) / rect.width - 0.5);
  }, []);

  const handleMouseLeave = useCallback(() => setMouseX(0), []);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(
    () =>
      setLightboxIndex((i) =>
        i == null ? null : (i - 1 + gallery.length) % gallery.length,
      ),
    [gallery.length],
  );
  const nextImage = useCallback(
    () =>
      setLightboxIndex((i) => (i == null ? null : (i + 1) % gallery.length)),
    [gallery.length],
  );

  return (
    <>
      <section
        ref={sectionRef}
        id={id}
        className="snap-start shrink-0 h-dvh relative overflow-hidden select-none"
        style={{ background: theme.bg, color: theme.text }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* ── Diagonal accent slash ── */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={fadeIn(visible, 200)}
        >
          <div
            className="absolute"
            style={{
              top: "-20%",
              right: "28%",
              width: "56%",
              height: "160%",
              background: theme.accent,
              transform: "skewX(-12deg)",
              opacity: theme.isDark ? 0.92 : 0.88,
            }}
          />
        </div>

        {/* ── Grid overlay ── */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${theme.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${theme.gridLine} 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        {/* ── Decorative target rings (top-right) ── */}
        <div
          className="absolute z-10 pointer-events-none"
          style={{ top: "10%", right: "5%", ...fadeIn(visible, 600) }}
        >
          {[84, 58, 34].map((size, i) => (
            <div
              key={size}
              className="absolute rounded-full border"
              style={{
                width: size,
                height: size,
                top: -(size / 2),
                right: -(size / 2),
                borderColor:
                  i === 0 ? `${theme.accent}70` : `${theme.accent}38`,
                borderWidth: i === 2 ? 2 : 1,
              }}
            />
          ))}
          <div
            className="absolute rounded-full"
            style={{
              width: 8,
              height: 8,
              top: -4,
              right: -4,
              background: theme.accent,
            }}
          />
        </div>

        {/* ── Cross decorations ── */}
        <CrossGroup
          style={{ top: "20%", left: "22%", ...fadeIn(visible, 700) }}
          color={theme.crossColor}
          count={4}
        />
        <CrossGroup
          style={{ bottom: "28%", right: "10%", ...fadeIn(visible, 900) }}
          color={theme.isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.14)"}
          count={3}
        />

        {/* ── Scan line ── */}
        <div
          className="absolute left-0 right-0 z-10 pointer-events-none"
          style={{
            top: "50%",
            height: 1,
            background: theme.isDark
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.05)",
          }}
        />

        {/* ── Left panel: stat lines (always top-left) ── */}
        <div
          className="absolute z-30 flex flex-col top-[14%] left-[3%]"
          style={{ width: "22%", minWidth: 168 }}
        >
          <p
            className="text-[9px] tracking-[0.3em] uppercase font-semibold mb-3"
            style={{ color: theme.accent, ...fadeIn(visible, 400) }}
          >
            Ability Stats
          </p>

          {statLines.map((line, i) => (
            <p
              key={i}
              className="text-[10px] leading-snug mb-1.5"
              style={{
                color: theme.muted,
                ...slideLeft(visible, 400 + i * 60),
              }}
            >
              {line}
            </p>
          ))}

          {/* Divider + radar — desktop only (radar moves to bottom-left on mobile) */}
          {statLines.length > 0 && abilities.length > 0 && (
            <div
              className="hidden sm:block w-8 mb-3 mt-2"
              style={{
                height: 1,
                background: theme.accent,
                opacity: 0.5,
                ...fadeIn(visible, 520),
              }}
            />
          )}

          {abilities.length > 0 && (
            <div className="hidden sm:block">
              <RadarChart
                abilities={abilities}
                accent={theme.accent}
                muted={theme.muted}
                isDark={theme.isDark}
                visible={visible}
              />
            </div>
          )}
        </div>

        {/* ── Radar chart — mobile only, bottom-left above gallery ── */}
        {abilities.length > 0 && (
          <div
            className="absolute z-30 block sm:hidden bottom-[84px] left-[3%]"
            style={{ width: "22%", minWidth: 168 }}
          >
            <RadarChart
              abilities={abilities}
              accent={theme.accent}
              muted={theme.muted}
              isDark={theme.isDark}
              visible={visible}
            />
          </div>
        )}

        {/* ── Character image ── */}
        <div
          className="absolute z-20 bottom-0 pointer-events-none"
          style={{
            left: "18%",
            right: "20%",
            height: "100%",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            opacity: visible ? 1 : 0,
            // Inverse parallax: mouse right → character shifts left
            transform: `translateX(${-mouseX * 28}px)`,
            transition:
              "opacity 0.7s ease 100ms, transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        >
          <img
            src={characterImage}
            alt={characterImageAlt ?? ""}
            className="h-[90%] w-auto object-contain object-bottom scale-[1.5] sm:scale-100 origin-bottom"
            style={{ filter: "drop-shadow(0 0 60px rgba(0,0,0,0.7))" }}
          />
        </div>

        {/* ── Ghost vertical name watermark (right) ── */}
        <div
          className="absolute z-10 right-0 top-0 bottom-0 flex items-center justify-end pr-6 pointer-events-none"
          style={{ width: "26%" }}
        >
          <span
            className="font-black leading-none tracking-tighter"
            style={{
              fontSize: "clamp(3.5rem, 8vw, 9rem)",
              color: theme.isDark
                ? "rgba(255,255,255,0.055)"
                : "rgba(0,0,0,0.055)",
              writingMode: "vertical-rl",
              letterSpacing: "-0.04em",
              ...fadeIn(visible, 300),
            }}
          >
            {characterName}
          </span>
        </div>

        {/* ── Name overlay (top-right) ── */}
        <div
          className="absolute z-30 pointer-events-none"
          style={{ top: "10%", right: "5%", textAlign: "right" }}
        >
          {codeName && (
            <p
              className="text-[9px] tracking-[0.35em] uppercase mb-2"
              style={{
                color: theme.isDark
                  ? "rgba(255,255,255,0.4)"
                  : "rgba(0,0,0,0.38)",
                ...fadeIn(visible, 400),
              }}
            >
              {codeName}
            </p>
          )}
          <div style={slideUp(visible, 250)}>
            <span
              className="font-black tracking-tighter leading-none block"
              style={{
                fontSize: "clamp(4rem, 9vw, 10rem)",
                color: theme.text,
                textShadow: `2px 2px 0 ${theme.accent}`,
              }}
            >
              {characterName}
            </span>
          </div>
          {subtitle && (
            <p
              className="text-xs tracking-[0.2em] uppercase mt-2 font-medium"
              style={{ color: theme.accent, ...fadeIn(visible, 500) }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* ── Vertical system text (far right edge) ── */}
        <div
          className="absolute z-20 right-3 top-0 bottom-0 flex items-center pointer-events-none"
          style={fadeIn(visible, 800)}
        >
          <p
            className="text-[8px] tracking-[0.3em] uppercase"
            style={{
              writingMode: "vertical-rl",
              color: theme.isDark
                ? "rgba(255,255,255,0.15)"
                : "rgba(0,0,0,0.15)",
            }}
          >
            SYSTEM&nbsp;ACTIVE&nbsp;•&nbsp;ACTIVATE&nbsp;CHARACTER
          </p>
        </div>

        {/* ── Gallery thumbnails (bottom-right, above tag bar) ── */}
        {gallery.length > 0 && (
          <div
            className="absolute z-30 flex gap-2"
            style={{
              right: "3%",
              bottom: "14px",
              ...slideUp(visible, 750),
            }}
          >
            {gallery.map((src, i) => (
              <button
                key={i}
                type="button"
                aria-label={`View image ${i + 1}`}
                className="relative overflow-hidden border transition-all duration-200 hover:scale-105"
                style={{
                  width: 58,
                  height: 58,
                  borderColor: border,
                  flexShrink: 0,
                }}
                onClick={() => setLightboxIndex(i)}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
                {/* Dim overlay that lifts on hover */}
                <div
                  className="absolute inset-0 transition-opacity duration-200 hover:opacity-0"
                  style={{ background: "rgba(0,0,0,0.28)" }}
                />
              </button>
            ))}
          </div>
        )}

        {/* ── Top accent edge line ── */}
        <div
          className="absolute top-0 left-0 right-0 z-30 pointer-events-none"
          style={{
            height: 2,
            background: `linear-gradient(90deg, transparent 0%, ${theme.accent} 30%, ${theme.accent} 70%, transparent 100%)`,
            ...fadeIn(visible, 200),
          }}
        />
      </section>

      {/* ── Lightbox portal ── */}
      {lightboxIndex !== null && gallery.length > 0 && (
        <Lightbox
          images={gallery}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </>
  );
}

// ── Helper: + cross group ─────────────────────────────────────────────────────

function CrossGroup({
  style,
  color,
  count,
}: {
  style: React.CSSProperties;
  color: string;
  count: number;
}) {
  return (
    <div className="absolute flex items-center gap-2" style={style}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <line x1="6" y1="0" x2="6" y2="12" stroke={color} strokeWidth="1.5" />
          <line x1="0" y1="6" x2="12" y2="6" stroke={color} strokeWidth="1.5" />
        </svg>
      ))}
    </div>
  );
}
