"use client";

import { useState } from "react";
import { GalleryLightbox } from "@/components/gallery/lightbox";

interface FocusGalleryItem {
  src: string;
  alt?: string;
}

interface FocusGalleryBlockProps {
  id?: string;
  /** First image is the large hero; rest become the thumbnail strip (max 4) */
  images: [FocusGalleryItem, ...FocusGalleryItem[]];
  label?: string;
  title?: string;
}

export function FocusGalleryBlock({
  id,
  images,
  label,
  title,
}: FocusGalleryBlockProps) {
  const [hero, ...thumbnails] = images;
  const thumbs = thumbnails.slice(0, 4);
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
      className="h-[calc(100vh-3.5rem)] snap-start shrink-0 flex overflow-hidden"
    >
      {/* Hero image */}
      <button
        onClick={() => openAt(0)}
        className="relative flex-1 overflow-hidden group focus:outline-none"
      >
        <img
          src={hero.src}
          alt={hero.alt ?? ""}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {(label || title) && (
          <div className="absolute bottom-8 left-8 z-10">
            {label && (
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/60 mb-1">
                {label}
              </p>
            )}
            {title && (
              <p className="text-lg font-black text-white tracking-tight">
                {title}
              </p>
            )}
          </div>
        )}
      </button>

      {/* Thumbnail strip */}
      {thumbs.length > 0 && (
        <div className="w-28 sm:w-36 flex flex-col border-l border-border">
          {thumbs.map((img, i) => (
            <button
              key={i}
              onClick={() => openAt(i + 1)}
              className="relative flex-1 overflow-hidden group border-b border-border last:border-b-0 focus:outline-none"
            >
              <img
                src={img.src}
                alt={img.alt ?? ""}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </button>
          ))}
        </div>
      )}

      <GalleryLightbox
        open={open}
        index={index}
        slides={slides}
        onClose={() => setOpen(false)}
      />
    </section>
  );
}
