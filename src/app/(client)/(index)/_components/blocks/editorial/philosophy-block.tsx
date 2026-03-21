"use client";

import { useEffect, useRef, useState } from "react";
import type React from "react";

export interface PhilosophyItem {
  num: string;
  title: string;
  desc: string;
}

interface PhilosophyBlockProps {
  id?: string;
  label?: string;
  title: string;
  image: string;
  imageLabel?: string;
  items: PhilosophyItem[];
}

function fadeUp(visible: boolean, delay: number): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
  };
}

export function PhilosophyBlock({
  id,
  label = "Philosophy",
  title,
  image,
  imageLabel,
  items,
}: PhilosophyBlockProps) {
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
      className="h-[calc(100vh-3.5rem)] snap-start shrink-0 grid grid-cols-1 sm:grid-cols-2 overflow-hidden"
    >
      <div
        className="relative overflow-hidden hidden sm:block group"
        style={fadeUp(visible, 0)}
      >
        <img
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20" />
        {imageLabel && (
          <div className="absolute bottom-8 left-8 text-white/60">
            <p className="text-[10px] tracking-[0.3em] uppercase">
              {imageLabel}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center px-8 sm:px-14 py-12 overflow-hidden">
        {label && (
          <p
            className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2"
            style={fadeUp(visible, 400)}
          >
            {label}
          </p>
        )}
        <h2
          className="text-3xl sm:text-4xl font-black tracking-tight mb-10"
          style={fadeUp(visible, 0)}
        >
          {title}
        </h2>
        <div className="flex flex-col divide-y divide-border">
          {items.map(({ num, title: itemTitle, desc }, i) => (
            <div
              key={num}
              className="py-6 flex gap-6 items-start hover:translate-x-2 transition-transform duration-300 cursor-default"
              style={fadeUp(visible, 200 + i * 150)}
            >
              <span className="font-mono text-xs text-muted-foreground mt-1 shrink-0">
                {num}
              </span>
              <div>
                <h3 className="text-xl font-black mb-1.5">{itemTitle}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
