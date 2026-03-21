"use client";

import { useState } from "react";
import { GalleryLightbox } from "@/components/gallery/lightbox";

interface PolaroidItem {
  src: string;
  alt?: string;
  caption?: string;
}

interface PolaroidGalleryBlockProps {
  id?: string;
  /** Expects 3–5 images */
  images: PolaroidItem[];
  label?: string;
}

// Fixed rotations and offsets per slot — deterministic for SSR
const SLOTS = [
  {
    rotate: "-rotate-3",
    translate: "-translate-x-16 -translate-y-4",
    z: "z-10",
  },
  { rotate: "rotate-2", translate: "translate-x-4 translate-y-6", z: "z-20" },
  {
    rotate: "-rotate-1",
    translate: "translate-x-20 -translate-y-2",
    z: "z-10",
  },
  { rotate: "rotate-3", translate: "-translate-x-8 translate-y-2", z: "z-30" },
  { rotate: "-rotate-2", translate: "translate-x-12 translate-y-8", z: "z-10" },
];

export function PolaroidGalleryBlock({
  id,
  images,
  label,
}: PolaroidGalleryBlockProps) {
  const items = images.slice(0, 5);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = items.map((img) => ({
    src: img.src,
    alt: img.alt,
    description: img.caption,
  }));

  function openAt(i: number) {
    setIndex(i);
    setOpen(true);
  }

  return (
    <section
      id={id}
      className="h-[calc(100vh-3.5rem)] snap-start shrink-0 flex flex-col items-center justify-center overflow-hidden bg-background relative select-none"
    >
      {label && (
        <p className="absolute top-10 left-8 text-[10px] tracking-[0.3em] uppercase text-muted-foreground z-50">
          {label}
        </p>
      )}

      <div className="relative flex items-center justify-center w-full h-full">
        {items.map((item, i) => {
          const slot = SLOTS[i % SLOTS.length];
          return (
            <div
              key={i}
              onClick={() => openAt(i)}
              className={[
                "absolute cursor-pointer",
                "bg-white shadow-xl",
                "p-3 pb-10",
                "w-44 sm:w-56",
                slot.rotate,
                slot.translate,
                slot.z,
                "transition-all duration-500 ease-out",
                "hover:rotate-0 hover:translate-x-0 hover:translate-y-0 hover:scale-110 hover:z-50 hover:shadow-2xl",
              ].join(" ")}
            >
              <div className="w-full aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={item.src}
                  alt={item.alt ?? ""}
                  className="w-full h-full object-cover"
                />
              </div>
              {item.caption && (
                <p className="mt-2 text-center text-[10px] text-zinc-500 font-mono tracking-wide truncate">
                  {item.caption}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <GalleryLightbox
        open={open}
        index={index}
        slides={slides}
        onClose={() => setOpen(false)}
      />
    </section>
  );
}
