"use client";

import { useState } from "react";
import { GalleryLightbox } from "@/components/gallery/lightbox";

interface MosaicGalleryItem {
  src: string;
  alt?: string;
}

interface MosaicGalleryBlockProps {
  id?: string;
  /** Expects exactly 3 images: [large, top-right, bottom-right] */
  images: [MosaicGalleryItem, MosaicGalleryItem, MosaicGalleryItem];
  caption?: string;
}

export function MosaicGalleryBlock({
  id,
  images,
  caption,
}: MosaicGalleryBlockProps) {
  const [large, topRight, bottomRight] = images;
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = images.map((img) => ({ src: img.src, alt: img.alt }));

  function openAt(i: number) {
    setIndex(i);
    setOpen(true);
  }

  return (
    <section
      id={id}
      className="h-[calc(100vh-3.5rem)] snap-start shrink-0 grid grid-cols-3 grid-rows-2 overflow-hidden"
    >
      {/* Large image — spans 2 cols, full height */}
      <button
        onClick={() => openAt(0)}
        className="col-span-2 row-span-2 relative overflow-hidden group focus:outline-none"
      >
        <img
          src={large.src}
          alt={large.alt ?? ""}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {caption && (
          <div className="absolute bottom-6 left-6 z-10">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/60">
              {caption}
            </p>
          </div>
        )}
      </button>

      {/* Top-right */}
      <button
        onClick={() => openAt(1)}
        className="relative overflow-hidden group border-l border-b border-background/20 focus:outline-none"
      >
        <img
          src={topRight.src}
          alt={topRight.alt ?? ""}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </button>

      {/* Bottom-right */}
      <button
        onClick={() => openAt(2)}
        className="relative overflow-hidden group border-l border-background/20 focus:outline-none"
      >
        <img
          src={bottomRight.src}
          alt={bottomRight.alt ?? ""}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </button>

      <GalleryLightbox
        open={open}
        index={index}
        slides={slides}
        onClose={() => setOpen(false)}
      />
    </section>
  );
}
