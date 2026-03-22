"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";

interface StoryImageAsideBlockProps {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  body: string;
  image: string;
  imageAlt?: string;
  /** Which side the image sits on */
  imageSide?: "left" | "right";
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

export function StoryImageAsideBlock({
  id,
  eyebrow,
  title,
  subtitle,
  body,
  image,
  imageAlt = "",
  imageSide = "right",
}: StoryImageAsideBlockProps) {
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

  const textCol = (
    <div
      className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12"
      style={fadeUp(visible, 0)}
    >
      {eyebrow && (
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-5">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-tight mb-6 max-w-md">
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-xs tracking-[0.25em] uppercase text-muted-foreground mb-4"
          style={fadeUp(visible, 100)}
        >
          {subtitle}
        </p>
      )}
      <p
        className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-sm"
        style={fadeUp(visible, 200)}
      >
        {body}
      </p>
    </div>
  );

  const imageCol = (
    <div className="relative overflow-hidden" style={fadeIn(visible, 200)}>
      <img
        src={image}
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      className="h-[calc(100vh-3.5rem)] snap-start shrink-0 grid grid-cols-1 sm:grid-cols-2 overflow-hidden"
    >
      {imageSide === "left" ? (
        <>
          {imageCol}
          {textCol}
        </>
      ) : (
        <>
          {textCol}
          {imageCol}
        </>
      )}
    </section>
  );
}
